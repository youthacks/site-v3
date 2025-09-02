<script lang="ts">
  import { cx } from "cva";
  import { onMount } from "svelte";
  import logo from "~/assets/logo/youthacks-logo.svg";

  type Link = { label: string; href: string };
  const { links }: { links: Link[] } = $props();

  let showLinksBg = $state(false);

  onMount(() => {
    const handleScroll = () => {
      showLinksBg = window.scrollY > 64;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav class="fixed inset-x-0 top-6 z-30 flex h-12 items-center px-6">
  <a href="/" class="contents"
    ><img src={logo.src} alt="" class="h-8 w-auto" /></a
  >
  <div class="flex-1"></div>
  <div
    class={cx(
      "group flex h-12 items-center gap-2.5 rounded-full border text-lg transition-all",
      showLinksBg
        ? "border-neutral-300 bg-white px-6 shadow-sm"
        : "border-transparent px-2",
    )}
  >
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
</nav>
