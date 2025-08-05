import { Chat } from "@/components/custom/chat";
import { generateUUID } from "@/lib/utils";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default async function Page() {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
}
