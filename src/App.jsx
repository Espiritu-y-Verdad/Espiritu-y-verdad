import React, { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import logoMev from './assets/logo-negro-MEV.png'
import logoEspirituVerdad from './assets/logo-espiritu-verdad.png'
import distritoNacionalPin from './assets/oikos-pins/oikos-distrito-nacional.PNG'
import santoDomingoNortePin from './assets/oikos-pins/oikos-santo-domingo-norte.PNG'
import santoDomingoEstePin from './assets/oikos-pins/oikos-santo-domingo-este.PNG'
import santoDomingoOestePin from './assets/oikos-pins/oikos-santo-domingo-oeste.PNG'
import './styles.css'

const history = [
  { year: '2016', text: 'Una conversación pequeña empezó a reunir corazones con una misma esperanza.', type: 'portrait', label: '[ PHOTO PLACEHOLDER ]' },
  { year: '2019', text: 'La mesa se hizo más larga. La comunidad aprendió a servir, celebrar y permanecer.', type: 'landscape', label: '[ PHOTO PLACEHOLDER ]' },
  { year: '2022', text: 'Nuevas voces, nuevos barrios, la misma convicción de caminar juntos.', type: 'gallery', label: '[ PHOTO GALLERY PLACEHOLDER ]' },
]

function Reveal({ children, className = '' }) {
  return <div className={`reveal ${className}`}>{children}</div>
}

function MediaPlaceholder({ label = '[ IMAGE PLACEHOLDER ]', className = '', video = false }) {
  return (
    <div className={`media-placeholder ${className}`} role="img" aria-label={label}>
      {video && <span className="play" aria-hidden="true">▶</span>}
      <span>{label}</span>
    </div>
  )
}

function AboutScreen() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.16 },
    )
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="editorial-page">
      <header className="editorial-header"><span className="wordmark">ESPÍRITU <i>+</i> VERDAD</span></header>

      <section className="hero" id="inicio" aria-labelledby="page-title">
        <div className="scroll-count">01 <span /></div>
        <Reveal className="hero-title"><p>01 / IDENTIDAD</p><h1 id="page-title">QUIÉNES<br />SOMOS</h1></Reveal>
        <div className="cross-mark" aria-hidden="true"><span /></div>
        <Reveal className="hero-media hero-media-one"><MediaPlaceholder /></Reveal>
        <Reveal className="hero-media hero-media-two"><MediaPlaceholder /></Reveal>
        <Reveal className="hero-media hero-media-three"><MediaPlaceholder /></Reveal>
        <Reveal className="hero-intro"><p>UNA COMUNIDAD<br />QUE VIVE LA FE<br /><em>EN MOVIMIENTO.</em></p></Reveal>
      </section>

      <section className="breath" id="nosotros"><Reveal><p>NO SOMOS UN LUGAR AL QUE SE LLEGA.<br />SOMOS UNA HISTORIA QUE SE COMPARTE.</p></Reveal></section>

      <section className="mission" aria-labelledby="mission-title">
        <div className="side-label"><span>02</span><b>NUESTRA MISIÓN</b></div>
        <Reveal className="mission-copy"><p>LO QUE NOS MUEVE</p><h2 id="mission-title">HACER<br />ESPACIO<br />PARA<br />ENCONTRAR<br /><em>A JESÚS.</em></h2></Reveal>
        <Reveal className="mission-media"><MediaPlaceholder /><span className="stamp">PRESENCIA QUE<br />TRANSFORMA</span></Reveal>
      </section>

      <section className="vision" aria-labelledby="vision-title">
        <Reveal><p className="eyebrow">03 / NUESTRA VISIÓN</p><h2 id="vision-title">MÁS ALLÁ /<br />DE NOSOTROS</h2></Reveal>
        <div className="vision-orbit" aria-hidden="true"><span>+</span></div>
        <Reveal className="vision-media"><MediaPlaceholder label="[ PHOTO PLACEHOLDER ]" /></Reveal>
        <Reveal className="vision-note"><p>Una fe que mira hacia afuera.<br />Una comunidad que abre caminos.</p></Reveal>
      </section>

      <section className="history" id="historia" aria-labelledby="history-title">
        <div className="history-side"><span>04</span><b>NUESTRA HISTORIA</b></div>
        <Reveal className="history-heading"><p>CRÓNICA VIVA</p><h2 id="history-title">NUESTRA<br />HISTORIA</h2></Reveal>
        <div className="timeline">
          <Reveal className="history-copy"><p>Una historia hecha de mesas compartidas, barrios abiertos y personas que decidieron caminar juntas. Cada etapa nos recuerda que la fe cobra sentido cuando se vive en comunidad.</p><span>2016 — HOY</span></Reveal>
          <Reveal className="history-collage">
            {history.map((item, index) => <figure className={`collage-item collage-${index + 1}`} key={item.year}><MediaPlaceholder className={item.type} label={item.label} /><figcaption>{item.year}</figcaption></figure>)}
          </Reveal>
        </div>
        <Reveal className="history-video"><MediaPlaceholder label="[ VIDEO PLACEHOLDER ]" video /></Reveal>
      </section>

      <footer id="contacto" className="closing"><Reveal><p>LA PRÓXIMA PÁGINA<br />LA ESCRIBIMOS JUNTOS.</p><h2>SEGUIMOS<br /><em>ESCRIBIENDO.</em></h2><a href="mailto:hola@espirituyverdad.org">HABLEMOS <span>→</span></a></Reveal></footer>
    </main>
  )
}

