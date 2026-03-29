from app.server import add_new_word

def test_add_new_word_success():
    response = add_new_word("word", "definition", "part_of_speech")
    assert response["message"] == "Word added successfully"

def test_add_new_word_failure():
    response = add_new_word("word", "definition", "part_of_speech")
    assert response["message"] == "Failed to add word"

def test_add_new_word_upcoming_failure():
    response = add_new_word("word", "definition", "part_of_speech")
    assert response["message"] == "Failed to add word to upcoming"

if __name__ == "__main__":
    add_new_word("galaxy", "a group of stars", "noun")