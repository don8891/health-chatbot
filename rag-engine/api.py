from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import FastEmbedEmbeddings
from groq import Groq
from dotenv import load_dotenv
import os
import base64

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# ✅ CONVERSATIONAL SYSTEM PROMPT
SYSTEM_PROMPT = """You are HealthBeacon, a friendly and knowledgeable health companion. You talk like a caring, smart friend who happens to know a lot about health and medicine — warm, clear, and natural. No rigid sections, no headers, no bullet-point templates.

SCOPE — HEALTH ONLY:
- You ONLY answer questions related to health, medicine, symptoms, diseases, nutrition, fitness, mental health, medications, or wellness.
- If someone asks about anything unrelated to health (e.g. tech, finance, cooking, sports, politics, general knowledge), reply with exactly: "I'm only able to help with health-related questions. I don't know about this topic."
- Do not engage with off-topic questions even partially.

HOW TO RESPOND:
- Talk naturally like a conversation. No headers, no emoji section titles, no rigid structure.
- Be warm, empathetic, and easy to understand. Imagine you are a knowledgeable friend explaining things over a cup of tea.
- Use simple everyday language. If a medical term is unavoidable, explain it immediately in plain words.
- Keep responses focused and concise — don't dump every possible fact. Answer what was actually asked.
- If you don't have enough information, ask a short, natural follow-up question.
- Never say "You definitely have X disease". Say things like "this sounds like it could be...", "it might be worth checking if...", "one common reason for this is...".
- When it makes sense, mention when someone should see a real doctor — but say it naturally, not as a footer.

EMERGENCY SITUATIONS:
- If someone mentions chest pain, difficulty breathing, stroke symptoms, severe bleeding, loss of consciousness, seizures, suicidal thoughts, or severe allergic reaction — stop everything and say clearly: "🚨 This sounds serious. Please call emergency services or go to the nearest hospital right away. Don't wait."

TONE:
- Friendly and human, never robotic.
- Reassuring but honest.
- Never alarming, never dismissive.

MEDICAL CONTEXT:
You will be given relevant medical reference information. Use it to ground your answers, but translate it into natural conversation — don't copy technical text directly."""

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
    language: str = "english"

class ImageQuery(BaseModel):
    imageBase64: str
    mimeType: str = "image/jpeg"
    message: Optional[str] = "Please analyze this image and provide health information."
    language: str = "english"

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

    system_prompt = SYSTEM_PROMPT
    if q.language.lower() == "malayalam":
        system_prompt += "\n\nCRITICAL INSTRUCTION: You MUST respond entirely in the Malayalam language. Translate your entire response to Malayalam before outputting. Even if the user asks in English, respond in Malayalam."

    # Step 3: Send to Groq LLM with your system prompt
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": f"""Medical Reference Context (use this to inform your answer, but respond conversationally):
{context}

User message: {q.query}"""
                }
            ],
            temperature=0.65,     # warmer = more natural conversational tone
            max_tokens=800,
        )

        answer = response.choices[0].message.content
        return {"answer": answer, "sources": len(docs)}

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        # Conversational fallback
        return {
            "answer": "Sorry, I'm having a bit of trouble connecting right now. Could you try sending your message again in a moment? I'm here to help!",
            "sources": 0
        }

@app.post("/analyze-image")
async def analyze_image(q: ImageQuery):
    IMAGE_SYSTEM_PROMPT = """You are HealthBeacon, a friendly AI health companion with the ability to analyze medical images.

When analyzing an image:
- Describe what you observe in the image clearly and naturally
- If it appears to be a skin condition (rash, wound, discoloration), describe the visual characteristics
- If it appears to be a medication, supplement, or medical device, describe what you see
- Provide possible health-related context or information based on what you see
- Always recommend consulting a qualified healthcare professional for any diagnosis
- If it is clearly NOT health-related, politely say you can only assist with health-related images

SCOPE: Only provide health-relevant analysis. If this is a food photo, focus on nutrition. If it's a wound or skin issue, describe the visual presentation. If it's a pill or medication, describe the appearance.

IMPORTANT: Never claim to definitively diagnose. Say "this looks like it could be...", "this appears to show...", etc.

EMERGENCY: If the image shows severe bleeding, deep wounds, severe burns, or other emergencies, immediately state: "🚨 This looks like it may require immediate medical attention. Please go to the nearest emergency room or call emergency services right away."
"""

    user_message = q.message or "Please analyze this image and provide health information."

    if q.language.lower() == "malayalam":
        IMAGE_SYSTEM_PROMPT += "\n\nCRITICAL INSTRUCTION: You MUST respond entirely in the Malayalam language."

    try:
        data_url = f"data:{q.mimeType};base64,{q.imageBase64}"

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": IMAGE_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": user_message
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            temperature=0.5,
            max_tokens=800,
        )

        answer = response.choices[0].message.content
        return {"answer": answer, "type": "image_analysis"}

    except Exception as e:
        print(f"Error in image analysis: {e}")
        return {
            "answer": "I had trouble analyzing that image. Could you try again or describe what you're seeing in text? I'm here to help!",
            "type": "image_analysis"
        }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "HealthBeacon RAG API"
    }

@app.get("/")
def root():
    return {"status": "RAG Engine running ✅", "model": "llama-3.3-70b-versatile"}