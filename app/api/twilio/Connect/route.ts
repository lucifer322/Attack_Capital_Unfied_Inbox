import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accountSid, authToken, phoneNumber,channelType } = await req.json();
   //console.warn(channelType , accountSid, authToken, phoneNumber);

  if (!accountSid || !authToken || !phoneNumber) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const twilioAccount = await prisma.twilioAccount.upsert({
    where: { phoneNumber },
    update: { accountSid, authToken },
    create: {
      accountSid,
      authToken,
      phoneNumber,
      channelType,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, twilioAccount });
}
