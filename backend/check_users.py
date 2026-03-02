from database import SessionLocal
from models import User, SystemUser
import json

def check_all_users():
    db = SessionLocal()
    
    print("=== REGULAR USERS (Login Table) ===")
    users = db.query(User).all()
    for user in users:
        print(f"Username: {user.username}, Name: {user.name}, Role: {user.role}")
    
    print(f"\nTotal Regular Users: {len(users)}")
    
    print("\n=== SYSTEM USERS ===")
    system_users = db.query(SystemUser).all()
    for user in system_users:
        print(f"Name: {user.name}, Email: {user.email}, Role: {user.role}")
    
    print(f"\nTotal System Users: {len(system_users)}")
    
    # Check for superadmin role
    superadmin_users = users + system_users
    superadmins = [u for u in superadmin_users if hasattr(u, 'role') and u.role == 'superadmin']
    
    print(f"\n=== SUPER ADMINS ===")
    if superadmins:
        for admin in superadmins:
            if hasattr(admin, 'username'):
                print(f"Username: {admin.username}, Name: {admin.name}, Role: {admin.role}")
            else:
                print(f"Name: {admin.name}, Email: {admin.email}, Role: {admin.role}")
    else:
        print("No superadmin users found!")
        print("Available roles:", list(set([u.role for u in users + system_users if hasattr(u, 'role')])))
    
    db.close()

if __name__ == "__main__":
    check_all_users()
