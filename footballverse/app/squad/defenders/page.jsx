'use client';

import { useState, useMemo } from 'react';
import { Shield, ArrowRight, ArrowLeft, Search, Star, Zap, Cpu, Scan, UserCheck } from 'lucide-react';
import Link from 'next/link';
import '../../entry.css';

const DEFENDERS_DB = [
    // CBs
    { id: 'vvd', name: 'Virgil van Dijk', club: 'Liverpool', rating: 89, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/9fe0tn1720452118.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'saliba', name: 'William Saliba', club: 'Arsenal', rating: 88, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/av91bd1724688954.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'dias', name: 'Ruben Dias', club: 'Man City', rating: 88, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/9kws2w1684833492.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'gabriel', name: 'Gabriel Magalhães', club: 'Arsenal', rating: 87, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/0stb4x1716706532.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'bastoni', name: 'Alessandro Bastoni', club: 'Inter', rating: 87, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/kgodvf1602959273.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'rudiger', name: 'Antonio Rüdiger', club: 'Real Madrid', rating: 87, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/o0nlgs1673465006.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'romero', name: 'Cristian Romero', club: 'Tottenham', rating: 85, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mmfst91770894655.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'stones', name: 'John Stones', club: 'Man City', rating: 85, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/iub2p21763068622.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'araujo', name: 'Ronald Araujo', club: 'Barcelona', rating: 86, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/z4bmo21771260643.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'militao', name: 'Eder Militao', club: 'Real Madrid', rating: 85, position: 'CB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/evk18a1771266122.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'deligt', name: 'Matthijs de Ligt', club: 'Man United', rating: 84, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/0p7ekk1660764614.jpg&w=400&h=500&fit=cover' },
    { id: 'martinez', name: 'Lisandro Martínez', club: 'Man United', rating: 83, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/62xrby1770994011.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'maguire', name: 'Harry Maguire', club: 'Man United', rating: 79, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/8gov1b1770993938.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'ramos', name: 'Sergio Ramos', club: 'Free Agent', rating: 83, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover&a=top' },
    { id: 'guehi', name: 'Marc Guéhi', club: 'Crystal Palace', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/wqgmpl1609183670.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'tah', name: 'Jonathan Tah', club: 'Bayern', rating: 84, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/plv0km1770543333.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'konate', name: 'Ibrahima Konaté', club: 'Liverpool', rating: 83, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/f9phx81578228121.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'vandeven', name: 'Micky van de Ven', club: 'Tottenham', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/4qhc7x1712489854.jpg&w=400&h=500&fit=cover' },
    { id: 'schlotterbeck', name: 'Nico Schlotterbeck', club: 'Dortmund', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/1sba211578088036.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'minjae', name: 'Kim Min-jae', club: 'Bayern', rating: 84, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/heq7bc1770541689.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'skriniar', name: 'Milan Skriniar', club: 'PSG', rating: 84, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/knn8491704623903.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'pau-torres', name: 'Pau Torres', club: 'Aston Villa', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ctzs0b1770201651.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'bremer', name: 'Gleison Bremer', club: 'Juventus', rating: 84, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'mancini', name: 'Gianluca Mancini', club: 'Roma', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'botman', name: 'Sven Botman', club: 'Newcastle', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/16xv6e1770796369.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'akanji', name: 'Manuel Akanji', club: 'Man City', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/rkw8nb1703327216.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'ake', name: 'Nathan Aké', club: 'Man City', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/bclq8j1708244468.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'upamecano', name: 'Dayot Upamecano', club: 'Bayern', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/t53dz81770543164.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'pavard', name: 'Benjamin Pavard', club: 'Inter', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/36hwgb1660764260.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'alaba', name: 'David Alaba', club: 'Real Madrid', rating: 85, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/o0nlgs1673465006.jpg&w=400&h=500&fit=cover&a=top' },

    // RBs
    { id: 'hakimi', name: 'Achraf Hakimi', club: 'PSG', rating: 84, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/lwhwh71770216476.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'trent', name: 'Trent Alexander-Arnold', club: 'Real Madrid', rating: 86, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/e35duu1771262822.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'kounde', name: 'Jules Kounde', club: 'Barcelona', rating: 85, position: 'RB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/0rzza71771254479.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'walker', name: 'Kyle Walker', club: 'Man City', rating: 84, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/1x2kej1557864016.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'frimpong', name: 'Jeremie Frimpong', club: 'Leverkusen', rating: 84, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/4vfl5h1611865283.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'porro', name: 'Pedro Porro', club: 'Tottenham', rating: 83, position: 'RB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/l9i5lo1770894141.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'carvajal', name: 'Dani Carvajal', club: 'Real Madrid', rating: 84, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/o0nlgs1673465006.jpg&w=400&h=500&fit=cover' },
    { id: 'dalot', name: 'Diogo Dalot', club: 'Man United', rating: 82, position: 'RB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/62xrby1770994011.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'gusto', name: 'Malo Gusto', club: 'Chelsea', rating: 80, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/jb0vo01693425428.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'white', name: 'Ben White', club: 'Arsenal', rating: 82, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/5mnqcl1628887228.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'cancelo', name: 'João Cancelo', club: 'Al Hilal', rating: 86, position: 'RB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/8vj8tm1771260403.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'james', name: 'Reece James', club: 'Chelsea', rating: 84, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/m8fsnw1584871009.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'livramento', name: 'Tino Livramento', club: 'Newcastle', rating: 78, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mnod0k1757174815.png&w=400&h=500&fit=cover' },
    { id: 'mazraoui', name: 'Noussair Mazraoui', club: 'Man United', rating: 82, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/8gov1b1770993938.jpg&w=400&h=500&fit=cover' },
    { id: 'wanbissaka', name: 'Aaron Wan-Bissaka', club: 'West Ham', rating: 80, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },

    // LBs
    { id: 'davies', name: 'Alphonso Davies', club: 'Bayern', rating: 85, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/0p7ekk1660764614.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'theo', name: 'Theo Hernandez', club: 'AC Milan', rating: 85, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'mendes', name: 'Nuno Mendes', club: 'PSG', rating: 83, position: 'LB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'grimaldo', name: 'Alejandro Grimaldo', club: 'Leverkusen', rating: 84, position: 'LB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'dimarco', name: 'Federico Dimarco', club: 'Inter', rating: 84, position: 'LB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'robertson', name: 'Andy Robertson', club: 'Liverpool', rating: 85, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mvmpbc1710165540.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'udogie', name: 'Destiny Udogie', club: 'Tottenham', rating: 81, position: 'LB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/w2l7g81770894886.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'cucurella', name: 'Marc Cucurella', club: 'Chelsea', rating: 81, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/sbcvq51588436650.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'calafiori', name: 'Riccardo Calafiori', club: 'Arsenal', rating: 81, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/av91bd1724688954.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'shaw', name: 'Luke Shaw', club: 'Man United', rating: 81, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/8gov1b1770993938.jpg&w=400&h=500&fit=cover' },
    { id: 'balde', name: 'Alejandro Balde', club: 'Barcelona', rating: 81, position: 'LB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/z4bmo21771260643.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'zincheko', name: 'Oleksandr Zinchenko', club: 'Arsenal', rating: 80, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/av91bd1724688954.jpg&w=400&h=500&fit=cover' },
    { id: 'gvardiol', name: 'Josko Gvardiol', club: 'Man City', rating: 84, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/dku11k1703326585.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'estupinan', name: 'Pervis Estupiñán', club: 'Brighton', rating: 80, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'aitnouri', name: 'Rayan Aït-Nouri', club: 'Man City', rating: 80, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mnod0k1757174815.png&w=400&h=500&fit=cover' },

    // Additional CBs
    { id: 'colwill', name: 'Levi Colwill', club: 'Chelsea', rating: 79, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/cr417g1628521347.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'fofana', name: 'Wesley Fofana', club: 'Chelsea', rating: 79, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/914mzh1603656675.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'disasi', name: 'Axel Disasi', club: 'Chelsea', rating: 79, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/2da3ye1693424496.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'quansah', name: 'Jarell Quansah', club: 'Liverpool', rating: 75, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover&a=top' },
    { id: 'branthwaite', name: 'Jarrad Branthwaite', club: 'Everton', rating: 79, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mnod0k1757174815.png&w=400&h=500&fit=cover' },
    { id: 'mings', name: 'Tyrone Mings', club: 'Aston Villa', rating: 79, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'konsa', name: 'Ezri Konsa', club: 'Aston Villa', rating: 80, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'dunk', name: 'Lewis Dunk', club: 'Brighton', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mnod0k1757174815.png&w=400&h=500&fit=cover' },
    { id: 'iglesias', name: 'Borja Iglesias', club: 'Celta', rating: 79, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover' },
    { id: 'vivian', name: 'Dani Vivian', club: 'Athletic', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover' },
    { id: 'le-normand', name: 'Robin Le Normand', club: 'Atletico', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover' },
    { id: 'gimenez', name: 'Jose Gimenez', club: 'Atletico', rating: 83, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover' },

    // Additional RBs
    { id: 'dumfries', name: 'Denzel Dumfries', club: 'Inter', rating: 81, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/lwhwh71770216476.jpg&w=400&h=500&fit=cover' },
    { id: 'di-lorenzo', name: 'Giovanni Di Lorenzo', club: 'Napoli', rating: 82, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'pavard-rb', name: 'Benjamin Pavard', club: 'Inter', rating: 82, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'molina', name: 'Nahuel Molina', club: 'Atletico', rating: 80, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover' },
    { id: 'walker-peters', name: 'Kyle Walker-Peters', club: 'West Ham', rating: 78, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mnod0k1757174815.png&w=400&h=500&fit=cover' },
    { id: 'trippier', name: 'Kieran Trippier', club: 'Newcastle', rating: 82, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mnod0k1757174815.png&w=400&h=500&fit=cover' },

    // Additional LBs
    { id: 'spinazzola', name: 'Leonardo Spinazzola', club: 'Napoli', rating: 79, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'gaya', name: 'Jose Gaya', club: 'Valencia', rating: 82, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover' },
    { id: 'ferland-mendy', name: 'Ferland Mendy', club: 'Real Madrid', rating: 82, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/o0nlgs1673465006.jpg&w=400&h=500&fit=cover' },
    { id: 'lewis-hall', name: 'Lewis Hall', club: 'Newcastle', rating: 76, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/mnod0k1757174815.png&w=400&h=500&fit=cover' },

    // Final Global Batch
    { id: 'pavlović', name: 'Strahinja Pavlović', club: 'AC Milan', rating: 78, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'inigo', name: 'Iñigo Martínez', club: 'Barcelona', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/9kws2w1684833492.jpg&w=400&h=500&fit=cover' },
    { id: 'hummels', name: 'Mats Hummels', club: 'Roma', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'hermoso', name: 'Mario Hermoso', club: 'Roma', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'calabria', name: 'Davide Calabria', club: 'AC Milan', rating: 79, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'kalulu', name: 'Pierre Kalulu', club: 'Juventus', rating: 78, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'cambiaso', name: 'Andrea Cambiaso', club: 'Juventus', rating: 80, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'danilo', name: 'Danilo', club: 'Juventus', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'savic', name: 'Stefan Savic', club: 'Trabzonspor', rating: 80, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/ztj6241701091276.png&w=400&h=500&fit=cover' },
    { id: 'ginter', name: 'Matthias Ginter', club: 'Freiburg', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'sule', name: 'Niklas Süle', club: 'Dortmund', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'ryerson', name: 'Julian Ryerson', club: 'Dortmund', rating: 79, position: 'RB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'mazraoui-utd', name: 'Noussair Mazraoui', club: 'Man United', rating: 82, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/8gov1b1770993938.jpg&w=400&h=500&fit=cover' },
    { id: 'fran-garcia', name: 'Fran García', club: 'Real Madrid', rating: 78, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/o0nlgs1673465006.jpg&w=400&h=500&fit=cover' },
    { id: 'vazquez', name: 'Lucas Vázquez', club: 'Real Madrid', rating: 81, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/o0nlgs1673465006.jpg&w=400&h=500&fit=cover' },
    { id: 'nacho', name: 'Nacho Fernández', club: 'Al Qadsiah', rating: 80, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/o0nlgs1673465006.jpg&w=400&h=500&fit=cover' },
    { id: 'laporte', name: 'Aymeric Laporte', club: 'Al Nassr', rating: 83, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'koulibaly', name: 'Kalidou Koulibaly', club: 'Al Hilal', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'bensebaini', name: 'Ramy Bensebaini', club: 'Dortmund', rating: 79, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/lwhwh71770216476.jpg&w=400&h=500&fit=cover' },
    { id: 'tomori', name: 'Fikayo Tomori', club: 'AC Milan', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'pavard-inter', name: 'Benjamin Pavard', club: 'Inter', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'acerbi', name: 'Francesco Acerbi', club: 'Inter', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'darmian', name: 'Matteo Darmian', club: 'Inter', rating: 80, position: 'RB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },

    // Final Expansion
    { id: 'hincapie', name: 'Piero Hincapié', club: 'Leverkusen', rating: 81, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'tapsoba', name: 'Edmond Tapsoba', club: 'Leverkusen', rating: 82, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'kossonou', name: 'Odilon Kossounou', club: 'Leverkusen', rating: 80, position: 'CB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/zilv2j1609512210.jpg&w=400&h=500&fit=cover' },
    { id: 'stanisic', name: 'Josip Stanišić', club: 'Bayern', rating: 79, position: 'RB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'kim-min-jae-2', name: 'Kim Min-jae', club: 'Bayern', rating: 84, position: 'CB', image: 'https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/heq7bc1770541689.jpg&w=400&h=500&fit=cover' },
    { id: '伊藤', name: 'Hiroki Ito', club: 'Bayern', rating: 79, position: 'LB', image: 'https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/lwhwh71770216476.jpg&w=400&h=500&fit=cover' },
    { id: 'scales', name: 'Liam Scales', club: 'Celtic', rating: 74, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'carter-vickers', name: 'Cameron Carter-Vickers', club: 'Celtic', rating: 77, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'taylor', name: 'Greg Taylor', club: 'Celtic', rating: 75, position: 'LB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'johnston', name: 'Alistair Johnston', club: 'Celtic', rating: 76, position: 'RB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'goldson', name: 'Connor Goldson', club: 'Aris', rating: 76, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'taviere', name: 'James Tavernier', club: 'Rangers', rating: 78, position: 'RB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'butland', name: 'Jack Butland', club: 'Rangers', rating: 77, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
    { id: 'souttar', name: 'John Souttar', club: 'Rangers', rating: 75, position: 'CB', image: 'https://images.weserv.nl/?url=t3.ftcdn.net/jpg/02/53/78/33/360_F_253783359_3a7E8n5e0u80d9d4t9g5.jpg&w=400&h=500&fit=cover' },
];

export default function DefendersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPos, setFilterPos] = useState('ALL');

    const filteredDefenders = useMemo(() => {
        return DEFENDERS_DB.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.club.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPos = filterPos === 'ALL' || p.position === filterPos;
            return matchesSearch && matchesPos;
        });
    }, [searchTerm, filterPos]);

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.06) grayscale(0.8) contrast(1.2)' }}></div>
            <div className="overlay-gradient" style={{ background: 'radial-gradient(circle at center, transparent 20%, rgba(2,4,10,0.95) 100%)' }}></div>

            <section className="squad-selection-view">
                <main className="selection-terminal" style={{ maxWidth: '1600px', width: '98%' }}>

                    {/* Header Navigation Stack */}
                    <div className="premium-nav-bar glass">
                        <div className="nav-left-group">
                            <Link href="/team-select" className="nav-back-btn-extreme">
                                <ArrowLeft size={20} />
                                <span>RE-EVALUATE CLUB</span>
                            </Link>
                        </div>

                        <div className="center-identity">
                            <div className="club-mini-badge" style={{ borderColor: 'var(--primary)' }}>
                                <Shield size={14} className="text-primary" />
                            </div>
                            <div className="identity-text-stack">
                                <span className="scouting-label">AUTHORIZED SCOUTING</span>
                                <span className="scouting-target">SQUAD DEPLOYMENT: DEFENDERS</span>
                            </div>
                        </div>

                        <div className="phase-indicator">
                            <div className="step-count">
                                <span className="text-primary">05</span>
                                <span className="text-muted">/</span>
                                <span className="text-muted">05</span>
                            </div>
                            <div className="phase-dots">
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot active"></div>
                            </div>
                        </div>
                    </div>

                    <div className="selection-titles centered" style={{ marginBottom: '4rem' }}>
                        <h2 className="headline text-800 main-selection-title" style={{ fontSize: '4.5rem', letterSpacing: '-0.04em' }}>
                            REINFORCE THE <span className="text-primary">PERIMETER</span>
                        </h2>
                        <div className="scouting-feed-detail">
                            <div className="status-dot-blink"></div>
                            <span>POSITIONAL PROTOCOL: {filterPos} // {filteredDefenders.length} SIGNATURES DETECTED</span>
                        </div>
                    </div>

                    {/* Tactical Control Row */}
                    <div className="tactical-control-row">
                        <div className="search-container-premium-wide glass-premium">
                            <Search size={24} className="text-primary opacity-40" />
                            <input
                                type="text"
                                placeholder="IDENTIFY PLAYER SIGNATURE / CLUB KEYWORD..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="team-search-input-premium"
                            />
                            <div className="search-status-badge">LIVE_DATA_ENABLED</div>
                        </div>

                        <div className="position-filters-box glass">
                            {['ALL', 'CB', 'LB', 'RB'].map(pos => (
                                <button
                                    key={pos}
                                    onClick={() => setFilterPos(pos)}
                                    className={`pos-toggle-btn ${filterPos === pos ? 'active' : ''}`}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Players Grid */}
                    <div className="players-grid-wrapper">
                        <div className="players-grid-dynamic">
                            {filteredDefenders.map((player) => (
                                <div key={player.id} className="player-card-premium glass">
                                    <div className="card-top-identity">
                                        <div className="pos-badge">{player.position}</div>
                                        <div className="ovr-block">
                                            <span className="ovr-label">OVR</span>
                                            <span className="ovr-value">{player.rating}</span>
                                        </div>
                                    </div>

                                    <div className="player-visual-frame">
                                        <img src={player.image} alt={player.name} className="player-img-hero" loading="lazy" />
                                        <div className="face-scan-line"></div>
                                        <div className="vignette-bottom"></div>
                                    </div>

                                    <div className="player-data-panel">
                                        <div className="meta-stack">
                                            <span className="player-club-tag">{player.club.toUpperCase()}</span>
                                            <h3 className="player-full-name">{player.name}</h3>
                                        </div>

                                        <div className="tactical-specs-grid">
                                            <div className="spec-tile">
                                                <Zap size={12} className="text-primary" />
                                                <div className="spec-info">
                                                    <span className="spec-val">
                                                        {/* Deterministic PAC stat based on ID and Rating */}
                                                        {Math.min(95, Math.floor(player.rating * 0.95) + (player.id.length % 5))}
                                                    </span>
                                                    <span className="spec-lbl">PAC</span>
                                                </div>
                                            </div>
                                            <div className="spec-tile active">
                                                <Shield size={12} className="text-primary" />
                                                <div className="spec-info">
                                                    <span className="spec-val">{player.rating + 1}</span>
                                                    <span className="spec-lbl">DEF</span>
                                                </div>
                                            </div>
                                            <div className="spec-tile">
                                                <Star size={12} className="text-primary" />
                                                <div className="spec-info">
                                                    <span className="spec-val">
                                                        {/* Deterministic PHY stat based on ID */}
                                                        {Math.min(92, 75 + (player.id.charCodeAt(0) % 15))}
                                                    </span>
                                                    <span className="spec-lbl">PHY</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="confirm-recruit-btn">
                                            <UserCheck size={18} />
                                            <span>INITIALIZE CONTRACT</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </section>

            <style jsx>{`
                .squad-selection-view {
                    min-height: 100vh;
                    padding: 6rem 2rem;
                    display: flex;
                    justify-content: center;
                    position: relative;
                    z-index: 100;
                }

                .premium-nav-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 4rem;
                    position: sticky;
                    top: 1rem;
                    z-index: 2000;
                    border: 1px solid rgba(255,255,255,0.1);
                    margin-bottom: 5rem;
                    background: rgba(10, 10, 15, 0.6);
                    backdrop-filter: blur(30px);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }

                .center-identity {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    background: rgba(255, 255, 255, 0.04);
                    padding: 0.8rem 2.5rem;
                    border-radius: 100px;
                    border: 1px solid rgba(255,255,255,0.08);
                }

                .tactical-control-row {
                    display: flex;
                    gap: 3rem;
                    margin-bottom: 6rem;
                    align-items: center;
                    justify-content: center;
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .search-container-premium-wide {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    padding: 0 2.5rem;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 20px;
                    transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                }

                .search-container-premium-wide:focus-within {
                    border-color: var(--primary);
                    background: rgba(0, 255, 136, 0.05);
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.1);
                }

                .search-status-badge {
                    font-size: 0.6rem;
                    color: var(--primary);
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    padding: 0.4rem 0.8rem;
                    background: rgba(0, 255, 136, 0.1);
                    border-radius: 6px;
                    white-space: nowrap;
                }

                .team-search-input-premium {
                    background: transparent;
                    border: none;
                    color: white;
                    width: 100%;
                    font-size: 1.1rem;
                    outline: none;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                }

                .position-filters-box {
                    display: flex;
                    padding: 0.75rem;
                    border-radius: 20px;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .pos-toggle-btn {
                    padding: 0.8rem 2.5rem;
                    border-radius: 14px;
                    border: none;
                    background: transparent;
                    color: rgba(255,255,255,0.3);
                    font-weight: 900;
                    font-size: 0.9rem;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.4s;
                }

                .pos-toggle-btn:hover {
                    color: white;
                    background: rgba(255,255,255,0.08);
                }

                .pos-toggle-btn.active {
                    background: var(--primary);
                    color: black;
                    box-shadow: 0 10px 25px rgba(0, 255, 136, 0.3);
                }

                .players-grid-dynamic {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 4rem;
                    padding-bottom: 12rem;
                }

                .player-card-premium {
                    position: relative;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(10, 10, 15, 0.8);
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .player-card-premium:hover {
                    transform: translateY(-15px) scale(1.03);
                    border-color: var(--primary);
                    box-shadow: 0 30px 80px -20px rgba(0,0,0,0.9), 0 0 30px rgba(0, 255, 136, 0.1);
                }

                .card-top-identity {
                    position: absolute;
                    top: 1.5rem;
                    left: 1.5rem;
                    right: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    z-index: 10;
                }

                .pos-badge {
                    background: var(--primary);
                    color: black;
                    padding: 0.4rem 1.2rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 900;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.4);
                }

                .ovr-block {
                    background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(10px);
                    padding: 0.5rem 1rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    text-align: center;
                }

                .ovr-label { font-size: 0.5rem; opacity: 0.4; font-weight: 800; display: block; }
                .ovr-value { font-size: 1.5rem; font-weight: 900; color: white; line-height: 1; }

                .player-visual-frame {
                    position: relative;
                    height: 420px;
                    overflow: hidden;
                    background: #0a0a0f;
                }

                .player-img-hero {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center top;
                    transition: 0.8s;
                    filter: saturate(1.2) contrast(1.1);
                }

                .player-card-premium:hover .player-img-hero {
                    transform: scale(1.15) translateY(10px);
                }

                .face-scan-line {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(transparent, transparent 50%, var(--primary) 50%, transparent 51%);
                    background-size: 100% 200%;
                    opacity: 0.2;
                    animation: scanning 5s linear infinite;
                    pointer-events: none;
                    mix-blend-mode: screen;
                }

                .vignette-bottom {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 8rem;
                    background: linear-gradient(to top, rgba(10, 10, 15, 1) 0%, transparent);
                }

                .player-data-panel {
                    padding: 2.5rem;
                    margin-top: -5rem;
                    position: relative;
                    z-index: 5;
                }

                .player-club-tag {
                    font-size: 0.7rem;
                    color: var(--primary);
                    font-weight: 900;
                    letter-spacing: 0.3em;
                    opacity: 0.7;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .player-full-name {
                    font-size: 2.2rem;
                    font-weight: 900;
                    color: white;
                    line-height: 0.95;
                    font-style: italic;
                    text-transform: uppercase;
                }

                .tactical-specs-grid {
                    display: flex;
                    gap: 1.5rem;
                    margin: 2.5rem 0;
                }

                .spec-tile {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.8rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                }

                .spec-tile.active {
                    background: rgba(0, 255, 136, 0.05);
                    border-color: rgba(0, 255, 136, 0.2);
                }

                .spec-info { display: flex; flex-direction: column; line-height: 1.1; }
                .spec-val { font-size: 1.1rem; font-weight: 900; color: white; }
                .spec-lbl { font-size: 0.55rem; color: rgba(255,255,255,0.3); font-weight: 800; }

                .confirm-recruit-btn {
                    width: 100%;
                    padding: 1.4rem;
                    background: transparent;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    border-radius: 16px;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    font-size: 1rem;
                    font-weight: 900;
                    letter-spacing: 0.15em;
                    cursor: pointer;
                    transition: all 0.4s;
                    text-transform: uppercase;
                }

                .confirm-recruit-btn:hover {
                    background: var(--primary);
                    color: black;
                    border-color: var(--primary);
                    box-shadow: 0 15px 35px rgba(0, 255, 136, 0.4);
                    transform: translateY(-5px);
                }

                @keyframes scanning {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 200%; }
                }

                .nav-back-btn-extreme {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.9rem 2rem;
                    border-radius: 16px;
                    font-size: 0.85rem;
                    font-weight: 900;
                    color: white;
                    letter-spacing: 0.1em;
                    transition: 0.4s;
                }

                .nav-back-btn-extreme:hover {
                    background: var(--primary);
                    color: black;
                    border-color: var(--primary);
                    transform: translateX(-8px);
                    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
                }

                @media (max-width: 1200px) {
                    .tactical-control-row { flex-direction: column; gap: 2rem; }
                    .search-container-premium-wide { width: 100%; max-width: none; }
                }
            `}</style>
        </div>
    );
}
