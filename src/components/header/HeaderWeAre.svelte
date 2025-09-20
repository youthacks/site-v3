<script lang="ts">
  import { onMount } from "svelte";

  const words = [
    "makers",
    "hackers",
    "builders",
    "creators",
    "dreamers",
    "innovators",
  ];
  const headingClass = "font-satoshi text-8xl font-black tracking-tighter";
  let wordLengths = $state<number[]>(Array(words.length).fill(0));

  let currentWordIndex = 0;
  let currentWord = $state(words[0]);
  let isChanging = $state(false);

  function sleepRandom(min: number, max: number) {
    return new Promise((r) => setTimeout(r, Math.random() * (max - min) + min));
  }

  const changeWord = async () => {
    await new Promise((r) => setTimeout(r, 2000));

    isChanging = true;
    let word = words[currentWordIndex];
    for (let i = word.length; i >= 0; i--) {
      currentWord = word.slice(0, i);
      await sleepRandom(50, 75);
    }

    currentWordIndex = (currentWordIndex + 1) % words.length;
    word = words[currentWordIndex];
    for (let i = 0; i <= word.length; i++) {
      currentWord = word.slice(0, i);
      await sleepRandom(50, 125);
    }

    isChanging = false;
    changeWord();
  };

  onMount(() => {
    changeWord();
  });
</script>

<h1 class={headingClass}>
  <span>We are</span>
  <span class="text-red-800">
    {currentWord}<span class={[!isChanging && "animate-blink"]}>_</span>
  </span>
</h1>
