import threading
import queue
from voice.recognition import VoiceRecognizer
from voice.synthesis import VoiceSynthesizer
from commands.handler import CommandHandler

class Jarvis:
    def __init__(self):
        self.recognizer = VoiceRecognizer()
        self.synthesizer = VoiceSynthesizer()
        self.handler = CommandHandler(self.synthesizer)
        self.is_running = True
        self.wake_word = "jarvis"

    def startup(self):
        self.synthesizer.speak("Sistemas online, chefe. Em que posso ajudá-lo hoje?")
        self.listen_loop()

    def listen_loop(self):
        print("Jarvis está ouvindo...")
        while self.is_running:
            text = self.recognizer.listen()
            if text:
                print(f"Você disse: {text}")
                if self.wake_word in text.lower():
                    # Remove a palavra de ativação e processa
                    command = text.lower().replace(self.wake_word, "").strip()
                    self.handler.execute(command)

if __name__ == "__main__":
    jarvis = Jarvis()
    jarvis.startup()
