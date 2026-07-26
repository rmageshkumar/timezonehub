import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRoom, getRoom, addPlayer, removePlayer,
  submitVote, revealVotes, resetRound, setStoryTitle,
} from "@/lib/scrum-poker-store";

// GET /api/scrum-poker?room=ABC123 — get room state
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("room");
  if (!roomId) return NextResponse.json({ error: "Missing room ID" }, { status: 400 });

  const room = await getRoom(roomId);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  return NextResponse.json({ room });
}

// POST /api/scrum-poker — create room, join, vote, etc.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, roomId, playerName, playerId, vote, storyTitle, roomName } = body;

    switch (action) {
      case "create": {
        const room = await createRoom(roomName || "Planning Poker", "host");
        return NextResponse.json({ success: true, room });
      }

      case "join": {
        if (!roomId || !playerName) {
          return NextResponse.json({ error: "roomId and playerName required" }, { status: 400 });
        }
        const player = await addPlayer(roomId, playerName);
        if (!player) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        // First player to join becomes admin
        const roomBefore = await getRoom(roomId);
        if (roomBefore && roomBefore.players.length === 1 && !roomBefore.adminId) {
          await prisma.scrumPokerRoom.update({
            where: { id: roomId },
            data: { adminId: player.id },
          });
        }
        const room = await getRoom(roomId);
        return NextResponse.json({ success: true, player, room });
      }

      case "leave": {
        if (!roomId || !playerId) {
          return NextResponse.json({ error: "roomId and playerId required" }, { status: 400 });
        }
        await removePlayer(roomId, playerId);
        const room = await getRoom(roomId);
        return NextResponse.json({ success: true, room });
      }

      case "vote": {
        if (!roomId || !playerId || !vote) {
          return NextResponse.json({ error: "roomId, playerId, and vote required" }, { status: 400 });
        }
        const ok = await submitVote(roomId, playerId, vote);
        if (!ok) return NextResponse.json({ error: "Voting is closed or room not found" }, { status: 400 });
        const room = await getRoom(roomId);
        return NextResponse.json({ success: true, room });
      }

      case "reveal": {
        if (!roomId || !playerId) return NextResponse.json({ error: "roomId and playerId required" }, { status: 400 });
        const rc = await getRoom(roomId);
        if (!rc) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        if (rc.adminId && rc.adminId !== playerId) {
          return NextResponse.json({ error: "Only the admin can reveal votes" }, { status: 403 });
        }
        await revealVotes(roomId);
        const room = await getRoom(roomId);
        return NextResponse.json({ success: true, room });
      }

      case "reset": {
        if (!roomId || !playerId) return NextResponse.json({ error: "roomId and playerId required" }, { status: 400 });
        const rc = await getRoom(roomId);
        if (!rc) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        if (rc.adminId && rc.adminId !== playerId) {
          return NextResponse.json({ error: "Only the admin can reset the round" }, { status: 403 });
        }
        await resetRound(roomId, storyTitle, body.storyDescription);
        const room = await getRoom(roomId);
        return NextResponse.json({ success: true, room });
      }

      case "setTitle": {
        if (!roomId || !playerId) return NextResponse.json({ error: "roomId and playerId required" }, { status: 400 });
        const rc = await getRoom(roomId);
        if (!rc) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        if (rc.adminId && rc.adminId !== playerId) {
          return NextResponse.json({ error: "Only the admin can edit story details" }, { status: 403 });
        }
        await setStoryTitle(roomId, storyTitle || "", body.storyDescription);
        const room = await getRoom(roomId);
        return NextResponse.json({ success: true, room });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Scrum poker error:", error?.message || error, error?.stack?.split("\n")[0]);
    return NextResponse.json({ error: "Server error: " + (error?.message || "unknown") }, { status: 500 });
  }
}
