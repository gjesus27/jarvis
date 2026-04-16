import pyttsx3

class VoiceSynthesizer:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)
        self.engine.setProperty('volume', 1)
        self.voices = self.engine.getProperty('voices')
        
        # Tentativa de encontrar uma voz masculina em PT-BR
        for voice in self.voices:
            if "brazil" in voice.name.lower() or "portugal" in voice.name.lower():
                self.engine.setProperty('voice', voice.id)
                break

    def speak(self, text):
        print(f"Jarvis: {text}")
        self.engine.say(text)
        self.engine.runAndWait()
