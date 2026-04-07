import { Link } from "react-router-dom";
import PageShell from "../layouts/PageShell";

function LandingPage() {
  return (
    <PageShell>
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-dawn/30 bg-dawn/10 px-4 py-2 text-sm text-dawn">
            Weather intelligence built for Rwanda
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-tight text-white md:text-6xl">
            Real-time forecasts, secure alerts, and smart climate operations in one platform.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Meteo combines live OpenWeatherMap data, automated forecast emails, unusual login detection, and admin oversight for teams serving Rwanda with weather-driven decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="rounded-full bg-rain px-6 py-3 font-medium text-white transition hover:bg-blue-500">
              Launch Meteo
            </Link>
            <Link to="/login" className="rounded-full border border-white/15 px-6 py-3 font-medium text-white transition hover:border-white/30">
              Sign in
            </Link>
          </div>
        </div>
        <div className="glass p-8">
          <div className="rounded-3xl bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-mist/60">Platform highlights</p>
            <div className="mt-6 grid gap-4">
              {[
                "JWT-secured login for users and admins",
                "Daily forecast emails scheduled at 7:00 AM",
                "Unusual login alerts using IP and device fingerprints",
                "Admin visibility into users, logs, and broadcast actions"
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default LandingPage;
