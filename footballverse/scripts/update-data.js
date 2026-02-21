const fs = require('fs');

const dataFile = 'app/select/forwards/data.js';
const resultsFile = 'scripts/forward-results.json';

// To be safe, let's reset to the original file content (wait, the file has been overwritten, but we only modified the ones WITH a match).
// Wait, actually I just ignored the lines without matches: "newLines.push(line);"
// Oh right, I need to read the current data.js, find all player objects, and remove the ones without a match in imageMap.
let dataCode = fs.readFileSync(dataFile, 'utf8');
const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

const lines = dataCode.split('\n');
const newLines = [];

let removed = 0;
for (const line of lines) {
    let shouldKeep = true;
    if (line.includes('{ id:')) {
        const idMatch = line.match(/id:\s*'([^']+)'/);
        if (idMatch) {
            const id = idMatch[1];
            // Only keep if it is explicitly in imageMap AND not missing
            if (results.imageMap[id] && !results.missing.includes(id)) {
                // It's good, ensure image path is updated
                const updatedLine = line.replace(/image:\s*(tsdb|img)\('[^']+'\)/, `image: tsdb('${results.imageMap[id]}')`);
                newLines.push(updatedLine);
                shouldKeep = false; // we already pushed
            } else {
                // Must be removed
                console.log(`Removing player: ${id}`);
                removed++;
                shouldKeep = false; // do not push
            }
        }
    }

    if (shouldKeep) {
        newLines.push(line);
    }
}

fs.writeFileSync(dataFile, newLines.join('\n'), 'utf8');
console.log(`Update complete. Removed ${removed} players.`);
