# Quang Duy Vuong — Portfolio

Personal portfolio website for LinkedIn and recruiters. It's a static site in plain HTML, CSS and JavaScript, with no build step and no dependencies.

**Sections:** hero · highlights · about · two project case studies · lab (project #3: a model built from scratch) · Ask my portfolio · toolkit · education · contact.

### Theme gallery
Open it with the swatch button in the nav, the ⌘K palette, or `theme <name>` in the hero terminal. There are 17 themes in three groups:

| Group | Themes | What changes |
|---|---|---|
| Original | Nebula, Nebula Light | Colours |
| Dev website skins | GitHub Dark and Light, VS Code, Terminal | Colours, fonts **and layout**: GitHub-style tabbed header and repo cards, a VS Code-style file explorer with editor tabs and a status bar, or a CRT terminal with `$ cat` prompts |
| Editor colour schemes | Dracula, Tokyo Night, Nord, Catppuccin Mocha and Latte, Gruvbox, One Dark, Monokai, Rosé Pine, Synthwave '84, Solarized Light | Colours |

Colour palettes are set per `[data-theme]` in `style.css`, and layout skins per `[data-layout]`. The registry is the `THEMES` array in `main.js`. The sun/moon button switches between light and dark versions of the current theme.

### Interactive features for visitors
- **Working terminal** in the hero: `help`, `projects`, `open rag`, `skills`, `neofetch`, `ask <question>`, `sudo hire-me` and more, with Tab completion and ↑/↓ history.
- **Ask my portfolio:** a small RAG pipeline that runs in the browser. It uses BM25 retrieval and a grader over facts from the page, answers with a cited source, and refuses questions the page can't answer.
- **RAG demo with a question picker:** visitors choose an answerable question, a question typed without diacritics, or a prompt-injection attempt.
- **Traffic tracking simulator:** a confidence-threshold slider, a draggable counting line, click-to-spawn vehicles, and night mode with a gamma boost. These mirror the real project's `conf`, `line_y` and `NIGHT_MODE`.
- **Neural network playground:** a 2→h→h→1 network written from scratch (hand-written backprop). Visitors can switch datasets (XOR, circle, spiral), click to add points, and adjust the learning rate and number of neurons.
- **Skill chips:** clicking a skill shows which project uses it.
- **Command palette:** open it with ⌘K / Ctrl+K.
- **Decoration:** scroll progress bar, 3D tilt cards, cursor spotlight, magnetic buttons and a tech marquee. The Konami code (↑↑↓↓←→←→BA) triggers confetti.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish on GitHub Pages

1. Merge this branch into `main`.
2. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then `main` and `/ (root)`.
3. The site goes live at `https://akumonzzzz.github.io/Linkedin-portfolio-/`.
4. On LinkedIn, go to **Profile → Add section → Featured → Add a link**, or add it to **Contact info → Website**.

> GitHub Pages on a **private** repository needs GitHub Pro. On a free account, make the repo public first.
> Vercel and Netlify also work: import the repo and deploy it with no build command.

## Personalise

| What | Where |
|---|---|
| LinkedIn URL | `index.html`: search for `linkedin.com/in/` |
| Project #3 roadmap | `index.html`: the `.roadmap` list in `#lab` |
| Education years or other details | `index.html`: the `#education` section |
| Colours | `assets/css/style.css`: the `--a1`, `--a2` and `--a3` tokens in `:root` |
| Rotating hero phrases | `assets/js/main.js`: the `roles` array |
| Ask-my-portfolio facts | `assets/js/main.js`: the `KB` array (add a fact whenever you ship something) |
| Terminal commands | `assets/js/main.js`: the `CMDS` object |
| Link preview image | `assets/img/og.png` (1200×630) |

## Structure

```
index.html
assets/
  css/style.css      design tokens, layout, dark and light themes
  js/main.js         neural canvas, typed roles, RAG and tracking simulations, reveals
  img/               favicon, OG preview, project screenshots
```

The site supports dark and light themes, `prefers-reduced-motion`, keyboard focus styles and a skip link. Its animations pause while off-screen.
