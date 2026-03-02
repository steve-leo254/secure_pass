from database import SessionLocal
from models import User
from crud import create_user
from schemas import UserCreate
import hashlib

def create_superadmin():
    db = SessionLocal()
    
    # Check if superadmin already exists
    existing = db.query(User).filter(User.username == 'superadmin').first()
    if existing:
        print("Superadmin user already exists!")
        db.close()
        return
    
    # Create superadmin user
    superadmin_data = UserCreate(
        username='superadmin',
        name='Super Administrator',
        role='superadmin',
        password='admin123'  # You can change this
    )
    
    try:
        new_user = create_user(db, superadmin_data)
        print(f"✅ Created superadmin user:")
        print(f"   Username: {new_user.username}")
        print(f"   Name: {new_user.name}")
        print(f"   Role: {new_user.role}")
        print(f"   Password: admin123")
        print(f"\n🔐 You can now login at: http://localhost:5173/super-admin-login")
        print(f"   Use credentials: superadmin / admin123")
    except Exception as e:
        print(f"❌ Error creating superadmin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_superadmin()
