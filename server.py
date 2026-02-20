#!/usr/bin/env python3
"""
TimeSnap Local Server
Simple HTTP server to run TimeSnap locally
"""

import http.server
import socketserver
import sys
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with CORS and better MIME types"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom log format
        sys.stdout.write(f"[TimeSnap] {self.address_string()} - {format % args}\n")

def main():
    """Start the server"""
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"""
╔═══════════════════════════════════════╗
║         TimeSnap Server v1.0          ║
╚═══════════════════════════════════════╝

🚀 Server running at:
   http://localhost:{PORT}
   http://127.0.0.1:{PORT}

📁 Serving from: {DIRECTORY}

Press Ctrl+C to stop the server
""")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"\n❌ Error: Port {PORT} is already in use.")
            print(f"   Try using a different port or stop the other service.\n")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    main()
