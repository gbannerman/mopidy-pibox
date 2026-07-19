
from importlib.metadata import version
from pathlib import Path

from mopidy import config, ext
from mopidy.config import Config, ConfigSchema
from mopidy.core import CoreProxy
from mopidy.ext import Registry

from . import api, socket
from .routing import ClientRoutingHandler, ClientRoutingWithAnalyticsHandler

__version__ = version("Mopidy-Pibox")


def get_http_handlers(
    core: CoreProxy, config: Config, static_directory_path: str
) -> list[tuple]:
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


def my_app_factory(config: Config, core: CoreProxy) -> list[tuple]:
    static_directory_path = str(Path(__file__).parent / "static")

    return [
        (r"/ws/?", socket.PiboxWebSocket),
        *get_http_handlers(core, config, static_directory_path),
    ]


class Extension(ext.Extension):
    dist_name = "Mopidy-Pibox"
    ext_name = "pibox"
    version = __version__

    def get_default_config(self) -> str:
        conf_file = Path(__file__).parent / "ext.conf"
        return config.read(conf_file)

    def get_config_schema(self) -> ConfigSchema:
        schema = super().get_config_schema()
        schema["default_playlists"] = config.List(
            optional=True, unique=True, subtype=config.String()
        )
        schema["default_skip_threshold"] = config.Integer(minimum=1)
        schema["offline"] = config.Boolean(optional=True)
        schema["disable_analytics"] = config.Boolean(optional=True)
        return schema

    def setup(self, registry: Registry) -> None:
        # Deferred to avoid a circular import with mopidy_pibox.frontend.
        from .frontend import PiboxFrontend  # noqa: PLC0415

        registry.add("frontend", PiboxFrontend)
        registry.add(
            "http:app",
            {
                "name": self.ext_name,
                "factory": my_app_factory,
            },
        )
