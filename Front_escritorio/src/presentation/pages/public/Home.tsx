import React, { useState } from 'react'
import hero from '../../../mages/linea1.png'

export default function Home() {
  const [email, setEmail] = useState('')

  const testimonials = [
    { name: 'Ana Pérez', text: 'Excelente plataforma, aprendí muchísimo.' },
    { name: 'Luis Gómez', text: 'Contenidos claros y estructura muy práctica.' },
  ]

  return (
    <div>
      {/* Hero - full width banner with 50/50 split */}
      <section className="w-full text-white min-h-screen flex flex-col md:flex-row relative overflow-hidden" style={{ backgroundColor: '#f8b31d' }}>
        {/* Left column: text and buttons */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end px-6 md:pr-12 py-16 md:py-28 relative z-10">
          <div className="space-y-4 w-full max-w-md md:max-w-lg pr-0 md:pr-8 text-center md:text-right">
            <h1 className="font-bebasneue text-4xl sm:text-5xl md:text-[70px] lg:text-[110px] leading-[0.9] text-white">Inicia tu nuevo</h1>
            <h1 className="font-bebasneue text-4xl sm:text-5xl md:text-[70px] lg:text-[110px] leading-[0.9] text-black">camino en la vida</h1>
            <p className="mt-4 md:mt-6 text-black text-base sm:text-lg md:text-xl font-oswald">Transforma tu pasión en profesión con cursos prácticos y accesibles.</p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-end">
              <a href="/register" className="inline-block bg-white text-black px-6 py-3 rounded font-oswald font-semibold w-full sm:w-auto text-center">Comenzar ahora</a>
              <a href="/courses" className="inline-block border-2 border-white text-white px-6 py-3 rounded font-oswald font-semibold w-full sm:w-auto text-center">Ver cursos</a>
            </div>
          </div>
        </div>

        {/* Right column: image fills right half on md, stacked on mobile */}
        <div
          className="w-full md:w-1/2 h-64 md:h-screen overflow-hidden flex items-stretch mt-4 md:mt-0"
          style={{ backgroundImage: `url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'scaleX(-1)' }}
          aria-hidden
        />
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Testimonios</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-4 rounded shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-xl font-bold">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <h3 className="text-2xl font-bold">Contáctanos</h3>
              <p className="text-gray-600 mt-2">¿Tienes dudas? Escríbenos y te responderemos pronto.</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-700">Teléfono: 09808657</p>
              <p className="text-gray-700">Email: cursosonline@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
