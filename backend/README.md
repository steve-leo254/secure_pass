# SecurePass Backend API

FastAPI backend for the SecurePass visitor management system.

## Setup Instructions

1. **Create and activate virtual environment:**
   ```bash
   cd backend
   python -m venv fastapi_env
   .\fastapi_env\Scripts\activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   uvicorn app:app --reload
   ```

The server will run on `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /login` - User authentication

### Users
- `GET /users/me` - Get current user info

### Visitors
- `GET /visitors` - Get all visitors
- `POST /visitors` - Create a new visitor
- `PUT /visitors/{visitor_id}` - Update visitor details
- `PUT /visitors/{visitor_id}/checkout` - Check out a visitor
- `DELETE /visitors/{visitor_id}` - Delete visitor record

### Audit Logs
- `GET /audit-logs` - Get all audit logs
- `POST /audit-logs` - Create new audit log entry

### Tools Management
- `GET /tools` - Get all available tools
- `POST /tools` - Add new tool
- `DELETE /tools/{tool_name}` - Remove tool

### Categories Management
- `GET /categories` - Get all visitor categories
- `POST /categories` - Add new category
- `PUT /categories/{category_id}` - Update category
- `DELETE /categories/{category_id}` - Delete category

### System
- `GET /` - API health check
- `GET /settings` - Get system settings

## Default Users
- **Admin:** username: `admin`, password: `admin123`
- **Security:** username: `security`, password: `security123`  
- **Guard:** username: `guard2`, password: `guard123`

## Login Debugging
If you encounter login issues, visit `http://localhost:8000/debug/users` to see:
- Available users in the database
- Password hash verification
- Test password validation

## Enhanced Error Messages
The login system now provides detailed error messages:
- Shows which usernames are available if user not found
- Indicates if password is incorrect for existing user
- Returns success message with user role information

## Database
The backend uses SQLite database (`securepass.db`) which is automatically created and seeded with initial data.

## Example Usage

### Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Visitors
```bash
curl -X GET http://localhost:8000/visitors
```

### Create Visitor
```bash
curl -X POST http://localhost:8000/visitors \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","phone_number":"1234567890","id_number":"123456","category":"visitor","purpose":"Meeting","gender":"male","unit_visited":"Office"}'
```

## Technology Stack
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **SQLite** - Database
- **Python 3.14** - Runtime environment
