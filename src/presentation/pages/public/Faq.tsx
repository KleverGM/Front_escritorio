const faqs = [
  {
    q: "¿Necesito experiencia previa para empezar?",
    a: "No. Tenemos rutas desde nivel básico hasta avanzado, con apoyo paso a paso.",
  },
  {
    q: "¿Los certificados tienen validez?",
    a: "Sí, puedes descargar certificados digitales al completar cada curso.",
  },
  {
    q: "¿Puedo cancelar el plan cuando quiera?",
    a: "Sí, puedes cambiar o cancelar tu plan en cualquier momento.",
  },
  {
    q: "¿Hay acceso para equipos?",
    a: "Sí, contamos con planes empresariales y seguimiento por equipo.",
  },
];

export default function Faq() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Preguntas frecuentes
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Respuestas rápidas a las dudas más comunes.
        </p>

        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {item.q}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
