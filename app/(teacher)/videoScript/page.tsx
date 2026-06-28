'use client'

import { useState, useEffect, useRef } from 'react'

/* ─────────────────────────── types ─────────────────────────── */
type Section = 'hook' | 'intro' | 'body' | 'conclusion' | 'cta'

interface Guide {
  topic: string
  audience: string
  duration: string
  tone: string
  notes: string
}

interface Script {
  hook: string
  intro: string
  body: string
  conclusion: string
  cta: string
}

type ModalStep = 'guide' | 'generating' | 'review' | 'submit' | null

/* ─────────────────────────── constants ─────────────────────────── */
const SECTION_META: { key: Section; label: string; mono: string; hint: string }[] = [
  { key: 'hook',       label: 'Hook',         mono: '01', hint: 'Grab attention in the first 10 seconds' },
  { key: 'intro',      label: 'Introduction', mono: '02', hint: 'Set context & learning objectives' },
  { key: 'body',       label: 'Main body',    mono: '03', hint: 'Core explanation with examples' },
  { key: 'conclusion', label: 'Conclusion',   mono: '04', hint: 'Summarise key takeaways' },
  { key: 'cta',        label: 'Call to action', mono: '05', hint: 'Next steps for the student' },
]

const AUDIENCE_OPTIONS = ['Primary (6–11)', 'Middle school (11–12)', 'High school (14–18)', 'Undergraduate', 'Graduate']
const DURATION_OPTIONS = ['< 2 minutes', '3–5 minutes', '5–10 minutes', '10+ minutes']
const TONE_OPTIONS = ['Friendly & encouraging', 'Clear & direct', 'Socratic & questioning', 'Storytelling', 'Step-by-step']

/* ─────────────────────────── fake generator ─────────────────────────── */
function generateScript(guide: Guide): Script {
  const t = guide.topic || 'this topic'
  const a = guide.audience || 'students'
  return {
    hook: `Have you ever stared at a question about ${t} and felt completely stuck? You're not alone — and in the next few minutes, that changes.`,
    intro: `Welcome. Today we're covering "${t}" — a doubt that comes up constantly for ${a}. Here's what we'll cover: the core idea, why it works, and how to apply it. No fluff, just clarity.`,
    body: `Let's break this down.\n\nThe core principle behind ${t} is simpler than it looks. Most people overcomplicate it, so let's start from scratch.\n\nStep 1: Understand what the question is actually asking. Before solving anything, slow down and read again.\n\nStep 2: Identify the key relationship or rule that applies. In this case, the crucial insight is [core concept] — and once you see it, you can't unsee it.\n\nStep 3: Apply it with a worked example. Watch how each piece connects.\n\nStep 4: Check your answer by working backwards. This catches 90% of mistakes before they happen.\n\nThe pattern here isn't unique to this problem — it's a thinking framework you can reuse.`,
    conclusion: `Let's recap. We covered the core idea behind ${t}, a four-step method to approach it, and why the usual mistakes happen. The key insight: ${t} is really just [simplified idea] once you strip away the noise.`,
    cta: `Now it's your turn. Try one practice problem right now — even 5 minutes counts. Drop your attempt in the comments and I'll personally reply. If this cleared something up, share it with one classmate who's struggling. See you in the next one.`,
  }
}

/* ─────────────────────────── helpers ─────────────────────────── */
function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0
}
function readTime(words: number) {
  return Math.max(1, Math.round(words / 130))
}

/* ─────────────────────────── components ─────────────────────────── */

function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(2px)',
        zIndex: 40,
        animation: 'fadeIn .18s ease',
      }}
    />
  )
}

