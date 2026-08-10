import type { MetadataRoute } from 'next'

/**
 * Web app manifest — díky němu jde aplikaci na telefonu přidat na plochu
 * a spustit na celou obrazovku bez adresního řádku prohlížeče.
 *
 * `display: 'standalone'` je záměrný: hlavní tok je focení dlaně, kde
 * adresní řádek jen ubírá výšku náhledu z kamery.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Čtení z dlaně — Palmistika',
    short_name: 'Čtení z dlaně',
    description:
      'Vyfoťte dlaň a čtení se sestaví z toho, co se na fotce rozpozná. Výklad podle klasických palmistických pramenů.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#faf8f3',
    theme_color: '#7f5620',
    lang: 'cs',
    categories: ['lifestyle', 'entertainment'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        // Android si ikonu ořezává do vlastního tvaru — maskable varianta
        // má obsah zmenšený do bezpečné zóny, aby se neuřízly prsty.
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
