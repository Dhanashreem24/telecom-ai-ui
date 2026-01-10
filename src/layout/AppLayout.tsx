import ChatWindow from "../components/ChatWindow";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <ChatWindow />
    </div>
  );
}