function Modal({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: '1rem',
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #000',
        borderRadius: 0,
        width: '100%',
        maxWidth: wide ? 760 : 560,
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'slideUp .22s ease',
      }}>
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ title, subtitle, step, total, onClose }: {
  title: string; subtitle?: string; step?: number; total?: number; onClose: () => void
}) {
  return (
    <div style={{ borderBottom: '1px solid #000', padding: '1.25rem 1.5rem' }}>
      {step && total && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              height: 2, flex: 1,
              background: i < step ? '#000' : '#e0e0e0',
              transition: 'background .3s',
            }} />
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: '#000', margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#666', margin: '4px 0 0' }}>{subtitle}</p>}
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: '1px solid #ccc', cursor: 'pointer',
          width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: '#000', flexShrink: 0, borderRadius: 0,
          fontFamily: "'Inter', sans-serif",
        }}>✕</button>
      </div>
    </div>
  )
}

/* Guide Form Modal */
function GuideModal({ onClose, onGenerate }: {
  onClose: () => void
  onGenerate: (guide: Guide) => void
}) {
  const [guide, setGuide] = useState<Guide>({ topic: '', audience: '', duration: '', tone: '', notes: '' })
  const set = (k: keyof Guide) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setGuide(g => ({ ...g, [k]: e.target.value }))

  const canProceed = guide.topic.trim().length > 3

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal>
        <ModalHeader
          title="Start with a guide"
          subtitle="Tell us the doubt or topic — we'll build the script from this."
          step={1} total={3}
          onClose={onClose}
        />
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Student doubt or topic *</label>
            <input
              autoFocus
              value={guide.topic}
              onChange={set('topic')}
              placeholder="e.g. Why does ice float on water?"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Audience</label>
              <select value={guide.audience} onChange={set('audience')} style={inputStyle}>
                <option value="">Select level</option>
                {AUDIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Target duration</label>
              <select value={guide.duration} onChange={set('duration')} style={inputStyle}>
                <option value="">Select length</option>
                {DURATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Tone</label>
            <select value={guide.tone} onChange={set('tone')} style={inputStyle}>
              <option value="">Select tone</option>
              {TONE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Additional notes <span style={{ color: '#999' }}>(optional)</span></label>
            <textarea
              value={guide.notes}
              onChange={set('notes')}
              placeholder="Specific examples, analogies, things to avoid…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              disabled={!canProceed}
              onClick={() => onGenerate(guide)}
              style={{
                ...btnPrimary,
                opacity: canProceed ? 1 : 0.4,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
            >
              Generate script →
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

/* Generating Modal */
function GeneratingModal({ onClose }: { onClose: () => void }) {
  const [dots, setDots] = useState('.')
  const [phase, setPhase] = useState(0)
  const phases = ['Analysing your guide', 'Crafting the hook', 'Building the main body', 'Polishing the CTA']

  useEffect(() => {
    const d = setInterval(() => setDots(p => p.length >= 3 ? '.' : p + '.'), 400)
    const p = setInterval(() => setPhase(p => Math.min(p + 1, phases.length - 1)), 600)
    return () => { clearInterval(d); clearInterval(p) }
  }, [])

  return (
    <>
      <Backdrop onClick={() => {}} />
      <Modal>
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '2px solid #000',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            animation: 'spin .7s linear infinite',
          }} />
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: '#000', margin: '0 0 8px' }}>
            Writing your script{dots}
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#666', margin: 0 }}>
            {phases[phase]}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: '1.5rem' }}>
            {phases.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i <= phase ? '#000' : '#ddd',
                transition: 'background .3s',
              }} />
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}

