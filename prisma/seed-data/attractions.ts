import { PrismaClient } from "@prisma/client";

export async function seedAttractions(prisma: PrismaClient) {
  console.log("🎡 Seeding tourist attractions...");

  const attractionsData: { cityName: string; countryCode: string; attractions: { name: string; category: string; description: string; distanceKm: number; travelTime: string; area: string; suggestedDay: number; displayOrder: number }[] }[] = [
    // TOKYO
    { cityName: "Tokyo", countryCode: "JP", attractions: [
      { name: "Imperial Palace", category: "Landmark", description: "The primary residence of the Emperor of Japan, surrounded by beautiful gardens and moats in the heart of Tokyo.", distanceKm: 1, travelTime: "10–15 min walk", area: "Chiyoda", suggestedDay: 1, displayOrder: 1 },
      { name: "Ginza", category: "Shopping", description: "Tokyo's most famous upscale shopping, dining, and entertainment district with flagship stores and luxury boutiques.", distanceKm: 1.5, travelTime: "5 min by train / 20 min walk", area: "Chuo", suggestedDay: 1, displayOrder: 2 },
      { name: "Tsukiji Outer Market", category: "Food", description: "Historic market area with hundreds of shops and restaurants selling fresh seafood, produce, and Japanese kitchenware.", distanceKm: 2.5, travelTime: "10 min by taxi/train", area: "Chuo", suggestedDay: 1, displayOrder: 3 },
      { name: "Akihabara", category: "Shopping", description: "Electric Town — the mecca for anime, manga, electronics, and gaming culture with countless shops and arcades.", distanceKm: 2.5, travelTime: "5 min by JR", area: "Chiyoda", suggestedDay: 2, displayOrder: 4 },
      { name: "Tokyo Tower", category: "Landmark", description: "Iconic 332m communications tower inspired by the Eiffel Tower, with observation decks offering panoramic city views.", distanceKm: 4, travelTime: "15 min by subway", area: "Minato", suggestedDay: 2, displayOrder: 5 },
      { name: "Ueno Park", category: "Park", description: "Sprawling public park home to museums, a zoo, temples, and the famous cherry blossom avenue in spring.", distanceKm: 4, travelTime: "10 min by JR", area: "Taito", suggestedDay: 2, displayOrder: 6 },
      { name: "Senso-ji", category: "Temple", description: "Tokyo's oldest Buddhist temple, featuring the iconic Kaminarimon gate and bustling Nakamise shopping street.", distanceKm: 5, travelTime: "15–20 min by metro", area: "Asakusa", suggestedDay: 3, displayOrder: 7 },
      { name: "Tokyo Skytree", category: "Landmark", description: "Japan's tallest structure at 634m with two observation decks, a shopping complex, and an aquarium at the base.", distanceKm: 6, travelTime: "20 min by metro", area: "Sumida", suggestedDay: 3, displayOrder: 8 },
      { name: "teamLab Planets", category: "Museum", description: "Immersive digital art museum where you walk through water and gardens merging technology with nature.", distanceKm: 5, travelTime: "20 min by train", area: "Toyosu", suggestedDay: 3, displayOrder: 9 },
      { name: "Shibuya Scramble Crossing", category: "Landmark", description: "The world's busiest pedestrian crossing with giant video screens, right next to the Hachiko statue.", distanceKm: 8, travelTime: "20–25 min by JR", area: "Shibuya", suggestedDay: 4, displayOrder: 10 },
      { name: "Meiji Jingu", category: "Temple", description: "Serene Shinto shrine surrounded by a 170-acre evergreen forest in the middle of Tokyo, dedicated to Emperor Meiji.", distanceKm: 9, travelTime: "25 min by train", area: "Shibuya", suggestedDay: 4, displayOrder: 11 },
      { name: "Shinjuku Gyoen", category: "Park", description: "One of Tokyo's most beautiful parks blending Japanese, French, and English garden styles — stunning in cherry blossom season.", distanceKm: 7, travelTime: "20 min by train", area: "Shinjuku", suggestedDay: 4, displayOrder: 12 },
      { name: "Kabukicho", category: "Entertainment", description: "Tokyo's largest entertainment and red-light district with neon lights, bars, robot restaurants, and nightlife.", distanceKm: 7, travelTime: "20 min by JR", area: "Shinjuku", suggestedDay: 5, displayOrder: 13 },
      { name: "Odaiba", category: "Entertainment", description: "Futuristic man-made island with shopping malls, a giant Gundam statue, hot springs, and Rainbow Bridge views.", distanceKm: 9, travelTime: "30–40 min by Yurikamome", area: "Minato", suggestedDay: 5, displayOrder: 14 },
    ]},
    // NEW DELHI
    { cityName: "New Delhi", countryCode: "IN", attractions: [
      { name: "India Gate", category: "Landmark", description: "Iconic 42m war memorial arch surrounded by lawns, a popular evening gathering spot for locals and tourists.", distanceKm: 0, travelTime: "Central landmark", area: "Central Delhi", suggestedDay: 1, displayOrder: 1 },
      { name: "Red Fort (Lal Qila)", category: "Landmark", description: "UNESCO World Heritage site — the 17th-century Mughal fort that served as the main residence of Mughal emperors for 200 years.", distanceKm: 4, travelTime: "15 min by metro", area: "Chandni Chowk", suggestedDay: 1, displayOrder: 2 },
      { name: "Jama Masjid", category: "Temple", description: "One of India's largest mosques, built by Shah Jahan, with a courtyard that can hold 25,000 worshippers.", distanceKm: 4.5, travelTime: "15 min by metro/rickshaw", area: "Chandni Chowk", suggestedDay: 1, displayOrder: 3 },
      { name: "Qutub Minar", category: "Landmark", description: "73m tall UNESCO-listed minaret built in 1193, the tallest brick minaret in the world with intricate carvings.", distanceKm: 15, travelTime: "35 min by metro", area: "Mehrauli", suggestedDay: 2, displayOrder: 4 },
      { name: "Humayun's Tomb", category: "Landmark", description: "Magnificent 16th-century Mughal garden-tomb, a UNESCO site and precursor to the Taj Mahal's architectural style.", distanceKm: 6, travelTime: "20 min by auto", area: "Nizamuddin", suggestedDay: 2, displayOrder: 5 },
      { name: "Lotus Temple", category: "Temple", description: "Stunning flower-shaped Bahá'í House of Worship with 27 marble petals, open to all faiths for meditation.", distanceKm: 8, travelTime: "25 min by metro", area: "Kalkaji", suggestedDay: 2, displayOrder: 6 },
      { name: "Akshardham Temple", category: "Temple", description: "One of the largest Hindu temples in the world, featuring stunning architecture, exhibitions, and a musical fountain show.", distanceKm: 8, travelTime: "25 min by metro", area: "East Delhi", suggestedDay: 3, displayOrder: 7 },
      { name: "Chandni Chowk", category: "Shopping", description: "Delhi's oldest and busiest market — a sensory explosion of street food, spices, jewelry, and textiles in narrow lanes.", distanceKm: 4, travelTime: "15 min by metro", area: "Old Delhi", suggestedDay: 3, displayOrder: 8 },
      { name: "Rashtrapati Bhavan", category: "Landmark", description: "The official residence of India's President with 340 rooms, Mughal Gardens, and the ceremonial Rajpath boulevard.", distanceKm: 2, travelTime: "10 min drive", area: "Central Delhi", suggestedDay: 1, displayOrder: 9 },
      { name: "Gurudwara Bangla Sahib", category: "Temple", description: "One of Delhi's most prominent Sikh temples with a golden dome, a sacred pool, and a community kitchen serving free meals.", distanceKm: 3, travelTime: "10 min by auto", area: "Connaught Place", suggestedDay: 1, displayOrder: 10 },
    ]},
    // LONDON
    { cityName: "London", countryCode: "GB", attractions: [
      { name: "Buckingham Palace", category: "Landmark", description: "The official residence of the British monarch, famous for the Changing of the Guard ceremony.", distanceKm: 1, travelTime: "15 min walk from Westminster", area: "Westminster", suggestedDay: 1, displayOrder: 1 },
      { name: "Big Ben & Houses of Parliament", category: "Landmark", description: "Iconic clock tower and Gothic parliament building on the Thames — London's most recognizable symbol.", distanceKm: 0, travelTime: "Central landmark", area: "Westminster", suggestedDay: 1, displayOrder: 2 },
      { name: "London Eye", category: "Landmark", description: "135m giant Ferris wheel offering 360° views across London skyline — best at sunset.", distanceKm: 0.5, travelTime: "5 min walk from Westminster", area: "South Bank", suggestedDay: 1, displayOrder: 3 },
      { name: "Tower of London", category: "Landmark", description: "Historic 11th-century castle housing the Crown Jewels, with Beefeater tours and raven legends.", distanceKm: 3.5, travelTime: "15 min by tube", area: "Tower Hill", suggestedDay: 2, displayOrder: 4 },
      { name: "Tower Bridge", category: "Landmark", description: "Victorian bascule bridge with glass-floored walkway 42m above the Thames.", distanceKm: 3.5, travelTime: "15 min by tube", area: "Tower Hill", suggestedDay: 2, displayOrder: 5 },
      { name: "British Museum", category: "Museum", description: "One of the world's greatest museums with 8 million works including the Rosetta Stone and Egyptian mummies.", distanceKm: 2, travelTime: "10 min by tube", area: "Bloomsbury", suggestedDay: 2, displayOrder: 6 },
      { name: "Trafalgar Square", category: "Landmark", description: "Iconic public square with Nelson's Column, lion statues, the National Gallery, and street performers.", distanceKm: 1, travelTime: "10 min walk from Westminster", area: "Charing Cross", suggestedDay: 1, displayOrder: 7 },
      { name: "Covent Garden", category: "Shopping", description: "Vibrant piazza with street performers, boutique shops, restaurants, and the Royal Opera House.", distanceKm: 1.5, travelTime: "5 min by tube", area: "Covent Garden", suggestedDay: 3, displayOrder: 8 },
      { name: "Hyde Park", category: "Park", description: "London's largest Royal Park at 350 acres, featuring the Serpentine lake, Speakers' Corner, and Kensington Gardens.", distanceKm: 3, travelTime: "10 min by tube", area: "Knightsbridge", suggestedDay: 3, displayOrder: 9 },
      { name: "Camden Market", category: "Shopping", description: "Eclectic market with over 1,000 stalls selling vintage fashion, street food, art, and crafts along the canal.", distanceKm: 4, travelTime: "15 min by tube", area: "Camden", suggestedDay: 3, displayOrder: 10 },
    ]},
    // PARIS
    { cityName: "Paris", countryCode: "FR", attractions: [
      { name: "Eiffel Tower", category: "Landmark", description: "The world's most visited monument — 330m iron lattice tower with restaurants and observation decks.", distanceKm: 3, travelTime: "15 min by metro", area: "7th Arrondissement", suggestedDay: 1, displayOrder: 1 },
      { name: "Louvre Museum", category: "Museum", description: "The world's largest art museum, home to the Mona Lisa, Venus de Milo, and the iconic glass pyramid.", distanceKm: 1, travelTime: "Central", area: "1st Arrondissement", suggestedDay: 1, displayOrder: 2 },
      { name: "Notre-Dame Cathedral", category: "Landmark", description: "Masterpiece of French Gothic architecture on the Île de la Cité, dating back to the 12th century.", distanceKm: 0.5, travelTime: "5 min walk from Louvre", area: "Île de la Cité", suggestedDay: 2, displayOrder: 3 },
      { name: "Sacré-Cœur Basilica", category: "Temple", description: "White-domed basilica atop Montmartre hill offering breathtaking panoramic views of Paris.", distanceKm: 4, travelTime: "20 min by metro", area: "Montmartre", suggestedDay: 2, displayOrder: 4 },
      { name: "Arc de Triomphe", category: "Landmark", description: "Monumental arch honoring French soldiers, with an observation deck at the top of the Champs-Élysées.", distanceKm: 4, travelTime: "15 min by metro", area: "8th Arrondissement", suggestedDay: 1, displayOrder: 5 },
      { name: "Champs-Élysées", category: "Shopping", description: "The most beautiful avenue in the world — luxury boutiques, cafés, and theaters stretching 1.9km.", distanceKm: 3, travelTime: "10 min by metro", area: "8th Arrondissement", suggestedDay: 1, displayOrder: 6 },
      { name: "Musée d'Orsay", category: "Museum", description: "Stunning Beaux-Arts railway station turned museum housing the world's largest Impressionist collection.", distanceKm: 1.5, travelTime: "10 min walk from Louvre", area: "7th Arrondissement", suggestedDay: 3, displayOrder: 7 },
      { name: "Palace of Versailles", category: "Landmark", description: "UNESCO World Heritage palace with the Hall of Mirrors and magnificent gardens — a day trip from Paris.", distanceKm: 22, travelTime: "35 min by RER train", area: "Versailles", suggestedDay: 4, displayOrder: 8 },
    ]},
    // NEW YORK
    { cityName: "New York", countryCode: "US", attractions: [
      { name: "Statue of Liberty", category: "Landmark", description: "Iconic symbol of freedom and democracy — take a ferry to Liberty Island and Ellis Island.", distanceKm: 8, travelTime: "25 min by ferry", area: "Liberty Island", suggestedDay: 1, displayOrder: 1 },
      { name: "Central Park", category: "Park", description: "843-acre urban oasis with lakes, meadows, a zoo, and the famous Bethesda Terrace and Fountain.", distanceKm: 4, travelTime: "15 min by subway", area: "Midtown/Uptown", suggestedDay: 1, displayOrder: 2 },
      { name: "Times Square", category: "Landmark", description: "The Crossroads of the World — neon-lit entertainment hub with Broadway theaters and giant digital billboards.", distanceKm: 0, travelTime: "Central landmark", area: "Midtown", suggestedDay: 1, displayOrder: 3 },
      { name: "Empire State Building", category: "Landmark", description: "Art Deco skyscraper with observation decks on the 86th and 102nd floors — stunning 360° views.", distanceKm: 1, travelTime: "5 min walk from Times Square", area: "Midtown", suggestedDay: 2, displayOrder: 4 },
      { name: "Brooklyn Bridge", category: "Landmark", description: "Historic 1883 suspension bridge — walk across for incredible Manhattan skyline views.", distanceKm: 5, travelTime: "15 min by subway", area: "Lower Manhattan", suggestedDay: 2, displayOrder: 5 },
      { name: "Metropolitan Museum of Art", category: "Museum", description: "One of the world's largest art museums with 2 million works spanning 5,000 years of culture.", distanceKm: 4, travelTime: "15 min by subway", area: "Upper East Side", suggestedDay: 2, displayOrder: 6 },
      { name: "Broadway", category: "Entertainment", description: "World-famous theater district with 41 professional theaters — catch a show in the evening.", distanceKm: 0.5, travelTime: "5 min walk from Times Square", area: "Theater District", suggestedDay: 3, displayOrder: 7 },
      { name: "One World Trade Center", category: "Landmark", description: "Tallest building in the Western Hemisphere with the 9/11 Memorial & Museum at its base.", distanceKm: 6, travelTime: "20 min by subway", area: "Financial District", suggestedDay: 3, displayOrder: 8 },
      { name: "High Line", category: "Park", description: "Elevated linear park built on a historic freight rail line with gardens, art, and Hudson River views.", distanceKm: 3, travelTime: "10 min by subway", area: "Chelsea", suggestedDay: 3, displayOrder: 9 },
      { name: "Wall Street", category: "Landmark", description: "Financial heart of America featuring the NYSE, Federal Hall, and the iconic Charging Bull statue.", distanceKm: 6, travelTime: "20 min by subway", area: "Financial District", suggestedDay: 3, displayOrder: 10 },
    ]},
    // DUBAI
    { cityName: "Dubai", countryCode: "AE", attractions: [
      { name: "Burj Khalifa", category: "Landmark", description: "The world's tallest building at 828m with observation decks on floors 124, 125, and 148.", distanceKm: 0, travelTime: "Central landmark", area: "Downtown Dubai", suggestedDay: 1, displayOrder: 1 },
      { name: "Dubai Mall", category: "Shopping", description: "One of the world's largest malls with 1,200+ stores, an aquarium, ice rink, and the Dubai Fountain.", distanceKm: 0.5, travelTime: "5 min walk from Burj Khalifa", area: "Downtown Dubai", suggestedDay: 1, displayOrder: 2 },
      { name: "Palm Jumeirah", category: "Landmark", description: "Iconic palm-shaped artificial island with luxury resorts, beaches, and Atlantis Aquaventure Waterpark.", distanceKm: 20, travelTime: "25 min by taxi/monorail", area: "Palm Jumeirah", suggestedDay: 2, displayOrder: 3 },
      { name: "Dubai Marina", category: "Entertainment", description: "Stunning waterfront district with skyscrapers, beachside dining, and yacht cruises.", distanceKm: 18, travelTime: "25 min by metro", area: "Dubai Marina", suggestedDay: 2, displayOrder: 4 },
      { name: "Gold Souk", category: "Shopping", description: "Traditional market in old Dubai with hundreds of jewelry shops and the world's largest gold ring.", distanceKm: 10, travelTime: "20 min by metro", area: "Deira", suggestedDay: 3, displayOrder: 5 },
      { name: "Dubai Creek", category: "Landmark", description: "Historic saltwater creek where Dubai began — take an abra ride across for 1 AED.", distanceKm: 10, travelTime: "20 min by metro", area: "Bur Dubai", suggestedDay: 3, displayOrder: 6 },
      { name: "Desert Safari", category: "Adventure", description: "Thrilling dune bashing, camel riding, sandboarding, and BBQ dinner in the Arabian desert.", distanceKm: 45, travelTime: "45 min drive", area: "Dubai Desert", suggestedDay: 4, displayOrder: 7 },
      { name: "Museum of the Future", category: "Museum", description: "Striking torus-shaped museum showcasing futuristic innovations with immersive experiences.", distanceKm: 2, travelTime: "10 min by metro", area: "Sheikh Zayed Road", suggestedDay: 1, displayOrder: 8 },
    ]},
    // SINGAPORE
    { cityName: "Singapore", countryCode: "SG", attractions: [
      { name: "Marina Bay Sands", category: "Landmark", description: "Iconic triple-tower hotel with the world's largest rooftop infinity pool and SkyPark observation deck.", distanceKm: 0, travelTime: "Central landmark", area: "Marina Bay", suggestedDay: 1, displayOrder: 1 },
      { name: "Gardens by the Bay", category: "Park", description: "Futuristic nature park with Supertree Grove, Cloud Forest, and Flower Dome — stunning light show at night.", distanceKm: 0.5, travelTime: "5 min walk from MBS", area: "Marina Bay", suggestedDay: 1, displayOrder: 2 },
      { name: "Sentosa Island", category: "Entertainment", description: "Resort island with Universal Studios, beaches, S.E.A. Aquarium, and Adventure Cove Waterpark.", distanceKm: 5, travelTime: "15 min by taxi/cable car", area: "Sentosa", suggestedDay: 2, displayOrder: 3 },
      { name: "Chinatown", category: "Cultural", description: "Historic district with traditional shophouses, Buddha Tooth Relic Temple, and hawker center food.", distanceKm: 2, travelTime: "10 min by MRT", area: "Chinatown", suggestedDay: 3, displayOrder: 4 },
      { name: "Little India", category: "Cultural", description: "Vibrant ethnic district with colorful temples, Tekka Centre market, and authentic Indian cuisine.", distanceKm: 3, travelTime: "12 min by MRT", area: "Little India", suggestedDay: 3, displayOrder: 5 },
      { name: "Singapore Flyer", category: "Landmark", description: "165m giant observation wheel — one of the world's largest — with stunning views of Marina Bay and beyond.", distanceKm: 1.5, travelTime: "5 min by taxi", area: "Marina Bay", suggestedDay: 1, displayOrder: 6 },
      { name: "Singapore Zoo & Night Safari", category: "Wildlife", description: "World-class open-concept zoo and the world's first nocturnal wildlife park with tram rides.", distanceKm: 18, travelTime: "30 min by taxi", area: "Mandai", suggestedDay: 4, displayOrder: 7 },
      { name: "Orchard Road", category: "Shopping", description: "Singapore's premier shopping street with mega-malls, luxury brands, and international dining.", distanceKm: 3, travelTime: "10 min by MRT", area: "Orchard", suggestedDay: 3, displayOrder: 8 },
    ]},
    // SYDNEY
    { cityName: "Sydney", countryCode: "AU", attractions: [
      { name: "Sydney Opera House", category: "Landmark", description: "UNESCO-listed architectural masterpiece — take a tour or watch a performance at this global icon.", distanceKm: 0, travelTime: "Central landmark", area: "Circular Quay", suggestedDay: 1, displayOrder: 1 },
      { name: "Sydney Harbour Bridge", category: "Landmark", description: "Affectionately called 'The Coathanger' — climb to the 134m summit for breathtaking harbor views.", distanceKm: 0.5, travelTime: "5 min walk from Opera House", area: "The Rocks", suggestedDay: 1, displayOrder: 2 },
      { name: "Bondi Beach", category: "Beach", description: "Australia's most famous beach with golden sand, surf culture, and the scenic Bondi to Coogee coastal walk.", distanceKm: 7, travelTime: "25 min by bus", area: "Bondi", suggestedDay: 2, displayOrder: 3 },
      { name: "Taronga Zoo", category: "Wildlife", description: "Harbourside zoo with over 4,000 animals and spectacular views of the Sydney skyline.", distanceKm: 4, travelTime: "12 min by ferry", area: "Mosman", suggestedDay: 3, displayOrder: 4 },
      { name: "The Rocks", category: "Cultural", description: "Sydney's oldest neighborhood with cobblestone streets, weekend markets, historic pubs, and galleries.", distanceKm: 0.5, travelTime: "5 min walk from Circular Quay", area: "The Rocks", suggestedDay: 1, displayOrder: 5 },
      { name: "Darling Harbour", category: "Entertainment", description: "Waterfront precinct with SEA LIFE Aquarium, WILD LIFE Zoo, Maritime Museum, and harbourside dining.", distanceKm: 1.5, travelTime: "10 min walk from city", area: "Darling Harbour", suggestedDay: 2, displayOrder: 6 },
      { name: "Manly Beach", category: "Beach", description: "Laid-back surf beach — take the iconic Manly Ferry for stunning harbour views en route.", distanceKm: 12, travelTime: "30 min by ferry", area: "Manly", suggestedDay: 4, displayOrder: 7 },
    ]},
    // BANGKOK
    { cityName: "Bangkok", countryCode: "TH", attractions: [
      { name: "Grand Palace", category: "Landmark", description: "Dazzling royal complex and former residence of Thai kings, home to the sacred Emerald Buddha.", distanceKm: 0, travelTime: "Central landmark", area: "Rattanakosin", suggestedDay: 1, displayOrder: 1 },
      { name: "Wat Pho", category: "Temple", description: "Home of the massive 46m Reclining Buddha and traditional Thai massage school.", distanceKm: 0.8, travelTime: "10 min walk from Grand Palace", area: "Rattanakosin", suggestedDay: 1, displayOrder: 2 },
      { name: "Wat Arun", category: "Temple", description: "Stunning 'Temple of Dawn' with a 79m central prang decorated with colorful porcelain — best at sunset.", distanceKm: 1.5, travelTime: "5 min ferry across river", area: "Thonburi", suggestedDay: 1, displayOrder: 3 },
      { name: "Chatuchak Weekend Market", category: "Shopping", description: "One of the world's largest weekend markets with 15,000+ stalls selling everything imaginable.", distanceKm: 8, travelTime: "25 min by BTS/metro", area: "Chatuchak", suggestedDay: 2, displayOrder: 4 },
      { name: "Khao San Road", category: "Entertainment", description: "Legendary backpacker street with budget guesthouses, street food, bars, and a vibrant nightlife scene.", distanceKm: 2, travelTime: "10 min by tuk-tuk", area: "Banglamphu", suggestedDay: 3, displayOrder: 5 },
      { name: "MBK Center", category: "Shopping", description: "Eight-floor shopping paradise with 2,000+ shops offering electronics, fashion, and souvenirs at bargain prices.", distanceKm: 3, travelTime: "10 min by BTS", area: "Siam", suggestedDay: 2, displayOrder: 6 },
      { name: "Damnoen Saduak Floating Market", category: "Cultural", description: "Famous canal market where vendors sell fresh produce and Thai food from traditional wooden boats.", distanceKm: 80, travelTime: "1.5 hours by car", area: "Ratchaburi", suggestedDay: 4, displayOrder: 7 },
      { name: "Asiatique", category: "Entertainment", description: "Open-air riverside night market with boutiques, restaurants, and a giant Ferris wheel.", distanceKm: 4, travelTime: "15 min by taxi", area: "Charoenkrung", suggestedDay: 3, displayOrder: 8 },
    ]},
    // ROME
    { cityName: "Rome", countryCode: "IT", attractions: [
      { name: "Colosseum", category: "Landmark", description: "The largest ancient amphitheater ever built — a marvel of Roman engineering completed in 80 AD.", distanceKm: 0, travelTime: "Central landmark", area: "Centro Storico", suggestedDay: 1, displayOrder: 1 },
      { name: "Roman Forum", category: "Landmark", description: "Ancient Rome's civic center with ruins of temples, basilicas, and the Senate House.", distanceKm: 0.2, travelTime: "2 min walk from Colosseum", area: "Centro Storico", suggestedDay: 1, displayOrder: 2 },
      { name: "Trevi Fountain", category: "Landmark", description: "Baroque masterpiece and Rome's largest fountain — toss a coin to ensure your return to the Eternal City.", distanceKm: 2, travelTime: "15 min walk", area: "Trevi", suggestedDay: 2, displayOrder: 3 },
      { name: "Pantheon", category: "Landmark", description: "Remarkably preserved 2,000-year-old temple with the world's largest unreinforced concrete dome.", distanceKm: 1.5, travelTime: "10 min walk from Trevi", area: "Piazza della Rotonda", suggestedDay: 2, displayOrder: 4 },
      { name: "Vatican Museums & Sistine Chapel", category: "Museum", description: "One of the world's greatest art collections featuring Michelangelo's masterpiece ceiling frescoes.", distanceKm: 3.5, travelTime: "20 min by metro", area: "Vatican City", suggestedDay: 3, displayOrder: 5 },
      { name: "St. Peter's Basilica", category: "Temple", description: "The largest church in Christendom with Michelangelo's Pietà and a dome offering panoramic Rome views.", distanceKm: 3.5, travelTime: "20 min by metro", area: "Vatican City", suggestedDay: 3, displayOrder: 6 },
    ]},
    // ISTANBUL
    { cityName: "Istanbul", countryCode: "TR", attractions: [
      { name: "Hagia Sophia", category: "Landmark", description: "Architectural marvel that served as church, mosque, and museum — with stunning dome and mosaics.", distanceKm: 0, travelTime: "Central landmark", area: "Sultanahmet", suggestedDay: 1, displayOrder: 1 },
      { name: "Blue Mosque", category: "Temple", description: "Magnificent 17th-century mosque with six minarets and 20,000 hand-painted blue Iznik tiles.", distanceKm: 0.3, travelTime: "3 min walk", area: "Sultanahmet", suggestedDay: 1, displayOrder: 2 },
      { name: "Topkapi Palace", category: "Landmark", description: "Opulent 15th-century Ottoman palace with treasury, harem quarters, and Bosphorus views.", distanceKm: 0.5, travelTime: "7 min walk", area: "Sultanahmet", suggestedDay: 1, displayOrder: 3 },
      { name: "Grand Bazaar", category: "Shopping", description: "One of the world's oldest and largest covered markets with 4,000+ shops across 61 streets.", distanceKm: 1.5, travelTime: "15 min walk / 5 min tram", area: "Beyazıt", suggestedDay: 2, displayOrder: 4 },
      { name: "Basilica Cistern", category: "Landmark", description: "Mysterious 6th-century underground water storage with 336 columns and atmospheric lighting.", distanceKm: 0.2, travelTime: "3 min walk from Hagia Sophia", area: "Sultanahmet", suggestedDay: 1, displayOrder: 5 },
      { name: "Bosphorus Cruise", category: "Adventure", description: "Scenic boat ride between Europe and Asia with palaces, mansions, and bridges along the shores.", distanceKm: 0, travelTime: "Departs from Eminönü pier", area: "Bosphorus", suggestedDay: 3, displayOrder: 6 },
      { name: "Galata Tower", category: "Landmark", description: "14th-century stone tower with a 360° observation deck offering incredible views of the Golden Horn.", distanceKm: 2.5, travelTime: "10 min by tram", area: "Galata", suggestedDay: 2, displayOrder: 7 },
    ]},
    // SEOUL
    { cityName: "Seoul", countryCode: "KR", attractions: [
      { name: "Gyeongbokgung Palace", category: "Landmark", description: "The grandest of Seoul's Five Grand Palaces — watch the Royal Guard changing ceremony in traditional costume.", distanceKm: 0, travelTime: "Central landmark", area: "Jongno", suggestedDay: 1, displayOrder: 1 },
      { name: "Bukchon Hanok Village", category: "Cultural", description: "Picturesque neighborhood with 600-year-old traditional Korean houses, now cultural centers and tea houses.", distanceKm: 1, travelTime: "12 min walk from Gyeongbokgung", area: "Jongno", suggestedDay: 1, displayOrder: 2 },
      { name: "Myeongdong", category: "Shopping", description: "Seoul's premier shopping district with K-beauty flagship stores, street food stalls, and fashion boutiques.", distanceKm: 2.5, travelTime: "10 min by metro", area: "Jung-gu", suggestedDay: 2, displayOrder: 3 },
      { name: "N Seoul Tower", category: "Landmark", description: "236m tower atop Namsan Mountain offering panoramic city views — especially romantic at night with love locks.", distanceKm: 3, travelTime: "15 min by cable car", area: "Namsan", suggestedDay: 2, displayOrder: 4 },
      { name: "Hongdae", category: "Entertainment", description: "Youthful district near Hongik University with indie music, street performances, themed cafés, and nightlife.", distanceKm: 5, travelTime: "20 min by metro", area: "Mapo-gu", suggestedDay: 3, displayOrder: 5 },
      { name: "Insadong", category: "Cultural", description: "Traditional cultural street with art galleries, antique shops, traditional tea houses, and calligraphy supplies.", distanceKm: 1.5, travelTime: "5 min by taxi", area: "Jongno", suggestedDay: 1, displayOrder: 6 },
      { name: "Gangnam", category: "Entertainment", description: "Upscale district made famous by PSY — luxury boutiques, K-beauty clinics, and trendy restaurants.", distanceKm: 7, travelTime: "25 min by metro", area: "Gangnam-gu", suggestedDay: 3, displayOrder: 7 },
      { name: "DMZ Tour", category: "Historical", description: "Half-day tour to the Korean Demilitarized Zone — peer into North Korea at the Joint Security Area.", distanceKm: 50, travelTime: "1 hour by tour bus", area: "DMZ", suggestedDay: 4, displayOrder: 8 },
    ]},
    // MUMBAI
    { cityName: "Mumbai", countryCode: "IN", attractions: [
      { name: "Gateway of India", category: "Landmark", description: "Iconic 26m basalt arch overlooking the Arabian Sea, built to commemorate King George V's visit in 1911.", distanceKm: 0, travelTime: "Central landmark", area: "Colaba", suggestedDay: 1, displayOrder: 1 },
      { name: "Marine Drive", category: "Landmark", description: "3.6km C-shaped boulevard along the coast known as the 'Queen's Necklace' — stunning at sunset.", distanceKm: 2, travelTime: "10 min drive", area: "Marine Lines", suggestedDay: 1, displayOrder: 2 },
      { name: "Chhatrapati Shivaji Terminus", category: "Landmark", description: "UNESCO-listed Victorian Gothic railway station — Mumbai's busiest and most beautiful building.", distanceKm: 3, travelTime: "15 min by taxi", area: "Fort", suggestedDay: 2, displayOrder: 3 },
      { name: "Elephanta Caves", category: "Historical", description: "UNESCO site — 7th-century rock-cut cave temples on an island in Mumbai Harbour with massive Shiva sculptures.", distanceKm: 10, travelTime: "1 hour by ferry", area: "Elephanta Island", suggestedDay: 2, displayOrder: 4 },
      { name: "Juhu Beach", category: "Beach", description: "Mumbai's most popular beach with street food stalls serving pav bhaji, chaat, and coconut water.", distanceKm: 18, travelTime: "45 min drive", area: "Juhu", suggestedDay: 3, displayOrder: 5 },
      { name: "Dharavi", category: "Cultural", description: "One of Asia's largest slums — take a guided tour to see its thriving small-scale industries and community spirit.", distanceKm: 8, travelTime: "30 min drive", area: "Dharavi", suggestedDay: 3, displayOrder: 6 },
      { name: "Colaba Causeway", category: "Shopping", description: "Bustling street market with jewelry, leather goods, clothes, and antiques — a bargain hunter's paradise.", distanceKm: 0.5, travelTime: "5 min walk from Gateway", area: "Colaba", suggestedDay: 1, displayOrder: 7 },
    ]},
    // HONG KONG
    { cityName: "Hong Kong", countryCode: "HK", attractions: [
      { name: "Victoria Peak", category: "Landmark", description: "The highest point on Hong Kong Island with the world-famous Peak Tram and stunning skyline views.", distanceKm: 4, travelTime: "15 min by Peak Tram", area: "The Peak", suggestedDay: 1, displayOrder: 1 },
      { name: "Star Ferry", category: "Landmark", description: "Historic ferry crossing Victoria Harbour since 1888 — the best value sightseeing in Hong Kong.", distanceKm: 0.5, travelTime: "10 min crossing", area: "Victoria Harbour", suggestedDay: 1, displayOrder: 2 },
      { name: "Temple Street Night Market", category: "Shopping", description: "Vibrant night market with fortune tellers, street food, and bargain goods — pure Hong Kong atmosphere.", distanceKm: 2, travelTime: "10 min by MTR", area: "Kowloon", suggestedDay: 2, displayOrder: 3 },
      { name: "Tian Tan Buddha", category: "Temple", description: "Massive 34m bronze Buddha statue atop 268 steps on Lantau Island — visible from miles away.", distanceKm: 30, travelTime: "45 min by MTR + cable car", area: "Lantau Island", suggestedDay: 3, displayOrder: 4 },
      { name: "Mong Kok", category: "Shopping", description: "One of the world's most densely populated areas with ladies' market, sneaker street, and goldfish market.", distanceKm: 3, travelTime: "15 min by MTR", area: "Mong Kok", suggestedDay: 2, displayOrder: 5 },
      { name: "Ocean Park", category: "Entertainment", description: "Marine-themed amusement park with roller coasters, aquariums, and giant pandas on a scenic coastal setting.", distanceKm: 8, travelTime: "25 min by MTR", area: "Wong Chuk Hang", suggestedDay: 4, displayOrder: 6 },
    ]},
  ];

  for (const ad of attractionsData) {
    const city = await prisma.city.findFirst({
      where: { name: ad.cityName, country: { code: ad.countryCode } },
    });
    if (!city) {
      console.log(`⚠️  City not found: ${ad.cityName} (${ad.countryCode}) — skipping attractions`);
      continue;
    }

    // Delete existing attractions for this city to avoid duplicates on re-seed
    await prisma.attraction.deleteMany({ where: { cityId: city.id } });

    for (const attr of ad.attractions) {
      await prisma.attraction.create({
        data: { ...attr, cityId: city.id },
      });
    }
    console.log(`✅ ${ad.cityName}: ${ad.attractions.length} attractions seeded`);
  }
}
