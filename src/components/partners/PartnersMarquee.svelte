<script lang="ts">
  import { onMount } from "svelte";
  import { animate } from "motion";
  import type { SponsorsQueryResult } from "sanity.types";
  import { imageUrl } from "~/lib/image";
  import { Image } from "astro:assets";

  const { sponsors }: { sponsors: SponsorsQueryResult } = $props();

  let outerEl: HTMLDivElement;
  let offsetWidth = $state<number>();

  let animation: ReturnType<typeof animate>;

  onMount(() => {
    if (!offsetWidth) return;
    animation = animate(
      outerEl,
      {
        x: [-0, -offsetWidth],
      },
      {
        duration: 6 * sponsors.length,
        repeat: Infinity,
        ease: "linear",
      },
    );
  });

  const onHover = () => {
    if (!animation) return;
    animate(animation, { speed: 0.3 }, { duration: 0.3, ease: "easeOut" });
  };
  const onLeave = () => {
    if (!animation) return;
    animate(animation, { speed: 1 }, { duration: 0.2, ease: "easeIn" });
  };
</script>

<div
  class="relative flex overflow-x-clip"
  style="mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
>
  <div bind:this={outerEl} class="flex">
    <div bind:offsetWidth class="flex flex-none">
      {@render list()}
    </div>
    <div class="flex flex-none" aria-hidden="true">
      {@render list()}
    </div>
  </div>
</div>

{#snippet list()}
  {#each sponsors as partner}
    <a
      href={partner.url}
      target="_blank"
      onmouseenter={onHover}
      onmouseleave={onLeave}
      tabindex="-1"
      class="mr-4 flex-none transition duration-200 hover:scale-105 hover:opacity-100 hover:grayscale-0 hover:duration-300 pointer-fine:opacity-50 pointer-fine:grayscale"
    >
      <img
        src={imageUrl.image(partner.image!).height(64).url()}
        alt={partner.title}
        width={128}
        height={64}
        class="h-16 w-auto object-contain"
        loading="lazy"
        decoding="async"
      />
    </a>
  {/each}
{/snippet}
