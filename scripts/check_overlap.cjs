const fs = require('fs');

const dghsContent = fs.readFileSync('src/data/dghs500HospitalsData.ts', 'utf8');
const dhakaContent = fs.readFileSync('src/data/dhakaComprehensiveHospitals.ts', 'utf8');
const allContent = fs.readFileSync('src/data/allHospitalsData.ts', 'utf8');

function extractIds(text) {
  const ids = [];
  const re = /(?:id|"id"):\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

function extractCodes(text) {
  const codes = [];
  const re = /(?:code|"code"):\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    codes.push(m[1]);
  }
  return codes;
}

const dghsIds = extractIds(dghsContent);
const dghsCodes = extractCodes(dghsContent);

const dhakaIds = extractIds(dhakaContent);
const dhakaCodes = extractCodes(dhakaContent);

const allIds = extractIds(allContent);
const allCodes = extractCodes(allContent);

console.log('DGHS IDs:', dghsIds.length, 'DGHS Codes:', dghsCodes.length);
console.log('Dhaka IDs:', dhakaIds.length, 'Dhaka Codes:', dhakaCodes.length);
console.log('All IDs:', allIds.length, 'All Codes:', allCodes.length);

const existingCodes = new Set([...dhakaCodes, ...allCodes]);
const overlappingCodes = dghsCodes.filter(c => existingCodes.has(c));
console.log('Overlapping codes between DGHS 500 and existing:', overlappingCodes);

const existingIds = new Set([...dhakaIds, ...allIds]);
const overlappingIds = dghsIds.filter(id => existingIds.has(id));
console.log('Overlapping IDs:', overlappingIds);
