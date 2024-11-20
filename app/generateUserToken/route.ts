import {StreamClient, UserRequest} from '@stream-io/node-sdk';
import {NextResponse} from "next/server";

const apiKey = process.env.API_GET_STREAM_PUBLISHABLE_KEY;
const secret = process.env.API_GET_STREAM_SECRET_KEY;

if(!apiKey || !secret) {
  return res.status(500).json({ error: "Missing API Key" });
}

const client = new StreamClient(apiKey, secret);

export async function POST(req: Request, res: Response) {
  const { userId, name, image, email } = await req.json();

  const newUser: UserRequest = {
    id: userId,
    role: 'user',
    name,
    image,
    custom: {
      email,
    }
  };

  await client.upsertUsers([newUser]);

  const validity = 60 * 60 * 24 * 7;

  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: validity,
  });

  console.log("Generating token for user:", userId, 'and validity:', validity);

  return NextResponse.json({
    token
  });

}
