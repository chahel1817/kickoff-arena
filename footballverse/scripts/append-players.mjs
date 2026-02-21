import fs from 'fs';

const results = JSON.parse(fs.readFileSync('scripts/new-players-output.json', 'utf8'));

function appendToDataArray(filePath, newItems, arrayName) {
    if (newItems.length === 0) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Find where the array starts and ends
    // We can just append the items before the closing '];' of the array
    const parts = content.split('];');
    if (parts.length < 2) {
        console.error(`Could not find closing ]; in ${filePath}`);
        return;
    }

    const insertion = newItems.join('\n') + '\n';

    // Reconstruct
    const body = parts[0] + '\n    // --- NEW ADDITIONS ---\n' + insertion + '];' + parts.slice(1).join('];');

    fs.writeFileSync(filePath, body, 'utf8');
    console.log(`Added ${newItems.length} items to ${filePath}`);
}

appendToDataArray('app/select/midfielders/data.js', results.CM, 'MIDFIELDERS');
appendToDataArray('app/select/forwards/data.js', results.ST, 'FORWARDS');
appendToDataArray('app/select/goalkeeper/data.js', results.GK, 'GOALKEEPERS');

console.log('Appended all new players successfully.');
