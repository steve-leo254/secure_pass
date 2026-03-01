import sqlite3
import json
import hashlib
from datetime import datetime

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def init_database():
    conn = sqlite3.connect('securepass.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_login TEXT
        )
    """)
    
    # Create visitors table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS visitors (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            id_number TEXT NOT NULL,
            category TEXT NOT NULL,
            purpose TEXT NOT NULL,
            gender TEXT NOT NULL,
            unit_visited TEXT NOT NULL,
            tools TEXT,
            custom_tools TEXT,
            time_in TEXT NOT NULL,
            time_out TEXT,
            status TEXT NOT NULL DEFAULT 'checked-in',
            registered_by_id TEXT,
            checked_out_by_id TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (registered_by_id) REFERENCES users (id),
            FOREIGN KEY (checked_out_by_id) REFERENCES users (id)
        )
    """)
    
    # Create system_settings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            property_name TEXT NOT NULL,
            property_address TEXT NOT NULL,
            categories TEXT,
            tools TEXT,
            updated_at TEXT NOT NULL
        )
    """)
    
    # Insert default users
    default_users = [
        {
            'id': 'usr-001',
            'username': 'admin',
            'name': 'System Administrator',
            'role': 'admin'
        },
        {
            'id': 'usr-002', 
            'username': 'security',
            'name': 'Security Officer',
            'role': 'security'
        }
    ]
    
    for user in default_users:
        cursor.execute("""
            INSERT OR IGNORE INTO users (id, username, hashed_password, name, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            user['id'],
            user['username'],
            hash_password(user['username'] + '123'),  # username123
            user['name'],
            user['role'],
            datetime.utcnow().isoformat()
        ))
    
    # Insert default settings
    cursor.execute("""
        INSERT OR IGNORE INTO system_settings (id, property_name, property_address, categories, tools, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        1,
        'SecurePass Residences',
        '123 Kimathi Street, Nairobi, Kenya',
        json.dumps(["contractor", "technician", "delivery", "staff", "visitor"]),
        json.dumps(["Hammer", "Screwdriver", "Drill Machine", "Spanner Set", "Welding Machine", "Ladder", "Pliers", "Tape Measure", "Level", "Wire Cutter", "Angle Grinder", "Pipe Wrench", "Soldering Iron", "Circular Saw"]),
        datetime.utcnow().isoformat()
    ))
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()
