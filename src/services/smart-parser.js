// Smart Natural Language Parser (Fallback untuk Gemini API)
export const parseNaturalQuery = (query) => {
  console.log('🧠 Parsing natural query:', query);
  
  const lowerQuery = query.toLowerCase();
  
  // Enhanced intent detection with more keywords
  const sinopsisKeywords = [
    'sinopsis', 'cerita', 'jalan cerita', 'alur cerita', 'kisah', 
    'ringkasan', 'summary', 'plot', 'story', 'tentang', 'mengenai',
    'apa itu', 'film tentang apa', 'isi film', 'konten film'
  ];
  
  const requestKeywords = [
    'berikan', 'beri', 'tolong', 'kasih', 'cari', 'carikan', 
    'tampilkan', 'show', 'get', 'beritahu', 'jelaskan'
  ];
  
  const popularKeywords = [
    'terpopuler', 'populer', 'terbaik', 'best', 'top', 'trending',
    'hits', 'viral', 'favorit', 'recommended', 'sukses'
  ];
  
  const yearKeywords = [
    'tahun', 'year', '2025', '2024', '2023', '2022', '2021'
  ];
  
  let intent = 'search';
  
  // Enhanced intent detection
  if (sinopsisKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'sinopsis';
  } else if (lowerQuery.includes('rekomendasi') || lowerQuery.includes('sarankan') || lowerQuery.includes('film apa')) {
    intent = 'rekomendasi';
  } else if (lowerQuery.includes('review') || lowerQuery.includes('ulasan')) {
    intent = 'review';
  } else if (popularKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'popular';
  } else if (lowerQuery.includes('trending') || lowerQuery.includes('viral')) {
    intent = 'trending';
  } else if (lowerQuery.includes('baru') || lowerQuery.includes('new') || lowerQuery.includes('latest')) {
    intent = 'latest';
  } else if (lowerQuery.includes('rating') || lowerQuery.includes('skor') || lowerQuery.includes('bintang')) {
    intent = 'rating';
  } else if (lowerQuery.includes('genre') || lowerQuery.includes('jenis')) {
    intent = 'genre';
  } else if (lowerQuery.includes('aktor') || lowerQuery.includes('pemeran') || lowerQuery.includes('cast')) {
    intent = 'cast';
  }
  
  // Enhanced movie title extraction patterns
  const titlePatterns = [
    // Indonesian patterns
    /sinopsis\s+film\s+(.+?)(?:\s+\d{4})?$/i,
    /film\s+(.+?)\s+sinopsis$/i,
    /berikan\s+(?:saya\s+)?sinopsis\s+(?:film\s+)?(.+?)(?:\s+\d{4})?$/i,
    /tolong\s+(?:berikan\s+)?sinopsis\s+(?:film\s+)?(.+?)(?:\s+\d{4})?$/i,
    /cari\s+sinopsis\s+(?:film\s+)?(.+?)(?:\s+\d{4})?$/i,
    /apa\s+itu\s+film\s+(.+?)(?:\s+\d{4})?$/i,
    /film\s+(.+?)\s+tentang\s+apa$/i,
    /cerita\s+film\s+(.+?)(?:\s+\d{4})?$/i,
    
    // Context-based patterns
    /(.+?)\s+menyala\s+pantiku$/i, // "agak laen menyala pantiku" -> "agak laen"
    /(.+?)\s+apa\s+ceritanya$/i,
    /(.+?)\s+apa\s+sinopsisnya$/i,
    /(.+?)\s+bagaimana\s+ceritanya$/i,
    
    // Generic patterns
    /film\s+(.+?)(?:\s+\d{4})?$/i,
    /cari\s+film\s+(.+?)(?:\s+\d{4})?$/i,
    /(.+?)(?:\s+\d{4})?$/i
  ];
  
  let extractedTitle = '';
  let extractedYear = null;
  let extractedGenre = '';
  
  // Extract year first
  const yearMatch = query.match(/(\d{4})/);
  if (yearMatch) {
    extractedYear = parseInt(yearMatch[1]);
  }
  
  // Extract genre
  const genres = ['action', 'komedi', 'drama', 'horror', 'romantis', 'sci-fi', 'thriller', 'fantasi', 'animasi', 'dokumenter'];
  for (const genre of genres) {
    if (lowerQuery.includes(genre)) {
      extractedGenre = genre;
      break;
    }
  }
  
  // Extract title using patterns
  for (const pattern of titlePatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      extractedTitle = match[1];
      break;
    }
  }
  
  // Clean up title - remove filler words
  if (extractedTitle) {
    const fillerWords = [
      'sinopsis', 'film', 'cari', 'berikan', 'beri', 'tolong', 'kasih', 
      'tahun', 'year', 'yang', 'dari', 'untuk', 'tentang', 'mengenai',
      'saya', 'aku', 'disini', 'sana', 'ini', 'itu', 'nya', 'dah',
      'terpopuler', 'terbaik', 'baru', 'trending'
    ];
    
    extractedTitle = extractedTitle
      .split(' ')
      .filter(word => !fillerWords.includes(word.toLowerCase()))
      .join(' ')
      .trim();
  }
  
  // Special handling for context queries
  if (intent === 'sinopsis' && !extractedTitle) {
    // Try to extract from context
    const contextPatterns = [
      /(.+?)\s+menyala/i,
      /(.+?)\s+pantiku/i,
      /(.+?)\s+apa$/i,
      /(.+?)\s+ceritanya$/i,
      /(.+?)\s+sinopsisnya$/i
    ];
    
    for (const pattern of contextPatterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        extractedTitle = match[1].trim();
        break;
      }
    }
  }
  
  // Final fallback - if still no title but sinopsis intent, use first meaningful words
  if (intent === 'sinopsis' && !extractedTitle) {
    const words = query.split(' ').filter(word => 
      word.length > 2 && 
      !sinopsisKeywords.includes(word.toLowerCase()) &&
      !requestKeywords.includes(word.toLowerCase())
    );
    
    if (words.length > 0) {
      extractedTitle = words.slice(0, 3).join(' '); // Take first 3 meaningful words
    }
  }
  
  const result = {
    intent,
    title: extractedTitle,
    year: extractedYear,
    genre: extractedGenre,
    originalQuery: query,
    searchTerms: extractedTitle ? [extractedTitle] : query.split(' ').filter(word => word.length > 2)
  };
  
  console.log('🧠 Parsed result:', result);
  return result;
};

