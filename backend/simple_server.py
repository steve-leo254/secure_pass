from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
import uuid
from datetime import datetime
import urllib.parse
import os
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class SecurePassAPI(BaseHTTPRequestHandler):
    
    def set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.set_cors_headers()
        self.end_headers()
    
    def get_db(self):
        conn = sqlite3.connect('securepass.db')
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_post_data(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        return json.loads(post_data.decode('utf-8'))
    
    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.set_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_GET(self):
        if self.path == '/':
            self.send_json_response({"message": "SecurePass API is running"})
        elif self.path == '/users/me':
            conn = self.get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = 'admin'")
            user = cursor.fetchone()
            conn.close()
            
            self.send_json_response({
                "id": user['id'],
                "username": user['username'],
                "name": user['name'],
                "role": user['role']
            })
        elif self.path == '/visitors':
            conn = self.get_db()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT v.*, 
                       u1.name as registered_by_name,
                       u2.name as checked_out_by_name
                FROM visitors v
                LEFT JOIN users u1 ON v.registered_by_id = u1.id
                LEFT JOIN users u2 ON v.checked_out_by_id = u2.id
                ORDER BY v.time_in DESC
            """)
            visitors = []
            for row in cursor.fetchall():
                visitor = dict(row)
                visitor['tools'] = json.loads(visitor['tools']) if visitor['tools'] else []
                visitor['custom_tools'] = json.loads(visitor['custom_tools']) if visitor['custom_tools'] else []
                visitor['registered_by'] = visitor['registered_by_name']
                visitor['checked_out_by'] = visitor['checked_out_by_name']
                visitors.append(visitor)
            conn.close()
            
            self.send_json_response(visitors)
        elif self.path == '/settings':
            conn = self.get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM system_settings LIMIT 1")
            settings = cursor.fetchone()
            conn.close()
            
            if not settings:
                self.send_json_response({
                    "property_name": "SecurePass Residences",
                    "property_address": "123 Kimathi Street, Nairobi, Kenya",
                    "categories": ["contractor", "technician", "delivery", "staff", "visitor"],
                    "tools": ["Hammer", "Screwdriver", "Drill Machine", "Spanner Set", "Welding Machine", "Ladder", "Pliers", "Tape Measure", "Level", "Wire Cutter", "Angle Grinder", "Pipe Wrench", "Soldering Iron", "Circular Saw"]
                })
            else:
                self.send_json_response({
                    "property_name": settings['property_name'],
                    "property_address": settings['property_address'],
                    "categories": json.loads(settings['categories']) if settings['categories'] else [],
                    "tools": json.loads(settings['tools']) if settings['tools'] else []
                })
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/login':
            data = self.get_post_data()
            username = data.get('username')
            password = data.get('password')
            
            conn = self.get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
            user = cursor.fetchone()
            conn.close()
            
            if not user or hash_password(password) != user['hashed_password']:
                self.send_json_response({"error": "Invalid credentials"}, 401)
            else:
                self.send_json_response({
                    "access_token": "simple_token",
                    "token_type": "bearer",
                    "user": {
                        "id": user['id'],
                        "username": user['username'],
                        "name": user['name'],
                        "role": user['role']
                    }
                })
        elif self.path == '/visitors':
            data = self.get_post_data()
            
            conn = self.get_db()
            cursor = conn.cursor()
            
            visitor_id = str(uuid.uuid4())
            now = datetime.utcnow().isoformat()
            
            cursor.execute("""
                INSERT INTO visitors 
                (id, full_name, phone_number, id_number, category, purpose, gender, 
                 unit_visited, tools, custom_tools, time_in, status, registered_by_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                visitor_id,
                data.get('full_name'),
                data.get('phone_number'),
                data.get('id_number'),
                data.get('category'),
                data.get('purpose'),
                data.get('gender'),
                data.get('unit_visited'),
                json.dumps(data.get('tools', [])),
                json.dumps(data.get('custom_tools', [])),
                now,
                'checked-in',
                'usr-002',
                now
            ))
            
            conn.commit()
            conn.close()
            
            self.send_json_response({"message": "Visitor created successfully", "id": visitor_id})
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_PUT(self):
        if self.path.startswith('/visitors/') and self.path.endswith('/checkout'):
            visitor_id = self.path.split('/')[2]
            
            conn = self.get_db()
            cursor = conn.cursor()
            
            cursor.execute("SELECT status FROM visitors WHERE id = ?", (visitor_id,))
            visitor = cursor.fetchone()
            
            if not visitor:
                self.send_json_response({"error": "Visitor not found"}, 404)
            elif visitor['status'] != "checked-in":
                self.send_json_response({"error": "Visitor is already checked out"}, 400)
            else:
                now = datetime.utcnow().isoformat()
                cursor.execute("""
                    UPDATE visitors 
                    SET time_out = ?, status = 'checked-out', checked_out_by_id = 'usr-002'
                    WHERE id = ?
                """, (now, visitor_id))
                
                conn.commit()
                conn.close()
                
                self.send_json_response({"message": "Visitor checked out successfully"})
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, SecurePassAPI)
    print("SecurePass API running on http://localhost:8000")
    print("Available endpoints:")
    print("  GET  /")
    print("  POST /login")
    print("  GET  /users/me")
    print("  GET  /visitors")
    print("  POST /visitors")
    print("  PUT  /visitors/{id}/checkout")
    print("  GET  /settings")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
