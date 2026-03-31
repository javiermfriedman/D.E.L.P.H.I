endpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/"
import requests

def lookup_word(word: str):
    return requests.get(endpoint + word)