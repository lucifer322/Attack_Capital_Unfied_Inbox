import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const body = formData.get("Body") as string;

    // ✅ Find which user's Twilio account this message belongs to
    const twilioAccount = await prisma.twilioAccount.findUnique({
      where: { phoneNumber: to },
      include: { user: true},
    });

    if (!twilioAccount) {
      console.warn(`⚠️ No Twilio account found for phone number: ${to}`);
      return NextResponse.json({ error: "Unknown Twilio number" }, { status: 400 });
    }

    const userId = twilioAccount.user.id;
     console.log(from);
    // Create or connect the contact for this sender
    const contact = await prisma.contact.upsert({
      where: {
        userId_phone:{userId:twilioAccount.userId ,phone: from} 
      },
      update: {},
      create: { name: from, phone: from, userId },
    });

    // Save message linked to the user
    await prisma.message.create({
      data: {
        subject: "Incoming Twilio Message",
        body,
        userId,
        contactId: contact.id,
        direction: "incoming"
      },
    });

    return new Response(
      `<Response><Message>Message received!</Message></Response>`,
      {
        headers: { "Content-Type": "text/xml" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
