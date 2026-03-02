from database import SessionLocal
from models import SystemUser, Subscription, Package, SubscriptionReminder
from datetime import datetime, timedelta
from crud import create_subscription
from schemas import SubscriptionCreate

def fix_subscriptions():
    db = SessionLocal()
    
    try:
        # Delete existing subscriptions
        db.query(Subscription).delete()
        print("Deleted existing subscriptions")
        
        # Get users and packages
        users = db.query(SystemUser).all()
        packages = db.query(Package).all()
        
        print(f"Found {len(users)} users and {len(packages)} packages")
        
        # Create proper subscriptions for first 2 users
        for i, user in enumerate(users[:2]):
            package = packages[i % len(packages)]
            
            subscription_data = SubscriptionCreate(
                user_id=user.id,
                package_id=package.id,
                start_date=datetime.utcnow(),
                end_date=datetime.utcnow() + timedelta(days=30),
                status="active",
                auto_renew=True,
                amount=package.price
            )
            
            new_subscription = create_subscription(db, subscription_data)
            print(f"Created subscription for {user.name}: {new_subscription.id}")
        
        db.commit()
        print("✅ Fixed subscriptions successfully!")
        
        # Verify the fix
        subscriptions = db.query(Subscription).all()
        print(f"\nVerification - Total subscriptions: {len(subscriptions)}")
        for sub in subscriptions:
            user = db.query(SystemUser).filter(SystemUser.id == sub.user_id).first()
            print(f"Subscription {sub.id} -> User: {user.name if user else 'None'}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_subscriptions()
