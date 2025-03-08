from gtts import gTTS
import os

def text_to_speech(text: str, filename: str = "response.mp3"):
    try:
        tts = gTTS(text)
        tts.save(filename)
        print(f"Audio saved as {filename}")
        if os.name == "nt":  # Windows
            os.system(f"start {filename}")
        elif os.name == "posix":  # macOS or Linux
            os.system(f"open {filename}" if os.uname().sysname == "Darwin" else f"xdg-open {filename}")
        else:
            print("Unsupported operating system for audio playback")
    except Exception as e:
        print(f"Error in text-to-speech conversion: {e}")