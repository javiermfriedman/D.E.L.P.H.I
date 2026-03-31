from pydantic import BaseModel

class create_word_request(BaseModel):
    word: str
    definition: str
    part_of_speech: str

class add_word_response(BaseModel):
    id: int
    word: str
    definition: str
    part_of_speech: str

class words_in_upcoming_response(BaseModel):
    word_id: int
    word: str
    definition: str
    part_of_speech: str

class words_in_past_response(BaseModel):
    word_id: int
    word: str
    featured_on: str
    definition: str
    part_of_speech: str

class send_featured_word_response(BaseModel):
    sid: str
    message: str

class lookup_word_response(BaseModel):
    word: str
    definition: str | None = None
    part_of_speech: str | None = None

class oracle_word(BaseModel):
    word: str
    definition: str
    part_of_speech: str