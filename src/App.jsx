import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Braces, BrainCircuit, Briefcase,
  Check, Code2, Cpu, Crosshair, Database, Download, Gamepad2, GitBranch, GraduationCap, Layers3,
  Mail, MapPinned, Menu, ServerCog, ShieldCheck, Shirt, Sparkles, Swords, Trophy, Utensils, X, Zap
} from 'lucide-react'

const GITHUB = 'https://github.com/ujwalchitra'
const LINKEDIN = 'https://www.linkedin.com/in/ujwal-chitra-586048202'
const EMAIL = 'mailto:ujwal.chitra.pg25@nsut.ac.in'
const RESUME = '/Ujwal-Chitra-Resume.pdf'

const projects = [
  {
    id: '01', title: 'IoT Intrusion Detection', type: 'AI · Cybersecurity',
    summary: 'A production-minded deep learning system that identifies malicious traffic across connected devices in real time.',
    detail: 'Hybrid 1D-CNN + LSTM architecture, automated model pipeline, versioning and live infrastructure monitoring.',
    metric: '98.7%', metricLabel: 'Detection accuracy',
    tags: ['Python', 'TensorFlow', 'Docker', 'Kubernetes', 'MLflow'], icon: BrainCircuit,
    variant: 'lime', size: 'large'
  },
  {
    id: '02', title: 'Smart Navigation App', type: 'Mobile · Maps',
    summary: 'Live location, intelligent place search and optimized routing in one cross-platform experience.',
    detail: 'Built with reusable components, persistent favorites and driving or walking navigation modes.',
    metric: 'Live', metricLabel: 'GPS tracking',
    tags: ['React Native', 'Expo', 'Google Maps', 'Axios'], icon: MapPinned,
    variant: 'violet', size: 'small'
  },
  {
    id: '03', title: 'Food Delivery Platform', type: 'Web · Product',
    summary: 'A fast restaurant discovery and ordering flow designed around clarity, speed and responsive interactions.',
    detail: 'Real-time search, location filtering, cart management and a complete checkout experience.',
    metric: '80%', metricLabel: 'Faster search',
    tags: ['React', 'JavaScript', 'REST APIs', 'CSS'], icon: Utensils,
    variant: 'cyan', size: 'wide'
  }
]

const skillGroups = [
  { icon: Braces, title: 'Languages', items: ['C++', 'Python', 'JavaScript', 'SQL'] },
  { icon: Layers3, title: 'Experiences', items: ['React', 'React Native', 'HTML5', 'CSS3'] },
  { icon: ServerCog, title: 'Systems', items: ['Docker', 'AWS', 'REST APIs', 'Git'] },
  { icon: Database, title: 'Foundations', items: ['DSA', 'DBMS', 'Networks', 'Operating Systems'] }
]

