import { getCompetitorPlaylists } from "@/lib/ai/relatedsearchtool";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { playlisturl } =await req.json();
    const results=await getCompetitorPlaylists(playlisturl);
    return NextResponse.json(results);
    }
    catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
