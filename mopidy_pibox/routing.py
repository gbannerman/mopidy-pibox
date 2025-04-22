import os
import tornado.web


class ClientRoutingHandler(tornado.web.StaticFileHandler):
    def initialize(self, path: str) -> None:
        super(ClientRoutingHandler, self).initialize(path, "index.html")

    def validate_absolute_path(self, root: str, absolute_path: str):
        if not os.path.exists(absolute_path):
            absolute_path = os.path.join(root, self.default_filename)

        return super().validate_absolute_path(root, absolute_path)


class ClientRoutingWithAnalyticsHandler(ClientRoutingHandler):
    ANALYTICS_JS = """
    <script>
        window.goatcounter = {
            path: function(p) { return location.host + p }
        }
    </script>
    <script data-goatcounter="https://mopidy-pibox.goatcounter.com/count"
            data-goatcounter-settings='{"allow_local": true}'
            async src="//gc.zgo.at/count.js"></script>
    """

    @classmethod
    def get_content(self, abspath, start=None, end=None):
        if abspath.endswith(".html"):
            with open(abspath, "r", encoding="utf-8") as f:
                html = f.read()
            html = html.replace("</head>", f"{self.ANALYTICS_JS}\n</head>")
            return html.encode("utf-8")
        else:
            return super().get_content(abspath, start, end)

    def get_content_size(self):
        if self.absolute_path.endswith(".html"):
            with open(self.absolute_path, "r", encoding="utf-8") as f:
                html = f.read()
            html = html.replace("</head>", f"{self.ANALYTICS_JS}\n</head>")
            return len(html.encode("utf-8"))
        else:
            return super(ClientRoutingWithAnalyticsHandler, self).get_content_size()
