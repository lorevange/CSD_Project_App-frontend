# Documentazione del Progetto MedCare

## 1. Panoramica del Progetto
Il progetto **"MedCare"** è un'applicazione frontend costruita con **React**. È progettata per essere una piattaforma di prenotazione medica (simile a MioDottore), con funzionalità per la ricerca di dottori, visualizzazione profili, login e registrazione.

## 2. Struttura del Codice
Ecco come è organizzato il codice nella cartella \`src\`:

*   **\`index.js\`**: È il punto di ingresso ("entry point") dell'applicazione.
    *   Inizializza React.
    *   Configura il **ThemeContext** (per il tema chiaro/scuro).
    *   Carica le configurazioni di lingua (\`i18n\`).
    *   Monta il componente principale \`App\` nel DOM.
*   **\`App.js\`**: È il componente principale che gestisce il **Routing** (la navigazione tra le pagine). Definisce le seguenti rotte:
    *   \`. /\`: Home page (\`Home\`)
    *   \`/search\`: Risultati di ricerca (\`SearchResults\`)
    *   \`/doctor/:id\`: Profilo dettagliato del dottore (\`DoctorProfile\`)
    *   \`/login\`: Pagina di accesso (\`Login\`)
    *   \`/register\`: Pagina di registrazione (\`Register\`)
*   **\`context/ThemeContext.js\`**: Gestisce il tema dell'app (Light/Dark). Salva la preferenza dell'utente nel \`localStorage\` del browser così la scelta rimane anche se si ricarica la pagina.
*   **\`i18n.js\`**: Gestisce le traduzioni. Supporta **Italiano (it)** e **Inglese (en)**, con l'italiano impostato come lingua predefinita.
*   **\`locales/\`**: Contiene i file JSON con le traduzioni (\`it.json\`, \`en.json\`).
*   **\`pages/\`**: Contiene i componenti che rappresentano le intere pagine (Home, Login, ecc.).
*   **\`components/\`**: Contiene i componenti riutilizzabili dell'interfaccia utente (es. Header, Footer, Card del dottore, Modali).

## 3. Istruzioni per l'Avvio (Prima Volta)

Per chi deve avviare il progetto per la prima volta, ecco i passaggi da seguire:

### Prerequisiti
Assicurati di avere installato **Node.js** sul tuo computer. Puoi verificarlo aprendo un terminale e digitando \`node -v\`.

### Passaggi
1.  **Apri il terminale** nella cartella del progetto (\`CSD_Project_App-frontend\`).
2.  **Installa le dipendenze**:
    Esegui questo comando per scaricare tutte le librerie necessarie (elencate nel file \`package.json\`):
    \`\`\`bash
    npm install
    \`\`\`
    *(Se la cartella \`node_modules\` esiste già, questo passaggio potrebbe essere facoltativo, ma è consigliato farlo per sicurezza).*

3.  **Avvia l'applicazione**:
    Esegui il comando per far partire il server di sviluppo locale:
    \`\`\`bash
    npm start
    \`\`\`

4.  **Accedi all'app**:
    Una volta completato l'avvio, il browser dovrebbe aprirsi automaticamente all'indirizzo:
    [http://localhost:3000](http://localhost:3000)

### Comandi Utili
*   **\`npm start\`**: Avvia l'app in modalità sviluppo.
*   **\`npm run build\`**: Crea la versione ottimizzata per la produzione (nella cartella \`build\`).
*   **\`npm test\`**: Esegue i test automatizzati.
