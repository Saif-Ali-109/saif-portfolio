import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ai"))

from main import app


class StripApiPrefixMiddleware:
    """Vercel file-based routing: api/[[...path]].py catches every /api/* path
    (from vercel.json rewrites /chat->/api/chat etc., and direct /api/* calls).
    Depending on the runtime, the function may receive either the rewritten
    /api/<route> path or the original /<route> path. Strip the /api prefix so
    FastAPI's routes resolve in both cases.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            if path == "/api":
                scope["path"] = "/"
            elif path.startswith("/api/"):
                scope["path"] = path[len("/api"):]
            scope["root_path"] = ""
        await self.inner(scope, receive, send)


app = StripApiPrefixMiddleware(app)
