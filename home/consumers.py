from channels.generic.websocket import AsyncJsonWebsocketConsumer
import base64
from .google_api import *

class ImageConsumer(AsyncJsonWebsocketConsumer):  
    async def receive_json(self, content, **kwargs):
        # print("Receive package", content) 
        text = content['imgstring']
        img = base64.b64decode(text)
        filename = 'some_image.jpg'
        with open(filename, 'wb') as f:
            f.write(img)
        api = GoogleAPI()
        ans = api.detect_text(filename)
        await self.send_json(content={
            "event": "OCR_response", 
            # "Text_Description": ans.text,
            "base64":text
            })
