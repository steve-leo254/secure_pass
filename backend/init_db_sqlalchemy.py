from database import create_tables, SessionLocal
from models import User, Tool, Category, SystemUser, Package, Subscription, CoinPackage, CoinTransaction, SubscriptionReminder
from crud import create_user, create_tool, create_category, create_system_user, create_package, create_subscription, create_coin_package
from schemas import UserCreate, ToolCreate, CategoryCreate, SystemUserCreate, PackageCreate, SubscriptionCreate, CoinPackageCreate
from datetime import datetime, timedelta
import json

def init_database():
    """Initialize database with default data"""
    # Create tables
    create_tables()
    
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users == 0:
            # Create default users
            users = [
                UserCreate(
                    username="admin",
                    password="admin123",
                    name="Property Manager",
                    role="property_manager"
                ),
                UserCreate(
                    username="security",
                    password="security123",
                    name="John Kamau",
                    role="security"
                ),
                UserCreate(
                    username="guard2",
                    password="guard123",
                    name="Jane Wanjiku",
                    role="security"
                )
            ]
            
            for user_data in users:
                create_user(db, user_data)
            print("✅ Created default users")
        
        # Check if tools already exist
        existing_tools = db.query(Tool).count()
        if existing_tools == 0:
            # Create default tools
            tools = [
                ToolCreate(name="Hammer"),
                ToolCreate(name="Screwdriver"),
                ToolCreate(name="Wrench"),
                ToolCreate(name="Drill"),
                ToolCreate(name="Ladder"),
                ToolCreate(name="Safety Helmet"),
                ToolCreate(name="Safety Vest"),
                ToolCreate(name="Toolbox"),
                ToolCreate(name="Measuring Tape"),
                ToolCreate(name="Pliers")
            ]
            
            for tool_data in tools:
                create_tool(db, tool_data)
            print("✅ Created default tools")
        
        # Check if categories already exist
        existing_categories = db.query(Category).count()
        if existing_categories == 0:
            # Create default categories
            categories = [
                CategoryCreate(
                    name="Visitor / Customer",
                    value="visitor",
                    color="#3b82f6",
                    icon="👤",
                    is_active=True
                ),
                CategoryCreate(
                    name="Contractor",
                    value="contractor",
                    color="#f97316",
                    icon="🔧",
                    is_active=True
                ),
                CategoryCreate(
                    name="Technician",
                    value="technician",
                    color="#8b5cf6",
                    icon="⚙️",
                    is_active=True
                ),
                CategoryCreate(
                    name="Delivery Personnel",
                    value="delivery",
                    color="#22c55e",
                    icon="📦",
                    is_active=True
                ),
                CategoryCreate(
                    name="Staff",
                    value="staff",
                    color="#6366f1",
                    icon="🏢",
                    is_active=True
                )
            ]
            
            for category_data in categories:
                create_category(db, category_data)
            print("✅ Created default categories")
        
        # Check if system users already exist
        existing_system_users = db.query(SystemUser).count()
        if existing_system_users == 0:
            # Create default system users
            system_users = [
                SystemUserCreate(
                    name="John Doe",
                    email="john.doe@example.com",
                    phone="+254712345678",
                    role="admin",
                    status="active",
                    company="Example Corp",
                    property="Main Building"
                ),
                SystemUserCreate(
                    name="Jane Smith",
                    email="jane.smith@example.com",
                    phone="+254723456789",
                    role="security",
                    status="active",
                    company="Security Services Ltd",
                    property="North Wing"
                ),
                SystemUserCreate(
                    name="Mike Johnson",
                    email="mike.johnson@example.com",
                    phone="+254734567890",
                    role="admin",
                    status="active",
                    company="Property Management",
                    property="South Tower"
                )
            ]
            
            for user_data in system_users:
                create_system_user(db, user_data)
            print("✅ Created default system users")
        
        # Check if packages already exist
        existing_packages = db.query(Package).count()
        if existing_packages == 0:
            # Create default packages
            packages = [
                PackageCreate(
                    name="Basic",
                    billing="monthly",
                    price=5000.0,
                    currency="KES",
                    coin_cost=100,
                    max_users=5,
                    max_visitors_per_day=100,
                    features=["Visitor Management", "Basic Reports", "Email Support"],
                    is_popular=False,
                    is_active=True
                ),
                PackageCreate(
                    name="Professional",
                    billing="monthly",
                    price=10000.0,
                    currency="KES",
                    coin_cost=200,
                    max_users=10,
                    max_visitors_per_day=500,
                    features=["Visitor Management", "Advanced Reports", "Priority Support", "Mobile App", "API Access"],
                    is_popular=True,
                    is_active=True
                ),
                PackageCreate(
                    name="Enterprise",
                    billing="monthly",
                    price=25000.0,
                    currency="KES",
                    coin_cost=500,
                    max_users=50,
                    max_visitors_per_day=2000,
                    features=["All Features", "Custom Integrations", "Dedicated Support", "White Label", "Advanced Analytics"],
                    is_popular=False,
                    is_active=True
                )
            ]
            
            for package_data in packages:
                create_package(db, package_data)
            print("✅ Created default packages")
        
        # Check if coin packages already exist
        existing_coin_packages = db.query(CoinPackage).count()
        if existing_coin_packages == 0:
            # Create default coin packages
            coin_packages = [
                CoinPackageCreate(
                    name="Starter Pack",
                    coins=100,
                    price=1000.0,
                    currency="KES",
                    is_active=True
                ),
                CoinPackageCreate(
                    name="Professional Pack",
                    coins=500,
                    price=4000.0,
                    currency="KES",
                    is_active=True
                ),
                CoinPackageCreate(
                    name="Enterprise Pack",
                    coins=1000,
                    price=7000.0,
                    currency="KES",
                    is_active=True
                )
            ]
            
            for coin_package_data in coin_packages:
                create_coin_package(db, coin_package_data)
            print("✅ Created default coin packages")
        
        # Create sample subscriptions for system users
        existing_subscriptions = db.query(Subscription).count()
        if existing_subscriptions == 0:
            system_users = db.query(SystemUser).all()
            packages = db.query(Package).all()
            
            if system_users and packages:
                # Create subscriptions for first few users
                for i, user in enumerate(system_users[:2]):
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
                    create_subscription(db, subscription_data)
                print("✅ Created sample subscriptions")
        
        db.commit()
        print("🎉 Database initialization completed successfully!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
