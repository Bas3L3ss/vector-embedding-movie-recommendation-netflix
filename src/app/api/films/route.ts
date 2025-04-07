import { createFilm } from "@/actions/films/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await createFilm(data);
    // Process the data as needed (e.g., save file path to DB)
    return NextResponse.json(
      { message: "Film created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing form:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
