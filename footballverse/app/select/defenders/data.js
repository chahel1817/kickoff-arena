const img = (file) => `https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/${file}&w=400&h=500&fit=cover&a=top`;
const tsdb = (file) => `https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/${file}&w=400&h=500&fit=cover&a=top`;

export const DEFENDERS = [
    // ── CURRENT CBs ──
    { id: 'vvd', name: 'Virgil van Dijk', country: 'Netherlands', club: 'Liverpool', rating: 89, position: 'CB', tier: 'current', image: img('9fe0tn1720452118.jpg'), skills: ['Elite Tackling', 'Aerial Aura'] },
    { id: 'saliba', name: 'William Saliba', country: 'France', club: 'Arsenal', rating: 88, position: 'CB', tier: 'current', image: img('av91bd1724688954.jpg'), skills: ['Precision Timing', 'Rock Solid'] },
    { id: 'dias', name: 'Rúben Dias', country: 'Portugal', club: 'Man City', rating: 88, position: 'CB', tier: 'current', image: img('9kws2w1684833492.jpg'), skills: ['Leader', 'Interception'] },
    { id: 'gabriel', name: 'Gabriel Magalhães', country: 'Brazil', club: 'Arsenal', rating: 87, position: 'CB', tier: 'current', image: img('0stb4x1716706532.jpg'), skills: ['Strength', 'Set-Piece Threat'] },
    { id: 'bastoni', name: 'Alessandro Bastoni', country: 'Italy', club: 'Inter', rating: 87, position: 'CB', tier: 'current', image: img('kgodvf1602959273.jpg'), skills: ['Ball Carrier', 'Vision'] },
    { id: 'rudiger', name: 'Antonio Rüdiger', country: 'Germany', club: 'Real Madrid', rating: 87, position: 'CB', tier: 'current', image: img('o0nlgs1673465006.jpg'), skills: ['Aggressive', 'Top Speed'] },
    { id: 'araujo', name: 'Ronald Araújo', country: 'Uruguay', club: 'Barcelona', rating: 86, position: 'CB', tier: 'current', image: tsdb('z4bmo21771260643.jpg'), skills: ['Physicality', 'Wall'] },
    { id: 'romero', name: 'Cristian Romero', country: 'Argentina', club: 'Tottenham', rating: 85, position: 'CB', tier: 'current', image: tsdb('mmfst91770894655.jpg'), skills: ['Hard Tackler', 'Brave'] },
    { id: 'stones', name: 'John Stones', country: 'England', club: 'Man City', rating: 85, position: 'CB', tier: 'current', image: img('iub2p21763068622.jpg'), skills: ['Elegant', 'Passing'] },
    { id: 'militao', name: 'Éder Militão', country: 'Brazil', club: 'Real Madrid', rating: 85, position: 'CB', tier: 'current', image: tsdb('evk18a1771266122.jpg'), skills: ['Jumping', 'Recovery'] },
    { id: 'minjae', name: 'Kim Min-jae', country: 'South Korea', club: 'Bayern', rating: 84, position: 'CB', tier: 'current', image: tsdb('heq7bc1770541689.jpg'), skills: ['Monster', 'Pace'] },
    { id: 'gvardiol', name: 'Joško Gvardiol', country: 'Croatia', club: 'Man City', rating: 84, position: 'CB', tier: 'current', image: img('dku11k1703326585.jpg'), skills: ['Technical', 'Stamina'] },
    { id: 'marquinhos', name: 'Marquinhos', country: 'Brazil', club: 'PSG', rating: 84, position: 'CB', tier: 'current', image: tsdb('sejelk1770217582.jpg'), skills: ['Reading Play', 'Agile'] },
    { id: 'konate', name: 'Ibrahima Konaté', country: 'France', club: 'Liverpool', rating: 83, position: 'CB', tier: 'current', image: img('f9phx81578228121.jpg'), skills: ['Unit', 'Speed'] },
    { id: 'martinez', name: 'Lisandro Martínez', country: 'Argentina', club: 'Man United', rating: 83, position: 'CB', tier: 'current', image: tsdb('62xrby1770994011.jpg'), skills: ['Butcher', 'Long Pass'] },
    { id: 'akanji', name: 'Manuel Akanji', country: 'Switzerland', club: 'Man City', rating: 82, position: 'CB', tier: 'current', image: img('rkw8nb1703327216.jpg'), skills: ['Solid', 'Tactical'] },
    { id: 'bremer', name: 'Gleison Bremer', country: 'Brazil', club: 'Juventus', rating: 84, position: 'CB', tier: 'current', image: img('icn9je1716707438.jpg'), skills: ['Man-Marking', 'Power'] },
    { id: 'white', name: 'Ben White', country: 'England', club: 'Arsenal', rating: 84, position: 'RB', tier: 'current', image: img('8k8zvn1627670783.jpg'), skills: ['Elite Overlap', 'Aggressive'] },
    { id: 'botman', name: 'Sven Botman', country: 'Netherlands', club: 'Newcastle', rating: 83, position: 'CB', tier: 'current', image: tsdb('botman-sven.jpg'), skills: ['Aerial Dominance', 'Blocking'] },

    // ── CURRENT RBs ──
    { id: 'kounde', name: 'Jules Koundé', country: 'France', club: 'Barcelona', rating: 85, position: 'RB', tier: 'current', image: tsdb('0rzza71771254479.jpg'), skills: ['1v1 Defense', 'Flexible'] },
    { id: 'hakimi', name: 'Achraf Hakimi', country: 'Morocco', club: 'PSG', rating: 84, position: 'RB', tier: 'current', image: tsdb('lwhwh71770216476.jpg'), skills: ['Elite Pace', 'Overlap'] },
    { id: 'carvajal', name: 'Dani Carvajal', country: 'Spain', club: 'Real Madrid', rating: 84, position: 'RB', tier: 'current', image: tsdb('gapy0m1771264214.jpg'), skills: ['Warrior', 'Crossing'] },
    { id: 'frimpong', name: 'Jeremie Frimpong', country: 'Netherlands', club: 'Leverkusen', rating: 84, position: 'RB', tier: 'current', image: img('4vfl5h1611865283.jpg'), skills: ['Explosive', 'Dribbling'] },
    { id: 'james', name: 'Reece James', country: 'England', club: 'Chelsea', rating: 84, position: 'RB', tier: 'current', image: img('uqrxvv1431677357.jpg'), skills: ['Strong', 'Delivery'] },
    { id: 'walker', name: 'Kyle Walker', country: 'England', club: 'Man City', rating: 84, position: 'RB', tier: 'current', image: img('1x2kej1557864016.jpg'), skills: ['Speedster', 'Recovery'] },
    { id: 'porro', name: 'Pedro Porro', country: 'Spain', club: 'Tottenham', rating: 83, position: 'RB', tier: 'current', image: tsdb('l9i5lo1770894141.jpg'), skills: ['Winger-like', 'Energy'] },
    { id: 'gusto', name: 'Malo Gusto', country: 'France', club: 'Chelsea', rating: 81, position: 'RB', tier: 'current', image: tsdb('gusto-malo.jpg'), skills: ['Pace', 'Crossing'] },
    { id: 'arnold', name: 'T. Alexander-Arnold', country: 'England', club: 'Liverpool', rating: 86, position: 'RB', tier: 'current', image: img('5rv3m91621544715.jpg'), skills: ['Elite Cross', 'Vision'] },

    // ── CURRENT LBs ──
    { id: 'davies', name: 'Alphonso Davies', country: 'Canada', club: 'Bayern', rating: 85, position: 'LB', tier: 'current', image: img('0p7ekk1660764614.jpg'), skills: ['Lightning', 'Recovery'] },
    { id: 'robertson', name: 'Andy Robertson', country: 'Scotland', club: 'Liverpool', rating: 85, position: 'LB', tier: 'current', image: img('mvmpbc1710165540.jpg'), skills: ['Crossing', 'Engine'] },
    { id: 'theo', name: 'Theo Hernández', country: 'France', club: 'AC Milan', rating: 85, position: 'LB', tier: 'current', image: img('zilv2j1609512210.jpg'), skills: ['Speed-Train', 'Strike'] },
    { id: 'dimarco', name: 'Federico Dimarco', country: 'Italy', club: 'Inter', rating: 84, position: 'LB', tier: 'current', image: img('q7lkrg1546596582.jpg'), skills: ['Vision', 'Elite Cross'] },
    { id: 'udogie', name: 'Destiny Udogie', country: 'Italy', club: 'Tottenham', rating: 82, position: 'LB', tier: 'current', image: tsdb('udogie-destiny.jpg'), skills: ['Powerful', 'Modern LB'] },
    { id: 'grimaldo', name: 'Alex Grimaldo', country: 'Spain', club: 'Leverkusen', rating: 84, position: 'LB', tier: 'current', image: tsdb('grimaldo-alex.jpg'), skills: ['Set-Piece', 'Clinical'] },
    { id: 'mendes', name: 'Nuno Mendes', country: 'Portugal', club: 'PSG', rating: 83, position: 'LB', tier: 'current', image: tsdb('ocycug1771261313.jpg'), skills: ['Dynamic', 'Pace'] },
    { id: 'zinchenko', name: 'O. Zinchenko', country: 'Ukraine', club: 'Arsenal', rating: 80, position: 'LB', tier: 'current', image: img('g4wvkd1715902407.jpg'), skills: ['Inverted', 'Technical'] },

    // ── LEGEND CBs ──
    { id: 'maldini', name: 'Paolo Maldini', country: 'Italy', club: 'Legend', rating: 96, position: 'CB', tier: 'legend', image: img('gmed2k1711199499.jpg'), skills: ['Absolute Wall', 'Grace'] },
    { id: 'sergio-ramos', name: 'Sergio Ramos', country: 'Spain', club: 'Legend', rating: 92, position: 'CB', tier: 'legend', image: img('4qhc7x1712489854.jpg'), skills: ['Header God', 'Clutch'] },
    { id: 'cannavaro', name: 'Fabio Cannavaro', country: 'Italy', club: 'Legend', rating: 93, position: 'CB', tier: 'legend', image: img('z2g1ey1533486611.jpg'), skills: ['Interceptor', 'Power'] },
    { id: 'vidic', name: 'Nemanja Vidić', country: 'Serbia', club: 'Legend', rating: 90, position: 'CB', tier: 'legend', image: img('qgjqz01684833615.jpg'), skills: ['Tank', 'Aggressive'] },
    { id: 'puyol', name: 'Carles Puyol', country: 'Spain', club: 'Legend', rating: 91, position: 'CB', tier: 'legend', image: img('ids1521533491419.jpg'), skills: ['Leader', 'Braveheart'] },
    { id: 'nesta', name: 'Alessandro Nesta', country: 'Italy', club: 'Legend', rating: 93, position: 'CB', tier: 'legend', image: img('usysts1484137424.jpg'), skills: ['Slide-Tackle', 'Elite'] },
    { id: 'beckenbauer', name: 'Franz Beckenbauer', country: 'Germany', club: 'Legend', rating: 95, position: 'CB', tier: 'legend', image: img('e7yicv1544985651.jpg'), skills: ['Kaiser', 'Playmaker'] },
    { id: 'kompany', name: 'Vincent Kompany', country: 'Belgium', club: 'Legend', rating: 89, position: 'CB', tier: 'legend', image: img('4qyq7r1509999901.jpg'), skills: ['Leader', 'Tactical'] },
    { id: 'ferdinand', name: 'Rio Ferdinand', country: 'England', club: 'Legend', rating: 90, position: 'CB', tier: 'legend', image: img('rio-ferdinand.jpg'), skills: ['Ball Playing', 'Speed'] },
    { id: 'baresi', name: 'Franco Baresi', country: 'Italy', club: 'Legend', rating: 93, position: 'CB', tier: 'legend', image: img('baresi-franco.jpg'), skills: ['Intercepting', 'Leader'] },

    // ── LEGEND RBs ──
    { id: 'cafu', name: 'Cafu', country: 'Brazil', club: 'Legend', rating: 93, position: 'RB', tier: 'legend', image: img('ussrws1479842265.jpg'), skills: ['Infinite Energy', 'Legend'] },
    { id: 'lahm', name: 'Philipp Lahm', country: 'Germany', club: 'Legend', rating: 93, position: 'RB', tier: 'legend', image: img('ltocxo1615114367.jpg'), skills: ['Chess-Master', 'Precise'] },
    { id: 'alves', name: 'Dani Alves', country: 'Brazil', club: 'Legend', rating: 92, position: 'RB', tier: 'legend', image: img('qitd2v1515933011.jpg'), skills: ['Attacking', 'Skillful'] },
    { id: 'zanetti', name: 'Javier Zanetti', country: 'Argentina', club: 'Legend', rating: 91, position: 'RB', tier: 'legend', image: img('zanetti-javier.jpg'), skills: ['Versatile', 'Engine'] },

    // ── LEGEND LBs ──
    { id: 'roberto-carlos', name: 'Roberto Carlos', country: 'Brazil', club: 'Legend', rating: 94, position: 'LB', tier: 'legend', image: img('u4uikp1541330867.jpg'), skills: ['Rocket Shot', 'Pace'] },
    { id: 'cole', name: 'Ashley Cole', country: 'England', club: 'Legend', rating: 90, position: 'LB', tier: 'legend', image: img('qoew7z1640192930.jpg'), skills: ['Stopper', 'Speed'] },
    { id: 'evra', name: 'Patrice Evra', country: 'France', club: 'Legend', rating: 88, position: 'LB', tier: 'legend', image: img('evra-patrice.jpg'), skills: ['Leap', 'Experience'] },
];
