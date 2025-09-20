<script lang="ts">
  import { tick } from "svelte";
  import { portal } from "svelte-portal";
  import type { Attachment } from "svelte/attachments";
  import { fade, scale } from "svelte/transition";

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

  const clickOutside = (fn: () => void): Attachment => {
    return (element) => {
      const handleClick = (event: MouseEvent) => {
        if (element.contains(event.target as Node)) return;
        fn();
      };

      document.addEventListener("click", handleClick, true);
      return () => {
        document.removeEventListener("click", handleClick, true);
      };
    };
  };

  const focusTrap = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift + Tab - if on first element, go to last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab - if on last element, go to first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);

    // Focus the modal when it opens
    tick().then(() => {
      element.focus();
    });

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  };
</script>

<button
  {...props}
  bind:this={openButton}
  onclick={() => (showModal = true)}
  class={["cursor-pointer", className]}
>
  {@render children?.()}
</button>

<div use:portal class="relative z-30" hidden>
  {#if showModal}
    <div
      transition:fade={{ duration: 150 }}
      class="fixed inset-0 bg-black/50"
    ></div>
    <div class="fixed inset-0 flex items-center justify-center p-8">
      <div
        {@attach focusTrap}
        {@attach clickOutside(() => {
          if (showModal) {
            showModal = false;
            openButton.focus();
          }
        })}
        onkeyup={(event) => {
          if (event.key === "Escape" && showModal) {
            showModal = false;
            openButton.focus();
          }
        }}
        transition:scale={{ duration: 150, start: 0.95 }}
        role="dialog"
        tabindex={0}
        class="relative w-full max-w-xl rounded-xl bg-white p-8 shadow-lg outline-none"
      >
        <button
          onclick={() => {
            showModal = false;
            openButton.focus();
          }}
          class="group absolute top-2 right-2 size-8"
        >
          <span
            class="grid size-full place-items-center rounded-sm transition group-hover:bg-stone-200 group-active:scale-95"
          >
            <LuX
              class="size-5 text-stone-500 transition-colors group-hover:text-stone-700"
            />
            <span class="sr-only">Close modal</span>
          </span>
        </button>

        <h3 class="font-satoshi truncate text-3xl font-semibold">Contact us</h3>

        <ul class="mt-4">
          {#each EMAILS as { label, email }}
            {@const isCopied = copied === email}
            <li
              class="flex items-center justify-between border-t border-stone-300 py-3 last:pb-0"
            >
              <div>
                <p class="font-semibold">{label}</p>
                <p class="mt-px text-stone-600">
                  {email}
                </p>
              </div>
              <button
                onclick={() => copy(email)}
                disabled={isCopied}
                class="group relative size-8"
              >
                <span
                  class="grid size-full place-items-center rounded-sm transition group-hover:bg-stone-200 group-active:scale-95 group-disabled:scale-100 group-disabled:!bg-transparent"
                >
                  {#if isCopied}
                    <LuCheck class="size-4 text-emerald-700" />
                    <span class="sr-only">Copied</span>
                  {:else}
                    <LuCopy
                      class="size-4 text-stone-500 transition-colors group-hover:text-stone-700"
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
  {/if}
</div>
