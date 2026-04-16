import os
import webbrowser
import datetime
from integrations.calendar_api import CalendarAPI
from integrations.whatsapp import WhatsAppAPI

class CommandHandler:
    def __init__(self, voice):
        self.voice = voice
        self.calendar = CalendarAPI()
        self.whatsapp = WhatsAppAPI()

    def process(self, command):
        command = command.lower()
        
        # Greetings
        if "como você está" in command:
            self.voice.speak("Estou operando a 100%, chefe. Obrigado por perguntar.")
            
        # File System (Simulated Logic)
        elif "abrir arquivo" in command:
            self.voice.speak("Qual arquivo deseja abrir, chefe?")
            # os.system(f'open "{file_name}"')
            
        # Apps
        elif "abrir navegador" in command:
            self.voice.speak("Abrindo o navegador, chefe.")
            webbrowser.open("https://www.google.com")
            
        # Calendar
        elif "agenda" in command or "calendário" in command:
            self.voice.speak("Buscando seus compromissos, chefe.")
            events = self.calendar.get_events()
            if not events:
                self.voice.speak("Chefe, você não tem compromissos para hoje.")
            else:
                self.voice.speak(f"Chefe, você tem {len(events)} compromissos.")
                for event in events:
                    self.voice.speak(f"Compromisso: {event['summary']} às {event['start']['dateTime']}")
                    
        # WhatsApp
        elif "mandar mensagem" in command or "whatsapp" in command:
            self.voice.speak("Para quem deseja enviar a mensagem, chefe?")
            # self.whatsapp.send_message(recipient, message)
            
        # Time
        elif "que horas são" in command or "hora" in command:
            now = datetime.datetime.now().strftime("%H:%M")
            self.voice.speak(f"Agora são {now}, chefe.")
            
        else:
            self.voice.speak("Desculpe chefe, ainda não aprendi a fazer isso.")
