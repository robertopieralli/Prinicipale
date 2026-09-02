# SNAMI Bologna — sito istituzionale

Nuovo sito della Sezione Provinciale di Bologna del Sindacato Nazionale Autonomo
Medici Italiani, in sostituzione del sito Wix Studio pubblicato su
[www.snami.bologna.it](https://www.snami.bologna.it).

Il frontend è un'applicazione Next.js indipendente; Wix resta il motore dei
contenuti. Blog, piani associativi, anagrafica soci e login continuano a vivere
dove sono sempre stati, quindi l'archivio storico e le trattenute AUSL non vanno
migrati e non si interrompono mai.

## Requisiti

- Node.js 20 o superiore
- Un account con accesso al sito Wix `SNAMI - Sezione Provinciale di Bologna`

## Avvio

```bash
npm install
cp .env.example .env.local   # e compila NEXT_PUBLIC_WIX_CLIENT_ID
npm run dev                  # http://localhost:3000
```

Comandi utili:

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Ambiente di sviluppo con ricarica automatica |
| `npm run build` | Build di produzione |
| `npm start` | Avvia la build di produzione |
| `npm run typecheck` | Controllo dei tipi |
| `npm test` | Verifica la normalizzazione delle categorie sui dati reali |

## Collegare Wix

Il sito parte anche senza credenziali: in quel caso le sezioni alimentate dal
CMS mostrano un avviso invece di restare bianche. Per collegarlo davvero serve
il **client ID** di un'app OAuth headless.

L'app è già stata creata sul sito con il nome **«Sito Next.js SNAMI Bologna»**.
Il client ID si legge dal dashboard Wix, in *Impostazioni → Headless Settings →
OAuth apps*, e va inserito in `.env.local`:

```
NEXT_PUBLIC_WIX_CLIENT_ID=<client id dell'app>
NEXT_PUBLIC_SITE_URL=https://www.snami.bologna.it
```

Nelle impostazioni dell'app sono già autorizzati questi URI di reindirizzamento:

- `http://localhost:3000/login/callback` (sviluppo)
- `https://www.snami.bologna.it/login/callback` (produzione)

Se il sito viene pubblicato su un dominio diverso — per esempio l'anteprima di
Vercel — l'URI corrispondente va aggiunto all'elenco, altrimenti il login viene
rifiutato.

> Il sito Wix deve restare **pubblicato**: la pagina di login usata dall'area
> soci è servita da Wix.

## Area soci

L'accesso usa la pagina di login Wix con flusso OAuth 2.0 e PKCE. Lo scambio del
codice avviene lato server (`/api/auth/callback`): i dati PKCE e i token del
socio stanno in cookie `httpOnly`, quindi il refresh token non è mai leggibile
dal JavaScript della pagina.

Percorsi coinvolti:

| Percorso | Ruolo |
| --- | --- |
| `/area-soci` | Login se anonimo, cruscotto se autenticato |
| `/area-soci/documenti` | Archivio riservato con ricerca e filtri |
| `/api/auth/login` | Avvia il flusso OAuth |
| `/login/callback` | Riceve il codice e lo consegna al server |
| `/api/auth/logout` | Chiude la sessione, anche lato Wix |

### Archivio documenti riservato

L'archivio legge la collection CMS `DocumentiRiservati`, **già creata sul sito**:
la segreteria carica i file dal pannello Wix che conosce già, in *CMS →
Documenti riservati*. La lettura è riservata ai membri autenticati, la scrittura
alla sola amministrazione.

Campi disponibili:

| Campo | Tipo | Note |
| --- | --- | --- |
| `titolo` | Testo | Titolo del documento |
| `descrizione` | Testo | Riga di sintesi, facoltativa |
| `categoria` | Testo | Es. «Accordi», «Circolari», «Modulistica» |
| `settore` | Testo | Settore associativo, facoltativo |
| `file` | Documento | Il PDF da scaricare |
| `data` | Data | Data del documento |

I valori di `categoria` e `settore` alimentano da soli i filtri dell'archivio:
non serve toccare il codice per aggiungere una nuova categoria, basta usarla in
un documento.

Il campo `file` restituisce un URI `wix:document://`, che viene tradotto
nell'URL di download reale prima di finire in pagina (`src/lib/wix/media.ts`,
coperto da `npm test`).

