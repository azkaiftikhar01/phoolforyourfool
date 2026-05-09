"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo } from "react";
import { cldUrl, type CloudinaryTransform } from "@/lib/cloudinary";

type CloudinaryImageProps = Omit<ImageProps, "src"> & {
  publicId: string;
  transform?: CloudinaryTransform;
  fallbackSrc?: string;
};

/**
 * Drop-in <Image> wrapper that delivers Cloudinary URLs with smart cropping
 * and `f_auto/q_auto` defaults. Falls back to a provided URL or the brand
 * placeholder if either the public ID or the cloud name is missing.
 */
export function CloudinaryImage({
  publicId,
  transform,
  fallbackSrc,
  alt,
  ...rest
}: CloudinaryImageProps) {
  const src = useMemo(() => {
    if (publicId) {
      const url = cldUrl(publicId, transform);
      if (url) return url;
    }
    return fallbackSrc ?? "/images/placeholder.svg";
  }, [publicId, transform, fallbackSrc]);

  return <Image src={src} alt={alt} {...rest} />;
}
