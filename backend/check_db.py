import sqlite3

conn = sqlite3.connect('securepass.db')
cursor = conn.cursor()

cursor.execute("SELECT username, hashed_password FROM users WHERE username='admin'")
user = cursor.fetchone()
print(f"Username: {user[0]}")
print(f"Password hash: {user[1]}")

conn.close()
