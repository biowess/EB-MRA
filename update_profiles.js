const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/profiles.json', 'utf8'));

for (let profile of data.profiles) {
  if (profile.excluded_if && profile.excluded_if.length > 0) {
    if (profile.id === 'PROF-22') {
      // Special AND-group for PROF-22
      profile.excluded_if = [
        [
          { "domain": "SAR", "tier": "Low" },
          { "domain": "IHOR", "tier": "Low" }
        ]
      ];
    } else {
      // Wrap existing single items into an AND-group of 1
      profile.excluded_if = profile.excluded_if.map(cond => [cond]);
    }
  }
}

fs.writeFileSync('./src/data/profiles.json', JSON.stringify(data, null, 2));
