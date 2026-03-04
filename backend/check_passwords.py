import sqlite3
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

conn = sqlite3.connect('securepass.db')
cursor = conn.cursor()
cursor.execute('SELECT username, hashed_password FROM users WHERE role="property_manager"')
users = cursor.fetchall()

print('Property manager password verification:')
for user in users:
    username, stored_hash = user
    print(f'\nUsername: {username}')
    print(f'Stored hash: {stored_hash}')
    
    # Test common passwords
    test_passwords = [
        username + '123', 
        'password123', 
        'admin123', 
        '123', 
        username,
        'password',
        'admin',
        'property_manager123',
        'manager123',
        'secure123',
        'pass123',
        'qwerty',
        'test123'
    ]
    for pwd in test_passwords:
        test_hash = hash_password(pwd)
        if test_hash == stored_hash:
            print(f'✓ PASSWORD FOUND: {pwd}')
            break
    else:
        print('✗ No common password matched')

conn.close()
