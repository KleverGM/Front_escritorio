import { Link } from "react-router-dom";

const planes = [
  {
    name: "Gratis",
    price: "$0",
    description: "Explora cursos introductorios y recursos base.",
    features: [
      "Acceso a cursos gratuitos",
      "Comunidad básica",
      "Actualizaciones limitadas",
    ],
    cta: "Comenzar",
  },
  {
    name: "Pro",
    price: "$19/mes",
    description: "Acceso completo a todo el catálogo y soporte.",
    features: [
      "Todos los cursos incluidos",
      "Mentorías grupales",
      "Certificados digitales",
    ],
    cta: "Elegir Pro",
    highlight: true,
  },
  {
    name: "Empresa",
    price: "Personalizado",
    description: "Planes para equipos con analítica y seguimiento.",
    features: [
      "Gestión de equipos",
      "Reportes avanzados",
      "Soporte prioritario",
    ],
    cta: "Hablar con ventas",
  },
];

export default function Precios() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Planes que crecen contigo
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Elige el plan ideal para aprender a tu ritmo o impulsar a tu equipo.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {planes.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col justify-between bg-white dark:bg-slate-900 ${
                plan.highlight
                  ? "border-brand shadow-lg"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  {plan.price}
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {plan.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={plan.name === "Empresa" ? "/contacto" : "/register"}
                className={`mt-6 text-center px-4 py-2 rounded-lg font-medium ${
                  plan.highlight
                    ? "bg-brand text-white"
                    : "border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
