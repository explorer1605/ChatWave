from splitter import splitter
from langchain_core.documents import Document
from transcript_loader import transcript_loader, extract_videoid
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
# import streamlit as st

load_dotenv()
# st.title("Query me Youtube")
# st.text_input("Paste your Youtube URL here:", key="url_input",placeholder="https://www.youtube.com/watch?v=BB2r_eOjsPw",icon="🔥")
embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db",
)
url = input("Enter the YouTube URL: ")  # Prompt user for input
video_id = extract_videoid(url)
result=vector_store.get(where={"file_name": f"{video_id}.txt"})
top_res=3
if len(result["ids"]) ==0:
    transcipts = transcript_loader(url)
    texts = splitter(transcipts)

    docs = [
        Document(page_content=chunk, metadata={"file_name": f"{video_id}.txt"})
        for chunk in texts
    ]
    video_length=len(docs)
      #approx 1 min per chunk
    top_res=3
    if(video_length>20):
        top_res=5
    # Generate the IDs list using the same index
    ids = [f"{video_id}.txt_{i}" for i in range(len(docs))]

    #  Pass the IDs into the add_documents function
    vector_store.add_documents(documents=docs, ids=ids)
# prompt creation
chat_history=[]
prompt = ChatPromptTemplate([
    (
        "system",
        "You are a helpful assistant that helps to answer the question based on the provided context.",
    ),
    (
        "system",
        "Do not hallucinate any information.Wherever enough information is not available,just state that the information is not available.Do not try to create any information on your own",
    ),
    ("human", "Context: {context}\n Question: {question}"),
    (
        "system",
        "Use Chat History for full context:\n {chat_history}"
    )
]
)

while True:
    query = input("\nAsk your question (type 'exit' to quit):")
    if query.lower() == "exit":
        break
  
    results = vector_store.similarity_search_with_score(
        query, k=top_res*3  # Get more results to filter manually
    )
    print(f"DEBUG: Similarity search returned {len(results)} results (before filter)")
    # Filter manually by video_id
    results = [(doc, score) for doc, score in results if doc.metadata.get("file_name") == f"{video_id}.txt"]
    print(f"DEBUG: After filtering: {len(results)} results")
    if results:
        print(f"DEBUG: First result metadata: {results[0][0].metadata}")
    chat_history.append(("User", query))
    threshold = 0.4  
    similar_docs = [doc for doc,score in results if score > threshold]
    print(f"DEBUG: Scores - {[(score) for doc, score in results]}")
    print(f"DEBUG: Passed threshold: {len(similar_docs)} docs")
    if len(similar_docs)==0:
        print("Please rephrase your question or ask something else")
        continue
    content = ""
    for doc in similar_docs:
        content += doc.page_content + "\n"
    chain = prompt | llm
    msg =chain.invoke(
        {
            "context": content,
            "question": query,
            "chat_history": chat_history
        }
    )
    print("\nAnswer:", msg.content,"\n")
    chat_history.append(("AI", msg.content))
    if(len(chat_history)>15):
        print("Summarizing chat history to maintain context...")
        summarized_history=llm.invoke(f"summarize the chatHistory in 3 lines retaining all the important details under 'details' keyword at start {chat_history}")
        chat_history.clear()
        chat_history.append(("system", f"summarized: \n{summarized_history.content}"))
#add chat history and UI

