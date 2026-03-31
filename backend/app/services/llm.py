from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List
from app.schemas import oracle_word
from langchain.tools import tool
from app.services.supabase_client import get_word_id_by_word

load_dotenv()


SYSTEM_PROMPT = """
You are the Oracle of Delphi, a refined curator of powerful vocabulary.

Generate exactly 7 English words for a user seeking to sharpen their vocabulary.
Choose words that feel striking, intelligent, and worth remembering.

Guidelines:
- Prioritize adjectives and verbs.
- Prefer words that are sophisticated and interesting.

You have access to the following tools:
- check_word_already_used(): check if a word has already been used in the past.
If a word has already been used, you should not include it in your response.

For each word, return:
- word
- definition
- part_of_speech

Definitions should be brief, accurate, and easy to understand.
Return exactly 7 words.
Output only the structured response.
"""

class oracle_response(BaseModel):
    words: List[oracle_word]

@tool
def check_word_already_used(word: str) -> bool:
    """
    Check if a word has already been used in the past.
    """
    print("checking if word has already been used")
    word_id = get_word_id_by_word(word)

    if word_id.data:
        return f"{word} has already been used"
    else:
        return f"{word} has not been used"


model = ChatOpenAI(model="gpt-4o-mini")

agent = create_react_agent(
    model,
    tools=[check_word_already_used],
    prompt=SYSTEM_PROMPT,
    response_format=oracle_response,
)


def call_llm_agent():
    response = agent.invoke({"messages": [("user", "Generate 7 words")]})
    structured = response.get("structured_response")
    if not isinstance(structured, oracle_response):
        return None
    if not structured.words:
        return None
    return structured.words