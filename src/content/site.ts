export const site = {
  name: 'SNAMI Bologna',
  legalName: 'S.N.A.M.I. — Sezione Provinciale di Bologna',
  extendedName: 'Sindacato Nazionale Autonomo Medici Italiani',
  tagline: 'La voce dei medici autonomi a Bologna',
  claim:
    'Rappresentanza, tutela e assistenza per i medici convenzionati e dipendenti della provincia di Bologna.',
  address: 'Via del Tappezziere 4, 40138 Bologna (BO)',
  /* Lockup provinciale del design system: 1800×1016, scuro su trasparente.
     Non esiste una versione in negativo, quindi sul tema scuro va posato su
     una placca chiara invece di essere invertito. */
  logo: {
    src: 'https://static.wixstatic.com/media/c87410_4bb8e951a46747cf9d071a4b9815df19~mv2.png',
    width: 1800,
    height: 1016,
    alt: 'SNAMI — Sezione Provinciale di Bologna',
  },
  taxCode: '92031260372',
  email: 'info@snami.bologna.it',
  pec: 'info@snami.bologna.it',
  social: {
    facebook: 'https://www.facebook.com/snami.bologna',
    linkedin: 'https://it.linkedin.com/company/snamibologna',
  },
  related: [
    { label: 'SNAMI Nazionale', href: 'https://www.snami.org/' },
    { label: 'SNAMI Emilia-Romagna', href: 'https://www.snami.emilia-romagna.it/' },
  ],
} as const;

export const navigation = [
  { label: 'Notizie', href: '/notizie' },
  { label: 'Settori', href: '/settori' },
  { label: 'Servizi', href: '/servizi' },
  { label: 'Iscriviti', href: '/iscriviti' },
  { label: 'Videoteca', href: '/videoteca' },
  { label: 'Contatti', href: '/contatti' },
] as const;

export type Sector = {
  slug: string;
  name: string;
  short: string;
  description: string;
  /** Slug della categoria del blog da cui pescare le notizie del settore. */
  categorySlug: string | null;
};

/**
 * Gli otto settori associativi dello SNAMI, nell'ordine in cui pesano sulla
 * base associativa bolognese.
 */
export const sectors: Sector[] = [
  {
    slug: 'assistenza-primaria',
    name: 'Assistenza Primaria',
    short: 'Medici di famiglia e ruolo unico a ciclo di scelta',
    description:
      "Il settore raccoglie i medici di medicina generale con incarico a ciclo di scelta. Seguiamo l'applicazione dell'ACN e degli accordi integrativi regionali e aziendali, le zone carenti, i rapporti con l'AUSL e tutto ciò che incide sull'organizzazione quotidiana dello studio.",
    categorySlug: 'assistenza-primaria',
  },
  {
    slug: 'continuita-assistenziale',
    name: 'Continuità Assistenziale',
    short: 'Ex guardia medica e ruolo unico ad attività oraria',
    description:
      "Turni, sicurezza delle sedi, formazione retribuita, riconoscimento delle ore: sono i temi su cui la sezione di Bologna ha ottenuto risultati concreti, dallo sblocco dei pagamenti della formazione alla revisione delle istruzioni operative aziendali.",
    categorySlug: 'continuita-assistenziale',
  },
  {
    slug: 'emergenza-territoriale',
    name: 'Emergenza Territoriale',
    short: 'Medici del 118 e dei mezzi di soccorso avanzato',
    description:
      "Difendiamo la medicalizzazione dei mezzi di soccorso avanzato e il valore della competenza medica sul territorio. Sui corsi MET e sui ritardi regionali la sezione è intervenuta ripetutamente presso l'Assessorato alla Salute.",
    categorySlug: 'emergenza-territoriale',
  },
  {
    slug: 'pediatria-di-libera-scelta',
    name: 'Pediatria di Libera Scelta',
    short: 'Pediatri di famiglia convenzionati',
    description:
      "Assistiamo i pediatri di libera scelta sulle graduatorie regionali, sugli incarichi vacanti, sui massimali e sui rapporti con le aziende sanitarie, con la stessa attenzione riservata alla medicina generale.",
    categorySlug: 'pediatria-di-libera-scelta',
  },
  {
    slug: 'specialistica-ambulatoriale',
    name: 'Specialistica Ambulatoriale',
    short: 'Specialisti ambulatoriali interni e altre professionalità',
    description:
      "Specialisti ambulatoriali, veterinari, biologi, chimici e psicologi convenzionati: seguiamo le graduatorie annuali, l'attribuzione delle ore e l'applicazione dell'ACN di settore.",
    categorySlug: 'specialistica-ambulatoriale',
  },
  {
    slug: 'medicina-dei-servizi',
    name: 'Medicina dei Servizi',
    short: 'Attività territoriali a rapporto orario',
    description:
      "Un settore spesso dimenticato dai tavoli negoziali, che raccoglie i medici impegnati nelle attività territoriali a rapporto orario. Lo presidiamo perché nessun incarico resti privo di rappresentanza.",
    categorySlug: 'medicina-dei-servizi',
  },
  {
    slug: 'medicina-penitenziaria',
    name: 'Medicina Penitenziaria',
    short: 'Medici negli istituti penitenziari',
    description:
      "Dedicato ai medici che operano negli istituti penitenziari in convenzione con il Servizio Sanitario Nazionale, in un contesto dove sicurezza sul lavoro e continuità delle cure richiedono tutele specifiche.",
    categorySlug: 'medicina-penitenziaria',
  },
  {
    slug: 'medici-in-formazione',
    name: 'Medici in Formazione',
    short: 'Corso triennale di medicina generale e neolaureati',
    description:
      "Accompagniamo chi frequenta il corso triennale di formazione specifica in medicina generale: borse di studio, numero dei posti banditi, compatibilità con altri incarichi e ingresso nella professione.",
    categorySlug: 'medici-in-formazione',
  },
  {
    slug: 'medici-dipendenti',
    name: 'Medici Dipendenti SSN',
    short: 'Dirigenza medica ospedaliera e territoriale',
    description:
      "La rappresentanza dei medici dipendenti del Servizio Sanitario Nazionale, dai carichi di lavoro all'applicazione del contratto della dirigenza sanitaria.",
    categorySlug: 'medici-dipendenti-ssn',
  },
  {
    slug: 'medici-fiscali',
    name: 'Medici Fiscali',
    short: 'Medici di controllo INPS',
    description:
      "Seguiamo i bandi per il conferimento degli incarichi di medicina fiscale e le condizioni di lavoro dei medici di controllo, dalla remunerazione alla sicurezza durante le visite domiciliari.",
    categorySlug: 'medici-fiscali',
  },
];

