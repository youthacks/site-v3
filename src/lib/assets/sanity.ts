// Portions from https://github.com/withastro/astro/blob/7ba0bb1dc7516e88caff9abd7767322af44b0294/packages/astro/src/assets/layout.ts (license: MIT)

import type {
  ImageFormat,
  SanityAsset,
  SanityImageObject,
  SanityReference,
} from "@sanity/image-url";
import type { HTMLAttributes } from "astro/types";
import {
  getWidths,
  getSizesAttribute,
  DEFAULT_RESOLUTIONS,
} from "node_modules/astro/dist/assets/layout";
import type { ImageLayout } from "node_modules/astro/dist/assets/types";
import type { HTMLImgAttributes } from "svelte/elements";
import imageBuilder from "~/lib/imageBuilder";

export type SanityImageSource =
  SanityAsset | SanityReference | SanityImageObject;

export type SanityImageTransform = {
  src: SanityImageSource;
  width?: number | undefined;
  widths?: number[] | undefined;
  sizes?: string | undefined;
  height?: number | undefined;
  quality?: number | undefined;
  format?: ImageFormat | undefined;
  layout?: ImageLayout;
  priority?: boolean;
};

// Attributes for an <img> element present in both Svelte and Astro
type CommonImgAttributes = HTMLAttributes<"img"> & HTMLImgAttributes;

export function getSanityImageData(src: SanityImageSource) {
  let id: string | undefined;
  if ("_id" in src) {
    // SanityAsset
    id = src._id;
  } else if ("_ref" in src) {
    // SanityReference
    id = src._ref;
  } else if ("asset" in src && "_ref" in src.asset) {
    // SanityImageObject
    id = src.asset._ref;
  } else if ("asset" in src && "_id" in src.asset) {
    // SanityImageObject
    id = src.asset._id;
  }

  if (!id) {
    throw new Error("Invalid Sanity image source: " + JSON.stringify(src));
  }

  const [, assetId, dimensions, format] = id.split("-");
  const [width, height] = dimensions.split("x").map(Number);
  const aspectRatio = width / height;

  return { assetId, width, height, aspectRatio, format };
}
export function getTargetDimensions(
  given: { width?: number; height?: number },
  original: { width: number; height: number },
) {
  let width = given.width;
  let height = given.height;
  const aspectRatio = original.width / original.height;

  if (height && !width) {
    // If we have a height but no width, use height to calculate the width
    width = Math.round(height * aspectRatio);
  } else if (width && !height) {
    // If we have a width but no height, use width to calculate the height
    height = Math.round(width / aspectRatio);
  } else if (!width && !height) {
    // If we have neither width or height, use the original image's dimensions
    width = original.width;
    height = original.height;
  }

  return {
    width: width!,
    height: height!,
  };
}

export function getSanityImage(options: SanityImageTransform) {
  const instance = imageBuilder.image(options.src).withOptions({
    source: options.src,
    quality: options.quality || 80,
    auto: "format",
    format: options.format,
  });
  const originalDimensions = getSanityImageData(options.src);
  const targetDimensions = getTargetDimensions(
    { width: options.width, height: options.height },
    originalDimensions,
  );

  let widths =
    options.widths ||
    getWidths({
      width: targetDimensions.width,
      layout: options.layout || "none",
      originalWidth: originalDimensions.width,
      breakpoints: DEFAULT_RESOLUTIONS,
    });
  widths = widths.sort((a, b) => a - b);

  // We've already sorted the widths, so we'll remove any that are larger than the original image's width
  if (widths.length > 0 && widths.at(-1)! > originalDimensions.width) {
    widths = [
      ...widths.filter((width) => width <= originalDimensions.width),
      originalDimensions.width,
    ];
  }
  widths = Array.from(new Set(widths));

  const sizes =
    options.sizes ||
    getSizesAttribute({
      width: targetDimensions.width,
      layout: options.layout || "none",
    });

  const src = instance.width(targetDimensions.width).url();
  const srcSet = widths.map((width) => ({
    width,
    height: Math.round(width / originalDimensions.aspectRatio),
    descriptor: `${width}w`,
    src: instance.width(width).url(),
  }));

  let imageAttributes: CommonImgAttributes = {};

  imageAttributes.src = src;
  if (srcSet.length > 0) {
    imageAttributes.srcset = srcSet
      .map((item) => `${item.src} ${item.descriptor}`)
      .join(", ");
  }
  if (sizes) {
    imageAttributes.sizes = sizes;
  }
  imageAttributes.width = targetDimensions.width;
  imageAttributes.height = targetDimensions.height;

  if (options.priority) {
    imageAttributes.loading = "eager";
    imageAttributes.decoding = "sync";
    imageAttributes.fetchpriority = "high";
  } else {
    imageAttributes.loading = "lazy";
    imageAttributes.decoding = "async";
  }

  return {
    src,
    srcSet,
    width: targetDimensions.width,
    height: targetDimensions.height,
    attributes: imageAttributes,
  };
}
