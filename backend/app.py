from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime

# Import models, schemas, CRUD operations, and database
from models import User, Visitor, AuditLog, Tool, Category
from schemas import (
    User as UserSchema, UserResponse, LoginRequest, LoginResponse,
    Visitor as VisitorSchema, VisitorCreate, VisitorUpdate,
    AuditLog as AuditLogSchema, AuditLogCreate,
    Tool as ToolSchema, ToolCreate,
    Category as CategorySchema, CategoryCreate, CategoryUpdate,
    SystemSettings
)
from crud import (
    get_user_by_username, get_users, create_user,
    get_visitors, get_visitor, create_visitor, update_visitor, checkout_visitor, delete_visitor,
    get_audit_logs, create_audit_log,
    get_tools, get_tool_by_name, create_tool, delete_tool,
    get_categories, get_category, create_category, update_category, delete_category,
    hash_password
)
from database import get_db, create_tables

app = FastAPI(title="SecurePass API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Routes
@app.get("/")
async def root():
    return {"message": "SecurePass API is running with SQLAlchemy"}

@app.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    """Debug endpoint to show available users and their password hashes"""
    users = get_users(db)
    return {
        "users": [
            {
                "id": user.id,
                "username": user.username, 
                "name": user.name,
                "role": user.role,
                "password_hash": user.hashed_password[:20] + "...",
                "test_passwords": {
                    "admin123": hash_password("admin123") == user.hashed_password,
                    "security123": hash_password("security123") == user.hashed_password,
                    "guard123": hash_password("guard123") == user.hashed_password
                }
            }
            for user in users
        ]
    }

@app.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = get_user_by_username(db, request.username)
    
    # Enhanced error messages for debugging
    if not user:
        raise HTTPException(
            status_code=401, 
            detail=f"User '{request.username}' not found. Available users: admin, security, guard2"
        )
    
    # Verify password
    if user.hashed_password != hash_password(request.password):
        raise HTTPException(
            status_code=401, 
            detail=f"Invalid password for user '{request.username}'. Please check your credentials."
        )
    
    # Successful login
    return LoginResponse(
        access_token="simple_token",
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            username=user.username,
            name=user.name,
            role=user.role
        ),
        message=f"Login successful for {user.name} ({user.role})"
    )

@app.get("/users/me", response_model=UserResponse)
async def get_current_user(db: Session = Depends(get_db)):
    user = get_user_by_username(db, "admin")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        username=user.username,
        name=user.name,
        role=user.role
    )

@app.get("/visitors", response_model=List[VisitorSchema])
async def get_visitors_endpoint(db: Session = Depends(get_db)):
    visitors = get_visitors(db)
    
    # Convert JSON strings back to lists
    result = []
    for visitor in visitors:
        visitor_dict = {
            "id": visitor.id,
            "full_name": visitor.full_name,
            "phone_number": visitor.phone_number,
            "id_number": visitor.id_number,
            "category": visitor.category,
            "purpose": visitor.purpose,
            "gender": visitor.gender,
            "unit_visited": visitor.unit_visited,
            "tools": json.loads(visitor.tools) if visitor.tools else [],
            "custom_tools": json.loads(visitor.custom_tools) if visitor.custom_tools else [],
            "time_in": visitor.time_in,
            "time_out": visitor.time_out,
            "status": visitor.status,
            "registered_by": visitor.registered_by.name if visitor.registered_by else None,
            "checked_out_by": visitor.checked_out_by.name if visitor.checked_out_by else None,
        }
        result.append(visitor_dict)
    
    return result

@app.post("/visitors", response_model=dict)
async def create_visitor_endpoint(visitor_data: VisitorCreate, db: Session = Depends(get_db)):
    # Get admin user for registration
    admin_user = get_user_by_username(db, "admin")
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    # Create visitor
    visitor = create_visitor(db, visitor_data, admin_user.id)
    
    # Create audit log
    create_audit_log(
        db,
        AuditLogCreate(
            action="CHECK_IN",
            details=f"{visitor_data.full_name} checked in to {visitor_data.unit_visited}",
            category=visitor_data.category
        ),
        admin_user.id
    )
    
    return {"message": "Visitor created successfully", "id": visitor.id}

