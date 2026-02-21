const fs = require('fs');

const file = 'app/select/defenders/data.js';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

async function checkImage(filename) {
    const urlWww = `https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/${filename}&w=400&h=500&fit=cover&a=top`;
    const urlR2 = `https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/${filename}&w=400&h=500&fit=cover&a=top`;

    try {
        const resWww = await fetchWithTimeout(urlWww);
        if (resWww.status === 200) return 'tsdb';
    } catch (e) { }

    try {
        const resR2 = await fetchWithTimeout(urlR2);
        if (resR2.status === 200) return 'img';
    } catch (e) { }

    return 'broken';
}

async function main() {
    console.log('Checking domains for defenders...');
    const checks = [];

    // We only want to process lines that contain an image definition.
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('{ id:') && (line.includes('image: tsdb(') || line.includes('image: img('))) {
            const m = line.match(/image:\s*(tsdb|img)\('([^']+)'\)/);
            if (m) {
                const funcName = m[1];
                const filename = m[2];
                checks.push({
                    index: i,
                    filename,
                    oldFunc: funcName
                });
            }
        }
    }

    const results = [];
    for (let i = 0; i < checks.length; i++) {
        const c = checks[i];
        const newFunc = await checkImage(c.filename);
        results.push({ ...c, newFunc });
        console.log(`[${i + 1}/${checks.length}] ${c.filename} -> ${newFunc}`);
    }

    let updated = 0;
    let removed = 0;
    const newLines = [];

    // Rebuild file line by line
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Find if this line was checked
        const check = results.find(r => r.index === i);

        if (check) {
            if (check.newFunc === 'broken') {
                console.log(`Removing player at line ${i + 1}: image broken (${check.filename})`);
                removed++;
                continue; // Skip pushing this line
            } else if (check.oldFunc !== check.newFunc) {
                const oldStr = `image: ${check.oldFunc}('${check.filename}')`;
                const newStr = `image: ${check.newFunc}('${check.filename}')`;
                line = line.replace(oldStr, newStr);
                updated++;
            }
        }

        newLines.push(line);
    }

    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
    console.log(`Done! Updated ${updated} player images and removed ${removed} broken players.`);
    process.exit(0);
}

main();