const locations = [
  { name: 'OIKOS Distrito Nacional', description: 'Nuestro campus principal: un lugar para conectar, crecer y servir.', address: 'Santo Domingo Norte, República Dominicana', coordinates: [18.459616, -69.911104], images: ['campus', 'community', 'worship'] },
  { name: 'Oikos Santo Domingo Norte', description: 'Un espacio diseñado para acompañar a la próxima generación.', address: 'Santo Domingo Norte, República Dominicana', coordinates: [18.548306, -69.866969], images: ['youth', 'community'] },
  { name: 'Oikos Santo Domingo Este', description: 'Atención, información y acompañamiento para nuestra comunidad.', address: 'Santo Domingo Norte, República Dominicana', coordinates: [18.479831, -69.872131], images: ['office', 'campus'] },
  { name: 'Oikos Santo Domingo Oeste', description: 'Atención, información y acompañamiento para nuestra comunidad.', address: 'Santo Domingo Norte, República Dominicana', coordinates: [18.488645, -69.992106], images: ['office', 'campus'] },
]

const locationPins = {
  [locations[0].name]: distritoNacionalPin,
  [locations[1].name]: santoDomingoNortePin,
  [locations[2].name]: santoDomingoEstePin,
  [locations[3].name]: santoDomingoOestePin,
}

function ChurchMap({ onLocationSelect }) {
  const element = useRef(null)
  useEffect(() => {
    const map = L.map(element.current, { scrollWheelZoom: false })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map)
    locations.forEach((location) => {
      const locationIcon = L.divIcon({
        className: 'church-marker-wrapper',
        html: `<img class="church-marker church-marker-image" src="${locationPins[location.name]}" alt="" />`,
        iconSize: [58, 82],
        iconAnchor: [29, 79],
      })
      L.marker(location.coordinates, { icon: locationIcon }).addTo(map).on('click', () => onLocationSelect(location))
    })
    map.fitBounds(L.latLngBounds(locations.map(({ coordinates }) => coordinates)), { padding: [42, 42] })
    return () => map.remove()
  }, [onLocationSelect])
  return <div ref={element} className="church-map" aria-label="Mapa interactivo de ubicaciones" />
}

