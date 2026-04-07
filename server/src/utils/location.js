function resolveLocationInput(body = {}, fallback = {}) {
  const city = body.city || fallback.city || "";
  const latValue = body.lat ?? fallback.lat ?? null;
  const lonValue = body.lon ?? fallback.lon ?? null;
  const lat = latValue === "" || latValue === null || latValue === undefined ? null : Number(latValue);
  const lon = lonValue === "" || lonValue === null || lonValue === undefined ? null : Number(lonValue);

  return { city, lat, lon };
}

function hasCoordinates(location = {}) {
  return typeof location.lat === "number" && !Number.isNaN(location.lat) && typeof location.lon === "number" && !Number.isNaN(location.lon);
}

module.exports = {
  resolveLocationInput,
  hasCoordinates
};
