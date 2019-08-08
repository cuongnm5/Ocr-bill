from channels.generic.websocket import AsyncJsonWebsocketConsumer
import base64
from .google_api import *
from google.protobuf.json_format import MessageToJson

class ImageConsumer(AsyncJsonWebsocketConsumer):  
    async def receive_json(self, content, **kwargs):
        # print("Receive package", content) 
        b64_text = content['imgstring']
        img = base64.b64decode(b64_text)
        filename = 'some_image.jpg'

        with open(filename, 'wb') as f:
            f.write(img)
            
        api = GoogleAPI()
        ans = api.detect_text(filename)
        print(type(ans))
        await self.send_json(content={
            "event": "OCR_response", 
            "Text_Description": MessageToJson(ans),
            "base64":b64_text
            })