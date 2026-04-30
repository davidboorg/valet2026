<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Valaffischmuseet

This repo is the Next.js app for a digital museum of Swedish election posters, launching ahead of the September 2026 election. It pulls historical affischer from KB (Kungliga biblioteket) via IIIF deep zoom, with metadata in Supabase.

## Two parallel workstreams

This codebase has two concerns that share the repo:

1. **Build** — the Next.js app itself. Front-end, IIIF viewer, Supabase data model, KB API integration. See `../claude-code-prompt-valaffischer.md` for the full build brief and `../design-prompt-valaffischer.md` for the design system.

2. **Campaign** — the organic social media campaign that runs maj–september 2026. See `../kampanj-prompt-valaffischer.md` for the full campaign brief and `.claude/agents/campaign-curator.md` for the agent that drafts and queues content. Campaign state lives in `editorial-plan.md` at this repo root.

The two workstreams use the same KB data and metadata model, so changes to one can affect the other. When working on the build, check `editorial-plan.md` for content the campaign relies on. When working on the campaign, do not modify build code.

## Critical legal frame for any campaign work

The campaign operates under EU 2024/900 (politisk reklam) + svensk SFS 2025:1408 + Meta's stop on paid election content. **Organic only, ever.** The full set of constraints is in `../kampanj-prompt-valaffischer.md` under "Legal frame" and "Kill criteria." Read those before generating, editing, or publishing any campaign content.

The 26 augusti–13 september lockdown period requires double-review on everything. Default to "no" on any post that could be misread as voter influence.

## Running the campaign agent

```
claude
> Use the campaign-curator agent. Run [daily ingest | weekly draft | monthly plan].
```

The agent will load `../kampanj-prompt-valaffischer.md` and `editorial-plan.md`, then execute. It writes back to `editorial-plan.md`. It never publishes.
