function WeatherCard({ weather }) {
  if (!weather) {
    return <div className="rounded-2xl border border-dashed border-white/15 p-6 text-slate-300">Weather data is not available yet.</div>;
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-rain/40 via-slate-900 to-dawn/20 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-mist/70">{weather.city}</p>
      <div className="mt-4 flex items-end justify-between gap-6">
        <div>
          <p className="text-5xl font-semibold">{weather.temperature}°C</p>
          <p className="mt-2 text-lg capitalize text-mist">{weather.description}</p>
        </div>
        <div className="space-y-2 text-right text-sm text-mist">
          <p>Feels like {weather.feelsLike}°C</p>
          <p>Humidity {weather.humidity}%</p>
          <p>Wind {weather.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
