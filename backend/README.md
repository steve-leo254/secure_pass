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
- `PUT /visitors/{visitor_id}/checkout` - Check out a visitor

### System
- `GET /` - API health check
- `GET /settings` - Get system settings

## Default Users
- **Admin:** username: `admin`, password: `admin123`
- **Security:** username: `security`, password: `security123`
- **Guard:** username: `guard2`, password: `guard123`

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
