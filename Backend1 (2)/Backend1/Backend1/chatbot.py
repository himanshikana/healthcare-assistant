import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_chatbot_response(user_query: str) -> str:
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_query}]
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error generating response: {str(e)}"