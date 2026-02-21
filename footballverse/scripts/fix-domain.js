const fs = require('fs');

const file = 'app/select/forwards/data.js';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

async function checkImage(filename) {
    const urlWww = `https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/${filename}&w=400&h=500&fit=cover&a=top`;
    const urlR2 = `https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/${filename}&w=400&h=500&fit=cover&a=top`;

    try {
        const resWww = await fetch(urlWww);
        if (resWww.status === 200) {
            return 'tsdb';
        }
    } catch (e) { }

    try {
        const resR2 = await fetch(urlR2);
        if (resR2.status === 200) {
            return 'img';
        }
    } catch (e) { }

    // fallback
    return 'img';
}

async function main() {
    console.log('Checking domains...');
    const checks = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('image: tsdb(') || line.includes('image: img(')) {
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

    // fetch all
    const results = await Promise.all(checks.map(async (c) => {
        const newFunc = await checkImage(c.filename);
        return { ...c, newFunc };
    }));

    let updated = 0;
    for (const r of results) {
        if (r.oldFunc !== r.newFunc) {
            const oldStr = `image: ${r.oldFunc}('${r.filename}')`;
            const newStr = `image: ${r.newFunc}('${r.filename}')`;
            lines[r.index] = lines[r.index].replace(oldStr, newStr);
            updated++;
            console.log(`${r.filename} changed from ${r.oldFunc} to ${r.newFunc}`);
        } else {
            console.log(`${r.filename} keeping ${r.oldFunc}`);
        }
    }

    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log(`Updated ${updated} images.`);
}

main();
