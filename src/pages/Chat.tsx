import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, Trash2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type ChatMessage } from '../lib/supabase';
import { chatReply, healthDisclaimer } from '../lib/health';
import { PageHeader } from '../components/Layout';
import { Spinner } from '../components/ui';

const suggestions = [
  'I have a headache and feel tired',
  'How much water should I drink daily?',
  'Tips for better sleep',
  'What is a healthy BMI range?',
];

export function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(100);
      setMessages((data as ChatMessage[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;
    setInput('');
    setSending(true);

    const userMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      user_id: user?.id ?? '',
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    await new Promise((r) => setTimeout(r, 700));
    const reply = chatReply(content);

    const assistantMsg: ChatMessage = {
      id: 'temp-a-' + Date.now(),
      user_id: user?.id ?? '',
      role: 'assistant',
      content: reply,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setSending(false);

    if (user) {
      const [u, a] = await Promise.all([
        supabase
          .from('chat_messages')
          .insert({ user_id: user.id, role: 'user', content })
          .select('id')
          .maybeSingle(),
        supabase
          .from('chat_messages')
          .insert({ user_id: user.id, role: 'assistant', content: reply })
          .select('id')
          .maybeSingle(),
      ]);
      if (u.data?.id || a.data?.id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMsg.id && u.data?.id ? { ...m, id: u.data.id } : m
          )
        );
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id && a.data?.id ? { ...m, id: a.data.id } : m
          )
        );
      }
    }
  };

  const clearChat = async () => {
    if (!user) {
      setMessages([]);
      return;
    }
    await supabase.from('chat_messages').delete().eq('user_id', user.id);
    setMessages([]);
  };

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="AI Assistant"
        title="Chat with Vita AI"
        subtitle="Ask about symptoms, wellness, nutrition, sleep, and more — anytime."
        icon={<Bot className="h-3.5 w-3.5" />}
      />

      <div className="mt-8 card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
              <Bot className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-success-400 ring-2 ring-white" />
            </span>
            <div>
              <div className="font-display text-sm font-bold text-ink-900">Vita AI</div>
              <div className="flex items-center gap-1.5 text-xs text-success-600">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500" /> Online
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-ink-500 hover:bg-ink-100 hover:text-ink-700"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[460px] space-y-4 overflow-y-auto bg-ink-50/30 p-5">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner className="h-7 w-7 text-primary-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-600">
                <Sparkles className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">How can I help today?</h3>
              <p className="mt-1.5 max-w-sm text-sm text-ink-500">
                Ask me anything about your health, symptoms, or wellness goals.
              </p>
              <div className="mt-6 grid w-full max-w-md gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-ink-100 bg-white px-4 py-3 text-left text-sm font-medium text-ink-700 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => <Bubble key={m.id} message={m} />)
          )}
          {sending && (
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 ring-1 ring-ink-100">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-ink-100 p-4">
          <input
            className="input"
            placeholder="Ask anything about your health…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
          />
          <button onClick={() => send(input)} disabled={sending || !input.trim()} className="btn-primary shrink-0">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-400">{healthDisclaimer}</p>
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <Bot className="h-4 w-4" />
        </span>
      )}
      <div
        className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-primary-600 text-white'
            : 'rounded-tl-sm bg-white text-ink-800 ring-1 ring-ink-100'
        }`}
      >
        {message.content}
      </div>
      {isUser && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-200 text-ink-600">
          <UserIcon className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}
