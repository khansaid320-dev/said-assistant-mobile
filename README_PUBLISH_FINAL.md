# SAID ASSISTANT 3.0 — FINAL MOBILE PUBLISHER

## Detta är mappen som ska publiceras

Använd **MOBILE_PUBLISH** när du vill publicera den fristående mobilassistenten.

Den innehåller den färdiga webbappen:
- `index.html` — startsida
- `app.js` — hela assistentlogiken
- `app.css` — mobil/desktop-layout
- `manifest.webmanifest` — installerbar PWA
- `service-worker.js` — offline-cache
- ikoner

## Viktiga slutliga funktioner

- En enda tydlig chatt för text och tal.
- Jobbsökning från chatten stannar i assistenten; Google öppnas inte automatiskt.
- Aktuella jobb hämtas från Arbetsförmedlingens öppna JobSearch när internet finns.
- Sök jobb själv med yrke, valfritt område/hela Sverige, heltid/deltid och sortering.
- Rensa/Uppdatera börjar om jobbsökningen så att nya yrken kan sökas.
- Välj jobb, öppna annons, förbered CV, brev och ansökan.
- CV-matchning och lokal profil.
- Fullständig profil med förnamn, efternamn, personnummer, födelsedatum, ort och önskat jobb.
- Universella frågor: lokala svar för tid, datum, beräkningar och enheter samt öppna webbkällor när internet finns.
- Svar från webbkällor visas i chatten med källa/länk; ingen automatisk omdirigering till Google.
- Taligenkänning och uppläsning med endast tydliga `Pausa` och `Fortsätt` för pågående tal.
- Navigeringen täcker inte längre innehållet när du scrollar.
- Sparning sker lokalt i webbläsaren.
- Inga OpenAI-nycklar eller betalda AI-tjänster krävs.

## Publicering

Publicera hela **MOBILE_PUBLISH**-mappen som en vanlig statisk webbapp. Öppna sedan `index.html` via den publicerade adressen och lägg till appen på mobilen om du vill använda den som PWA.

För aktuella jobb och webbsvar krävs internet. Lokala funktioner fungerar även offline.


V13 FINAL UNIVERSAL/TRAVEL PATCH: natural-language travel routing, origin/destination extraction, walking/driving estimates, public-transit web lookup, stronger generic web fallback. Mobile Publisher includes universal-intelligence.js and transport-intelligence.js.

## V13 UNIVERSAL INTELLIGENCE FINAL PATCH

The final universal layer is conversational rather than command-dependent. It can
carry travel context across messages, for example:
- "Jag ska resa från Arlanda" → "Turkiet".
- "Hur länge tar det från Upplands Väsby till Arlanda med bil?".
- "Jag vill promenera från Uppsala till Rotterdam".
- "Jag ska åka från Uppsala till Stockholm" → shows walking, car and public-transit options when data is available.

For flight trips it asks for the missing departure/home details instead of treating
a country as a road destination. It never opens Google automatically; maps/search
links remain optional.

The universal web fallback now compares keyless results from more than one public search engine before showing an answer, reducing the chance that an unrelated search result is presented as the answer.


V13 FINAL: chat history is persistent across app restarts using local browser storage with an IndexedDB mirror. Chats remain available until the user explicitly deletes them.
