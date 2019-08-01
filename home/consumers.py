from channels.generic.websocket import AsyncJsonWebsocketConsumer
import base64

class ImageConsumer(AsyncJsonWebsocketConsumer):  
    async def receive_json(self, content, **kwargs):
        # print("Receive package", content) 
        text = content['imgstring']
        img = base64.b64decode(text)
        filename = 'some_image.jpg'
        with open(filename, 'wb') as f:
            f.write(img)
        await self.send_json(content={"event": "translation_response", "translatedText": text})