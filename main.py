from typing import Dict, List, Tuple

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from pydantic import BaseModel

from splitter import splitter
from transcript_loader import extract_videoid, transcript_loader

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db",
)

prompt = ChatPromptTemplate(
    [
        (
            "system",
            "You are a helpful assistant that helps to answer the question based on the provided context.",
        ),
        (
            "system",
            "Do not hallucinate any information.Wherever enough information is not available,just state that the information is not available.Do not try to create any information on your own",
        ),
        ("human", "Context: {context}\n Question: {question}"),
        ("system", "Use Chat History for full context:\n {chat_history}"),
    ]
)

video_sessions: Dict[str, Dict[str, object]] = {}

app = FastAPI(title="YouTube Chatbot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProcessVideoRequest(BaseModel):
    url: str


class ChatRequest(BaseModel):
    video_id: str
    question: str


def process_video(url: str) -> str:
    video_id = extract_videoid(url)
    result = vector_store.get(where={"file_name": f"{video_id}.txt"})
    top_res = 3

    if len(result["ids"]) == 0:
        transcipts = transcript_loader(url)
        texts = splitter(transcipts)

        docs = [
            Document(page_content=chunk, metadata={"file_name": f"{video_id}.txt"})
            for chunk in texts
        ]
        video_length = len(docs)
        if video_length > 20:
            top_res = 10
        ids = [f"{video_id}.txt_{i}" for i in range(len(docs))]
        vector_store.add_documents(documents=docs, ids=ids)

    video_sessions[video_id] = {"top_res": top_res, "chat_history": []}
    return video_id


def ask_question(video_id: str, query: str) -> str:
    session = video_sessions.get(video_id)
    if not session:
        existing = vector_store.get(where={"file_name": f"{video_id}.txt"})
        if len(existing["ids"]) == 0:
            raise HTTPException(status_code=400, detail="Video not processed yet.")
        session = {"top_res": 3, "chat_history": []}
        video_sessions[video_id] = session

    top_res = int(session["top_res"])
    chat_history: List[Tuple[str, str]] = session["chat_history"]  # type: ignore[assignment]

    results = vector_store.similarity_search_with_score(query, k=top_res * 3)
    results = [
        (doc, score)
        for doc, score in results
        if doc.metadata.get("file_name") == f"{video_id}.txt"
    ]

    chat_history.append(("User", query))
    threshold = 0.4
    similar_docs = [doc for doc, score in results if score > threshold]
    if len(similar_docs) == 0:
        return "Please rephrase your question or ask something else"

    content = ""
    for doc in similar_docs:
        content += doc.page_content + "\n"

    chain = prompt | llm
    msg = chain.invoke(
        {"context": content, "question": query, "chat_history": chat_history}
    )
    answer = msg.content
    chat_history.append(("AI", answer))

    if len(chat_history) > 15:
        summarized_history = llm.invoke(
            "summarize the chatHistory in 3 lines retaining all the important details under 'details' keyword at start "
            f"{chat_history}"
        )
        chat_history.clear()
        chat_history.append(("system", f"summarized: \n{summarized_history.content}"))

    return answer


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/process-video")
def process_video_endpoint(payload: ProcessVideoRequest):
    try:
        video_id = process_video(payload.url)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "videoId": video_id,
        "videoTitle": f"Video {video_id}",
        "message": "Hello! I've processed the video. What would you like to know?",
    }


@app.post("/api/chat")
def chat_endpoint(payload: ChatRequest):
    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    try:
        answer = ask_question(payload.video_id, payload.question)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return {"answer": answer}


if __name__ == "__main__":
    url = input("Enter the YouTube URL: ")
    video_id = process_video(url)
    while True:
        query = input("\nAsk your question (type 'exit' to quit):")
        if query.lower() == "exit":
            break
        print("\nAnswer:", ask_question(video_id, query), "\n")
