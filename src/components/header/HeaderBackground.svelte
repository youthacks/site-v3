<script lang="ts">
  import { cva, cx, type VariantProps } from "cva";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // Size of each square in grid ("size-4" = 16px)
  const SQUARE_SIZE = 16;

  // Opacities for each dot to create a pattern
  // (same as /public/patterns/dots.svg)
  const OPACITIES = [
    [0.5, 0.2, 0.5, 0.8, 0.7, 0.3, 0.5, 0.4],
    [0.9, 0.7, 0.6, 0.3, 0.2, 0.3, 1, 0.5],
    [0.2, 1, 0.9, 0.6, 0.8, 0.5, 0.4, 1],
    [0.7, 0.7, 0.8, 0.6, 0.2, 0.9, 0.3, 0.6],
    [0.2, 0.2, 1, 0.8, 0.9, 0.4, 1, 0.9],
    [0.8, 0.3, 0.4, 0.6, 0.3, 0.6, 1, 0.9],
    [0.5, 0.3, 0.8, 0.5, 0.4, 0.2, 0.9, 0.7],
    [1, 1, 0.8, 0.7, 0.4, 0.6, 0.4, 0.7],
  ];

  const activeDot = cva({
    variants: {
      color: {
        red: "bg-red-600",
        amber: "bg-amber-600",
        cyan: "bg-cyan-600",
      },
    },
    defaultVariants: {
      color: "red",
    },
  });

  const { color }: VariantProps<typeof activeDot> = $props();

  // Hide the background until the page has loaded
  let loaded = $state(false);
  onMount(() => {
    loaded = true;
  });

  // Width and height of the grid
  let offsetWidth = $state<number>(0);
  let offsetHeight = $state<number>(0);

  // Number of columns and rows needed to fill the grid
  let columns = $derived(Math.ceil(offsetWidth / SQUARE_SIZE));
  let rows = $derived(Math.ceil(offsetHeight / SQUARE_SIZE));

  // Mouse position and scroll position
  let mouseX = $state<number>(-1);
  let mouseY = $state<number>(-1);
  let scrollY = $state<number>(0);
  let isHovering = $state(false);

  let hoverTimeout: number | undefined;

  // Position of mouse relative to the grid
  let relativeX = $derived.by(() => {
    // The grid is centered horizontally ("justify-center"),
    // so the dots start/end off-screen.
    const colsWidth = columns * SQUARE_SIZE;
    const padLeft = (offsetWidth - colsWidth) / 2;

    return mouseX - padLeft;
  });
  let relativeY = $derived(mouseY + scrollY);

  // Finally, which square the mouse is currently hovering over
  let activeSquareX = $derived(Math.floor(relativeX / SQUARE_SIZE));
  let activeSquareY = $derived(Math.floor(relativeY / SQUARE_SIZE));
</script>

<div
  bind:offsetWidth
  bind:offsetHeight
  class={cx(
    "absolute inset-0 -z-10 overflow-clip transition-opacity",
    !loaded && "opacity-0",
  )}
>
  {#each { length: rows }, row}
    {@const opacityRow = OPACITIES[row % OPACITIES.length]}

    <div class="flex justify-center">
      {#each { length: columns }, col}
        <div
          style:width="{SQUARE_SIZE}px"
          style:height="{SQUARE_SIZE}px"
          class="grid flex-none place-items-center"
          style="opacity: {opacityRow[col % opacityRow.length]}"
        >
          <div
            class={"col-start-1 row-start-1 size-2 rounded-full bg-black/2"}
          ></div>
          {#if isHovering && activeSquareX === col && activeSquareY === row}
            <div
              class={activeDot({
                color,
                class: "col-start-1 row-start-1 size-2 rounded-full",
              })}
              out:fade={{ duration: 500 }}
            ></div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<svelte:window
  onmousemove={(e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isHovering = true;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    hoverTimeout = window.setTimeout(() => {
      isHovering = false;
    }, 50);
  }}
  onscroll={() => {
    scrollY = window.scrollY;
  }}
/>
