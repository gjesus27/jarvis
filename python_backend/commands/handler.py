import os
import webbrowser
from integrations.google_calendar import CalendarManager
from integrations.whatsapp import WhatsAppManager

class CommandHandler:
    def __init__(self, synthesizer):
        self.synthesizer = synthesizer
        self.calendar = CalendarManager()
        self.whatsapp = WhatsAppManager()

    def execute(self, text):
        print(f"Processando comando: {text}")

        if "agenda" in text or "compromisso" in text:
            events = self.calendar.get_upcoming_events()
            if events:
                self.synthesizer.speak(f"Chefe, você tem {len(events)} compromissos para hoje.")
                for event in events:
                    self.synthesizer.speak(f"{event['summary']} às {event['start']}")
            else:
                self.synthesizer.speak("Chefe, você não tem compromissos agendados para hoje.")

        elif "whatsapp" in text or "mensagem" in text:
            self.synthesizer.speak("Abrindo o WhatsApp, chefe. Para quem deseja enviar a mensagem?")
            self.whatsapp.open_whatsapp()

        elif "abrir" in text:
            program = text.replace("abrir", "").strip()
            self.synthesizer.speak(f"Abrindo {program}, chefe.")
            # Simulação de abertura (no Windows usaria start, no Mac open)
            os.system(f"start {program}")

        elif "horas" in text or "tempo" in text:
            from datetime import datetime
            now = datetime.now().strftime("%H:%M")
            self.synthesizer.speak(f"São exatamente {now}, chefe.")

        elif "olá" in text or "bom dia" in text:
            self.synthesizer.speak("Olá, chefe. Estou à sua disposição.")

        else:
            self.synthesizer.speak("Comando recebido, chefe. Estou processando a solicitação.")
