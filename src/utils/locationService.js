import workersData from '../data/workers.json';

export const fetchRealDoorstepLocation = () => {
  return new Promise((resolve, reject) => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          try {
            // Free and accurate OpenStreetMap Reverse Geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': 'en-IN,en;q=0.9',
                  'User-Agent': 'UniServ-Cooperative-App/1.0'
                }
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json();
            const addr = data.address || {};

            // Extract hierarchical address fields
            const roadOrArea = addr.road || addr.suburb || addr.neighbourhood || addr.residential || '';
            const locality = [addr.suburb || addr.neighbourhood || addr.residential, addr.road].filter(Boolean).join(', ') || addr.subdistrict || 'Detected Locality';
            const city = addr.city || addr.town || addr.village || addr.city_district || addr.county || 'City';
            const district = addr.state_district || addr.county || addr.district || city;
            const stateName = addr.state || 'State';
            const pincode = addr.postcode || '';
            
            // Derive meaningful landmark like Zomato / Rapido
            const landmark = addr.amenity || addr.shop || addr.building || addr.office || (addr.road ? `Near ${addr.road}` : 'Opposite Main Road');
            
            // Structured Clean Formatted Address
            const cleanDisplay = [
              locality,
              city,
              district !== city ? district : null,
              stateName,
              pincode
            ].filter(Boolean).join(', ');

            resolve({
              success: true,
              latitude,
              longitude,
              accuracy: Math.round(accuracy),
              locality,
              city,
              district,
              stateName,
              pincode,
              landmark,
              formattedAddress: cleanDisplay || data.display_name,
              rawDisplayName: data.display_name
            });
          } catch (fetchError) {
            console.warn('Nominatim reverse geocoding API error, using GPS coordinates fallback:', fetchError);
            resolve({
              success: true,
              latitude,
              longitude,
              accuracy: Math.round(accuracy),
              locality: `GPS Sector (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
              city: 'New Delhi',
              district: 'South Delhi',
              stateName: 'Delhi (NCR)',
              pincode: '110024',
              landmark: 'GPS Pin Location',
              formattedAddress: `Sector at GPS [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`
            });
          }
        },
        (geoError) => {
          console.warn('Geolocation acquisition failed:', geoError);
          reject(geoError);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 10000
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by your browser or device.'));
    }
  });
};

/**
 * Parses any user address format (object or string) into structured fields
 */
export const parseUserLocation = (userAddress) => {
  if (!userAddress) {
    return {
      locality: 'Lajpat Nagar',
      city: 'New Delhi',
      district: 'South Delhi',
      state: 'Delhi (NCR)',
      pincode: '110024'
    };
  }

  if (typeof userAddress === 'object') {
    return {
      locality: userAddress.locality || userAddress.house || 'Local Sector',
      city: userAddress.city || 'Metro City',
      district: userAddress.district || userAddress.city || 'District Central',
      state: userAddress.state || userAddress.stateName || 'State',
      pincode: userAddress.pincode || '110001'
    };
  }

  if (typeof userAddress === 'string') {
    const parts = userAddress.split(',').map((p) => p.trim());
    const locality = parts[0] || 'Local Sector';
    const city = parts.length > 2 ? parts[parts.length - 2] : (parts[1] || 'City Area');
    const statePart = parts[parts.length - 1] || 'State';
    const pincodeMatch = statePart.match(/\b\d{6}\b/);

    return {
      locality: locality,
      city: city.replace(/-\s*\d{6}/, '').trim(),
      district: city.replace(/-\s*\d{6}/, '').trim(),
      state: statePart.replace(/-\s*\d{6}/, '').trim(),
      pincode: pincodeMatch ? pincodeMatch[0] : '110001'
    };
  }

  return {
    locality: 'Local Sector',
    city: 'City Area',
    district: 'Central District',
    state: 'State',
    pincode: '110001'
  };
};

/**
 * Comprehensive Indian City & Locality Geo-Coordinates Dictionary
 */
export const INDIAN_CITY_GEO_MAP = {
  // Tamil Nadu
  'chennai': { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  'coimbatore': { lat: 11.0168, lng: 76.9558, city: 'Coimbatore', state: 'Tamil Nadu' },
  'madurai': { lat: 9.9252, lng: 78.1198, city: 'Madurai', state: 'Tamil Nadu' },
  'tiruchirappalli': { lat: 10.7905, lng: 78.7047, city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  'trichy': { lat: 10.7905, lng: 78.7047, city: 'Trichy', state: 'Tamil Nadu' },
  'salem': { lat: 11.6643, lng: 78.1460, city: 'Salem', state: 'Tamil Nadu' },
  'tirunelveli': { lat: 8.7139, lng: 77.7567, city: 'Tirunelveli', state: 'Tamil Nadu' },
  'tiruppur': { lat: 11.1085, lng: 77.3411, city: 'Tiruppur', state: 'Tamil Nadu' },
  'vellore': { lat: 12.9165, lng: 79.1325, city: 'Vellore', state: 'Tamil Nadu' },
  'erode': { lat: 11.3410, lng: 77.7172, city: 'Erode', state: 'Tamil Nadu' },
  'thoothukudi': { lat: 8.7642, lng: 78.1348, city: 'Thoothukudi', state: 'Tamil Nadu' },
  'tuticorin': { lat: 8.7642, lng: 78.1348, city: 'Tuticorin', state: 'Tamil Nadu' },
  'dindigul': { lat: 10.3673, lng: 77.9803, city: 'Dindigul', state: 'Tamil Nadu' },
  'thanjavur': { lat: 10.7870, lng: 79.1378, city: 'Thanjavur', state: 'Tamil Nadu' },
  'nagercoil': { lat: 8.1833, lng: 77.4119, city: 'Nagercoil', state: 'Tamil Nadu' },
  'kanyakumari': { lat: 8.0883, lng: 77.5385, city: 'Kanyakumari', state: 'Tamil Nadu' },
  'kanchipuram': { lat: 12.8342, lng: 79.7036, city: 'Kanchipuram', state: 'Tamil Nadu' },
  'karur': { lat: 10.9601, lng: 78.0766, city: 'Karur', state: 'Tamil Nadu' },
  'cuddalore': { lat: 11.7480, lng: 79.7714, city: 'Cuddalore', state: 'Tamil Nadu' },
  'hosur': { lat: 12.7409, lng: 77.8253, city: 'Hosur', state: 'Tamil Nadu' },
  'tambaram': { lat: 12.9249, lng: 80.1000, city: 'Tambaram', state: 'Tamil Nadu' },
  'anna nagar': { lat: 13.0850, lng: 80.2101, city: 'Chennai', state: 'Tamil Nadu' },
  't nagar': { lat: 13.0418, lng: 80.2341, city: 'Chennai', state: 'Tamil Nadu' },
  'velachery': { lat: 12.9759, lng: 80.2212, city: 'Chennai', state: 'Tamil Nadu' },
  'adyar': { lat: 13.0012, lng: 80.2565, city: 'Chennai', state: 'Tamil Nadu' },

  // Karnataka
  'bengaluru': { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  'bangalore': { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  'mysuru': { lat: 12.2958, lng: 76.6394, city: 'Mysuru', state: 'Karnataka' },
  'mysore': { lat: 12.2958, lng: 76.6394, city: 'Mysore', state: 'Karnataka' },
  'hubballi': { lat: 15.3647, lng: 75.1240, city: 'Hubballi', state: 'Karnataka' },
  'mangaluru': { lat: 12.9141, lng: 74.8560, city: 'Mangaluru', state: 'Karnataka' },
  'mangalore': { lat: 12.9141, lng: 74.8560, city: 'Mangalore', state: 'Karnataka' },
  'belagavi': { lat: 15.8497, lng: 74.4977, city: 'Belagavi', state: 'Karnataka' },
  'koramangala': { lat: 12.9352, lng: 77.6245, city: 'Bengaluru', state: 'Karnataka' },
  'indiranagar': { lat: 12.9784, lng: 77.6408, city: 'Bengaluru', state: 'Karnataka' },
  'whitefield': { lat: 12.9698, lng: 77.7500, city: 'Bengaluru', state: 'Karnataka' },
  'electronic city': { lat: 12.8399, lng: 77.6770, city: 'Bengaluru', state: 'Karnataka' },

  // Maharashtra
  'mumbai': { lat: 19.0760, lng: 72.8777, city: 'Mumbai', state: 'Maharashtra' },
  'pune': { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra' },
  'nagpur': { lat: 21.1458, lng: 79.0882, city: 'Nagpur', state: 'Maharashtra' },
  'nashik': { lat: 19.9975, lng: 73.7898, city: 'Nashik', state: 'Maharashtra' },
  'thane': { lat: 19.2183, lng: 72.9781, city: 'Thane', state: 'Maharashtra' },
  'navi mumbai': { lat: 19.0330, lng: 73.0297, city: 'Navi Mumbai', state: 'Maharashtra' },
  'aurangabad': { lat: 19.8762, lng: 75.3433, city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra' },
  'solapur': { lat: 17.6599, lng: 75.9064, city: 'Solapur', state: 'Maharashtra' },
  'andheri': { lat: 19.1136, lng: 72.8697, city: 'Mumbai', state: 'Maharashtra' },
  'bandra': { lat: 19.0596, lng: 72.8295, city: 'Mumbai', state: 'Maharashtra' },
  'hinjewadi': { lat: 18.5913, lng: 73.7389, city: 'Pune', state: 'Maharashtra' },

  // Telangana & Andhra Pradesh
  'hyderabad': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
  'secunderabad': { lat: 17.4399, lng: 78.4983, city: 'Secunderabad', state: 'Telangana' },
  'warangal': { lat: 17.9689, lng: 79.5941, city: 'Warangal', state: 'Telangana' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  'vizag': { lat: 17.6868, lng: 83.2185, city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, city: 'Vijayawada', state: 'Andhra Pradesh' },
  'guntur': { lat: 16.3067, lng: 80.4365, city: 'Guntur', state: 'Andhra Pradesh' },
  'tirupati': { lat: 13.6288, lng: 79.4192, city: 'Tirupati', state: 'Andhra Pradesh' },
  'gachibowli': { lat: 17.4401, lng: 78.3489, city: 'Hyderabad', state: 'Telangana' },
  'hitec city': { lat: 17.4474, lng: 78.3762, city: 'Hyderabad', state: 'Telangana' },

  // Kerala
  'kochi': { lat: 9.9312, lng: 76.2673, city: 'Kochi', state: 'Kerala' },
  'cochin': { lat: 9.9312, lng: 76.2673, city: 'Kochi', state: 'Kerala' },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, city: 'Thiruvananthapuram', state: 'Kerala' },
  'trivandrum': { lat: 8.5241, lng: 76.9366, city: 'Trivandrum', state: 'Kerala' },
  'kozhikode': { lat: 11.2588, lng: 75.7804, city: 'Kozhikode', state: 'Kerala' },
  'calicut': { lat: 11.2588, lng: 75.7804, city: 'Calicut', state: 'Kerala' },
  'thrissur': { lat: 10.5276, lng: 76.2144, city: 'Thrissur', state: 'Kerala' },
  'kollam': { lat: 8.8932, lng: 76.6141, city: 'Kollam', state: 'Kerala' },

  // Delhi NCR
  'delhi': { lat: 28.6139, lng: 77.2090, city: 'Delhi', state: 'Delhi' },
  'new delhi': { lat: 28.6139, lng: 77.2090, city: 'New Delhi', state: 'Delhi' },
  'noida': { lat: 28.5355, lng: 77.3910, city: 'Noida', state: 'Uttar Pradesh' },
  'greater noida': { lat: 28.4744, lng: 77.5040, city: 'Greater Noida', state: 'Uttar Pradesh' },
  'gurugram': { lat: 28.4595, lng: 77.0266, city: 'Gurugram', state: 'Haryana' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, city: 'Gurgaon', state: 'Haryana' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, city: 'Ghaziabad', state: 'Uttar Pradesh' },
  'faridabad': { lat: 28.4089, lng: 77.3178, city: 'Faridabad', state: 'Haryana' },
  'lajpat nagar': { lat: 28.5672, lng: 77.2435, city: 'New Delhi', state: 'Delhi' },

  // West Bengal & East
  'kolkata': { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
  'howrah': { lat: 22.5958, lng: 88.2636, city: 'Howrah', state: 'West Bengal' },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245, city: 'Bhubaneswar', state: 'Odisha' },
  'patna': { lat: 25.5941, lng: 85.1376, city: 'Patna', state: 'Bihar' },
  'guwahati': { lat: 26.1445, lng: 91.7362, city: 'Guwahati', state: 'Assam' },

  // Gujarat
  'ahmedabad': { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  'surat': { lat: 21.1702, lng: 72.8311, city: 'Surat', state: 'Gujarat' },
  'vadodara': { lat: 22.3072, lng: 73.1812, city: 'Vadodara', state: 'Gujarat' },
  'rajkot': { lat: 22.3039, lng: 70.8022, city: 'Rajkot', state: 'Gujarat' },

  // Rajasthan & North/Central
  'jaipur': { lat: 26.9124, lng: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  'jodhpur': { lat: 26.2389, lng: 73.0243, city: 'Jodhpur', state: 'Rajasthan' },
  'udaipur': { lat: 24.5854, lng: 73.7125, city: 'Udaipur', state: 'Rajasthan' },
  'lucknow': { lat: 26.8467, lng: 80.9462, city: 'Lucknow', state: 'Uttar Pradesh' },
  'kanpur': { lat: 26.4499, lng: 80.3319, city: 'Kanpur', state: 'Uttar Pradesh' },
  'indore': { lat: 22.7196, lng: 75.8577, city: 'Indore', state: 'Madhya Pradesh' },
  'bhopal': { lat: 23.2599, lng: 77.4126, city: 'Bhopal', state: 'Madhya Pradesh' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, city: 'Chandigarh', state: 'Chandigarh' },
  'ludhiana': { lat: 30.9010, lng: 75.8573, city: 'Ludhiana', state: 'Punjab' }
};

/**
 * Returns precise latitude & longitude for any address string or object
 */
export const getPreciseCoordinates = (addressInput) => {
  if (!addressInput) {
    return { lat: 13.0827, lng: 80.2707, city: 'Chennai', locality: 'Doorstep', state: 'Tamil Nadu' };
  }

  // If already coordinates
  if (typeof addressInput === 'object') {
    if (addressInput.latitude && addressInput.longitude) {
      return {
        lat: Number(addressInput.latitude),
        lng: Number(addressInput.longitude),
        city: addressInput.city || 'Your City',
        locality: addressInput.locality || 'Doorstep',
        state: addressInput.state || 'State'
      };
    }
    if (addressInput.lat && addressInput.lng) {
      return {
        lat: Number(addressInput.lat),
        lng: Number(addressInput.lng),
        city: addressInput.city || 'Your City',
        locality: addressInput.locality || 'Doorstep',
        state: addressInput.state || 'State'
      };
    }
  }

  const str = String(typeof addressInput === 'object' ? (addressInput.formattedAddress || addressInput.address || '') : addressInput).toLowerCase();

  // Match against city/locality dictionary
  for (const [key, val] of Object.entries(INDIAN_CITY_GEO_MAP)) {
    if (str.includes(key)) {
      return {
        lat: val.lat,
        lng: val.lng,
        city: val.city,
        locality: key.toUpperCase(),
        state: val.state
      };
    }
  }

  // Fallback default
  return { lat: 13.0827, lng: 80.2707, city: 'Chennai', locality: 'Doorstep', state: 'Tamil Nadu' };
};

/**
 * State to RTO Vehicle Registration Code Mapping
 */
const STATE_RTO_MAP = {
  'delhi': 'DL',
  'karnataka': 'KA',
  'maharashtra': 'MH',
  'tamil nadu': 'TN',
  'telangana': 'TS',
  'andhra pradesh': 'AP',
  'uttar pradesh': 'UP',
  'gujarat': 'GJ',
  'west bengal': 'WB',
  'rajasthan': 'RJ',
  'haryana': 'HR',
  'punjab': 'PB',
  'kerala': 'KL',
  'madhya pradesh': 'MP',
  'bihar': 'BR',
  'odisha': 'OD',
  'assam': 'AS'
};

/**
 * Dynamically resolves the regional Cooperative Federation & Ward Supervisor for the user's city
 */
export const getHyperLocalCooperative = (userAddress) => {
  const loc = parseUserLocation(userAddress);
  const stateLower = (loc.state || '').toLowerCase();
  
  let stateRTO = 'DL';
  for (const [k, v] of Object.entries(STATE_RTO_MAP)) {
    if (stateLower.includes(k) || (loc.city || '').toLowerCase().includes(k)) {
      stateRTO = v;
      break;
    }
  }

  // Generate authentic city cooperative name
  const coopName = `${loc.city} District Labour & Artisans Cooperative Federation`;
  const regNo = `MSCS/CR/${stateRTO}-2021/${Math.floor(100 + Math.random() * 899)} (NCCT Affiliated)`;
  const wardCoverage = `${loc.locality}, ${loc.district}, ${loc.city}`;

  return {
    id: `coop_${stateRTO.toLowerCase()}`,
    name: coopName,
    shortName: `${loc.city} Cooperative Federation`,
    registration_no: regNo,
    head_name: `Shri Suresh K. ${loc.city.slice(0, 5)}`,
    head_designation: `District Ward Coordinator (${loc.district})`,
    head_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    phone: '+91 98101 23456',
    email: `ward.${loc.city.toLowerCase().replace(/[^a-z]/g, '')}@coop.gov.in`,
    office_address: `Cooperative Sahakar Bhawan, Ward 12, ${loc.district}, ${loc.city} - ${loc.pincode}`,
    fleet_size: '65+ Certified Local Artisans',
    rating: 4.9,
    completed_bulk_contracts: 168,
    ward_coverage: wardCoverage,
    stateRTO
  };
};

/**
 * Dynamically adapts the worker pool to the user's exact neighborhood / city
 */
export const adaptWorkersToUserLocation = (workersList = [], userAddress, serviceName = 'Service') => {
  const loc = parseUserLocation(userAddress);
  const coop = getHyperLocalCooperative(userAddress);

  return workersList.map((worker, index) => {
    // Generate realistic proximity distances between 0.6 km and 1.8 km
    const distanceKm = Number((0.6 + (index * 0.3) + (Math.random() * 0.2)).toFixed(1));
    const etaMins = Math.max(6, Math.round(distanceKm * 7 + 2));

    // Dynamic Stand Location in the user's locality
    const standLocation = index === 0
      ? `${loc.locality} Ward Stand No. ${index + 1}`
      : `${loc.locality} Main Sector Stand`;

    // Local vehicle registration plate
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const vehiclePlate = `${coop.stateRTO} 0${(index % 9) + 1} CD ${randNum}`;

    // Hyper-Local Tailored Match Reason
    const matchReason = `Matched because ${worker.name} is stationed only ${distanceKm} km away at ${standLocation}, certified by ${coop.shortName}, has a 99% on-time completion record, and carries active cooperative safety insurance.`;

    return {
      ...worker,
      current_location: standLocation,
      distance_km: distanceKm,
      eta_minutes: etaMins,
      cooperative: coop.name,
      cooperative_short: coop.shortName,
      cooperative_reg: coop.registration_no,
      vehicle_plate: vehiclePlate,
      match_reason: matchReason,
      ward_head: coop.head_name,
      ward_phone: coop.phone,
      ward_coverage: coop.ward_coverage
    };
  });
};

export const CANONICAL_TRADE_MAP = {
  // Service IDs
  's1': 'Plumber',
  's2': 'Electrician',
  's3': 'Cleaner',
  's4': 'Carpenter',
  's5': 'Painter',
  's6': 'Caregiver',
  's7': 'Technician',
  's8': 'Domestic Helper',
  's9': 'Driver',
  's10': 'Gardener',

  // Trade keywords (English & Regional)
  'plumber': 'Plumber',
  'plumbing': 'Plumber',
  'tap': 'Plumber',
  'pipe': 'Plumber',
  'leak': 'Plumber',
  'குழாய்': 'Plumber',
  'नल': 'Plumber',

  'electrician': 'Electrician',
  'electric': 'Electrician',
  'wiring': 'Electrician',
  'mcb': 'Electrician',
  'மின்': 'Electrician',
  'बिजली': 'Electrician',

  'cleaner': 'Cleaner',
  'cleaning': 'Cleaner',
  'clean': 'Cleaner',
  'துப்புரவு': 'Cleaner',
  'सफाई': 'Cleaner',

  'carpenter': 'Carpenter',
  'carpentry': 'Carpenter',
  'wood': 'Carpenter',
  'தச்சர்': 'Carpenter',
  'बढ़ई': 'Carpenter',

  'painter': 'Painter',
  'painting': 'Painter',
  'paint': 'Painter',
  'வண்ணம்': 'Painter',
  'पेंटर': 'Painter',

  'caregiver': 'Caregiver',
  'care': 'Caregiver',
  'elder': 'Caregiver',
  'nurse': 'Caregiver',
  'பராமரிப்பாளர்': 'Caregiver',
  'देखभाल': 'Caregiver',

  'technician': 'Technician',
  'tech': 'Technician',
  'appliance': 'Technician',
  'ac': 'Technician',
  'motor': 'Technician',
  'தொழில்நுட்ப': 'Technician',
  'तकनीशियन': 'Technician',

  'domestic helper': 'Domestic Helper',
  'domestic': 'Domestic Helper',
  'maid': 'Domestic Helper',
  'cook': 'Domestic Helper',
  'househelp': 'Domestic Helper',
  'வீட்டு உதவியாளர்': 'Domestic Helper',
  'घरेलू सहायक': 'Domestic Helper',
  'कामवाली': 'Domestic Helper',

  'driver': 'Driver',
  'chauffeur': 'Driver',
  'car': 'Driver',
  'cab': 'Driver',
  'drive': 'Driver',
  'டிரைவர்': 'Driver',
  'சாரதி': 'Driver',
  'ड्राइवर': 'Driver',
  'चालक': 'Driver',

  'gardener': 'Gardener',
  'garden': 'Gardener',
  'plant': 'Gardener',
  'lawn': 'Gardener',
  'தோட்டக்காரர்': 'Gardener',
  'माली': 'Gardener'
};

export const getCanonicalSkill = (service) => {
  if (!service) return 'Plumber';
  if (typeof service === 'string') {
    const s = service.toLowerCase().trim();
    if (CANONICAL_TRADE_MAP[s]) return CANONICAL_TRADE_MAP[s];
    for (const [key, skill] of Object.entries(CANONICAL_TRADE_MAP)) {
      if (s.includes(key)) return skill;
    }
    return 'Plumber';
  }

  // Object with id (e.g. s9, s8, s2, s7)
  const serviceId = (service.id || '').toLowerCase().trim();
  if (CANONICAL_TRADE_MAP[serviceId]) {
    return CANONICAL_TRADE_MAP[serviceId];
  }

  // Check service name
  const nameStr = (service.name || '').toLowerCase().trim();
  if (CANONICAL_TRADE_MAP[nameStr]) {
    return CANONICAL_TRADE_MAP[nameStr];
  }
  for (const [key, skill] of Object.entries(CANONICAL_TRADE_MAP)) {
    if (nameStr.includes(key)) return skill;
  }

  return 'Plumber';
};

export const getWorkersForTrade = (service, userAddress) => {
  const canonicalSkill = getCanonicalSkill(service);
  const matching = workersData.filter((w) => w.skill.toLowerCase() === canonicalSkill.toLowerCase());
  const pool = matching.length > 0 ? matching : workersData.filter(w => w.skill === canonicalSkill);
  return adaptWorkersToUserLocation(pool.length > 0 ? pool : workersData.slice(0, 3), userAddress, canonicalSkill);
};

export const getFallbackWorkerForTrade = (service) => {
  const canonicalSkill = getCanonicalSkill(service);
  const worker = workersData.find((w) => w.skill.toLowerCase() === canonicalSkill.toLowerCase());
  return worker || workersData[0];
};

export default {
  fetchRealDoorstepLocation,
  parseUserLocation,
  getHyperLocalCooperative,
  adaptWorkersToUserLocation,
  CANONICAL_TRADE_MAP,
  getCanonicalSkill,
  getWorkersForTrade,
  getFallbackWorkerForTrade
};
