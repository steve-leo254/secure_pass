---
description: Super Admin Login Workflow
---

# Super Admin Login Workflow

This workflow describes the process for super admin authentication.

## Route

- **Login Page**: `/super-admin-login` - Dedicated Super Admin Login page

## Login Process

1. Navigate to `/super-admin-login`
2. Enter super admin credentials:
   - Username: Email prefix used during registration
   - Password: Password set during registration
3. Click "Login as Super Admin"
4. System validates credentials
5. On success: Redirect to `/admin` (Super Admin Dashboard)
6. On failure: Show error message

## Authentication Flow

1. Frontend sends POST request to `/login` endpoint
2. Backend checks User table for credentials
3. If valid, returns JWT token and user info
4. Frontend updates AuthContext with user data
5. Redirect based on user role (superadmin → `/admin`)

## Backend Endpoints

- `POST /login` - Authenticates any user including super admin
- Returns: `{ access_token, token_type, user, message }`

## Security Notes

- Super admin credentials are stored in User table for authentication
- System User table stores admin management data
- Password is hashed before storage
- Login attempts are logged for security

## Current Working Credentials

- **Super Admin**: `fresh` / `admin123` (Owner of system) → Routes to `/admin`
- **Admin**: `admin` / `admin123` (Property Manager) → Routes to `/dashboard`  
- **Security**: `security` / `security123` (Gate Man) → Routes to `/dashboard`

## Role Mapping

- **Database Role**: `superadmin` → Frontend Route: `/admin`
- **Database Role**: `admin` → Frontend Route: `/dashboard`
- **Database Role**: `security` → Frontend Route: `/dashboard`
