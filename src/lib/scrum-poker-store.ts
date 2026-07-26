import { prisma } from "@/lib/prisma";

interface Player {
  id: string;
  name: string;
  vote: string | null;
}

interface Room {
  id: string;
  name: string;
  adminId: string;
  createdBy: string;
  createdAt: number;
  lastActivity: number;
  players: Player[];
  revealed: boolean;
  storyTitle: string;
  storyDescription: string;
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function parseRoom(dbRoom: any): Room {
  let players: Player[] = [];
  try { players = JSON.parse(dbRoom.players || "[]"); } catch {}
  return {
    id: dbRoom.id,
    name: dbRoom.name,
    adminId: dbRoom.adminId || "",
    createdBy: "host",
    createdAt: new Date(dbRoom.createdAt).getTime(),
    lastActivity: new Date(dbRoom.lastActivity).getTime(),
    players,
    revealed: dbRoom.revealed,
    storyTitle: dbRoom.storyTitle || "",
    storyDescription: dbRoom.storyDescription || "",
  };
}

export async function createRoom(name: string, createdBy: string): Promise<Room> {
  const id = generateId();
  const dbRoom = await prisma.scrumPokerRoom.create({
    data: { id, name: name || "Planning Poker", players: "[]", storyTitle: "" },
  });
  return parseRoom(dbRoom);
}

export async function getRoom(id: string): Promise<Room | null> {
  const dbRoom = await prisma.scrumPokerRoom.findUnique({ where: { id } });
  if (!dbRoom) return null;
  await prisma.scrumPokerRoom.update({ where: { id }, data: { lastActivity: new Date() } });
  return parseRoom(dbRoom);
}

export async function addPlayer(roomId: string, playerName: string): Promise<Player | null> {
  const dbRoom = await prisma.scrumPokerRoom.findUnique({ where: { id: roomId } });
  if (!dbRoom) return null;
  const players: Player[] = JSON.parse(dbRoom.players || "[]");
  const player: Player = { id: generateId(), name: playerName || "Anonymous", vote: null };
  players.push(player);
  await prisma.scrumPokerRoom.update({
    where: { id: roomId },
    data: { players: JSON.stringify(players), lastActivity: new Date() },
  });
  return player;
}

export async function removePlayer(roomId: string, playerId: string): Promise<boolean> {
  const dbRoom = await prisma.scrumPokerRoom.findUnique({ where: { id: roomId } });
  if (!dbRoom) return false;
  const players: Player[] = JSON.parse(dbRoom.players || "[]");
  const updated = players.filter((p) => p.id !== playerId);
  await prisma.scrumPokerRoom.update({
    where: { id: roomId },
    data: { players: JSON.stringify(updated), lastActivity: new Date() },
  });
  return true;
}

export async function submitVote(roomId: string, playerId: string, vote: string): Promise<boolean> {
  const dbRoom = await prisma.scrumPokerRoom.findUnique({ where: { id: roomId } });
  if (!dbRoom || dbRoom.revealed) return false;
  const players: Player[] = JSON.parse(dbRoom.players || "[]");
  const player = players.find((p) => p.id === playerId);
  if (!player) return false;
  player.vote = vote;
  await prisma.scrumPokerRoom.update({
    where: { id: roomId },
    data: { players: JSON.stringify(players), lastActivity: new Date() },
  });
  return true;
}

export async function revealVotes(roomId: string): Promise<boolean> {
  await prisma.scrumPokerRoom.update({
    where: { id: roomId },
    data: { revealed: true, lastActivity: new Date() },
  });
  return true;
}

export async function resetRound(roomId: string, storyTitle?: string, storyDescription?: string): Promise<boolean> {
  const dbRoom = await prisma.scrumPokerRoom.findUnique({ where: { id: roomId } });
  if (!dbRoom) return false;
  const players: Player[] = JSON.parse(dbRoom.players || "[]");
  for (const p of players) p.vote = null;
  const updateData: any = {
    revealed: false,
    storyTitle: storyTitle || "",
    players: JSON.stringify(players),
    lastActivity: new Date(),
  };
  if (storyDescription !== undefined) updateData.storyDescription = storyDescription;
  await prisma.scrumPokerRoom.update({ where: { id: roomId }, data: updateData });
  return true;
}

export async function setStoryTitle(roomId: string, title: string, description?: string): Promise<boolean> {
  const data: any = { storyTitle: title, lastActivity: new Date() };
  if (description !== undefined) data.storyDescription = description;
  await prisma.scrumPokerRoom.update({ where: { id: roomId }, data });
  return true;
}
