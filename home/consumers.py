from channels.generic.websocket import AsyncJsonWebsocketConsumer
from google_api import GoogleAPI

translate_client = translate.Client(target_language='vi')

class ImageConsumer(AsyncJsonWebsocketConsumer):  
    async def receive_json(self, content, **kwargs):
        print("Receive package", content) 
        text = content['new_message']
        google_response = translate_client.translate(text)
        await self.send_json(content={"event": "translation_response", "translatedText": google_response['translatedText']})