const fs = require('fs');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(time) {
  // time is like "1000" or "1430"
  let h = parseInt(time.slice(0, 2), 10);
  const m = time.slice(2);
  const period = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return m === '00' ? `${h}:00 ${period}` : `${h}:${m} ${period}`;
}

function buildHoursMap(periods) {
  const map = {};
  for (const key of DAY_KEYS) map[key] = 'Closed';

  for (const period of periods) {
    const dayKey = DAY_KEYS[period.open.day];
    const open = formatTime(period.open.time);
    const close = formatTime(period.close.time);
    const range = `${open} – ${close}`;
    if (map[dayKey] === 'Closed') {
      map[dayKey] = range;
    } else {
      map[dayKey] += `, ${range}`;
    }
  }
  return map;
}

function isOpenNow(hoursText, nowMinutes) {
  if (!hoursText || hoursText.toLowerCase() === 'closed') return false;
  for (const range of hoursText.split(',').map(s => s.trim())) {
    const parts = range.split('–').map(s => s.trim());
    if (parts.length !== 2) continue;
    const toMins = t => {
      const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!m) return null;
      let h = parseInt(m[1]);
      const min = parseInt(m[2]);
      const p = m[3].toUpperCase();
      if (p === 'AM' && h === 12) h = 0;
      if (p === 'PM' && h !== 12) h += 12;
      return h * 60 + min;
    };
    const start = toMins(parts[0]);
    const end = toMins(parts[1]);
    if (start !== null && end !== null && nowMinutes >= start && nowMinutes < end) return true;
  }
  return false;
}

async function main() {
  if (!API_KEY || !PLACE_ID) {
    throw new Error('Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID environment variables');
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,opening_hours&key=${API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'OK') {
    throw new Error(`Google Places API error: ${json.status} - ${json.error_message || ''}`);
  }

  const place = json.result;
  const periods = place.opening_hours?.periods || [];
  const hoursMap = buildHoursMap(periods);

  // Get current Toronto time
  const now = new Date();
  const torontoParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).formatToParts(now);

  const todayName = torontoParts.find(p => p.type === 'weekday').value;
  const todayKey = todayName.toLowerCase();
  const hour = parseInt(torontoParts.find(p => p.type === 'hour').value);
  const minute = parseInt(torontoParts.find(p => p.type === 'minute').value);
  const period = torontoParts.find(p => p.type === 'dayPeriod').value.toUpperCase();
  let h = hour;
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  const nowMinutes = h * 60 + minute;

  const todayHours = hoursMap[todayKey] || 'Closed';
  const open = isOpenNow(todayHours, nowMinutes);

  const data = {
    clinic_name: place.name || 'EAST GWILLIMBURY MEDICAL CENTRE',
    status: open ? 'open' : 'closed',
    today_name: todayName,
    today_hours: todayHours,
    ...hoursMap
  };

  fs.writeFileSync('clinic-hours-sensecraft.json', JSON.stringify(data, null, 2));
  console.log('Updated clinic-hours-sensecraft.json');
  console.log(`Today: ${todayName} | Hours: ${todayHours} | Status: ${data.status}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
