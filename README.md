# 📬 Unified Inbox App

A **Next.js + Supabase + Prisma + Twilio** powered web application that unifies messages from **multiple communication channels** (SMS & WhatsApp via Twilio) into one clean dashboard.  
Users can send and receive messages, manage contacts, notes, and schedules — all within a single workspace.

---

## 🧩 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Database Schema](#database-schema)
5. [Entity Relationship Diagram](#entity-relationship-diagram)
6. [API Reference](#api-reference)
7. [Environment Variables](#environment-variables)
8. [Running Locally](#running-locally)
9. [Testing the APIs](#testing-the-apis)
10. [Twilio Integration Flow](#twilio-integration-flow)
11. [Troubleshooting](#troubleshooting)

---

## 🧠 Overview

The **Unified Inbox App** centralizes communication across platforms like **SMS** and **WhatsApp** using **Twilio APIs**.  
Users can:
- Authenticate securely with **NextAuth**
- Manage contacts, notes, and schedules
- Send and receive messages from Twilio
- View analytics (future enhancement)
- Collaborate on messages and notes (planned feature)

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | **Next.js 14 (App Router)** + **TypeScript / React** |
| Styling | **Tailwind CSS** |
| Auth | **NextAuth (Credentials Provider)** |
| Database | **PostgreSQL (via Supabase)** |
| ORM | **Prisma** |
| Messaging | **Twilio API (SMS + WhatsApp Sandbox)** |
| Hosting | Vercel (Frontend) / Supabase (DB) |

---

## 🏗️ Folder Structure
📦 unified-inbox/
├── app/
│ ├── api/
│ │ ├── auth/[...nextauth]/route.ts
│ │ ├── contacts/route.ts
│ │ ├── messages/route.ts
│ │ ├── notes/route.ts
│ │ ├── schedules/route.ts
│ │ └── twilio/
│ │ ├── send/route.ts
│ │ └── webhook/route.ts
│ ├── dashboard/page.tsx
│ ├── login/page.tsx
│ └── signup/page.tsx
├── lib/
│ ├── prisma.ts
│ └── safeFetch.ts
├── prisma/
│ └── schema.prisma
├── components/
│ ├── ContactList.tsx
│ ├── MessageThread.tsx
│ ├── AddNoteForm.tsx
│ ├── AddScheduleForm.tsx
│ └── ContactProfileModal.tsx
├── .env
└── README.md


---

## 🗄️ Database Schema

### Prisma Models
```prisma
model User {
  id        String     @id @default(cuid())
  name      String?
  email     String     @unique
  password  String?
  role      Role       @default(VIEWER)
  contacts  Contact[]
  messages  Message[]
  notes     Note[]
  schedules Schedule[]
  createdAt DateTime   @default(now())
}

model Contact {
  id        String     @id @default(cuid())
  name      String
  email     String?
  phone     String?
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  messages  Message[]
  notes     Note[]
  schedules Schedule[]
  createdAt DateTime   @default(now())
}

model Message {
  id         String    @id @default(cuid())
  subject    String
  body       String
  direction  String    // "incoming" | "outgoing"
  userId     String
  contactId  String
  user       User      @relation(fields: [userId], references: [id])
  contact    Contact   @relation(fields: [contactId], references: [id])
  createdAt  DateTime  @default(now())
}

model Note {
  id         String          @id @default(cuid())
  title      String
  content    String
  visibility NoteVisibility  @default(PRIVATE)
  userId     String
  contactId  String?
  user       User            @relation(fields: [userId], references: [id])
  contact    Contact?        @relation(fields: [contactId], references: [id])
  createdAt  DateTime        @default(now())
}

model Schedule {
  id          String          @id @default(cuid())
  title       String
  description String?
  date        DateTime
  status      ScheduleStatus  @default(SCHEDULED)
  userId      String
  contactId   String?
  user        User            @relation(fields: [userId], references: [id])
  contact     Contact?        @relation(fields: [contactId], references: [id])
  createdAt   DateTime        @default(now())
}

enum Role {
  ADMIN
  VIEWER
}

enum NoteVisibility {
  PUBLIC
  PRIVATE
}

enum ScheduleStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
}



