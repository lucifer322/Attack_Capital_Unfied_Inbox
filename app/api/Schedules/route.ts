import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// ✅ GET all schedules for current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      schedules: {
        include: { contact: true },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user.schedules);
}

// ✅ POST new schedule
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, contactId, date } = await req.json();

    if (!title || !contactId || !date) {
      return NextResponse.json(
        { error: "Title, contactId, and date are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if contact belongs to this user
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId: user.id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found or not yours" },
        { status: 400 }
      );
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        title,
        description,
        date: new Date(date),
        userId: user.id,
        contactId,
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (err) {
    console.error("Error creating schedule:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
