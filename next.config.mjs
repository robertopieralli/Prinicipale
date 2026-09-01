/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'video.wixstatic.com' },
    ],
  },

  /**
   * Il sito Wix è indicizzato da anni con questi percorsi. Reindirizzarli in
   * modo permanente evita di buttare via il posizionamento acquisito e di
   * lasciare 404 nei link condivisi su Facebook e nelle mail della segreteria.
   */
  async redirects() {
    return [
      { source: '/blog', destination: '/notizie', permanent: true },
      { source: '/blog/categories/:slug', destination: '/notizie', permanent: true },
      { source: '/post/:slug', destination: '/notizie/:slug', permanent: true },
      { source: '/settori-associativi', destination: '/settori', permanent: true },
      { source: '/service-page/consulenza-legale', destination: '/servizi/consulenza-legale', permanent: true },
      { source: '/service-page/consulenza-fiscale-commercialista', destination: '/servizi/consulenza-fiscale', permanent: true },
      { source: '/service-page/consulenza-patrimoniale', destination: '/servizi/consulenza-patrimoniale', permanent: true },
      { source: '/service-page/consulenza-assicurativa', destination: '/servizi/consulenza-assicurativa', permanent: true },
      { source: '/service-page/consulenza-generale', destination: '/servizi/consulenza-generale', permanent: true },
      { source: '/service-page/credit4doc-agos-enpam', destination: '/servizi/credit4doc', permanent: true },
      { source: '/service-page/:slug', destination: '/servizi', permanent: true },
      { source: '/pricing-plans/list', destination: '/iscriviti', permanent: true },
      { source: '/plans-pricing', destination: '/iscriviti', permanent: true },
      { source: '/contact-us', destination: '/contatti', permanent: true },
      { source: '/member-of-the-union', destination: '/area-soci', permanent: true },
      { source: '/thank-you-registration', destination: '/area-soci', permanent: true },
      { source: '/account/my-account', destination: '/area-soci', permanent: true },
      { source: '/gruppi', destination: '/settori', permanent: true },
      { source: '/documenti', destination: '/area-soci/documenti', permanent: true },
    ];
  },
};

export default nextConfig;
