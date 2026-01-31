import { Link } from "react-router-dom";

export default function Acerca() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-brand font-semibold">
              Acerca de nosotros
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Formación práctica para impulsar tu carrera
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Creamos experiencias de aprendizaje enfocadas en resultados
              reales. Nuestros cursos combinan proyectos guiados, mentoría y
              contenido actualizado para que avances con confianza.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-lg bg-brand text-white font-medium hover:opacity-90"
              >
                Empieza hoy
              </Link>
              <Link
                to="/precios"
                className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Ver planes
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              {
                title: "Aprende haciendo",
                description:
                  "Proyectos reales con retroalimentación para crear tu portafolio.",
              },
              {
                title: "Mentores expertos",
                description:
                  "Acompañamiento en cada etapa para acelerar tu aprendizaje.",
              },
              {
                title: "Actualización constante",
                description:
                  "Contenido alineado a las tendencias del mercado tech.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-14 grid gap-6 md:grid-cols-3">
          {[
            { label: "Estudiantes", value: "+12k" },
            { label: "Cursos activos", value: "+180" },
            { label: "Mentores", value: "65" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center"
            >
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
