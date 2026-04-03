"use client";

import { useState } from "react";

interface VoteButtonProps {
  ideaId: string;
  initialVotes: number;
}

export function VoteButton({ ideaId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);

  async function handleVote() {
    if (voted) return;
    setVoting(true);

    const voterName = prompt("Enter your name to vote:");
    if (!voterName) {
      setVoting(false);
      return;
    }

    try {
      const res = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterName }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
        setVoted(true);
      }
    } catch {
      // silently fail
    } finally {
      setVoting(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={voting || voted}
      className={`flex flex-col items-center rounded-lg px-4 py-3 min-w-[70px] transition ${
        voted
          ? "bg-blue-100 text-blue-700 cursor-default"
          : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      <span className="text-lg">{voted ? "^" : "^"}</span>
      <span className="text-xl font-bold">{votes}</span>
      <span className="text-xs">{voted ? "voted" : "vote"}</span>
    </button>
  );
}
