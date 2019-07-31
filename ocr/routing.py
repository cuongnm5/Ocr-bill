from django.conf.urls import url

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

websocket_urlpatterns = [
    url('message/', MessageConsumer),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
    	URLRouter(
            websocket_urlpatterns
    	)
    )
})