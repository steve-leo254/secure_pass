import sqlite3
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Connect to database
conn = sqlite3.connect('securepass.db')
cursor = conn.cursor()

# Update passwords with SHA256 hashes
users = [
    ('admin', hash_password('admin123')),
    ('security', hash_password('security123')),
    ('guard2', hash_password('guard123'))
]

for username, hashed_password in users:
    cursor.execute("UPDATE users SET hashed_password = ? WHERE username = ?", (hashed_password, username))

conn.commit()
conn.close()

print("Passwords updated to SHA256 hashes!")
print("Test users:")
print("- admin / admin123")
print("- security / security123") 
print("- guard2 / guard123")
