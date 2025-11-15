<script lang="ts">
  import { onMount } from "svelte";
  import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";
  import type { ImageMetadata } from "node_modules/astro/dist/assets/types";
  import LuChevronLeft from "~/assets/icons/LuChevronLeft.svelte";
  import LuChevronRight from "~/assets/icons/LuChevronRight.svelte";

  const { images }: { images: ImageMetadata[] } = $props();

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
    {#each images as image}
      <img src={image.src} alt="" class="h-full flex-[0_0_100%] object-cover" />
    {/each}
  </div>
  <div
    class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 via-transparent p-2 text-white"
  >
    <div class="flex items-center pl-2">
      <p class="text-sm">
        <span class="font-semibold">{index + 1}</span>
        <span class="text-white/75">of {images.length}</span>
      </p>
      <div class="flex-1"></div>
      <div
        class="flex items-center overflow-clip rounded-sm bg-black/20 backdrop-blur-sm"
      >
        <button
          onclick={() => embla?.scrollPrev()}
          class="grid size-8 place-items-center transition hover:bg-white/20"
        >
          <LuChevronLeft stroke-width={3} class="size-4 stroke-white" />
          <span class="sr-only">Previous</span>
        </button>
        <button
          onclick={() => embla?.scrollNext()}
          class="grid size-8 place-items-center transition hover:bg-white/20"
        >
          <LuChevronRight stroke-width={3} class="size-4 stroke-white" />
          <span class="sr-only">Next</span>
        </button>
      </div>
    </div>
  </div>
</div>
