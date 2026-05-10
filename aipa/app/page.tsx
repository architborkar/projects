"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  useEffect(() => {
    initializeApp();
  }, []);

  async function loadChat() {
    const response = await fetch("/api/load-chat");
    const data = await response.json();

    setChat(data);
  }

    async function initializeApp() {
    const response = await fetch(
      "/api/load-chat"
    );

    const existingChat = await response.json();

    if (existingChat.length > 0) {
      setChat(existingChat);
      return;
    }

    const startupResponse = await fetch(
      "/api/startup-message"
    );

    const startupData =
      await startupResponse.json();

    const startupChat = [
      {
        role: "ai",
        text: startupData.message,
      },
    ];

    setChat(startupChat);

    await fetch("/api/save-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat: startupChat,
      }),
    });
  }

  async function clearChat() {
  setChat([]);

  await fetch("/api/save-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat: [],
      }),
    });
  }

  async function sendMessage() {
    if (!message.trim()) return;

    const currentMessage = message;

    // Clear input immediately
    setMessage("");

    const newChat = [
      ...chat,
      {
        role: "user",
        text: currentMessage,
      },
    ];

    setChat(newChat);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentMessage,
      }),
    });

    const data = await response.json();

    await fetch("/api/route-memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentMessage,
      }),
    });

    const updatedChat = [
      ...newChat,
      {
        role: "ai",
        text: data.reply,
      },
    ];

    setChat(updatedChat);

    await fetch("/api/save-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat: updatedChat,
      }),
    });
  }

  return (
    <main className="h-screen bg-[#0f0f0f] text-white flex flex-col">

      {/* Header */}
      <div className="border-b border-gray-800 p-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold">
          AIPA
        </h1>

        <button
          onClick={clearChat}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm"
        >
          Clear Chat
        </button>

      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-80 bg-[#151515] border-r border-gray-800 p-4 space-y-4">

          <Link href="/business">
            <div className="bg-[#1e1e1e] hover:bg-[#2a2a2a] transition p-5 rounded-2xl cursor-pointer">
              <h2 className="font-bold text-lg">Business</h2>
              <p className="text-sm text-gray-400">
                Tasks & productivity
              </p>
            </div>
          </Link>

          <Link href="/diet">
            <div className="bg-[#1e1e1e] hover:bg-[#2a2a2a] transition p-5 rounded-2xl cursor-pointer">
              <h2 className="font-bold text-lg">Diet</h2>
              <p className="text-sm text-gray-400">
                Calories & nutrition
              </p>
            </div>
          </Link>

          <Link href="/exercise">
            <div className="bg-[#1e1e1e] hover:bg-[#2a2a2a] transition p-5 rounded-2xl cursor-pointer">
              <h2 className="font-bold text-lg">Exercise</h2>
              <p className="text-sm text-gray-400">
                Workout tracking
              </p>
            </div>
          </Link>

        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {chat.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xl p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-green-600 ml-auto"
                    : "bg-[#1e1e1e]"
                }`}
              >
                <div className="whitespace-pre-wrap leading-7">
                  {msg.text}
                </div>
              </div>
            ))}

          </div>

          {/* Input */}
          <div className="border-t border-gray-800 p-4 flex gap-3">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Message AIPA..."
              className="flex-1 bg-[#1e1e1e] border border-gray-700 rounded-2xl px-4 py-3 outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-green-600 hover:bg-green-700 transition px-6 rounded-2xl"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}