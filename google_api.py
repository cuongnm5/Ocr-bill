from google.cloud import vision
import os
import io
import base64 

class GoogleAPI(object):

    def __init__(self):
        self.PATH = os.path.dirname(__file__)

    def detect_document(self, IMG_PATH):
        """Detects document features in an image."""
        client = vision.ImageAnnotatorClient()

        with io.open(IMG_PATH, 'rb') as image_file:
            content = image_file.read()

        image = vision.types.Image(content=content)

        response = client.document_text_detection(image=image)
        texts = response.text_annotations
        print('Texts:')

        for text in texts:
            print('\n"{}"'.format(text.description))
            vertices = (['({},{})'.format(vertex.x, vertex.y)
                        for vertex in text.bounding_poly.vertices])

            print('bounds: {}'.format(','.join(vertices)))
            
        # for page in response.full_text_annotation.pages:
        #     for block in page.blocks:
        #         print('\nBlock confidence: {}\n'.format(block.confidence))

        #         for paragraph in block.paragraphs:
        #             print('Paragraph confidence: {}'.format(
        #                 paragraph.confidence))

        #             for word in paragraph.words:
        #                 word_text = ''.join([
        #                     symbol.text for symbol in word.symbols
        #                 ])
        #                 print('Word text: {} (confidence: {})'.format(
        #                     word_text, word.confidence))

                        # for symbol in word.symbols:
                        #     print('\tSymbol: {} (confidence: {})'.format(
                        #         symbol.text, symbol.confidence))


    def detect_text(self, IMG_PATH):
        """Detects text in the file."""
        client = vision.ImageAnnotatorClient()

        with io.open(IMG_PATH, 'rb') as image_file:
            content = image_file.read()

        image = vision.types.Image(content=content)

        response = client.text_detection(image=image)
        texts = response.text_annotations
        print('Texts:')

        for text in texts:
            print('\n"{}"'.format(text.description))

            # vertices = (['({},{})'.format(vertex.x, vertex.y)
            #             for vertex in text.bounding_poly.vertices])

            # print('bounds: {}'.format(','.join(vertices)))

if __name__ == "__main__":
    test_api = GoogleAPI()
    test_api.detect_document("test.jpg")