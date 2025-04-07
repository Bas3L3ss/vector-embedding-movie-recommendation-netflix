import { Readable } from "stream";
import formidable from "formidable";
import { NextResponse } from "next/server";
import { genreTags } from "@/lib/mockdata";
import { createFilm, deleteFilm } from "@/actions/films/admin";

export const config = {
  api: {
    bodyParser: false,
  },
};

function webStreamToNodeReadable(webStream: ReadableStream<Uint8Array>) {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      this.push(done ? null : Buffer.from(value));
    },
  });
}

export async function POST(req: Request) {
  try {
    const nodeReadable = webStreamToNodeReadable(req.body!);

    // ⛑️ Patch a fake "req" with headers
    const fakeReq: any = nodeReadable;
    fakeReq.headers = {
      "content-type": req.headers.get("content-type") || "",
      "content-length": req.headers.get("content-length") || "",
    };

    const form = formidable({ multiples: true });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(fakeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const newData = {};
    newData.posterUrl = [];
    Object.keys(fields).forEach((key: string) => {
      // Get the first element of the array.
      let value = fields[key][0];

      // Try to parse the value if it's a JSON string.
      try {
        const parsedValue = JSON.parse(value);
        // If parsing gives an array or object, use it.
        newData[key] = parsedValue;
      } catch (error) {
        // Otherwise, simply use the string value.
        newData[key] = value;
      }
    });
    newData.tags = [];
    newData.genre.forEach((element) => {
      newData.tags.push(genreTags[element]);
    });

    const newFiles = Object.values(files.files).map((file) => ({
      ...file,
      name: file.originalFilename,
    }));
    newData.posterUrl = [...newData.posterUrl, ...newFiles];

    const { success, error } = await createFilm(newData);
    if (!success) {
      console.error(error);
      return NextResponse.json({ success: false }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  const { selectedFilmIds } = await req.json();
  try {
    await Promise.all(selectedFilmIds.map((id: string) => deleteFilm(id)));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
