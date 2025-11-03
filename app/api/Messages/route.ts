import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// ✅ GET all messages for current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const contactId = url.searchParams.get("contactId");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If contactId is provided, filter by it
    const whereClause = contactId
      ? { userId: user.id, contactId }
      : { userId: user.id };

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: { contact: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ POST a new message
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject, body, contactId } = await req.json();

    if (!subject || !body || !contactId) {
      return NextResponse.json(
        { error: "Subject, body, and contactId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure contact belongs to this user
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId: user.id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found or not yours" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        subject,
        body,
        userId: user.id,
        contactId,
        direction: "outgoing",
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("Error creating message:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
