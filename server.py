import re
import os
import mimetypes
from http.server import BaseHTTPRequestHandler, HTTPServer


filename = "favs.txt"


class HTTPRequestHandler(BaseHTTPRequestHandler):
   def do_PUT(self):
       if re.search('/api/update-favs', self.path):
           length = int(self.headers.get('content-length'))
           data = self.rfile.read(length).decode('utf8')


           # Write the data to the file
           f = open(filename, "w")
           f.write(data)
           f.close()


           self.send_response(200)
       else:
           self.send_response(403)
       self.end_headers()


def do_GET(self):
    file_requested = self.path.strip("/")
    if file_requested == "":
        file_requested = "index.html"

    try:
        # Determine the MIME type based on file extension
        mime_type, _ = mimetypes.guess_type(file_requested)

        # Open the requested file with utf-8 encoding
        with open(file_requested, 'r', encoding='utf-8') as file:
            content = file.read()

        # Write response headers
        self.send_response(200)
        self.send_header('Content-type', mime_type if mime_type else 'text/html')
        self.end_headers()

        # Write content
        self.wfile.write(content.encode('utf-8'))

    except FileNotFoundError:
        self.send_error(404, "File Not Found: %s" % file_requested)
    except UnicodeDecodeError:
        self.send_error(500, "Encoding Error: Could not decode file")
      
if __name__ == '__main__':
   server = HTTPServer(('localhost', 8000), HTTPRequestHandler)
   try:
       server.serve_forever()
   except KeyboardInterrupt:
       pass
   server.server_close()