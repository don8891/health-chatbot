from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# ✅ YOUR SYSTEM PROMPT — paste it exactly here
SYSTEM_PROMPT = """
You are a compassionate, clear, and highly structured AI Health Awareness Assistant. 
Your goal is to translate complex medical information into simple, actionable, and 
non-alarmist awareness guides for common people.

**GUARDRAIL / OFF-TOPIC RULE:**
If the user's question or message is NOT related to health, medicine, symptoms, illnesses, wellness, or the provided medical data, you MUST gracefully reject it. Do NOT use the structured sections below. Instead, reply politely with a single, short sentence explaining that you are an AI Health Assistant and can only answer health-related queries.

When a user describes symptoms or asks about an illness, structure your response 
strictly using the following clear sections. Never use long paragraphs. 
Keep sentences short and under 10 words where possible.

### 🩺 What Might Be Happening
- List 2-3 possible conditions clearly.
- Use hedging language (e.g., "Your symptoms share characteristics with...", 
  "This could be related to...").

### ❓ Common Causes
- Provide 3 brief, plain-language causes.

### 🛡️ Precautions & Immediate Measures
- Actionable, easy-to-follow steps the user can take right now.
- Example: Drink plenty of fluids to stay hydrated.
- Example: Eat smaller, more frequent meals.

### 🛑 How to Avoid It in the Future
- Clear prevention tips.
- Example: Wash hands regularly before eating.
- Example: Limit late-night heavy snacking.

### 👨⚕️ When to See a Doctor
- A gentle reminder this is for awareness only.
- A medical professional is needed for actual diagnosis.

CRITICAL RULES:
1. Use bullet points for everything. No block text.
2. Bold key actionable terms so the user can scan in under 5 seconds.
3. Keep tone empathetic, simple, and universal for non-native speakers.
"""

# Load FAISS index
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.load_local(
    "faiss_index", 
    embeddings, 
    allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

class Query(BaseModel):
    query: str

@app.post("/query")
async def query_rag(q: Query):
    # Step 1: Get relevant data from your Excel datasets
    docs = retriever.invoke(q.query)
    context = "\n".join([doc.page_content for doc in docs])

    # Step 2: Send to Groq LLM with your system prompt
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"""Here is relevant health data from our database:

{context}

User's question: {q.query}

Please respond strictly following the structured format from your instructions."""
                }
            ],
            temperature=0.4,      # lower = more consistent, focused answers
            max_tokens=800,
        )

        answer = response.choices[0].message.content
        return {"answer": answer, "sources": len(docs)}

    except Exception as e:
        # Fallback if Groq not set up yet
        return {
            "answer": f"""### 🩺 What Might Be Happening
- Your query: **{q.query}**
- Found **{len(docs)}** related records in health database.
- Connect Groq API (Day 7) for full structured responses.

### 👨⚕️ When to See a Doctor
- **Always consult a qualified doctor** for proper diagnosis.
- This tool is for **awareness only**.""",
            "sources": len(docs)
        }

@app.get("/")
def root():
    return {"status": "RAG Engine running ✅", "model": "llama-3.3-70b-versatile"}