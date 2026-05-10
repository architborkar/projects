"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BusinessPage() {
  const [monthlyGoals, setMonthlyGoals] = useState("");
  const [weeklyTasks, setWeeklyTasks] = useState("");
  const [aiNotes, setAiNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const response = await fetch("/api/load-business");
    const data = await response.json();

    setMonthlyGoals(data.monthlyGoals || "");
    setWeeklyTasks(data.weeklyTasks || "");
    setAiNotes(data.aiNotes || "");
  }

  async function saveData() {
    await fetch("/api/save-business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monthlyGoals,
        weeklyTasks,
        aiNotes,
      }),
    });

    alert("Saved");
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
        Business Module
      </h1>

      <div className="space-y-6">

        <div>
          <h2 className="mb-2 text-xl font-semibold">
            Monthly Goals
          </h2>

          <textarea
            value={monthlyGoals}
            onChange={(e) => setMonthlyGoals(e.target.value)}
            className="w-full h-40 bg-[#1e1e1e] border border-gray-700 rounded-2xl p-4"
          />
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">
            Weekly Tasks
          </h2>

          <textarea
            value={weeklyTasks}
            onChange={(e) => setWeeklyTasks(e.target.value)}
            className="w-full h-40 bg-[#1e1e1e] border border-gray-700 rounded-2xl p-4"
          />
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">
            AI Notes
          </h2>

          <textarea
            value={aiNotes}
            disabled
            className="w-full h-40 bg-[#151515] border border-gray-800 rounded-2xl p-4 text-gray-400"
          />

            <button
            onClick={() => setAiNotes("")}
            className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
            >
            Clear Notes
            </button>
        </div>

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