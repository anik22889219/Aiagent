# Authentication SOP

**Objective:**
Implement a secure JWT-based authentication system with role-based access.

**Inputs:**
- Email
- Password
- User role (admin/operator)
- Refresh token for renewing access tokens

**Expected Outputs:**
- Access and refresh JWT tokens on login/register
- `me` endpoint returns user profile except password
- Middleware protects routes and enforces roles

**Tools/Scripts to Use:**
- bcryptjs for password hashing
- jsonwebtoken for token generation/verification
- express middleware for auth

**Edge Cases:**
- Missing credentials
- Invalid email or password
- Duplicate registrations
- Expired/invalid tokens

**Error Handling:**
- 401 for unauthorized
- 403 for forbidden
- 422 for validation errors
- 500 for server errors

**Rate Limits:**
- Apply express-rate-limit to auth endpoints if necessary

**Notes:**
This directive guides the creation of `authController`, `auth` route, and `auth` middleware. Update when refresh logic or OAuth providers are added.
