import logging

import tornado.websocket

class PiboxWebSocket(tornado.websocket.WebSocketHandler):
    clients = set()
    logger = logging.getLogger(__name__)

    def check_origin(self, origin):
        return True

    def open(self):
        self.clients.add(self)
        self.logger.debug("WebSocket opened")

    def on_message(self, message):
        self.logger.info(message)

    def on_close(self):
        self.clients.remove(self)
        self.logger.debug("WebSocket closed")

    @classmethod
    def send(cls, subject, message):
        for conn in cls.clients:
            conn.write_message({'type': subject, 'payload': message})