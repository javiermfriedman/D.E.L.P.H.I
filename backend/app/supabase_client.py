import os
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def get_supabase_client():
    try:
        response = (
            supabase.table("planets")
            .select("*")
            .execute()
        )
        return response
    except Exception as error:
        raise Exception(error.message)

def add_word_to_words(word: str, definition: str, part_of_speech: str):

    return (
        supabase.table("words")
        .insert({"word": word, "definition": definition, "part_of_speech": part_of_speech})
        .execute()
    )

def get_word_by_id(word_id: int):
    return (
        supabase.table("words")
        .select("*")
        .eq("id", word_id)
        .execute()
    )


def add_word_to_upcoming(word_id: int):
    return (
        supabase.table("upcoming")
        .insert({"word_id": word_id})
        .execute()
    )

def get_next_word_from_upcoming():
    return (
        supabase.table("upcoming")
        .select("*")
        .order("added_at", desc=False)
        .limit(1)
        .execute()
    )

def get_all_words_from_upcoming():
    return (
        supabase.table("upcoming")
        .select("*")
        .execute()
    )

def get_all_words_from_past():
    return (
        supabase.table("past")
        .select("*")
        .execute()
    )

def remove_word_from_upcoming(word_id: int):

    return (
        supabase.table("upcoming")
        .delete()
        .eq("word_id", word_id)
        .execute()
    )
def add_word_to_past(word_id: int, featured_on: datetime):
    return (
        supabase.table("past")
        .insert({"word_id": word_id, "featured_on": featured_on.isoformat()})
        .execute()
    )