function LocationModal({ location, onClose }) {
  const [slide, setSlide] = useState(0)
  const imageCount = location.images.length
  useEffect(() => { setSlide(0); const interval = window.setInterval(() => setSlide((current) => (current + 1) % imageCount), 5000); return () => window.clearInterval(interval) }, [location, imageCount])
  const changeSlide = (direction) => setSlide((current) => (current + direction + imageCount) % imageCount)
  return <div className="modal-overlay" onMouseDown={onClose} role="presentation"><section className="location-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Cerrar ventana">×</button>
    <header><h2 id="modal-title">{location.name}</h2><p>{location.address}</p></header>
    <div className="carousel"><div className={`carousel-slide ${location.images[slide]}`} role="img" aria-label={`Vista ${slide + 1} de ${location.name}`}><span>{location.name}</span></div>{imageCount > 1 && <><button className="carousel-control previous" onClick={() => changeSlide(-1)} aria-label="Imagen anterior">‹</button><button className="carousel-control next" onClick={() => changeSlide(1)} aria-label="Imagen siguiente">›</button></>}</div>
    <div className="carousel-dots" aria-label="Seleccionar imagen">{location.images.map((_, index) => <button key={index} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={`Ver imagen ${index + 1}`} />)}</div>
    <p className="modal-description">{location.description}</p>
    <footer className="modal-actions"><a className="secondary-action" href={`https://wa.me/18094444019?text=${encodeURIComponent(`Hola, quiero más información sobre ${location.name}.`)}`} target="_blank" rel="noreferrer">Obtener más información</a><a className="primary-action" href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.join(',')}`} target="_blank" rel="noreferrer">Cómo llegar</a></footer>
  </section></div>
}

function IntroScreen({ onComplete }) {
  useEffect(() => {
    document.body.classList.add('intro-active')
    const timeout = window.setTimeout(onComplete, 1750)
    return () => { window.clearTimeout(timeout); document.body.classList.remove('intro-active') }
  }, [onComplete])

  return <div className="intro-screen" role="status" aria-label="Cargando Espíritu y Verdad">
    <img className="intro-logo" src={logoMev} alt="Espíritu y Verdad" />
    <div className="intro-site-reveal" aria-hidden="true">
      <div className="intro-site-header"><img src={logoEspirituVerdad} alt="" /><span>Inicio</span><span>Oikos</span><span>Quiénes somos</span><span>Discipulado</span></div>
      <div className="intro-site-blank" />
    </div>
  </div>
}

function OikosScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const selectLocation = useCallback((location) => setSelectedLocation(location), [])
  return <><main className="oikos-original-page"><section className="oikos-section"><div className="video-area"><div className="video-placeholder"><span className="play-button" aria-hidden="true">▶</span><div><strong>Video de bienvenida</strong><p>Este espacio queda preparado para insertar el video de la iglesia.</p></div></div></div><section className="map-area" aria-labelledby="map-title"><div className="map-heading"><h2 id="map-title">UBICACIONES</h2></div><ChurchMap onLocationSelect={selectLocation} /></section></section></main>{selectedLocation && <LocationModal location={selectedLocation} onClose={() => setSelectedLocation(null)} />}</>
}

function DiscipuladoScreen() {
  return <main className="discipulado-page">
    <section className="discipulado-hero"><p>03 / CAMINAR JUNTOS</p><h1>DISCIPULADO<br /><em>ES VIDA.</em></h1><span className="discipulado-orbit" aria-hidden="true">✦</span></section>
    <section className="discipulado-copy"><p>CRECEMOS EN COMUNIDAD</p><h2>APRENDER.<br />SERVIR.<br /><em>COMPARTIR.</em></h2><div className="discipulado-placeholder">[ PRÓXIMAMENTE ]</div></section>
  </main>
}

function HomeScreen() {
  return <main className="home-screen" aria-label="Inicio" />
}

function App() {
  const getScreen = () => ({ '#oikos': 'oikos', '#quienes-somos': 'about', '#discipulado': 'discipulado' }[window.location.hash] || 'home')
  const [screen, setScreen] = useState(getScreen)
  const [showIntro, setShowIntro] = useState(() => getScreen() === 'home')

  useEffect(() => {
    const onHashChange = () => setScreen(getScreen())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    setShowIntro(screen === 'home')
  }, [screen])

  const items = [
    ['home', '#inicio', 'Inicio'],
    ['oikos', '#oikos', 'Oikos'],
    ['about', '#quienes-somos', 'Quiénes somos'],
    ['discipulado', '#discipulado', 'Discipulado'],
  ]

  return <>
    {screen === 'home' && showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
    <nav className="screen-menu" aria-label="Navegación entre pantallas">
      <a className="screen-menu-brand" href="#inicio" aria-label="Inicio"><img src={logoEspirituVerdad} alt="Espíritu y Verdad" /></a>
      <div>{items.map(([id, href, label]) => <a key={id} href={href} className={screen === id ? 'active' : ''}>{label}</a>)}</div>
      <span className="screen-menu-index">0{items.findIndex(([id]) => id === screen) + 1}</span>
    </nav>
    {screen === 'home' && <HomeScreen />}
    {screen === 'oikos' && <OikosScreen />}
    {screen === 'about' && <AboutScreen />}
    {screen === 'discipulado' && <DiscipuladoScreen />}
  </>
}

export default App
