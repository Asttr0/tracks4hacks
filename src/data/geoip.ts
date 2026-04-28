// Tiny static GeoIP lookup table for the demo. Replace with MaxMind GeoLite2
// JSON in public/ for a real lab.
export interface GeoRecord { ip: string; country: string; city: string; lat: number; lon: number }

export const GEOIP: Record<string, GeoRecord> = {
  '185.220.101.45': { ip: '185.220.101.45', country: 'DE', city: 'Frankfurt',  lat: 50.11,  lon: 8.68 },
  '193.163.125.12': { ip: '193.163.125.12', country: 'NL', city: 'Amsterdam',  lat: 52.37,  lon: 4.89 },
  '45.95.147.236':  { ip: '45.95.147.236',  country: 'RU', city: 'Moscow',     lat: 55.75,  lon: 37.61 },
  '104.21.45.10':   { ip: '104.21.45.10',   country: 'US', city: 'San Jose',   lat: 37.33,  lon: -121.89 },
  '41.248.12.99':   { ip: '41.248.12.99',   country: 'MA', city: 'Casablanca', lat: 33.57,  lon: -7.59 }
}

export const lookup = (ip: string): GeoRecord | undefined => GEOIP[ip]
