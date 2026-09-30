# Quang Duy Vuong — Portfolio

Personal portfolio website for LinkedIn and recruiters. It's a static site in plain HTML, CSS and JavaScript, with no build step and no dependencies.

**Sections:** hero · highlights · about · two project case studies · lab (work in progress) · Ask my portfolio · toolkit · education · contact.

### Interactive features for visitors
- **Working terminal** in the hero: `help`, `projects`, `open rag`, `skills`, `neofetch`, `ask <question>`, `sudo hire-me` and more, with Tab completion and ↑/↓ history.
- **Ask my portfolio:** a small RAG pipeline that runs in the browser. It uses BM25 retrieval and a grader over facts from the page, answers with a cited source, and refuses questions the page can't answer.
- **RAG demo with a question picker:** visitors choose an answerable question, a question typed without diacritics, or a prompt-injection attempt.
- **Traffic tracking simulator:** a confidence-threshold slider, a draggable counting line, click-to-spawn vehicles, and night mode with a gamma boost. These mirror the real project's `conf`, `line_y` and `NIGHT_MODE`.
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
| Project #3 (in progress) | `index.html`: the `#lab` section |
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
