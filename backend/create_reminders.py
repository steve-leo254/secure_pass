from database import SessionLocal
from models import SystemUser, Subscription, SubscriptionReminder
from datetime import datetime, timedelta
from crud import create_subscription_reminder
from schemas import SubscriptionReminderCreate

def create_sample_reminders():
    db = SessionLocal()
    
    try:
        # Get users and subscriptions
        users = db.query(SystemUser).all()
        subscriptions = db.query(Subscription).all()
        
        print(f"Found {len(users)} users and {len(subscriptions)} subscriptions")
        
        # Create sample reminders
        reminders_to_create = []
        
        # Expiring soon reminder (for first user)
        if subscriptions:
            sub = subscriptions[0]
            user = db.query(SystemUser).filter(SystemUser.id == sub.user_id).first()
            if user:
                reminders_to_create.append({
                    'user_id': user.id,
                    'subscription_id': sub.id,
                    'type': 'expiring_soon',
                    'message': f"{user.name}'s subscription expires in 5 days",
                    'read': False,
                    'sent': False
                })
        
        # Welcome reminder for new user (last user)
        if users:
            user = users[-1]  # Last user
            reminders_to_create.append({
                'user_id': user.id,
                'subscription_id': '',
                'type': 'payment_due',
                'message': f"Welcome {user.name}! Please set up your subscription to activate your account.",
                'read': False,
                'sent': False
            })
        
        # Create the reminders
        for reminder_data in reminders_to_create:
            reminder_create = SubscriptionReminderCreate(**reminder_data)
            new_reminder = create_subscription_reminder(db, reminder_create)
            print(f"Created reminder: {new_reminder.message}")
        
        db.commit()
        print("✅ Created sample reminders successfully!")
        
        # Verify
        reminders = db.query(SubscriptionReminder).all()
        print(f"\nVerification - Total reminders: {len(reminders)}")
        for reminder in reminders:
            user = db.query(SystemUser).filter(SystemUser.id == reminder.user_id).first()
            print(f"Reminder: {reminder.message} -> User: {user.name if user else 'None'}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_reminders()
