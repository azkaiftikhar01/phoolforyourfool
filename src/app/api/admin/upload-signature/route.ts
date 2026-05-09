import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { signedUploadParams } from "@/lib/cloudinary-server";

const Schema = z.object({
  folder: z.string().optional(),
});

/**
 * Returns Cloudinary signed-upload params so the admin browser can POST images
 * directly to Cloudinary without proxying bytes through our server.
 */
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { folder } = Schema.parse(body);
  const params = signedUploadParams(folder);
  return NextResponse.json(params);
}
