
const fs = require('fs');
const path = require('path');

const MANAGERS_PATH = path.join(__dirname, 'data', 'managers.json');

async function fetchFromSportsDB(name) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.player && data.player.length > 0) {
            const p = data.player.find(x => x.strThumb) || data.player[0];
            if (p.strThumb) {
                return `https://images.weserv.nl/?url=${p.strThumb.replace(/^https?:\/\//, '')}&w=400&h=400&fit=cover&a=top`;
            }
        }
    } catch (e) { }
    return null;
}

async function start() {
    const managers = JSON.parse(fs.readFileSync(MANAGERS_PATH, 'utf8'));
    console.log(`Syncing ${managers.length} managers...`);

    for (let i = 0; i < managers.length; i++) {
        const m = managers[i];

        // 1. Legend Fix (Wikimedia)
        if (m.image && m.image.includes('wikimedia') && !m.image.includes('weserv')) {
            m.image = `https://images.weserv.nl/?url=${m.image.replace(/^https?:\/\//, '')}&w=400&h=400&fit=cover&a=top`;
        }

        // 2. Search if missing or poor quality
        if (!m.image || m.image.includes('dicebear') || m.image === null) {
            console.log(`[${i + 1}/${managers.length}] Syncing: ${m.name}...`);
            const realImage = await fetchFromSportsDB(m.name);
            if (realImage) {
                m.image = realImage;
                console.log(`   ✓ Found real photo`);
            } else {
                // High-End Neon Initial Avatar
                m.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0a0a0a&color=00ff88&bold=true&size=400&font-size=0.33`;
                console.log(`   ✗ Defaulted to UI-Avatar`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (i % 20 === 0) {
            fs.writeFileSync(MANAGERS_PATH, JSON.stringify(managers, null, 2));
        }
    }

    fs.writeFileSync(MANAGERS_PATH, JSON.stringify(managers, null, 2));
    console.log('Final Sync Complete!');
}

start();
