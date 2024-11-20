import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.API_GET_STREAM_PUBLISHABLE_KEY;
const secret = process.env.API_GET_STREAM_SECRET_KEY;

if(!apiKey || !secret) {
  return res.status(500).json({ error: "Missing API Key" });
}

export async function POST(req: Request, res: Response) {
  const { userId, name, image, email } = await req.json();

  client = new StreamClient(apiKey, secret);

  client = new StreamClient(apiKey, secret, { timeout: 3000 });

}
