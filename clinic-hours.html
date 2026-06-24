<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=800, initial-scale=1">
  <title>Clinic Hours Source</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #111111;
      --muted: #6f6a64;
      --line: #c8c1b8;
      --panel: #ffffff;
    }

    html, body {
      margin: 0;
      width: 800px;
      height: 480px;
      background: var(--bg);
      overflow: hidden;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--text);
    }

    * {
      box-sizing: border-box;
    }

    .page {
      width: 800px;
      height: 480px;
      background: var(--bg);
      padding: 22px 24px 18px 24px;
    }

    .title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.2px;
      margin-bottom: 10px;
    }

    .rule {
      border-top: 2px solid var(--line);
      margin: 0 0 12px 0;
    }

    .today {
      display: grid;
      grid-template-columns: 150px 1fr;
      column-gap: 18px;
      align-items: center;
      margin-bottom: 10px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
      height: 54px;
      padding: 0 18px;
      border-radius: 28px;
      background: #000000;
      color: #ffffff;
      font-size: 18px;
      font-weight: 800;
      text-transform: uppercase;
    }

    .today-label {
      color: var(--muted);
      font-size: 17px;
      margin-bottom: 2px;
      text-transform: uppercase;
    }

    .today-day {
      font-size: 28px;
      font-weight: 800;
      line-height: 1.05;
      margin-bottom: 4px;
    }

    .today-hours {
      font-size: 23px;
      font-weight: 700;
      line-height: 1.1;
    }

    .section-label {
      color: var(--muted);
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 10px 0 8px 0;
    }

    .week {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 34px;
    }

    .day-row {
      display: grid;
      grid-template-columns: 70px 1fr;
      align-items: start;
      padding: 7px 0 6px 0;
      border-bottom: 2px solid var(--line);
      min-height: 39px;
    }

    .day-name {
      font-size: 18px;
      font-weight: 800;
      text-transform: uppercase;
    }

    .day-hours {
      font-size: 17px;
      font-weight: 500;
      line-height: 1.05;
    }

    .closed {
      color: var(--muted);
      font-style: italic;
      font-weight: 700;
    }

    .loading,
    .error {
      font-size: 22px;
      font-weight: 700;
      padding-top: 40px;
    }
  </style>
</head>
<body>
  <div class="page" id="page">
    <div class="loading" id="loading">Loading clinic hours…</div>
  </div>

  <script>
    const dayOrder = [
      ['monday', 'MON'],
      ['tuesday', 'TUE'],
      ['wednesday', 'WED'],
      ['thursday', 'THU'],
      ['friday', 'FRI'],
      ['saturday', 'SAT'],
      ['sunday', 'SUN']
    ];

    function render(data) {
      const page = document.getElementById('page');
      const statusText = (data.status || 'closed').toUpperCase();
      const statusClass = (data.status || 'closed').toLowerCase() === 'open' ? 'OPEN' : 'CLOSED';

      const leftDays = dayOrder.slice(0, 3);
      const rightDays = dayOrder.slice(3);

      const buildRows = (days) => days.map(([key, label]) => {
        const value = data[key] || 'Closed';
        const isClosed = value.toLowerCase() === 'closed';
        return `
          <div class="day-row">
            <div class="day-name">${label}</div>
            <div class="day-hours ${isClosed ? 'closed' : ''}">${value}</div>
          </div>
        `;
      }).join('');

      page.innerHTML = `
        <div class="title">${data.clinic_name || 'EAST GWILLIMBURY MEDICAL CENTRE'}</div>
        <div class="rule"></div>

        <div class="today">
          <div>
            <div class="status-pill">${statusClass}</div>
          </div>
          <div>
            <div class="today-label">TODAY</div>
            <div class="today-day">${data.today_name || ''}</div>
            <div class="today-hours">${data.today_hours || 'Closed'}</div>
          </div>
        </div>

        <div class="rule"></div>
        <div class="section-label">WEEKLY HOURS</div>

        <div class="week">
          <div>${buildRows(leftDays)}</div>
          <div>${buildRows(rightDays)}</div>
        </div>
      `;
    }

    fetch('./clinic-hours-sensecraft.json?t=' + Date.now())
      .then(response => response.json())
      .then(data => render(data))
      .catch(() => {
        document.getElementById('page').innerHTML =
          '<div class="error">Unable to load clinic hours.</div>';
      });
  </script>
</body>
</html>
