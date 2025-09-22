<script lang="ts">
  import type { CollectionEntry } from "astro:content";
  import { onMount } from "svelte";
  import { animate } from "motion";

  const { partners }: { partners: CollectionEntry<"partners">[] } = $props();

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
        duration: 6 * partners.length,
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

<div class="relative flex overflow-x-clip">
  <div bind:this={outerEl} class="flex">
    <div bind:offsetWidth class="flex flex-none">
      {@render list()}
    </div>
    <div class="flex flex-none" aria-hidden="true">
      {@render list()}
    </div>
  </div>

  <div
    class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-50"
  ></div>
  <div
    class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-50"
  ></div>
</div>

{#snippet list()}
  {#each partners as partner}
    <a
      href={partner.data.url}
      target="_blank"
      onmouseenter={onHover}
      onmouseleave={onLeave}
      tabindex="-1"
      class="mr-4 flex-none opacity-50 transition duration-200 hover:scale-105 hover:opacity-100 hover:grayscale-0 hover:duration-300 pointer-fine:grayscale"
    >
      <img
        src={partner.data.logo.src}
        alt={partner.data.title}
        width={partner.data.logo.width}
        height={partner.data.logo.height}
        class="h-16 w-auto"
        loading="lazy"
        decoding="async"
      />
    </a>
  {/each}
{/snippet}
