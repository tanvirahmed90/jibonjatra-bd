const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/data/dghs_500_facilities.csv');
const raw = fs.readFileSync(csvPath, 'utf8');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
const locations = {};

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length >= 12) {
    const division = cols[8];
    const district = cols[9];
    const cityCorp = cols[10];
    const upazila = cols[11];
    const key = `${district} -> ${upazila || cityCorp || 'Sadar'}`;
    locations[key] = (locations[key] || 0) + 1;
  }
}

console.log('Unique locations count:', Object.keys(locations).length);
console.log(JSON.stringify(locations, null, 2));
