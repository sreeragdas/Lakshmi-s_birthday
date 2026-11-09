import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import './App.css'
import CharacterPortrait from './CharacterPortrait'
import queenPhoto from './assets/queen.jpeg'
import kissPhoto from './assets/WhatsApp Image 2026-11-07 at 11.23.05.jpeg'
import couplePhoto from './assets/WhatsApp Image 2026-11-07 at 11.23.11.jpeg'
import soloPhoto from './assets/WhatsApp Image 2026-11-07 at 11.23.12.jpeg'
import sareePhoto from './assets/WhatsApp Image 2026-11-07 at 11.23.12 (1).jpeg'
import vintagePhoto from './assets/WhatsApp Image 2026-11-07 at 11.23.13.jpeg'
import riverPhoto from './assets/WhatsApp Image 2026-11-07 at 11.23.13 (1).jpeg'
import walkingPhoto from './assets/WhatsApp Image 2026-11-07 at 11.28.28.jpeg'

const originalPortrait = new URL('./assets/DSC08346 (1).JPG', import.meta.url).href

type Memory = {
  image: string
  title: string
  note: string
  date: string
  alt: string
}

type Wish = {
  name: string
  message: string
}

type LoveMilestone = {
  event: string
  date: string
  options: string[]
}

const memories: Memory[] = [
  {
    image: queenPhoto,
    title: 'My favorite kind of forever',
    note: 'A quiet little moment, and a reminder that home is wherever I get to hold you close.',
    date: 'A moment I keep in my heart',
    alt: 'A tender forehead kiss in your beautiful white outfit',
  },
  {
    image: couplePhoto,
    title: 'My beautiful bride-to-be',
    note: 'You looked like a dream, and I felt like the luckiest person in the whole world.',
    date: 'Our elegant day',
    alt: 'The two of us dressed up together among green leaves',
  },
  {
    image: soloPhoto,
    title: 'A little sunshine',
    note: 'That smile of yours makes even an ordinary day feel like a story worth remembering.',
    date: 'A lovely little moment',
    alt: 'You smiling in the sunshine on a leafy path',
  },
  {
    image: vintagePhoto,
    title: 'Our own old-film romance',
    note: 'If our love were a movie, this would be the scene I replay a hundred times.',
    date: 'Golden-hour magic',
    alt: 'A warm-toned vintage-style portrait of us in sunglasses',
  },
  {
    image: riverPhoto,
    title: 'Together, wherever',
    note: 'A new place, a little adventure, and my favorite hand to hold along the way.',
    date: 'A day by the water',
    alt: 'The two of us standing together in a green mangrove river',
  },
  {
    image: walkingPhoto,
    title: 'Every step, side by side',
    note: 'Here’s to a thousand more walks, small adventures, and tomorrows together.',
    date: 'Our next chapter',
    alt: 'The two of us walking hand in hand',
  },
]

const birthdayBalloons = [
  { title: 'A little wish', message: 'May your year be full of happy surprises, gentle days, and all the things you dream about.' },
  { title: 'A little reminder', message: 'You are loved more than all the stars in the sky, today and every day.' },
  { title: 'A little promise', message: 'I will keep choosing you, cheering for you, and laughing with you through every chapter.' },
  { title: 'A little thank-you', message: 'Thank you for making ordinary moments feel like my favorite memories.' },
  { title: 'A little adventure', message: 'Here is to new places, silly photos, long walks, and a lifetime of stories together.' },
  { title: 'A little love', message: 'Happy birthday, Lakshmi. My heart is happiest right here beside you.' },
]

const reasons = [
  'Your smile makes every day feel a little brighter.',
  'You make kindness look effortless.',
  'Your playful side can turn anything into a happy memory.',
  'Being next to you feels like finding my favorite place.',
  'You are beautiful in every way that matters, inside and out.',
  'I get to dream about all the tomorrows we will share.',
]

const loveMilestones: LoveMilestone[] = [
  {
    event: 'Our very first text message',
    date: 'July 13, 2026',
    options: ['July 13, 2026', 'August 1, 2026', 'August 4, 2026', 'August 30, 2026'],
  },
  {
    event: 'The day we first met',
    date: 'August 1, 2026',
    options: ['July 13, 2026', 'August 1, 2026', 'August 4, 2026', 'August 30, 2026'],
  },
  {
    event: 'The day of our first proposal',
    date: 'August 4, 2026',
    options: ['July 13, 2026', 'August 1, 2026', 'August 4, 2026', 'August 30, 2026'],
  },
  {
    event: 'Our first little fight (and making up after)',
    date: 'August 30, 2026',
    options: ['July 13, 2026', 'August 1, 2026', 'August 4, 2026', 'August 30, 2026'],
  },
]

