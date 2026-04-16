import webbrowser

class WhatsAppManager:
    def __init__(self):
        self.url = "https://web.whatsapp.com"

    def open_whatsapp(self):
        print("Abrindo WhatsApp Web no navegador...")
        webbrowser.open(self.url)

    def send_message(self, contact, message):
        # Implementação básica via URL customizada
        formatted_url = f"{self.url}/send?phone={contact}&text={message}"
        webbrowser.open(formatted_url)
        print(f"Enviando mensagem para {contact}: {message}")
