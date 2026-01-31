export default function Contacto() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Hablemos
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              ¿Tienes dudas sobre planes, cursos o acceso institucional?
              Escríbenos y te responderemos pronto.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Email:
                </span>{" "}
                contacto@cursosonline.com
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Teléfono:
                </span>{" "}
                +51 900 000 000
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Horario:
                </span>{" "}
                Lunes a viernes · 9:00 - 18:00
              </div>
            </div>
          </div>

          <form className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Nombre completo
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Mensaje
              </label>
              <textarea
                rows={4}
                required
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand text-white py-2 rounded-lg font-medium hover:opacity-90"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
