"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DietPage() {
  const [dietGoals, setDietGoals] = useState("");
  const [dailyLogs, setDailyLogs] = useState("");
  const [aiNotes, setAiNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const response = await fetch("/api/load-diet");
    const data = await response.json();

    setDietGoals(data.dietGoals || "");
    setDailyLogs(data.dailyLogs || "");
    setAiNotes(data.aiNotes || "");
  }

  async function saveData() {
    await fetch("/api/save-diet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dietGoals,
        dailyLogs,
        aiNotes,
      }),
    });

    alert("Diet data saved");
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-8">

      <Link
        href="/"
        className="inline-block mb-6 text-gray-400 hover:text-white"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        Diet Module
      </h1>

      <div className="space-y-6">

        {/* Goals */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">
            Diet Goals
          </h2>

          <textarea
            value={dietGoals}
            onChange={(e) =>
              setDietGoals(e.target.value)
            }
            className="w-full h-48 bg-[#1e1e1e] border border-gray-700 rounded-2xl p-4"
          />
        </div>

        {/* Logs */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">
            Daily Logs
          </h2>

          <textarea
            value={dailyLogs}
            onChange={(e) =>
              setDailyLogs(e.target.value)
            }
            className="w-full h-48 bg-[#1e1e1e] border border-gray-700 rounded-2xl p-4"
          />
        </div>

        {/* AI Notes */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">
            AI Notes
          </h2>

          <textarea
            value={aiNotes}
            disabled
            className="w-full h-48 bg-[#151515] border border-gray-800 rounded-2xl p-4 text-gray-400"
          />

          <button
            onClick={() => setAiNotes("")}
            className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
          >
            Clear Notes
          </button>
        </div>

        {/* Save */}
        <button
          onClick={saveData}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl"
        >
          Save
        </button>

      </div>

    </main>
  );
}