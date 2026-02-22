from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import uuid
from datetime import datetime
import json
import hashlib

app = FastAPI(title="SecurePass API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple Pydantic models without complex validation
class LoginRequest(BaseModel):
    username: str
    password: str

class VisitorCreate(BaseModel):
    full_name: str
    phone_number: str
    id_number: str
    category: str
    purpose: str
    gender: str
    unit_visited: str
    tools: List[str] = []
    custom_tools: List[str] = []

# Database helper
def get_db():
    conn = sqlite3.connect('securepass.db')
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Routes
@app.get("/")
async def root():
    return {"message": "SecurePass API is running"}

@app.post("/login")
async def login(request: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (request.username,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or user['hashed_password'] != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "access_token": "simple_token",
        "token_type": "bearer",
        "user": {
            "id": user['id'],
            "username": user['username'],
            "name": user['name'],
            "role": user['role']
        }
    }

@app.get("/users/me")
async def get_current_user():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = 'admin'")
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user['id'],
        "username": user['username'],
        "name": user['name'],
        "role": user['role']
    }

@app.get("/visitors")
async def get_visitors():
    conn = get_db()
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
        visitor = {
            "id": row['id'],
            "full_name": row['full_name'],
            "phone_number": row['phone_number'],
            "id_number": row['id_number'],
            "category": row['category'],
            "purpose": row['purpose'],
            "gender": row['gender'],
            "unit_visited": row['unit_visited'],
            "tools": json.loads(row['tools']) if row['tools'] else [],
            "custom_tools": json.loads(row['custom_tools']) if row['custom_tools'] else [],
            "time_in": row['time_in'],
            "time_out": row['time_out'],
            "status": row['status'],
            "registered_by": row['registered_by_name'] or "Unknown",
            "checked_out_by": row['checked_out_by_name']
        }
        visitors.append(visitor)
    
    conn.close()
    return visitors

@app.post("/visitors")
async def create_visitor(visitor_data: VisitorCreate):
    conn = get_db()
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
        visitor_data.full_name,
        visitor_data.phone_number,
        visitor_data.id_number,
        visitor_data.category,
        visitor_data.purpose,
        visitor_data.gender,
        visitor_data.unit_visited,
        json.dumps(visitor_data.tools),
        json.dumps(visitor_data.custom_tools),
        now,
        'checked-in',
        'usr-002',  # Default to security user
        now
    ))
    
    conn.commit()
    conn.close()
    
    return {"message": "Visitor created successfully", "id": visitor_id}

@app.put("/visitors/{visitor_id}/checkout")
async def checkout_visitor(visitor_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT status FROM visitors WHERE id = ?", (visitor_id,))
    visitor = cursor.fetchone()
    
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    if visitor['status'] != "checked-in":
        raise HTTPException(status_code=400, detail="Visitor is already checked out")
    
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        UPDATE visitors 
        SET time_out = ?, status = 'checked-out', checked_out_by_id = 'usr-002'
        WHERE id = ?
    """, (now, visitor_id))
    
    conn.commit()
    conn.close()
    
    return {"message": "Visitor checked out successfully"}

@app.get("/settings")
async def get_settings():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM system_settings LIMIT 1")
    settings = cursor.fetchone()
    conn.close()
    
    if not settings:
        return {
            "property_name": "SecurePass Residences",
            "property_address": "123 Kimathi Street, Nairobi, Kenya",
            "categories": ["contractor", "technician", "delivery", "staff", "visitor"],
            "tools": ["Hammer", "Screwdriver", "Drill Machine", "Spanner Set", "Welding Machine", "Ladder", "Pliers", "Tape Measure", "Level", "Wire Cutter", "Angle Grinder", "Pipe Wrench", "Soldering Iron", "Circular Saw"]
        }
    
    return {
        "property_name": settings['property_name'],
        "property_address": settings['property_address'],
        "categories": json.loads(settings['categories']) if settings['categories'] else [],
        "tools": json.loads(settings['tools']) if settings['tools'] else []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
