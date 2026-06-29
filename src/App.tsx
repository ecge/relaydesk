import { useState } from 'react'
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  Search,
  Sidebar,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
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
  color: string
}

type ChatMessage = {
  id: string
  channelId: string
  author: string
  role: string
  body: string
  time: string
  direction: 'incoming' | 'outgoing'
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
    color: '#6f42c1',
  },
  {
    id: 'support',
    name: 'support-desk',
    team: 'Customer',
    unread: 3,
    members: 9,
    responseTime: '6m',
    status: 'Needs reply',
    color: '#0d6efd',
  },
  {
    id: 'infra',
    name: 'infra-watch',
    team: 'Engineering',
    unread: 0,
    members: 6,
    responseTime: '12m',
    status: 'Quiet',
    color: '#198754',
  },
]

const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    channelId: 'launch',
    author: 'Nadia',
    role: 'Product lead',
    body: 'Release checklist is down to payment copy, docs pass, and one pricing QA sweep.',
    time: '09:42',
    direction: 'incoming',
  },
  {
    id: 'm2',
    channelId: 'launch',
    author: 'Ilan',
    role: 'Engineer',
    body: 'I pushed the billing event fix and attached the rollback note to the launch ticket.',
    time: '09:46',
    direction: 'incoming',
  },
  {
    id: 'm3',
    channelId: 'support',
    author: 'Mira',
    role: 'Support',
    body: 'Three accounts are asking for invoice resend. Can finance confirm the new template?',
    time: '09:31',
    direction: 'incoming',
  },
  {
    id: 'm4',
    channelId: 'infra',
    author: 'Owen',
    role: 'SRE',
    body: 'Queue latency is stable after the worker scale-up. Monitoring for one more cycle.',
    time: '09:20',
    direction: 'incoming',
  },
]

function initials(name: string) {
  return name
    .split('-')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function avatarSource(label: string, color: string) {
  const text = initials(label)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="16" fill="${color}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="700">${text}</text></svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function App() {
  const [selectedId, setSelectedId] = useState(channels[0].id)
  const [messages, setMessages] = useState(initialMessages)
  const selected = channels.find((channel) => channel.id === selectedId) ?? channels[0]
  const selectedMessages = messages.filter((message) => message.channelId === selected.id)

  function sendMessage(message: string) {
    const body = message.trim()
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
        direction: 'outgoing',
      },
    ])
  }

  return (
    <main className="relaydesk-app">
      <section className="relaydesk-frame">
        <MainContainer responsive>
          <Sidebar position="left" scrollable={false}>
            <div className="relaydesk-brand">
              <strong>RelayDesk</strong>
              <span>ChatScope team workspace</span>
            </div>
            <Search placeholder="Search channels" />
            <ConversationList>
              {channels.map((channel) => (
                <Conversation
                  active={channel.id === selected.id}
                  info={`${channel.unread} unread · ${channel.responseTime}`}
                  key={channel.id}
                  lastSenderName={channel.team}
                  name={`#${channel.name}`}
                  onClick={() => setSelectedId(channel.id)}
                  unreadCnt={channel.unread}
                >
                  <Avatar
                    name={initials(channel.name)}
                    src={avatarSource(channel.name, channel.color)}
                    status={channel.status === 'Live' ? 'available' : 'away'}
                  />
                </Conversation>
              ))}
            </ConversationList>
          </Sidebar>

          <ChatContainer>
            <ConversationHeader>
              <Avatar
                name={initials(selected.name)}
                src={avatarSource(selected.name, selected.color)}
                status={selected.status === 'Live' ? 'available' : 'away'}
              />
              <ConversationHeader.Content
                info={`${selected.members} members · ${selected.status}`}
                userName={`#${selected.name}`}
              />
            </ConversationHeader>
            <MessageList
              typingIndicator={
                selected.status === 'Live' ? (
                  <TypingIndicator content={`${selected.team} is active now`} />
                ) : undefined
              }
            >
              <MessageSeparator content="Today" />
              {selectedMessages.map((message) => (
                <Message
                  key={message.id}
                  model={{
                    direction: message.direction,
                    message: message.body,
                    position: 'single',
                    sender: message.author,
                    sentTime: message.time,
                  }}
                >
                  <Message.Header sender={`${message.author} · ${message.role}`} sentTime={message.time} />
                </Message>
              ))}
            </MessageList>
            <MessageInput attachButton placeholder={`Message #${selected.name}`} onSend={sendMessage} />
          </ChatContainer>
        </MainContainer>
      </section>
    </main>
  )
}

export default App
