from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

app = FastAPI()

# Load embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

# Load FAISS database
vectorstore = FAISS.load_local(
    "faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)

# Create retriever
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 4}
)

# Input model
class Query(BaseModel):
    query: str

# API endpoint
@app.post("/query")
async def query_rag(q: Query):

    docs = retriever.get_relevant_documents(q.query)

    context = "\n".join(
        [doc.page_content for doc in docs]
    )

    answer = f"""
Based on health data analysis:

{context[:800]}

 This is for awareness only.
Please consult a doctor.
"""

    return {
        "answer": answer,
        "sources": len(docs)
    }

@app.get("/")
def root():
    return {
        "status": "RAG Engine running ✅"
    }