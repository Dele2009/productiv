import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/server/config/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";
import fs from "fs";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Save temporarily to disk (Cloudinary SDK requires a file path or stream)
  const tempFilePath = path.join(tmpdir(), `${randomUUID()}-${file.name}`);
  console.log(tempFilePath);
  await writeFile(tempFilePath, buffer);

  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder,
    });

    fs.unlinkSync(tempFilePath); // Clean up after upload
    return NextResponse.json({ url: result.secure_url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
