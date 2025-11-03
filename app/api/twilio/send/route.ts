// app/api/twilio/send/route.ts
import { NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, body } = await req.json();

    const isWhatsApp = to.startsWith("whatsapp:");

   const twilioAccount = await prisma.twilioAccount.findFirst({
     where: {
        userId: session.user.id,
        channelType: isWhatsApp ? "whatsapp" : "sms",
     }, 
   });

   if (!twilioAccount) {
     return NextResponse.json(
       { error: `No Twilio ${isWhatsApp ? "WhatsApp" : "SMS"} account found for this user` },
       { status: 400 }
    ); 
    }

    const client = twilio(twilioAccount.accountSid, twilioAccount.authToken);
 
    const message = await client.messages.create({
        body,
        from:twilioAccount.phoneNumber,
        to,
  });

    // Save in DB
    const contact = await prisma.contact.upsert({
      where: {
        userId_phone: { userId: session.user.id, phone: to }, // compound key
      },
      update: {},
      create: { name: to, phone: to, userId: session.user.id },
    });

    await prisma.message.create({
      data: {
        subject: "Outgoing Twilio Message",
        body,
        userId: session.user.id,
        contactId: contact.id,
        direction: "outgoing"
      },
    });

    return NextResponse.json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error("Twilio send error:", error);
    return NextResponse.json(
      { error: "Send failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
