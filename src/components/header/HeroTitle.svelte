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

  let currentWordIndex = 0;
  let currentWord = $state(words[0]);
  let isChanging = $state(false);

  function sleepRandom(min: number, max: number) {
    return new Promise((r) => setTimeout(r, Math.random() * (max - min) + min));
  }

  const changeWord = async () => {
    await new Promise((r) => setTimeout(r, 3000));

    isChanging = true;
    let word = words[currentWordIndex];
    for (let i = word.length; i >= 0; i--) {
      currentWord = word.slice(0, i);
      await sleepRandom(25, 50);
    }
    await new Promise((r) => setTimeout(r, 250));

    currentWordIndex = (currentWordIndex + 1) % words.length;
    word = words[currentWordIndex];
    for (let i = 0; i <= word.length; i++) {
      currentWord = word.slice(0, i);
      await sleepRandom(50, 100);
    }

    isChanging = false;
    changeWord();
  };

  onMount(() => {
    changeWord();
  });
</script>

<h1 class={"font-satoshi text-6xl font-black tracking-tighter sm:text-7xl"}>
  <span>We are</span><br class="md:max-lg:hidden" />
  <span class="text-red-800">
    {currentWord}<span class={[!isChanging && "animate-blink"]}>_</span>
  </span>
</h1>
