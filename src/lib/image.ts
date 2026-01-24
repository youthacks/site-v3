import { sanityClient } from "sanity:client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const imageUrl = createImageUrlBuilder(sanityClient);
