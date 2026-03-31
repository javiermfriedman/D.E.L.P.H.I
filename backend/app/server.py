from app.services.supabase_client import (
    get_next_word_from_upcoming,
    add_word_to_upcoming,
    add_word_to_words,
    add_word_to_past,
    remove_word_from_upcoming,
    get_word_by_id,
    get_all_words_from_upcoming,
    get_all_words_from_past,
)
from app.schemas import send_featured_word_response, words_in_upcoming_response, oracle_word, add_word_response
from app.services.twilio import send_message
from app.services.llm import call_llm_agent
from datetime import datetime
from fastapi import HTTPException
from app.services.dictionary import lookup_word
from app.schemas import lookup_word_response, words_in_past_response
import openai
import os
# add to word to word table, get the id and add it to upcoming
def add_new_word(word: str, definition: str, part_of_speech: str):
    try:
        response = add_word_to_words(word, definition, part_of_speech)

        word_id = response.data[0]["id"]
        response = add_word_to_upcoming(word_id)
        return add_word_response(id=word_id, word=word, definition=definition, part_of_speech=part_of_speech)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def delete_upcoming_word(word_id: int):
    try:
        remove_word_from_upcoming(word_id)
        return "word deleted successfully"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# get all words in upcoming queue, add to list, and return list
def get_upcoming_words():
    upcoming_words = get_all_words_from_upcoming()
    if not upcoming_words.data:
        raise HTTPException(status_code=404, detail="No words in upcoming queue")
    upcoming_words_list = upcoming_words.data

    words = []
    for word in upcoming_words_list:
        word_id = word["word_id"]
        try:
            word_response = get_word_by_id(word_id)
            word_data = word_response.data[0]
            upcoming_word = words_in_upcoming_response(word_id=word_id, word=word_data["word"], definition=word_data["definition"], part_of_speech=word_data["part_of_speech"])
            words.append(upcoming_word)
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))
        
    return words

def get_past_words():
    print("get_past_words")
    past_words = get_all_words_from_past()
    if not past_words.data:
        raise HTTPException(status_code=404, detail="No words in past queue")
    past_words_list = past_words.data
    print(past_words_list)
    words = []
    for word in past_words_list:
        word_id = word["word_id"]
        try:
            word_response = get_word_by_id(word_id)
            word_data = word_response.data[0]
            print("test1")
            past_word = words_in_past_response(word_id=word_id, word=word_data["word"], featured_on=word["featured_on"], definition=word_data["definition"], part_of_speech=word_data["part_of_speech"])
            print("past_word", past_word)
            words.append(past_word)
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))
    
    return words


def send_featured_word():
    next_word = get_next_word_from_upcoming()
    if not next_word.data:
        raise HTTPException(status_code=404, detail="No words in upcoming queue")
    word_id = next_word.data[0]["word_id"]
    try:
        add_word_to_past(word_id, datetime.now())
        remove_word_from_upcoming(word_id)
        word_response = get_word_by_id(word_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    word_data = word_response.data[0]
    word_string = word_data["word"]
    definition = word_data["definition"]
    part_of_speech = word_data["part_of_speech"]
    message = f"Word: {word_string}\nDefinition: {definition}\nPart of Speech: {part_of_speech}"

    sid = send_message(message)
    return send_featured_word_response(sid=sid, message=message)

def get_word_data(word: str):
    try:
        response = lookup_word(word)
        data = response.json()

        if not isinstance(data, list) or len(data) == 0:
            return lookup_word_response(word=word, definition=None, part_of_speech=None)

        entry = data[0]
        meaning = entry["meanings"][0]

        return lookup_word_response(
            word=entry["word"],
            definition=meaning["definitions"][0]["definition"],
            part_of_speech=meaning["partOfSpeech"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def invoke_oracle():
    print("invoking oracle")
    response = call_llm_agent()
    if response is None:
        raise HTTPException(status_code=500, detail="Failed to call LLM agent")
    
    added_words = []
    for word in response:
        if not isinstance(word, oracle_word):
            raise HTTPException(status_code=500, detail="LLM agent provided wrong type")
        print("adding word: ", word)
        result = add_new_word(word.word, word.definition, word.part_of_speech)
        added_words.append(result)
    return added_words
