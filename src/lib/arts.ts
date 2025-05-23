export const arts = {
  'prehistoric-art': 'Prehistoric Art',
  'ancient-egyptian-art': 'Ancient Egyptian Art',
  'ancient-greek-art': 'Ancient Greek Art',
  'ancient-roman-art': 'Ancient Roman Art',
  'byzantine-art': 'Byzantine Art',
  'romanesque-art': 'Romanesque Art',
  'gothic-art': 'Gothic Art',
  renaissance: 'Renaissance',
  mannerism: 'Mannerism',
  baroque: 'Baroque',
  rococo: 'Rococo',
  neoclassicism: 'Neoclassicism',
  romanticism: 'Romanticism',
  realism: 'Realism',
  impressionism: 'Impressionism',
  'post-impressionism': 'Post-Impressionism',
  fauvism: 'Fauvism',
  expressionism: 'Expressionism',
  cubism: 'Cubism',
  futurism: 'Futurism',
  dadaism: 'Dadaism',
  surrealism: 'Surrealism',
  'abstract-expressionism': 'Abstract Expressionism',
  'pop-art': 'Pop Art',
  minimalism: 'Minimalism',
  'conceptual-art': 'Conceptual Art',
  postmodernism: 'Postmodernism',
  'contemporary-art': 'Contemporary Art',
}

export const discordChannels = [
  '1360225875379093644',
  '1360226155214409828',
  '1360226197161775112',
  '1360226241361350848',
  '1360226300194717727',
  '1360226359498117260',
  '1360226404842868939',
  '1360226449029857321',
  '1360226490859651125',
  '1360226525143761017',
  '1360226567829192714',
  '1360226605162561577',
  '1360226636405932183',
  '1360226670300102726',
  '1360226701711376515',
  '1360226732254167130',
  '1360226767280803860',
  '1360226808192303174',
  '1360226838483566713',
  '1360226876026654812',
  '1360226916216475679',
  '1360226957194694770',
  '1360226986349301760',
  '1360227022034698381',
  '1360227077495980182',
  '1360227078968053922',
  '1360227201831665907',
  '1360227244467028068',
]

// Helper function to safely get movement name
// Adjust this based on the actual structure of your 'arts' object/map
export const getMovementName = (index: number): string => {
  const movements = Object.values(arts) // Convert map values to array
  return movements[index] ?? `Unknown Movement (${index})` // Handle out-of-bounds
}
