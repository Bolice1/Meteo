import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../layouts/PageShell";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await login(form);
      if (response.unusualLogin) {
        setMessage("Unusual login detected. A security alert email was sent.");
      }
      navigate(response.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-lg glass p-8">
        <h1 className="text-3xl font-semibold text-white">Sign in to Meteo</h1>
        <p className="mt-2 text-slate-300">Use your user account or the admin email and password from the backend environment.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-rain"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-rain"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {message ? <p className="text-sm text-dawn">{message}</p> : null}
          <button disabled={submitting} className="w-full rounded-2xl bg-rain px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

export default LoginPage;
