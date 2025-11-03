#  Unified Inbox App — API Reference

This document provides a **complete reference** for the Unified Inbox App API built with **Next.js (App Router)**, **Prisma**, **Supabase**, **Twilio**, and **NextAuth**.

All endpoints require authentication (via NextAuth session cookies) unless otherwise noted.  
The app uses Twilio APIs for **sending and receiving messages** across SMS and WhatsApp channels.

---

##  Base URL

```
http://localhost:3000/api
```

When deployed, replace with your production domain (e.g., `https://yourdomain.com/api`).

---

##  Authentication Overview

- Authentication is managed using **NextAuth Credentials Provider**.  
- Upon successful login, a secure session cookie is set.  
- All subsequent API calls automatically use that session cookie.  
- You can also manually include a session token in requests via Postman for testing.

---

#  Endpoints

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
```

**Response Example (200 OK):**
```json
{
  "user": {
    "id": "cmhgxa34c0007l0dcfm5oipwz",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "VIEWER"
  }
}
```

**Error Responses:**
| Code | Message | Description |
|------|----------|-------------|
| 400 | Missing credentials | Email or password missing |
| 401 | Invalid password | Password does not match |
| 404 | User not found | No matching user in database |

**Database Relations:**  
Reads and validates user record in `User` table.

---

##  Contacts API — `/api/contacts`

### GET `/api/contacts`

**Purpose:**  
Fetch all contacts created by the authenticated user.

**Response Example (200 OK):**
```json
[
  {
    "id": "cmhcontact001",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+911234567890",
    "createdAt": "2025-11-03T10:00:00Z"
  }
]
```

**Error Responses:**
| Code | Message |
|------|----------|
| 401 | Unauthorized |
| 500 | Internal Server Error |

---

### POST `/api/contacts`

**Purpose:**  
Create a new contact for the logged-in user.

**Request Body Example:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+911234567890"
}
```

