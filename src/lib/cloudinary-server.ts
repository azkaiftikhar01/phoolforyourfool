import "server-only";
import { v2 as cloudinary } from "cloudinary";

/**
 * Server-only Cloudinary helpers. Importing this file from a client component
 * will throw at build time thanks to the `server-only` marker.
 *
 * Use this for:
 *   - Generating signed upload params for the admin uploader.
 *   - Listing / deleting / tagging assets via the Admin API.
 */

let configured = false;
function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function getCloudinaryServer() {
  ensureConfigured();
  return cloudinary;
}

/**
 * Generate signed upload params that the browser can post directly to
 * `https://api.cloudinary.com/v1_1/<cloud>/image/upload`.
 */
export function signedUploadParams(folder?: string) {
  ensureConfigured();
  const timestamp = Math.floor(Date.now() / 1000);
  const targetFolder = folder ?? process.env.CLOUDINARY_UPLOAD_FOLDER ?? "phoolforyourfool";
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: targetFolder },
    process.env.CLOUDINARY_API_SECRET ?? "",
  );
  return {
    timestamp,
    folder: targetFolder,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}
