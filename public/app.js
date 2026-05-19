const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const statusEl = document.getElementById('status');
const currentEl = document.getElementById('current');
const forecastEl = document.getElementById('forecast');
const sourceBadge = document.getElementById('source-badge');
const quickPicks = document.querySelectorAll('.quick-pick');

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

function formatWeekday(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

function formatTime(isoTime) {
  if (!isoTime) return '';
  const d = new Date(isoTime);
  if (Number.isNaN(d.getTime())) return isoTime;
  return d.toLocaleString(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
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
    timeEl.textContent = formatTime(current.time);
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
  setStatus('Loading...');
  clearResults();
  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (res.ok) {
      const data = await res.json();
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
    console.error('Weather request failed', err);
    setStatus('Something went wrong, please try again', { error: true });
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
