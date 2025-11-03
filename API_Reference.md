# Unified Inbox App — API Reference

This document provides a **complete reference** for the Unified Inbox App API built with **Next.js (App Router)**, **Prisma**, **Supabase**, **Twilio**, and **NextAuth**.

All endpoints require authentication (via NextAuth session cookies) unless otherwise noted.  
The app uses Twilio APIs for **sending and receiving messages** across SMS and WhatsApp channels.

---

## Base URL

http://localhost:3000/api


When deployed, replace with your production domain (e.g., `https://yourdomain.com/api`).

---

## Authentication Overview

- Authentication is managed using **NextAuth Credentials Provider**.  
- Upon successful login, a secure session cookie is set.  
- All subsequent API calls automatically use that session cookie.  
- You can also manually include a session token in requests via Postman for testing.

---

# Endpoints

##  Auth API — `/api/auth/[...nextauth]`

### POST `/api/auth/callback/credentials`

**Purpose:**  
Authenticate an existing user with email and password.

**Request Body Example:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}

Response Example (200 OK):

{
  "user": {
    "id": "cmhgxa34c0007l0dcfm5oipwz",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "VIEWER"
  }
}


#Error Response

| Code | Message             | Description                  |
| ---- | ------------------- | ---------------------------- |
| 400  | Missing credentials | Email or password missing    |
| 401  | Invalid password    | Password does not match      |
| 404  | User not found      | No matching user in database |


#Database Relations:
Reads and validates user record in User table.

 Contacts API — /api/contacts
GET /api/contacts

#Purpose:
Fetch all contacts created by the authenticated user.

Response Example (200 OK):

[
  {
    "id": "cmhcontact001",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+911234567890",
    "createdAt": "2025-11-03T10:00:00Z"
  }
]

