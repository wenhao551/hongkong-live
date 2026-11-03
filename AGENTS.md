# Hong Kong Live

An English-language personal dashboard for Hong Kong weather and Island Line service information. Use plain static files with no build step.

## Project structure

- `index.html`: the dashboard page with inline CSS and three live cards: Weather, Transport (Sai Ying Pun), and Air Quality (Central/Western).
- `SPEC.md`: feature requirements, scope, and acceptance criteria. Read it before implementing changes.
- `AI_LOG.md`: the record of AI assistance for this course.
- `hello.html`: a separate introductory exercise, not the dashboard.
- `app.js`: independent data fetching, exact station selection, rendering, refresh, and error handling for all three cards.
- `style.css`: not created; styling currently remains inline in `index.html`.

## Rules

- Use plain HTML, CSS, and vanilla JavaScript only. Do not add frameworks, bundlers, or npm packages.
- Keep the project usable as static files served by Live Server or a local HTTP server, with no build step.
- Use two-space indentation and `const` or `let`, never `var`.
- Keep the interface in English. Preserve the Hong Kong Live title, author details, and existing blue-and-yellow colour scheme.
- Implement the scope in `SPEC.md`; do not add extra features or change unrelated files.
- Never invent readings, forecasts, or service status. Match the weather station by exact name, not array position.

## Data sources

- Current weather: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en
- Select the entry in `temperature.data` whose `place` is exactly `Hong Kong Observatory`. Use its `value` and `unit`, and the response's `updateTime`.
- Local weather forecast, as specified in `SPEC.md`: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en
- Air quality: https://dashboard.data.gov.hk/api/aqhi-individual?format=json. Select exactly Central/Western, not Central.
- MTR next trains: https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=SYP. The user authorised these Session 3 sources and Sai Ying Pun on 2026-11-03. Do not assume a train-arrival feed proves normal service.
- Ask me before adding or changing a data source URL.
- Credit the Government of the Hong Kong SAR and DATA.GOV.HK for the reused weather data.

## Error handling

- Wrap every fetch in `try/catch`, check the HTTP response, and validate the required data before displaying it.
- Show loading and readable failure messages inside the affected card. Keep cards independent.
- If the chosen station or its value is missing, show `Temperature unavailable`; do not substitute another station.
- Never interpret unavailable transport data as normal service. Show Train arrivals unavailable for failures and No upcoming trains for empty direction lists.
- If a failed refresh leaves old readings visible, label them as potentially outdated and retain their source timestamp.
- Display times in Hong Kong time and distinguish source update time from the time the dashboard checked for data.

## When you are unsure

- Read existing project files first; do not ask me questions those files already answer.
- If my request conflicts with `SPEC.md` or these rules, explain the conflict and ask which requirement I want.
- For Worksheet 2 Task D, read `SPEC.md` and `AGENTS.md`, inspect the real weather data, and show me a numbered implementation plan before writing any code. Wait for me to review the plan and respond before implementing the weather card.
