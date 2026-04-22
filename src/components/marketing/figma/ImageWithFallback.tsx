"use client";

import { useState } from "react";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error && fallbackSrc ? fallbackSrc : src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
}
