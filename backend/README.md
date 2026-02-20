# SecurePass Backend API

Simple HTTP server for the SecurePass visitor management system.

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   python simple_server.py
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