const initialWishes: Wish[] = [
  {
    name: 'A little birthday promise',
    message: 'May this year bring you the same joy and warmth you bring into my life.',
  },
]

function App() {
  const [surpriseOpened, setSurpriseOpened] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [portraitFlipped, setPortraitFlipped] = useState(false)
  const [selectedBalloon, setSelectedBalloon] = useState<number | null>(null)
  const [reasonIndex, setReasonIndex] = useState(0)
  const [loveQuizIndex, setLoveQuizIndex] = useState(0)
  const [loveQuizScore, setLoveQuizScore] = useState(0)
  const [loveQuizAnswer, setLoveQuizAnswer] = useState<string | null>(null)
  const [candleBlown, setCandleBlown] = useState(false)
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState(initialWishes)
  const [wishSubmitting, setWishSubmitting] = useState(false)
  const [wishStatus, setWishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const wishRequestInFlight = useRef(false)
  const [dodgePosition, setDodgePosition] = useState({ x: 0, y: 0 })
  const playgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedMemory) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedMemory(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedMemory])

  const moveDodgeButton = () => {
    const bounds = playgroundRef.current?.getBoundingClientRect()
    if (!bounds) return

    const maxX = Math.max(0, Math.min(115, bounds.width / 2 - 62))
    const maxY = Math.max(0, Math.min(70, bounds.height / 2 - 24))
    setDodgePosition({
      x: (Math.random() * 2 - 1) * maxX,
      y: (Math.random() * 2 - 1) * maxY,
    })
  }

  const addWish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (wishRequestInFlight.current) return

    const message = wish.trim()
    if (!message) {
      setWishStatus({ type: 'error', message: 'Please write a wish before sending.' })
      return
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setWishStatus({ type: 'error', message: 'Wish emails are not configured yet. Please try again later.' })
      return
    }

    wishRequestInFlight.current = true
    setWishSubmitting(true)
    setWishStatus(null)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'A new birthday wish for Lakshmi',
          from_name: 'Birthday website memory jar',
          message,
          submitted_at: new Date().toISOString(),
        }),
      })

      const result: unknown = await response.json()
      if (!response.ok || !result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
        const apiMessage = result && typeof result === 'object' && 'message' in result
          && typeof result.message === 'string'
          ? result.message
          : `The email service returned status ${response.status}.`
        setWishStatus({ type: 'error', message: `Your wish could not be sent. ${apiMessage}` })
        return
      }

      setWishes((current) => [...current, { name: 'A birthday wish', message }])
      setWish('')
      setWishStatus({ type: 'success', message: 'Your wish was sent with love. Thank you!' })
    } catch (error) {
      const details = error instanceof Error ? error.message : 'Network request failed.'
      setWishStatus({ type: 'error', message: `Your wish could not be sent. ${details}` })
    } finally {
      wishRequestInFlight.current = false
      setWishSubmitting(false)
    }
  }

  const answerLoveQuiz = (answer: string) => {
    if (loveQuizAnswer !== null) return
    setLoveQuizAnswer(answer)
    if (answer === loveMilestones[loveQuizIndex].date) {
      setLoveQuizScore((score) => score + 1)
    }
  }

  const advanceLoveQuiz = () => {
    setLoveQuizIndex((index) => index + 1)
    setLoveQuizAnswer(null)
  }

  const restartLoveQuiz = () => {
    setLoveQuizIndex(0)
    setLoveQuizScore(0)
    setLoveQuizAnswer(null)
  }

  const dodgeStyle: CSSProperties = {
    transform: `translate(${dodgePosition.x}px, ${dodgePosition.y}px)`,
  }

  return (
    <main className="birthday-page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="sparkle-field" aria-hidden="true">
        <span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span>
      </div>

      {!surpriseOpened ? (
        <section className="welcome-screen">
          <div className="welcome-photo-wrap">
            <img className="welcome-photo" src={kissPhoto} alt="A sweet moment together" />
            <span className="photo-caption">my favorite person, always</span>
          </div>
          <p className="eyebrow"><span>✦</span> A little love note for you <span>✦</span></p>
          <h1>Happy birthday,<br /><em>my Lakshmi</em></h1>
          <p className="welcome-copy">
            I made you a tiny corner of the internet filled with our memories,
            a few things I adore about you, and all the love in my heart.
          </p>
          <button className="button button-primary open-button" onClick={() => setSurpriseOpened(true)}>
            Open your birthday surprise <span aria-hidden="true">♡</span>
          </button>
          <div className="dodge-playground" ref={playgroundRef}>
            <span>Or try to catch this one…</span>
            <button
              className="button button-tease"
              onPointerEnter={moveDodgeButton}
              onFocus={() => moveDodgeButton()}
              onClick={moveDodgeButton}
              style={dodgeStyle}
              type="button"
            >
              Not yet!
            </button>
          </div>
        </section>
      ) : (
        <div className="celebration">
          <nav className="topline" aria-label="Page introduction">
            <span className="topline-mark">L <i>♡</i></span>
            <span>made with all my love</span>
          </nav>

          <header className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow"><span>✦</span> To my favorite person <span>✦</span></p>
              <h1>Happy birthday,<br /><em>my love.</em></h1>
              <p>
                To the girl who makes the ordinary feel magical:
                today is all about celebrating you.
              </p>
              <a className="button button-primary" href="#memories">
                Come take a little walk with me <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-image-frame">
              {portraitFlipped ? (
                <div className="portrait-window">
                  <img src={originalPortrait} alt="The original portrait of Lakshmi" />
                </div>
              ) : <CharacterPortrait />}
              <span className="hero-image-note">
                {portraitFlipped ? 'the original portrait, just for you' : 'a portrait made from love hearts'}
              </span>
              <button
                aria-pressed={portraitFlipped}
                className="portrait-toggle"
                onClick={() => setPortraitFlipped((flipped) => !flipped)}
                type="button"
              >
                {portraitFlipped ? 'Show the heart portrait' : 'Flip to the original portrait'}
              </button>
              <span className="hero-heart" aria-hidden="true">♡</span>
            </div>
            <div className="hero-side-note">for my favorite girl · today & always</div>
          </header>

          <section className="birthday-wish section-wrap" aria-label="Birthday wish">
            <span className="section-kicker">A wish, just for you</span>
            <div className="wish-rule"><span>♡</span></div>
            <p>
              I hope this next trip around the sun is filled with slow mornings,
              loud laughter, beautiful surprises, and every little thing that makes
              your heart feel at home.
            </p>
          </section>

          <section className="memories-section section-wrap" id="memories">
            <div className="section-heading">
              <span className="section-kicker">Little pieces of forever</span>
              <h2>Our story, in <em>snapshots.</em></h2>
              <p>Every picture holds a moment I wish I could keep living.</p>
            </div>
            <div className="memory-grid">
              {memories.map((memory, index) => (
                <button
                  className={`memory-card memory-card-${index + 1}`}
                  key={memory.title}
                  onClick={() => setSelectedMemory(memory)}
                  type="button"
                  aria-label={`Open memory: ${memory.title}`}
                >
                  <span className="memory-photo">
                    <img src={memory.image} alt={memory.alt} loading="lazy" />
                    <span className="memory-zoom" aria-hidden="true">＋</span>
                  </span>
                  <span className="memory-caption">
                    <span className="memory-date">{memory.date}</span>
                    <span className="memory-title">{memory.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="love-quiz-section section-wrap" aria-labelledby="love-quiz-title">
            <div className="section-heading">
              <span className="section-kicker">A little trip down memory lane</span>
              <h2 id="love-quiz-title">How well do you know <em>our story?</em></h2>
              <p>Match each special moment to the date it happened.</p>
            </div>
            <div className="love-quiz-card" aria-live="polite">
              {loveQuizIndex < loveMilestones.length ? (
                <>
                  <div className="love-quiz-progress">
                    <span>Memory {loveQuizIndex + 1} of {loveMilestones.length}</span>
                    <span>{loveQuizScore} {loveQuizScore === 1 ? 'answer' : 'answers'} right</span>
                  </div>
                  <div
                    className="love-quiz-progress-track"
                    role="progressbar"
                    aria-label="Quiz progress"
                    aria-valuemin={0}
                    aria-valuemax={loveMilestones.length}
                    aria-valuenow={loveQuizIndex}
                  >
                    <span style={{ width: `${(loveQuizIndex / loveMilestones.length) * 100}%` }} />
                  </div>
                  <h3>{loveMilestones[loveQuizIndex].event}</h3>
                  <div className="love-quiz-options">
                    {loveMilestones[loveQuizIndex].options.map((date) => {
                      const isSelected = loveQuizAnswer === date
                      const isCorrect = date === loveMilestones[loveQuizIndex].date
                      const resultClass = loveQuizAnswer === null
                        ? ''
                        : isCorrect ? ' quiz-correct' : isSelected ? ' quiz-incorrect' : ''

                      return (
                        <button
                          className={`love-quiz-option${resultClass}`}
                          disabled={loveQuizAnswer !== null}
                          key={date}
                          onClick={() => answerLoveQuiz(date)}
                          type="button"
                        >
                          {date}
                          {loveQuizAnswer !== null && isCorrect && <span aria-hidden="true"> ✓</span>}
                          {isSelected && !isCorrect && <span aria-hidden="true"> ×</span>}
                        </button>
                      )
                    })}
                  </div>
                  {loveQuizAnswer !== null && (
                    <div className="love-quiz-feedback">
                      <p>
                        {loveQuizAnswer === loveMilestones[loveQuizIndex].date
                          ? 'That’s right! What a lovely memory. 💖'
                          : `The special day was ${loveMilestones[loveQuizIndex].date}. Every part of our story matters.`}
                      </p>
                      <button className="button button-primary" onClick={advanceLoveQuiz} type="button">
                        {loveQuizIndex === loveMilestones.length - 1 ? 'See my score' : 'Next memory'}
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="love-quiz-result">
                  <span className="quiz-result-heart" aria-hidden="true">♡</span>
                  <span className="section-kicker">Our story is my favorite</span>
                  <h3>You got {loveQuizScore} out of {loveMilestones.length}!</h3>
                  <p>
                    {loveQuizScore === loveMilestones.length
                      ? 'A perfect score! You remember every little beginning of us.'
                      : 'Every date is special, but my favorite part is making all the memories still to come.'}
                  </p>
                  <button className="button button-outline" onClick={restartLoveQuiz} type="button">
                    Play again <span aria-hidden="true">↻</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="balloons-section section-wrap" aria-labelledby="balloons-title">
            <div className="section-heading">
              <span className="section-kicker">Pop open a little love</span>
              <h2 id="balloons-title">Birthday <em>balloons.</em></h2>
              <p>Tap a balloon to reveal its birthday message inside.</p>
            </div>
            <div className="balloon-list">
              {birthdayBalloons.map((balloon, index) => (
                <button
                  aria-label={`Open balloon ${index + 1}: ${balloon.title}`}
                  aria-pressed={selectedBalloon === index}
                  className={`balloon-button balloon-${index + 1}${selectedBalloon === index ? ' balloon-selected' : ''}`}
                  key={balloon.title}
                  onClick={() => setSelectedBalloon(selectedBalloon === index ? null : index)}
                  type="button"
                >
                  <span className="balloon-shape">
                    {selectedBalloon === index ? (
                      <span className="balloon-content" aria-live="polite">
                        <strong>{balloon.title}</strong>
                        <span>{balloon.message}</span>
                      </span>
                    ) : <span className="balloon-label">{balloon.title}</span>}
                  </span>
                </button>
              ))}
            </div>
            {selectedBalloon === null && (
              <p className="balloon-prompt" aria-live="polite">Choose a balloon to see what’s inside.</p>
            )}
          </section>

          <section className="love-note-section section-wrap">
            <div className="love-note-image">
              <img src={sareePhoto} alt="A joyful, playful selfie" loading="lazy" />
              <span className="image-sticker">that smile! ♡</span>
            </div>
            <div className="love-note-copy">
              <span className="section-kicker">In case I don’t say it enough</span>
              <h2>There are a million things I <em>love about you.</em></h2>
              <div className="reason-card" aria-live="polite">
                <span className="reason-number">0{reasonIndex + 1} / 06</span>
                <p>{reasons[reasonIndex]}</p>
              </div>
              <button
                className="button button-outline"
                onClick={() => setReasonIndex((index) => (index + 1) % reasons.length)}
                type="button"
              >
                Tell me another <span aria-hidden="true">↗</span>
              </button>
            </div>
          </section>

          <section className="letter-section section-wrap">
            <div className="letter-card">
              <span className="letter-flower" aria-hidden="true">✿</span>
              <span className="section-kicker">A note from my heart</span>
              <h2>For you, <em>always.</em></h2>
              <div className="letter-body">
                <p>My dearest Lakshmi,</p>
                <p>
                  Happy birthday to the person who makes my life softer, brighter,
                  and so much more fun. I love the way you laugh, the way you care
                  for the people around you, and the way you can turn even a tiny
                  moment into one of my favorite memories.
                </p>
                <p>
                  Thank you for being exactly who you are: kind, funny, thoughtful,
                  beautiful, and wonderfully you. I’m so grateful I get to be by
                  your side, cheering you on today and in every chapter still to come.
                </p>
                <p>Here’s to more silly selfies, little adventures, and a lifetime of us.</p>
                <p className="letter-signoff">All my love, today and every day <span>♡</span></p>
              </div>
            </div>
          </section>

          <section className="wish-candle-section section-wrap">
            <div className="candle-card">
              <span className="section-kicker">Make a birthday wish</span>
              <div className={`candle ${candleBlown ? 'candle-blown' : ''}`} aria-hidden="true">
                <span className="flame" />
                <span className="candle-body" />
                <span className="candle-base" />
              </div>
              <h2>{candleBlown ? 'Your wish is on its way.' : 'Ready, birthday girl?'}</h2>
              <p>{candleBlown ? 'May every lovely thing find its way to you.' : 'Make a wish, then blow out your candle.'}</p>
              <button
                className="button button-primary"
                onClick={() => setCandleBlown((blown) => !blown)}
                type="button"
              >
                {candleBlown ? 'Light it again' : 'Blow out the candle'} <span aria-hidden="true">✦</span>
              </button>
            </div>
          </section>

          <section className="guestbook-section section-wrap">
            <div className="section-heading">
              <span className="section-kicker">A little memory jar</span>
              <h2>Leave a wish <em>for us.</em></h2>
              <p>Add a birthday wish or a sweet little promise to keep.</p>
            </div>
            <form className="wish-form" onSubmit={addWish}>
              <label className="visually-hidden" htmlFor="birthday-wish">Your birthday wish</label>
              <input
                id="birthday-wish"
                maxLength={180}
                disabled={wishSubmitting}
                onChange={(event) => setWish(event.target.value)}
                placeholder="Write something lovely…"
                required
                value={wish}
              />
              <button className="button button-primary" disabled={wishSubmitting} type="submit">
                {wishSubmitting ? 'Sending…' : 'Add your wish'} <span aria-hidden="true">♡</span>
              </button>
            </form>
            {wishStatus && (
              <p
                className={`wish-status wish-status-${wishStatus.type}`}
                role={wishStatus.type === 'error' ? 'alert' : 'status'}
              >
                {wishStatus.message}
              </p>
            )}
            <div className="wishes-list" aria-live="polite">
              {wishes.map((item, index) => (
                <article className="wish-note" key={`${item.name}-${index}`}>
                  <span aria-hidden="true">♡</span>
                  <div><strong>{item.name}</strong><p>{item.message}</p></div>
                </article>
              ))}
            </div>
          </section>

          <footer className="page-footer">
            <span>Happy birthday, Lakshmi</span>
            <p>my favorite story is the one where I get to love you <i>♡</i></p>
          </footer>
        </div>
      )}

      {selectedMemory && (
        <div className="memory-modal" onClick={() => setSelectedMemory(null)} role="presentation">
          <section
            aria-labelledby="modal-title"
            aria-modal="true"
            className="memory-modal-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close memory"
              className="modal-close"
              onClick={() => setSelectedMemory(null)}
              type="button"
            >
              ×
            </button>
            <img src={selectedMemory.image} alt={selectedMemory.alt} />
            <div className="modal-copy">
              <span className="section-kicker">{selectedMemory.date}</span>
              <h2 id="modal-title">{selectedMemory.title}</h2>
              <p>{selectedMemory.note}</p>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
