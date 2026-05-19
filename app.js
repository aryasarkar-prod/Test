// ── Weather App ──────────────────────────────────────────────────────────────
// Uses Open-Meteo (weather) + Open-Meteo Geocoding (city search) — no API key!

const cityInput  = document.getElementById('cityInput');
const searchBtn  = document.getElementById('searchBtn');
const suggestions = document.getElementById('suggestions');
const errorMsg   = document.getElementById('errorMsg');
const errorText  = document.getElementById('errorText');
const loading    = document.getElementById('loading');
const weatherCard = document.getElementById('weatherCard');

// ── WMO Weather Code mapping ──────────────────────────────────────────────────
const WMO = {
  0:  { label: 'Clear sky',              emoji: '☀️' },
  1:  { label: 'Mainly clear',           emoji: '🌤' },
  2:  { label: 'Partly cloudy',          emoji: '⛅' },
  3:  { label: 'Overcast',               emoji: '☁️' },
  45: { label: 'Foggy',                  emoji: '🌫' },
  48: { label: 'Icy fog',                emoji: '🌫' },
  51: { label: 'Light drizzle',          emoji: '🌦' },
  53: { label: 'Drizzle',                emoji: '🌦' },
  55: { label: 'Dense drizzle',          emoji: '🌧' },
  61: { label: 'Slight rain',            emoji: '🌧' },
  63: { label: 'Moderate rain',          emoji: '🌧' },
  65: { label: 'Heavy rain',             emoji: '🌧' },
  71: { label: 'Slight snow',            emoji: '🌨' },
  73: { label: 'Moderate snow',          emoji: '❄️' },
  75: { label: 'Heavy snow',             emoji: '❄️' },
  77: { label: 'Snow grains',            emoji: '🌨' },
  80: { label: 'Slight showers',         emoji: '🌦' },
  81: { label: 'Moderate showers',       emoji: '🌧' },
  82: { label: 'Violent showers',        emoji: '⛈' },
  85: { label: 'Slight snow showers',    emoji: '🌨' },
  86: { label: 'Heavy snow showers',     emoji: '❄️' },
  95: { label: 'Thunderstorm',           emoji: '⛈' },
  96: { label: 'Thunderstorm w/ hail',   emoji: '⛈' },
  99: { label: 'Thunderstorm w/ hail',   emoji: '⛈' },
};

function getWmo(code) {
  return WMO[code] || { label: 'Unknown', emoji: '🌡' };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function show(el)  { el.classList.remove('hidden'); }
function hide(el)  { el.classList.add('hidden'); }

function showError(msg) {
  errorText.textContent = msg;
  show(errorMsg);
}

function formatTime(iso) {
  // iso = "HH:MM" from Open-Meteo daily
  const [h, m] = iso.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = ((h % 12) || 12);
  return `${hour}:${String(m).padStart(2,'0')} ${ampm}`;
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
}

function dayName(dateStr, index) {
  if (index === 0) return 'Today';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

// ── Geocoding ─────────────────────────────────────────────────────────────────
let suggestTimer = null;

cityInput.addEventListener('input', () => {
  clearTimeout(suggestTimer);
  const q = cityInput.value.trim();
  if (q.length < 2) { hide(suggestions); return; }
  suggestTimer = setTimeout(() => fetchSuggestions(q), 300);
});

async function fetchSuggestions(query) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    renderSuggestions(data.results || []);
  } catch { hide(suggestions); }
}

function renderSuggestions(results) {
  if (!results.length) { hide(suggestions); return; }
  suggestions.innerHTML = results.map(r => `
    <div class="suggestion-item" data-lat="${r.latitude}" data-lon="${r.longitude}" data-name="${r.name}" data-country="${r.country || ''}">
      <span class="loc-detail">${r.name}${r.admin1 ? ', ' + r.admin1 : ''}</span>
      <span class="loc-detail">· ${r.country || ''}</span>
    </div>
  `).join('');
  show(suggestions);

  suggestions.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const { lat, lon, name, country } = item.dataset;
      cityInput.value = name;
      hide(suggestions);
      fetchWeather(parseFloat(lat), parseFloat(lon), name, country);
    });
  });
}