## Cosa cambia rispetto al sito Wix

- **Categorie del blog ripulite.** Su Wix le stesse categorie erano duplicate due
  o tre volte (`assistenza-primaria`, `-1`, `-2`), spezzando navigazione e
  posizionamento. Il modulo `src/lib/wix/categories.ts` le accorpa per etichetta,
  somma i contatori e genera slug ASCII stabili: 18 voci diventano 8 categorie
  reali. La cosa è coperta da `npm test`.
- **Piani residui nascosti.** I piani archiviati o privati rimasti pubblicati sul
  sito Wix («Plan 0», «plna») non compaiono più fra le quote.
- **URL in italiano, con i vecchi indirizzi reindirizzati.** `/blog`,
  `/post/...`, `/settori-associativi`, `/contact-us`, `/pricing-plans/list`,
  `/service-page/...` e `/member-of-the-union` rispondono con un redirect 301
  permanente verso i nuovi percorsi: i link condivisi su Facebook e nelle mail
  della segreteria continuano a funzionare e il posizionamento non si perde.
- **Area soci vera.** Non più solo un login, ma un archivio documentale con
  ricerca e filtri per categoria e settore.
- **Tema chiaro e scuro**, tipografia editoriale, navigazione accessibile da
  tastiera e `sitemap.xml` generata dall'archivio reale.

## Struttura

```
src/
├── app/                 Pagine e route handler (App Router)
│   ├── api/auth/        Login, callback e logout OAuth
│   ├── area-soci/       Area riservata e archivio documenti
│   ├── notizie/         Elenco e dettaglio degli articoli
│   ├── settori/         Settori associativi
│   └── servizi/         Consulenze incluse nella quota
├── components/          Header, footer, schede, renderer Ricos
├── content/site.ts      Testi istituzionali, settori, servizi, contatti
└── lib/wix/             Collegamento a Wix (core isomorfo + lato server)
```

I testi istituzionali stanno in `src/content/site.ts`: per correggere una
descrizione di settore o un recapito basta modificare quel file, senza toccare
le pagine.

## Pubblicazione

Il progetto è una normale applicazione Next.js e gira su qualunque hosting che
supporti Node.js. **Serve un host Node, non uno spazio statico:** l'area soci,
lo scambio dei token OAuth e la cache dei contenuti girano lato server.

Su Hostinger ci sono due strade, entrambe praticabili:

- **Hosting web con applicazione Node.js.** L'API Hostinger espone endpoint
  dedicati (deploy di applicazioni JavaScript, avvio della build, variabili
  d'ambiente, riavvio dell'applicazione) e riconosce i siti di tipo `nodejs`,
  quindi non serve per forza un VPS. È la via più semplice: la build viene
  eseguita da Hostinger e l'applicazione resta gestita dal pannello.
- **VPS.** Controllo completo: `npm ci`, `npm run build`, `npm start` dietro un
  reverse proxy, con il processo tenuto vivo da systemd o PM2.

Quale delle due sia disponibile dipende dal piano attivo sull'account: si
verifica elencando gli ordini e i siti dall'API.

I server MCP di Hostinger sono dichiarati in `.mcp.json` e leggono il token
dalla variabile `HOSTINGER_API_TOKEN`. Il token non va scritto nel file, che è
versionato: va messo in `.env.local` o esportato nella shell.

Variabili d'ambiente da impostare in produzione:

```
NEXT_PUBLIC_WIX_CLIENT_ID
NEXT_PUBLIC_SITE_URL
WIX_DOCUMENTS_COLLECTION   (facoltativa)
```

Prima di puntare il dominio sul nuovo sito, ricordarsi di aggiungere l'URI di
callback definitivo fra quelli autorizzati nell'app OAuth.
