import { useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../layouts/PageShell";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  city: "Kigali",
  lat: "",
  lon: ""
};

function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        lat: form.lat === "" ? undefined : Number(form.lat),
        lon: form.lon === "" ? undefined : Number(form.lon)
      };
      const response = await register(payload);
      setSuccess(response.message);
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl glass p-8">
        <h1 className="text-3xl font-semibold text-white">Create your Meteo account</h1>
        <p className="mt-2 text-slate-300">Save your weather location so daily forecasts and welcome previews can be personalized.</p>
        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">Full name</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">City</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Latitude</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" type="number" step="any" value={form.lat} onChange={(event) => setForm((current) => ({ ...current, lat: event.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Longitude</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" type="number" step="any" value={form.lon} onChange={(event) => setForm((current) => ({ ...current, lon: event.target.value }))} />
          </label>
          {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
          {success ? (
            <p className="md:col-span-2 text-sm text-emerald-300">
              {success} <Link className="underline" to="/login">Login now</Link>.
            </p>
          ) : null}
          <button disabled={submitting} className="md:col-span-2 rounded-2xl bg-rain px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

export default RegisterPage;
