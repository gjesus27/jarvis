class CalendarManager:
    def __init__(self):
        # Aqui seriam configuradas as credenciais da Google API
        self.events = [
            {"summary": "Reunião de Equipe", "start": "14:00"},
            {"summary": "Almoço com Chefe", "start": "12:30"},
            {"summary": "Lançamento do Jarvis", "start": "10:00"}
        ]

    def get_upcoming_events(self):
        # Em uma implementação real, chamaria a Google Calendar API
        print("Buscando eventos no Google Agenda...")
        return self.events