**Response Example (201 Created):**
```json
{
  "id": "cmhcontact001",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+911234567890",
  "userId": "cmhgxa34c0007l0dcfm5oipwz",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

**Error Responses:**
| Code | Message |
|------|----------|
| 400 | Invalid or missing fields |
| 401 | Unauthorized |
| 500 | Internal Server Error |

**Database Relations:**  
Creates a new `Contact` entry linked to the `User` via `userId`.

---

##  Messages API — `/api/messages`

### GET `/api/messages`

**Purpose:**  
Fetch all messages for the logged-in user.

**Query Parameters:**
| Key | Type | Required | Description |
|-----|------|-----------|-------------|
| `contactId` | string | optional | Filter messages by a contact ID |

**Example Request:**
```
GET /api/messages?contactId=cmhcontact001
```

**Response Example (200 OK):**
```json
[
  {
    "id": "cmhmsg001",
    "subject": "Follow-up",
    "body": "Hello Alice, checking in regarding your request.",
    "direction": "outgoing",
    "contact": {
      "id": "cmhcontact001",
      "name": "Alice Johnson",
      "phone": "+911234567890"
    },
    "createdAt": "2025-11-03T08:25:12.000Z"
  }
]
```

**Error Responses:**
| Code | Message | Description |
|------|----------|-------------|
| 401 | Unauthorized | Session missing or invalid |
| 404 | User not found | No valid user record |
| 500 | Internal Server Error | Unexpected Prisma or DB issue |

---

### POST `/api/messages`

**Purpose:**  
Create a new outgoing message and link it to a contact.

**Request Body Example:**
```json
{
  "subject": "Meeting Reminder",
  "body": "Don’t forget our 5 PM catch-up!",
  "contactId": "cmhcontact001"
}
```

**Response Example (201 Created):**
```json
{
  "id": "cmhmsg002",
  "subject": "Meeting Reminder",
  "body": "Don’t forget our 5 PM catch-up!",
  "direction": "outgoing",
  "contactId": "cmhcontact001",
  "userId": "cmhgxa34c0007l0dcfm5oipwz",
  "createdAt": "2025-11-03T08:25:12.000Z"
}
```

**Database Relations:**  
Creates a record in `Message` linked to `User` and `Contact`.

---

##  Notes API — `/api/notes`

### GET `/api/notes`

**Purpose:**  
Fetch all notes created by the user or linked to a specific contact.

**Query Parameters:**
| Key | Type | Required | Description |
|-----|------|-----------|-------------|
| `contactId` | string | optional | Filter notes by contact ID |

**Response Example (200 OK):**
```json
[
  {
    "id": "cmhnote001",
    "title": "Client Preferences",
    "content": "Alice prefers communication via WhatsApp.",
    "visibility": "PRIVATE",
    "createdAt": "2025-11-03T09:00:00Z"
  }
]
```

---

### POST `/api/notes`

**Purpose:**  
Add a new note for the logged-in user or a contact.

**Request Body Example:**
```json
{
  "title": "Meeting Follow-up",
  "content": "Call Alice after demo.",
  "visibility": "PRIVATE",
  "contactId": "cmhcontact001"
}
```

**Response Example (201 Created):**
```json
{
  "id": "cmhnote002",
  "title": "Meeting Follow-up",
  "content": "Call Alice after demo.",
  "visibility": "PRIVATE",
  "userId": "cmhgxa34c0007l0dcfm5oipwz",
  "createdAt": "2025-11-03T09:05:00Z"
}
```

**Database Relations:**  
Linked to `User`, optionally to `Contact`.

---

##  Schedules API — `/api/schedules`

### GET `/api/schedules`

**Purpose:**  
Fetch all upcoming schedules for the user.

**Query Parameters:**
| Key | Type | Required | Description |
|-----|------|-----------|-------------|
| `contactId` | string | optional | Filter schedules by contact |

**Response Example (200 OK):**
```json
[
  {
    "id": "cmhsched001",
    "title": "Project Demo",
    "description": "Walkthrough for client",
    "date": "2025-11-05T14:30:00Z",
    "status": "SCHEDULED",
    "contact": {
      "id": "cmhcontact001",
      "name": "Alice Johnson"
    }
  }
]
```

---

### POST `/api/schedules`

**Purpose:**  
Add a new schedule for a user or contact.

**Request Body Example:**
```json
{
  "title": "Follow-up Call",
  "description": "Discuss feedback after demo.",
  "date": "2025-11-04T09:30:00Z",
  "contactId": "cmhcontact001"
}
```

**Response Example (201 Created):**
```json
{
  "id": "cmhsched002",
  "title": "Follow-up Call",
  "description": "Discuss feedback after demo.",
  "status": "SCHEDULED",
  "date": "2025-11-04T09:30:00Z"
}
```

**Database Relations:**  
Each schedule links to one `User` and optionally one `Contact`.

---

##  Twilio Connect API — `/api/twilio/connect`

**Purpose:**  
Store Twilio account credentials (Account SID and Auth Token) for a user.

**Request Body Example:**
```json
{
  "accountSid": "ACxxxxxxxxxxxxxxxxxxxx",
  "authToken": "your_auth_token"
}
```

**Response Example (201 Created):**
```json
{
  "id": "cmhtwilio001",
  "userId": "cmhgxa34c0007l0dcfm5oipwz",
  "accountSid": "ACxxxxxxxxxxxxxxxxxxxx",
  "createdAt": "2025-11-03T08:40:00Z"
}
```

---

##  Twilio Send API — `/api/twilio/send`

**Purpose:**  
Send an outgoing message via Twilio (SMS or WhatsApp).

**Request Body Example:**
```json
{
  "to": "whatsapp:+919876543210",
  "body": "Hello from Unified Inbox!"
}
```

**Response Example (200 OK):**
```json
{
  "sid": "SMxxxxxxxxxxxxxxxxxxxx",
  "status": "queued",
  "channel": "whatsapp"
}
```

**Error Responses:**
| Code | Message |
|------|----------|
| 400 | Invalid From/To pair |
| 401 | Unauthorized |
| 500 | Twilio API error |

---

##  Twilio Webhook API — `/api/twilio/webhook`

**Purpose:**  
Receive and store incoming messages from Twilio (SMS/WhatsApp).

**Twilio Configuration:**  
- Set webhook URL to:  
  ```
  https://<your-ngrok-or-vercel-url>/api/twilio/webhook
  ```

**Example Incoming Request (from Twilio):**
```json
{
  "SmsMessageSid": "SMxxxxxxxxxxxxxxxxxxxx",
  "From": "whatsapp:+919876543210",
  "To": "whatsapp:+14155238886",
  "Body": "Hi, is this the support line?"
}
```

**Server Behavior:**
1. Validates session & Twilio signature (optional)
2. Finds or creates the `Contact` using `From` phone number
3. Saves message to `Message` table (`direction: "incoming"`)
4. Returns 200 OK

**Response Example:**
```json
{
  "success": true,
  "message": "Message received and stored."
}
```

---

#  Testing Instructions

###  In Postman
1. Login first (POST `/api/auth/callback/credentials`)
2. Use the returned cookies automatically (Postman will manage them)
3. Test other endpoints with those session cookies
4. For Twilio webhook, use **ngrok** to expose local port:
   ```bash
   npx ngrok http 3000
   ```
   and set Twilio sandbox webhook to your public ngrok URL.

---

#  Database Relation Map (Quick Summary)

| Table | Key Relationships |
|--------|--------------------|
| `User` | Has many `Contacts`, `Messages`, `Notes`, `Schedules`, `TwilioAccount` |
| `Contact` | Belongs to one `User`; has many `Messages`, `Notes`, `Schedules` |
| `Message` | Belongs to `User` and `Contact`; has direction (incoming/outgoing) |
| `Note` | Belongs to `User`; optionally linked to a `Contact` |
| `Schedule` | Belongs to `User`; optionally linked to a `Contact` |
| `TwilioAccount` | Belongs to `User` (stores Twilio credentials) |

---

#  Tips
- Always ensure session cookie or token is present.
- Test `contactId` filters to confirm message and note associations.
- Twilio “Invalid From/To” means you’re mixing channels (SMS vs WhatsApp).
- Use ngrok for local webhook testing.

---

© 2025 Unified Inbox Project Team — All rights reserved.