@app.put("/visitors/{visitor_id}", response_model=dict)
async def update_visitor_endpoint(visitor_id: str, visitor_data: VisitorUpdate, db: Session = Depends(get_db)):
    visitor = update_visitor(db, visitor_id, visitor_data)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    return {"message": "Visitor updated successfully"}

@app.put("/visitors/{visitor_id}/checkout", response_model=dict)
async def checkout_visitor_endpoint(visitor_id: str, db: Session = Depends(get_db)):
    # Get visitor
    visitor = get_visitor(db, visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    # Get security user for checkout
    security_user = get_user_by_username(db, "security")
    if not security_user:
        raise HTTPException(status_code=404, detail="Security user not found")
    
    # Checkout visitor
    checkout_visitor(db, visitor_id, security_user.id)
    
    # Create audit log
    create_audit_log(
        db,
        AuditLogCreate(
            action="CHECK_OUT",
            details=f"{visitor.full_name} checked out from {visitor.unit_visited}",
            category=visitor.category
        ),
        security_user.id
    )
    
    return {"message": "Visitor checked out successfully"}

@app.delete("/visitors/{visitor_id}", response_model=dict)
async def delete_visitor_endpoint(visitor_id: str, db: Session = Depends(get_db)):
    visitor = delete_visitor(db, visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    return {"message": "Visitor deleted successfully"}

@app.get("/audit-logs", response_model=List[AuditLogSchema])
async def get_audit_logs_endpoint(db: Session = Depends(get_db)):
    logs = get_audit_logs(db)
    
    # Convert to response format
    result = []
    for log in logs:
        log_dict = {
            "id": log.id,
            "action": log.action,
            "performed_by": log.performed_by_user.name if log.performed_by_user else "Unknown",
            "timestamp": log.timestamp,
            "details": log.details,
            "category": log.category,
        }
        result.append(log_dict)
    
    return result

@app.post("/audit-logs", response_model=dict)
async def create_audit_log_endpoint(log_data: AuditLogCreate, db: Session = Depends(get_db)):
    # Get admin user
    admin_user = get_user_by_username(db, "admin")
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    log = create_audit_log(db, log_data, admin_user.id)
    return {"message": "Audit log created successfully", "id": log.id}

@app.get("/tools", response_model=List[ToolSchema])
async def get_tools_endpoint(db: Session = Depends(get_db)):
    tools = get_tools(db)
    return tools

@app.post("/tools", response_model=dict)
async def create_tool_endpoint(tool: ToolCreate, db: Session = Depends(get_db)):
    # Check if tool already exists
    existing_tool = get_tool_by_name(db, tool.name)
    if existing_tool:
        raise HTTPException(status_code=400, detail="Tool already exists")
    
    new_tool = create_tool(db, tool)
    return {"message": "Tool added successfully"}

@app.delete("/tools/{tool_name}", response_model=dict)
async def delete_tool_endpoint(tool_name: str, db: Session = Depends(get_db)):
    tool = delete_tool(db, tool_name)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return {"message": "Tool removed successfully"}

@app.get("/categories", response_model=List[CategorySchema])
async def get_categories_endpoint(db: Session = Depends(get_db)):
    categories = get_categories(db)
    return categories

@app.post("/categories", response_model=dict)
async def create_category_endpoint(category: CategoryCreate, db: Session = Depends(get_db)):
    new_category = create_category(db, category)
    return {"message": "Category added successfully", "id": new_category.id}

@app.put("/categories/{category_id}", response_model=dict)
async def update_category_endpoint(category_id: str, category: CategoryUpdate, db: Session = Depends(get_db)):
    updated_category = update_category(db, category_id, category)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category updated successfully"}

@app.delete("/categories/{category_id}", response_model=dict)
async def delete_category_endpoint(category_id: str, db: Session = Depends(get_db)):
    category = delete_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

@app.get("/settings", response_model=SystemSettings)
async def get_settings_endpoint(db: Session = Depends(get_db)):
    tools = get_tools(db)
    categories = get_categories(db)
    
    return SystemSettings(
        tools=[tool.name for tool in tools],
        categories=categories
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
