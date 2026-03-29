from pydantic import BaseModel

class create_word_request(BaseModel):
    word: str
    definition: str
    part_of_speech: str

class words_in_upcoming_response(BaseModel):
    word: str
    definition: str
    part_of_speech: str

class send_featured_word_response(BaseModel):
    sid: str
    message: str