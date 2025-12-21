export interface CountryHighPoint {
  id: string;
  countryCode: string;
  country: string;
  name: string;
  elevation: number; // meters
  lat: number;
  lng: number;
  continent: string;
  // Link to existing mountain ID if it exists in mountains.ts
  mountainId?: string;
}

export const countryHighPoints: CountryHighPoint[] = [
  // =====================
  // ASIA
  // =====================
  { id: "np-everest", countryCode: "NP", country: "Nepal", name: "Mount Everest", elevation: 8849, lat: 27.9881, lng: 86.9250, continent: "Asia", mountainId: "everest" },
  { id: "cn-everest", countryCode: "CN", country: "China", name: "Mount Everest", elevation: 8849, lat: 27.9881, lng: 86.9250, continent: "Asia", mountainId: "everest" },
  { id: "pk-k2", countryCode: "PK", country: "Pakistan", name: "K2", elevation: 8611, lat: 35.8825, lng: 76.5133, continent: "Asia", mountainId: "k2" },
  { id: "in-kangchenjunga", countryCode: "IN", country: "India", name: "Kangchenjunga", elevation: 8586, lat: 27.7025, lng: 88.1475, continent: "Asia", mountainId: "kangchenjunga" },
  { id: "bt-gangkhar-puensum", countryCode: "BT", country: "Bhutan", name: "Gangkhar Puensum", elevation: 7570, lat: 28.0333, lng: 90.4667, continent: "Asia" },
  { id: "tj-ismoil-somoni", countryCode: "TJ", country: "Tajikistan", name: "Ismoil Somoni Peak", elevation: 7495, lat: 38.9333, lng: 72.0167, continent: "Asia" },
  { id: "af-noshaq", countryCode: "AF", country: "Afghanistan", name: "Noshaq", elevation: 7492, lat: 36.3833, lng: 71.8333, continent: "Asia" },
  { id: "kg-jengish-chokusu", countryCode: "KG", country: "Kyrgyzstan", name: "Jengish Chokusu", elevation: 7439, lat: 42.0342, lng: 80.1300, continent: "Asia" },
  { id: "kz-khan-tengri", countryCode: "KZ", country: "Kazakhstan", name: "Khan Tengri", elevation: 7010, lat: 42.2133, lng: 80.1767, continent: "Asia" },
  { id: "ir-damavand", countryCode: "IR", country: "Iran", name: "Mount Damavand", elevation: 5610, lat: 35.9516, lng: 52.1095, continent: "Asia", mountainId: "damavand" },
  { id: "tr-ararat", countryCode: "TR", country: "Türkiye", name: "Mount Ararat", elevation: 5137, lat: 39.7019, lng: 44.2986, continent: "Asia", mountainId: "ararat" },
  { id: "mm-hkakabo-razi", countryCode: "MM", country: "Myanmar", name: "Hkakabo Razi", elevation: 5881, lat: 28.3167, lng: 97.5333, continent: "Asia" },
  { id: "jp-fuji", countryCode: "JP", country: "Japan", name: "Mount Fuji", elevation: 3776, lat: 35.3606, lng: 138.7274, continent: "Asia" },
  { id: "tw-yushan", countryCode: "TW", country: "Taiwan", name: "Yushan", elevation: 3952, lat: 23.4700, lng: 120.9572, continent: "Asia" },
  { id: "kr-hallasan", countryCode: "KR", country: "South Korea", name: "Hallasan", elevation: 1950, lat: 33.3617, lng: 126.5333, continent: "Asia" },
  { id: "kp-paektu", countryCode: "KP", country: "North Korea", name: "Paektu Mountain", elevation: 2744, lat: 41.9939, lng: 128.0756, continent: "Asia" },
  { id: "mn-khuiten", countryCode: "MN", country: "Mongolia", name: "Khüiten Peak", elevation: 4374, lat: 49.1483, lng: 87.8167, continent: "Asia" },
  { id: "id-puncak-jaya", countryCode: "ID", country: "Indonesia", name: "Puncak Jaya", elevation: 4884, lat: -4.0833, lng: 137.1833, continent: "Asia" },
  { id: "my-kinabalu", countryCode: "MY", country: "Malaysia", name: "Mount Kinabalu", elevation: 4095, lat: 6.0750, lng: 116.5583, continent: "Asia" },
  { id: "ph-apo", countryCode: "PH", country: "Philippines", name: "Mount Apo", elevation: 2954, lat: 6.9875, lng: 125.2711, continent: "Asia" },
  { id: "vn-fansipan", countryCode: "VN", country: "Vietnam", name: "Fansipan", elevation: 3147, lat: 22.3033, lng: 103.7750, continent: "Asia" },
  { id: "th-doi-inthanon", countryCode: "TH", country: "Thailand", name: "Doi Inthanon", elevation: 2565, lat: 18.5875, lng: 98.4867, continent: "Asia" },
  { id: "la-phou-bia", countryCode: "LA", country: "Laos", name: "Phou Bia", elevation: 2819, lat: 19.0167, lng: 103.1667, continent: "Asia" },
  { id: "kh-phnom-aural", countryCode: "KH", country: "Cambodia", name: "Phnom Aural", elevation: 1813, lat: 12.0500, lng: 104.0500, continent: "Asia" },
  { id: "bd-keokradong", countryCode: "BD", country: "Bangladesh", name: "Keokradong", elevation: 1230, lat: 21.9500, lng: 92.5167, continent: "Asia" },
  { id: "lk-pidurutalagala", countryCode: "LK", country: "Sri Lanka", name: "Pidurutalagala", elevation: 2524, lat: 7.0006, lng: 80.7731, continent: "Asia" },
  { id: "uz-hazret-sultan", countryCode: "UZ", country: "Uzbekistan", name: "Hazret Sultan", elevation: 4643, lat: 39.5000, lng: 68.1167, continent: "Asia" },
  { id: "tm-ayrybaba", countryCode: "TM", country: "Turkmenistan", name: "Aýrybaba", elevation: 3139, lat: 37.8333, lng: 66.5167, continent: "Asia" },
  { id: "az-bazarduzu", countryCode: "AZ", country: "Azerbaijan", name: "Bazardüzü", elevation: 4466, lat: 41.2208, lng: 47.8664, continent: "Asia" },
  { id: "ge-shkhara", countryCode: "GE", country: "Georgia", name: "Shkhara", elevation: 5193, lat: 43.0000, lng: 43.1167, continent: "Asia", mountainId: "shkhara" },
  { id: "am-aragats", countryCode: "AM", country: "Armenia", name: "Mount Aragats", elevation: 4090, lat: 40.5117, lng: 44.1967, continent: "Asia" },
  { id: "il-hermon", countryCode: "IL", country: "Israel", name: "Mount Hermon", elevation: 2236, lat: 33.4167, lng: 35.8583, continent: "Asia" },
  { id: "lb-qurnat-as-sawda", countryCode: "LB", country: "Lebanon", name: "Qurnat as Sawda'", elevation: 3088, lat: 34.2278, lng: 36.0931, continent: "Asia" },
  { id: "sy-hermon", countryCode: "SY", country: "Syria", name: "Mount Hermon", elevation: 2814, lat: 33.4167, lng: 35.8583, continent: "Asia" },
  { id: "jo-jabal-umm-ad-dami", countryCode: "JO", country: "Jordan", name: "Jabal Umm ad Dami", elevation: 1854, lat: 29.3333, lng: 35.0000, continent: "Asia" },
  { id: "sa-jabal-sawda", countryCode: "SA", country: "Saudi Arabia", name: "Jabal Sawda", elevation: 3015, lat: 18.2500, lng: 42.3667, continent: "Asia" },
  { id: "ye-jabal-an-nabi-shuayb", countryCode: "YE", country: "Yemen", name: "Jabal An-Nabi Shu'ayb", elevation: 3666, lat: 15.2833, lng: 43.9833, continent: "Asia" },
  { id: "om-jabal-shams", countryCode: "OM", country: "Oman", name: "Jabal Shams", elevation: 3009, lat: 23.2367, lng: 57.2647, continent: "Asia" },
  { id: "ae-jabal-jais", countryCode: "AE", country: "United Arab Emirates", name: "Jabal Jais", elevation: 1934, lat: 25.9500, lng: 56.1000, continent: "Asia" },
  { id: "iq-cheekha-dar", countryCode: "IQ", country: "Iraq", name: "Cheekha Dar", elevation: 3611, lat: 37.2167, lng: 44.8667, continent: "Asia" },
  { id: "kw-mutla-ridge", countryCode: "KW", country: "Kuwait", name: "Mutla Ridge", elevation: 306, lat: 29.4167, lng: 47.5833, continent: "Asia" },
  { id: "bh-jabal-ad-dukhan", countryCode: "BH", country: "Bahrain", name: "Jabal ad Dukhan", elevation: 134, lat: 26.0236, lng: 50.4869, continent: "Asia" },
  { id: "qa-qurain-abu-al-bawl", countryCode: "QA", country: "Qatar", name: "Qurain Abu al Bawl", elevation: 103, lat: 24.8000, lng: 51.0000, continent: "Asia" },
  { id: "sg-bukit-timah", countryCode: "SG", country: "Singapore", name: "Bukit Timah", elevation: 163, lat: 1.3547, lng: 103.7761, continent: "Asia" },
  { id: "bn-bukit-pagon", countryCode: "BN", country: "Brunei", name: "Bukit Pagon", elevation: 1850, lat: 4.6000, lng: 115.4000, continent: "Asia" },
  { id: "tl-tatamailau", countryCode: "TL", country: "Timor-Leste", name: "Tatamailau", elevation: 2963, lat: -8.9000, lng: 125.5167, continent: "Asia" },
  { id: "mv-villingili", countryCode: "MV", country: "Maldives", name: "Mount Villingili", elevation: 5, lat: 0.7242, lng: 73.4347, continent: "Asia" },
  { id: "cy-olympus", countryCode: "CY", country: "Cyprus", name: "Mount Olympus", elevation: 1952, lat: 34.9417, lng: 32.8667, continent: "Asia" },

  // =====================
  // EUROPE
  // =====================
  { id: "ru-elbrus", countryCode: "RU", country: "Russia", name: "Mount Elbrus", elevation: 5642, lat: 43.3550, lng: 42.4392, continent: "Europe", mountainId: "elbrus" },
  { id: "fr-mont-blanc", countryCode: "FR", country: "France", name: "Mont Blanc", elevation: 4809, lat: 45.8326, lng: 6.8652, continent: "Europe" },
  { id: "it-mont-blanc", countryCode: "IT", country: "Italy", name: "Mont Blanc", elevation: 4809, lat: 45.8326, lng: 6.8652, continent: "Europe" },
  { id: "ch-dufourspitze", countryCode: "CH", country: "Switzerland", name: "Dufourspitze", elevation: 4634, lat: 45.9369, lng: 7.8667, continent: "Europe" },
  { id: "at-grossglockner", countryCode: "AT", country: "Austria", name: "Grossglockner", elevation: 3798, lat: 47.0742, lng: 12.6944, continent: "Europe" },
  { id: "es-teide", countryCode: "ES", country: "Spain", name: "Teide", elevation: 3718, lat: 28.2725, lng: -16.6417, continent: "Europe" },
  { id: "de-zugspitze", countryCode: "DE", country: "Germany", name: "Zugspitze", elevation: 2962, lat: 47.4211, lng: 10.9853, continent: "Europe" },
  { id: "gr-mytikas", countryCode: "GR", country: "Greece", name: "Mount Olympus (Mytikas)", elevation: 2917, lat: 40.0867, lng: 22.3597, continent: "Europe" },
  { id: "pt-pico", countryCode: "PT", country: "Portugal", name: "Mount Pico", elevation: 2351, lat: 38.4694, lng: -28.4011, continent: "Europe" },
  { id: "pl-rysy", countryCode: "PL", country: "Poland", name: "Rysy", elevation: 2499, lat: 49.1794, lng: 20.0883, continent: "Europe" },
  { id: "sk-gerlachovsky", countryCode: "SK", country: "Slovakia", name: "Gerlachovský štít", elevation: 2655, lat: 49.1644, lng: 20.1344, continent: "Europe" },
  { id: "cz-snezka", countryCode: "CZ", country: "Czechia", name: "Sněžka", elevation: 1603, lat: 50.7361, lng: 15.7397, continent: "Europe" },
  { id: "hu-kekes", countryCode: "HU", country: "Hungary", name: "Kékes", elevation: 1014, lat: 47.8744, lng: 20.0092, continent: "Europe" },
  { id: "ro-moldoveanu", countryCode: "RO", country: "Romania", name: "Moldoveanu Peak", elevation: 2544, lat: 45.6028, lng: 24.7361, continent: "Europe" },
  { id: "bg-musala", countryCode: "BG", country: "Bulgaria", name: "Musala", elevation: 2925, lat: 42.1792, lng: 23.5853, continent: "Europe" },
  { id: "rs-midzor", countryCode: "RS", country: "Serbia", name: "Midžor", elevation: 2169, lat: 43.3972, lng: 22.6756, continent: "Europe" },
  { id: "me-bobotov-kuk", countryCode: "ME", country: "Montenegro", name: "Bobotov Kuk", elevation: 2523, lat: 43.1244, lng: 19.0292, continent: "Europe" },
  { id: "al-korab", countryCode: "AL", country: "Albania", name: "Korab", elevation: 2764, lat: 41.7878, lng: 20.5556, continent: "Europe" },
  { id: "mk-korab", countryCode: "MK", country: "North Macedonia", name: "Korab", elevation: 2764, lat: 41.7878, lng: 20.5556, continent: "Europe" },
  { id: "xk-gjeravica", countryCode: "XK", country: "Kosovo", name: "Gjeravica", elevation: 2656, lat: 42.5319, lng: 20.0836, continent: "Europe" },
  { id: "ba-maglic", countryCode: "BA", country: "Bosnia and Herzegovina", name: "Maglić", elevation: 2386, lat: 43.3008, lng: 18.7328, continent: "Europe" },
  { id: "hr-dinara", countryCode: "HR", country: "Croatia", name: "Dinara", elevation: 1831, lat: 44.0603, lng: 16.3822, continent: "Europe" },
  { id: "si-triglav", countryCode: "SI", country: "Slovenia", name: "Triglav", elevation: 2864, lat: 46.3786, lng: 13.8367, continent: "Europe" },
  { id: "ua-hoverla", countryCode: "UA", country: "Ukraine", name: "Hoverla", elevation: 2061, lat: 48.1603, lng: 24.5003, continent: "Europe" },
  { id: "by-dzyarzhynskaya", countryCode: "BY", country: "Belarus", name: "Dzyarzhynskaya Hara", elevation: 345, lat: 53.9000, lng: 26.9500, continent: "Europe" },
  { id: "lt-aukstojas", countryCode: "LT", country: "Lithuania", name: "Aukštojas Hill", elevation: 294, lat: 54.3611, lng: 25.5556, continent: "Europe" },
  { id: "lv-gaizinkalns", countryCode: "LV", country: "Latvia", name: "Gaiziņkalns", elevation: 312, lat: 57.0683, lng: 25.7939, continent: "Europe" },
  { id: "ee-suur-munamagi", countryCode: "EE", country: "Estonia", name: "Suur Munamägi", elevation: 318, lat: 57.7111, lng: 27.0833, continent: "Europe" },
  { id: "fi-halti", countryCode: "FI", country: "Finland", name: "Halti", elevation: 1324, lat: 69.2531, lng: 20.7686, continent: "Europe" },
  { id: "se-kebnekaise", countryCode: "SE", country: "Sweden", name: "Kebnekaise", elevation: 2097, lat: 67.9000, lng: 18.5500, continent: "Europe" },
  { id: "no-galdhopiggen", countryCode: "NO", country: "Norway", name: "Galdhøpiggen", elevation: 2469, lat: 61.6364, lng: 8.3125, continent: "Europe" },
  { id: "is-hvannadalshnukur", countryCode: "IS", country: "Iceland", name: "Hvannadalshnjúkur", elevation: 2110, lat: 64.0133, lng: -16.6803, continent: "Europe" },
  { id: "ie-carrauntoohil", countryCode: "IE", country: "Ireland", name: "Carrauntoohil", elevation: 1038, lat: 51.9992, lng: -9.7442, continent: "Europe" },
  { id: "gb-ben-nevis", countryCode: "GB", country: "United Kingdom", name: "Ben Nevis", elevation: 1345, lat: 56.7969, lng: -5.0036, continent: "Europe" },
  { id: "nl-vaalserberg", countryCode: "NL", country: "Netherlands", name: "Vaalserberg", elevation: 322, lat: 50.7544, lng: 6.0208, continent: "Europe" },
  { id: "be-signal-de-botrange", countryCode: "BE", country: "Belgium", name: "Signal de Botrange", elevation: 694, lat: 50.5014, lng: 6.0933, continent: "Europe" },
  { id: "lu-buurgplaatz", countryCode: "LU", country: "Luxembourg", name: "Buurgplaatz", elevation: 559, lat: 49.8817, lng: 6.0306, continent: "Europe" },
  { id: "li-grauspitz", countryCode: "LI", country: "Liechtenstein", name: "Grauspitz", elevation: 2599, lat: 47.0639, lng: 9.5931, continent: "Europe" },
  { id: "ad-coma-pedrosa", countryCode: "AD", country: "Andorra", name: "Coma Pedrosa", elevation: 2942, lat: 42.5914, lng: 1.4431, continent: "Europe" },
  { id: "mc-chemin-des-revoires", countryCode: "MC", country: "Monaco", name: "Chemin des Révoires", elevation: 161, lat: 43.7425, lng: 7.4217, continent: "Europe" },
  { id: "sm-monte-titano", countryCode: "SM", country: "San Marino", name: "Monte Titano", elevation: 749, lat: 43.9400, lng: 12.4594, continent: "Europe" },
  { id: "va-vatican-gardens", countryCode: "VA", country: "Vatican City", name: "Vatican Hill", elevation: 75, lat: 41.9030, lng: 12.4534, continent: "Europe" },
  { id: "mt-ta-dmejrek", countryCode: "MT", country: "Malta", name: "Ta' Dmejrek", elevation: 253, lat: 35.8500, lng: 14.4000, continent: "Europe" },
  { id: "dk-mollehoj", countryCode: "DK", country: "Denmark", name: "Møllehøj", elevation: 171, lat: 56.0403, lng: 9.7331, continent: "Europe" },
  { id: "md-balanesti", countryCode: "MD", country: "Moldova", name: "Bălănești Hill", elevation: 430, lat: 47.1500, lng: 28.2333, continent: "Europe" },

  // =====================
  // AFRICA
  // =====================
  { id: "tz-kilimanjaro", countryCode: "TZ", country: "Tanzania", name: "Mount Kilimanjaro", elevation: 5895, lat: -3.0674, lng: 37.3556, continent: "Africa", mountainId: "kilimanjaro" },
  { id: "ke-kenya", countryCode: "KE", country: "Kenya", name: "Mount Kenya", elevation: 5199, lat: -0.1521, lng: 37.3084, continent: "Africa", mountainId: "mount-kenya" },
  { id: "ug-stanley", countryCode: "UG", country: "Uganda", name: "Mount Stanley (Margherita Peak)", elevation: 5109, lat: 0.3861, lng: 29.8719, continent: "Africa", mountainId: "rwenzori" },
  { id: "cd-stanley", countryCode: "CD", country: "DR Congo", name: "Mount Stanley (Margherita Peak)", elevation: 5109, lat: 0.3861, lng: 29.8719, continent: "Africa", mountainId: "rwenzori" },
  { id: "et-ras-dashen", countryCode: "ET", country: "Ethiopia", name: "Ras Dashen", elevation: 4550, lat: 13.2333, lng: 38.3667, continent: "Africa" },
  { id: "rw-karisimbi", countryCode: "RW", country: "Rwanda", name: "Mount Karisimbi", elevation: 4507, lat: -1.5075, lng: 29.4478, continent: "Africa" },
  { id: "ma-toubkal", countryCode: "MA", country: "Morocco", name: "Toubkal", elevation: 4167, lat: 31.0606, lng: -7.9122, continent: "Africa" },
  { id: "cm-cameroon", countryCode: "CM", country: "Cameroon", name: "Mount Cameroon", elevation: 4095, lat: 4.2167, lng: 9.1833, continent: "Africa" },
  { id: "za-mafadi", countryCode: "ZA", country: "South Africa", name: "Mafadi", elevation: 3450, lat: -29.2000, lng: 29.2667, continent: "Africa" },
  { id: "ls-thabana-ntlenyana", countryCode: "LS", country: "Lesotho", name: "Thabana Ntlenyana", elevation: 3482, lat: -29.4667, lng: 29.2750, continent: "Africa" },
  { id: "dz-tahat", countryCode: "DZ", country: "Algeria", name: "Mount Tahat", elevation: 2908, lat: 23.2833, lng: 5.5333, continent: "Africa" },
  { id: "eg-catherine", countryCode: "EG", country: "Egypt", name: "Mount Catherine", elevation: 2629, lat: 28.5125, lng: 33.9472, continent: "Africa" },
  { id: "ng-chappal-waddi", countryCode: "NG", country: "Nigeria", name: "Chappal Waddi", elevation: 2419, lat: 6.7833, lng: 11.0500, continent: "Africa" },
  { id: "sd-deriba-caldera", countryCode: "SD", country: "Sudan", name: "Deriba Caldera", elevation: 3042, lat: 12.9500, lng: 24.2667, continent: "Africa" },
  { id: "ao-morro-de-moco", countryCode: "AO", country: "Angola", name: "Morro de Môco", elevation: 2620, lat: -12.4667, lng: 15.1667, continent: "Africa" },
  { id: "mz-binga", countryCode: "MZ", country: "Mozambique", name: "Monte Binga", elevation: 2436, lat: -19.8333, lng: 32.8333, continent: "Africa" },
  { id: "zw-inyangani", countryCode: "ZW", country: "Zimbabwe", name: "Mount Inyangani", elevation: 2592, lat: -18.2833, lng: 32.8500, continent: "Africa" },
  { id: "mw-sapitwa", countryCode: "MW", country: "Malawi", name: "Sapitwa Peak", elevation: 3002, lat: -15.9500, lng: 35.6500, continent: "Africa" },
  { id: "zm-mafinga-central", countryCode: "ZM", country: "Zambia", name: "Mafinga Central", elevation: 2339, lat: -10.0667, lng: 33.4500, continent: "Africa" },
  { id: "na-brandberg", countryCode: "NA", country: "Namibia", name: "Brandberg Mountain", elevation: 2573, lat: -21.1500, lng: 14.5833, continent: "Africa" },
  { id: "bw-otse-hill", countryCode: "BW", country: "Botswana", name: "Otse Hill", elevation: 1491, lat: -24.8000, lng: 25.9833, continent: "Africa" },
  { id: "sz-emlembe", countryCode: "SZ", country: "Eswatini", name: "Emlembe", elevation: 1862, lat: -26.0167, lng: 31.1333, continent: "Africa" },
  { id: "mg-maromokotro", countryCode: "MG", country: "Madagascar", name: "Maromokotro", elevation: 2876, lat: -14.0000, lng: 48.9500, continent: "Africa" },
  { id: "tn-jebel-ech-chambi", countryCode: "TN", country: "Tunisia", name: "Jebel ech Chambi", elevation: 1544, lat: 35.1750, lng: 8.6750, continent: "Africa" },
  { id: "ly-bikku-bitti", countryCode: "LY", country: "Libya", name: "Bikku Bitti", elevation: 2267, lat: 23.0500, lng: 17.3500, continent: "Africa" },
  { id: "td-emi-koussi", countryCode: "TD", country: "Chad", name: "Emi Koussi", elevation: 3445, lat: 19.8000, lng: 18.5500, continent: "Africa" },
  { id: "ne-mont-idoukal-n-taghes", countryCode: "NE", country: "Niger", name: "Mont Idoukal-n-Taghès", elevation: 2022, lat: 18.2167, lng: 8.7500, continent: "Africa" },
  { id: "ml-hombori-tondo", countryCode: "ML", country: "Mali", name: "Hombori Tondo", elevation: 1155, lat: 15.2833, lng: -1.7333, continent: "Africa" },
  { id: "sn-sambaya", countryCode: "SN", country: "Senegal", name: "Sambaya", elevation: 648, lat: 12.7167, lng: -12.5000, continent: "Africa" },
  { id: "mr-kediet-ej-jill", countryCode: "MR", country: "Mauritania", name: "Kediet ej Jill", elevation: 915, lat: 22.8333, lng: -12.3333, continent: "Africa" },
  { id: "gm-red-rock", countryCode: "GM", country: "Gambia", name: "Red Rock", elevation: 53, lat: 13.4667, lng: -15.5000, continent: "Africa" },
  { id: "gw-unnamed-point", countryCode: "GW", country: "Guinea-Bissau", name: "Unnamed point near Gabu", elevation: 300, lat: 12.2667, lng: -14.2667, continent: "Africa" },
  { id: "gn-mont-nimba", countryCode: "GN", country: "Guinea", name: "Mont Nimba", elevation: 1752, lat: 7.6167, lng: -8.4000, continent: "Africa" },
  { id: "sl-bintumani", countryCode: "SL", country: "Sierra Leone", name: "Bintumani", elevation: 1948, lat: 9.1667, lng: -11.0500, continent: "Africa" },
  { id: "lr-wuteve", countryCode: "LR", country: "Liberia", name: "Mount Wuteve", elevation: 1440, lat: 7.2500, lng: -9.3333, continent: "Africa" },
  { id: "ci-mont-nimba", countryCode: "CI", country: "Côte d'Ivoire", name: "Mont Nimba", elevation: 1752, lat: 7.6167, lng: -8.4000, continent: "Africa" },
  { id: "bf-tenakourou", countryCode: "BF", country: "Burkina Faso", name: "Ténakourou", elevation: 749, lat: 10.6333, lng: -4.9667, continent: "Africa" },
  { id: "gh-afadjato", countryCode: "GH", country: "Ghana", name: "Mount Afadjato", elevation: 885, lat: 7.0000, lng: 0.4167, continent: "Africa" },
  { id: "tg-mont-agou", countryCode: "TG", country: "Togo", name: "Mont Agou", elevation: 986, lat: 6.8500, lng: 0.7500, continent: "Africa" },
  { id: "bj-mont-sokbaro", countryCode: "BJ", country: "Benin", name: "Mont Sokbaro", elevation: 658, lat: 9.0000, lng: 1.6000, continent: "Africa" },
  { id: "cf-mont-ngaoui", countryCode: "CF", country: "Central African Republic", name: "Mont Ngaoui", elevation: 1410, lat: 6.9167, lng: 18.9167, continent: "Africa" },
  { id: "cg-mont-berongou", countryCode: "CG", country: "Republic of the Congo", name: "Mont Berongou", elevation: 903, lat: -2.8333, lng: 13.6333, continent: "Africa" },
  { id: "ga-mont-iboundji", countryCode: "GA", country: "Gabon", name: "Mont Iboundji", elevation: 1575, lat: -1.4667, lng: 11.8000, continent: "Africa" },
  { id: "gq-pico-basile", countryCode: "GQ", country: "Equatorial Guinea", name: "Pico Basilé", elevation: 3011, lat: 3.5833, lng: 8.7667, continent: "Africa" },
  { id: "st-pico-de-sao-tome", countryCode: "ST", country: "São Tomé and Príncipe", name: "Pico de São Tomé", elevation: 2024, lat: 0.2667, lng: 6.5333, continent: "Africa" },
  { id: "cv-pico-do-fogo", countryCode: "CV", country: "Cape Verde", name: "Pico do Fogo", elevation: 2829, lat: 14.9500, lng: -24.3500, continent: "Africa" },
  { id: "mu-piton-de-la-petite-riviere", countryCode: "MU", country: "Mauritius", name: "Piton de la Petite Rivière Noire", elevation: 828, lat: -20.4250, lng: 57.4000, continent: "Africa" },
  { id: "km-kartala", countryCode: "KM", country: "Comoros", name: "Mount Karthala", elevation: 2361, lat: -11.7500, lng: 43.3500, continent: "Africa" },
  { id: "sc-morne-seychellois", countryCode: "SC", country: "Seychelles", name: "Morne Seychellois", elevation: 905, lat: -4.6625, lng: 55.4417, continent: "Africa" },
  { id: "dj-moussa-ali", countryCode: "DJ", country: "Djibouti", name: "Moussa Ali", elevation: 2028, lat: 12.4667, lng: 42.4833, continent: "Africa" },
  { id: "er-emba-soira", countryCode: "ER", country: "Eritrea", name: "Emba Soira", elevation: 3018, lat: 14.9000, lng: 38.8667, continent: "Africa" },
  { id: "so-shimbiris", countryCode: "SO", country: "Somalia", name: "Shimbiris", elevation: 2460, lat: 10.7333, lng: 47.0167, continent: "Africa" },
  { id: "bi-heha", countryCode: "BI", country: "Burundi", name: "Mount Heha", elevation: 2670, lat: -3.4167, lng: 29.5000, continent: "Africa" },
  { id: "ss-kinyeti", countryCode: "SS", country: "South Sudan", name: "Kinyeti", elevation: 3187, lat: 4.3833, lng: 32.6000, continent: "Africa" },

  // =====================
  // NORTH AMERICA
  // =====================
  { id: "us-denali", countryCode: "US", country: "United States", name: "Denali", elevation: 6190, lat: 63.0692, lng: -151.0063, continent: "North America", mountainId: "denali" },
  { id: "ca-logan", countryCode: "CA", country: "Canada", name: "Mount Logan", elevation: 5959, lat: 60.5679, lng: -140.4055, continent: "North America", mountainId: "logan" },
  { id: "mx-orizaba", countryCode: "MX", country: "Mexico", name: "Pico de Orizaba", elevation: 5636, lat: 19.0303, lng: -97.2686, continent: "North America", mountainId: "orizaba" },
  { id: "gt-tajumulco", countryCode: "GT", country: "Guatemala", name: "Volcán Tajumulco", elevation: 4220, lat: 15.0344, lng: -91.9033, continent: "North America" },
  { id: "cr-chirripo", countryCode: "CR", country: "Costa Rica", name: "Cerro Chirripó", elevation: 3820, lat: 9.4833, lng: -83.4833, continent: "North America" },
  { id: "pa-volcan-baru", countryCode: "PA", country: "Panama", name: "Volcán Barú", elevation: 3475, lat: 8.8083, lng: -82.5417, continent: "North America" },
  { id: "hn-cerro-las-minas", countryCode: "HN", country: "Honduras", name: "Cerro Las Minas", elevation: 2870, lat: 14.7833, lng: -88.4667, continent: "North America" },
  { id: "sv-el-pital", countryCode: "SV", country: "El Salvador", name: "Cerro El Pital", elevation: 2730, lat: 14.3833, lng: -89.1167, continent: "North America" },
  { id: "ni-mogoton", countryCode: "NI", country: "Nicaragua", name: "Mogotón", elevation: 2107, lat: 13.7333, lng: -86.2333, continent: "North America" },
  { id: "bz-doyles-delight", countryCode: "BZ", country: "Belize", name: "Doyle's Delight", elevation: 1124, lat: 16.4833, lng: -89.0167, continent: "North America" },
  { id: "cu-turquino", countryCode: "CU", country: "Cuba", name: "Pico Turquino", elevation: 1974, lat: 19.9833, lng: -76.8333, continent: "North America" },
  { id: "jm-blue-mountain", countryCode: "JM", country: "Jamaica", name: "Blue Mountain Peak", elevation: 2256, lat: 18.0458, lng: -76.5792, continent: "North America" },
  { id: "ht-pic-la-selle", countryCode: "HT", country: "Haiti", name: "Pic la Selle", elevation: 2680, lat: 18.3667, lng: -72.0333, continent: "North America" },
  { id: "do-pico-duarte", countryCode: "DO", country: "Dominican Republic", name: "Pico Duarte", elevation: 3098, lat: 19.0167, lng: -70.9833, continent: "North America" },
  { id: "pr-cerro-de-punta", countryCode: "PR", country: "Puerto Rico", name: "Cerro de Punta", elevation: 1338, lat: 18.1722, lng: -66.5919, continent: "North America" },
  { id: "tt-el-cerro-del-aripo", countryCode: "TT", country: "Trinidad and Tobago", name: "El Cerro del Aripo", elevation: 940, lat: 10.7333, lng: -61.2500, continent: "North America" },
  { id: "bs-mount-alvernia", countryCode: "BS", country: "Bahamas", name: "Mount Alvernia", elevation: 63, lat: 23.4833, lng: -75.4167, continent: "North America" },
  { id: "bb-mount-hillaby", countryCode: "BB", country: "Barbados", name: "Mount Hillaby", elevation: 336, lat: 13.2000, lng: -59.5667, continent: "North America" },
  { id: "dm-morne-diablotins", countryCode: "DM", country: "Dominica", name: "Morne Diablotins", elevation: 1447, lat: 15.5000, lng: -61.4000, continent: "North America" },
  { id: "lc-mount-gimie", countryCode: "LC", country: "Saint Lucia", name: "Mount Gimie", elevation: 950, lat: 13.8125, lng: -60.9739, continent: "North America" },
  { id: "vc-la-soufriere", countryCode: "VC", country: "Saint Vincent and the Grenadines", name: "La Soufrière", elevation: 1234, lat: 13.3372, lng: -61.1767, continent: "North America" },
  { id: "gd-mount-st-catherine", countryCode: "GD", country: "Grenada", name: "Mount Saint Catherine", elevation: 840, lat: 12.1500, lng: -61.6667, continent: "North America" },
  { id: "ag-boggy-peak", countryCode: "AG", country: "Antigua and Barbuda", name: "Mount Obama", elevation: 402, lat: 17.0950, lng: -61.8450, continent: "North America" },
  { id: "kn-mount-liamuiga", countryCode: "KN", country: "Saint Kitts and Nevis", name: "Mount Liamuiga", elevation: 1156, lat: 17.3667, lng: -62.8000, continent: "North America" },

  // =====================
  // SOUTH AMERICA
  // =====================
  { id: "ar-aconcagua", countryCode: "AR", country: "Argentina", name: "Aconcagua", elevation: 6961, lat: -32.6532, lng: -70.0109, continent: "South America", mountainId: "aconcagua" },
  { id: "cl-ojos-del-salado", countryCode: "CL", country: "Chile", name: "Ojos del Salado", elevation: 6893, lat: -27.1092, lng: -68.5414, continent: "South America", mountainId: "ojos-del-salado" },
  { id: "pe-huascaran", countryCode: "PE", country: "Peru", name: "Huascarán", elevation: 6768, lat: -9.1220, lng: -77.6042, continent: "South America", mountainId: "huascaran" },
  { id: "bo-nevado-sajama", countryCode: "BO", country: "Bolivia", name: "Nevado Sajama", elevation: 6542, lat: -18.1042, lng: -68.8833, continent: "South America" },
  { id: "ec-chimborazo", countryCode: "EC", country: "Ecuador", name: "Chimborazo", elevation: 6263, lat: -1.4692, lng: -78.8175, continent: "South America", mountainId: "chimborazo" },
  { id: "co-pico-cristobal-colon", countryCode: "CO", country: "Colombia", name: "Pico Cristóbal Colón", elevation: 5700, lat: 10.8306, lng: -73.6917, continent: "South America" },
  { id: "ve-pico-bolivar", countryCode: "VE", country: "Venezuela", name: "Pico Bolívar", elevation: 4978, lat: 8.5425, lng: -71.0478, continent: "South America" },
  { id: "br-pico-da-neblina", countryCode: "BR", country: "Brazil", name: "Pico da Neblina", elevation: 2994, lat: 0.8006, lng: -66.0103, continent: "South America" },
  { id: "gy-mount-roraima", countryCode: "GY", country: "Guyana", name: "Mount Roraima", elevation: 2810, lat: 5.1433, lng: -60.7625, continent: "South America" },
  { id: "sr-juliana-top", countryCode: "SR", country: "Suriname", name: "Julianatop", elevation: 1280, lat: 3.9667, lng: -56.5167, continent: "South America" },
  { id: "gf-bellevue-de-l-inini", countryCode: "GF", country: "French Guiana", name: "Bellevue de l'Inini", elevation: 851, lat: 2.8667, lng: -53.6333, continent: "South America" },
  { id: "py-cerro-pero", countryCode: "PY", country: "Paraguay", name: "Cerro Peró", elevation: 842, lat: -23.4333, lng: -56.4667, continent: "South America" },
  { id: "uy-cerro-catedral", countryCode: "UY", country: "Uruguay", name: "Cerro Catedral", elevation: 514, lat: -34.4000, lng: -55.2500, continent: "South America" },

  // =====================
  // OCEANIA
  // =====================
  { id: "au-kosciuszko", countryCode: "AU", country: "Australia", name: "Mount Kosciuszko", elevation: 2228, lat: -36.4564, lng: 148.2633, continent: "Oceania" },
  { id: "nz-aoraki", countryCode: "NZ", country: "New Zealand", name: "Aoraki / Mount Cook", elevation: 3724, lat: -43.5953, lng: 170.1417, continent: "Oceania" },
  { id: "pg-wilhelm", countryCode: "PG", country: "Papua New Guinea", name: "Mount Wilhelm", elevation: 4509, lat: -5.7806, lng: 145.0322, continent: "Oceania" },
  { id: "fj-tomanivi", countryCode: "FJ", country: "Fiji", name: "Mount Tomanivi", elevation: 1324, lat: -17.6167, lng: 178.0333, continent: "Oceania" },
  { id: "sb-popomanaseu", countryCode: "SB", country: "Solomon Islands", name: "Mount Popomanaseu", elevation: 2335, lat: -9.7167, lng: 160.0167, continent: "Oceania" },
  { id: "vu-tabwemasana", countryCode: "VU", country: "Vanuatu", name: "Mount Tabwemasana", elevation: 1879, lat: -15.3667, lng: 166.6500, continent: "Oceania" },
  { id: "ws-silisili", countryCode: "WS", country: "Samoa", name: "Mount Silisili", elevation: 1858, lat: -13.7833, lng: -172.2167, continent: "Oceania" },
  { id: "to-kao", countryCode: "TO", country: "Tonga", name: "Mount Kao", elevation: 1033, lat: -20.5333, lng: -175.0500, continent: "Oceania" },
  { id: "fm-nanlaud", countryCode: "FM", country: "Micronesia", name: "Nanlaud", elevation: 782, lat: 6.9083, lng: 158.2083, continent: "Oceania" },
  { id: "ki-banaba", countryCode: "KI", country: "Kiribati", name: "Banaba Island", elevation: 81, lat: -0.8667, lng: 169.5333, continent: "Oceania" },
  { id: "mh-unnamed", countryCode: "MH", country: "Marshall Islands", name: "Unnamed", elevation: 10, lat: 9.4000, lng: 170.0833, continent: "Oceania" },
  { id: "nr-command-ridge", countryCode: "NR", country: "Nauru", name: "Command Ridge", elevation: 71, lat: -0.5500, lng: 166.9333, continent: "Oceania" },
  { id: "pw-ngerchelchuus", countryCode: "PW", country: "Palau", name: "Mount Ngerchelchuus", elevation: 242, lat: 7.3500, lng: 134.4500, continent: "Oceania" },
  { id: "tv-niulakita", countryCode: "TV", country: "Tuvalu", name: "Niulakita", elevation: 5, lat: -10.7833, lng: 179.4667, continent: "Oceania" },

  // =====================
  // ANTARCTICA
  // =====================
  { id: "aq-vinson", countryCode: "AQ", country: "Antarctica", name: "Vinson Massif", elevation: 4892, lat: -78.5254, lng: -85.6172, continent: "Antarctica", mountainId: "vinson" },
];

// Group by continent
export const getHighPointsByContinent = (continent: string): CountryHighPoint[] =>
  countryHighPoints.filter(hp => hp.continent === continent);

// Get all continents
export const highPointContinents = [
  "Asia",
  "Europe",
  "Africa",
  "North America",
  "South America",
  "Oceania",
  "Antarctica",
];

// Get high point by country code
export const getHighPointByCountryCode = (countryCode: string): CountryHighPoint | undefined =>
  countryHighPoints.find(hp => hp.countryCode === countryCode);

// Get total count
export const getTotalHighPoints = (): number => countryHighPoints.length;

// Check if a high point has a linked mountain
export const hasLinkedMountain = (highPoint: CountryHighPoint): boolean =>
  !!highPoint.mountainId;
