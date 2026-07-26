"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Users, RefreshCw, Eye, EyeOff, LogOut, Plus, Play, Hash, Coffee } from "lucide-react";
import toast from "react-hot-toast";

// Fibonacci + special cards
const CARDS = ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?", "☕"];

interface Player {
  id: string;
  name: string;
  vote: string | null;
}

interface Room {
  id: string;
  name: string;
  adminId: string;
  players: Player[];
  revealed: boolean;
  storyTitle: string;
  storyDescription: string;
}

type Screen = "home" | "room";

export function ScrumPokerClient() {
  const [screen, setScreen] = useState<Screen>("home");
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [storyInput, setStoryInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [storySaved, setStorySaved] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const isAdmin = room && playerId && room.adminId === playerId;
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Restore session from localStorage on mount (survives refresh)
  useEffect(() => {
    const saved = localStorage.getItem("scrum_poker_player");
    if (saved) {
      try {
        const { name } = JSON.parse(saved);
        if (name) setPlayerName(name);
      } catch {}
    }

    // Auto-rejoin saved room
    const session = localStorage.getItem("scrum_poker_session");
    if (session) {
      try {
        const { roomId, playerId: savedPlayerId } = JSON.parse(session);
        if (roomId && savedPlayerId) {
          setReconnecting(true);
          fetch(`/api/scrum-poker?room=${roomId}`)
            .then(r => r.json())
            .then(data => {
              if (data.room) {
                setRoom(data.room);
                setPlayerId(savedPlayerId);
                setScreen("room");
                pollRoom(roomId);
                // Restore story fields from room
                if (data.room.storyTitle) setStoryInput(data.room.storyTitle);
                if (data.room.storyDescription) setDescInput(data.room.storyDescription);
                const me = data.room.players.find((p: Player) => p.id === savedPlayerId);
                if (me?.vote) setSelectedVote(me.vote);
              }
            })
            .catch(() => {})
            .finally(() => setReconnecting(false));
        }
      } catch {}
    }
  }, []);

  // Polling for room state
  const pollRoom = useCallback((roomId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/scrum-poker?room=${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setRoom(data.room);
          // Update selected vote if we already voted
          if (playerId) {
            const me = data.room.players.find((p: Player) => p.id === playerId);
            if (me?.vote) setSelectedVote(me.vote);
          }
        }
      } catch {}
    }, 2000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [playerId]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleCreate = async () => {
    try {
      // Step 1: Create the room
      const res = await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", roomName: roomName || "Planning Poker" }),
      });
      const data = await res.json();
      if (!data.success) { toast.error("Failed to create room"); return; }

      // Step 2: Auto-join as the creator (first player = admin)
      const name = playerName || "Host";
      localStorage.setItem("scrum_poker_player", JSON.stringify({ name }));
      const joinRes = await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", roomId: data.room.id, playerName: name }),
      });
      const joinData = await joinRes.json();
      if (joinData.success) {
        setRoom(joinData.room);
        setPlayerId(joinData.player.id);
        setScreen("room");
        pollRoom(data.room.id);
        // Save session so it survives refresh
        localStorage.setItem("scrum_poker_session", JSON.stringify({
          roomId: data.room.id,
          playerId: joinData.player.id,
        }));
        toast.success("Room created! You are the admin.");
      } else {
        toast.error("Failed to join room");
      }
    } catch { toast.error("Failed to create room"); }
  };

  const handleJoin = async () => {
    if (!joinRoomId.trim()) return;
    if (!playerName.trim()) {
      toast.error("Enter your name first");
      return;
    }
    localStorage.setItem("scrum_poker_player", JSON.stringify({ name: playerName }));
    try {
      const res = await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", roomId: joinRoomId.toUpperCase(), playerName }),
      });
      const data = await res.json();
      if (data.success) {
        setRoom(data.room);
        setPlayerId(data.player.id);
        setScreen("room");
        pollRoom(joinRoomId.toUpperCase());
        // Save session for refresh persistence
        localStorage.setItem("scrum_poker_session", JSON.stringify({
          roomId: joinRoomId.toUpperCase(),
          playerId: data.player.id,
        }));
        toast.success("Joined room!");
      } else {
        toast.error(data.error || "Failed to join");
      }
    } catch { toast.error("Failed to join room"); }
  };

  const handleVote = async (card: string) => {
    if (!room || !playerId) return;
    setSelectedVote(card);
    try {
      await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", roomId: room.id, playerId, vote: card }),
      });
    } catch {}
  };

  const handleReveal = async () => {
    if (!room || !playerId) return;
    try {
      await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reveal", roomId: room.id, playerId }),
      });
    } catch {}
  };

  const handleReset = async () => {
    if (!room || !playerId) return;
    setSelectedVote(null);
    setStorySaved(false);
    try {
      const res = await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          roomId: room.id,
          playerId,
          storyTitle: storyInput,
          storyDescription: descInput,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          setRoom(data.room);
          // Show the newly saved story for the admin
          setStoryInput(data.room.storyTitle || "");
          setDescInput(data.room.storyDescription || "");
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to reset");
      }
    } catch { toast.error("Failed to start new round"); }
  };

  const handleSaveStory = async () => {
    if (!room || !playerId) return;
    const title = storyInput.trim();
    if (!title) return;
    try {
      const res = await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setTitle", roomId: room.id, playerId, storyTitle: title, storyDescription: descInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          setRoom(data.room);
          setStoryInput(data.room.storyTitle || "");
          setDescInput(data.room.storyDescription || "");
        }
        setStorySaved(true);
        setTimeout(() => setStorySaved(false), 3000);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {}
  };

  const handleLeave = async () => {
    if (!room || !playerId) return;
    try {
      await fetch("/api/scrum-poker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "leave", roomId: room.id, playerId }),
      });
    } catch {}
    if (pollingRef.current) clearInterval(pollingRef.current);
    localStorage.removeItem("scrum_poker_session");
    setScreen("home");
    setRoom(null);
    setPlayerId(null);
    setSelectedVote(null);
  };

  const copyRoomId = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.id);
    toast.success("Room ID copied!");
  };

  const votedCount = room?.players.filter((p) => p.vote !== null).length || 0;
  const totalPlayers = room?.players.length || 0;
  const allVoted = votedCount > 0 && votedCount === totalPlayers;

  // Find consensus (most common vote)
  const getConsensus = (): string | null => {
    if (!room || !room.revealed || room.players.length === 0) return null;
    const votes = room.players.filter((p) => p.vote && p.vote !== "?" && p.vote !== "☕").map((p) => p.vote!);
    if (votes.length === 0) return null;
    const counts: Record<string, number> = {};
    votes.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const max = Math.max(...Object.values(counts));
    if (max < Math.ceil(votes.length / 2)) return null;
    return Object.keys(counts).find((k) => counts[k] === max) || null;
  };

  const getVoteStats = () => {
    if (!room || !room.revealed) return null;
    const numericVotes = room.players
      .filter(p => p.vote && p.vote !== "?" && p.vote !== "☕")
      .map(p => parseInt(p.vote!));
    if (numericVotes.length === 0) return null;
    const avg = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
    const min = Math.min(...numericVotes);
    const max = Math.max(...numericVotes);
    return { avg: avg.toFixed(1), min, max, count: numericVotes.length };
  };

  const AVATAR_COLORS = [
    "from-blue-400 to-cyan-400", "from-purple-400 to-pink-400",
    "from-green-400 to-emerald-400", "from-orange-400 to-amber-400",
    "from-red-400 to-rose-400", "from-indigo-400 to-violet-400",
    "from-teal-400 to-cyan-400", "from-fuchsia-400 to-pink-400",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {screen === "home" && (
        <div className="space-y-6">
          {/* Create Room */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary-500" /> Create a Room
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room name (optional)"
                className="input-field flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <button onClick={handleCreate} className="btn-primary whitespace-nowrap">Create Room</button>
            </div>
          </div>

          {/* Join Room */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-500" /> Join a Room
            </h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
              />
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                placeholder="Enter Room ID"
                className="input-field flex-1 font-mono text-lg tracking-widest text-center"
                maxLength={6}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
              <button onClick={handleJoin} className="btn-primary whitespace-nowrap">Join Room</button>
            </div>
          </div>
        </div>
      )}

      {screen === "room" && room && (
        <div className="space-y-5">
          {reconnecting && (
            <div className="text-center text-sm text-slate-500 animate-pulse py-2">
              Reconnecting to room...
            </div>
          )}
          {/* Room Header */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">{room.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono text-primary-500 font-bold tracking-wider">{room.id}</span>
                  <button onClick={copyRoomId} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {isAdmin && (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
                  )}
                </div>
              </div>
              <button onClick={handleLeave} className="btn-secondary text-sm flex items-center gap-1.5 text-red-500">
                <LogOut className="w-4 h-4" /> Leave
              </button>
            </div>

            {/* Story Title & Description — admin only */}
            {isAdmin ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={storyInput}
                    onChange={(e) => { setStoryInput(e.target.value); setStorySaved(false); }}
                    placeholder="Enter story title..."
                    className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 placeholder:text-slate-400"
                  />
                  <button onClick={handleSaveStory} className={`text-xs px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${storySaved ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-primary-100 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-200"}`}>
                    {storySaved ? "✓ Saved" : "Save"}
                  </button>
                </div>
                <textarea value={descInput} onChange={(e) => { setDescInput(e.target.value); setStorySaved(false); }}
                  placeholder="Add description, acceptance criteria, or notes..." rows={2}
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-xs text-slate-600 dark:text-slate-400 px-3 py-1.5 resize-none placeholder:text-slate-400 focus:border-primary-300" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {room.storyTitle || "Waiting for admin to set a story..."}
                </span>
                {room.storyDescription && (
                  <span className="text-xs text-slate-400 truncate ml-2">— {room.storyDescription.slice(0, 60)}</span>
                )}
              </div>
            )}
          </div>

          {/* Players */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4" /> Players ({totalPlayers})
              </h3>
              <span className="text-xs text-slate-500">
                {room.revealed ? "Votes revealed" : `${votedCount}/${totalPlayers} voted`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {room.players.map((p, idx) => (
                <div key={p.id} className={`rounded-xl p-3 text-center transition-all ${
                  p.id === playerId ? "bg-primary-50 dark:bg-primary-950 border-2 border-primary-200 dark:border-primary-800" : "bg-slate-50 dark:bg-slate-800/50"
                } ${!room.revealed && !p.vote ? "animate-pulse" : ""}`}>
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[11px] font-bold shadow-sm`}>
                      {p.name[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
                      {p.name}
                      {p.id === playerId ? " (You)" : ""}
                    </span>
                  </div>
                  <div className={`text-lg font-bold font-mono min-h-[32px] flex items-center justify-center rounded-lg transition-all duration-500 ${
                    room.revealed
                      ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 scale-110 animate-fade-in"
                      : p.vote ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "text-slate-400 text-xs"
                  }`}>
                    {room.revealed ? (
                      <span className="animate-slide-up">{p.vote || "—"}</span>
                    ) : p.vote ? (
                      <span className="flex items-center gap-1">✓ <span className="text-[10px]">Voted</span></span>
                    ) : (
                      <span>Waiting...</span>
                    )}
                  </div>
                </div>
              ))}
              {totalPlayers === 0 && (
                <div className="col-span-full text-center py-4 text-sm text-slate-500">
                  Waiting for players to join...
                </div>
              )}
            </div>
          </div>

          {/* Voting Cards */}
          {!room.revealed && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedVote ? `Your vote: ${selectedVote}` : "Choose your card"}
                </h3>
                {totalPlayers > 0 && (
                  <span className="text-xs text-slate-500">
                    {votedCount}/{totalPlayers} voted
                    {totalPlayers - votedCount > 0 && (
                      <span className="ml-1 text-amber-500">
                        • {room.players.filter(p => !p.vote).map(p => p.name).join(", ")} pending
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {CARDS.map((card) => (
                  <button
                    key={card}
                    onClick={() => handleVote(card)}
                    className={`w-16 h-20 rounded-2xl font-bold text-lg transition-all duration-200 ${
                      selectedVote === card
                        ? "bg-primary-500 text-white shadow-xl shadow-primary-500/30 scale-110 ring-2 ring-primary-300 -translate-y-1"
                        : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="block">{card}</span>
                    {card === "?" && <span className="text-[9px] block font-normal opacity-70">Unsure</span>}
                    {card === "☕" && <span className="text-[9px] block font-normal opacity-70">Break</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {!room.revealed && isAdmin && (
              <button
                onClick={handleReveal}
                disabled={votedCount === 0}
                className="btn-primary flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Reveal Votes ({votedCount}/{totalPlayers})
              </button>
            )}
            {!room.revealed && !isAdmin && (
              <div className="text-sm text-slate-500 flex items-center gap-2 py-2">
                <EyeOff className="w-4 h-4" /> Waiting for admin to reveal ({votedCount}/{totalPlayers} voted)
              </div>
            )}
            {room.revealed && isAdmin && (
              <div className="w-full space-y-3">
                {getConsensus() && (
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-center">
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      🎯 Consensus: <strong>{getConsensus()}</strong> points
                    </span>
                  </div>
                )}
                {getVoteStats() && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Average", value: getVoteStats()!.avg, color: "text-blue-600" },
                      { label: "Min", value: getVoteStats()!.min, color: "text-green-600" },
                      { label: "Max", value: getVoteStats()!.max, color: "text-red-600" },
                      { label: "Votes", value: getVoteStats()!.count, color: "text-purple-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
                        <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={storyInput}
                    onChange={(e) => setStoryInput(e.target.value)}
                    placeholder="Next story title..."
                    className="input-field flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  />
                  <button onClick={handleReset} className="btn-primary whitespace-nowrap flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> New Round
                  </button>
                </div>
              </div>
            )}
            {room.revealed && !isAdmin && (
              <div className="w-full space-y-3">
                {getConsensus() && (
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-center">
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      🎯 Consensus: <strong>{getConsensus()}</strong> points
                    </span>
                  </div>
                )}
                {getVoteStats() && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Average", value: getVoteStats()!.avg, color: "text-blue-600" },
                      { label: "Min", value: getVoteStats()!.min, color: "text-green-600" },
                      { label: "Max", value: getVoteStats()!.max, color: "text-red-600" },
                      { label: "Votes", value: getVoteStats()!.count, color: "text-purple-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
                        <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-sm text-slate-500 text-center py-2">Waiting for admin to start new round...</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
