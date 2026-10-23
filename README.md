# Temă recapitulare – mini frontend

Proiect mic frontend (`index.html`, `style.css`, `app.js`) pentru un REST API, realizat cu ajutorul AI, specific Claude (adăugat în .gitignore, și vizibil drept folder .claude/).

- **API:** https://jsonplaceholder.typicode.com/posts (fake API, POST/DELETE sunt acceptate, dar nu salvate).
- **Live link:** (https://barzan-mark.github.io/recapitulare-ppw-tema/)
- **CORS:** API-ul trimite `Access-Control-Allow-Origin: *`, astfel încât browserul permite paginii să îl apeleze direct; nu este necesar nici proxy, nici backend. 
- **GET:** `/posts?_limit=10` la load. Se arată trei stări, "Se încarcă...", un mesaj de eroare, sau "Nu există postări." pentru o listă goală. 
- **POST:** JSON din form. `201` adaugă postarea în listă fără a efectua un re-fetching; `4xx/5xx` arată mesajele serverului, sau status code lângă formular; Eroarea de rețea arată o eroare generică.
- **DELETE:** `/posts/:id` printr-un click cu listener la listă. Obiectul este șters doar dacă primește `response.ok`; altfel primim o eroare.
- Layout-ul folosește și flex/grid, și un `@media` rule, verificată la 360px;