// Close suggestions on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.search-container')) hide(suggestions);
});

// ── Search trigger ────────────────────────────────────────────────────────────
searchBtn.addEventListener('click', triggerSearch);
cityInput.addEventListener('keydown', e => { if (e.key === 'Enter') triggerSearch(); });

async function triggerSearch() {
  const q = cityInput.value.trim();
  if (!q) return;
  hide(suggestions);
  hide(errorMsg);
  hide(weatherCard);
  show(loading);

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || !geoData.results.length) {
      hide(loading);
      showError(`Could not find "${q}". Try a different city name.`);
      return;
    }

    const place = geoData.results[0];
    await fetchWeather(place.latitude, place.longitude, place.name, place.country || '');
  } catch (err) {
    hide(loading);
    showError('Network error. Please check your connection and try again.');
  }
}

// ── Weather Fetch ─────────────────────────────────────────────────────────────
async function fetchWeather(lat, lon, name, country) {
  show(loading);
  hide(errorMsg);
  hide(weatherCard);

  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m','apparent_temperature','relative_humidity_2m',
        'weather_code','wind_speed_10m','visibility'
      ].join(','),
      daily: [
        'weather_code','temperature_2m_max','temperature_2m_min',
        'sunrise','sunset'
      ].join(','),
      timezone: 'auto',
      forecast_days: 5,
      wind_speed_unit: 'kmh',
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();

    hide(loading);
    renderWeather(data, name, country);
  } catch (err) {
    hide(loading);
    showError('Failed to fetch weather data. Please try again.');
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderWeather(data, name, country) {
  const cur = data.current;
  const daily = data.daily;
  const wmo = getWmo(cur.weather_code);

  // Header
  document.getElementById('cityName').textContent = name;
  document.getElementById('countryName').textContent = country;
  document.getElementById('dateTime').textContent = todayLabel();

  // Main
  document.getElementById('weatherIcon').textContent = wmo.emoji;
  document.getElementById('temperature').textContent = `${Math.round(cur.temperature_2m)}°C`;
  document.getElementById('feelsLike').textContent = `Feels like ${Math.round(cur.apparent_temperature)}°C`;
  document.getElementById('weatherDesc').textContent = wmo.label;

  // Stats
  document.getElementById('humidity').textContent = `${cur.relative_humidity_2m}%`;
  document.getElementById('windSpeed').textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
  document.getElementById('highLow').textContent =
    `${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°`;

  const vis = cur.visibility;
  document.getElementById('visibility').textContent =
    vis >= 1000 ? `${(vis / 1000).toFixed(1)} km` : `${vis} m`;

  document.getElementById('sunrise').textContent = formatTime(daily.sunrise[0].split('T')[1]);
  document.getElementById('sunset').textContent  = formatTime(daily.sunset[0].split('T')[1]);

  // 5-Day Forecast
  const forecastRow = document.getElementById('forecastRow');
  forecastRow.innerHTML = daily.time.map((dateStr, i) => {
    const w = getWmo(daily.weather_code[i]);
    return `
      <div class="forecast-day">
        <span class="day-name">${dayName(dateStr, i)}</span>
        <span class="day-icon">${w.emoji}</span>
        <span class="day-high">${Math.round(daily.temperature_2m_max[i])}°</span>
        <span class="day-low">${Math.round(daily.temperature_2m_min[i])}°</span>
      </div>
    `;
  }).join('');

  show(weatherCard);
}

// ── Load a default city on startup ────────────────────────────────────────────
window.addEventListener('load', () => {
  cityInput.value = 'London';
  triggerSearch();
});
