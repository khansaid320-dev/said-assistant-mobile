# Said Assistant – mobilpublicering för GitHub Pages

## Vilken mapp ska användas?

När du vill publicera assistenten på GitHub Pages ska du använda **endast innehållet i den här mappen `MOBILE_PUBLISH`**. Filerna `index.html`, `app.js`, `app.css`, `manifest.webmanifest`, ikonerna, `.nojekyll` och `404.html` ska ligga direkt i den publicerade roten på `main`-branchen.

Lägg inte upp hela den stora Python-projektmappen som GitHub Pages-rot. Den stora projektmappen innehåller backend-, Python-, dokumentations- och äldre webbversioner, medan `MOBILE_PUBLISH` är den färdiga fristående mobilklienten.

## Funktioner i mobilklienten

Den lokala klienten innehåller assistentchatt, svensk/engelsk språkväxling, lokalt sparade chattar, profil, CV, CV-analys, CV-nedladdning, PDF-skapande, personligt brev, dokumentläsning, lokal textredigering, bild/OCR-stöd när biblioteket kan laddas, textuppläsning, röstinmatning när Safari ger behörighet, jobbfiltrering via JobTech och enklare rese-, karta-, kalkylator-, minnes- och påminnelsefunktioner.

Vissa funktioner är beroende av Safari-behörigheter eller externa webbservrar. Exempel är mikrofon, uppläsning, OCR-bibliotek, PDF/DOCX-bibliotek, jobbdata, kartdata och externa sökningar. Om en extern källa inte svarar ska den lokala delen av appen fortfarande kunna öppnas och användas.

## Safari-säkerhet

Starten använder inte längre automatisk URL-omdirigering, meta-refresh eller tvingad omladdning. Gamla service workers och cacheposter rensas i bakgrunden utan att sidan byter adress under uppstarten. Detta minskar risken för att Safari fastnar på en halvöppen sida.

Profilen startar tom i en ny webbläsare. Personnummer och födelsedatum ligger inte längre hårdkodade i den publika HTML-filen. När användaren själv fyller i profilen sparas uppgifterna endast lokalt i webbläsaren.

## Publiceringssteg

1. Öppna GitHub-repositoryt `said-assistant-mobile`.
2. Öppna den branch och mapp som GitHub Pages använder.
3. Ladda upp **innehållet** i `MOBILE_PUBLISH`, inte mappen som en extra undermapp.
4. Vänta tills GitHub Pages visar att publiceringen är klar.
5. Öppna den vanliga länken: `https://khansaid320-dev.github.io/said-assistant-mobile/`.
6. Om Safari fortfarande visar gammal kod, radera webbplatsdata för `khansaid320-dev.github.io` och öppna länken igen.
