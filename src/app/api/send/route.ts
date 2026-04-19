import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const { data, error } = await resend.emails.send({
      from: "info@coachplate.com",
      to: ["info@coachplate.com"],
      subject: "Hello world",
      react: EmailTemplate({ name: name}),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
