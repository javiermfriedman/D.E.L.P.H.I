from app.supabase_client import (
    get_next_word_from_upcoming,
    add_word_to_upcoming,
    add_word_to_words,
    add_word_to_past,
    remove_word_from_upcoming,
    get_word_by_id,
    get_all_words_from_upcoming,
)
from app.schemas import send_featured_word_response, words_in_upcoming_response
from app.twilio import send_message
from datetime import datetime
from fastapi import HTTPException
# add to word to word table, get the id and add it to upcoming
def add_new_word(word: str, definition: str, part_of_speech: str):
    try:
        response = add_word_to_words(word, definition, part_of_speech)

        word_id = response.data[0]["id"]
        response = add_word_to_upcoming(word_id)
        return "added word successfully"
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
            upcoming_word = words_in_upcoming_response(word=word_data["word"], definition=word_data["definition"], part_of_speech=word_data["part_of_speech"])
            words.append(upcoming_word)
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