function ShadowWatcher({ activeSection }) {
  const watcherRef = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const motionRef = useRef({ x: 0, y: 0, direction: 1, last: 0, distance: 0, speed: 36 })
  const actionRef = useRef('walk')
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [outfit, setOutfit] = useState(0)
  const [action, setAction] = useState('walk')
  const outfits = [
    { name: 'SHADOW', src: '/assets/anime-watcher.png' },
    { name: 'ARMOR', src: '/assets/anime-watcher-combat.png' },
    { name: 'CASUAL', src: '/assets/anime-watcher-casual.png' }
  ]
  const avatarSrc = outfits[outfit].src

  useEffect(() => { actionRef.current = action }, [action])
  useEffect(() => { draggingRef.current = dragging }, [dragging])

  const messages = {
    home: 'PLAYER DETECTED', work: 'MISSIONS IN VIEW',
    about: 'LOADOUT SCANNED', journey: 'XP ANALYZED', contact: 'CO-OP READY'
  }

  useEffect(() => {
    let pointerFrame = 0
    let scrollFrame = 0
    let pointerX = 0
    let pointerY = 0
    const updateGaze = () => {
      pointerFrame = 0
      if (!watcherRef.current) return
      const rect = watcherRef.current.getBoundingClientRect()
      const dx = pointerX - (rect.left + rect.width * .5)
      const dy = pointerY - (rect.top + rect.height * .22)
      const distance = Math.max(Math.hypot(dx, dy), 1)
      watcherRef.current.style.setProperty('--eye-x', `${dx / distance * 4}px`)
      watcherRef.current.style.setProperty('--eye-y', `${dy / distance * 3}px`)
    }
    const watch = event => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!pointerFrame) pointerFrame = requestAnimationFrame(updateGaze)
    }
    const updateScrollReaction = () => {
      scrollFrame = 0
      if (!watcherRef.current) return
      const max = document.documentElement.scrollHeight - innerHeight
      const ratio = max > 0 ? scrollY / max : 0
      watcherRef.current.style.setProperty('--watch-turn', `${(ratio - .5) * 12}deg`)
      watcherRef.current.style.setProperty('--arm-turn', `${-8 + ratio * 25}deg`)
    }
    const reactToScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollReaction)
    }
    addEventListener('pointermove', watch)
    addEventListener('scroll', reactToScroll, { passive: true })
    updateScrollReaction()
    return () => {
      removeEventListener('pointermove', watch)
      removeEventListener('scroll', reactToScroll)
      cancelAnimationFrame(pointerFrame)
      cancelAnimationFrame(scrollFrame)
    }
  }, [])

  useEffect(() => {
    const element = watcherRef.current
    if (!element) return
    const initial = element.getBoundingClientRect()
    motionRef.current = { x: initial.left, y: initial.top, direction: 1, last: performance.now(), distance: 0, speed: 36 }
    element.style.left = '0'
    element.style.top = '0'
    element.style.right = 'auto'
    element.style.bottom = 'auto'
    element.style.transform = `translate3d(${initial.left}px, ${initial.top}px, 0)`
    element.dataset.direction = 'right'
    const walkSprite = element.querySelector('.walk-sprite')
    let width = element.offsetWidth
    let height = element.offsetHeight
    let lastWalkFrame = -1
    let frameId
    const measure = () => {
      width = element.offsetWidth
      height = element.offsetHeight
    }
    const greetAtEdge = x => {
      const motion = motionRef.current
      motion.x = x
      motion.direction = 0
      motion.speed = 0
      actionRef.current = 'wave'
      element.dataset.direction = 'front'
      element.classList.remove('turning')
      setAction('wave')
    }
    addEventListener('resize', measure)
    const patrol = now => {
      const motion = motionRef.current
      const elapsed = Math.min((now - motion.last) / 1000, .05)
      motion.last = now
      const maxX = Math.max(8, innerWidth - width - 8)
      motion.y = Math.max(76, innerHeight - height - 8)
      const paused = draggingRef.current || actionRef.current !== 'walk'
      if (!paused) {
        const remaining = motion.direction > 0 ? maxX - motion.x : motion.x - 8
        const edgeRatio = Math.max(0, Math.min(1, remaining / 110))
        const targetSpeed = 16 + 54 * edgeRatio
        motion.speed += (targetSpeed - motion.speed) * Math.min(1, elapsed * 4.5)
        const travel = motion.direction * motion.speed * elapsed
        motion.x += travel
        motion.distance += Math.abs(travel)
        if (motion.x <= 8) {
          greetAtEdge(8)
        } else if (motion.x >= maxX) {
          greetAtEdge(maxX)
        }
        const walkFrame = Math.floor(motion.distance / 14) % 8
        if (walkFrame !== lastWalkFrame) {
          lastWalkFrame = walkFrame
          walkSprite.style.backgroundPositionX = `${walkFrame * (100 / 7)}%`
        }
      }
      element.style.transform = `translate3d(${motion.x}px, ${motion.y}px, 0)`
      frameId = requestAnimationFrame(patrol)
    }
    frameId = requestAnimationFrame(patrol)
    return () => {
      cancelAnimationFrame(frameId)
      removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    if (!dragging) return
    let dragFrame = 0
    let pointerX = 0
    const element = watcherRef.current
    const width = element?.offsetWidth || 130
    const height = element?.offsetHeight || 240
    const applyDrag = () => {
      dragFrame = 0
      if (!element) return
      const next = {
        x: Math.max(6, Math.min(innerWidth - width - 6, pointerX - dragOffset.current.x)),
        y: Math.max(76, innerHeight - height - 8)
      }
      const deltaX = next.x - motionRef.current.x
      if (Math.abs(deltaX) > 1) {
        const direction = deltaX > 0 ? 1 : -1
        motionRef.current.direction = direction
        element.dataset.direction = direction > 0 ? 'right' : 'left'
      }
      motionRef.current.x = next.x
      motionRef.current.y = next.y
      element.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`
    }
    const move = event => {
      pointerX = event.clientX
      if (!dragFrame) dragFrame = requestAnimationFrame(applyDrag)
    }
    const stop = () => setDragging(false)
    addEventListener('pointermove', move)
    addEventListener('pointerup', stop, { once: true })
    return () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', stop)
      cancelAnimationFrame(dragFrame)
    }
  }, [dragging])

  const beginDrag = event => {
    const rect = watcherRef.current.getBoundingClientRect()
    dragOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    motionRef.current.x = rect.left
    motionRef.current.y = rect.top
    setDragging(true)
  }
  const nudge = event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const rect = watcherRef.current.getBoundingClientRect()
    const step = event.shiftKey ? 20 : 7
    const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0
    const next = {
      x: Math.max(6, Math.min(innerWidth - watcherRef.current.offsetWidth - 6, rect.left + dx)),
      y: Math.max(76, innerHeight - watcherRef.current.offsetHeight - 8)
    }
    if (dx !== 0) {
      motionRef.current.direction = dx > 0 ? 1 : -1
      watcherRef.current.dataset.direction = dx > 0 ? 'right' : 'left'
    }
    motionRef.current.x = next.x
    motionRef.current.y = next.y
    watcherRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`
  }
  const triggerCombat = () => {
    setOutfit(1)
    setAction('combat')
    setTimeout(() => { setOutfit(0); setAction('walk') }, 2600)
  }
  const changeOutfit = () => setOutfit(current => {
    const next = (current + 1) % outfits.length
    setAction(next === 0 ? 'walk' : 'idle')
    return next
  })
  const resetPosition = () => {
    const element = watcherRef.current
    const next = { x: 24, y: innerHeight - element.offsetHeight - 8 }
    motionRef.current.x = next.x
    motionRef.current.y = next.y
    motionRef.current.direction = 1
    motionRef.current.speed = 36
    actionRef.current = 'walk'
    element.dataset.direction = 'right'
    element.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`
    setAction('walk')
  }

  return <div
    ref={watcherRef}
    className={`shadow-watcher section-${activeSection} action-${dragging ? 'drag' : action} outfit-${outfit} ${dragging ? 'dragging' : ''}`}
    onPointerDown={beginDrag}
    onDoubleClick={resetPosition}
    onKeyDown={nudge}
    role="group"
    tabIndex={0}
    aria-label="Draggable shadow guide. Drag horizontally to move, double click to reset."
    title="Drag me · Double-click to reset"
  >
    <div className="watcher-message"><i />{action === 'wave' ? 'HI, WELCOME!' : messages[activeSection] || 'WATCHING...'}<small>{outfits[outfit].name} / {action.toUpperCase()}</small></div>
    <div className="anime-avatar-wrap" aria-hidden="true">
      <div className="avatar-aura" />
      <div className="combat-fx"><i/><i/><i/></div>
      <div className="energy-blade" />
      <div className="motion-trail"><i/><i/><i/><i/></div>
      <div className="walk-sprite" />
      <img className="watcher-avatar avatar-single" src={avatarSrc} alt="" draggable="false" />
      <div className="outfit-change-fx" key={outfit} />
      <div className="avatar-gaze"><i /><i /></div>
      <div className="avatar-scan" />
    </div>
    <div className="watcher-controls" onPointerDown={event => event.stopPropagation()}>
      <button onClick={changeOutfit} title={`Change outfit — current: ${outfits[outfit].name}`} aria-label={`Change outfit. Current outfit: ${outfits[outfit].name}`}><Shirt /><span>SUIT</span></button>
      <button onClick={triggerCombat} title="Perform combat move"><Swords /><span>FIGHT</span></button>
    </div>
    <div className="drag-hint"><span>✥</span> AUTONOMOUS PATROL · DRAG ME</div>
  </div>
}

function ProjectCard({ project }) {
  const Icon = project.icon
  const cardRef = useRef(null)
  const tiltFrame = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => () => cancelAnimationFrame(tiltFrame.current), [])
  const applyTilt = () => {
    tiltFrame.current = 0
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (pointer.current.x - rect.left) / rect.width
    const y = (pointer.current.y - rect.top) / rect.height
    card.style.setProperty('--x', `${x * 100}%`)
    card.style.setProperty('--y', `${y * 100}%`)
    card.style.setProperty('--rx', `${(0.5 - y) * 4}deg`)
    card.style.setProperty('--ry', `${(x - 0.5) * 4}deg`)
  }
  const move = event => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    pointer.current = { x: event.clientX, y: event.clientY }
    if (!tiltFrame.current) tiltFrame.current = requestAnimationFrame(applyTilt)
  }
  const leave = event => {
    cancelAnimationFrame(tiltFrame.current)
    tiltFrame.current = 0
    event.currentTarget.style.setProperty('--rx', '0deg')
    event.currentTarget.style.setProperty('--ry', '0deg')
  }

  return <article ref={cardRef} className={`project-card ${project.variant} ${project.size} reveal`} onMouseMove={move} onMouseLeave={leave}>
    <div className="card-glow" />
    <div className="project-top">
      <span className="project-id">MISSION / {project.id}</span>
      <span className="mission-status"><Check /> COMPLETED</span>
      <a className="circle-link" href={GITHUB} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}><ArrowUpRight /></a>
    </div>
    <div className="project-art" aria-hidden="true">
      <div className="art-grid" />
      <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
      <Icon />
      <span>{project.type.split(' · ')[0]}</span>
    </div>
    <div className="project-body">
      <div className="project-heading"><div><p>{project.type}</p><h3>{project.title}</h3></div><div className="project-metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div></div>
      <p className="project-summary">{project.summary}</p>
      <p className="project-detail">{project.detail}</p>
      <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="difficulty"><span>DIFFICULTY</span><i/><i/><i/><i/><i className={project.id === '01' ? 'on' : ''}/></div>
    </div>
  </article>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'violet'
    return localStorage.getItem('portfolio-theme') || 'violet'
  })
  const cursor = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const sectionIds = ['home', 'work', 'about', 'journey', 'contact']
    const hero = document.querySelector('.hero')
    let activeSection = 'home'
    let scrollFrame = 0
    let pointerFrame = 0
    let pointerX = 0
    let pointerY = 0
    const updateScroll = () => {
      scrollFrame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const ratio = max ? Math.min(1, scrollY / max) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`
      const nextSection = sectionIds.reduce((current, id) => {
        const el = document.getElementById(id)
        return el && el.getBoundingClientRect().top < innerHeight * .42 ? id : current
      }, 'home')
      if (nextSection !== activeSection) {
        activeSection = nextSection
        setActive(nextSection)
      }
    }
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll)
    }
    const updatePointer = () => {
      pointerFrame = 0
      hero?.style.setProperty('--pointer-x', `${pointerX}px`)
      hero?.style.setProperty('--pointer-y', `${pointerY}px`)
      if (cursor.current) cursor.current.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`
    }
    const onPointer = event => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer)
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    }), { threshold: .12 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('pointermove', onPointer)
    updateScroll()
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('pointermove', onPointer)
      cancelAnimationFrame(scrollFrame)
      cancelAnimationFrame(pointerFrame)
      observer.disconnect()
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const nextTheme = theme === 'violet' ? 'cyan' : theme === 'cyan' ? 'light' : 'violet'
  const themeLabel = theme === 'violet' ? 'VIOLET' : theme === 'cyan' ? 'CYAN' : 'LIGHT'
  const nextThemeLabel = nextTheme === 'violet' ? 'Violet Lunar' : nextTheme === 'cyan' ? 'Cyber Cyan' : 'Light'

  return <div className="site-shell">
    <div className="scroll-progress" ref={progressRef} />
    <div className="custom-cursor" ref={cursor}><i /></div>
    <ShadowWatcher activeSection={active} />

    <header className="navbar">
      <a className="logo" href="#home" aria-label="Ujwal Chitra home">UC<span>//</span><i>01</i></a>
      <nav id="primary-navigation" aria-label="Primary navigation" className={menuOpen ? 'nav-menu open' : 'nav-menu'}>
        <a className={active === 'work' ? 'active' : ''} href="#work" onClick={closeMenu}>Missions</a>
        <a className={active === 'about' ? 'active' : ''} href="#about" onClick={closeMenu}>Loadout</a>
        <a className={active === 'journey' ? 'active' : ''} href="#journey" onClick={closeMenu}>Progress</a>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme(nextTheme)}
          aria-label={`Switch to ${nextThemeLabel} theme`}
          title={`Switch to ${nextThemeLabel} theme`}
        ><Sparkles /><span>{themeLabel}</span><i aria-hidden="true" /></button>
        <a className="nav-button" href={GITHUB} target="_blank" rel="noreferrer" onClick={closeMenu}><Gamepad2 /> Player GitHub <ArrowUpRight /></a>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="primary-navigation">{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-noise" /><div className="hero-aurora" />
        <div className="hero-particles" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="theme-moon" aria-hidden="true"><i/><i/><i/><i/><span/></div>
        <div className="scanlines"/><div className="hud-corner hud-one">SYS / ONLINE</div><div className="hud-corner hud-two">DELHI / IN</div>
        <div className="hero-main">
          <div className="hero-copy reveal">
            <div className="status-pill"><i /><span>Player online · Open to work</span><Gamepad2 /></div>
            <p className="hero-label">PLAYER_01 / SOFTWARE ENGINEER / DELHI</p>
            <h1>Code. Build.<br/>Ship. <em>Level up.</em></h1>
            <p className="hero-description">You’ve entered the portfolio of <strong>Ujwal Chitra</strong>—a software engineer completing missions across intelligent systems, web products, and mobile experiences.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#work"><Crosshair /> Select mission <ArrowDownRight /></a>
              <a className="button-ghost" href={RESUME} download><Download /> Download resume</a>
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="visual-card main-card">
              <div className="visual-card-head"><span>PLAYER PROFILE / UJWAL_01</span><i /><i /><i /></div>
              <div className="player-level"><span>LVL</span><strong>24</strong><div><b>SOFTWARE ENGINEER</b><small>4,250 / 5,000 XP</small><i><em/></i></div></div>
              <div className="identity-orb"><div className="orb-ring ring-a"/><div className="orb-ring ring-b"/><div className="orb-core"><Gamepad2 /></div><span className="orb-tag tag-a">AI SYSTEMS</span><span className="orb-tag tag-b">WEB</span><span className="orb-tag tag-c">MOBILE</span></div>
              <div className="visual-status"><span>ACTIVE QUEST</span><strong>Build useful software.<br/>Unlock new possibilities.</strong></div>
            </div>
            <div className="floating-card float-code"><span>Quest loop</span><code><b>while</b> (curious) {'{'}<br/>&nbsp;&nbsp;learn();<br/>&nbsp;&nbsp;build();<br/>&nbsp;&nbsp;levelUp();<br/>{'}'}</code></div>
            <div className="floating-card float-stack"><ShieldCheck /><span>CLASS<br/><strong>ENGINEER</strong></span></div>
          </div>
        </div>

        <div className="hero-stats reveal">
          <div><span>STAT / 01</span><strong>98.7%</strong><p>Accuracy unlocked</p></div>
          <div><span>STAT / 02</span><strong>150+</strong><p>Challenges cleared</p></div>
          <div><span>STAT / 03</span><strong>3</strong><p>Featured missions</p></div>
          <div className="scroll-cue"><p>Press scroll to start</p><ArrowDownRight /></div>
        </div>
      </section>

      <div className="tech-marquee" aria-label="Player loadout technologies">
        <div>{['REACT', 'PYTHON', 'REACT NATIVE', 'DOCKER', 'MACHINE LEARNING', 'AWS', 'JAVASCRIPT', 'C++'].concat(['REACT', 'PYTHON', 'REACT NATIVE', 'DOCKER', 'MACHINE LEARNING', 'AWS', 'JAVASCRIPT', 'C++']).map((item, i) => <span key={`${item}-${i}`}>{item}<i>✦</i></span>)}</div>
      </div>

      <section className="work-section light-section" id="work">
        <div className="section-title reveal"><div><span className="overline">01 / MISSION SELECT</span><h2>Choose your<br/><em>next mission.</em></h2></div><p>Three completed quests combining technical depth, product thinking, and real-world problem solving. Hover to inspect each mission.</p></div>
        <div className="project-grid">{projects.map(project => <ProjectCard project={project} key={project.id} />)}</div>
        <a className="all-work reveal" href={GITHUB} target="_blank" rel="noreferrer"><span>Open complete mission archive</span><i><ArrowRight /></i></a>
      </section>

      <section className="about-section" id="about">
        <div className="about-heading reveal"><span className="overline">02 / PLAYER LOADOUT</span><h2>Skills equipped.<br/><em>Ready for battle.</em></h2></div>
        <div className="about-bento">
          <article className="about-story bento reveal"><span className="bento-label">PLAYER STRATEGY</span><p>I find the simplest route through complex levels.</p><div>My playstyle sits at the intersection of machine learning and product engineering. Every mission considers the full system: model, code, interface, and the person holding the controls.</div><a href="#contact">Start co-op mode <ArrowUpRight /></a></article>
          <article className="bento principle reveal"><Zap /><span className="bento-label">CORE PASSIVE / 01</span><blockquote>“Build for players.<br/>Engineer for scale.”</blockquote></article>
          <article className="bento education-card reveal"><div className="edu-icon"><GraduationCap /></div><span className="bento-label">ACTIVE QUEST</span><h3>M.Tech in Computer Science & Engineering</h3><p>Netaji Subhas University of Technology · Delhi</p><div className="edu-year">2025 — 2027</div></article>
          <article className="bento toolkit reveal"><span className="bento-label">EQUIPPED LOADOUT</span><div className="skill-list">{skillGroups.map(group => <div className="skill-group" key={group.title}><group.icon/><h3>{group.title}</h3><p>{group.items.join(' · ')}</p></div>)}</div></article>
        </div>
      </section>

      <section className="journey-section light-section" id="journey">
        <div className="section-title reveal"><div><span className="overline">03 / LEVEL PROGRESSION</span><h2>Every challenge<br/><em>adds experience.</em></h2></div><p>Education, experiments, and boss-level challenges that shaped the way I think and build.</p></div>
        <div className="journey-list">
          <article className="journey-row reveal"><span className="journey-year">LVL 03 · ACTIVE</span><div className="journey-mark"><GraduationCap /></div><div><p>Graduate campaign · 2025 — 2027</p><h3>M.Tech, Computer Science & Engineering</h3><span>Netaji Subhas University of Technology · CGPA 7.22</span></div><i>03</i></article>
          <article className="journey-row reveal"><span className="journey-year">LVL 02 · CLEARED</span><div className="journey-mark"><Check /></div><div><p>Undergraduate campaign · 2020 — 2024</p><h3>B.E., Computer Science Engineering</h3><span>Chitkara University · CGPA 8.00</span></div><i>02</i></article>
          <article className="journey-row reveal highlight"><span className="journey-year">BONUS · UNLOCKED</span><div className="journey-mark"><Trophy /></div><div><p>Rare achievements</p><h3>Hackathons & challenge streaks</h3><span>Top 10% at Yamaha Hackathon · Great India Hackathon · 150+ LeetCode problems</span></div><i>★</i></article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-grid" /><div className="contact-glow" />
        <div className="contact-inner reveal"><span className="overline">04 / CO-OP LOBBY</span><h2>Ready to start<br/><em>a new campaign?</em></h2><p>I’m open to software engineering opportunities, ambitious quests, and meaningful collaborations. Send an invite and let’s build.</p><div className="contact-actions"><a className="button-primary" href={EMAIL}><Mail /> Send co-op invite <ArrowUpRight /></a><a className="button-ghost" href={LINKEDIN} target="_blank" rel="noreferrer"><Briefcase /> View LinkedIn</a></div></div>
        <div className="availability"><i /><span>PLAYER STATUS<br/><strong>ONLINE / READY</strong></span></div>
      </section>
    </main>

    <footer><a className="logo" href="#home">UC<span>//</span><i>01</i></a><p>GAME DESIGNED & ENGINEERED BY UJWAL CHITRA · 2026</p><div><a href={GITHUB} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a><a href={RESUME} download>Resume <Download /></a><a href="#home">Restart <ArrowUpRight /></a></div></footer>
  </div>
}

export default App
