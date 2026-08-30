# Local preview server. Same as `python3 -m http.server 8770`, but tells the
# browser to revalidate every file — so edits show up on plain link clicks
# instead of hiding behind cached copies.
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    print('Serving on http://localhost:8770')
    ThreadingHTTPServer(('', 8770), NoCacheHandler).serve_forever()