/* Review Modal */
function ReviewModal({ script, guide, onClose, onApprove, onRegenerate }: {
  script: Script
  guide: Guide
  onClose: () => void
  onApprove: (s: Script) => void
  onRegenerate: () => void
}) {
  const [local, setLocal] = useState<Script>({ ...script })
  const [expanded, setExpanded] = useState<Record<Section, boolean>>({
    hook: true, intro: false, body: false, conclusion: false, cta: false,
  })
  const [activeEdit, setActiveEdit] = useState<Section | null>(null)

  const total = SECTION_META.reduce((acc, m) => acc + wordCount(local[m.key]), 0)

  const toggle = (k: Section) => setExpanded(e => ({ ...e, [k]: !e[k] }))
  const setField = (k: Section, v: string) => setLocal(s => ({ ...s, [k]: v }))

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal wide>
        <ModalHeader
          title="Review your script"
          subtitle="Edit any section — approve when you're ready."
          step={2} total={3}
          onClose={onClose}
        />
        {/* meta bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid #e8e8e8',
          background: '#fafafa',
        }}>
          <Chip icon="📄">{total} words</Chip>
          <Chip icon="⏱">~{readTime(total)} min</Chip>
          {guide.topic && <Chip icon="🎯">{guide.topic}</Chip>}
          {guide.audience && <Chip icon="👥">{guide.audience}</Chip>}
        </div>

        <div style={{ padding: '1.25rem 1.5rem' }}>
          {SECTION_META.map((m, idx) => {
            const isOpen = expanded[m.key]
            const isEditing = activeEdit === m.key
            const wc = wordCount(local[m.key])
            return (
              <div key={m.key} style={{
                border: '1px solid',
                borderColor: isOpen ? '#000' : '#e0e0e0',
                marginBottom: idx < SECTION_META.length - 1 ? 8 : 0,
                transition: 'border-color .15s',
              }}>
                {/* section header */}
                <div
                  onClick={() => toggle(m.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '0.75rem 1rem', cursor: 'pointer',
                    background: isOpen ? '#000' : '#fff',
                    transition: 'background .15s',
                  }}
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 500,
                    color: isOpen ? '#aaa' : '#999',
                  }}>{m.mono}</span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13, fontWeight: 500,
                    color: isOpen ? '#fff' : '#000', flex: 1,
                  }}>{m.label}</span>
                  {!isOpen && (
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12, color: '#999',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      maxWidth: 280,
                    }}>{local[m.key].substring(0, 60)}{local[m.key].length > 60 ? '…' : ''}</span>
                  )}
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: isOpen ? '#aaa' : '#bbb', flexShrink: 0,
                  }}>{wc}w</span>
                  <span style={{ color: isOpen ? '#fff' : '#999', fontSize: 12, flexShrink: 0 }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>

                {/* section body */}
                {isOpen && (
                  <div style={{ padding: '1rem' }}>
                    <p style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11, color: '#999', margin: '0 0 8px',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{m.hint}</p>
                    {isEditing ? (
                      <div>
                        <textarea
                          autoFocus
                          value={local[m.key]}
                          onChange={e => setField(m.key, e.target.value)}
                          rows={m.key === 'body' ? 10 : 4}
                          style={{
                            ...inputStyle,
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.7, fontSize: 14,
                            resize: 'vertical',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                          <button onClick={() => setActiveEdit(null)} style={btnSecondary}>Done editing</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 14, color: '#111', lineHeight: 1.7,
                          margin: '0 0 10px', whiteSpace: 'pre-wrap',
                        }}>{local[m.key]}</p>
                        <button
                          onClick={() => setActiveEdit(m.key)}
                          style={{ ...btnSecondary, fontSize: 12 }}
                        >✎ Edit this section</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem', borderTop: '1px solid #e8e8e8',
        }}>
          <button onClick={onRegenerate} style={btnSecondary}>↺ Regenerate</button>
          <button onClick={() => onApprove(local)} style={btnPrimary}>Approve & continue →</button>
        </div>
      </Modal>
    </>
  )
}

/* Submit Modal */
function SubmitModal({ script, guide, onClose, onSubmit, onEdit }: {
  script: Script
  guide: Guide
  onClose: () => void
  onSubmit: () => void
  onEdit: () => void
}) {
  const total = SECTION_META.reduce((acc, m) => acc + wordCount(script[m.key]), 0)

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal wide>
        <ModalHeader title="Ready to create" subtitle="Review the payload before submitting to the video API." step={3} total={3} onClose={onClose} />
        <div style={{ padding: '1.5rem' }}>
          {/* API ready notice */}
          <div style={{
            border: '1px solid #000',
            padding: '0.875rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>🔌</span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#333', margin: 0, lineHeight: 1.5 }}>
              The video creation API is not yet connected. Submitting will log the payload to the console.
              When the API is ready, replace the handler in <code style={{ fontFamily: "'JetBrains Mono', monospace", background: '#f4f4f4', padding: '1px 4px' }}>handleVideoCreate</code>.
            </p>
          </div>

          {/* payload preview */}
          <div style={{ border: '1px solid #e0e0e0', marginBottom: '1.25rem' }}>
            <div style={{ background: '#000', padding: '0.5rem 1rem' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#aaa' }}>PAYLOAD PREVIEW</span>
            </div>
            <div style={{ padding: '1rem' }}>
              {[
                ['topic', guide.topic],
                ['audience', guide.audience || '—'],
                ['duration', guide.duration || '—'],
                ['tone', guide.tone || '—'],
                ['total_words', String(total)],
                ['sections', '5 (hook → cta)'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '6px 0', borderBottom: '1px solid #f0f0f0',
                  fontFamily: "'Inter', sans-serif", fontSize: 13,
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#999', minWidth: 100 }}>{k}</span>
                  <span style={{ color: '#000', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* section summary */}
          <div style={{ marginBottom: '1.5rem' }}>
            {SECTION_META.map(m => (
              <div key={m.key} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid #f4f4f4',
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#999', minWidth: 20
                }}>{m.mono}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, minWidth: 110 }}>{m.label}</span>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#666',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                }}>{script[m.key].substring(0, 80)}…</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#bbb', flexShrink: 0 }}>
                  {wordCount(script[m.key])}w
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={onEdit} style={btnSecondary}>← Edit script</button>
            <button onClick={onSubmit} style={btnPrimary}>Submit to API →</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

/* Success Modal */
function SuccessModal({ guide, onClose, onNew }: {
  guide: Guide; onClose: () => void; onNew: () => void
}) {
  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal>
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, border: '2px solid #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', fontSize: 24,
          }}>✓</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: '#000', margin: '0 0 8px' }}>
            Script submitted
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#666', margin: '0 0 8px', lineHeight: 1.6 }}>
            <strong style={{ color: '#000' }}>&ldquo;{guide.topic}&rdquo;</strong> has been queued for video creation.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#999', margin: '0 0 2rem' }}>
            You&apos;ll be notified once the video is ready to review.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={onClose} style={btnSecondary}>Close</button>
            <button onClick={onNew} style={btnPrimary}>+ New video</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

/* small chip */
function Chip({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#444',
      background: '#f4f4f4', padding: '3px 9px',
    }}>
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      {children}
    </span>
  )
}

/* ─────────────────────────── shared styles ─────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%', fontFamily: "'Inter', sans-serif",
  fontSize: 14, color: '#000',
  border: '1px solid #ccc', borderRadius: 0,
  padding: '9px 11px', outline: 'none',
  background: '#fff', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 12, color: '#555',
  display: 'block', marginBottom: 5,
  textTransform: 'uppercase', letterSpacing: '0.05em',
}
const btnPrimary: React.CSSProperties = {
  background: '#000', color: '#fff', border: '1px solid #000',
  padding: '9px 20px', cursor: 'pointer', borderRadius: 0,
  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
}
const btnSecondary: React.CSSProperties = {
  background: '#fff', color: '#000', border: '1px solid #000',
  padding: '9px 16px', cursor: 'pointer', borderRadius: 0,
  fontFamily: "'Inter', sans-serif", fontSize: 13,
}

/* ─────────────────────────── landing page ─────────────────────────── */

function HowItWorkStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, color: '#999', minWidth: 24, paddingTop: 3,
      }}>{num}</span>
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: '#000', margin: '0 0 4px' }}>{title}</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#666', margin: 0, lineHeight: 1.6 }}>{body}</p>
      </div>
    </div>
  )
}

