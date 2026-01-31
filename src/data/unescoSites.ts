export interface UNESCOSite {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  type: "Cultural" | "Natural" | "Mixed";
  year: number;
  lat: number;
  lng: number;
  unescoId?: number;
}

export const unescoSites: UNESCOSite[] = [
  // Most famous and visited UNESCO sites - Top 200

  // The "New Seven Wonders" and iconic sites
  { id: "great-wall", name: "Great Wall of China", country: "China", countryCode: "CN", type: "Cultural", year: 1987, lat: 40.4319, lng: 116.5704, unescoId: 438 },
  { id: "machu-picchu", name: "Machu Picchu", country: "Peru", countryCode: "PE", type: "Mixed", year: 1983, lat: -13.1631, lng: -72.5450, unescoId: 274 },
  { id: "petra", name: "Petra", country: "Jordan", countryCode: "JO", type: "Cultural", year: 1985, lat: 30.3285, lng: 35.4444, unescoId: 326 },
  { id: "taj-mahal", name: "Taj Mahal", country: "India", countryCode: "IN", type: "Cultural", year: 1983, lat: 27.1751, lng: 78.0421, unescoId: 252 },
  { id: "colosseum", name: "Colosseum", country: "Italy", countryCode: "IT", type: "Cultural", year: 1980, lat: 41.8902, lng: 12.4922, unescoId: 91 },
  { id: "chichen-itza", name: "Chichen Itza", country: "Mexico", countryCode: "MX", type: "Cultural", year: 1988, lat: 20.6843, lng: -88.5678, unescoId: 483 },
  { id: "christ-redeemer", name: "Christ the Redeemer", country: "Brazil", countryCode: "BR", type: "Cultural", year: 2012, lat: -22.9519, lng: -43.2105, unescoId: 1100 },
  { id: "pyramids-giza", name: "Pyramids of Giza", country: "Egypt", countryCode: "EG", type: "Cultural", year: 1979, lat: 29.9792, lng: 31.1342, unescoId: 86 },

  // Major Natural Wonders
  { id: "great-barrier-reef", name: "Great Barrier Reef", country: "Australia", countryCode: "AU", type: "Natural", year: 1981, lat: -18.2871, lng: 147.6992, unescoId: 154 },
  { id: "grand-canyon", name: "Grand Canyon", country: "United States", countryCode: "US", type: "Natural", year: 1979, lat: 36.1070, lng: -112.1130, unescoId: 75 },
  { id: "serengeti", name: "Serengeti National Park", country: "Tanzania", countryCode: "TZ", type: "Natural", year: 1981, lat: -2.3333, lng: 34.8333, unescoId: 156 },
  { id: "galapagos", name: "Galapagos Islands", country: "Ecuador", countryCode: "EC", type: "Natural", year: 1978, lat: -0.9538, lng: -90.9656, unescoId: 1 },
  { id: "yellowstone", name: "Yellowstone National Park", country: "United States", countryCode: "US", type: "Natural", year: 1978, lat: 44.4280, lng: -110.5885, unescoId: 28 },
  { id: "victoria-falls", name: "Victoria Falls", country: "Zambia/Zimbabwe", countryCode: "ZM", type: "Natural", year: 1989, lat: -17.9243, lng: 25.8572, unescoId: 509 },
  { id: "iguazu-falls", name: "Iguazu National Park", country: "Argentina", countryCode: "AR", type: "Natural", year: 1984, lat: -25.6953, lng: -54.4367, unescoId: 303 },
  { id: "ha-long-bay", name: "Ha Long Bay", country: "Vietnam", countryCode: "VN", type: "Natural", year: 1994, lat: 20.9101, lng: 107.1839, unescoId: 672 },
  { id: "uluru", name: "Uluru-Kata Tjuta", country: "Australia", countryCode: "AU", type: "Mixed", year: 1987, lat: -25.3444, lng: 131.0369, unescoId: 447 },
  { id: "banff", name: "Canadian Rocky Mountain Parks", country: "Canada", countryCode: "CA", type: "Natural", year: 1984, lat: 51.4968, lng: -115.9281, unescoId: 304 },

  // Italy - Rich in heritage
  { id: "venice", name: "Venice and its Lagoon", country: "Italy", countryCode: "IT", type: "Cultural", year: 1987, lat: 45.4408, lng: 12.3155, unescoId: 394 },
  { id: "florence", name: "Historic Centre of Florence", country: "Italy", countryCode: "IT", type: "Cultural", year: 1982, lat: 43.7696, lng: 11.2558, unescoId: 174 },
  { id: "pompeii", name: "Pompeii", country: "Italy", countryCode: "IT", type: "Cultural", year: 1997, lat: 40.7509, lng: 14.4869, unescoId: 829 },
  { id: "cinque-terre", name: "Cinque Terre", country: "Italy", countryCode: "IT", type: "Cultural", year: 1997, lat: 44.1461, lng: 9.6439, unescoId: 826 },
  { id: "rome-historic", name: "Historic Centre of Rome", country: "Italy", countryCode: "IT", type: "Cultural", year: 1980, lat: 41.9028, lng: 12.4964, unescoId: 91 },
  { id: "amalfi-coast", name: "Amalfi Coast", country: "Italy", countryCode: "IT", type: "Cultural", year: 1997, lat: 40.6340, lng: 14.6027, unescoId: 830 },
  { id: "pisa", name: "Piazza del Duomo, Pisa", country: "Italy", countryCode: "IT", type: "Cultural", year: 1987, lat: 43.7230, lng: 10.3966, unescoId: 395 },
  { id: "siena", name: "Historic Centre of Siena", country: "Italy", countryCode: "IT", type: "Cultural", year: 1995, lat: 43.3188, lng: 11.3308, unescoId: 717 },
  { id: "vatican", name: "Vatican City", country: "Vatican", countryCode: "VA", type: "Cultural", year: 1984, lat: 41.9029, lng: 12.4534, unescoId: 286 },
  { id: "trulli-alberobello", name: "Trulli of Alberobello", country: "Italy", countryCode: "IT", type: "Cultural", year: 1996, lat: 40.7834, lng: 17.2365, unescoId: 787 },
  { id: "san-gimignano", name: "San Gimignano", country: "Italy", countryCode: "IT", type: "Cultural", year: 1990, lat: 43.4677, lng: 11.0433, unescoId: 550 },

  // France
  { id: "versailles", name: "Palace of Versailles", country: "France", countryCode: "FR", type: "Cultural", year: 1979, lat: 48.8049, lng: 2.1204, unescoId: 83 },
  { id: "mont-st-michel", name: "Mont-Saint-Michel", country: "France", countryCode: "FR", type: "Cultural", year: 1979, lat: 48.6361, lng: -1.5115, unescoId: 80 },
  { id: "louvre", name: "Banks of the Seine", country: "France", countryCode: "FR", type: "Cultural", year: 1991, lat: 48.8606, lng: 2.3376, unescoId: 600 },
  { id: "chartres-cathedral", name: "Chartres Cathedral", country: "France", countryCode: "FR", type: "Cultural", year: 1979, lat: 48.4476, lng: 1.4877, unescoId: 81 },
  { id: "carcassonne", name: "Historic Fortified City of Carcassonne", country: "France", countryCode: "FR", type: "Cultural", year: 1997, lat: 43.2130, lng: 2.3491, unescoId: 345 },
  { id: "pont-du-gard", name: "Pont du Gard", country: "France", countryCode: "FR", type: "Cultural", year: 1985, lat: 43.9470, lng: 4.5354, unescoId: 344 },
  { id: "loire-valley", name: "Loire Valley", country: "France", countryCode: "FR", type: "Cultural", year: 2000, lat: 47.3499, lng: 0.7203, unescoId: 933 },
  { id: "avignon", name: "Historic Centre of Avignon", country: "France", countryCode: "FR", type: "Cultural", year: 1995, lat: 43.9493, lng: 4.8055, unescoId: 228 },
  { id: "bordeaux", name: "Bordeaux, Port of the Moon", country: "France", countryCode: "FR", type: "Cultural", year: 2007, lat: 44.8378, lng: -0.5792, unescoId: 1256 },
  { id: "strasbourg", name: "Strasbourg Grande Île", country: "France", countryCode: "FR", type: "Cultural", year: 1988, lat: 48.5734, lng: 7.7521, unescoId: 495 },

  // Spain
  { id: "alhambra", name: "Alhambra", country: "Spain", countryCode: "ES", type: "Cultural", year: 1984, lat: 37.1760, lng: -3.5881, unescoId: 314 },
  { id: "sagrada-familia", name: "Works of Antoni Gaudi", country: "Spain", countryCode: "ES", type: "Cultural", year: 1984, lat: 41.4036, lng: 2.1744, unescoId: 320 },
  { id: "cordoba-mosque", name: "Mosque-Cathedral of Córdoba", country: "Spain", countryCode: "ES", type: "Cultural", year: 1984, lat: 37.8789, lng: -4.7794, unescoId: 313 },
  { id: "seville-cathedral", name: "Cathedral of Seville", country: "Spain", countryCode: "ES", type: "Cultural", year: 1987, lat: 37.3861, lng: -5.9926, unescoId: 383 },
  { id: "toledo", name: "Historic City of Toledo", country: "Spain", countryCode: "ES", type: "Cultural", year: 1986, lat: 39.8628, lng: -4.0273, unescoId: 379 },
  { id: "santiago-compostela", name: "Santiago de Compostela", country: "Spain", countryCode: "ES", type: "Cultural", year: 1985, lat: 42.8805, lng: -8.5457, unescoId: 347 },
  { id: "segovia", name: "Old Town of Segovia", country: "Spain", countryCode: "ES", type: "Cultural", year: 1985, lat: 40.9481, lng: -4.1184, unescoId: 311 },
  { id: "salamanca", name: "Old City of Salamanca", country: "Spain", countryCode: "ES", type: "Cultural", year: 1988, lat: 40.9650, lng: -5.6640, unescoId: 381 },
  { id: "ibiza", name: "Ibiza, Biodiversity and Culture", country: "Spain", countryCode: "ES", type: "Mixed", year: 1999, lat: 38.9067, lng: 1.4206, unescoId: 417 },

  // United Kingdom
  { id: "stonehenge", name: "Stonehenge", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1986, lat: 51.1789, lng: -1.8262, unescoId: 373 },
  { id: "edinburgh", name: "Old and New Towns of Edinburgh", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1995, lat: 55.9533, lng: -3.1883, unescoId: 728 },
  { id: "tower-of-london", name: "Tower of London", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1988, lat: 51.5081, lng: -0.0759, unescoId: 488 },
  { id: "westminster", name: "Westminster Abbey", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1987, lat: 51.4993, lng: -0.1273, unescoId: 426 },
  { id: "bath", name: "City of Bath", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1987, lat: 51.3811, lng: -2.3590, unescoId: 428 },
  { id: "canterbury-cathedral", name: "Canterbury Cathedral", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1988, lat: 51.2802, lng: 1.0830, unescoId: 496 },
  { id: "hadrians-wall", name: "Hadrian's Wall", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1987, lat: 55.0268, lng: -2.3798, unescoId: 430 },
  { id: "giants-causeway", name: "Giant's Causeway", country: "United Kingdom", countryCode: "GB", type: "Natural", year: 1986, lat: 55.2408, lng: -6.5116, unescoId: 369 },
  { id: "blenheim-palace", name: "Blenheim Palace", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1987, lat: 51.8414, lng: -1.3614, unescoId: 425 },

  // Germany
  { id: "neuschwanstein", name: "Castles of King Ludwig II", country: "Germany", countryCode: "DE", type: "Cultural", year: 2024, lat: 47.5576, lng: 10.7498, unescoId: 1726 },
  { id: "cologne-cathedral", name: "Cologne Cathedral", country: "Germany", countryCode: "DE", type: "Cultural", year: 1996, lat: 50.9413, lng: 6.9583, unescoId: 292 },
  { id: "berlin-museums", name: "Museum Island, Berlin", country: "Germany", countryCode: "DE", type: "Cultural", year: 1999, lat: 52.5169, lng: 13.4019, unescoId: 896 },
  { id: "potsdam-palaces", name: "Palaces of Potsdam and Berlin", country: "Germany", countryCode: "DE", type: "Cultural", year: 1990, lat: 52.4034, lng: 13.0388, unescoId: 532 },
  { id: "bamberg", name: "Town of Bamberg", country: "Germany", countryCode: "DE", type: "Cultural", year: 1993, lat: 49.8988, lng: 10.9028, unescoId: 624 },
  { id: "regensburg", name: "Old Town of Regensburg", country: "Germany", countryCode: "DE", type: "Cultural", year: 2006, lat: 49.0134, lng: 12.1016, unescoId: 1155 },
  { id: "aachen-cathedral", name: "Aachen Cathedral", country: "Germany", countryCode: "DE", type: "Cultural", year: 1978, lat: 50.7746, lng: 6.0839, unescoId: 3 },
  { id: "wartburg-castle", name: "Wartburg Castle", country: "Germany", countryCode: "DE", type: "Cultural", year: 1999, lat: 50.9661, lng: 10.3065, unescoId: 897 },

  // Greece
  { id: "acropolis", name: "Acropolis of Athens", country: "Greece", countryCode: "GR", type: "Cultural", year: 1987, lat: 37.9715, lng: 23.7267, unescoId: 404 },
  { id: "delphi", name: "Archaeological Site of Delphi", country: "Greece", countryCode: "GR", type: "Cultural", year: 1987, lat: 38.4824, lng: 22.5006, unescoId: 393 },
  { id: "meteora", name: "Meteora", country: "Greece", countryCode: "GR", type: "Mixed", year: 1988, lat: 39.7139, lng: 21.6312, unescoId: 455 },
  { id: "olympia", name: "Archaeological Site of Olympia", country: "Greece", countryCode: "GR", type: "Cultural", year: 1989, lat: 37.6386, lng: 21.6300, unescoId: 517 },
  { id: "delos", name: "Delos", country: "Greece", countryCode: "GR", type: "Cultural", year: 1990, lat: 37.3965, lng: 25.2686, unescoId: 530 },
  { id: "rhodes", name: "Medieval City of Rhodes", country: "Greece", countryCode: "GR", type: "Cultural", year: 1988, lat: 36.4441, lng: 28.2260, unescoId: 493 },
  { id: "corfu", name: "Old Town of Corfu", country: "Greece", countryCode: "GR", type: "Cultural", year: 2007, lat: 39.6243, lng: 19.9217, unescoId: 978 },

  // Turkey
  { id: "hagia-sophia", name: "Historic Areas of Istanbul", country: "Turkey", countryCode: "TR", type: "Cultural", year: 1985, lat: 41.0086, lng: 28.9802, unescoId: 356 },
  { id: "cappadocia", name: "Göreme and Cappadocia", country: "Turkey", countryCode: "TR", type: "Mixed", year: 1985, lat: 38.6431, lng: 34.8289, unescoId: 357 },
  { id: "ephesus", name: "Ephesus", country: "Turkey", countryCode: "TR", type: "Cultural", year: 2015, lat: 37.9410, lng: 27.3419, unescoId: 1018 },
  { id: "pamukkale", name: "Pamukkale-Hierapolis", country: "Turkey", countryCode: "TR", type: "Mixed", year: 1988, lat: 37.9204, lng: 29.1217, unescoId: 485 },
  { id: "troy", name: "Archaeological Site of Troy", country: "Turkey", countryCode: "TR", type: "Cultural", year: 1998, lat: 39.9575, lng: 26.2389, unescoId: 849 },

  // Japan
  { id: "ancient-kyoto", name: "Historic Monuments of Ancient Kyoto", country: "Japan", countryCode: "JP", type: "Cultural", year: 1994, lat: 35.0116, lng: 135.7681, unescoId: 688 },
  { id: "hiroshima", name: "Hiroshima Peace Memorial", country: "Japan", countryCode: "JP", type: "Cultural", year: 1996, lat: 34.3955, lng: 132.4536, unescoId: 775 },
  { id: "mount-fuji", name: "Fujisan (Mount Fuji)", country: "Japan", countryCode: "JP", type: "Cultural", year: 2013, lat: 35.3606, lng: 138.7274, unescoId: 1418 },
  { id: "nara", name: "Historic Monuments of Ancient Nara", country: "Japan", countryCode: "JP", type: "Cultural", year: 1998, lat: 34.6851, lng: 135.8048, unescoId: 870 },
  { id: "himeji-castle", name: "Himeji Castle", country: "Japan", countryCode: "JP", type: "Cultural", year: 1993, lat: 34.8394, lng: 134.6939, unescoId: 661 },
  { id: "itsukushima", name: "Itsukushima Shinto Shrine", country: "Japan", countryCode: "JP", type: "Cultural", year: 1996, lat: 34.2962, lng: 132.3197, unescoId: 776 },
  { id: "shirakawa", name: "Shirakawa-go and Gokayama", country: "Japan", countryCode: "JP", type: "Cultural", year: 1995, lat: 36.2571, lng: 136.9065, unescoId: 734 },
  { id: "nikko", name: "Shrines and Temples of Nikko", country: "Japan", countryCode: "JP", type: "Cultural", year: 1999, lat: 36.7582, lng: 139.5992, unescoId: 913 },

  // China
  { id: "forbidden-city", name: "Imperial Palaces (Forbidden City)", country: "China", countryCode: "CN", type: "Cultural", year: 1987, lat: 39.9163, lng: 116.3972, unescoId: 439 },
  { id: "terracotta-army", name: "Terracotta Army", country: "China", countryCode: "CN", type: "Cultural", year: 1987, lat: 34.3848, lng: 109.2734, unescoId: 441 },
  { id: "guilin-karst", name: "South China Karst", country: "China", countryCode: "CN", type: "Natural", year: 2007, lat: 25.0003, lng: 110.2872, unescoId: 1248 },
  { id: "zhangjiajie", name: "Zhangjiajie National Forest", country: "China", countryCode: "CN", type: "Natural", year: 1992, lat: 29.3167, lng: 110.4333, unescoId: 640 },
  { id: "potala-palace", name: "Potala Palace, Lhasa", country: "China", countryCode: "CN", type: "Cultural", year: 1994, lat: 29.6574, lng: 91.1179, unescoId: 707 },
  { id: "summer-palace", name: "Summer Palace, Beijing", country: "China", countryCode: "CN", type: "Cultural", year: 1998, lat: 39.9998, lng: 116.2755, unescoId: 880 },
  { id: "temple-heaven", name: "Temple of Heaven, Beijing", country: "China", countryCode: "CN", type: "Cultural", year: 1998, lat: 39.8822, lng: 116.4066, unescoId: 881 },
  { id: "leshan-buddha", name: "Leshan Giant Buddha", country: "China", countryCode: "CN", type: "Cultural", year: 1996, lat: 29.5445, lng: 103.7734, unescoId: 779 },
  { id: "jiuzhaigou", name: "Jiuzhaigou Valley", country: "China", countryCode: "CN", type: "Natural", year: 1992, lat: 33.2600, lng: 103.9200, unescoId: 637 },
  { id: "huangshan", name: "Mount Huangshan", country: "China", countryCode: "CN", type: "Mixed", year: 1990, lat: 30.1300, lng: 118.1700, unescoId: 547 },

  // India
  { id: "red-fort", name: "Red Fort Complex", country: "India", countryCode: "IN", type: "Cultural", year: 2007, lat: 28.6562, lng: 77.2410, unescoId: 231 },
  { id: "khajuraho", name: "Khajuraho Group of Monuments", country: "India", countryCode: "IN", type: "Cultural", year: 1986, lat: 24.8318, lng: 79.9199, unescoId: 240 },
  { id: "ajanta-caves", name: "Ajanta Caves", country: "India", countryCode: "IN", type: "Cultural", year: 1983, lat: 20.5525, lng: 75.7003, unescoId: 242 },
  { id: "ellora-caves", name: "Ellora Caves", country: "India", countryCode: "IN", type: "Cultural", year: 1983, lat: 20.0269, lng: 75.1792, unescoId: 243 },
  { id: "jaipur-city", name: "Jaipur City", country: "India", countryCode: "IN", type: "Cultural", year: 2019, lat: 26.9124, lng: 75.7873, unescoId: 1605 },
  { id: "fatehpur-sikri", name: "Fatehpur Sikri", country: "India", countryCode: "IN", type: "Cultural", year: 1986, lat: 27.0945, lng: 77.6679, unescoId: 255 },
  { id: "qutub-minar", name: "Qutub Minar", country: "India", countryCode: "IN", type: "Cultural", year: 1993, lat: 28.5244, lng: 77.1855, unescoId: 233 },
  { id: "hampi", name: "Group of Monuments at Hampi", country: "India", countryCode: "IN", type: "Cultural", year: 1986, lat: 15.3350, lng: 76.4600, unescoId: 241 },
  { id: "konark", name: "Sun Temple, Konark", country: "India", countryCode: "IN", type: "Cultural", year: 1984, lat: 19.8876, lng: 86.0945, unescoId: 246 },

  // Southeast Asia
  { id: "angkor-wat", name: "Angkor", country: "Cambodia", countryCode: "KH", type: "Cultural", year: 1992, lat: 13.4125, lng: 103.8670, unescoId: 668 },
  { id: "borobudur", name: "Borobudur Temple", country: "Indonesia", countryCode: "ID", type: "Cultural", year: 1991, lat: -7.6079, lng: 110.2038, unescoId: 592 },
  { id: "prambanan", name: "Prambanan Temple", country: "Indonesia", countryCode: "ID", type: "Cultural", year: 1991, lat: -7.7520, lng: 110.4914, unescoId: 642 },
  { id: "komodo", name: "Komodo National Park", country: "Indonesia", countryCode: "ID", type: "Natural", year: 1991, lat: -8.5500, lng: 119.4500, unescoId: 609 },
  { id: "bagan", name: "Bagan", country: "Myanmar", countryCode: "MM", type: "Cultural", year: 2019, lat: 21.1717, lng: 94.8585, unescoId: 1588 },
  { id: "ayutthaya", name: "Historic City of Ayutthaya", country: "Thailand", countryCode: "TH", type: "Cultural", year: 1991, lat: 14.3534, lng: 100.5614, unescoId: 576 },
  { id: "sukhothai", name: "Historic Town of Sukhothai", country: "Thailand", countryCode: "TH", type: "Cultural", year: 1991, lat: 17.0136, lng: 99.7033, unescoId: 574 },
  { id: "luang-prabang", name: "Luang Prabang", country: "Laos", countryCode: "LA", type: "Cultural", year: 1995, lat: 19.8856, lng: 102.1347, unescoId: 479 },
  { id: "hoi-an", name: "Hoi An Ancient Town", country: "Vietnam", countryCode: "VN", type: "Cultural", year: 1999, lat: 15.8801, lng: 108.3380, unescoId: 948 },
  { id: "hue", name: "Complex of Hue Monuments", country: "Vietnam", countryCode: "VN", type: "Cultural", year: 1993, lat: 16.4698, lng: 107.5791, unescoId: 678 },
  { id: "phong-nha", name: "Phong Nha-Ke Bang", country: "Vietnam", countryCode: "VN", type: "Natural", year: 2003, lat: 17.5833, lng: 106.2833, unescoId: 951 },
  { id: "george-town", name: "Melaka and George Town", country: "Malaysia", countryCode: "MY", type: "Cultural", year: 2008, lat: 5.4141, lng: 100.3288, unescoId: 1223 },
  { id: "kinabalu", name: "Kinabalu Park", country: "Malaysia", countryCode: "MY", type: "Natural", year: 2000, lat: 6.0833, lng: 116.5500, unescoId: 1012 },
  { id: "singapore-botanic", name: "Singapore Botanic Gardens", country: "Singapore", countryCode: "SG", type: "Cultural", year: 2015, lat: 1.3138, lng: 103.8159, unescoId: 1483 },
  { id: "vigan", name: "Historic City of Vigan", country: "Philippines", countryCode: "PH", type: "Cultural", year: 1999, lat: 17.5747, lng: 120.3869, unescoId: 502 },
  { id: "rice-terraces", name: "Rice Terraces of the Philippine Cordilleras", country: "Philippines", countryCode: "PH", type: "Cultural", year: 1995, lat: 16.9167, lng: 121.0500, unescoId: 722 },

  // Middle East
  { id: "jerusalem", name: "Old City of Jerusalem", country: "Israel", countryCode: "IL", type: "Cultural", year: 1981, lat: 31.7767, lng: 35.2345, unescoId: 148 },
  { id: "masada", name: "Masada", country: "Israel", countryCode: "IL", type: "Cultural", year: 2001, lat: 31.3156, lng: 35.3535, unescoId: 1040 },
  { id: "baalbek", name: "Baalbek", country: "Lebanon", countryCode: "LB", type: "Cultural", year: 1984, lat: 34.0069, lng: 36.2036, unescoId: 294 },
  { id: "byblos", name: "Byblos", country: "Lebanon", countryCode: "LB", type: "Cultural", year: 1984, lat: 34.1233, lng: 35.6519, unescoId: 295 },
  { id: "persepolis", name: "Persepolis", country: "Iran", countryCode: "IR", type: "Cultural", year: 1979, lat: 29.9352, lng: 52.8914, unescoId: 114 },
  { id: "isfahan", name: "Meidan Emam, Isfahan", country: "Iran", countryCode: "IR", type: "Cultural", year: 1979, lat: 32.6546, lng: 51.6779, unescoId: 115 },

  // Africa
  { id: "kilimanjaro", name: "Kilimanjaro National Park", country: "Tanzania", countryCode: "TZ", type: "Natural", year: 1987, lat: -3.0674, lng: 37.3556 },
  { id: "ngorongoro", name: "Ngorongoro Conservation Area", country: "Tanzania", countryCode: "TZ", type: "Mixed", year: 1979, lat: -3.2000, lng: 35.5000 },
  { id: "zanzibar", name: "Stone Town of Zanzibar", country: "Tanzania", countryCode: "TZ", type: "Cultural", year: 2000, lat: -6.1622, lng: 39.1921 },
  { id: "robben-island", name: "Robben Island", country: "South Africa", countryCode: "ZA", type: "Cultural", year: 1999, lat: -33.8076, lng: 18.3663 },
  { id: "cape-floral", name: "Cape Floral Region", country: "South Africa", countryCode: "ZA", type: "Natural", year: 2004, lat: -34.0500, lng: 18.4000 },
  { id: "kruger", name: "Kruger National Park", country: "South Africa", countryCode: "ZA", type: "Natural", year: 2024, lat: -24.0000, lng: 31.5000 },
  { id: "marrakech", name: "Medina of Marrakech", country: "Morocco", countryCode: "MA", type: "Cultural", year: 1985, lat: 31.6295, lng: -7.9811 },
  { id: "fez", name: "Medina of Fez", country: "Morocco", countryCode: "MA", type: "Cultural", year: 1981, lat: 34.0620, lng: -4.9733 },
  { id: "ait-benhaddou", name: "Ksar of Ait-Ben-Haddou", country: "Morocco", countryCode: "MA", type: "Cultural", year: 1987, lat: 31.0472, lng: -7.1300 },
  { id: "luxor", name: "Ancient Thebes (Luxor)", country: "Egypt", countryCode: "EG", type: "Cultural", year: 1979, lat: 25.7402, lng: 32.6014 },
  { id: "abu-simbel", name: "Nubian Monuments (Abu Simbel)", country: "Egypt", countryCode: "EG", type: "Cultural", year: 1979, lat: 22.3372, lng: 31.6256 },
  { id: "carthage", name: "Archaeological Site of Carthage", country: "Tunisia", countryCode: "TN", type: "Cultural", year: 1979, lat: 36.8528, lng: 10.3233 },
  { id: "lalibela", name: "Rock-Hewn Churches of Lalibela", country: "Ethiopia", countryCode: "ET", type: "Cultural", year: 1978, lat: 12.0319, lng: 39.0472 },
  { id: "djenne", name: "Old Towns of Djenné", country: "Mali", countryCode: "ML", type: "Cultural", year: 1988, lat: 13.9053, lng: -4.5553 },
  { id: "timbuktu", name: "Timbuktu", country: "Mali", countryCode: "ML", type: "Cultural", year: 1988, lat: 16.7666, lng: -3.0026 },
  { id: "goree-island", name: "Island of Gorée", country: "Senegal", countryCode: "SN", type: "Cultural", year: 1978, lat: 14.6672, lng: -17.3994 },

  // Central/Eastern Europe
  { id: "prague", name: "Historic Centre of Prague", country: "Czechia", countryCode: "CZ", type: "Cultural", year: 1992, lat: 50.0755, lng: 14.4378 },
  { id: "cesky-krumlov", name: "Historic Centre of Český Krumlov", country: "Czechia", countryCode: "CZ", type: "Cultural", year: 1992, lat: 48.8127, lng: 14.3175 },
  { id: "kutna-hora", name: "Kutná Hora", country: "Czechia", countryCode: "CZ", type: "Cultural", year: 1995, lat: 49.9483, lng: 15.2683 },
  { id: "krakow", name: "Historic Centre of Kraków", country: "Poland", countryCode: "PL", type: "Cultural", year: 1978, lat: 50.0614, lng: 19.9366 },
  { id: "auschwitz", name: "Auschwitz Birkenau", country: "Poland", countryCode: "PL", type: "Cultural", year: 1979, lat: 50.0343, lng: 19.1784 },
  { id: "wieliczka", name: "Wieliczka Salt Mine", country: "Poland", countryCode: "PL", type: "Cultural", year: 1978, lat: 49.9833, lng: 20.0550 },
  { id: "warsaw", name: "Historic Centre of Warsaw", country: "Poland", countryCode: "PL", type: "Cultural", year: 1980, lat: 52.2492, lng: 21.0131 },
  { id: "budapest", name: "Budapest, Banks of the Danube", country: "Hungary", countryCode: "HU", type: "Cultural", year: 1987, lat: 47.4979, lng: 19.0402 },
  { id: "vienna-historic", name: "Historic Centre of Vienna", country: "Austria", countryCode: "AT", type: "Cultural", year: 2001, lat: 48.2082, lng: 16.3738 },
  { id: "schonbrunn", name: "Schönbrunn Palace", country: "Austria", countryCode: "AT", type: "Cultural", year: 1996, lat: 48.1846, lng: 16.3123 },
  { id: "salzburg", name: "Historic Centre of Salzburg", country: "Austria", countryCode: "AT", type: "Cultural", year: 1996, lat: 47.8095, lng: 13.0550 },
  { id: "hallstatt", name: "Hallstatt-Dachstein", country: "Austria", countryCode: "AT", type: "Cultural", year: 1997, lat: 47.5622, lng: 13.6493 },

  // Russia
  { id: "kremlin", name: "Moscow Kremlin and Red Square", country: "Russia", countryCode: "RU", type: "Cultural", year: 1990, lat: 55.7520, lng: 37.6175 },
  { id: "st-petersburg", name: "Historic Centre of Saint Petersburg", country: "Russia", countryCode: "RU", type: "Cultural", year: 1990, lat: 59.9343, lng: 30.3351 },
  { id: "lake-baikal", name: "Lake Baikal", country: "Russia", countryCode: "RU", type: "Natural", year: 1996, lat: 53.5000, lng: 108.0000 },
  { id: "kamchatka", name: "Volcanoes of Kamchatka", country: "Russia", countryCode: "RU", type: "Natural", year: 1996, lat: 55.0000, lng: 160.0000 },
  { id: "kizhi", name: "Kizhi Pogost", country: "Russia", countryCode: "RU", type: "Cultural", year: 1990, lat: 62.0667, lng: 35.2250 },

  // Scandinavia & Northern Europe
  { id: "bryggen", name: "Bryggen (Bergen)", country: "Norway", countryCode: "NO", type: "Cultural", year: 1979, lat: 60.3975, lng: 5.3242 },
  { id: "fjords", name: "West Norwegian Fjords", country: "Norway", countryCode: "NO", type: "Natural", year: 2005, lat: 62.1000, lng: 7.1000 },
  { id: "suomenlinna", name: "Fortress of Suomenlinna", country: "Finland", countryCode: "FI", type: "Cultural", year: 1991, lat: 60.1454, lng: 24.9881 },
  { id: "drottningholm", name: "Royal Domain of Drottningholm", country: "Sweden", countryCode: "SE", type: "Cultural", year: 1991, lat: 59.3217, lng: 17.8867 },
  { id: "kronborg", name: "Kronborg Castle", country: "Denmark", countryCode: "DK", type: "Cultural", year: 2000, lat: 56.0390, lng: 12.6217 },
  { id: "roskilde", name: "Roskilde Cathedral", country: "Denmark", countryCode: "DK", type: "Cultural", year: 1995, lat: 55.6422, lng: 12.0803 },
  { id: "thingvellir", name: "Þingvellir National Park", country: "Iceland", countryCode: "IS", type: "Cultural", year: 2004, lat: 64.2559, lng: -21.1300 },

  // Netherlands, Belgium, Switzerland
  { id: "amsterdam-canals", name: "Amsterdam Canal Ring", country: "Netherlands", countryCode: "NL", type: "Cultural", year: 2010, lat: 52.3676, lng: 4.9041 },
  { id: "kinderdijk", name: "Kinderdijk Windmills", country: "Netherlands", countryCode: "NL", type: "Cultural", year: 1997, lat: 51.8836, lng: 4.6400 },
  { id: "bruges", name: "Historic Centre of Bruges", country: "Belgium", countryCode: "BE", type: "Cultural", year: 2000, lat: 51.2093, lng: 3.2247 },
  { id: "grand-place", name: "Grand-Place, Brussels", country: "Belgium", countryCode: "BE", type: "Cultural", year: 1998, lat: 50.8467, lng: 4.3525 },
  { id: "bern", name: "Old City of Bern", country: "Switzerland", countryCode: "CH", type: "Cultural", year: 1983, lat: 46.9480, lng: 7.4474 },
  { id: "swiss-alps", name: "Swiss Alps Jungfrau-Aletsch", country: "Switzerland", countryCode: "CH", type: "Natural", year: 2001, lat: 46.5333, lng: 8.0500 },
  { id: "lavaux", name: "Lavaux Vineyard Terraces", country: "Switzerland", countryCode: "CH", type: "Cultural", year: 2007, lat: 46.4833, lng: 6.7333 },

  // Portugal
  { id: "sintra", name: "Cultural Landscape of Sintra", country: "Portugal", countryCode: "PT", type: "Cultural", year: 1995, lat: 38.7879, lng: -9.3907 },
  { id: "lisbon-belem", name: "Tower of Belém", country: "Portugal", countryCode: "PT", type: "Cultural", year: 1983, lat: 38.6916, lng: -9.2159 },
  { id: "porto-historic", name: "Historic Centre of Porto", country: "Portugal", countryCode: "PT", type: "Cultural", year: 1996, lat: 41.1496, lng: -8.6109 },
  { id: "pena-palace", name: "Pena National Palace", country: "Portugal", countryCode: "PT", type: "Cultural", year: 1995, lat: 38.7876, lng: -9.3906 },

  // Croatia, Slovenia, Balkan
  { id: "dubrovnik", name: "Old City of Dubrovnik", country: "Croatia", countryCode: "HR", type: "Cultural", year: 1979, lat: 42.6507, lng: 18.0944 },
  { id: "plitvice", name: "Plitvice Lakes National Park", country: "Croatia", countryCode: "HR", type: "Natural", year: 1979, lat: 44.8654, lng: 15.5820 },
  { id: "split", name: "Historic Complex of Split", country: "Croatia", countryCode: "HR", type: "Cultural", year: 1979, lat: 43.5081, lng: 16.4402 },
  { id: "skocjan-caves", name: "Škocjan Caves", country: "Slovenia", countryCode: "SI", type: "Natural", year: 1986, lat: 45.6636, lng: 13.9894 },
  { id: "kotor", name: "Natural and Cultural Region of Kotor", country: "Montenegro", countryCode: "ME", type: "Cultural", year: 1979, lat: 42.4247, lng: 18.7712 },
  { id: "ohrid", name: "Natural and Cultural Heritage of Ohrid", country: "North Macedonia", countryCode: "MK", type: "Mixed", year: 1979, lat: 41.1231, lng: 20.8016 },
  { id: "mostar", name: "Old Bridge Area of Mostar", country: "Bosnia and Herzegovina", countryCode: "BA", type: "Cultural", year: 2005, lat: 43.3372, lng: 17.8136 },

  // Americas
  { id: "statue-liberty", name: "Statue of Liberty", country: "United States", countryCode: "US", type: "Cultural", year: 1984, lat: 40.6892, lng: -74.0445 },
  { id: "yosemite", name: "Yosemite National Park", country: "United States", countryCode: "US", type: "Natural", year: 1984, lat: 37.8651, lng: -119.5383 },
  { id: "independence-hall", name: "Independence Hall", country: "United States", countryCode: "US", type: "Cultural", year: 1979, lat: 39.9489, lng: -75.1500 },
  { id: "everglades", name: "Everglades National Park", country: "United States", countryCode: "US", type: "Natural", year: 1979, lat: 25.2866, lng: -80.8987 },
  { id: "mesa-verde", name: "Mesa Verde National Park", country: "United States", countryCode: "US", type: "Cultural", year: 1978, lat: 37.2309, lng: -108.4618 },
  { id: "hawaii-volcanoes", name: "Hawaii Volcanoes National Park", country: "United States", countryCode: "US", type: "Natural", year: 1987, lat: 19.4194, lng: -155.2885 },
  { id: "old-havana", name: "Old Havana", country: "Cuba", countryCode: "CU", type: "Cultural", year: 1982, lat: 23.1365, lng: -82.3590 },
  { id: "trinidad-cuba", name: "Trinidad and Valle de los Ingenios", country: "Cuba", countryCode: "CU", type: "Cultural", year: 1988, lat: 21.8017, lng: -79.9847 },
  { id: "teotihuacan", name: "Teotihuacan", country: "Mexico", countryCode: "MX", type: "Cultural", year: 1987, lat: 19.6925, lng: -98.8438 },
  { id: "mexico-city-xochimilco", name: "Historic Centre of Mexico City", country: "Mexico", countryCode: "MX", type: "Cultural", year: 1987, lat: 19.4326, lng: -99.1332 },
  { id: "palenque", name: "Pre-Hispanic City of Palenque", country: "Mexico", countryCode: "MX", type: "Cultural", year: 1987, lat: 17.4838, lng: -92.0460 },
  { id: "oaxaca", name: "Historic Centre of Oaxaca", country: "Mexico", countryCode: "MX", type: "Cultural", year: 1987, lat: 17.0732, lng: -96.7266 },
  { id: "guanajuato", name: "Historic Town of Guanajuato", country: "Mexico", countryCode: "MX", type: "Cultural", year: 1988, lat: 21.0190, lng: -101.2574 },
  { id: "tikal", name: "Tikal National Park", country: "Guatemala", countryCode: "GT", type: "Mixed", year: 1979, lat: 17.2220, lng: -89.6237 },
  { id: "copan", name: "Maya Site of Copan", country: "Honduras", countryCode: "HN", type: "Cultural", year: 1980, lat: 14.8400, lng: -89.1400 },
  { id: "cartagena", name: "Port, Fortresses of Cartagena", country: "Colombia", countryCode: "CO", type: "Cultural", year: 1984, lat: 10.3910, lng: -75.4794 },
  { id: "cusco", name: "City of Cusco", country: "Peru", countryCode: "PE", type: "Cultural", year: 1983, lat: -13.5320, lng: -71.9675 },
  { id: "nazca-lines", name: "Lines and Geoglyphs of Nasca", country: "Peru", countryCode: "PE", type: "Cultural", year: 1994, lat: -14.7390, lng: -75.1300 },
  { id: "easter-island", name: "Rapa Nui (Easter Island)", country: "Chile", countryCode: "CL", type: "Cultural", year: 1995, lat: -27.1127, lng: -109.3497 },
  { id: "valparaiso", name: "Historic Quarter of Valparaíso", country: "Chile", countryCode: "CL", type: "Cultural", year: 2003, lat: -33.0472, lng: -71.6127 },
  { id: "buenos-aires-center", name: "Historic Centre of Buenos Aires", country: "Argentina", countryCode: "AR", type: "Cultural", year: 2024, lat: -34.6037, lng: -58.3816 },
  { id: "quebrada-humahuaca", name: "Quebrada de Humahuaca", country: "Argentina", countryCode: "AR", type: "Cultural", year: 2003, lat: -23.2049, lng: -65.3519 },
  { id: "los-glaciares", name: "Los Glaciares National Park", country: "Argentina", countryCode: "AR", type: "Natural", year: 1981, lat: -50.0000, lng: -73.0000 },

  // Oceania
  { id: "sydney-opera", name: "Sydney Opera House", country: "Australia", countryCode: "AU", type: "Cultural", year: 2007, lat: -33.8568, lng: 151.2153 },
  { id: "blue-mountains", name: "Greater Blue Mountains", country: "Australia", countryCode: "AU", type: "Natural", year: 2000, lat: -33.7167, lng: 150.3000 },
  { id: "kakadu", name: "Kakadu National Park", country: "Australia", countryCode: "AU", type: "Mixed", year: 1981, lat: -13.0000, lng: 132.5000 },
  { id: "fraser-island", name: "Fraser Island", country: "Australia", countryCode: "AU", type: "Natural", year: 1992, lat: -25.2577, lng: 153.1395 },
  { id: "tongariro", name: "Tongariro National Park", country: "New Zealand", countryCode: "NZ", type: "Mixed", year: 1990, lat: -39.2000, lng: 175.5833 },
  { id: "milford-sound", name: "Te Wahipounamu", country: "New Zealand", countryCode: "NZ", type: "Natural", year: 1990, lat: -45.0000, lng: 167.0000 },
];

export const siteTypes = ["Cultural", "Natural", "Mixed"];

export const getSitesByType = (type: string) =>
  unescoSites.filter(s => s.type === type);

export const getSitesByCountry = (countryCode: string) =>
  unescoSites.filter(s => s.countryCode === countryCode);

export const getTotalSites = () => unescoSites.length;
