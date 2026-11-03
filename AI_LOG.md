# AI Use Log

**Name:** Wenhao Zhu  
**Programme:** General Stream EEE MSc  
**Project:** Hong Kong Live  
**AI tool:** Codex

## 2026-11-03 - Session 3

| What I asked AI to do | What I received | What I clarified, corrected, or rejected |
| --- | --- | --- |
| Implement both worksheet cards directly, using Sai Ying Pun for transport. | Central/Western AQHI and health risk, and Island Line Sai Ying Pun next-train minutes and destinations for both directions. Each card has independent loading, refresh, timestamps in Hong Kong time, and failure/no-train messages. SPEC.md and AGENTS.md were updated to reflect this authorised Session 3 scope. | I changed the worksheet's HKU station to Sai Ying Pun (SYP). I explicitly requested air quality despite its exclusion in the older specification. AI chose to show both directions. |
| Validate the new cards as part of implementation. | Headless Chrome retrieved both real APIs successfully. Checks passed for exact/reordered station selection, AQHI 10+, numeric minutes including zero, Hong Kong timestamps, empty direction lists, invalid business status/data, independent failures, offline/HTTP/JSON errors, manual refresh recovery, mobile overflow, and no uncaught JavaScript errors. | The existing HKO weather request failed during the first live browser check and displayed its existing unavailable message; the two new cards still loaded. Desktop and mobile screenshots were inspected. Test script: tmp/cards-check/check-cards.cjs in the parent workspace. |

## 2026-10-20 - Session 1

| What I asked AI to do | What I received | What I clarified, corrected, or rejected |
| --- | --- | --- |
| Build hongkong-live/index.html with a large Hong Kong Live heading, my name and programme, one dashboard description sentence, and three empty cards labelled Weather, Transport, and Air Quality. | A single HTML file with embedded CSS, a green colour scheme, and a layout that adapts to smaller screens. | My name and programme were initially placeholders because I had not provided them. |
| Set my name to Wenhao Zhu and my programme to General Stream EEE MSc. | AI replaced the name and programme placeholders with my details. | I supplied the personal details for the page. |
| Change the background to Golden State Warriors blue and the text to Golden State Warriors yellow. | Blue backgrounds (#1D428A), yellow text (#FFC72C), and matching yellow card borders. | I chose the blue-and-yellow colour scheme myself. AI also changed the card borders to match. No further correction or rejection was requested. |

## 2026-10-27 - Session 2

| What I asked AI to do | What I received | What I clarified, corrected, or rejected |
| --- | --- | --- |
| Add a weather thing to the Hong Kong Live page. | Live Weather card content using Hong Kong Observatory current weather and local forecast APIs: temperature, humidity, hourly rainfall, UV, weather icon, forecast text, and update time. | I asked for weather on the page. AI chose the Observatory APIs and the fields shown in the card. |
| Interview me before writing the specification, ask one numbered question at a time in Chinese, and wait until I say WRITE THE SPEC. | A step-by-step requirements interview covering users, daily use, weather, transport, optional content, device, and language. | I asked AI to check the existing project context first and stopped the recommended answers. I clarified that the dashboard is mainly for me, possibly for others, and used after waking up or before going out. I chose desktop first and English page content. |
| Define the weather and transport information I need. | Requirements for current temperature, rain timing for the rest of today, and Island Line service status and delay messages. | I supplied the HKO rhrread API URL and specified the Hong Kong Observatory station, Celsius, and data update time. I wanted rain information for Hong Kong Island through the rest of today. I removed NBA and air quality, and limited transport to the Island Line rather than road incidents or closures. |
| WRITE THE SPEC in English. | An English Version 1 specification covering layout, data sources, weather, Island Line status, loading and error states, exclusions, and acceptance criteria. AI checked official HKO and MTR sources and explained the two-hour limit of the rainfall nowcast. | I set the product scope through the interview. AI proposed five-minute refreshes, a manual Refresh button, and fallback messages; these were AI-proposed details rather than requirements I had explicitly selected. The specification left verification of the machine-readable MTR status source for implementation. |
| Save the specification as SPEC.md in my project folder and add a section called Acceptance criteria. | hongkong-live/SPEC.md containing the English specification and a dedicated Acceptance criteria section. | I explicitly requested the file and section name. This step saved the specification; it did not implement the dashboard features. |
| Create AGENTS.md following Worksheet 2 Task C and ask me about uncertain choices while drafting it. | A project-specific rules file with the five required sections, existing data sources, code style, and error handling. | I clarified that asking questions referred to drafting the rules. I chose Task D's plan-review process before weather-card implementation. |
| Show a numbered Chinese plan for the weather card, then continue after my confirmation. | A local server on port 5500, Weather card markup in index.html, and app.js fetching the HKO rhrread feed, displaying Celsius and Hong Kong update time, and handling failures. | I emphasised that station order is not fixed and required matching Hong Kong Observatory by name. AI initially advanced faster than I wanted; I requested a step-by-step walkthrough, pasted real temperature data, and reviewed and confirmed the plan again. This stage covers the basic Task D card; forecast and Island Line features remain for later. |
| Verify the implemented weather card. | Browser checks retrieved live HKO weather and passed tests for reordered station lists, zero degrees, missing/invalid data, request failure, recovery, and mobile layout. | AI simulated network failures in browser tests. I then checked the page myself and confirmed that it displayed weather while online and showed Temperature unavailable when offline. Recovery after physically reconnecting and reloading has not yet been confirmed in this chat. |
