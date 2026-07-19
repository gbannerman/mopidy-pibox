
import os
from importlib.metadata import version

from mopidy import config, ext

from . import api, socket
from .routing import ClientRoutingHandler, ClientRoutingWithAnalyticsHandler

__version__ = version("Mopidy-Pibox")


def get_http_handlers(core, config, static_directory_path):
    disable_analytics = config.get("pibox").get("disable_analytics", False)

    return [
        (
            r"/api/tracklist/?",
            api.TracklistHandler,
            {"core": core},
        ),
        (r"/api/vote/?", api.VoteHandler, {"core": core}),
        (
            r"/api/session/?",
            api.SessionHandler,
            {"core": core},
        ),
        (
            r"/api/suggestions/?",
            api.SuggestionsHandler,
            {"core": core},
        ),
        (
            r"/config/?",
            api.ConfigHandler,
            {"config": config},
        ),
        (
            r"/(.*)",
            ClientRoutingHandler
            if disable_analytics
            else ClientRoutingWithAnalyticsHandler,
            {
                "path": static_directory_path,
            },
        ),
    ]


def my_app_factory(config, core):
    static_directory_path = os.path.join(os.path.dirname(__file__), "static")

    return [
        (r"/ws/?", socket.PiboxWebSocket),
        *get_http_handlers(core, config, static_directory_path),
    ]


class Extension(ext.Extension):
    dist_name = "Mopidy-Pibox"
    ext_name = "pibox"
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), "ext.conf")
        return config.read(conf_file)

    def get_config_schema(self):
        schema = super().get_config_schema()
        schema["default_playlists"] = config.List(
            optional=True, unique=True, subtype=config.String()
        )
        schema["default_skip_threshold"] = config.Integer(minimum=1)
        schema["offline"] = config.Boolean(optional=True)
        schema["disable_analytics"] = config.Boolean(optional=True)
        return schema

    def setup(self, registry):
        from .frontend import PiboxFrontend

        registry.add("frontend", PiboxFrontend)
        registry.add(
            "http:app",
            {
                "name": self.ext_name,
                "factory": my_app_factory,
            },
        )
