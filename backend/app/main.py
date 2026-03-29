import fastapi
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.server import (
    add_new_word, 
    send_featured_word, 
    get_upcoming_words, 
    get_word_data, 
    delete_upcoming_word,
    get_past_words,
)
from app.schemas import (
    words_in_upcoming_response, 
    words_in_past_response, 
    lookup_word_response,
    create_word_request,
)

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/words")
def add_word(request: create_word_request):
    return add_new_word(request.word, request.definition, request.part_of_speech)

@app.get("/words/upcoming", response_model=list[words_in_upcoming_response])
def add_word():
    return get_upcoming_words()

@app.get("/words/past", response_model=list[words_in_past_response])
def add_word():
    return get_past_words()

@app.delete("/words/{word_id}")
def delete_word(word_id: int):
    return delete_upcoming_word(word_id)

@app.post("/dictionary/lookup", response_model=lookup_word_response)
def lookup_word(word: str):
    return get_word_data(word)
# delete a word from upcoming

@app.post("/send")
def send_word():
    return send_featured_word()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

