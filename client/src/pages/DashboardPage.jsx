import { useEffect, useState } from "react";
import PageShell from "../layouts/PageShell";
import SectionCard from "../components/SectionCard";
import WeatherCard from "../components/WeatherCard";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { user, refreshProfile } = useAuth();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [locationForm, setLocationForm] = useState({
    city: user?.location?.city || "",
    lat: user?.location?.lat ?? "",
    lon: user?.location?.lon ?? ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [currentResponse, forecastResponse] = await Promise.all([
          api.get("/weather/current"),
          api.get("/weather/forecast")
        ]);
        setCurrentWeather(currentResponse.data);
        setForecast(forecastResponse.data.items.slice(0, 5));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load weather data.");
      }
    }

    loadDashboard();
  }, []);

  async function handleLocationUpdate(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.put("/user/update-location", {
        city: locationForm.city,
        lat: locationForm.lat === "" ? undefined : Number(locationForm.lat),
        lon: locationForm.lon === "" ? undefined : Number(locationForm.lon)
      });
      await refreshProfile();

      const [currentResponse, forecastResponse] = await Promise.all([
        api.get("/weather/current"),
        api.get("/weather/forecast")
      ]);
      setCurrentWeather(currentResponse.data);
      setForecast(forecastResponse.data.items.slice(0, 5));
      setMessage("Location updated. Weather widgets refreshed.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update location.");
    }
  }

  return (
    <PageShell>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <SectionCard title={`Welcome back, ${user?.name}`} subtitle="Your Rwanda weather intelligence dashboard">
            <WeatherCard weather={currentWeather} />
          </SectionCard>

          <SectionCard title="5-day forecast" subtitle="Next weather snapshots from OpenWeatherMap">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {forecast.map((item) => (
                <div key={item.time} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm text-slate-400">{new Date(item.time).toLocaleString()}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.temperature}°C</p>
                  <p className="mt-1 capitalize text-slate-300">{item.description}</p>
                  <p className="mt-3 text-sm text-slate-400">Humidity {item.humidity}%</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Profile settings" subtitle="Update your city or exact coordinates">
            <form className="space-y-4" onSubmit={handleLocationUpdate}>
              <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" placeholder="City" value={locationForm.city} onChange={(event) => setLocationForm((current) => ({ ...current, city: event.target.value }))} />
              <div className="grid gap-4 md:grid-cols-2">
                <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" placeholder="Latitude" type="number" step="any" value={locationForm.lat} onChange={(event) => setLocationForm((current) => ({ ...current, lat: event.target.value }))} />
                <input className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-rain" placeholder="Longitude" type="number" step="any" value={locationForm.lon} onChange={(event) => setLocationForm((current) => ({ ...current, lon: event.target.value }))} />
              </div>
              {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              <button className="w-full rounded-2xl bg-rain px-4 py-3 font-medium text-white hover:bg-blue-500">Save location</button>
            </form>
          </SectionCard>

          <SectionCard title="Notifications" subtitle="Automated messages tied to your account">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">Welcome email is sent immediately after signup.</div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">Daily forecast email is scheduled for 7:00 AM.</div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">Security alert email is triggered when a login comes from a new IP or device.</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}

export default DashboardPage;