// Enhanced movie database for fallback
export const getMovieByTitle = (title, year = null) => {
  const movieDatabase = [
    {
      title: "The Avengers",
      year: 2012,
      sinopsis: "Ketika musuh tak terduga muncul dan mengancam keselamatan global, Nick Fury, direktur S.H.I.E.L.D., memulai upaya perekrutan untuk menyelamatkan dunia dari bencana. Iron Man, Captain America, Thor, Hulk, Black Widow, dan Hawkeye harus bersatu untuk melawan Loki dan invasi alien.",
      keywords: ["avengers", "marvel", "superhero", "iron man", "captain america", "thor", "hulk"]
    },
    {
      title: "Avengers: Age of Ultron", 
      year: 2015,
      sinopsis: "Tony Stark menciptakan sistem pertahanan buatan yang disebut Ultron, namun AI ini menjadi sadar dan menganggap manusia sebagai ancaman. Para Avengers harus bersatu lagi untuk menghentikan Ultron dari menghancurkan dunia.",
      keywords: ["avengers", "ultron", "marvel", "iron man", "vision", "scarlet witch"]
    },
    {
      title: "Avengers: Infinity War",
      year: 2018,
      sinopsis: "Thanos, sang Titan Gila, mengumpulkan semua Infinity Stones untuk menghapus separuh kehidupan di alam semesta. Para Avengers dan sekutu mereka berjuang untuk menghentikan rencana Thanos dalam pertempuran epik.",
      keywords: ["avengers", "thanos", "infinity", "marvel", "spiderman", "guardians"]
    },
    {
      title: "Avengers: Endgame",
      year: 2019,
      sinopsis: "Setelah peristiwa Infinity War, para Avengers yang tersisa mencari cara untuk membalikkan tindakan Thanos dan memulihkan ketertiban di alam semesta melalui perjalanan waktu dan pertempuran final.",
      keywords: ["avengers", "endgame", "marvel", "time travel", "final battle"]
    },
    {
      title: "The Dark Knight",
      year: 2008,
      sinopsis: "Batman harus menghadapi Joker, seorang anarkis psikopat yang menciptakan kekacauan di Gotham. Pertarungan antara orde dan kekacauan mencapai titik puncak dalam film superhero yang legendaris.",
      keywords: ["batman", "joker", "dark knight", "gotham", "superhero"]
    },
    {
      title: "Inception",
      year: 2010,
      sinopsis: "Dom Cobb adalah pencuri ahli yang mencuri rahasia dari alam bawah sadar melalui mimpi. Tugas terakhirnya adalah menanamkan ide ke dalam pikrian seseorang, sebuah misi yang dianggap tidak mungkin.",
      keywords: ["inception", "dream", "mind", "nolan", "di caprio"]
    },
    {
      title: "Interstellar",
      year: 2014,
      sinopsis: "Di masa depan ketika Bumi tidak lagi dapat dihuni, seorang astronaut dan peneliti melakukan perjalanan melalui wormhole untuk mencari planet baru yang dapat dihuni umat manusia.",
      keywords: ["interstellar", "space", "nasa", "wormhole", "matthew mcconaughey"]
    },
    {
      title: "The Matrix",
      year: 1999,
      sinopsis: "Seorang hacker komputer menemukan bahwa realitas yang dia kenal sebenarnya adalah simulasi virtual yang dibuat oleh mesin. Dia harus memilih antara kehidupan nyata atau dunia maya.",
      keywords: ["matrix", "neo", "morpheus", "simulation", "keanu reeves"]
    },
    // Indonesian movies
    {
      title: "Agak Laen",
      year: 2024,
      sinopsis: "Tiga sahabat, Bison, Surya, dan Dobi, menjalankan bisnis kontrakan namun sering mendapat masalah dengan penyewa. Mereka harus menghadapi berbagai penyewa unik yang membuat hidup mereka penuh kekacauan dan komedi.",
      keywords: ["agak laen", "komedi", "indonesia", "sahabat", "kontrakan"]
    },
    {
      title: "Agak Laen 2",
      year: 2024,
      sinopsis: "Kisah berlanjut dengan petualangan Bison, Surya, dan Dobi yang semakin kacau. Kali ini mereka harus menghadapi penyewa baru yang lebih aneh dan masalah yang lebih besar dalam bisnis kontrakan mereka.",
      keywords: ["agak laen 2", "komedi", "indonesia", "sekuel", "penyewa"]
    },
    {
      title: "Pengabdi Setan",
      year: 2017,
      sinopsis: "Keluarga yang tinggal di rumah di pinggiran kota harus menghadapi teror dari ibu mereka yang meninggal secara misterius. Mereka menemukan rahasia gelap tentang rumah dan keluarga mereka.",
      keywords: ["pengabdi setan", "horror", "indonesia", "keluarga", "misteri"]
    },
    {
      title: "Warkop DKI Reborn",
      year: 2016,
      sinopsis: "Petualangan kocak tiga sahabat Dono, Kasino, dan Indro dalam menghadapi berbagai masalah dengan cara yang lucu dan menggelikan. Mereka terlibat dalam berbagai situasi komedi yang mengundang tawa.",
      keywords: ["warkop", "dki", "reborn", "komedi", "indonesia", "dono kasino indro"]
    }
  ];
  
  // Enhanced search by title and year
  const results = movieDatabase.filter(movie => {
    const titleMatch = movie.title.toLowerCase().includes(title.toLowerCase()) || 
                      title.toLowerCase().includes(movie.title.toLowerCase()) ||
                      movie.keywords.some(keyword => keyword.toLowerCase().includes(title.toLowerCase())) ||
                      title.toLowerCase().split(' ').some(word => 
                        movie.title.toLowerCase().includes(word) || 
                        movie.keywords.some(keyword => keyword.toLowerCase().includes(word))
                      );
    const yearMatch = !year || movie.year === year;
    return titleMatch && yearMatch;
  });
  
  return results;
};
