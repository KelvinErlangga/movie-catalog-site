// Fallback service jika Gemini API tidak bekerja
export const getFallbackRecommendations = (mood = 'umum') => {
  const allRecommendations = {
    action: [
      { title: "The Dark Knight", year: 2008, reason: "Film action klasik yang sangat direkomendasikan", id: "dark-knight", mood_match: "Cocok untuk mood action", similarity: "Action thriller terbaik", poster_path: "/qJ2tW6WMUDux911r6m7haRef0wG.jpg" },
      { title: "John Wick", year: 2014, reason: "Action thriller yang intens", id: "john-wick", mood_match: "Sempurna untuk mood action", similarity: "Martial arts epic", poster_path: "/vKl3lPHrWmZdZiO7OXGf60NKzcw.jpg" },
      { title: "The Raid 2", year: 2014, reason: "Martial arts action Indonesia", id: "the-raid-2", mood_match: "Action Indonesia terbaik", similarity: "Martial arts masterpiece", poster_path: "/eifGjODgW6jyZJ1p3eNyYuMJu46.jpg" },
      { title: "Mad Max: Fury Road", year: 2015, reason: "Post-apocalyptic action yang epik", id: "mad-max-fury", mood_match: "Action epik untuk mood kamu", similarity: "Visual spectacle yang menakjubkan", poster_path: "/hdfU2Xa7YFktLM6dGeTNk0bPDIy.jpg" },
      { title: "Die Hard", year: 1988, reason: "Classic action dengan humor", id: "die-hard", mood_match: "Action klasik yang seru", similarity: "Hero action yang ikonik", poster_path: "/fyyp0ILd7ZVgCzaV2HS4IvnhaV7.jpg" },
      { title: "Mission: Impossible - Fallout", year: 2018, reason: "Spy action dengan stunt menakjubkan", id: "mi-fallout", mood_match: "Action spy yang intens", similarity: "Stunt work yang luar biasa", poster_path: "/Akv91ZBJrZ3YbNdwdBzAk3r7g2b.jpg" },
      { title: "The Avengers", year: 2012, reason: "Superhero team yang epic", id: "avengers", mood_match: "Action superhero yang seru", similarity: "Team action masterpiece", poster_path: "/ceyWG73kjHQl1AJKkDWX9Pdxfv.jpg" },
      { title: "Gladiator", year: 2000, reason: "Epic historical action", id: "gladiator", mood_match: "Action epik historis", similarity: "Roman action masterpiece", poster_path: "/zhQ1PWudTfaBwSyw7hGfFoaFGI.jpg" },
      { title: "Terminator 2", year: 1991, reason: "Sci-fi action classic", id: "terminator2", mood_match: "Action sci-fi ikonik", similarity: "Time travel action", poster_path: "/tNPHBcmqI3LHQG0V2jXkzLDvnE.jpg" },
      { title: "The Matrix", year: 1999, reason: "Revolutionary sci-fi action", id: "matrix-action", mood_match: "Sci-fi action yang mind-bending", similarity: "Action philosophy", poster_path: "/f1U2v3W4x5y6z7a8b9c0d1e2f3g4h5.jpg" },
      { title: "Speed", year: 1994, reason: "High-octane thriller", id: "speed", mood_match: "Action penuh tension", similarity: "Bus action thriller", poster_path: "/aBnCjY1q4k2L3m4n5o6p7q8r9s0t1u.jpg" },
      { title: "Léon: The Professional", year: 1994, reason: "Hitman action drama", id: "leon", mood_match: "Action dengan emosi", similarity: "Professional killer story", poster_path: "/b2c3D4e5f6g7h8i9j0k1l2m3n4o5p6.jpg" }
    ],
    bahagia: [
      { title: "The Grand Budapest Hotel", year: 2014, reason: "Comedy dengan visual yang unik", id: "grand-budapest", mood_match: "Cocok untuk mood bahagia", similarity: "Visual comedy yang indah", poster_path: "/qOkyoinDeBt6tBs1Rul4O2e0Tn4.jpg" },
      { title: "La La Land", year: 2016, reason: "Musical romance yang beautiful", id: "la-la-land", mood_match: "Musical yang mengangkat mood", similarity: "Romance dengan musik bagus", poster_path: "/uXf4Oc3V4sWiTcv5ngpT9dK6xFi.jpg" },
      { title: "Paddington 2", year: 2017, reason: "Family comedy yang heartwarming", id: "paddington-2", mood_match: "Perfect untuk mood bahagia", similarity: "Family-friendly dan lucu", poster_path: "/dL0Gt9JcGQ9M2GvTn5uMjGq2C9j.jpg" },
      { title: "The Intouchables", year: 2011, reason: "French comedy yang inspiratif", id: "intouchables", mood_match: "Uplifting dan menyenangkan", similarity: "Friendship story yang manis", poster_path: "/h9WJX8nTlq4eAaO9YQv2pLd5q6k.jpg" },
      { title: "Singing in the Rain", year: 1952, reason: "Classic musical yang joyful", id: "singing-rain", mood_match: "Musical klasik bahagia", similarity: "Song and dance yang iconic", poster_path: "/5u2HJ2c3vH4d6e7f8g9h0i1j2k3.jpg" },
      { title: "Amélie", year: 2001, reason: "Whimsical French romance", id: "amelie", mood_match: "Quirky dan menyenangkan", similarity: "Romantic comedy yang unik", poster_path: "/h1GjK2l3m4n5o6p7q8r9s0t1u2v3.jpg" },
      { title: "Mamma Mia!", year: 2008, reason: "ABBA musical yang fun", id: "mamma-mia", mood_match: "Musical penuh keceriaan", similarity: "ABBA songs celebration", poster_path: "/c3d4E5f6g7h8i9j0k1l2m3n4o5p6q7.jpg" },
      { title: "The Princess Bride", year: 1987, reason: "Fantasy comedy classic", id: "princess-bride", mood_match: "Fantasy adventure yang fun", similarity: "Fairy tale comedy", poster_path: "/d4e5F6g7h8i9j0k1l2m3n4o5p6q7r8.jpg" },
      { title: "School of Rock", year: 2003, reason: "Music comedy yang inspiratif", id: "school-rock", mood_match: "Music education yang fun", similarity: "Rock teacher story", poster_path: "/e5f6G7h8i9j0k1l2m3n4o5p6q7r8s9.jpg" },
      { title: "The Devil Wears Prada", year: 2006, reason: "Fashion comedy yang stylish", id: "devil-prada", mood_match: "Career comedy yang ceria", similarity: "Fashion world story", poster_path: "/f6g7H8i9j0k1l2m3n4o5p6q7r8s9t0.jpg" },
      { title: "Love Actually", year: 2003, reason: "Christmas romantic comedy", id: "love-actually", mood_match: "Holiday romance yang warm", similarity: "Multiple love stories", poster_path: "/g7h8I9j0k1l2m3n4o5p6q7r8s9t0u1.jpg" },
      { title: "Bridget Jones's Diary", year: 2001, reason: "British romantic comedy", id: "bridget-jones", mood_match: "Rom-com yang relatable", similarity: "Single woman journey", poster_path: "/h8i9J0k1l2m3n4o5p6q7r8s9t0u1v2.jpg" }
    ],
    sedih: [
      { title: "The Pursuit of Happyness", year: 2006, reason: "Inspirational story yang mengharukan", id: "pursuit-happyness", mood_match: "Drama inspiratif", similarity: "Story tentang perjuangan", poster_path: "/f1GQ2h3I4j5K6l7m8n9o0p1q2r3s4.jpg" },
      { title: "Grave of the Fireflies", year: 1988, reason: "Sad anime yang classic", id: "grave-fireflies", mood_match: "Anime yang sangat menyentuh", similarity: "War drama yang powerful", poster_path: "/g2h3I4j5K6l7m8n9o0p1q2r3s4t5u6.jpg" },
      { title: "Schindler's List", year: 1994, reason: "Holocaust drama yang powerful", id: "schindlers-list", mood_match: "Drama sejarah yang deep", similarity: "Historical drama masterpiece", poster_path: "/sF1d2g3H4j5k6L7m8n9o0p1q2r3s4t5.jpg" },
      { title: "Manchester by the Sea", year: 2016, reason: "Family drama yang realistic", id: "manchester-sea", mood_match: "Realistic dan emotional", similarity: "Family drama yang raw", poster_path: "/j1k2L3m4n5O6p7q8r9s0t1u2v3w4x5.jpg" },
      { title: "The Green Mile", year: 1999, reason: "Prison drama yang supernatural", id: "green-mile", mood_match: "Drama yang mengharukan", similarity: "Supernatural drama elements", poster_path: "/k2l3M4n5o6P7q8r9s0t1u2v3w4x5y6.jpg" },
      { title: "Life is Beautiful", year: 1997, reason: "Holocaust comedy-drama", id: "life-beautiful", mood_match: "Bittersweet dan inspiratif", similarity: "Comedy-drama yang unik", poster_path: "/l3m4N5o6p7Q8r9s0t1u2v3w4x5y6z7.jpg" },
      { title: "The Boy in the Striped Pyjamas", year: 2008, reason: "WWII drama yang heartbreaking", id: "boy-striped-pyjamas", mood_match: "Childhood innocence yang tragic", similarity: "Holocaust perspective", poster_path: "/m4n5O6p7q8R9s0t1u2v3w4x5y6z7a8.jpg" },
      { title: "Hachi: A Dog's Tale", year: 2009, reason: "Dog loyalty story yang emotional", id: "hachi-dog", mood_match: "Pet loyalty yang touching", similarity: "Human-animal bond", poster_path: "/n5o6P7q8R9s0T1u2v3w4x5y6z7a8b9c.jpg" },
      { title: "My Sister's Keeper", year: 2009, reason: "Family medical drama", id: "my-sisters-keeper", mood_match: "Family sacrifice yang emotional", similarity: "Medical ethics drama", poster_path: "/o6p7Q8r9S0t1U2v3w4x5y6z7a8b9c0d.jpg" },
      { title: "The Fault in Our Stars", year: 2014, reason: "Teen cancer romance", id: "fault-our-stars", mood_match: "Young love yang tragic", similarity: "Cancer survivor story", poster_path: "/p7q8R9s0T1u2V3w4x5y6z7a8b9c0d1e.jpg" },
      { title: "A Walk to Remember", year: 2002, reason: "Teen romance drama", id: "walk-remember", mood_match: "First love yang bittersweet", similarity: "High school romance", poster_path: "/q8r9S0t1U2v3W4x5y6z7a8b9c0d1e2f3.jpg" },
      { title: "Million Dollar Baby", year: 2004, reason: "Boxing drama yang tragic", id: "million-dollar-baby", mood_match: "Sports drama yang heartbreaking", similarity: "Female boxer story", poster_path: "/r9s0T1u2V3w4X5y6z7a8b9c0d1e2f3g4.jpg" }
    ],
    romantis: [
      { title: "La La Land", year: 2016, reason: "Musical romance yang beautiful", id: "la-la-land-rom", mood_match: "Romance yang musical", similarity: "Modern musical romance", poster_path: "/uXf4Oc3V4sWiTcv5ngpT9dK6xFi.jpg" },
      { title: "The Notebook", year: 2004, reason: "Classic romance story", id: "the-notebook", mood_match: "Classic romance yang epic", similarity: "Timeless love story", poster_path: "/5vHssU4Ve3b7AeI1u1j7BfC9Jc.jpg" },
      { title: "Before Sunrise", year: 1995, reason: "Romance yang realistic dan heartfelt", id: "before-sunrise", mood_match: "Realistic romance", similarity: "Indie romance yang natural", poster_path: "/m4N5o6P7q8R9s0t1u2v3w4x5y6z7a8.jpg" },
      { title: "Eternal Sunshine of the Spotless Mind", year: 2004, reason: "Sci-fi romance yang unique", id: "eternal-sunshine", mood_match: "Mind-bending romance", similarity: "Sci-fi romance elements", poster_path: "/n5o6P7q8R9s0T1u2v3w4x5y6z7a8b9c.jpg" },
      { title: "Pride and Prejudice", year: 2005, reason: "Period romance yang classic", id: "pride-prejudice", mood_match: "Classic period romance", similarity: "Jane Austen adaptation", poster_path: "/o6p7Q8r9S0t1U2v3w4x5y6z7a8b9c0d.jpg" },
      { title: "500 Days of Summer", year: 2009, reason: "Modern romance yang realistic", id: "500-days", mood_match: "Realistic modern romance", similarity: "Non-linear romance story", poster_path: "/p7q8R9s0T1u2V3w4x5y6z7a8b9c0d1e.jpg" },
      { title: "Titanic", year: 1997, reason: "Epic historical romance", id: "titanic", mood_match: "Romance yang legendary", similarity: "Shipboard love story", poster_path: "/9gm17b1OeVZr4gKgzVNHua6oEc.jpg" },
      { title: "Casablanca", year: 1942, reason: "Classic wartime romance", id: "casablanca", mood_match: "Timeless romance classic", similarity: "WWII love story", poster_path: "/aKv91ZBJrZ3YbNdwdBzAk3r7g2b.jpg" },
      { title: "When Harry Met Sally", year: 1989, reason: "Friends-to-lovers romance", id: "harry-sally", mood_match: "Romantic comedy classic", similarity: "Friendship to romance", poster_path: "/bKl3lPHrWmZdZiO7OXGf60NKzcw.jpg" },
      { title: "Pretty Woman", year: 1990, reason: "Modern fairy tale romance", id: "pretty-woman", mood_match: "Rags to riches romance", similarity: "Cinderella story", poster_path: "/cLm4N5o6p7q8R9s0t1u2v3w4x5y6z7.jpg" },
      { title: "Ghost", year: 1990, reason: "Supernatural romance drama", id: "ghost", mood_match: "Afterlife romance", similarity: "Ghost love story", poster_path: "/dMn5O6p7q8r9S0t1u2v3w4x5y6z7a8.jpg" },
      { title: "The Princess Diaries", year: 2001, reason: "Teen royal romance", id: "princess-diaries", mood_match: "Coming-of-age romance", similarity: "Princess transformation", poster_path: "/eN6o7P8q9r0S1t2u3v4w5x6y7z8a9b0.jpg" }
    ],
    seru: [
      { title: "The Matrix", year: 1999, reason: "Sci-fi yang mengubah cinema", id: "the-matrix-seru", mood_match: "Sci-fi action yang seru", similarity: "Mind-bending action", poster_path: "/f1U2v3W4x5y6z7a8b9c0d1e2f3g4h5.jpg" },
      { title: "Inception", year: 2010, reason: "Sci-fi dengan plot twist yang menarik", id: "inception-seru", mood_match: "Plot twist yang epic", similarity: "Complex narrative structure", poster_path: "/q2w3R4t5Y6u7i8o9p0a1s2d3f4g5h6j.jpg" },
      { title: "Interstellar", year: 2014, reason: "Space sci-fi yang epic", id: "interstellar-seru", mood_match: "Space adventure yang seru", similarity: "Hard sci-fi elements", poster_path: "/g5H6j7K8l9m0n1o2p3q4r5s6t7u8v9w.jpg" },
      { title: "Avengers: Endgame", year: 2019, reason: "Superhero culmination yang epic", id: "avengers-endgame", mood_match: "Superhero action seru", similarity: "MCU culmination", poster_path: "/or6FNfcz3I2dn6l7m8A9G1XrF4e.jpg" },
      { title: "Parasite", year: 2019, reason: "Korean thriller yang unpredictable", id: "parasite-seru", mood_match: "Thriller yang seru", similarity: "Social commentary thriller", poster_path: "/7IiIgmgtfQ2Q2FwJY2S4NYlj5g.jpg" },
      { title: "Joker", year: 2019, reason: "Psychological thriller yang dark", id: "joker-seru", mood_match: "Dark psychological thriller", similarity: "Character study yang intense", poster_path: "/udDclJoHjfjb8Ekgsd4FDte0gYj.jpg" },
      { title: "The Dark Knight Rises", year: 2012, reason: "Batman trilogy conclusion", id: "dark-knight-rises", mood_match: "Superhero action yang epic", similarity: "Batman finale", poster_path: "/h6J7K8l9m0n1o2p3q4r5s6t7u8v9w0x.jpg" },
      { title: "Blade Runner 2049", year: 2017, reason: "Sci-fi sequel yang visual", id: "blade-runner-2049", mood_match: "Cyberpunk yang stunning", similarity: "Future noir thriller", poster_path: "/i7L8m9N0o1p2q3r4s5t6u7v8w9x0y1z.jpg" },
      { title: "Mad Max: Fury Road", year: 2015, reason: "Post-apocalyptic action", id: "mad-max-seru", mood_match: "Action road warrior", similarity: "Visual spectacle action", poster_path: "/hdfU2Xa7YFktLM6dGeTNk0bPDIy.jpg" },
      { title: "John Wick: Chapter 2", year: 2017, reason: "Assassin action sequel", id: "john-wick-2", mood_match: "Gun-fu action yang intense", similarity: "Continued assassin story", poster_path: "/vKl3lPHrWmZdZiO7OXGf60NKzcw.jpg" },
      { title: "The Social Network", year: 2010, reason: "Tech drama yang engaging", id: "social-network", mood_match: "Modern tech thriller", similarity: "Facebook origin story", poster_path: "/j8M9N0o1p2Q3r4s5t6u7v8w9x0y1z2a.jpg" },
      { title: "Whiplash", year: 2014, reason: "Music drama yang intense", id: "whiplash", mood_match: "Jazz drama yang powerful", similarity: "Drumming passion story", poster_path: "/k9N0o1p2q3R4s5t6u7v8w9x0y1z2a3b.jpg" }
    ],
    tenang: [
      { title: "The Shawshank Redemption", year: 1994, reason: "Film drama inspiratif tentang harapan", id: "shawshank-tenang", mood_match: "Inspirational dan tenang", similarity: "Prison drama yang uplifting", poster_path: "/q6yUhGo2VSzjikRXkfdP6a1pPc.jpg" },
      { title: "Forrest Gump", year: 1994, reason: "Heartwarming story tentang life", id: "forrest-gump", mood_match: "Heartwarming dan tenang", similarity: "Life journey yang inspiratif", poster_path: "/arw2vcBveWOvZfEBgNxj1s6tJv7.jpg" },
      { title: "The Tree of Life", year: 2011, reason: "Meditative cinema yang beautiful", id: "tree-life", mood_match: "Meditative dan tenang", similarity: "Visual poetry yang indah", poster_path: "/h7j8K9l0m1n2o3p4q5r6s7t8u9v0w1x.jpg" },
      { title: "Lost in Translation", year: 2003, reason: "Subtle romance yang atmospheric", id: "lost-translation", mood_match: "Atmospheric dan tenang", similarity: "Character study yang subtle", poster_path: "/k8l9M0n1o2p3Q4r5s6t7u8v9w0x1y2z.jpg" },
      { title: "Her", year: 2013, reason: "Sci-fi romance yang gentle", id: "her-tenang", mood_match: "Gentle sci-fi romance", similarity: "Future romance yang thoughtful", poster_path: "/l9m0N1o2p3q4R5s6t7u8v9w0x1y2z3a.jpg" },
      { title: "Paterson", year: 2016, reason: "Quiet poetry about daily life", id: "paterson", mood_match: "Quiet dan contemplative", similarity: "Daily life poetry", poster_path: "/m0n1O2p3q4r5S6t7u8v9w0x1y2z3a4b.jpg" },
      { title: "Into the Wild", year: 2007, reason: "Journey of self-discovery", id: "into-wild", mood_match: "Nature journey yang reflective", similarity: "Wilderness adventure", poster_path: "/n1o2P3q4r5s6T7u8v9w0x1y2z3a4b5c.jpg" },
      { title: "The Secret Life of Walter Mitty", year: 2013, reason: "Adventure fantasy yang inspiring", id: "walter-mitty", mood_match: "Dream adventure yang uplifting", similarity: "Life adventure fantasy", poster_path: "/o2p3Q4r5s6t7U8v9w0x1y2z3a4b5c6d.jpg" },
      { title: "Little Miss Sunshine", year: 2006, reason: "Family road trip comedy", id: "little-miss-sunshine", mood_match: "Family journey yang heartwarming", similarity: "Road trip adventure", poster_path: "/p3q4R5s6t7u8V9w0x1y2z3a4b5c6d7e.jpg" },
      { title: "The King's Speech", year: 2010, reason: "Historical drama yang inspiring", id: "kings-speech", mood_match: "Personal struggle yang uplifting", similarity: "King George VI story", poster_path: "/q4r5S6t7u8v9W0x1y2z3a4b5c6d7e8f.jpg" },
      { title: "A Beautiful Mind", year: 2001, reason: "Biographical drama mathematician", id: "beautiful-mind", mood_match: "Genius struggle yang inspiring", similarity: "John Nash biography", poster_path: "/r5s6T7u8v9w0X1y2z3a4b5c6d7e8f9g.jpg" },
      { title: "Good Will Hunting", year: 1997, reason: "Genius janitor drama", id: "good-will-hunting", mood_match: "Intellectual journey yang emotional", similarity: "Math genius story", poster_path: "/s6t7U8v9w0x1Y2z3a4b5c6d7e8f9g0h.jpg" }
    ],
    umum: [
      { title: "The Shawshank Redemption", year: 1994, reason: "Film drama inspiratif tentang harapan", id: "shawshank-umum", mood_match: "Cocok untuk semua mood", similarity: "Masterpiece yang universal", poster_path: "/q6yUhGo2VSzjikRXkfdP6a1pPc.jpg" },
      { title: "Pulp Fiction", year: 1994, reason: "Film kultus dengan narasi non-linear", id: "pulp-fiction-umum", mood_match: "Classic yang selalu relevan", similarity: "Tarantino masterpiece", poster_path: "/plnlrtUWf8GKXykfP0voOe5B5r.jpg" },
      { title: "The Matrix", year: 1999, reason: "Sci-fi yang mengubah cinema", id: "matrix-umum", mood_match: "Sci-fi yang universal", similarity: "Revolutionary sci-fi", poster_path: "/f1U2v3W4x5y6z7a8b9c0d1e2f3g4h5.jpg" },
      { title: "The Godfather", year: 1972, reason: "Crime saga yang legendary", id: "godfather-umum", mood_match: "Classic cinema masterpiece", similarity: "Crime saga yang epic", poster_path: "/rPdtLWNrsZVAzoXCNREXUtNrViY.jpg" },
      { title: "Fight Club", year: 1999, reason: "Satire social yang provocative", id: "fight-club", mood_match: "Thought-provoking drama", similarity: "Social commentary yang sharp", poster_path: "/pB8BM7pdSp6BldI7wZOF2PHR9dJ.jpg" },
      { title: "Goodfellas", year: 1990, reason: "Crime drama yang authentic", id: "goodfellas", mood_match: "Classic crime storytelling", similarity: "Mob drama yang realistic", poster_path: "/a4u5JwGn76uqL2ZcLr3lXh4g5j6.jpg" },
      { title: "The Departed", year: 2006, reason: "Undercover cop thriller", id: "departed", mood_match: "Crime thriller yang intense", similarity: "Boston mob story", poster_path: "/b5v6K7l8m9n0o1p2q3r4s5t6u7v8w9x.jpg" },
      { title: "Inglourious Basterds", year: 2009, reason: "WWII revenge fantasy", id: "inglourious-basterds", mood_match: "Historical action yang unique", similarity: "Tarantino WWII", poster_path: "/c6w7L8m9n0o1p2q3r4s5t6u7v8w9x0y.jpg" },
      { title: "The Prestige", year: 2006, reason: "Magician rivalry mystery", id: "prestige", mood_match: "Mystery thriller yang complex", similarity: "Magician competition", poster_path: "/d7x8M9n0o1p2q3r4s5t6u7v8w9x0y1z.jpg" },
      { title: "Memento", year: 2000, reason: "Memory loss thriller", id: "memento", mood_match: "Psychological thriller yang unique", similarity: "Reverse chronology", poster_path: "/e8y9N0o1p2q3r4s5t6u7v8w9x0y1z2a.jpg" },
      { title: "The Usual Suspects", year: 1995, reason: "Crime mystery masterpiece", id: "usual-suspects", mood_match: "Mystery crime yang brilliant", similarity: "Heist story twist", poster_path: "/f9z0O1p2q3r4s5t6u7v8w9x0y1z2a3b.jpg" },
      { title: "Se7en", year: 1995, reason: "Dark psychological thriller", id: "seven", mood_match: "Serial killer thriller yang dark", similarity: "Seven deadly sins", poster_path: "/g0a1P2q3r4s5t6u7v8w9x0y1z2a3b4c.jpg" }
    ]
  };

  // Get all movies for the mood and randomize selection
  const moodMovies = allRecommendations[mood] || allRecommendations.umum;
  
  // Shuffle and take 3 random movies
  const shuffled = [...moodMovies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export const getFallbackSearch = (query) => {
  // Simple keyword-based search fallback
  const keywords = query.toLowerCase().split(' ');
  
  const movieDatabase = [
    { title: "The Dark Knight", year: 2008, keywords: ["batman", "dark", "knight", "hero"], id: "dark-knight" },
    { title: "Inception", year: 2010, keywords: ["dream", "mind", "reality", "sci-fi"], id: "inception" },
    { title: "Interstellar", year: 2014, keywords: ["space", "time", "science", "nolan"], id: "interstellar" },
    { title: "The Matrix", year: 1999, keywords: ["matrix", "neo", "morpheus", "simulation"], id: "the-matrix" },
    { title: "Avengers: Endgame", year: 2019, keywords: ["avengers", "marvel", "superhero", "endgame"], id: "avengers-endgame" },
    { title: "Joker", year: 2019, keywords: ["joker", "batman", "villain", "psychological"], id: "joker" },
    { title: "Parasite", year: 2019, keywords: ["parasite", "korean", "family", "thriller"], id: "parasite" },
    { title: "Everything Everywhere All at Once", year: 2022, keywords: ["multiverse", "family", "sci-fi", "oscars"], id: "everything-everywhere" }
  ];

  return movieDatabase.filter(movie => 
    keywords.some(keyword => 
      movie.keywords.some(movieKeyword => 
        keyword.includes(movieKeyword) || movieKeyword.includes(keyword)
      )
    )
  );
};
