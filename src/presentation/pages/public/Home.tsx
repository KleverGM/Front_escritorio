import React, { useState } from "react";
import hero from "../../../mages/linea1.png";

export default function Home() {
  const [email, setEmail] = useState("");

  const testimonials = [
    { name: "Ana Pérez", text: "Excelente plataforma, aprendí muchísimo." },
    {
      name: "Luis Gómez",
      text: "Contenidos claros y estructura muy práctica.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="w-full min-h-[80vh] flex flex-col lg:flex-row relative overflow-hidden bg-[#f8b31d] dark:bg-slate-900">
        <div className="flex-1 flex items-center px-6 lg:px-16 py-16 relative z-10">
          <div className="space-y-5 max-w-xl">
            <span className="inline-flex items-center rounded-full bg-white/80 text-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide dark:bg-slate-800 dark:text-slate-200">
              Aprende a tu ritmo
            </span>
            <h1 className="font-bebasneue text-[56px] md:text-[88px] leading-[0.9] text-white">
              Inicia tu nuevo
            </h1>
            <h1 className="font-bebasneue text-[56px] md:text-[88px] leading-[0.9] text-slate-900 dark:text-white">
              camino en la vida
            </h1>
            <p className="text-lg text-slate-900 dark:text-slate-200 font-oswald">
              Transforma tu pasión en profesión con cursos prácticos, proyectos
              reales y acompañamiento continuo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/register"
                className="inline-flex items-center justify-center bg-white text-slate-900 px-6 py-3 rounded-lg font-oswald font-semibold shadow hover:shadow-md"
              >
                Comenzar ahora
              </a>
              <a
                href="/courses"
                className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-oswald font-semibold hover:bg-white hover:text-slate-900 transition-colors"
              >
                Ver cursos
              </a>
            </div>
          </div>
        </div>

        <div
          className="flex-1 min-h-[40vh] lg:min-h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero})`,
            transform: "scaleX(-1)",
          }}
          aria-hidden
        />
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-slate-950 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Testimonios
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Lo que dicen nuestros estudiantes
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-900 dark:text-white">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {t.name}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-slate-700 dark:text-slate-300">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Contáctanos
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                ¿Tienes dudas? Escríbenos y te responderemos pronto.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6">
                <p className="text-slate-700 dark:text-slate-300">
                  Teléfono: 09808657
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  Email: cursosonline@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
