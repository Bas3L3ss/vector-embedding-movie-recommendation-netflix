// app/api/films/[id]/route.js
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    console.log(id, data);

    // TODO: Add your logic to update the film with the given id in the database
    // e.g., const result = await updateFilmInDB(id, data);

    return NextResponse.json(
      { message: "Film updated successfully", film: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating film:", error);
    return NextResponse.json(
      { message: "Error updating film" },
      { status: 500 }
    );
  }
}
