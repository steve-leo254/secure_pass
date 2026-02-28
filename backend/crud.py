from sqlalchemy.orm import Session
from sqlalchemy import and_
from models import User, Visitor, AuditLog, Tool, Category
from schemas import UserCreate, VisitorCreate, VisitorUpdate, AuditLogCreate, ToolCreate, CategoryCreate, CategoryUpdate
from datetime import datetime
import json
import hashlib

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# User CRUD
def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        name=user.name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Visitor CRUD
def get_visitors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Visitor).offset(skip).limit(limit).all()

def get_visitor(db: Session, visitor_id: str):
    return db.query(Visitor).filter(Visitor.id == visitor_id).first()

def create_visitor(db: Session, visitor: VisitorCreate, registered_by_id: str):
    db_visitor = Visitor(
        full_name=visitor.full_name,
        phone_number=visitor.phone_number,
        id_number=visitor.id_number,
        category=visitor.category,
        purpose=visitor.purpose,
        gender=visitor.gender,
        unit_visited=visitor.unit_visited,
        tools=json.dumps(visitor.tools),
        custom_tools=json.dumps(visitor.custom_tools),
        registered_by_id=registered_by_id
    )
    db.add(db_visitor)
    db.commit()
    db.refresh(db_visitor)
    return db_visitor

def update_visitor(db: Session, visitor_id: str, visitor: VisitorUpdate):
    db_visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if db_visitor:
        update_data = visitor.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field in ['tools', 'custom_tools']:
                setattr(db_visitor, field, json.dumps(value))
            else:
                setattr(db_visitor, field, value)
        db.commit()
        db.refresh(db_visitor)
    return db_visitor

def checkout_visitor(db: Session, visitor_id: str, checked_out_by_id: str):
    db_visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if db_visitor:
        db_visitor.time_out = datetime.utcnow()
        db_visitor.status = "checked-out"
        db_visitor.checked_out_by_id = checked_out_by_id
        db.commit()
        db.refresh(db_visitor)
    return db_visitor

def delete_visitor(db: Session, visitor_id: str):
    db_visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if db_visitor:
        db.delete(db_visitor)
        db.commit()
    return db_visitor

# Audit Log CRUD
def get_audit_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()

def create_audit_log(db: Session, audit_log: AuditLogCreate, performed_by_id: str):
    db_audit_log = AuditLog(
        action=audit_log.action,
        performed_by_id=performed_by_id,
        details=audit_log.details,
        category=audit_log.category
    )
    db.add(db_audit_log)
    db.commit()
    db.refresh(db_audit_log)
    return db_audit_log

# Tool CRUD
def get_tools(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Tool).offset(skip).limit(limit).all()

def get_tool_by_name(db: Session, name: str):
    return db.query(Tool).filter(Tool.name == name).first()

def create_tool(db: Session, tool: ToolCreate):
    db_tool = Tool(name=tool.name)
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    return db_tool

def delete_tool(db: Session, name: str):
    db_tool = db.query(Tool).filter(Tool.name == name).first()
    if db_tool:
        db.delete(db_tool)
        db.commit()
    return db_tool

# Category CRUD
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Category).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: str):
    return db.query(Category).filter(Category.id == category_id).first()

def create_category(db: Session, category: CategoryCreate):
    db_category = Category(
        name=category.name,
        value=category.value,
        color=category.color,
        icon=category.icon,
        is_active=category.is_active
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: str, category: CategoryUpdate):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        update_data = category.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: str):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category
