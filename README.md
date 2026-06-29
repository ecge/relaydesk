# RelayDesk

RelayDesk is a team messaging command center with channel state, unread counts,
reply pace, access actions, and an interactive message composer.

## What it demonstrates

- Channel search with live status and unread counters.
- Selectable channel detail with member and reply metrics.
- Working composer that appends messages to the active thread.
- Collaboration-focused UI without borrowing Discord or Slack branding.
- Responsive dashboard layout with dense but readable information.
- ChatScope components for the conversation list, chat container, message list, and composer.

## Stack

- React 19
- TypeScript
- Vite
- ChatScope Chat UI Kit React
- ChatScope Chat UI Kit Styles
- Small scoped CSS for app framing only

## UI source

The visual layer uses ChatScope Chat UI Kit React, an MIT-licensed chat UI toolkit:
https://github.com/chatscope/chat-ui-kit-react

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
