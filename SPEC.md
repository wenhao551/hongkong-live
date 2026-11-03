# Hong Kong Live — Session 3 Specification

Session 3 update (2026-11-03): the user explicitly requested the worksheet's Air Quality and next-train cards, with Sai Ying Pun (SYP) replacing HKU. These requirements supersede the previous exclusion of air quality and the service-status transport scope. Rain forecasting remains deferred; this change implements the two new cards alongside the existing current-temperature card.

Hong Kong Live is an English-language desktop dashboard for checking weather and MTR information after waking up or before leaving home. It is primarily for personal use and may also be shared with others.

The current dashboard answers: What is the temperature? What is the Central/Western AQHI and health risk? When are the next Island Line trains at Sai Ying Pun?

## Page layout and appearance

Retain the existing “Hong Kong Live” title, author details, and Golden State Warriors blue-and-yellow colour scheme. Display three cards: Weather, Transport, and Air Quality. Prioritise readability on a desktop screen, with cards stacking on smaller screens.

## Current temperature

Use the [specified Hong Kong Observatory API](https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en).

Find the entry in `temperature.data` whose `place` equals `Hong Kong Observatory`. Display its `value` in degrees Celsius, labelled with the station name. Display the response’s `updateTime` as “Data updated,” formatted in Hong Kong time.

Do not substitute another station if this entry is missing. Show “Temperature unavailable” instead. The current temperature is sufficient; an hourly temperature forecast is outside this version’s scope.

## Rain during the rest of today (deferred)

Display a concise English forecast explaining when rain is expected between the current time and midnight in Hong Kong, prioritising Hong Kong Island where location-specific data is available.

Use the HKO [local weather forecast](https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en) for the broader forecast period. Preserve the timing and uncertainty expressed by the source. If the forecast covers all Hong Kong, label that coverage clearly.

For more precise near-term timing, use HKO’s location-specific rainfall nowcast where practical. This dataset provides half-hourly forecasts for only the next two hours; it cannot supply precise rainfall timing for the entire remaining day. Beyond that window, use the broader forecast wording. Never invent an exact rain-start time. [HKO rainfall nowcast dataset](https://data.gov.hk/en-data/dataset/hk-hko-rss-gridded-rainfall-nowcast-in-hong-kong)

If timing is unspecified, show “Rain timing is not specified in the latest forecast.” Observed past rainfall must not be presented as a forecast.

## Air quality

Use https://dashboard.data.gov.hk/api/aqhi-individual?format=json. Match `station === 'Central/Western'` exactly; `Central` is a separate station. Display the source station name, AQHI (including `10+` when supplied), health risk, source publish time, and last-checked time in Hong Kong time.

## Island Line next trains

Use https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=SYP. Label the station Sai Ying Pun (SYP). Check numeric `status === 1` before reading `data['ISL-SYP']`. Display the next valid train in each direction, converting text `ttnt` to a non-negative integer without adding 1. Translate CHW/KET into Chai Wan/Kennedy Town; label any other destination explicitly as a station code. Empty direction arrays mean no upcoming trains. Missing/invalid data or status 0 must show an unavailable message. Show the source update time and last-checked time in Hong Kong time. Train arrival data does not establish normal service.

Credit MTR, the Environmental Protection Department, the Government of the Hong Kong SAR, and DATA.GOV.HK as applicable.

## Loading, refresh, and errors

Proposed defaults: fetch data when the page opens, refresh every five minutes while visible, and provide a “Refresh” button.

Each card should load independently. A failed transport request must not hide weather information. Show a clear loading state and a readable error message. If previously retrieved information remains visible after a failed refresh, mark it as potentially outdated and retain its timestamp.

Distinguish source update times from the time the dashboard last checked for data. Use Hong Kong time throughout.

## Scope exclusions

Exclude NBA, general news, road incidents, other MTR lines, route planning, accounts, push notifications, and service-status classification based on arrival data.

## Acceptance criteria

- The page displays English content and remains readable on desktop.
- Temperature matches the API’s **Hong Kong Observatory** station entry and includes °C and the source update time.
- Air quality displays exactly Central/Western, its AQHI, health risk, and source publish time.
- Transport concerns Island Line Sai Ying Pun, displaying whole-number minutes and destinations for both directions, or a clear no-upcoming-trains message.
- Loading, unavailable data, and failed refreshes produce clear states without misleading values.
- NBA content is absent. Rain forecasting remains deferred.
