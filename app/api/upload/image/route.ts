import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = formData.get("file");

    if (!(raw instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (raw.size === 0 || raw.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be between 1 byte and 2 MB" }, { status: 400 });
    }

    const contentType = (raw.type || "image/png").split(";")[0];
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Only PNG, JPG, or WebP images are allowed" }, { status: 400 });
    }

    const ext = contentType.split("/")[1] || "png";
    const fileName = `public-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = Buffer.from(await raw.arrayBuffer());

    const supabase = await createClient();

    const { error: uploadError } = await supabase.storage
      .from("collection-images")
      .upload(fileName, buffer, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("collection-images")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
