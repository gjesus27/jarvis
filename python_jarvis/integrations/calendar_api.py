import os
import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events']

class CalendarAPI:
    def __init__(self):
        self.creds = self._authenticate()

    def _authenticate(self):
        creds = None
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
                creds = flow.run_local_server(port=0)
            with open('token.json', 'w') as token:
                token.write(creds.to_json())
        return creds

    def get_events(self, calendar_id='primary'):
        try:
            service = build('calendar', 'v3', credentials=self.creds)
            now = datetime.datetime.utcnow().isoformat() + 'Z'
            events_result = service.events().list(calendarId=calendar_id, timeMin=now,
                                                maxResults=10, singleEvents=True,
                                                orderBy='startTime').execute()
            return events_result.get('items', [])
        except HttpError as error:
            print(f"Ocorreu um erro, chefe: {error}")
            return []

    def insert_event(self, event_data, calendar_id='primary'):
        try:
            service = build('calendar', 'v3', credentials=self.creds)
            event = service.events().insert(calendarId=calendar_id, body=event_data).execute()
            print(f"Evento criado, chefe: {event.get('htmlLink')}")
            return event
        except HttpError as error:
            print(f"Ocorreu um erro, chefe: {error}")
            return None
