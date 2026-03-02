from database import SessionLocal
from models import SystemUser, Subscription, Package, SubscriptionReminder
import json

def check_database():
    db = SessionLocal()
    
    print("=== SYSTEM USERS ===")
    users = db.query(SystemUser).all()
    for user in users:
        print(f"ID: {user.id}, Name: {user.name}, Email: {user.email}, Status: {user.status}")
    
    print(f"\nTotal Users: {len(users)}")
    
    print("\n=== PACKAGES ===")
    packages = db.query(Package).all()
    for pkg in packages:
        print(f"ID: {pkg.id}, Name: {pkg.name}, Price: {pkg.price}, Active: {pkg.is_active}")
    
    print(f"\nTotal Packages: {len(packages)}")
    
    print("\n=== SUBSCRIPTIONS ===")
    subscriptions = db.query(Subscription).all()
    for sub in subscriptions:
        print(f"ID: {sub.id}, User ID: {sub.user_id}, Package ID: {sub.package_id}, Status: {sub.status}, Start: {sub.start_date}, End: {sub.end_date}")
    
    print(f"\nTotal Subscriptions: {len(subscriptions)}")
    
    print("\n=== REMINDERS ===")
    reminders = db.query(SubscriptionReminder).all()
    for reminder in reminders:
        print(f"ID: {reminder.id}, User ID: {reminder.user_id}, Type: {reminder.type}, Message: {reminder.message}, Read: {reminder.read}")
    
    print(f"\nTotal Reminders: {len(reminders)}")
    
    db.close()

if __name__ == "__main__":
    check_database()
