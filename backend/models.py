from sqlalchemy import create_engine, Column, String, DateTime, Boolean, Text, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: f"usr-{uuid.uuid4().hex[:8]}")
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    
    # Relationships
    registered_visitors = relationship("Visitor", foreign_keys="Visitor.registered_by_id", back_populates="registered_by")
    checked_out_visitors = relationship("Visitor", foreign_keys="Visitor.checked_out_by_id", back_populates="checked_out_by")
    audit_logs = relationship("AuditLog", back_populates="performed_by_user")

class Visitor(Base):
    __tablename__ = "visitors"
    
    id = Column(String, primary_key=True, default=lambda: f"vis-{uuid.uuid4().hex[:8]}")
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    id_number = Column(String, nullable=False)
    category = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    unit_visited = Column(String, nullable=False)
    tools = Column(Text, default="[]")  # Store as JSON string
    custom_tools = Column(Text, default="[]")  # Store as JSON string
    time_in = Column(DateTime, default=datetime.utcnow)
    time_out = Column(DateTime, nullable=True)
    status = Column(String, default="checked-in")
    registered_by_id = Column(String, ForeignKey("users.id"))
    checked_out_by_id = Column(String, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    registered_by = relationship("User", foreign_keys=[registered_by_id], back_populates="registered_visitors")
    checked_out_by = relationship("User", foreign_keys=[checked_out_by_id], back_populates="checked_out_visitors")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=lambda: f"audit-{uuid.uuid4().hex[:8]}")
    action = Column(String, nullable=False)
    performed_by_id = Column(String, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=False)
    category = Column(String, nullable=True)
    
    # Relationships
    performed_by_user = relationship("User", back_populates="audit_logs")

class Tool(Base):
    __tablename__ = "tools"
    
    id = Column(String, primary_key=True, default=lambda: f"tool-{uuid.uuid4().hex[:8]}")
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True, default=lambda: f"cat-{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    color = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Database configuration
DATABASE_URL = "sqlite:///./securepass.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
