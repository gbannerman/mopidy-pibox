import logging
from typing import ClassVar

import tornado.websocket


class PiboxWebSocket(tornado.websocket.WebSocketHandler):
    clients: ClassVar[set] = set()
    logger = logging.getLogger(__name__)

    def check_origin(self, origin: str) -> bool:  # noqa: ARG002
        return True

    def open(self) -> None:
        self.clients.add(self)
        self.logger.debug("WebSocket opened")

    def on_message(self, message: str | bytes) -> None:
        self.logger.info(message)

    def on_close(self) -> None:
        self.clients.remove(self)
        self.logger.debug("WebSocket closed")

    @classmethod
    def send(cls, subject: str, message: object) -> None:
        for conn in cls.clients:
            conn.write_message({"type": subject, "payload": message})
