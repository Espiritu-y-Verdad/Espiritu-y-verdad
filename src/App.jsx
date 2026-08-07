import React, { useEffect, useRef } from 'react'
import L from 'leaflet'

const navigation = ['Inicio', 'Nosotros', 'Creencias', 'Ministerios', 'Comunidad', 'Eventos', 'Contacto']

const locations = [
  { name: 'Campus principal', description: 'Nuestro punto de encuentro', coordinates: [18.4861, -69.9312] },
  { name: 'Salón juvenil', description: 'Espacio para jóvenes', coordinates: [18.4894, -69.9274] },
  { name: 'Oficina', description: 'Atención e información', coordinates: [18.4824, -69.9368] },
]

function ChurchMap() {
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

    locations.forEach(({ name, description, coordinates }) => {
      L.marker(coordinates, { icon }).addTo(map).bindPopup(`<strong>${name}</strong><br>${description}`)
    })

    return () => map.remove()
  }, [])

  return <div ref={element} className="church-map" aria-label="Mapa interactivo de ubicaciones" />
}

function App() {
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
            <div>
              <strong>Video de bienvenida</strong>
              <p>Este espacio queda preparado para insertar el video de la iglesia.</p>
            </div>
          </div>
        </div>

        <section className="map-area" aria-labelledby="map-title">
          <div className="map-heading">
            <div><h2 id="map-title">Nuestras ubicaciones</h2></div>`r`n          </div>
          <ChurchMap />
        </section>
      </section>
    </main>
  )
}

export default App