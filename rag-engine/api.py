from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from groq import Groq
import os

app = FastAPI()

# GROQ CLIENT
from dotenv import load_dotenv
load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

# EMBEDDINGS
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

# LOAD FAISS
vectorstore = FAISS.load_local(
    "faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = vectorstore.as_retriever(
    search_kwargs={"k": 4}
)

# REQUEST MODEL
class Query(BaseModel):
    query: str

# QUERY ENDPOINT
@app.post("/query")
async def query_rag(q: Query):

    docs = retriever.invoke(q.query)

    context = "\n".join(
        [doc.page_content for doc in docs]
    )

    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "system",
                "content": """
You are a helpful health awareness assistant.

Explain symptoms simply.
Suggest precautions.
Always recommend consulting a doctor.
"""
            },

            {
                "role": "user",
                "content": f"""
Context:
{context}

Question:
{q.query}
"""
            }
        ]
    )

    return {
        "answer": chat.choices[0].message.content
    }

@app.get("/")
def root():
    return {
        "status": "RAG Engine running ✅"
    }