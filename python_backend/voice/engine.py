import speech_recognition as sr
import pyttsx3
import time

class VoiceEngine:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 170)  # Jarvis speed
        self.engine.setProperty('volume', 1.0)
        self.recognizer = sr.Recognizer()
        self.mic = sr.Microphone()

    def speak(self, text):
        print(f"Jarvis: {text}")
        self.engine.say(text)
        self.engine.runAndWait()

    def listen(self):
        with self.mic as source:
            print("Escutando, chefe...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)
        try:
            query = self.recognizer.recognize_google(audio, language="pt-BR")
            print(f"User: {query}")
            return query
        except sr.UnknownValueError:
            return None
        except sr.RequestError:
            self.speak("Chefe, estou com problemas técnicos na rede.")
            return None
