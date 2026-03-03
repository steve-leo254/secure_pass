---
description: Super Admin Registration Workflow
---

# Super Admin Registration Workflow

This workflow describes the process for registering a new super admin account.

## Routes

- **Registration**: `/super-admin-register` - Super Admin Registration page
- **Login**: `/super-admin-login` - Super Admin Login page  
- **Dashboard**: `/admin` - Super Admin Dashboard (after login)

## Registration Process

1. Navigate to `/super-admin-register`
2. Fill out the registration form:
   - Username
   - Full Name  
   - Email
   - Password
   - Confirm Password
3. Submit the form
4. System creates:
   - System User record (for admin management)
   - Login User record (for authentication)
5. Redirect to success page
6. Navigate to `/super-admin-login` to authenticate

## Login Process

1. Navigate to `/super-admin-login`
2. Enter credentials:
   - Username: Email prefix from registration
   - Password: Password from registration
3. System authenticates and redirects to `/admin`

## Backend Endpoints

- `POST /superadmin/register` - Creates super admin account
- `POST /login` - Authenticates super admin
- `GET /staff` - Returns staff users including super admin

## Notes

- Super admin registration creates both System User and Login records
- Username for login is derived from email prefix
- Default redirect after successful login is `/admin`
- Only one super admin can exist at a time
