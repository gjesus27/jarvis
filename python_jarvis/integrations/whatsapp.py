import pywhatkit as kit
import datetime

class WhatsAppAPI:
    def __init__(self):
        pass

    def send_message(self, number, message, hour=None, minute=None):
        try:
            if not hour or not minute:
                now = datetime.datetime.now()
                hour = now.hour
                minute = now.minute + 2 # Needs a delay for Selenium to open and send
            
            kit.sendwhatmsg(number, message, hour, minute)
            print("Mensagem agendada, chefe.")
        except Exception as e:
            print(f"Ocorreu um erro ao enviar para o WhatsApp, chefe: {e}")

    def send_instant_message(self, number, message):
        try:
            kit.sendwhatmsg_instantly(number, message, 15, True, 4)
            print("Mensagem enviada, chefe.")
        except Exception as e:
            print(f"Erro no envio instantâneo, chefe: {e}")
