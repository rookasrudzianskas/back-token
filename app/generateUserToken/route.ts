import { StreamClient, UserRequest } from '@stream-io/node-sdk';
import { NextResponse } from "next/server";

const apiKey = process.env.API_GET_STREAM_PUBLISHABLE_KEY;
const secret = process.env.API_GET_STREAM_SECRET_KEY;

if (!apiKey || !secret) {
  throw new Error("Missing API Key or Secret Key in environment variables");
}

const client = new StreamClient(apiKey, secret);

export async function POST(req: Request) {
  try {
    const { userId, name, image, email } = await req.json();

    if (!userId || !name || !image || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newUser: UserRequest = {
      id: userId,
      role: 'user',
      name,
      image,
      custom: {
        email,
      },
    };

    await client.upsertUsers([newUser]);

    const validity = 60 * 60 * 24 * 7; // 1 week
    const token = client.createUserToken(userId, validity);

    console.log("Generating token for user:", userId, 'with validity:', validity);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
