import tornado.web
import os

class ClientRoutingHandler(tornado.web.StaticFileHandler):

    def validate_absolute_path(self, root: str, absolute_path: str):

        if not os.path.exists(absolute_path):
            absolute_path = os.path.join(root, self.default_filename)
        
        return super().validate_absolute_path(root, absolute_path)