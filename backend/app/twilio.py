from twilio.rest import Client
from dotenv import load_dotenv
import os
from fastapi import HTTPException

load_dotenv()

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
to_number = os.getenv("TO_NUMBER")
from_number = os.getenv("FROM_NUMBER")
client = Client(account_sid, auth_token)

def send_message(message: str):
    try:
        message = client.messages.create(
            from_=f'whatsapp:{from_number}',
            body=message,
            to=f'whatsapp:{to_number}',
        )
        return message.sid
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

