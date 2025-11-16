<script lang="ts">
  import { onMount } from "svelte";
  import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";
  import type { InferEntrySchema } from "astro:content";
  import type { ImageMetadata } from "node_modules/astro/dist/assets/types";
  import LuChevronLeft from "~/assets/icons/LuChevronLeft.svelte";
  import LuChevronRight from "~/assets/icons/LuChevronRight.svelte";

  type Image = (InferEntrySchema<"events"> & {
    concluded: true;
  })["images"][number];

  const { images }: { images: Image[] } = $props();

  let emblaNode: HTMLElement;
  let embla: EmblaCarouselType | null = null;

  let index = $state(0);

  onMount(() => {
    const instance = EmblaCarousel(emblaNode, {
      duration: 20,
      loop: true,
    });
    embla = instance;

    instance.on("select", () => {
      index = instance.selectedScrollSnap();
    });

    return () => {
      instance.destroy();
    };
  });
</script>

<div
  bind:this={emblaNode}
  class="relative size-full overflow-clip rounded-lg bg-neutral-50 shadow-sm contain-size select-none"
>
  <div class="flex h-full">
    {#each images as { src }}
      <img src={src.src} alt="" class="h-full flex-[0_0_100%] object-cover" />
    {/each}
  </div>
  <div
    class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 via-transparent p-4 text-white"
  >
    <div class="flex items-end gap-2">
      <div class="-mb-1">
        <p class="text-sm font-semibold">
          {images[index].caption}
        </p>
        <p class="text-sm text-white/75">
          {index + 1} of {images.length}
        </p>
      </div>
      <div class="flex-1"></div>
      <button
        onclick={() => embla?.scrollPrev()}
        class="grid size-8 place-items-center rounded-full bg-black/50 backdrop-blur-sm transition hover:bg-white/20"
      >
        <LuChevronLeft stroke-width={3} class="size-4 stroke-white" />
        <span class="sr-only">Previous</span>
      </button>
      <button
        onclick={() => embla?.scrollNext()}
        class="grid size-8 place-items-center rounded-full bg-black/50 backdrop-blur-sm transition hover:bg-white/20"
      >
        <LuChevronRight stroke-width={3} class="size-4 stroke-white" />
        <span class="sr-only">Next</span>
      </button>
    </div>
  </div>
</div>
