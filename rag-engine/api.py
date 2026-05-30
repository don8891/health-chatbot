from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import FastEmbedEmbeddings
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# ✅ YOUR SYSTEM PROMPT — paste it exactly here
SYSTEM_PROMPT = """You are HealthGuide AI, a health awareness and symptom-triage assistant.

IMPORTANT RULES:

ROLE:
- Provide educational health information only.
- Never claim to diagnose diseases.
- Never present medical conditions as facts.
- Present information as possibilities that require professional evaluation.

SAFETY FIRST:
- Every response must begin with:
"⚠️ Medical Disclaimer: I can provide general health information, but I cannot diagnose conditions or replace professional medical advice."

EMERGENCY SCREENING:
Before answering, check if the user mentions any emergency symptoms, including:
- Chest pain
- Severe shortness of breath
- Difficulty breathing
- Sudden numbness or weakness
- Stroke symptoms
- Loss of consciousness
- Severe bleeding
- Seizures
- Suicidal thoughts
- Severe allergic reaction

If any emergency symptom appears:
- STOP normal analysis.
- Respond:
"🚨 This may require immediate medical attention. Please contact emergency services or go to the nearest emergency department immediately."
- Do not continue with possible causes.

COMMUNICATION STYLE:
- Use simple language suitable for an 8th-grade reading level.
- Avoid medical jargon whenever possible.
- If jargon is necessary, explain it in plain language.
- Be empathetic, calm, and reassuring.
- Never use alarming language.

RESPONSE FORMAT:

⚠️ Medical Disclaimer: I can provide general health information, but I cannot diagnose conditions or replace professional medical advice.

📌 What Your Symptoms Could Mean
- Explain possibilities only.
- Never say "You have X".
- Say "One possibility is..."

❓ Follow-Up Questions
Ask 2-4 relevant questions if information is incomplete.

🩺 Possible Causes To Discuss With A Doctor
- Cause 1
- Cause 2
- Cause 3

✅ Self-Care Suggestions
- Practical and safe suggestions

👨‍⚕️ When To See A Doctor
- Explain warning signs
- Explain when professional evaluation is recommended

🔒 Privacy Reminder
Do not share personal identifiers such as:
- Social security numbers
- Insurance details
- Full address
- Financial information

EVIDENCE REQUIREMENTS:
- Use only information supported by the provided medical context.
- If information is insufficient, say so.
- Never invent symptoms, treatments, or diagnoses.

RAG CONTEXT:
Use the provided retrieved medical context as reference material only.
Convert technical medical information into plain language."""

# Load FAISS index
embeddings = FastEmbedEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.load_local(
    "faiss_index", 
    embeddings, 
    allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

class Query(BaseModel):
    query: str

EMERGENCY_KEYWORDS = [
    "chest pain",
    "difficulty breathing",
    "shortness of breath",
    "stroke",
    "seizure",
    "unconscious",
    "severe bleeding",
    "suicidal",
    "heart attack",
    "numbness or weakness",
    "allergic reaction",
    "loss of consciousness"
]

@app.post("/query")
async def query_rag(q: Query):
    # Step 1: Pre-LLM Emergency Screening (deterministic keyword check)
    query_lower = q.query.lower()
    if any(keyword in query_lower for keyword in EMERGENCY_KEYWORDS):
        return {
            "answer": """⚠️ Medical Disclaimer: I can provide general health information, but I cannot diagnose conditions or replace professional medical advice.

🚨 EMERGENCY WARNING

Your symptoms may indicate a medical emergency.

Please call emergency services or go to the nearest emergency department immediately.

⚠️ I cannot safely assess emergency symptoms online.""",
            "sources": 0
        }

    # Step 2: Get relevant data from your Excel datasets
    docs = retriever.invoke(q.query)
    context = "\n".join([doc.page_content for doc in docs])

    # Step 3: Send to Groq LLM with your system prompt
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
                    "content": f"""Medical Context:
{context}

User Symptoms:
{q.query}

Provide a health-awareness response using the required format."""
                }
            ],
            temperature=0.4,      # lower = more consistent, focused answers
            max_tokens=800,
        )

        answer = response.choices[0].message.content
        return {"answer": answer, "sources": len(docs)}

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        # Safe Fallback starting with Medical Disclaimer
        return {
            "answer": f"""⚠️ Medical Disclaimer: I can provide general health information, but I cannot diagnose conditions or replace professional medical advice.

📌 What Your Symptoms Could Mean
- One possibility is that the system experienced a temporary connection issue.
- Your query: **{q.query}**

🩺 Possible Causes To Discuss With A Doctor
- System or API connection issues.

✅ Self-Care Suggestions
- Please try sending your query again in a moment.

👨‍⚕️ When To See A Doctor
- **Always consult a qualified doctor** for proper diagnosis.
- If you are experiencing warning signs, seek professional medical evaluation immediately.

🔒 Privacy Reminder
Do not share personal identifiers like social security numbers, insurance details, or financial info.""",
            "sources": len(docs)
        }

@app.get("/")
def root():
    return {"status": "RAG Engine running ✅", "model": "llama-3.3-70b-versatile"}