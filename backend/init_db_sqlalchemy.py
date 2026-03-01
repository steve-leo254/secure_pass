from database import create_tables, SessionLocal
from models import User, Tool, Category
from crud import create_user, create_tool, create_category
from schemas import UserCreate, ToolCreate, CategoryCreate
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
        
        db.commit()
        print("🎉 Database initialization completed successfully!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
