const fs = require('fs');

const d = fs.readFileSync('src/data/dghs500HospitalsData.ts', 'utf8');
const dh = fs.readFileSync('src/data/dhakaComprehensiveHospitals.ts', 'utf8');
const c = fs.readFileSync('src/data/allHospitalsData.ts', 'utf8');

function countHospitals(text) {
  const m1 = text.match(/id:\s*['"][^'"]+['"]/g) || [];
  const m2 = text.match(/"id":\s*['"][^'"]+['"]/g) || [];
  return m1.length + m2.length;
}

console.log('dghs500 count:', countHospitals(d));
console.log('dhakaComprehensive count:', countHospitals(dh));
console.log('allHospitals extra count:', countHospitals(c));
console.log('Total hospitals:', countHospitals(d) + countHospitals(dh) + countHospitals(c));
