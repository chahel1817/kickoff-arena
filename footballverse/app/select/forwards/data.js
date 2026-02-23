

const img = (file) => `https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/${file}&w=400&h=500&fit=cover&a=top`;
const tsdb = (file) => `https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/${file}&w=400&h=500&fit=cover&a=top`;

export const FORWARDS = [
    // ── ST (Strikers) — Current ──
    { id: 'haaland', name: 'Erling Haaland', country: 'Norway', club: 'Man City', rating: 94, position: 'ST', tier: 'current', image: img('bb1agj1727415216.jpg'), skills: ['Power House', 'Finisher'] },
    { id: 'mbappe', name: 'Kylian Mbappé', country: 'France', club: 'Real Madrid', rating: 93, position: 'ST', tier: 'current', image: tsdb('0yw04y1771265385.jpg'), skills: ['Speedster', 'Clinical'] },
    { id: 'osimhen', name: 'Victor Osimhen', country: 'Nigeria', club: 'Galatasaray', rating: 89, position: 'ST', tier: 'current', image: img('snhzzq1702566147.jpg'), skills: ['Aerial Aura', 'Physical'] },
    { id: 'kane', name: 'Harry Kane', country: 'England', club: 'Bayern', rating: 90, position: 'ST', tier: 'current', image: tsdb('0w9up71770542636.jpg'), skills: ['Elite Finish', 'Playmaker'] },
    { id: 'firmino', name: 'Roberto Firmino', country: 'Brazil', club: 'Al Ahli', rating: 83, position: 'ST', tier: 'current', image: img('33vciw1509999942.jpg'), skills: ['False 9', 'Technical'] },
    { id: 'nunez', name: 'Darwin Núñez', country: 'Uruguay', club: 'Liverpool', rating: 83, position: 'ST', tier: 'current', image: img('6b6yhd1718090345.jpg'), skills: ['Chaos Factor', 'Fast'] },
    { id: 'lukaku', name: 'Romelu Lukaku', country: 'Belgium', club: 'Napoli', rating: 84, position: 'ST', tier: 'current', image: img('0yrfdz1725016583.jpg'), skills: ['Tank', 'Target Man'] },
    { id: 'morata', name: 'Álvaro Morata', country: 'Spain', club: 'AC Milan', rating: 83, position: 'ST', tier: 'current', image: img('oi5xzw1565177307.jpg'), skills: ['Header', 'Link-up'] },
    { id: 'vlahovic', name: 'Dušan Vlahović', country: 'Serbia', club: 'Juventus', rating: 85, position: 'ST', tier: 'current', image: img('m568x71546427386.jpg'), skills: ['Sharp', 'Tall ST'] },
    { id: 'fullkrug', name: 'Niclas Füllkrug', country: 'Germany', club: 'Dortmund', rating: 82, position: 'ST', tier: 'current', image: img('5uc4371722878196.jpg'), skills: ['Bulldozer', 'Traditional'] },
    { id: 'gyokeres', name: 'Viktor Gyökeres', country: 'Sweden', club: 'Sporting CP', rating: 87, position: 'ST', tier: 'current', image: img('1j185h1609184069.jpg'), skills: ['Clinical', 'Machine'] },
    { id: 'isak', name: 'Alexander Isak', country: 'Sweden', club: 'Newcastle', rating: 86, position: 'ST', tier: 'current', image: img('b3kj061532275016.jpg'), skills: ['Slinky', 'Speed'] },
    { id: 'watkins', name: 'Ollie Watkins', country: 'England', club: 'Aston Villa', rating: 84, position: 'ST', tier: 'current', image: img('9l400s1752069048.jpg'), skills: ['Movement', 'Reliable'] },
    { id: 'benzema', name: 'Karim Benzema', country: 'France', club: 'Al Ittihad', rating: 88, position: 'ST', tier: 'current', image: img('0bzer81704623143.jpg'), skills: ['Golden Ball', 'Class'] },
    { id: 'toney', name: 'Ivan Toney', country: 'England', club: 'Al Ahli', rating: 81, position: 'ST', tier: 'current', image: img('woevg11724686948.jpg'), skills: ['Penalty Spec', 'Physical'] },
    { id: 'jackson', name: 'Nicolas Jackson', country: 'Senegal', club: 'Chelsea', rating: 81, position: 'ST', tier: 'current', image: tsdb('5bv5ob1770543405.jpg'), skills: ['Workrate', 'Young ST'] },
    { id: 'lewandowski_c', name: 'Robert Lewandowski', country: 'Poland', club: 'Barcelona', rating: 89, position: 'ST', tier: 'current', image: tsdb('1ogy3i1771254580.jpg'), skills: ['Legend ST', 'Clinical'] },
    { id: 'griezmann_c', name: 'Antoine Griezmann', country: 'France', club: 'Atlético', rating: 88, position: 'ST', tier: 'current', image: img('xpmyw01702565423.jpg'), skills: ['Creative', 'Workrate'] },
    { id: 'lautaro_c', name: 'Lautaro Martínez', country: 'Argentina', club: 'Inter', rating: 89, position: 'ST', tier: 'current', image: img('u9ayre1546611366.jpg'), skills: ['El Toro', 'Leader'] },
    { id: 'højlund', name: 'Rasmus Højlund', country: 'Denmark', club: 'Man United', rating: 80, position: 'ST', tier: 'current', image: img('s29z7z1701389035.jpg'), skills: ['Strong', 'Young ST'] },

    // ── RW (Right Wingers) — Current ──
    { id: 'salah', name: 'Mohamed Salah', country: 'Egypt', club: 'Liverpool', rating: 91, position: 'RW', tier: 'current', image: img('o7y57t1718438615.jpg'), skills: ['Egyptian King', 'Incisive'] },
    { id: 'saka', name: 'Bukayo Saka', country: 'England', club: 'Arsenal', rating: 88, position: 'RW', tier: 'current', image: tsdb('axl31b1769332282.jpg'), skills: ['Star Boy', 'Magic Left'] },
    { id: 'vini', name: 'Vinícius Jr.', country: 'Brazil', club: 'Real Madrid', rating: 92, position: 'RW', tier: 'current', image: tsdb('lxf1he1771264845.jpg'), skills: ['Dribble King', 'Elite Speed'] },
    { id: 'rodrygo', name: 'Rodrygo', country: 'Brazil', club: 'Real Madrid', rating: 86, position: 'RW', tier: 'current', image: tsdb('81sef31771265827.jpg'), skills: ['Slick', 'Clutch'] },
    { id: 'yamal', name: 'Lamine Yamal', country: 'Spain', club: 'Barcelona', rating: 84, position: 'RW', tier: 'current', image: tsdb('ve837v1770215918.jpg'), skills: ['The Future', 'Wizard'] },
    { id: 'palmer', name: 'Cole Palmer', country: 'England', club: 'Chelsea', rating: 87, position: 'RW', tier: 'current', image: tsdb('r7yrsa1770541322.jpg'), skills: ['Ice Cold', 'Playmaker'] },
    { id: 'foden_rw', name: 'Phil Foden', country: 'England', club: 'Man City', rating: 89, position: 'RW', tier: 'current', image: img('19o7yc1749157221.jpg'), skills: ['Stockport', 'Technique'] },
    { id: 'dembele', name: 'Ousmane Dembélé', country: 'France', club: 'PSG', rating: 86, position: 'RW', tier: 'current', image: tsdb('7h66un1770216356.jpg'), skills: ['Two-Footed', 'Ghost'] },
    { id: 'raphinha', name: 'Raphinha', country: 'Brazil', club: 'Barcelona', rating: 86, position: 'RW', tier: 'current', image: tsdb('14kuzy1771260047.jpg'), skills: ['Hard Work', 'Curver'] },
    { id: 'diaz_rw', name: 'Luis Díaz', country: 'Colombia', club: 'Liverpool', rating: 85, position: 'RW', tier: 'current', image: tsdb('i4s5pw1770543222.jpg'), skills: ['Energetic', 'Flair'] },
    { id: 'gnabry', name: 'Serge Gnabry', country: 'Germany', club: 'Bayern', rating: 82, position: 'RW', tier: 'current', image: img('u2f5201660764673.jpg'), skills: ['Power', 'Direct'] },
    { id: 'mahrez', name: 'Riyad Mahrez', country: 'Algeria', club: 'Al Ahli', rating: 82, position: 'RW', tier: 'current', image: img('jwon5m1557859719.jpg'), skills: ['First Touch', 'Silk'] },
    { id: 'olise', name: 'Michael Olise', country: 'France', club: 'Bayern', rating: 84, position: 'RW', tier: 'current', image: tsdb('8pylm21770542385.jpg'), skills: ['Vision', 'Elegant'] },

    // ── LW (Left Wingers) — Current ──
    { id: 'neymar', name: 'Neymar Jr.', country: 'Brazil', club: 'Al Hilal', rating: 87, position: 'LW', tier: 'current', image: img('j60pdx1741319053.jpg'), skills: ['Magical', 'Entertainer'] },
    { id: 'leao', name: 'Rafael Leão', country: 'Portugal', club: 'AC Milan', rating: 88, position: 'LW', tier: 'current', image: img('m1sh9x1549742563.jpg'), skills: ['Surfer', 'Untouchable'] },
    { id: 'kvara', name: 'Khvicha Kvaratskhelia', country: 'Georgia', club: 'Napoli', rating: 86, position: 'LW', tier: 'current', image: tsdb('l1gq7e1770217076.jpg'), skills: ['Kvaradona', 'Tricky'] },
    { id: 'rashford', name: 'Marcus Rashford', country: 'England', club: 'Man United', rating: 83, position: 'LW', tier: 'current', image: img('rb4hx61669799682.jpg'), skills: ['Burst', 'Skillful'] },
    { id: 'martinelli', name: 'Gabriel Martinelli', country: 'Brazil', club: 'Arsenal', rating: 83, position: 'LW', tier: 'current', image: img('jf2gcn1716705057.jpg'), skills: ['Direct', 'Fast'] },
    { id: 'son', name: 'Heung-min Son', country: 'S. Korea', club: 'Tottenham', rating: 87, position: 'LW', tier: 'current', image: img('12yrco1610289677.jpg'), skills: ['Sonaldo', 'Two-Footed'] },
    { id: 'grealish', name: 'Jack Grealish', country: 'England', club: 'Man City', rating: 83, position: 'LW', tier: 'current', image: img('p2r7lo1630268593.jpg'), skills: ['Calf King', 'Carry'] },
    { id: 'doku', name: 'Jérémy Doku', country: 'Belgium', club: 'Man City', rating: 82, position: 'LW', tier: 'current', image: img('u970ic1702565611.jpg'), skills: ['Whiz Kid', 'Electric'] },
    { id: 'pulisic', name: 'Christian Pulisic', country: 'USA', club: 'AC Milan', rating: 82, position: 'LW', tier: 'current', image: img('40pxda1669799830.jpg'), skills: ['Captain USA', 'Agile'] },
    { id: 'mitoma', name: 'Kaoru Mitoma', country: 'Japan', club: 'Brighton', rating: 81, position: 'LW', tier: 'current', image: img('r107nd1706501198.jpg'), skills: ['Dribbling Doc', 'Sharp'] },

    // ── LEGEND STs ──
    { id: 'messi', name: 'Lionel Messi', country: 'Argentina', club: 'Inter Miami', rating: 98, position: 'ST', tier: 'legend', image: img('kpfsvp1725295651.jpg'), skills: ['G.O.A.T', 'Ultimate'] },
    { id: 'cr7', name: 'Cristiano Ronaldo', country: 'Portugal', club: 'Al Nassr', rating: 97, position: 'ST', tier: 'legend', image: img('bkre241600892282.jpg'), skills: ['Clinical', 'Machine'] },
    { id: 'shearer', name: 'Alan Shearer', country: 'England', club: 'Legend', rating: 93, position: 'ST', tier: 'legend', image: img('vhi3oq1491481687.jpg'), skills: ['Record', 'Power'] },
    { id: 'ibra', name: 'Zlatan Ibrahimović', country: 'Sweden', club: 'Legend', rating: 93, position: 'ST', tier: 'legend', image: img('rlo1p61601657280.jpg'), skills: ['Lion', 'Technique'] },
    { id: 'henry', name: 'Thierry Henry', country: 'France', club: 'Legend', rating: 95, position: 'ST', tier: 'legend', image: img('vflsaf1698248867.jpg'), skills: ['King Henry', 'Pace'] },
    { id: 'suarez', name: 'Luis Suárez', country: 'Uruguay', club: 'Legend', rating: 92, position: 'ST', tier: 'legend', image: tsdb('nd8zl11770024667.jpg'), skills: ['Instinct', 'Maestro'] },
    { id: 'totti', name: 'Francesco Totti', country: 'Italy', club: 'Legend', rating: 91, position: 'ST', tier: 'legend', image: img('qewao21537033596.jpg'), skills: ['Gladiator', 'One-Club'] },
    { id: 'maradona', name: 'Diego Maradona', country: 'Argentina', club: 'Legend', rating: 99, position: 'ST', tier: 'legend', image: img('z4v3ox1515072958.jpg'), skills: ['The Hand', 'Perfect'] },
    { id: 'cruyff', name: 'Johan Cruyff', country: 'Netherlands', club: 'Legend', rating: 97, position: 'ST', tier: 'legend', image: img('3ur2pq1546353399.jpg'), skills: ['Total Foot', 'Visionary'] },
    { id: 'puskas', name: 'Ferenc Puskás', country: 'Hungary', club: 'Legend', rating: 97, position: 'ST', tier: 'legend', image: img('j3etee1596140507.jpg'), skills: ['The Major', 'Sniper'] },
    { id: 'pele', name: 'Pelé', country: 'Brazil', club: 'Legend', rating: 99, position: 'ST', tier: 'legend', image: img('o16q9h1534005991.jpg'), skills: ['The King', 'Legendary'] },
    { id: 'ronaldo_r9', name: 'Ronaldo Nazário', country: 'Brazil', club: 'Legend', rating: 98, position: 'ST', tier: 'legend', image: img('wbe0st1541330956.jpg'), skills: ['Fenomeno', 'Power'] },
    { id: 'eto', name: "Samuel Eto'o", country: 'Cameroon', club: 'Legend', rating: 92, position: 'ST', tier: 'legend', image: img('vhi87u1521406606.jpg'), skills: ['Lion', 'Goal King'] },
    { id: 'drogba', name: 'Didier Drogba', country: 'Ivory Coast', club: 'Legend', rating: 92, position: 'ST', tier: 'legend', image: img('o5en9h1710164866.jpg'), skills: ['Strong', 'Clutch'] },

    // ── LEGEND RWs / LWs ──
    { id: 'ronaldinho', name: 'Ronaldinho', country: 'Brazil', club: 'Legend', rating: 95, position: 'LW', tier: 'legend', image: img('2dyq4u1533490608.jpg'), skills: ['Magic', 'Joy'] },
    { id: 'robben', name: 'Arjen Robben', country: 'Netherlands', club: 'Legend', rating: 92, position: 'RW', tier: 'legend', image: img('y6srkx1702790865.jpg'), skills: ['Inside Cut', 'Finesse'] },
    { id: 'ribery', name: 'Franck Ribéry', country: 'France', club: 'Legend', rating: 92, position: 'LW', tier: 'legend', image: img('8llbi61705094475.jpg'), skills: ['Skarface', 'Technical'] },
    { id: 'figo', name: 'Luís Figo', country: 'Portugal', club: 'Legend', rating: 93, position: 'RW', tier: 'legend', image: img('dww5py1541329604.jpg'), skills: ['Galant', 'Crossing'] },
    { id: 'best', name: 'George Best', country: 'N. Ireland', club: 'Legend', rating: 94, position: 'RW', tier: 'legend', image: img('30sqe71520610360.jpg'), skills: ['Beat 5', 'Genius'] },
    { id: 'rivaldo', name: 'Rivaldo', country: 'Brazil', club: 'Legend', rating: 94, position: 'LW', tier: 'legend', image: img('kthwz11490135768.jpg'), skills: ['Golden Left', 'Strike'] },
];
