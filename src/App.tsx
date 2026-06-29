import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import {
  AtSign,
  Bell,
  CheckCircle2,
  Hash,
  MessageSquare,
  Paperclip,
  Radio,
  Search,
  Send,
  ShieldCheck,
  Users,
  Video,
} from 'lucide-react'
import './App.css'

type ChannelStatus = 'Live' | 'Quiet' | 'Needs reply'

type Channel = {
  id: string
  name: string
  team: string
  unread: number
  members: number
  responseTime: string
  status: ChannelStatus
}

type Message = {
  id: string
  channelId: string
  author: string
  role: string
  body: string
  time: string
}

const channels: Channel[] = [
  {
    id: 'launch',
    name: 'launch-room',
    team: 'Product',
    unread: 8,
    members: 14,
    responseTime: '2m',
    status: 'Live',
  },
  {
    id: 'support',
    name: 'support-desk',
    team: 'Customer',
    unread: 3,
    members: 9,
    responseTime: '6m',
    status: 'Needs reply',
  },
  {
    id: 'infra',
    name: 'infra-watch',
    team: 'Engineering',
    unread: 0,
    members: 6,
    responseTime: '12m',
    status: 'Quiet',
  },
]

const initialMessages: Message[] = [
  {
    id: 'm1',
    channelId: 'launch',
    author: 'Nadia',
    role: 'Product lead',
    body: 'Release checklist is down to payment copy, docs pass, and one pricing QA sweep.',
    time: '09:42',
  },
  {
    id: 'm2',
    channelId: 'launch',
    author: 'Ilan',
    role: 'Engineer',
    body: 'I pushed the billing event fix and attached the rollback note to the launch ticket.',
    time: '09:46',
  },
  {
    id: 'm3',
    channelId: 'support',
    author: 'Mira',
    role: 'Support',
    body: 'Three accounts are asking for invoice resend. Can finance confirm the new template?',
    time: '09:31',
  },
  {
    id: 'm4',
    channelId: 'infra',
    author: 'Owen',
    role: 'SRE',
    body: 'Queue latency is stable after the worker scale-up. Monitoring for one more cycle.',
    time: '09:20',
  },
]

const theme = {
  '--accent': '#4f46e5',
  '--accent-2': '#0ea5e9',
  '--accent-3': '#f97316',
} as CSSProperties

function getStatusClass(status: ChannelStatus) {
  if (status === 'Live') return 'good'
  if (status === 'Needs reply') return 'warn'
  return 'info'
}

