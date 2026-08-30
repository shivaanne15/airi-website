# Local preview server. Same as `python3 -m http.server 8765`, but tells the
# browser to revalidate every file — so edits show up on plain link clicks
# instead of hiding behind cached copies.
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


if __name__ == '__main__':
    print('Serving on http://localhost:8765')
    ThreadingHTTPServer(('', 8765), NoCacheHandler).serve_forever()