function SampleScriptCard({ section, label, preview }: { section: string; label: string; preview: string }) {
  return (
    <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#999' }}>{section}</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: '#000' }}>{label}</span>
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#555', margin: 0, lineHeight: 1.6 }}>{preview}</p>
    </div>
  )
}

/* ─────────────────────────── main page ─────────────────────────── */
export default function Home() {
  const [modal, setModal] = useState<ModalStep>(null)
  const [guide, setGuide] = useState<Guide>({ topic: '', audience: '', duration: '', tone: '', notes: '' })
  const [script, setScript] = useState<Script | null>(null)
  const [submittedGuide, setSubmittedGuide] = useState<Guide | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const close = () => setModal(null)

  const handleGenerate = (g: Guide) => {
    setGuide(g)
    setModal('generating')
    setTimeout(() => {
      setScript(generateScript(g))
      setModal('review')
    }, 2800)
  }

  const handleApprove = (s: Script) => {
    setScript(s)
    setModal('submit')
  }

  const handleSubmit = () => {
    const payload = { guide, script }
    console.log('[TeacherOS] Video API payload →', JSON.stringify(payload, null, 2))
    setSubmittedGuide(guide)
    setModal(null)
    setShowSuccess(true)
  }

  const handleNew = () => {
    setShowSuccess(false)
    setScript(null)
    setGuide({ topic: '', audience: '', duration: '', tone: '', notes: '' })
    setModal('guide')
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { background: #fff; color: #000; -webkit-font-smoothing: antialiased; }
        input:focus, textarea:focus, select:focus { outline: 2px solid #000; outline-offset: 0; }
        button:focus-visible { outline: 2px solid #000; outline-offset: 2px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f4f4f4; }
        ::-webkit-scrollbar-thumb { background: #ccc; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30,
        borderBottom: '1px solid #000', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, fontWeight: 400, color: '#000' }}>TeacherOS</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#fff',
            background: '#000', padding: '1px 6px', letterSpacing: '0.05em',
          }}>STUDIO</span>
        </div>
        <button onClick={() => setModal('guide')} style={btnPrimary}>
          + New video
        </button>
      </nav>

      {/* ── Ticker ── */}
      <div style={{
        position: 'fixed', top: 52, left: 0, right: 0, zIndex: 29,
        borderBottom: '1px solid #e0e0e0', background: '#fafafa',
        overflow: 'hidden', height: 28,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', height: '100%',
          animation: 'tickerScroll 22s linear infinite',
          whiteSpace: 'nowrap', width: 'max-content',
        }}>
          {['Hook', 'Introduction', 'Main Body', 'Conclusion', 'Call to Action'].concat(
            ['Hook', 'Introduction', 'Main Body', 'Conclusion', 'Call to Action']
          ).map((s, i) => (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: '#aaa',
              padding: '0 1.5rem', letterSpacing: '0.08em',
            }}>
              {String(i % 5 + 1).padStart(2, '0')} — {s.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{
        paddingTop: 130, paddingBottom: 80,
        borderBottom: '1px solid #000',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        maxWidth: 1100, margin: '0 auto', padding: '130px 2rem 80px',
        gap: 60,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: '#999', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 16,
          }}>Video Studio — Beta</p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: 400, color: '#000', lineHeight: 1.1,
            margin: '0 0 20px',
          }}>
            Turn a student doubt<br />
            into a <em style={{ fontStyle: 'italic' }}>polished</em> video
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15, color: '#555', lineHeight: 1.7,
            margin: '0 0 32px', maxWidth: 380,
          }}>
            Describe the topic, approve the generated script, and submit it for video creation — in under 5 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setModal('guide')} style={{ ...btnPrimary, fontSize: 14, padding: '11px 24px' }}>
              Create a video →
            </button>
            <a href="#how" style={{ ...btnSecondary, fontSize: 14, padding: '11px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              See how it works
            </a>
          </div>
        </div>

        {/* script preview card */}
        <div style={{ border: '1px solid #000', background: '#fff', padding: '1.25rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e8e8',
          }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500 }}>Sample script</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              background: '#000', color: '#fff', padding: '2px 7px',
            }}>PREVIEW</span>
          </div>
          <SampleScriptCard section="01" label="Hook" preview="Have you ever stared at a maths problem and felt your brain go completely blank? In the next few minutes, that changes." />
          <SampleScriptCard section="02" label="Introduction" preview="Today we're covering quadratic equations — a question that trips up most students. Here's what we'll cover: the pattern, why it works, and how to apply it." />
          <SampleScriptCard section="03" label="Main body" preview="The core insight is simpler than it looks. Most people overcomplicate it, so let's start from zero with a worked example…" />
          <SampleScriptCard section="04" label="Conclusion" preview="We covered the factorisation pattern, a four-step method, and why the usual mistakes happen. The key insight: every quadratic hides two factors." />
          <SampleScriptCard section="05" label="CTA" preview="Try one practice problem right now. Drop your answer in the comments and I'll personally reply." />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{
        maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem',
        borderBottom: '1px solid #e8e8e8',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60,
      }}>
        <div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: '#999', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 12,
          }}>Process</p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 34, fontWeight: 400, color: '#000',
            margin: '0 0 12px',
          }}>How it works</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 0 }}>
            A guided three-step flow — from rough notes to a production-ready script.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <HowItWorkStep num="01" title="Write a guide" body="Describe the student doubt, pick the audience level and target duration. Add any extra notes — tone, examples, analogies to use." />
          <HowItWorkStep num="02" title="Review the script" body="We generate a structured script with Hook, Introduction, Main Body, Conclusion, and CTA. Edit any section before you approve." />
          <HowItWorkStep num="03" title="Submit for video creation" body="Once approved, the script payload is sent to the video API. You get a notification when the video is ready." />
        </div>
      </section>

      {/* ── Script sections explainer ── */}
      <section style={{
        maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem',
        borderBottom: '1px solid #e8e8e8',
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, color: '#999', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: 32,
        }}>Script structure</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
          {SECTION_META.map((m, i) => (
            <div key={m.key} style={{
              borderLeft: i === 0 ? '1px solid #000' : 'none',
              borderRight: '1px solid #000',
              borderTop: '1px solid #000',
              borderBottom: '1px solid #000',
              padding: '1.25rem 1rem',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: '#999', display: 'block', marginBottom: 10,
              }}>{m.mono}</span>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: '#000', marginBottom: 6 }}>{m.label}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#777', lineHeight: 1.6, margin: 0 }}>{m.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem 6rem',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 400, color: '#000',
          margin: '0 0 16px',
        }}>
          Ready to make your first video?
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15, color: '#666', margin: '0 0 32px',
        }}>Takes less than 5 minutes from start to script.</p>
        <button onClick={() => setModal('guide')} style={{ ...btnPrimary, fontSize: 15, padding: '13px 32px' }}>
          Get started →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #000', padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15 }}>TeacherOS</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#999' }}>
          Video Studio v0.1
        </span>
      </footer>

      {/* ── Modals ── */}
      {modal === 'guide' && (
        <GuideModal onClose={close} onGenerate={handleGenerate} />
      )}
      {modal === 'generating' && (
        <GeneratingModal onClose={close} />
      )}
      {modal === 'review' && script && (
        <ReviewModal
          script={script}
          guide={guide}
          onClose={close}
          onApprove={handleApprove}
          onRegenerate={() => handleGenerate(guide)}
        />
      )}
      {modal === 'submit' && script && (
        <SubmitModal
          script={script}
          guide={guide}
          onClose={close}
          onSubmit={handleSubmit}
          onEdit={() => setModal('review')}
        />
      )}
      {showSuccess && submittedGuide && (
        <SuccessModal
          guide={submittedGuide}
          onClose={() => setShowSuccess(false)}
          onNew={handleNew}
        />
      )}
    </>
  )
}