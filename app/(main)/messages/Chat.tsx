"use client";

import { Loader2 } from "lucide-react";
import useInitializeChatClient from "./useInitializeChatClient";

import { Chat as StreamChat } from "stream-chat-react";
import ChatSidebar from "./ChatSidebar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";
import { useState } from "react";
import { set } from "date-fns";

export default function Chat() {
  // We need to initialize the chatClient for one time only. So that's why we wrote useInitializeChatClient hook.
  const chatClient = useInitializeChatClient();

  const { resolvedTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }
  return (
    <main className="relative w-full overflow-hidden rounded-lg border-[1px] bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          theme={
            resolvedTheme == "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
          client={chatClient}
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}
