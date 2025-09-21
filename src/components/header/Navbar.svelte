<script lang="ts">
  import { cx } from "cva";
  import { onMount } from "svelte";

  import ContactButton from "./ContactModal.svelte";

  import logo from "~/assets/logos/youthacks-logo.svg";
  import { fade, fly, type TransitionConfig } from "svelte/transition";
  import { portal } from "svelte-portal";
  import { focusTrap } from "~/lib/modal";
  import LuX from "~/assets/icons/LuX.svelte";
  import LuMenu from "~/assets/icons/LuMenu.svelte";
  import { expoIn, expoOut } from "svelte/easing";

  type Link = { label: string; href: string };
  const { links }: { links: Link[] } = $props();

  let showNavBg = $state(false);
  let isMenuOpen = $state(false);

  onMount(() => {
    const handleScroll = () => {
      showNavBg = window.scrollY > 0;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  function clip(
    node: Element,
    {
      delay,
      duration,
      easing,
    }: {
      delay?: number;
      duration?: number;
      easing?: (t: number) => number;
    } = {},
  ): TransitionConfig {
    return {
      delay,
      duration,
      easing,
      css: (t, u) => `clip-path: inset(0 0 ${u * 100}% 0);`,
    };
  }
</script>

<nav
  class={[
    "fixed inset-x-0 top-0 z-30 border-b transition-all",
    showNavBg
      ? "h-18 border-gray-300 bg-white shadow-md"
      : "h-20 border-transparent",
  ]}
>
  <div class="mx-auto h-full max-w-7xl px-8">
    <div
      class={[
        "-mb-px flex h-full items-center border-b ",
        !showNavBg ? "border-black/10" : "border-transparent",
      ]}
    >
      <a href="/">
        <img src={logo.src} alt="" class="h-7 w-auto" />
      </a>
      <div class="flex-1"></div>
      <button
        onclick={() => (isMenuOpen = !isMenuOpen)}
        class="-mr-2.5 grid size-10 place-items-center sm:hidden"
      >
        <LuMenu class="size-5" />
        <span class="sr-only">Open menu</span>
      </button>
      <div
        class={cx("group flex h-12 items-center gap-2.5 text-lg max-sm:hidden")}
      >
        {#each links as { label, href }, i}
          {#if i > 0}
            <span class="pointer-events-none text-black/50">&middot;</span>
          {/if}
          {#if href === "#contact"}
            <ContactButton
              class="font-semibold underline-offset-2 transition not-hover:group-has-hover:opacity-75 hover:underline"
            >
              {label}
            </ContactButton>
          {:else}
            <a
              {href}
              class="font-semibold underline-offset-2 transition not-hover:group-has-hover:opacity-75 hover:underline"
            >
              {label}
            </a>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</nav>

{#if isMenuOpen}
  <div use:portal class="relative z-30 sm:hidden" hidden>
    <div
      role="presentation"
      in:fade={{ duration: 250 }}
      out:fade={{ duration: 200 }}
      onclick={() => (isMenuOpen = false)}
      class="fixed inset-0 bg-black/50"
    ></div>
    <div class="fixed inset-0 flex flex-col">
      <div
        {@attach focusTrap}
        onkeyup={(event) => {
          if (event.key === "Escape" && isMenuOpen) {
            isMenuOpen = false;
          }
        }}
        in:clip={{ duration: 250, easing: expoOut }}
        out:clip={{ duration: 200, easing: expoIn }}
        role="dialog"
        tabindex={0}
        class="flex-none bg-white p-8 pt-0 shadow-lg outline-none"
      >
        <div
          class={[
            "flex items-center justify-between border-b border-transparent",
            showNavBg ? "h-18" : "h-20",
          ]}
        >
          <a href="/">
            <img src={logo.src} alt="" class="h-7 w-auto" />
          </a>

          <button
            onclick={() => {
              isMenuOpen = false;
              // openButton.focus();
            }}
            class="-mr-2.5 grid size-10 place-items-center"
          >
            <LuX class="size-5" />
            <span class="sr-only">Close menu</span>
          </button>
        </div>
        <div class="space-y-3 border-t border-neutral-300 pt-6">
          {#each links as { label, href }}
            {#if href === "#contact"}
              <ContactButton
                class="block max-w-fit text-xl font-semibold underline-offset-2 transition not-hover:group-has-hover:opacity-75 hover:underline"
              >
                {label}
              </ContactButton>
            {:else}
              <a
                {href}
                class="block max-w-fit text-xl font-semibold underline-offset-2 transition not-hover:group-has-hover:opacity-75 hover:underline"
              >
                {label}
              </a>
            {/if}
          {/each}
        </div>
      </div>
      <div
        role="presentation"
        onclick={() => (isMenuOpen = false)}
        class="min-h-0 flex-1"
      ></div>
    </div>
  </div>
{/if}