export type Service = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon: string;
};

/** Le consulenze incluse nella quota associativa. */
export const services: Service[] = [
  {
    slug: 'consulenza-legale',
    name: 'Consulenza legale',
    summary: 'Assistenza su contenzioso, responsabilità professionale e rapporto di convenzione.',
    description:
      "Un supporto specializzato sulle questioni giuridiche che riguardano la professione medica: responsabilità professionale, contenzioso con l'azienda sanitaria, procedimenti disciplinari, interpretazione dell'ACN e degli accordi integrativi. Gli iscritti accedono a un primo parere gratuito e a condizioni riservate per l'assistenza successiva.",
    icon: 'scale',
  },
  {
    slug: 'consulenza-fiscale',
    name: 'Consulenza fiscale',
    summary: 'Commercialista dedicato per regime fiscale, deduzioni e adempimenti.',
    description:
      "Il commercialista convenzionato aiuta a impostare correttamente il regime fiscale dello studio, a gestire deduzioni e ammortamenti, a pianificare gli adempimenti e a valutare la forma professionale più adatta, dalla singola convenzione alla medicina di gruppo.",
    icon: 'receipt',
  },
  {
    slug: 'consulenza-patrimoniale',
    name: 'Consulenza patrimoniale',
    summary: 'Pianificazione degli investimenti e protezione del patrimonio.',
    description:
      "Specialisti in gestione patrimoniale affiancano gli iscritti nella pianificazione degli investimenti, nella protezione del patrimonio familiare e professionale e nella costruzione di una posizione previdenziale integrativa coerente con la carriera medica.",
    icon: 'shield',
  },
  {
    slug: 'consulenza-assicurativa',
    name: 'Consulenza assicurativa',
    summary: 'Polizze RC professionale, tutela legale e inabilità temporanea.',
    description:
      "Analisi e confronto delle coperture assicurative pensate per il medico: responsabilità civile professionale, tutela legale, infortuni e polizze per i primi trenta giorni di inabilità temporanea, con le convenzioni riservate agli iscritti SNAMI.",
    icon: 'umbrella',
  },
  {
    slug: 'consulenza-generale',
    name: 'Consulenza sindacale',
    summary: 'Diritti, contratti e strategie sindacali per ogni settore.',
    description:
      "Gli iscritti possono richiedere assistenza su diritti dei lavoratori, contratti di lavoro, incarichi, graduatorie e strategie sindacali, con il supporto diretto dei delegati di settore della sezione provinciale.",
    icon: 'users',
  },
  {
    slug: 'credit4doc',
    name: 'Credit4Doc — AGOS ENPAM',
    summary: 'Credito agevolato riservato ai medici iscritti ENPAM.',
    description:
      "La convenzione Credit4Doc di AGOS in collaborazione con ENPAM mette a disposizione dei medici forme di credito a condizioni dedicate, utili per l'avvio dello studio, l'acquisto di attrezzature o la gestione della liquidità professionale.",
    icon: 'wallet',
  },
];

export const stats = [
  { value: '50+', label: 'anni di storia sindacale' },
  { value: '10', label: 'settori rappresentati' },
  { value: '6', label: 'consulenze incluse nella quota' },
  { value: '1', label: 'sola voce: quella dei medici' },
] as const;
