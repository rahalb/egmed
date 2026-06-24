const fs = require('fs');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

if (!API_KEY) throw new Error('Missing GOOGLE_MAPS_API_KEY');
if (!PLACE_ID) throw new Error('Missing GOOGLE_PLACE_ID');

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function hhmmToDisplay(hhmm) {
  const hh = parseInt(hhmm.slice(0, 2), 10);
  const mm = hhmm.slice(2);
  const ampm = hh >= 12 ? 'PM' : 'AM';
  let hour = hh % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${mm} ${ampm}`;
}

function buildWeeklyHours(periods) {
  const weekly = {
    monday: 'Closed',
    tuesday: 'Closed',
    wednesday: 'Closed',
    thursday: 'Closed',
    friday: 'Closed',
    saturday: 'Closed',
    sunday: 'Closed'
  };

  const grouped = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
  };

  for (const period of periods || []) {
    if (!period.open || !period.close) continue;

    const openDay = DAY_NAMES[period.open.day];
    const openTime = hhmmToDisplay(period.open.time);
    const closeTime = hhmmToDisplay(period.close.time);

    grouped[openDay].push(`${openTime} – ${closeTime}`);
  }

  for (const day of Object.keys(grouped)) {
    if (grouped[day].length > 0) {
      weekly[day] = grouped[day].join(', ');
    }
  }

  return weekly;
}

async function main() {
  const url =
    'https://maps.googleapis.com/maps/api/place/details/json' +
    `?place_id=${encodeURIComponent(PLACE_ID)}` +
    '&fields=name,formatted_address,opening_hours,current_opening_hours' +
    `&key=${encodeURIComponent(API_KEY)}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'OK' || !json.result) {
    throw new Error(`Google Places error: ${json.status} ${json.error_message || ''}`);
  }

  const place = json.result;
  const hoursData = place.current_opening_hours || place.opening_hours || {};
  const weekly = buildWeeklyHours(hoursData.periods || []);

  const now = new Date();
  const todayName = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'America/Toronto'
  }).format(now);

  const todayKey = todayName.toLowerCase();

  const output = {
    clinic_name: place.name || 'East Gwillimbury Medical Centre',
    address: place.formatted_address || '',
    status: hoursData.open_now ? 'open' : 'closed',
    today_name: todayName,
    today_hours: weekly[todayKey] || 'Closed',
    monday: weekly.monday,
    tuesday: weekly.tuesday,
    wednesday: weekly.wednesday,
    thursday: weekly.thursday,
    friday: weekly.friday,
    saturday: weekly.saturday,
    sunday: weekly.sunday,
    updated_at: new Date().toISOString(),
    source: 'google_places_api'
  };

  fs.writeFileSync('clinic-hours-sensecraft.json', JSON.stringify(output, null, 2) + '\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
