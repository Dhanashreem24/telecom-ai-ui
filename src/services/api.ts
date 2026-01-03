const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/local/chat";

export async function sendMessage(
  text: string,
  userId: string
): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, user_id: userId }),
  });

  if (!res.ok) {
    throw new Error("Server error");
  }

  const data = await res.json();
  return data.reply;
}