function App() {
  const [selectedId, setSelectedId] = useState(channels[0].id)
  const [search, setSearch] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const selected = channels.find((channel) => channel.id === selectedId) ?? channels[0]

  const filteredChannels = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return channels

    return channels.filter((channel) =>
      [channel.name, channel.team, channel.status].join(' ').toLowerCase().includes(query),
    )
  }, [search])

  const selectedMessages = messages.filter((message) => message.channelId === selected.id)
  const unreadTotal = channels.reduce((sum, channel) => sum + channel.unread, 0)
  const liveChannels = channels.filter((channel) => channel.status === 'Live').length
  const members = channels.reduce((sum, channel) => sum + channel.members, 0)

  function sendMessage() {
    const body = draft.trim()
    if (!body) return

    setMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        channelId: selected.id,
        author: 'You',
        role: 'Builder',
        body,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setDraft('')
  }

  return (
    <main className="app" style={theme}>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <MessageSquare size={22} aria-hidden="true" />
            </span>
            <div>
              <h1>RelayDesk</h1>
              <p>Team messaging command center</p>
            </div>
          </div>
          <div className="toolbar">
            <button className="icon-button" type="button" aria-label="Open alerts">
              <Bell size={18} aria-hidden="true" />
            </button>
            <button className="ghost-button" type="button">
              <Video size={17} aria-hidden="true" />
              Start huddle
            </button>
            <button className="action-button" type="button">
              <AtSign size={17} aria-hidden="true" />
              Invite teammate
            </button>
          </div>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Real-time collaboration</p>
            <h2>Channels, replies, unread state, and team context for fast-moving work.</h2>
            <p>
              RelayDesk is a focused messaging surface with channel search, live room
              status, reply urgency, and a working message composer.
            </p>
          </div>
          <aside className="command-stack" aria-label="Message actions">
            <button className="action-button" type="button">
              <Send size={17} aria-hidden="true" />
              Send digest
            </button>
            <button className="ghost-button" type="button">
              <Paperclip size={17} aria-hidden="true" />
              Attach brief
            </button>
            <button className="ghost-button" type="button">
              <ShieldCheck size={17} aria-hidden="true" />
              Review access
            </button>
          </aside>
        </section>

        <section className="stats-grid" aria-label="Messaging summary">
          <article className="metric">
            <span className="metric-icon">
              <Radio size={19} aria-hidden="true" />
            </span>
            <h3>{liveChannels}</h3>
            <p>Live channels</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <Bell size={19} aria-hidden="true" />
            </span>
            <h3>{unreadTotal}</h3>
            <p>Unread messages</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <Users size={19} aria-hidden="true" />
            </span>
            <h3>{members}</h3>
            <p>Workspace members</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <CheckCircle2 size={19} aria-hidden="true" />
            </span>
            <h3>98%</h3>
            <p>Message delivery</p>
          </article>
        </section>

        <section className="workspace-grid">
          <div className="panel">
            <div className="panel-title">
              <div>
                <h2>Channels</h2>
                <p>Select a room and continue the thread.</p>
              </div>
            </div>
            <div className="search-row">
              <label className="search-box">
                <Search size={17} aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search channels"
                />
              </label>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Channel</th>
                    <th>Team</th>
                    <th>Members</th>
                    <th>Unread</th>
                    <th>Reply</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChannels.map((channel) => (
                    <tr key={channel.id}>
                      <td>
                        <button
                          className="row-button"
                          type="button"
                          onClick={() => setSelectedId(channel.id)}
                        >
                          <span className="strong">
                            <Hash size={14} aria-hidden="true" /> {channel.name}
                          </span>
                        </button>
                      </td>
                      <td>{channel.team}</td>
                      <td>{channel.members}</td>
                      <td>{channel.unread}</td>
                      <td>{channel.responseTime}</td>
                      <td>
                        <span className={`status ${getStatusClass(channel.status)}`}>
                          {channel.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="panel">
            <div className="panel-title">
              <div>
                <h2>#{selected.name}</h2>
                <p>{selected.team} channel</p>
              </div>
              <span className={`status ${getStatusClass(selected.status)}`}>
                {selected.status}
              </span>
            </div>
            <div className="detail-stack">
              <div className="mini-grid">
                <div className="mini-stat">
                  <p>Unread</p>
                  <strong>{selected.unread}</strong>
                </div>
                <div className="mini-stat">
                  <p>Reply pace</p>
                  <strong>{selected.responseTime}</strong>
                </div>
              </div>
              <div className="detail-row">
                <span className="muted">Thread</span>
                {selectedMessages.map((message) => (
                  <span className="message-row" key={message.id}>
                    <span className="split-row">
                      <span>
                        <span className="strong">{message.author}</span>{' '}
                        <span className="muted">{message.role}</span>
                      </span>
                      <span className="muted">{message.time}</span>
                    </span>
                    <span>{message.body}</span>
                  </span>
                ))}
              </div>
              <div className="detail-row">
                <label className="search-box">
                  <MessageSquare size={17} aria-hidden="true" />
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') sendMessage()
                    }}
                    placeholder="Write a reply"
                  />
                </label>
                <button className="action-button" type="button" onClick={sendMessage}>
                  <Send size={17} aria-hidden="true" />
                  Send reply
                </button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default App
