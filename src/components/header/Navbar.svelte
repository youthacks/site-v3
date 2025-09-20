<script lang="ts">
  import { cx } from "cva";
  import { onMount } from "svelte";
  import logo from "~/assets/logos/youthacks-logo.svg";

  type Link = { label: string; href: string };
  const { links }: { links: Link[] } = $props();

  let showLinksBg = $state(false);

  onMount(() => {
    const handleScroll = () => {
      showLinksBg = window.scrollY > 0;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav
  class={[
    "fixed inset-x-0 top-0 z-30 border-b transition-all",
    showLinksBg
      ? "h-18 border-gray-300 bg-white shadow-md"
      : "h-20 border-transparent",
  ]}
>
  <div class="mx-auto h-full max-w-7xl px-8">
    <div
      class={[
        "-mb-px flex h-full items-center border-b ",
        !showLinksBg ? "border-black/10" : "border-transparent",
      ]}
    >
      <a href="/" class="contents">
        <img src={logo.src} alt="" class="h-7 w-auto" />
      </a>
      <div class="flex-1"></div>
      <div class={cx("group flex h-12 items-center gap-2.5 text-lg")}>
        {#each links as { label, href }, i}
          {#if i > 0}
            <span class="pointer-events-none text-black/50">&middot;</span>
          {/if}
          <a
            {href}
            class="font-semibold underline-offset-2 transition not-hover:group-has-hover:opacity-75 hover:underline"
          >
            {label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav>
