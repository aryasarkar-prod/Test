import { formatTime, formatWeekday } from './format.js';

const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const statusEl = document.getElementById('status');
const currentEl = document.getElementById('current');
const forecastEl = document.getElementById('forecast');
const sourceBadge = document.getElementById('source-badge');
const quickPicks = document.querySelectorAll('.quick-pick');
const submitButton = form.querySelector('button[type="submit"]');

// Tracks the in-flight search request. A monotonically increasing
// token tags every searchCity invocation so a slow earlier response
// can be ignored when a newer search has already started, and the
// matching AbortController lets us stop the earlier fetch as well.
let activeSearch = null;

function setStatus(message, { error = false } = {}) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', Boolean(error) && Boolean(message));
}

function clearResults() {
  currentEl.innerHTML = '';
  currentEl.classList.add('hidden');
  forecastEl.innerHTML = '';
}

function formatTemp(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--';
  return `${Math.round(value)}\u00B0`;
}

function sourceLabel(source) {
  if (source === 'open-meteo') return { text: 'live', cls: 'live' };
  if (source === 'mock' || source === 'mock-fallback') {
    return { text: 'demo', cls: 'demo' };
  }
  return { text: source || 'unknown', cls: '' };
}

function updateSourceBadge(source) {
  const { text, cls } = sourceLabel(source);
  sourceBadge.textContent = text;
  sourceBadge.classList.remove('live', 'demo');
  if (cls) sourceBadge.classList.add(cls);
}

function renderCurrent(data) {
  const { location, current } = data;
  const locationName = [location?.name, location?.country].filter(Boolean).join(', ');
  currentEl.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'current-header';

  const title = document.createElement('h2');
  title.className = 'current-location';
  title.textContent = locationName || 'Unknown location';
  header.appendChild(title);

  if (current?.time) {
    const timeEl = document.createElement('span');
    timeEl.className = 'current-time';
    timeEl.textContent = formatTime(current.time, location?.timezone);
    header.appendChild(timeEl);
  }

  const body = document.createElement('div');
  body.className = 'current-body';

  const temp = document.createElement('div');
  temp.className = 'current-temp';
  temp.textContent = formatTemp(current?.temperature);
  body.appendChild(temp);

  const meta = document.createElement('div');
  meta.className = 'current-meta';

  const condition = document.createElement('span');
  condition.className = 'current-condition';
  condition.textContent = current?.condition ?? '';
  meta.appendChild(condition);

  const wind = document.createElement('span');
  const windSpeed = current?.windSpeed;
  wind.textContent =
    typeof windSpeed === 'number' ? `Wind: ${Math.round(windSpeed)} km/h` : 'Wind: --';
  meta.appendChild(wind);

  body.appendChild(meta);

  currentEl.appendChild(header);
  currentEl.appendChild(body);
  currentEl.classList.remove('hidden');
}

function renderForecast(daily) {
  forecastEl.innerHTML = '';
  if (!Array.isArray(daily)) return;

  for (const day of daily) {
    const tile = document.createElement('div');
    tile.className = 'forecast-tile';

    const dayLabel = document.createElement('div');
    dayLabel.className = 'forecast-day';
    dayLabel.textContent = formatWeekday(day.date);
    tile.appendChild(dayLabel);

    const condition = document.createElement('div');
    condition.className = 'forecast-condition';
    condition.textContent = day.condition ?? '';
    tile.appendChild(condition);

    const temps = document.createElement('div');
    temps.className = 'forecast-temps';

    const max = document.createElement('span');
    max.className = 'forecast-temp-max';
    max.textContent = formatTemp(day.tempMax);
    temps.appendChild(max);

    const min = document.createElement('span');
    min.className = 'forecast-temp-min';
    min.textContent = formatTemp(day.tempMin);
    temps.appendChild(min);

    tile.appendChild(temps);

    const precip = document.createElement('div');
    precip.className = 'forecast-precip';
    const p = day.precipitation;
    precip.textContent = typeof p === 'number' ? `${p.toFixed(1)} mm` : '-- mm';
    tile.appendChild(precip);

    forecastEl.appendChild(tile);
  }
}

function renderWeather(data) {
  renderCurrent(data);
  renderForecast(data.daily);
  updateSourceBadge(data.source);
}

async function searchCity(city) {
  // If a previous search is still pending, abort it and ignore its
  // eventual response. This prevents a slow earlier request from
  // overwriting the UI for a newer search.
  if (activeSearch) {
    activeSearch.controller.abort();
  }
  const controller = new AbortController();
  const search = { controller };
  activeSearch = search;

  setStatus('Loading...');
  clearResults();
  if (submitButton) submitButton.disabled = true;

  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
      signal: controller.signal
    });
    if (activeSearch !== search) return;

    if (res.ok) {
      const data = await res.json();
      if (activeSearch !== search) return;
      renderWeather(data);
      setStatus('');
      return;
    }
    if (res.status === 404) {
      setStatus('City not found', { error: true });
      return;
    }
    setStatus('Something went wrong, please try again', { error: true });
  } catch (err) {
    // A superseded request will throw AbortError; that is intentional
    // and should not surface as a user-visible error.
    if (err && err.name === 'AbortError') return;
    if (activeSearch !== search) return;
    console.error('Weather request failed', err);
    setStatus('Something went wrong, please try again', { error: true });
  } finally {
    if (activeSearch === search) {
      activeSearch = null;
      if (submitButton) submitButton.disabled = false;
    }
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (!city) {
    setStatus('Please enter a city', { error: true });
    return;
  }
  searchCity(city);
});

quickPicks.forEach((btn) => {
  btn.addEventListener('click', () => {
    const city = btn.dataset.city;
    if (!city) return;
    input.value = city;
    form.requestSubmit
      ? form.requestSubmit()
      : form.dispatchEvent(new Event('submit', { cancelable: true }));
  });
});
