const weatherUrl = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en';
const stationName = 'Hong Kong Observatory';
const temperatureElement = document.getElementById('weather-temperature');
const statusElement = document.getElementById('weather-status');
const updatedElement = document.getElementById('weather-updated');
const checkedElement = document.getElementById('weather-checked');
const refreshButton = document.getElementById('weather-refresh');
const hongKongTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Hong_Kong',
  dateStyle: 'medium',
  timeStyle: 'short'
});

function displayTime(element, date) {
  element.dateTime = date.toISOString();
  element.textContent = `${hongKongTime.format(date)} HKT`;
}

async function loadWeather() {
  if (refreshButton.disabled) return;

  refreshButton.disabled = true;
  statusElement.textContent = 'Loading weather…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(weatherUrl, {
      signal: controller.signal,
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Weather request failed.');

    const data = await response.json();
    if (!Array.isArray(data?.temperature?.data)) {
      throw new Error('Weather data is missing.');
    }

    // Station order can change, so never select a station by array position.
    const station = data.temperature.data.find((entry) => entry?.place === stationName);
    if (!station || !Number.isFinite(station.value) || station.unit !== 'C') {
      throw new Error('The requested temperature is missing.');
    }

    const updated = new Date(data.updateTime);
    if (typeof data.updateTime !== 'string' || Number.isNaN(updated.getTime())) {
      throw new Error('Weather update time is missing.');
    }

    temperatureElement.textContent = `${station.value} °C`;
    displayTime(updatedElement, updated);
    statusElement.textContent = 'Current temperature';
  } catch {
    temperatureElement.textContent = '—';
    updatedElement.textContent = '—';
    updatedElement.removeAttribute('datetime');
    statusElement.textContent = 'Temperature unavailable. Check your connection or try again later.';
  } finally {
    clearTimeout(timeout);
    displayTime(checkedElement, new Date());
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener('click', loadWeather);
setInterval(() => {
  if (document.visibilityState === 'visible') loadWeather();
}, 5 * 60 * 1000);
loadWeather();

const airQualityUrl = 'https://dashboard.data.gov.hk/api/aqhi-individual?format=json';
const transportUrl = 'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=SYP';

function sourceTime(value) {
  // These two feeds publish Hong Kong local timestamps without a timezone.
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}$/.test(value)) {
    throw new Error('Source timestamp is missing.');
  }
  const date = new Date(`${value.replace(' ', 'T')}+08:00`);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid source timestamp.');
  return date;
}

function renderAirQuality(data) {
  const station = Array.isArray(data)
    ? data.find((entry) => entry?.station === 'Central/Western') : null;
  if (!station || !/^(?:[1-9]|10|10\+)$/.test(String(station.aqhi)) ||
      typeof station.health_risk !== 'string' || !station.health_risk.trim()) {
    throw new Error('Air quality reading is missing.');
  }
  const updated = sourceTime(station.publish_date);
  document.getElementById('air-quality-station').textContent = station.station;
  document.getElementById('air-quality-value').textContent = `AQHI ${station.aqhi}`;
  document.getElementById('air-quality-risk').textContent = `Health risk: ${station.health_risk}`;
  displayTime(document.getElementById('air-quality-updated'), updated);
  return 'Current air quality';
}

function renderTransport(json) {
  if (json?.status !== 1) throw new Error('Train data is unavailable.');
  const station = json.data?.['ISL-SYP'];
  if (!station || !Array.isArray(station.UP) || !Array.isArray(station.DOWN)) {
    throw new Error('Station data is missing.');
  }
  const updated = sourceTime(station.curr_time);
  const destinations = { CHW: 'Chai Wan', KET: 'Kennedy Town' };
  const rows = ['UP', 'DOWN'].map((direction) => {
    const trains = station[direction].filter((train) => train?.valid === 'Y');
    const arrivals = trains.map((train) => {
      if (typeof train.ttnt !== 'string' || !/^\d+$/.test(train.ttnt) ||
          typeof train.dest !== 'string' || !/^[A-Z]{3}$/.test(train.dest)) {
        throw new Error('Invalid train arrival.');
      }
      const minutes = Number(train.ttnt);
      if (!Number.isSafeInteger(minutes)) throw new Error('Invalid train minutes.');
      return { minutes, destination: destinations[train.dest] || `station code ${train.dest}` };
    });
    arrivals.sort((a, b) => a.minutes - b.minutes);
    const label = direction === 'UP' ? 'Chai Wan' : 'Kennedy Town';
    if (!arrivals.length) return `Towards ${label}: No upcoming trains`;
    const next = arrivals[0];
    return `Towards ${next.destination}: ${next.minutes} min`;
  });
  document.getElementById('transport-up').textContent = rows[0];
  document.getElementById('transport-down').textContent = rows[1];
  displayTime(document.getElementById('transport-updated'), updated);
  return json.isdelay === 'Y' ? 'MTR reports delayed arrival data.' : 'Latest train arrivals';
}

async function loadCard(id, url, render, loading, unavailable) {
  const button = document.getElementById(`${id}-refresh`);
  if (button.disabled) return;
  const status = document.getElementById(`${id}-status`);
  button.disabled = true;
  status.textContent = loading;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('Request failed.');
    status.textContent = render(await response.json());
  } catch {
    status.textContent = `${unavailable} Check your connection or try again later.`;
    const updated = document.getElementById(`${id}-updated`);
    updated.textContent = '—';
    updated.removeAttribute('datetime');
    if (id === 'air-quality') {
      document.getElementById('air-quality-value').textContent = '—';
      document.getElementById('air-quality-risk').textContent = 'Health risk: —';
    } else {
      document.getElementById('transport-up').textContent = 'Towards Chai Wan: —';
      document.getElementById('transport-down').textContent = 'Towards Kennedy Town: —';
    }
  } finally {
    clearTimeout(timeout);
    displayTime(document.getElementById(`${id}-checked`), new Date());
    button.disabled = false;
  }
}

for (const card of [
  ['air-quality', airQualityUrl, renderAirQuality, 'Loading air quality…', 'Air quality unavailable.'],
  ['transport', transportUrl, renderTransport, 'Loading train arrivals…', 'Train arrivals unavailable.']
]) {
  const load = () => loadCard(...card);
  document.getElementById(`${card[0]}-refresh`).addEventListener('click', load);
  setInterval(() => {
    if (document.visibilityState === 'visible') load();
  }, 5 * 60 * 1000);
  load();
}
