<script lang="ts">
  import { portal } from "svelte-portal";
  import { fade, scale } from "svelte/transition";
  import { focusTrap } from "~/lib/modal";

  import LuX from "~/assets/icons/LuX.svelte";
  import LuCopy from "~/assets/icons/LuCopy.svelte";
  import LuCheck from "~/assets/icons/LuCheck.svelte";
  import type { HTMLAttributes } from "svelte/elements";

  const EMAILS = [
    {
      label: "General inquiries, or say hello!",
      email: "hello@youthacks.org",
    },
    {
      label: "Support us - sponsor or donate",
      email: "donate@youthacks.org",
    },
    {
      label: "GDPR & data protection",
      email: "gdpr@youthacks.org",
    },
  ];

  const {
    children,
    class: className,
    ...props
  }: HTMLAttributes<HTMLButtonElement> = $props();

  let openButton: HTMLButtonElement;
  let showModal = $state(false);

  let copied = $state("");
  let copiedTimeout: number;

  const copy = (v: string) => {
    navigator.clipboard.writeText(v);
    copied = v;

    clearTimeout(copiedTimeout);
    copiedTimeout = window.setTimeout(() => {
      copied = "";
    }, 2000);
  };

  $effect(() => {
    // Add some padding where the scrollbar would be to prevent layout shift
    if (showModal) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  });
</script>

<button
  {...props}
  bind:this={openButton}
  onclick={() => (showModal = true)}
  class={["cursor-pointer", className]}
>
  {@render children?.()}
</button>

{#if showModal}
  <div use:portal class="relative z-30" hidden>
    <div
      in:fade={{ duration: 250 }}
      out:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/50"
    ></div>
    <div class="fixed inset-0 isolate flex items-center justify-center p-4">
      <div
        role="presentation"
        onclick={() => (showModal = false)}
        class="absolute inset-0"
      ></div>
      <div
        {@attach focusTrap}
        onkeyup={(event) => {
          if (event.key === "Escape" && showModal) {
            showModal = false;
            openButton.focus();
          }
        }}
        in:scale={{ duration: 250, start: 0.95 }}
        out:scale={{ duration: 200, start: 0.95 }}
        role="dialog"
        tabindex={0}
        class="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-lg outline-none sm:p-8"
      >
        <button
          onclick={() => {
            showModal = false;
            openButton.focus();
          }}
          class="group absolute top-2 right-2 size-8"
        >
          <span
            class="grid size-full place-items-center rounded-sm transition group-hover:bg-neutral-200 group-active:scale-95"
          >
            <LuX
              class="size-5 text-neutral-500 transition-colors group-hover:text-neutral-700"
            />
            <span class="sr-only">Close modal</span>
          </span>
        </button>

        <h3 class="font-satoshi truncate text-3xl font-semibold">Contact us</h3>

        <ul class="mt-4">
          {#each EMAILS as { label, email }}
            {@const isCopied = copied === email}
            <li
              class="flex items-center justify-between border-t border-neutral-300 py-3 last:pb-0"
            >
              <div>
                <p class="font-semibold">{label}</p>
                <p class="mt-px text-neutral-600">
                  {email}
                </p>
              </div>
              <button
                onclick={() => copy(email)}
                disabled={isCopied}
                class="group relative size-8"
              >
                <span
                  class="grid size-full place-items-center rounded-sm transition group-hover:bg-neutral-200 group-active:scale-95 group-disabled:scale-100 group-disabled:!bg-transparent"
                >
                  {#if isCopied}
                    <LuCheck class="size-4 text-emerald-700" />
                    <span class="sr-only">Copied</span>
                  {:else}
                    <LuCopy
                      class="size-4 text-neutral-500 transition-colors group-hover:text-neutral-700"
                    />
                    <span class="sr-only">Copy</span>
                  {/if}
                </span>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}
