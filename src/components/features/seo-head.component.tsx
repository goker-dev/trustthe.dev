export default function JsonLdAuthor() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Echoneo 0-12',
    creator: {
      '@type': 'Person',
      name: 'Goker Cebeci',
      url: 'https://www.goker.art/goker',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
