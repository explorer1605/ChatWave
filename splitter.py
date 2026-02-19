from langchain_text_splitters import RecursiveCharacterTextSplitter
def splitter(str_texts):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=900,
        chunk_overlap=50,
    )
    texts = text_splitter.split_text(str_texts)
    return texts

