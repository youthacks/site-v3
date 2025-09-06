# Youthacks website

This is the (hopefully to-be) website for Youthacks. We support and run student-led hackathons.

This website is made with [Astro](https://astro.build), with [Svelte](https://svelte.dev) for some interactive parts.

## 🚀 Contribute

```sh
pnpm install
pnpm dev
```

### Content

Each event has its own file in `content/events/`. If there's a new event, just copy an existing one and change it up a bit - usually that's all you need to do 🙃

### Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |
