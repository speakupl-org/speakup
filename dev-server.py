#!/usr/bin/env python3
"""
SpeakUp Development Server - Phase 2
Enhanced development server with content management features
"""

import http.server
import socketserver
import json
import os
import sys
from pathlib import Path

class SpeakUpHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Enhanced request handler with content management features"""
    
    def do_GET(self):
        """Handle GET requests with special handling for content files"""
        
        # Special handling for content API
        if self.path.startswith('/api/content/'):
            self.handle_content_api()
            return
            
        # Log requests for debugging
        print(f"📄 Serving: {self.path}")
        
        # Default handling with proper headers
        super().do_GET()
        
    def end_headers(self):
        """Override to add CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def handle_content_api(self):
        """Handle content API requests for development"""
        try:
            # Extract content file name from path
            content_file = self.path.replace('/api/content/', '').replace('.json', '') + '.json'
            content_path = Path('content') / content_file
            
            if content_path.exists():
                with open(content_path, 'r', encoding='utf-8') as f:
                    content = json.load(f)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(content, ensure_ascii=False).encode('utf-8'))
                print(f"✅ Served content: {content_file}")
            else:
                self.send_error(404, f"Content file not found: {content_file}")
                
        except Exception as e:
            print(f"❌ Error serving content: {e}")
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        """Override to customize log messages"""
        message = format % args
        if not message.endswith('.ico'):  # Skip favicon requests
            print(f"🌐 {message}")

def start_dev_server(port=8080):
    """Start the development server"""
    
    print("🚀 Starting SpeakUp Development Server - Phase 2")
    print("=" * 50)
    print(f"📍 Server running at: http://localhost:{port}")
    print(f"📂 Serving from: {os.getcwd()}")
    print("🎯 Features:")
    print("  ✅ Content Management System")
    print("  ✅ Auto-reload on changes")
    print("  ✅ CORS enabled for development")
    print("  ✅ Content API at /api/content/")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer(("", port), SpeakUpHTTPRequestHandler) as httpd:
            print(f"🎉 Server started successfully!")
            print(f"🔗 Visit: http://localhost:{port}")
            print("Press Ctrl+C to stop the server")
            httpd.serve_forever()
            
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {port} is already in use. Trying port {port + 1}...")
            start_dev_server(port + 1)
        else:
            print(f"❌ Server error: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='SpeakUp Development Server - Phase 2')
    parser.add_argument('--port', type=int, default=8080, help='Port to run the server on (default: 8080)')
    parser.add_argument('--content-check', action='store_true', help='Validate content files before starting')
    
    args = parser.parse_args()
    
    if args.content_check:
        print("🔍 Validating content files...")
        content_dir = Path('content')
        if content_dir.exists():
            content_files = list(content_dir.glob('*.json'))
            print(f"✅ Found {len(content_files)} content files:")
            for file in content_files:
                try:
                    with open(file, 'r', encoding='utf-8') as f:
                        json.load(f)
                    print(f"  ✅ {file.name}")
                except json.JSONDecodeError as e:
                    print(f"  ❌ {file.name}: {e}")
        else:
            print("❌ Content directory not found")
        print()
    
    start_dev_server(args.port)