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
const headers = parseCSVLine(lines[0]);
console.log('Headers:', headers);

const rows = [];
for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length >= 10) {
    rows.push({
      id: cols[0],
      name: cols[1],
      banglaName: cols[2],
      code: cols[3],
      email: cols[4],
      agency: cols[5],
      type: cols[6],
      ownership: cols[7],
      division: cols[8],
      district: cols[9],
      cityCorp: cols[10] || '',
      upazila: cols[11] || '',
      active: cols[12] || 'Yes'
    });
  }
}

console.log('Total valid rows:', rows.length);

const types = {};
const districts = {};
const divisions = {};

rows.forEach(r => {
  types[r.type] = (types[r.type] || 0) + 1;
  divisions[r.division] = (divisions[r.division] || 0) + 1;
  districts[r.district] = (districts[r.district] || 0) + 1;
});

console.log('Unique types:', types);
console.log('Districts:', districts);
console.log('Divisions:', divisions);
