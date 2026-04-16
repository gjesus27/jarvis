import os
import sys
import threading
from python_backend.voice.engine import VoiceEngine
from commands.handler import CommandHandler

class Jarvis:
    def __init__(self):
        self.name = "Jarvis"
        self.user_title = "chefe"
        self.voice = VoiceEngine()
        self.handler = CommandHandler(self.voice)
        self.is_listening = True

    def start_up(self):
        self.voice.speak(f"Bom dia, {self.user_title}. Sistemas online. Como posso ajudar?")
        self.listen_loop()

    def listen_loop(self):
        while self.is_listening:
            try:
                command = self.voice.listen()
                if command:
                    if self.name.lower() in command.lower():
                        clean_command = command.lower().replace(self.name.lower(), "").strip()
                        self.handler.process(clean_command)
            except KeyboardInterrupt:
                self.voice.speak(f"Desligando, {self.user_title}. Até logo.")
                break

if __name__ == "__main__":
    jarvis = Jarvis()
    jarvis.start_up()
