# type: ignore  # noqa: PGH003

from collections.abc import Generator
from pathlib import Path

import tornado.web


class ClientRoutingHandler(tornado.web.StaticFileHandler):
    def initialize(self, path: str) -> None:
        super().initialize(path, "index.html")

    def validate_absolute_path(self, root: str, absolute_path: str) -> str | None:
        if not Path(absolute_path).exists():
            absolute_path = str(Path(root) / (self.default_filename or ""))

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
    def get_content(
        cls, abspath: str, start: int | None = None, end: int | None = None
    ) -> bytes | Generator[bytes]:
        if abspath.endswith(".html"):
            with Path(abspath).open(encoding="utf-8") as f:
                html = f.read()
            html = html.replace("</head>", f"{cls.ANALYTICS_JS}\n</head>")
            return html.encode("utf-8")
        return super().get_content(abspath, start, end)

    def get_content_size(self) -> int:
        if self.absolute_path.endswith(".html"):
            with Path(self.absolute_path).open(encoding="utf-8") as f:
                html = f.read()
            html = html.replace("</head>", f"{self.ANALYTICS_JS}\n</head>")
            return len(html.encode("utf-8"))
        return super().get_content_size()
