import React, { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet'

const navigation = ['Inicio', 'Nosotros', 'Creencias', 'Ministerios', 'Comunidad', 'Eventos', 'Contacto']

const locations = [
  {
    name: 'OIKOS Santo Domingo Norte',
    description: 'Nuestro campus principal: un lugar para conectar, crecer y servir.',
    address: 'Santo Domingo Norte, República Dominicana',
    coordinates: [18.4861, -69.9312],
    images: [
      'campus',
      'community',
      'worship',
    ],
  },
  {
    name: 'Salón juvenil',
    description: 'Un espacio diseñado para acompañar a la próxima generación.',
    address: 'Santo Domingo Norte, República Dominicana',
    coordinates: [18.4894, -69.9274],
    images: [
      'youth',
      'community',
    ],
  },
  {
    name: 'Oficina OIKOS',
    description: 'Atención, información y acompañamiento para nuestra comunidad.',
    address: 'Santo Domingo Norte, República Dominicana',
    coordinates: [18.4824, -69.9368],
    images: [
      'office',
      'campus',
    ],
  },
]

function ChurchMap({ onLocationSelect }) {
  const element = useRef(null)

  useEffect(() => {
    const map = L.map(element.current, { scrollWheelZoom: false }).setView([18.4861, -69.9312], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const icon = L.divIcon({
      className: 'church-marker-wrapper',
      html: '<span class="church-marker">✦</span>',
      iconSize: [34, 42],
      iconAnchor: [17, 42],
    })

    locations.forEach((location) => {
      L.marker(location.coordinates, { icon }).addTo(map).on('click', () => onLocationSelect(location))
    })

    return () => map.remove()
  }, [onLocationSelect])

  return <div ref={element} className="church-map" aria-label="Mapa interactivo de ubicaciones" />
}

function LocationModal({ location, onClose }) {
  const [slide, setSlide] = useState(0)
  const imageCount = location.images.length
  const destination = location.coordinates.join(',')
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
  const whatsappMessage = encodeURIComponent(`Hola, quiero más información sobre ${location.name}.`)
  const whatsappUrl = `https://wa.me/18094444019?text=${whatsappMessage}`

  useEffect(() => setSlide(0), [location])

  function changeSlide(direction) {
    setSlide((current) => (current + direction + imageCount) % imageCount)
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose} role="presentation">
      <section className="location-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar ventana">×</button>
        <header><h2 id="modal-title">{location.name}</h2><p>{location.address}</p></header>
        <div className="carousel">
          <div className={`carousel-slide ${location.images[slide]}`} role="img" aria-label={`Vista ${slide + 1} de ${location.name}`}><span>{location.name}</span></div>
          {imageCount > 1 && <><button className="carousel-control previous" onClick={() => changeSlide(-1)} aria-label="Imagen anterior">‹</button><button className="carousel-control next" onClick={() => changeSlide(1)} aria-label="Imagen siguiente">›</button></>}
        </div>
        <div className="carousel-dots" aria-label="Seleccionar imagen">
          {location.images.map((_, index) => <button key={index} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={`Ver imagen ${index + 1}`} />)}
        </div>
        <p className="modal-description">{location.description}</p>
        <footer className="modal-actions">
          <a className="secondary-action" href={whatsappUrl} target="_blank" rel="noreferrer"><span>◫</span> Obtener más información</a>
          <a className="primary-action" href={mapsUrl} target="_blank" rel="noreferrer"><span>⌖</span> Cómo llegar</a>
        </footer>
      </section>
    </div>
  )
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const selectLocation = useCallback((location) => setSelectedLocation(location), [])

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="#inicio">Espíritu y Verdad</a>
        <nav aria-label="Navegación principal">
          {navigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
        </nav>
      </header>

      <section className="oikos-section" id="inicio">
        <div className="video-area">
          <h1>OIKOS</h1>
          <div className="video-placeholder">
            <span className="play-button" aria-hidden="true">▶</span>
            <div><strong>Video de bienvenida</strong><p>Este espacio queda preparado para insertar el video de la iglesia.</p></div>
          </div>
        </div>

        <section className="map-area" aria-labelledby="map-title">
          <div className="map-heading"><div><h2 id="map-title">Nuestras ubicaciones</h2></div></div>
          <ChurchMap onLocationSelect={selectLocation} />
        </section>
      </section>

      {selectedLocation && <LocationModal location={selectedLocation} onClose={() => setSelectedLocation(null)} />}
    </main>
  )
}

export default App