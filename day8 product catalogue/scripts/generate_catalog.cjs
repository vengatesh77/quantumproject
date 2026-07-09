/**
 * NexaStore Product Catalog Generator v3
 * Generates unique, realistic products with varied category-appropriate images.
 * Strategy:
 *   - Each Unsplash photo ID gets 4 crop variants → 4x effective pool size
 *   - Product names = Brand + Specific Model + Color/Size/Variant combo → fully unique
 *   - Descriptions reference the actual product type for realism
 */

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
let GLOBAL_ID = 1;
const rng = {
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  int:  (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo,
  float:(lo, hi) => parseFloat((Math.random() * (hi - lo) + lo).toFixed(1)),
  bool: (p = 0.5) => Math.random() < p,
};
const BADGES = ['hot','new','sale','top','','','',''];
const BL = { hot:'HOT', new:'NEW', sale:'SALE', top:'TOP', '':'' };

/** Build an Unsplash URL with a specific crop mode */
const UNS = (id, crop = 'entropy') =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=400&q=80&crop=${crop}`;

/** Expand 1 photo ID into 4 unique-looking crop variations */
const expand = (id) => [
  UNS(id, 'entropy'),
  UNS(id, 'center'),
  UNS(id, 'focalpoint'),
  UNS(id, 'attention'),
];

/** Build a pool from an array of IDs (each expanded × 4) */
const pool = (...ids) => ids.flat().flatMap(expand);

// ─────────────────────────────────────────────
// IMAGE POOLS  (verified Unsplash photo IDs)
// ─────────────────────────────────────────────
const POOLS = {
  mobiles:    pool('1695048133142-1a20484d2569','1610945415295-d9bbf067e59c','1598327105666-5b89351cb315','1678911820864-e5c94bd6af30','1601784551446-20c9e07cd566','1511707171634-5f897ff02aa9','1556656793-08538906a9f8','1585109649139-366815a0d713','1574944985070-8f3ebc6b79d2','1607936854526-bc03f4af7d8a','1512499617-153e8e8d1aca','1542751110-b0c7a681d2af','1530319067-4f17b7d7b84a','1505740420928-5e560c06d30e','1486365227551-f3f90034cfd7'),
  laptops:    pool('1517336714731-489689fd1ca8','1593640408182-31c70c8268f5','1588872657578-7efd1f1555ed','1525547719571-a2d4ac8945e2','1496181133206-80ce9b88a853','1486312338219-ce68d2c6f44d','1541807084-5c52b6b3adef','1484788984921-03950022c9ef','1499951360447-b19be8fe80f5','1460925895917-afdab827c52f','1468495789680-958f579e99ee','1554415867-c7f1c553bda7'),
  watches:    pool('1546868871-7041f2a55e12','1508685096489-7aacd43bd3b1','1579586337278-3befd40fd17a','1522312346375-d1a52e2b99b3','1434493789153-5f8b8b7c6b28','1523275335684-37898b6baf30','1546483875-ad9ccf008ef4','1614945765169-9db3e2de3f82','1508610048994-10b8dc9e6687','1612817288484-0e3f2c73a4b1'),
  headphones: pool('1618366712010-f4ae9c647dcb','1600294037681-c80b4cb5b434','1608043152269-423dbba4e7e1','1545127398-14699f92334b','1503454538182-0ba58b5b98fe','1604489572290-3c84abb193c4','1577174881658-0f30ed549adc','1524678472185-f6f5e8f6b3f5','1558756393-1a47ab0ef1ab','1484312152213-d713e8b7c053'),
  electronics:pool('1498049794561-7780e7231661','1550009158-9effb66283c8','1468495688487-4ab7a2b49ab2','1526738549149-8e07aecd0f30','1518770660439-4636190af475','1517430816045-df4b7de7b0d4','1583394293253-aed38f6c6f0d','1491933382122-4c9e1c85b1f4'),
  mens:       pool('1516257984-b1b4d707412e','1576871337622-98d48d1cf531','1489987707849-03d9f2d891f4','1598033129183-37456de009c8','1602810318383-e386cc2a3ccf','1594938298603-d9fcfcf6aea5','1507003211169-0a1dd7228f2d','1617196034183-421b4040ed20','1520347893982-0e9b7f7ece40','1541992996-f2fd7c4bb96e'),
  womens:     pool('1572804013309-59a88b7e92f1','1539008835657-9e8e9680c956','1534445849956-9ce1d3ff5ae7','1490481684-7e7cd5b41e0c','1536858974-3496d5a7b78f','1559703248-dcaaec9fab78','1524504388868-be5f5dce68b8','1485518882989-d43e5d2c2a77','1466721096924-d4ea5a01bcb7','1502716119720-483260191df5'),
  kids:       pool('1519689680058-324335c77eba','1522204523234-8729aa6e3d5f','1566004100631-35d015d6a491','1519823551278-64ac92734fb1','1543807015-02e8f06fb2bc','1558618666-fcd25c85cd64'),
  sarees:     pool('1610030469983-98e550d61dc9','1583391733959-b05307047915','1614087508791-b0e6a62edfe7','1594463750939-70e5d26a21a1','1589156288859-f0cb0d82b065','1553531889-e6cf4d692b1b','1607035938491-3bea97e1c695','1592781951022-e6d0da7b5d4f'),
  kurtas:     pool('1621307223150-14e4b102cebc','1618588505606-0be47e4dc77f','1630495117696-b09a14d4efef','1595526051239-c83b8dde9c64','1583391733959-b05307047915','1594463750939-70e5d26a21a1'),
  shoes:      pool('1595950653106-6c9ebd614d3a','1608231387042-66d1773070a5','1542291526-364d7f68edcb','1491553154513-2b57beaa80e7','1606107557635-f3b1e27d0893','1600185365-adae11f10b02','1579338559358-6b8a53d12df2','1465453869194-d6a66d0d4b17','1542291530-94d1c9f0d5e0','1542291527-56e33dada48e'),
  bags:       pool('1584916201218-f4242ceb4809','1548036328-c9fa89d128fa','1553062407-98eeb64c6a62','1473188537823-e28d44eb8df0','1584917865442-de89df76a097','1526659011-b5cba88e2c52','1566150905458-1bf1ff65df22','1506806979ede-d2e5f4e6deab'),
  cosmetics:  pool('1586495777744-4e6232bf2177','1596462502278-27bf85033e5a','1631214500515-e45501ec5d84','1512496522259-3f3745e4cd82','1522335789203-aabd1fc54bc9','1598440947619-2c35fc9b9c8d','1571781926291-c477ebfd024b','1557945009-9e0e1c80b24a'),
  beauty:     pool('1556228578-0d85b1a4d571','1556228720-1c2a4664f69f','1611080626919-7cf5a9dbab12','1608248543803-ba4f8c70ae0b','1624454002302-9dc86bcf9e6e','1616394584738-fc6e612e71b9'),
  skincare:   pool('1556228720-1c2a4664f69f','1556228578-0d85b1a4d571','1608248543803-ba4f8c70ae0b','1611080626919-7cf5a9dbab12','1616394584738-fc6e612e71b9','1571781926291-c477ebfd024b'),
  appliances: pool('1626222850937-5674da38aa10','1574269909862-7e1d70bb8078','1558618666-fcd25c85cd64','1581578731548-c64695cc6952','1556909114-f6e7ad7d3136','1585771724684-38796f0ef1ef','1517694712202-14dd9538aa97','1565538810835-ee1cfc1d8fe4'),
  kitchen:    pool('1584990347449-a359218d6a89','1514228742587-6b1558fcca3d','1556909114-f6e7ad7d3136','1550145782-ca58ce35e87f','1607631568010-a87245c0daf8','1589985270826-4b7bb135bc9d','1585771724684-38796f0ef1ef','1520558319-b7a7d2c4a1c5'),
  grocery:    pool('1542838132-92c53300491e','1488459716781-31db52582fe9','1550564050-1e6d5a77e1f7','1506802913710-7f3c62b01e9c','1498654896293-37aacf113fd9','1518977676601-b53f82d1ea40','1610832958596-165b45bb123f','1518791841217-8f162f1912da'),
  sports:     pool('1534438327276-14e5300c3a48','1601925228008-77e4e08aca39','1540497077202-4b4c44a0a06b','1576678927484-cc907957088c','1517649763962-0c623066013b','1526506118085-60ce8714f8c5','1575052814086-f385e2e2ad1b','1605296867304-46d5465a13f1'),
  books:      pool('1544947950-fa07a98d237f','1512820790803-83ca734da794','1481627834876-b7833e8f5a72','1524995997946-a1d2323f793c','1535905557558-afc4877a26fc','1516979187457-637abb4f9353','1491841651911-c44484b2e2c1'),
  toys:       pool('1596461404969-9ae70f2830c1','1558618047-3c8d1d68f22f','1519985176271-adb1088fa94c','1515488042361-ee00e0ddd4e4','1536846511313-4be07edc81b2','1598461704889-c9bc7c5f82b1'),
  furniture:  pool('1555041469-a586c61ea9bc','1524758631624-e2822e304c36','1556228453-efd6c1ff04f6','1538688525198-8f5dbea5b7d7','1586023492125-27264a6c2573','1493809842364-78817add7ffb'),
  accessories:pool('1511499767150-a48a237f0083','1522312346375-d1a52e2b99b3','1531803094847-cfe20d04b5b5','1566174538723-7e07ef21c4a5','1506629082153-d3a67f6ae0ed','1523779917675-b6ee3a42d661','1544966503-7f75d3e0aaf4'),
};

// ─────────────────────────────────────────────
// CORE PRODUCT BUILDER (combinatorial)
// ─────────────────────────────────────────────
function buildProducts(defs, category, categoryLabel, imgPool) {
  const results = [];
  let imgIdx = 0;

  defs.forEach(({ brand, types, colors, sizes, priceRange, descFn }) => {
    const colorList = colors || [''];
    const typeList  = types  || [''];
    const sizeList  = sizes  || [''];

    typeList.forEach(type => {
      colorList.forEach(color => {
        sizeList.forEach(size => {
          const parts = [brand, type, color, size].filter(Boolean);
          const name  = parts.join(' ');

          const price    = rng.int(priceRange[0], priceRange[1]);
          const discPct  = rng.bool(0.65) ? rng.int(5, 45) : 0;
          const origPrice= discPct > 0 ? Math.floor(price / (1 - discPct / 100)) : price;
          const badge    = rng.pick(BADGES);

          results.push({
            id: GLOBAL_ID++,
            name,
            brand,
            category: category.toLowerCase(),
            categoryLabel,
            price,
            originalPrice: origPrice,
            rating: rng.float(3.2, 5.0),
            reviews: rng.int(15, 24999),
            badge,
            badgeLabel: BL[badge],
            inStock: rng.bool(0.91),
            description: descFn ? descFn(type, color, size) : `${brand} ${type} – crafted for quality and style. ${color ? 'Available in ' + color + '.' : ''} Trusted by thousands of customers.`,
            features: [brand, type, color || 'Premium Build'].filter(Boolean),
            image: imgPool[imgIdx % imgPool.length],
            color: '#' + rng.int(0, 0xFFFFFF).toString(16).padStart(6, '0'),
            deliveryTime: rng.int(1, 7) + ' days',
          });
          imgIdx++;
        });
      });
    });
  });

  return results;
}

// ─────────────────────────────────────────────
// CATEGORY DEFINITIONS
// ─────────────────────────────────────────────

// ===== MOBILES =====
const MOBILES = [
  { brand:'Apple',    priceRange:[39900,159900], types:['iPhone SE 3rd Gen 64GB','iPhone SE 3rd Gen 128GB','iPhone 13 128GB','iPhone 13 256GB','iPhone 14 128GB','iPhone 14 256GB','iPhone 14 Plus 128GB','iPhone 15 128GB','iPhone 15 256GB','iPhone 15 512GB','iPhone 15 Plus 128GB','iPhone 15 Plus 256GB','iPhone 15 Pro 128GB','iPhone 15 Pro 256GB','iPhone 15 Pro 512GB','iPhone 15 Pro Max 256GB','iPhone 15 Pro Max 512GB','iPhone 15 Pro Max 1TB'], colors:['Midnight','Starlight','Pink','Blue','Green','Yellow','Natural Titanium','Blue Titanium','White Titanium','Black Titanium','Red'] },
  { brand:'Samsung',  priceRange:[12999,134999], types:['Galaxy A15 5G 128GB','Galaxy A25 5G 128GB','Galaxy A35 5G 128GB','Galaxy A55 5G 128GB','Galaxy A55 5G 256GB','Galaxy M15 5G 128GB','Galaxy M35 5G 128GB','Galaxy M55 5G 256GB','Galaxy F15 5G 128GB','Galaxy F55 5G 256GB','Galaxy S23 FE 128GB','Galaxy S23 FE 256GB','Galaxy S24 128GB','Galaxy S24 256GB','Galaxy S24+ 256GB','Galaxy S24+ 512GB','Galaxy S24 Ultra 256GB','Galaxy S24 Ultra 512GB','Galaxy Z Flip 5 256GB','Galaxy Z Fold 5 256GB','Galaxy Z Fold 5 512GB'], colors:['Onyx Black','Icy Blue','Lavender','Cream','Marble Gray','Cobalt Violet','Titanium Black','Titanium Gray','Amber Yellow'] },
  { brand:'OnePlus',  priceRange:[19999,129999], types:['Nord CE3 5G 128GB','Nord CE4 5G 128GB','Nord 4 5G 256GB','Nord 4 5G 512GB','12R 5G 128GB','12R 5G 256GB','12 5G 256GB','12 5G 512GB','Open 5G 512GB'], colors:['Aqua Surge','Dark Chrome','Silky Black','Flowy Emerald','Iron Gray','Cool Blue','Mercurial Silver','Obsidian Midnight','Voyager Black','Emerald Dusk'] },
  { brand:'Xiaomi',   priceRange:[9999,69999],  types:['Redmi 13C 128GB','Redmi Note 13 128GB','Redmi Note 13 256GB','Redmi Note 13 Pro 5G 128GB','Redmi Note 13 Pro 5G 256GB','Redmi Note 13 Pro+ 5G 256GB','Redmi Note 13 Pro+ 5G 512GB','Poco X6 5G 256GB','Poco X6 Pro 5G 256GB','Poco F6 5G 256GB','Poco F6 5G 512GB','Xiaomi 14 5G 256GB','Xiaomi 14 5G 512GB'], colors:['Midnight Black','Startrail Green','Aurora Purple','Opal Green','Fusion Purple','Midnight Blue','Yellow','Titanium Blue','White'] },
  { brand:'Realme',   priceRange:[9999,44999],  types:['Narzo N65 5G 128GB','11 5G 128GB','11 5G 256GB','12x 5G 128GB','12 Pro 5G 128GB','12 Pro 5G 256GB','12 Pro+ 5G 256GB','GT 6T 5G 256GB','GT 6T 5G 512GB'], colors:['Marble Black','Marble Green','Glory Black','Glory Gold','Woodland Green','Dark Purple','Submarine Blue','Beige Gold','Fluid Silver','Razor Green'] },
  { brand:'Vivo',     priceRange:[10999,54999], types:['Y28 5G 128GB','Y100 5G 128GB','T3x 5G 128GB','T3x 5G 256GB','V29e 5G 128GB','V30 5G 128GB','V30 5G 256GB','V30 Pro 5G 256GB'], colors:['Glow Black','Ice Crystal Blue','Dawnlight Gold','Airstream Blue','Royal Purple','Midnight Black','Hibiscus Red','Peacock Green','Himalayan Blue'] },
  { brand:'Oppo',     priceRange:[12999,99999], types:['A78 5G 128GB','A58 128GB','Reno 11 5G 128GB','Reno 11 5G 256GB','Reno 11 Pro 5G 256GB','F25 Pro 5G 128GB','F25 Pro 5G 256GB','Find N3 Flip 5G 256GB'], colors:['Cool Black','Glowing Blue','Glowing Black','Paradise Green','Rock Grey','Amber Orange','Misty Rose','Moonlit Purple'] },
  { brand:'Google',   priceRange:[44999,109999],types:['Pixel 7a 128GB','Pixel 8 128GB','Pixel 8 256GB','Pixel 8a 128GB','Pixel 8a 256GB','Pixel 8 Pro 128GB','Pixel 8 Pro 256GB','Pixel 8 Pro 512GB'], colors:['Charcoal','Snow','Coral','Obsidian','Hazel','Rose','Porcelain','Bay','Aloe'] },
  { brand:'Motorola', priceRange:[9999,34999],  types:['Moto G34 5G 128GB','Moto G54 5G 128GB','Moto G64 5G 128GB','Moto G85 5G 128GB','Moto G85 5G 256GB','Edge 40 5G 128GB','Edge 40 5G 256GB','Edge 50 Pro 5G 256GB'], colors:['Arctic Silver','Ice Blue','Cobalt Blue','Pearl Blue','Sage Green','Urban Grey','Eclipse Black','Nebula Green','Luxe Lavender','Black Beauty'] },
  { brand:'Nothing',  priceRange:[19999,44999], types:['Nothing Phone (2a) 128GB','Nothing Phone (2a) 256GB','Nothing Phone (2) 128GB','Nothing Phone (2) 256GB','Nothing Phone (2) 512GB'], colors:['Black','White'] },
];

// ===== LAPTOPS =====
const LAPTOPS = [
  { brand:'Apple',  priceRange:[89900,249900], types:['MacBook Air 13" M2','MacBook Air 13" M3','MacBook Air 15" M3','MacBook Pro 14" M3','MacBook Pro 14" M3 Pro','MacBook Pro 16" M3 Pro','MacBook Pro 16" M3 Max'], colors:['Midnight','Starlight','Space Grey','Silver','Space Black'], sizes:['8GB/256GB','8GB/512GB','16GB/512GB','16GB/1TB','24GB/1TB','36GB/1TB'] },
  { brand:'Dell',   priceRange:[42999,199999], types:['Inspiron 15 3530','Vostro 15 3530','G15 Gaming 5530','XPS 13 Plus','XPS 15 9530','XPS 17 9730','Alienware m16 R2'], colors:['Platinum Silver','Titan Grey','Dark Shadow','Graphite','Ice Blue'], sizes:['i5/8GB/512GB','i5/16GB/512GB','i7/16GB/1TB','i7/32GB/1TB','i9/32GB/1TB','Ryzen 7/16GB/1TB'] },
  { brand:'HP',     priceRange:[38999,179999], types:['Pavilion 15','Envy 15','Envy x360 15','Spectre x360 14','Victus 16 Gaming','OMEN 16 Gaming','EliteBook 840 G11'], colors:['Natural Silver','Warm Gold','Space Blue','Nightfall Black','Poseidon Blue','Asteroid Silver'], sizes:['i5/8GB/512GB','i5/16GB/512GB','i7/16GB/1TB','Ryzen 5/8GB/512GB','Ryzen 7/16GB/1TB'] },
  { brand:'Lenovo', priceRange:[38999,179999], types:['IdeaPad Slim 1','IdeaPad Slim 3','IdeaPad Slim 5 OLED','Yoga 7 2-in-1','Legion 5i Pro','Legion 5 Pro','ThinkPad E15','ThinkPad X1 Carbon'], colors:['Cloud Grey','Abyss Blue','Pale Gold','Storm Grey','Cosmic Blue','Arctic Grey','Deep Black'], sizes:['i5/8GB/256GB','i5/16GB/512GB','i7/16GB/1TB','Ryzen 5/8GB/512GB','Ryzen 7/16GB/1TB','Ryzen 9/32GB/1TB'] },
  { brand:'Asus',   priceRange:[36999,179999], types:['VivoBook 15','VivoBook 16X','ZenBook 14 OLED','ProArt Studiobook 16','ROG Zephyrus G14','ROG Strix G16','TUF Gaming A15','TUF Gaming F15'], colors:['Transparent Silver','Quiet Blue','Indie Black','Mecha Gray','Eclipse Gray','Platinum White','Cool Silver'], sizes:['Ryzen 5/8GB/512GB','i5/16GB/512GB','i7/16GB/1TB','Ryzen 7/16GB/1TB','Ryzen 9/32GB/1TB','i9/32GB/2TB'] },
  { brand:'Acer',   priceRange:[33999,124999], types:['Aspire 5 A515','Aspire 7 Gaming','Swift Go 14','Swift Go 16','Predator Helios Neo 16','Nitro 5 AN515','Nitro V 15'], colors:['Steel Gray','Silver','Misty Pink','Stellar Blue','Mist Green','Abyssal Black'], sizes:['i5/8GB/512GB','i5/16GB/512GB','Ryzen 5/16GB/512GB','i7/16GB/1TB','Ryzen 7/16GB/1TB','i9/32GB/1TB'] },
  { brand:'MSI',    priceRange:[64999,199999], types:['Thin GF63','Modern 14','Prestige 14 Evo','Creator Z16','Cyborg 15','Katana 17','Raider GE78 HX'], colors:['Black','Cosmos Gray','Lunar Gray','Pure White','Titan Gray'], sizes:['i5/16GB/512GB','i7/16GB/1TB','i9/32GB/1TB','Ryzen 7/16GB/1TB'] },
];

// ===== SMART WATCHES =====
const SMARTWATCHES = [
  { brand:'Apple',      priceRange:[29900,89900],  types:['Watch SE 2 40mm','Watch SE 2 44mm','Watch Series 9 41mm','Watch Series 9 45mm','Watch Ultra 2 49mm'], colors:['Midnight','Starlight','Silver','Red','Storm Blue','Gold'], sizes:['GPS','GPS + Cellular'] },
  { brand:'Samsung',    priceRange:[14999,49999],  types:['Galaxy Watch 4 40mm','Galaxy Watch 4 44mm','Galaxy Watch 5 40mm','Galaxy Watch 5 44mm','Galaxy Watch 6 40mm','Galaxy Watch 6 44mm','Galaxy Watch 6 Classic 43mm','Galaxy Watch 6 Classic 47mm'], colors:['Graphite','Silver','Gold','Green','Pink Gold','Black','Cream'] },
  { brand:'Noise',      priceRange:[1499,9999],    types:['ColorFit Pro 5','ColorFit Pro 4 Max','ColorFit Ultra 3','ColorFit Pulse 4','NoiseFit Halo','NoiseFit Evolve 3','NoiseFit Crew Pro','NoiseFit Endure','Noise X-Fit 3'], colors:['Jet Black','Rose Gold','Midnight Blue','Olive Green','Gunmetal Grey','Silver'] },
  { brand:'Fire-Boltt', priceRange:[999,7999],     types:['Phoenix Pro','Ring 3','Ninja Call Pro','Visionary 2','Dagger 3','Phoenix Ultra','Talk 2','Gladiator','Invincible Plus'], colors:['Black','Rose Gold','Silver','Blue','Green','Orange','Maroon'] },
  { brand:'Garmin',     priceRange:[14999,89999],  types:['Venu Sq 2','Venu 3','Forerunner 265','Fenix 7','Fenix 7 Solar','Epix Pro 42mm','Instinct 2','Tactix 7','Quatix 7'], colors:['Slate','Ivory','Whitestone','Black/Slate','Powder Grey','Carbon Black'] },
  { brand:'Titan',      priceRange:[2999,14999],   types:['Crest 40mm','Smart Pro 2','Ultra Nova','Smart 3 Pro','ConnectPro','Evoke Plus','Zest Ultra'], colors:['Black','Silver','Blue Strap','Brown Strap','Green Strap','Grey','Gold'] },
  { brand:'Fastrack',   priceRange:[1999,8999],    types:['Reflex Beat+','Optimus Pro 2','Revoltt FX1 Plus','Limitless FS1 Pro','Xtend Pro 2','Radar Volt','Optimus 2.0'], colors:['Black','Steel Blue','Olive Green','Blush Pink','Maroon','Ash Grey'] },
  { brand:'Boat',       priceRange:[1299,6999],    types:['Wave Prime 2','Wave Sigma Call','Storm Call Pro 2','Active 3 Storm','Lunar Horizon Ultra','Xtend Smartwatch 2','Storm Pro Plus'], colors:['Active Black','Pitch Black','Ivory','Teal','Crimson Maroon','Hunter Green','Denim Blue'] },
  { brand:'Amazfit',    priceRange:[3999,24999],   types:['Bip 5','GTR 4','GTS 4 Mini','T-Rex Ultra','Falcon Smartwatch','Balance Smartwatch','Cheetah Pro'], colors:['Cream White','Graphite Black','Autumn Brown','Grey','Wilderness Green','Moonwhite'] },
  { brand:'Casio',      priceRange:[1699,19999],   types:['G-Shock GA-2100','G-Shock GBD-H2000','G-Shock MTG-B3000','G-Shock GW-B5600','ProTrek PRW-30','Edifice EQB-1100','Digitakt Calculator Watch'], colors:['Black','White','Olive','Red','Blue','Camouflage','Caramel','Rangeman Olive'] },
];

// ===== HEADPHONES =====
const HEADPHONES = [
  { brand:'Sony',     priceRange:[1999,34999],  types:['WH-1000XM5','WH-1000XM4','WH-CH720N','WF-1000XM5','WF-C500','LinkBuds S','XB910N','XB100 Wireless'], colors:['Black','Silver','Midnight Blue','Platinum Silver','Sage'] },
  { brand:'Boat',     priceRange:[599,4999],    types:['Rockerz 450 Pro','Rockerz 550','Airdopes 141','Airdopes 141 ANC','Nirvana Ion ANC','Airdopes 621','Rockerz 255 Pro+','Wave Earphones 3'], colors:['Black','Blue','Orange','Red','White','Lime Green','Mint Teal','Falcon Green'] },
  { brand:'JBL',      priceRange:[1999,24999],  types:['Tune 770NC','Tune 670NC','Live 770NC','Live 660NC','Quantum 350 Wireless','Reflect Flow Pro','Free II TWS','Wave Flex TWS'], colors:['Black','White','Blue','Pink','Red','Beige'] },
  { brand:'Apple',    priceRange:[12900,59900], types:['AirPods (3rd Gen)','AirPods Pro (2nd Gen)','AirPods Max','EarPods (USB-C)'], colors:['White','Midnight','Starlight','Blue','Pink','Space Grey'] },
  { brand:'Noise',    priceRange:[799,5999],    types:['Buds VS103 ANC','Buds VS104 Pro','Shots Ace ANC','Buds Connect 2','Twist Go 2','Buds Sport 2','X1 ANC','Buds Esports'], colors:['Jet Black','Rose Gold','Candy Blue','Midnight Blue','Active Black','Snow White','Ivory'] },
  { brand:'Bose',     priceRange:[12900,34900], types:['QuietComfort 45','QuietComfort Ultra','Ultra Open Earbuds','QuietComfort Earbuds 2','Sport Earbuds','SoundSport Free'], colors:['Triple Black','White Smoke','Moonstone Blue','Sandstone'] },
  { brand:'Samsung',  priceRange:[3999,14999],  types:['Galaxy Buds FE','Galaxy Buds 2','Galaxy Buds 2 Pro','Galaxy Buds Live'], colors:['Graphite','White','Lavender','Bora Purple','Phantom Black'] },
  { brand:'Realme',   priceRange:[799,3999],    types:['Buds Air 5 Pro','Buds Air 5','Buds T300','Buds Wireless 2','Buds Q2s','Buds Air 3 Neo','Techlife Buds T100'], colors:['Bass Black','Starry Blue','Sea White','Dark Blue','Blackout Grey'] },
  { brand:'OnePlus',  priceRange:[1499,9999],   types:['Buds 3','Buds Z2','Nord Buds 2r','Nord Buds 2','Buds Pro 2R','Bullets Z2'], colors:['Misty Grey','Obsidian','Green','White','Graphite','Black'] },
];

// ===== ELECTRONICS =====
const ELECTRONICS = [
  { brand:'Sony',     priceRange:[14999,89999], types:['Bravia 43" 4K LED','Bravia 55" 4K OLED','Bravia 65" 4K OLED','Bravia 75" 4K Mini LED','Alpha 7 IV Camera','Alpha ZV-E10 Camera','WX-500 Car Stereo','BDV-N9200W Home Theater'], colors:['Black'] },
  { brand:'LG',       priceRange:[12999,149999],types:['32" HD Smart TV','43" 4K NanoCell','55" OLED evo C3','65" OLED evo G3','75" QNED Mini LED','Projector HU710PW','SN9YG Soundbar','XBOOM 360'], colors:['Black','Dark Titan Gray'] },
  { brand:'Samsung',  priceRange:[17999,179999],types:['Crystal 4K 43"','Crystal 4K 55"','QLED 4K Q70C 55"','QLED 4K Q80C 65"','Neo QLED 4K QN85C','Neo QLED 8K','The Frame 55"','The Serif 55"'], colors:['Black','White','Beige','Charcoal','Sandy Gold'] },
  { brand:'Panasonic',priceRange:[9999,59999],  types:['32" HD LED TV','43" 4K LED TV','55" OLED TV','Soundbar SC-HTB490','Blu-ray DMP-BD94','DP-UB9000 4K Blu-ray'], colors:['Black'] },
  { brand:'Philips',  priceRange:[6999,49999],  types:['32" HD LED','43" 4K UHD','55" Ambilight OLED','Soundbar TAB8507','B8505 Soundbar','OLED+936 TV'], colors:['Black','Silver'] },
];

// ===== MEN'S CLOTHING =====
const MENS_CLOTHING = [
  { brand:'Allen Solly',  priceRange:[699,2999],  types:["Men's Regular Fit Shirt","Men's Formal Trousers","Men's Blazer","Men's Polo T-Shirt","Men's Chinos","Men's Casual Joggers","Men's Slim Fit Shirt"], colors:['White','Light Blue','Sky Blue','Formal Grey','Navy','Dark Olive','Beige','Black','Burgundy','Cream'] },
  { brand:"Van Heusen",   priceRange:[799,3499],  types:["Men's Regular Fit Cotton Shirt","Men's Slim Fit Formal Shirt","Men's Blazer","Men's Business Trousers","Men's Smart Fit Polo"], colors:['White','Blue','Grey','Striped White-Blue','Checkered','Navy','Charcoal','Pink'] },
  { brand:"Levi's",       priceRange:[1499,4999], types:["Men's 501 Original Jeans","Men's 511 Slim Fit Jeans","Men's 512 Slim Taper Jeans","Men's 514 Regular Fit Jeans","Men's Trucker Jacket","Men's T-Shirt","Men's Graphic Tee"], colors:['Dark Indigo','Mid Blue Worn','Light Stonewash','Resin Rinse','Black Rinse','Stonewash','Authentic Blue'] },
  { brand:'Puma',         priceRange:[799,3499],  types:["Men's Regular Fit T-Shirt","Men's Slim Fit Jogger","Men's Running Shorts","Men's Full Zip Hoodie","Men's Half-Zip Training Top","Men's Track Jacket","Men's Training Tights"], colors:['Puma Black','Puma White','Navy Blazer','Forest Night','Ultra Blue','Deep Dive','Lime Squeeze'] },
  { brand:'Adidas',       priceRange:[999,4499],  types:["Men's Essential 3-Stripe Tee","Men's Essentials Fleece Hoodie","Men's Training Shorts","Men's Linear Jogger","Men's Z.N.E Hoodie","Men's Tiro 23 Pant","Men's Club Polo"], colors:['Black/White','White/Black','Dark Navy','Better Scarlet','Focus Olive','Green Oxide'] },
  { brand:'H&M',          priceRange:[499,2499],  types:["Men's Slim Fit Crew Neck Tee","Men's Relaxed Fit Hoodie","Men's Slim Fit Chinos","Men's Regular Fit Oxford Shirt","Men's Lined Denim Jacket","Men's Cargo Trousers","Men's Gym Shorts"], colors:['White','Black','Dark Grey','Khaki','Dark Blue','Beige','Moss Green','Dusty Rose'] },
  { brand:'Zara',         priceRange:[999,4999],  types:["Men's Printed Poplin Shirt","Men's Slim Fit Jeans","Men's Cargo Trousers","Men's Puffer Jacket","Men's Waffle Knit T-Shirt","Men's Blazer","Men's Structured Overshirt"], colors:['White','Ecru','Black','Medium Indigo','Khaki','Camel','Light Grey','Rust'] },
  { brand:'Wildcraft',    priceRange:[599,3499],  types:["Men's Quick Dry T-Shirt","Men's Trekking Trousers","Men's Fleece Jacket","Men's Wind Cheater","Men's Camping Shorts","Men's Stormguard Jacket"], colors:['Black','Grey Melange','Dark Olive','Electric Blue','Blood Orange','Forest Green'] },
];

// ===== WOMEN'S CLOTHING =====
const WOMENS_CLOTHING = [
  { brand:'Zara',    priceRange:[999,4999],  types:["Women's Floral Midi Dress","Women's Satin Slip Skirt","Women's Linen Blend Trousers","Women's Striped Shirt","Women's Blazer","Women's Wrap Dress","Women's Knit Top","Women's Wide Leg Jeans"], colors:['Ecru','Black','Cobalt Blue','Mauve','Rust','White Print','Terracotta','Sage Green','Light Pink'] },
  { brand:'H&M',     priceRange:[499,2499],  types:["Women's Jersey Dress","Women's Flared Jeans","Women's Ribbed Tank Top","Women's Linen Shorts","Women's Oversized Blazer","Women's Puffer Vest","Women's Cotton Midi Skirt","Women's Crew Neck Sweatshirt"], colors:['Light Beige','Black','White','Denim Blue','Dusty Pink','Olive Green','Terracotta','Dark Red'] },
  { brand:'Allen Solly',priceRange:[699,2999],types:["Women's Regular Shirt","Women's Formal Straight Trousers","Women's Blazer Set","Women's Knit Sweater","Women's Slim Fit Jeans","Women's Casual Top","Women's Polo Tee"], colors:['White','Mint Green','Powder Blue','Beige','Navy','Lilac','Black','Coral'] },
  { brand:'Biba',    priceRange:[799,2499],  types:["Women's Anarkali Kurta Set","Women's Straight Kurta","Women's Kurta Pallazo Set","Women's Sharara Set","Women's Salwar Suit Set","Women's Patiala Suit","Women's Tunic"], colors:['Red','Blue','Green','Yellow','Orange','Peach','Purple','Maroon','Mustard'] },
  { brand:'W',       priceRange:[899,2999],  types:["Women's Asymmetric Kurta","Women's Side Slit Kurta","Women's Pallazo Pants","Women's Co-ord Set","Women's Cape Kurta","Women's Jacket Kurta"], colors:['Off White','Navy','Maroon','Teal','Emerald','Coral','Camel','Black'] },
  { brand:'Aurelia', priceRange:[799,2499],  types:["Women's Embroidered Kurta","Women's Block Print Kurta","Women's Floral Tunic","Women's Straight Kurta Set","Women's Palazzo Set","Women's Thread Work Kurta"], colors:['Peach','Mint','Rose','Sky Blue','Lilac','Yellow','Off White','Terracotta'] },
];

// ===== KIDS WEAR =====
const KIDS_WEAR = [
  { brand:'H&M Kids',    priceRange:[299,1499], types:["Boys' Cotton T-Shirt","Girls' Floral Dress","Boys' Slim Jeans","Girls' Legging Set","Unisex Hoodie","Boys' Jogger Set","Girls' Puffer Jacket","Baby Romper Set"], colors:['White','Red','Blue','Pink','Yellow','Green','Orange','Grey','Multicolor','Navy'] },
  { brand:'Mothercare',  priceRange:[399,2499], types:["Baby Boys' Sleepsuit Set","Baby Girls' Dress","Toddler Polo Shirt","Toddler Skirt Set","Boys' Swim Set","Girls' Party Dress","Baby Dungaree Set","Kids' Raincoat"], colors:['Blue','Pink','Red','Yellow','Green','White','Grey Marl','Stripe Print'] },
  { brand:'FirstCry',    priceRange:[249,1999], types:["Boys' Graphic Tee","Girls' Frock","Baby Overall Set","Toddler Kurta Set","Boys' Shorts Set","Girls' Ethnic Wear Set","Baby Night Suit","Kids' Ethnic Jacket Set"], colors:['Blue','Peach','Pink','Yellow','Orange','Green','Cream','Multi'] },
  { brand:'Puma Kids',   priceRange:[599,1999], types:["Boys' Training Tee","Girls' Active Shorts","Kids' Track Suit","Boys' Running Shorts","Girls' Leggings","Kids' Polo Shirt","Boys' Printed Jogger"], colors:['Black','Navy','Blue','Pink','Red','White','Green'] },
  { brand:'Nike Kids',   priceRange:[699,2499], types:["Boys' Dri-FIT Tee","Girls' Pro Tight","Kids' Sportswear Club Hoodie","Boys' Sport Shorts","Girls' Club Fleece Pant","Kids' Tech Fleece Jacket"], colors:['Black/White','White/Black','Navy','Pink Spell','Green Strike'] },
];

// ===== SAREES =====
const SAREES = [
  { brand:'FabIndia',   priceRange:[999,8999],  types:['Cotton Block Print Saree','Linen Saree','Cotton Silk Saree','Chanderi Silk Saree','Zardozi Embroidered Saree','Handloom Saree','Organza Saree'], colors:['Red','Blue','Green','Yellow','Orange','Peach','Maroon','Navy','Mustard','Teal','Ivory'] },
  { brand:'Nalli',      priceRange:[2999,24999],types:['Kanchipuram Silk Saree','Banarasi Silk Saree','Mysore Silk Saree','Patola Saree','Raw Silk Saree','Tissue Saree'], colors:['Red & Gold','Green & Gold','Maroon & Silver','Blue & Gold','Peach & Silver','Purple & Gold','Cream & Gold'] },
  { brand:'Kalamandir', priceRange:[1499,9999], types:['Georgette Saree','Chiffon Saree','Crepe Saree','Brasso Saree','Net Saree','Lycra Saree','Rayon Saree'], colors:['Magenta','Royal Blue','Orange','Turquoise','Pink','Green','Red','Violet','Sky Blue','Beige'] },
  { brand:'Meena Bazaar',priceRange:[1999,14999],types:['Bridal Silk Saree','Designer Embroidered Saree','Phulkari Saree','Mirror Work Saree','Zari Bordered Saree','Hand Painted Saree'], colors:['Bridal Red','Emerald','Peacock Blue','Coral','Dusty Rose','Golden','Off White'] },
  { brand:'Utsav Fashion',priceRange:[799,4999],types:['Printed Georgette Saree','Floral Chiffon Saree','Plain Crepe Saree','Tie-Dye Saree','Bandhani Saree','Satin Saree'], colors:['Yellow','Pink','Purple','Orange','Blue','Green','Red','Multicolor','Black'] },
];

// ===== KURTAS =====
const KURTAS = [
  { brand:'Biba',     priceRange:[699,2499],  types:["Women's Straight Kurta","Women's Anarkali Kurta","Women's Flared Kurta","Women's Kurta with Pants Set","Men's Nehru Collar Kurta","Men's Mandarin Collar Kurta"], colors:['Red','Indigo Blue','Mustard','Coral','Turquoise','Teal','Maroon','Olive','Peach','Lavender'] },
  { brand:'FabIndia', priceRange:[899,3999],  types:["Women's Block Print Cotton Kurta","Women's Embroidered Silk Kurta","Men's Cotton Kurta","Men's Khadi Kurta","Men's Designer Bandhgala","Women's Handloom Kurta"], colors:['Natural','Indigo','Red Ochre','Olive Green','Cream','Terracotta','Rust Brown','Deep Blue'] },
  { brand:'Aurelia',  priceRange:[799,2499],  types:["Women's A-Line Kurta","Women's Straight Cut Kurta","Women's Cape Kurta","Women's Embroidery Kurta","Women's High Low Kurta"], colors:['Peach','Mint','Rose','Sky Blue','Lilac','Off White','Teal','Coral','Beige'] },
  { brand:'Rangmanch by Pantaloons',priceRange:[599,1999],types:["Women's Straight Kurta","Women's Printed Kurta","Women's Rayon Kurta","Women's Long Kurta"], colors:['Yellow','Pink','Purple','Orange','Green','Red','Blue','White','Multicolor'] },
  { brand:'Manyavar', priceRange:[2499,12999],types:["Men's Sherwani Set","Men's Kurta Pajama Set","Men's Designer Kurta","Men's Embroidered Kurta","Men's Jodhpuri Set"], colors:['Cream','Beige','Maroon','Navy','White','Royal Blue','Dark Green','Grey'] },
];

// ===== SHOES =====
const SHOES = [
  { brand:'Nike',     priceRange:[3495,14995], types:['Air Force 1 Low','Air Max 270','React Pegasus 40','ZoomX Vaporfly Next%','Dunk Low','Blazer Mid 77','React Infinity Run','Legend Essential Trainer','Air Zoom Pegasus 40','Free Run 5.0'], colors:['White/Black','Triple White','Black/White','Midnight Navy','Obsidian','Chile Red','Court Purple','Washed Teal','Summit White/Wolf Grey','Electro Orange'] },
  { brand:'Adidas',   priceRange:[2999,15999], types:['Ultraboost 23','Ultraboost Light','Stan Smith','Superstar','Samba OG','Campus 00s','Forum Low','Gazelle','NMD R1','Rivalry 86'], colors:['Core Black/White','Cloud White/Core Black','Green/White','Navy/White','White/Green Gum','Off White/Red','Cream White/Green Gum','Dark Blue','Better Scarlet/White','Grey/Red'] },
  { brand:'Puma',     priceRange:[1999,8999],  types:['RS-X Efekt','Suede Classic XXI','Cali Sport','Velocity Nitro 2','Deviate Elite 2','Softride Rift','Disperse XT 2 Training','Ferrari Roma Via','Bmw Mms Tiburion'], colors:['Puma Black/Gold','Puma White/Navy','Grey/Vibrant Orange','Navy/Silver','Forest Night/White','Deep Maroon','White/Red','Black/Red','Blue/White'] },
  { brand:'Reebok',   priceRange:[2499,9999],  types:['Classic Leather','Club C 85','Nano X3','Zig Kinetica 2.5','Floatride Energy 5','Flexagon Energy 4','Royal Complete CLN 2','Lite Plus 3.0'], colors:['White/Light Grey','Chalk/Maroon','Core Black','Digital Blue','Midnight Black/Silver','Cloud White/Vegan Beige','Pewter/Royal'] },
  { brand:'Woodland', priceRange:[1999,7999],  types:["Men's Leather Derby Shoes","Men's Trekking Sandals","Men's Outdoor Boots","Men's Casual Oxford","Men's Camel Leather Loafer","Men's Suede Boat Shoes","Women's Leather Casuals"], colors:['Camel','Black','Brown','Khaki','Tan','Dark Brown','Olive'] },
  { brand:'Bata',     priceRange:[999,4999],   types:["Men's Formal Lace-Up","Men's Derby Shoe","Women's Court Pump","Women's Ballet Flat","Women's Block Heel Sandal","Kids' School Shoe","Men's Casual Slip-On","Men's Running Shoe"], colors:['Black','Brown','Beige','White','Navy','Tan','Dark Brown'] },
  { brand:'Sparx',    priceRange:[699,2999],   types:["Men's Running Shoe SM-777","Men's Sports Shoe SM-835","Men's Casual Shoe SM-625","Women's Running Shoe SW-620","Women's Floater Sandal SF-2903","Men's Outdoor Sandal"], colors:['Black/Yellow','Navy/Orange','Grey/Blue','Red/Grey','White/Blue','Black/Green'] },
  { brand:'Metro Shoes',priceRange:[1299,5999],types:["Women's Strappy Sandal","Women's Block Heel","Women's Pointed Toe Pump","Women's Kitten Heel","Men's Derby Oxford","Men's Moccasin","Women's Wedge Heel","Women's Ankle Strap Flat"], colors:['Black','Gold','Nude','Silver','Red','Brown','Navy','White','Tan'] },
];

// ===== BAGS =====
const BAGS = [
  { brand:'American Tourister',priceRange:[2999,9999], types:['Spinner 55cm Cabin Luggage','Spinner 68cm Medium Luggage','Spinner 77cm Large Luggage','55cm Hardshell Carry-On','Backpack 30L','Laptop Backpack 48cm','Duffel Bag 55cm'], colors:['Black','Navy','Teal','Red','Grey','Rose Pink','Turquoise','Dark Grey'] },
  { brand:'Wildcraft',        priceRange:[799,4999],  types:['Ranger 45L Backpack','Trekker 60L Backpack','Day Pack 20L','Laptop Backpack 30L','Rover 25L Backpack','Hydration Backpack 10L','Gym Duffel 50L'], colors:['Black','Olive Green','Royal Blue','Orange','Grey','Crimson','Steel Blue'] },
  { brand:'Tommy Hilfiger',   priceRange:[3999,18999],types:["Women's Signature Tote","Women's Crossbody Bag","Women's Satchel Bag","Men's Messenger Bag","Men's Commuter Backpack","Women's Mini Shoulder Bag"], colors:['Navy/White','Khaki/Navy','Black','Cream','Tan','Red/White/Blue'] },
  { brand:'Baggit',           priceRange:[899,3999],  types:["Women's Shoulder Bag","Women's Sling Bag","Women's Tote Bag","Women's Clutch","Women's Backpack Purse","Women's Crossbody"], colors:['Black','Tan','Maroon','Teal','Mustard','Pink','Olive','Beige','Blue','Grey'] },
  { brand:'Lavie',            priceRange:[699,3499],  types:["Women's Hobo Bag","Women's Satchel","Women's Doctor Bag","Women's Bucket Bag","Women's Envelope Clutch","Women's Backpack"], colors:['Black','Brown','Tan','Blush Pink','Mustard','Teal','Maroon','Beige','Navy','Grey'] },
  { brand:'Caprese',          priceRange:[1499,6999], types:["Women's Structured Tote","Women's Saddle Bag","Women's Quilted Chain Bag","Women's Signature Satchel","Women's Boston Bag"], colors:['Black','Tan','Dark Taupe','Blush','Wine','Caramel','Olive','Navy'] },
  { brand:'Fastrack',         priceRange:[599,2999],  types:["Men's Messenger Bag","Men's Backpack 30L","Women's Casual Tote","Women's Small Sling","Men's Travel Bag","Men's Laptop Bag 15.6\""], colors:['Black','Dark Grey','Navy','Olive','Tan','Blue'] },
];

// ===== COSMETICS =====
const COSMETICS = [
  { brand:'Lakme',     priceRange:[149,1499], types:['9to5 Primer + Matte Lipstick','Absolute Matte Revolution Lipstick','Absolute Shine Liquid Eye Liner','Eyeconic Kajal','9to5 Insta Eye Liner','Enrich Matte Lipstick','9to5 Weightless Mousse Foundation','Perfect Radiance Compact','Eyeconic Mascara'], colors:['Coral Candy','Deep Wine','Berry Burst','Rosy Sunday','Nude Walk','Classic Red','Mulberry Muse','Pink Candy','Plum Gene','Rose Rush'] },
  { brand:'Maybelline', priceRange:[169,1299],types:['New York Colossal Kajal','Fit Me Matte + Poreless Foundation','Fit Me Concealer','The Falsies Mascara','Color Sensational Lipstick','Master Strobing Stick','Sky High Mascara','Age Rewind Eraser Concealer','Fit Me Loose Powder'], colors:['Classic Black','Natural Ivory','Buff Beige','Classic Ivory','Creamy Natural','Red Revival','Ravishing Rose','Pink Wink','Nude Nuance','Mocha'] },
  { brand:"L'Oréal",   priceRange:[199,2499], types:['Infallible 24H Fresh Wear Foundation','True Match Concealer','Glossy Lips Color Riche','Paradise Enchanted Blush','Infallible Grip Eyeliner','Infallible Brow Definer','Telescopic Mascara','Rouge Magique Lipstick'], colors:['Warm Sand','Golden Beige','Deep Auburn','Cocoa Butter','Cashmere','Garnet Rose','Light Ivory','Blush Ivory'] },
  { brand:'MAC',        priceRange:[999,4999], types:['Ruby Woo Matte Lipstick','Retro Matte Lipstick','Heroine Matte Lipstick','Pro Longwear Concealer','Studio Fix Fluid Foundation','Mineralize Skinfinish Natural','Studio Radiance Serum Foundation','Prep + Prime Lip'], colors:['Ruby Woo','Chili','Mehr','Velvet Teddy','Whirl','Taupe','Lady Danger','Rebel','Twig','Creme Cup'] },
  { brand:'Colorbar',  priceRange:[149,1299], types:['Velvet Matte Lipstick','Cosmopolitan Lipstick','Full Cover Foundation','Nude Fusion Lipstick','I-Glide Eye Liner','Just Mascara','Smoky Eyes Eye Shadow Palette','Blush','Perfect Match Foundation'], colors:['Rose Taupe','Wine Berries','Nude Beige','Cranberry Red','Mauve Dreams','Brick Orange','Baby Pink','Nude Peach','Raspberry'] },
  { brand:'NYX',        priceRange:[349,1799], types:['Professional Makeup Lip Lingerie','Soft Matte Lip Cream','Epic Ink Liner','Vivid Brights Eyeliner','Bare With Me Concealer','Can\'t Stop Won\'t Stop Foundation','Shine Loud High-Shine Lip Color','Micro Brow Pencil'], colors:['Euro Trash','Exposed','Budapest','Sao Paulo','Nude Venise','Whipped Caviar','Licorice','Mocha','Prague','Cannes'] },
];

// ===== BEAUTY =====
const BEAUTY = [
  { brand:'Dove',      priceRange:[59,699],   types:['Deep Moisture Body Wash','Gentle Exfoliating Body Wash','Nourishing Body Lotion','Intensive Body Lotion','Anti-Dandruff Shampoo','Intense Repair Shampoo','Hairfall Rescue Conditioner','Volume Nourishment Shampoo','Original Bar Soap 100g'], sizes:['200ml','400ml','500ml','750ml','100g','200g'] },
  { brand:'Nivea',     priceRange:[79,699],   types:['Soft Moisturising Cream','Body Lotion Normal Skin','Cocoa Butter Body Lotion','Whitening Day Cream','Men Sensitive Face Wash','Pearl & Beauty Deodorant','Men Dark Spot Off Face Wash','Women Whitening Deodorant','Milk Body Lotion'], sizes:['50ml','100ml','200ml','400ml','150ml','250ml'] },
  { brand:'Ponds',     priceRange:[49,599],   types:["White Beauty BB+ Fairness Cream","Age Miracle Day Cream","Bright Beauty Vitamin C Serum","White Beauty Spot-less Glow Face Wash","Cold Cream Nourishing Moisturiser","Super Light Gel Moisturiser"], sizes:['20g','35g','50g','100g','80ml','100ml'] },
  { brand:'Mamaearth', priceRange:[149,899],  types:['Ubtan Face Wash','Vitamin C Face Wash','Rice Water Shampoo','Onion Hair Oil','Argan Hair Mask','Onion Conditioner','Skin Illuminate Face Serum','Vitamin C Day Cream','Ubtan Scrub'], sizes:['100ml','200ml','250ml','300ml'] },
  { brand:'Biotique',  priceRange:[89,699],   types:['Bio Cucumber Toner','Bio Almond Oil Body Lotion','Bio White Advanced Fairness Treatment','Bio Wheat Germ Nourishing Body Lotion','Morning Nectar Flawless Skin Moisturiser','Bio Bhringraj Therapeutic Oil'], sizes:['120ml','200ml','50ml','500ml','100ml'] },
];

// ===== SKIN CARE =====
const SKINCARE = [
  { brand:'Minimalist', priceRange:[199,999],  types:['2% Salicylic Acid Serum','10% Niacinamide Face Serum','Vitamin C 10% Face Serum','Retinol 0.3% Night Serum','HA + PGA 2% Face Serum','AHA 25% + BHA 2% Exfoliant','SPF 50 Sunscreen','Alpha Arbutin 2% Serum'], sizes:['30ml','50ml'] },
  { brand:'Cetaphil',   priceRange:[199,1299], types:['Gentle Skin Cleanser','Moisturising Lotion','Moisturising Cream','Oily Skin Cleanser','PRO Oil Removing Foam Wash','Bright Healthy Radiance Face Wash','Daily Advance Ultra Hydrating Lotion'], sizes:['125ml','250ml','500ml','125g','250g'] },
  { brand:'Plum',       priceRange:[199,999],  types:['Green Tea Pore Cleansing Face Wash','E-Luminence Deep Moisturising Lotion','Bright Years Cell Renewal Serum','1% Retinol Face Serum','Hello Aloe Caring Face Wash','Dual-Action Sensitive Skin Moisturiser','Chamomile & White Tea Night Gel'], sizes:['75ml','100ml','50ml','75g'] },
  { brand:'Dot & Key',  priceRange:[249,1299], types:['Watermelon Hydrating Serum','Retinol + Ceramide Sleeping Mask','Cica Calming Sunscreen SPF 50','Vitamin C + E Supercharge Face Serum','Barrier Repair Cream','Pore Minimising Gel Sunscreen'], sizes:['30ml','60ml','75ml'] },
  { brand:'Garnier',    priceRange:[99,599],   types:['Micellar Cleansing Water','Bright Complete Vitamin C Serum Face Wash','Light Complete Vitamin C Yogurt Skin Care','Bright Complete Serum Cream SPF 40','Skin Naturals Light Complete CC Cream','Pure Active Neem Face Wash'], sizes:['100ml','200ml','400ml','50ml','50g'] },
  { brand:'Himalaya',   priceRange:[79,499],   types:['Purifying Neem Face Wash','Moisturising Aloe Vera Face Wash','Oil-free Radiance Gel Moisturiser','Herbals Protective Sunscreen Lotion','Under Eye Cream','Revitalizing Night Cream'], sizes:['50ml','100ml','200ml','150ml'] },
];

// ===== HOME APPLIANCES =====
const APPLIANCES = [
  { brand:'LG',       priceRange:[12999,89999], types:['1.5 Ton Dual Inverter AC','1.0 Ton Inverter AC','7kg Front Load Washing Machine','8kg Top Load Washing Machine','260L Frost Free Refrigerator','500L French Door Refrigerator','32L Convection Microwave','25L Solo Microwave'], colors:['White','Silver','Black','Dark Graphite'] },
  { brand:'Samsung',  priceRange:[14999,79999], types:['1.5 Ton Wind-Free AC','8kg Front Load Washing Machine','10kg Front Load Washing Machine','324L Double Door Refrigerator','564L Side-by-Side Refrigerator','28L Convection Microwave','23L Slim Fry Microwave'], colors:['White','Silver','Midnight Black','Camellia Blue'] },
  { brand:'Whirlpool',priceRange:[9999,69999],  types:['1.5 Ton Inverter AC','6.5kg Semi-Auto Washing Machine','7kg Fully Auto Top Load','215L Single Door Refrigerator','340L Frost Free Refrigerator','30L Convection Microwave','20L Solo Microwave'], colors:['White','Grey','Arctic Bloom'] },
  { brand:'Philips',  priceRange:[4999,39999],  types:['Air Fryer XXL 7L','Air Fryer HD9200','Dry Iron GC1905','Steam Iron GC2990','Vacuum Cleaner FC8295','Hand Mixer HR3745','Food Processor HR7778','Induction Cooktop','Mixer Grinder HL7756'], colors:['Black','White','Silver','Red'] },
  { brand:'Bosch',    priceRange:[9999,79999],  types:['8kg Front Load Washing Machine Serie 6','Serie 6 Dishwasher 12 Place','Refrigerator CSB255S15I','Heat Pump Dryer WTW85561IN','Induction Hob PID631BB1E','Oven HBG5375S0I'], colors:['Inox Silver','White'] },
  { brand:'Voltas',   priceRange:[9999,49999],  types:['1.5 Ton 5 Star Inverter Split AC','1.0 Ton 3 Star Inverter Split AC','1.5 Ton Window AC','1.5 Ton Portable AC','185L Single Door Refrigerator','252L Double Door Refrigerator'], colors:['White'] },
];

// ===== KITCHEN =====
const KITCHEN = [
  { brand:'Prestige',   priceRange:[349,9999],  types:['3L Aluminium Pressure Cooker','5L Pressure Cooker','Hard Anodised Kadai 28cm','Omega Deluxe Granite Non-Stick Tawa','Alpha Plus Hard Anodised Fry Pan','Svachh Spillage Control Pressure Cooker','Mini Mixer Grinder 400W','Popular Induction Base Non-Stick Cookware Set'], colors:['Black','Metallic Grey','Red','Silver'] },
  { brand:'Pigeon',     priceRange:[249,5999],  types:['Favourite Aluminium Non-Stick Kadai','Healthifry Digital Air Fryer 4.2L','Polished Aluminium Pressure Cooker 3L','Induction Suitable Non-Stick Dosa Tawa','Stovekraft Non-Stick Fry Pan','Multifunction Hand Blender 250W'], colors:['Black','Red','Blue'] },
  { brand:'Wonderchef', priceRange:[499,12999], types:['Regalia 5L Pressure Cooker','Nutri Pot 3L','Chef Studio 11 Piece Cookware Set','Pro Body Builder Blender Juicer','Air Fryer Oven 25L','Royal Velvet 5 Piece Non-Stick Cookware'], colors:['Black','Red','Ivory','Blue'] },
  { brand:'Milton',     priceRange:[149,2999],  types:['Thermosteel Flip Lid Flask 1000ml','Thermosteel Duo Deluxe 1000ml','Lunch Box Set 2 Containers','Steel Tiffin 3 Tier','Coolteen Insulated Water Jug 5L','Elate Stainless Steel Bottle 1L'], colors:['Red','Blue','Black','Grey','Green','Orange','White'] },
  { brand:'Hawkins',    priceRange:[699,5999],  types:['Classic Aluminium Pressure Cooker 3L','Futura Pressure Cooker 3L','Futura Stainless Steel Frying Pan','Miss Mary Aluminum Cookware Set','Ceramic Coated Pressure Pan 5L'], colors:['Metallic Aluminum','Black','Silver'] },
  { brand:'Borosil',    priceRange:[199,2999],  types:['Classic Microwaveable Glass Dish','Storewell Container Set','Vision Mixer Jar Borosilicate Glass','Classic Serving Bowl Set','Crystal Series Storage Jar Set','Neo Borosilicate Glass Opalware Set'], colors:['Transparent','White','Green','Blue'] },
];

// ===== GROCERY =====
const GROCERY = [
  { brand:'Tata',        priceRange:[49,599],   types:['Tea Premium 500g','Salt 1kg','Sampann Chana Dal 1kg','Sampann Toor Dal 500g','Nutrikorner Oats 1kg','Jorekdham Muri 200g','Coffee Premium 100g','Saffola Gold Oil 1L'], colors:['Standard'] },
  { brand:'Aashirvaad',  priceRange:[79,799],   types:['Whole Wheat Atta 5kg','Multigrain Atta 5kg','Select MP Wheat Atta 5kg','Shudh Besan 500g','Rice 5kg','Spices Haldi 200g','Masala Chilli Powder'], colors:['Standard'] },
  { brand:'Fortune',     priceRange:[99,899],   types:['Sunlite Refined Sunflower Oil 5L','Refined Soyabean Oil 1L','Kachi Ghani Mustard Oil 1L','Rozana Chakki Fresh Atta 5kg','Chakki Fresh Atta 10kg'], colors:['Standard'] },
  { brand:'Nestle',      priceRange:[35,599],   types:['Maggi 2-Minute Noodles 12 Pack','Munch Chocolate Bar Box','KitKat Pack of 5','Nescafe Classic 100g','Milkmaid Sweetened Condensed Milk 400g','Everyday Whitener 200g','Nestea Instant Tea 250g'], colors:['Standard'] },
  { brand:'MDH',         priceRange:[39,299],   types:['Chunky Chat Masala 100g','Deggi Mirch 100g','Sabut Zeera 100g','Garam Masala 100g','Tandoori Chicken Masala 100g','Rajah Mixed Spice','Pav Bhaji Masala 100g'], colors:['Standard'] },
  { brand:'Patanjali',   priceRange:[29,499],   types:['Cow Ghee 500ml','Honey 500g','Amla Juice 1L','Ashwagandha Churna 100g','Desi Khand 1kg','Aloe Vera Juice 1L','Giloy Juice 1L'], colors:['Standard'] },
];

// ===== SPORTS =====
const SPORTS = [
  { brand:'Nivia',     priceRange:[299,5999],  types:['Dominator Football','Pro Grip Volleyball','Carbine Basketball Size 5','Professional Cricket Bat','Champion Hockey Stick','Speed Skipping Rope','Carbonite Badminton Racket','Attraction Synthetic Shuttle'], colors:['Black/Yellow','Red/Black','Orange/Black','Blue/White','Green','Standard'] },
  { brand:'Cosco',     priceRange:[199,2999],  types:['Synthetic Football','International Volleyball','Jump Rope','Table Tennis Set','Cricket Kit Combo','Badminton Set','Boxing Gloves 16 oz','Yoga Mat 6mm'], colors:['Standard','Black','Blue','Red','Yellow'] },
  { brand:'Decathlon', priceRange:[299,9999],  types:['Essential Running Shoes','Trail Running Shoes','Football Jersey Set','Basketball Shorts','Gym Gloves Compact','Fitness Mat 140cm','Weight Training Gloves','Cardio Training Jump Rope'], colors:['Black','Blue','Red','Yellow','Green','Orange','White'] },
  { brand:'Nike Sport', priceRange:[799,4999], types:["Men's Dri-FIT Training T-Shirt","Men's Flex Training Shorts","Women's Pro Training Leggings","Training Gloves","Resistance Band Set","Gym Bag","Running Belt Waist Pack"], colors:['Black/White','White/Black','Navy','Red','Green','Grey Marl'] },
  { brand:'Adidas Sport',priceRange:[699,3999],types:["Men's Techfit Compression Tee","Men's Own the Run Shorts","Women's Training Leggings","Duffel Bag 31L","Training Gloves","Football Training Socks","Running Belt"], colors:['Black','White','Team Navy Blue','Better Scarlet','Hi-Res Yellow'] },
  { brand:'IronEdge',  priceRange:[999,12999], types:['Adjustable Dumbbell 10kg','Cast Iron Dumbbell Set 20kg','Olympic Barbell 15kg','Pull Up Bar Door Frame','Resistance Band Set 5 Levels','Kettlebell 8kg','Foam Roller 45cm','Weight Plates 20kg Pair'], colors:['Black','Silver','Gunmetal'] },
];

// ===== BOOKS =====
const BOOKS = [
  { brand:'Penguin',      priceRange:[149,999],  types:["Atomic Habits – James Clear","The Alchemist – Paulo Coelho","Sapiens – Yuval Noah Harari","Thinking Fast and Slow","The Power of Now","Rich Dad Poor Dad","1984 – George Orwell","Animal Farm","To Kill a Mockingbird","Pride and Prejudice"] },
  { brand:'HarperCollins',priceRange:[199,1299], types:["The Great Gatsby","The 7 Habits of Highly Effective People","Zero to One – Peter Thiel","Good to Great – Jim Collins","Blink – Malcolm Gladwell","Outliers – Malcolm Gladwell","The Psychology of Money","Ikigai","Deep Work – Cal Newport","The Subtle Art of Not Giving a F*ck"] },
  { brand:'Scholastic',   priceRange:[149,899],  types:["Harry Potter and the Sorcerer's Stone","Harry Potter and the Chamber of Secrets","Harry Potter and the Prisoner of Azkaban","Harry Potter Box Set","The Diary of a Wimpy Kid","Dog Man Series Collection","Captain Underpants Collection"] },
  { brand:'Hachette',     priceRange:[249,1499], types:["The Midnight Library","A Little Life","Normal People","The Road – Cormac McCarthy","The God of Small Things","White Tiger – Aravind Adiga","The Palace of Illusions","The Shadow of the Wind"] },
  { brand:'Vintage India',priceRange:[199,799],  types:["A Suitable Boy","The Guide – R.K. Narayan","Malgudi Days","The God of Small Things","Ramayana – Valmiki","Mahabharata – C Rajagopalachari","Ignited Minds – APJ Abdul Kalam","Wings of Fire – APJ Abdul Kalam"] },
];

// ===== TOYS =====
const TOYS = [
  { brand:'LEGO',       priceRange:[999,14999], types:['LEGO City Police Station 60316','LEGO Technic Bugatti Chiron','LEGO Star Wars Millennium Falcon','LEGO Harry Potter Hogwarts Castle','LEGO Architecture Paris','LEGO Creator 3in1 Tropical Parrot','LEGO Friends Heartlake City Organic Café','LEGO Classic Brick Box 10698'] },
  { brand:'Hot Wheels', priceRange:[99,2999],   types:['Basic Car Pack 5 Cars','Track Builder Set','Ultimate Garage','Loop Launcher Set','Race Case 48 Cars','City Ultimate Police Pursuit','Monster Trucks Giant Wreckage','Super Ultimate Garage'] },
  { brand:'Barbie',     priceRange:[499,4999],  types:["Barbie Fashionistas Doll","Barbie DreamHouse Playset","Barbie Color Reveal Doll","Barbie Malibu House","Barbie Chef Doll & Kitchen","Barbie Ken Fashionistas Doll","Barbie Skipper Babysitters Inc","Barbie Eco-Leadership Team"] },
  { brand:'Funskool',   priceRange:[199,2999],  types:['Monopoly Classic','Scrabble Classic','Pictionary Game','Jenga Classic','Snakes & Ladders XL','Carrom Board Medium','Business Board Game','Chess Set Premium'] },
  { brand:'Fisher-Price',priceRange:[299,3999], types:["Baby's First Blocks","Laugh & Learn Smart Stages Chair","Brilliant Basics Rock-a-Stack","Little People Farm Set","Busy Activity Cube","Infant-to-Toddler Rocker","3-in-1 Sit-to-Stand Activity Center"] },
  { brand:'Nerf',       priceRange:[499,4999],  types:['Elite 2.0 Commander RD-6','Fortnite AR-L Dart Blaster','Mega XL Big Rig','Elite Echo CS-10 Blaster','Hyper Rush-40 Ball Blaster','Rival Roundhouse XX-1500','Alpha Strike Fang QS-4'] },
];

// ===== FURNITURE =====
const FURNITURE = [
  { brand:'IKEA',           priceRange:[999,39999],  types:['KALLAX Shelving Unit','BILLY Bookcase','EKTORP 2-Seat Sofa','HEMNES Bed Frame','LACK Side Table','MALM Chest of 4 Drawers','POÄNG Armchair','ALEX Desk Drawer Unit','BESTA Storage Combination'], colors:['White','Black-Brown','Light Grey','Birch Veneer','Dark Grey','Red','Light Blue','Beige'] },
  { brand:'Godrej Interio', priceRange:[4999,69999], types:['Slimline 1.8m Wardrobe','Forte Study Table','Antila Office Chair','Slimline Book Shelf 4 Shelves','Serta Mattress 6 inch King','Interio Queen Bed Frame','Regal Dining Table 4 Seater','Aqua Sofa 3 Seater'], colors:['Oak','Walnut','White','Sand Beige','Teak','Wenge'] },
  { brand:'Urban Ladder',   priceRange:[2999,49999], types:['Wudhart Solid Wood Bookshelf','Woodstock Solid Wood Dining Chair','Reva Sofa Cum Bed','Masaya Bookshelf','Lagom Solid Wood Study Table','Holt Solid Wood Side Table','Patio Outdoor Chair','Orson Sectional Sofa'], colors:['Natural Sheesham','Dark Walnut','Teak','Grey','Beige','White'] },
  { brand:'HomeTown',       priceRange:[1999,34999], types:['Saturn Solid Wood Bookcase','Arista Sofabed','Diza Modular Wardrobe','Gemini Study Table','Acer Side Table','Porto Dining Set 4 Seater','Jazz L Shaped Sofa','Mars Coffee Table'], colors:['Wenge','Dark Walnut','White','Oak','Grey','Natural Brown'] },
  { brand:'Wakefit',        priceRange:[3999,29999], types:['Orthopedic Memory Foam Mattress King','Dual Comfort Mattress Queen','Solitude Wooden Bed King','Height-Adjustable Study Table','Ergonomic Office Chair Pro','3 Seater Sofa','Compact Bunk Bed','Storage Ottoman'], colors:['Grey Fabric','Blue Fabric','Beige Fabric','Dark Walnut Wood','Natural Wood','White'] },
];

// ===== ACCESSORIES =====
const ACCESSORIES = [
  { brand:'Ray-Ban',    priceRange:[5490,13490], types:['Aviator Classic RB3025','Wayfarer Classic RB2140','Clubmaster Classic RB3016','Justin Classic RB4165','Erika RB4171','Chris RB4187','New Wayfarer RB2132'], colors:['Gold/Crystal Green','Polished Black/Crystal','Gold/Crystal Brown','Havana/Brown Gradient','Matte Black/Grey Gradient','Rubber Blue/Blue Gradient'] },
  { brand:'Fastrack',   priceRange:[599,3499],   types:["Men's Analog Watch","Women's Analog Watch","Unisex Digital Watch","Men's Chronograph Watch","Women's Bracelet Watch","Men's Aviator Watch","Unisex Sports Watch"], colors:['Black Dial','White Dial','Blue Dial','Silver','Gunmetal','Rose Gold','Green','Red'] },
  { brand:'Titan',      priceRange:[2499,14999], types:["Men's Regalia Analog Watch","Women's Raga Collection Watch","Men's Edge Ultra-Slim Watch","Women's Purple Collection Watch","Men's Octane Chronograph","Men's Automatic Watch","Women's Celestial Watch"], colors:['Black/Silver','Silver/White','Matte Black','Gold','Rose Gold','Blue Dial','Dark Brown'] },
  { brand:'Fossil',     priceRange:[3999,14999], types:["Men's Neutra Chronograph","Women's Stella Stainless Steel Watch","Men's Grant Automatic Watch","Women's Carlie Mini Watch","Men's Machine Watch","Unisex FB-01 Solar Watch"], colors:['Brown Leather','Black/Rose Gold','Silver Stainless','Gunmetal/Brown','Smoke/Gold','Navy/Silver'] },
  { brand:'Casio',      priceRange:[995,12999],  types:['G-Shock GA-2100','G-Shock DW-5600','G-Shock GA-B2100','Casio Vintage A168','Casio Vintage A158','Casio Edifice EFR-303','Casio PRW-3500 ProTrek','Casio EFV-560'], colors:['Black','White','Caramel','Olive Camouflage','Rose Gold','Red','Blue','Silver'] },
  { brand:'Noise',      priceRange:[299,2499],   types:["Men's Mesh Strap Watch","Women's Pastel Watch","Unisex Minimalist Watch","Men's Sports Digital Watch","Women's Bracelet Watch"], colors:['Black','Rose Gold','Silver','Blue','White','Gold'] },
];

// ─────────────────────────────────────────────
// BUILD ALL CATEGORIES
// ─────────────────────────────────────────────
const ALL_PRODUCTS = [
  ...buildProducts(MOBILES,       'Mobiles',          'Mobiles',          POOLS.mobiles,     (t,c) => `The ${c} variant of ${t} delivers exceptional performance with a premium build. Designed for power users who demand the best.`),
  ...buildProducts(LAPTOPS,       'Laptops',          'Laptops',          POOLS.laptops,     (t,c,s) => `${t} ${s} in ${c} — engineered for peak productivity with a stunning display and all-day battery life.`),
  ...buildProducts(SMARTWATCHES,  'Smart Watches',    'Smart Watches',    POOLS.watches,     (t,c,s) => `${t} ${s} in ${c} — track fitness, receive notifications, and stay connected all day on a single charge.`),
  ...buildProducts(HEADPHONES,    'Headphones',       'Headphones',       POOLS.headphones,  (t,c) => `${t} in ${c} — experience rich, immersive audio with active noise cancellation and premium comfort.`),
  ...buildProducts(ELECTRONICS,   'Electronics',      'Electronics',      POOLS.electronics, (t,c) => `${t} — crystal-clear picture quality and smart connectivity for the ultimate home entertainment experience.`),
  ...buildProducts(MENS_CLOTHING, "Men's Clothing",   "Men's Clothing",   POOLS.mens,        (t,c) => `${t} in ${c} — crafted from premium fabrics for all-day comfort, style, and confidence.`),
  ...buildProducts(WOMENS_CLOTHING,"Women's Clothing","Women's Clothing",  POOLS.womens,      (t,c) => `${t} in ${c} — effortlessly stylish and comfortable for every occasion.`),
  ...buildProducts(KIDS_WEAR,     'Kids Wear',        'Kids Wear',        POOLS.kids,        (t,c) => `${t} in ${c} — soft, durable, and perfectly sized for active kids. Easy care fabric.`),
  ...buildProducts(SAREES,        'Sarees',           'Sarees',           POOLS.sarees,      (t,c) => `${t} in ${c} — elegantly woven with premium quality fabric and intricate border work. Perfect for festive occasions.`),
  ...buildProducts(KURTAS,        'Kurtas',           'Kurtas',           POOLS.kurtas,      (t,c) => `${t} in ${c} — a timeless ethnic design with rich fabric and detailed craftsmanship.`),
  ...buildProducts(SHOES,         'Shoes',            'Shoes',            POOLS.shoes,       (t,c) => `${t} in ${c} — superior cushioning, iconic style, and durability built for everyday wear.`),
  ...buildProducts(BAGS,          'Bags',             'Bags',             POOLS.bags,        (t,c) => `${t} in ${c} — spacious, durable, and stylishly designed for work, travel, or daily use.`),
  ...buildProducts(COSMETICS,     'Cosmetics',        'Cosmetics',        POOLS.cosmetics,   (t,c) => `${t} in shade ${c} — long-lasting formula with rich pigment for a flawless, confident finish.`),
  ...buildProducts(BEAUTY,        'Beauty',           'Beauty',           POOLS.beauty,      (t,c,s) => `${t} (${s}) — enriched with natural ingredients for deep nourishment and visible results.`),
  ...buildProducts(SKINCARE,      'Skin Care',        'Skin Care',        POOLS.skincare,    (t,c,s) => `${t} (${s}) — dermatologist-tested formula for effective, gentle skincare.`),
  ...buildProducts(APPLIANCES,    'Home Appliances',  'Home Appliances',  POOLS.appliances,  (t,c) => `${t} in ${c} — energy efficient, feature-packed, and built to last.`),
  ...buildProducts(KITCHEN,       'Kitchen',          'Kitchen',          POOLS.kitchen,     (t,c) => `${t} in ${c} — durable, heat-resistant, and designed for effortless cooking.`),
  ...buildProducts(GROCERY,       'Grocery',          'Grocery',          POOLS.grocery,     (t) => `${t} — freshly packed, high quality, and sourced from trusted farms. A staple in every household.`),
  ...buildProducts(SPORTS,        'Sports',           'Sports',           POOLS.sports,      (t,c) => `${t} in ${c} — professional-grade equipment for peak performance and long-lasting durability.`),
  ...buildProducts(BOOKS,         'Books',            'Books',            POOLS.books,       (t) => `${t} — a bestselling title loved by readers worldwide. A must-have addition to your library.`),
  ...buildProducts(TOYS,          'Toys',             'Toys',             POOLS.toys,        (t) => `${t} — engaging, safe, and fun. Sparks creativity and imagination in children of all ages.`),
  ...buildProducts(FURNITURE,     'Furniture',        'Furniture',        POOLS.furniture,   (t,c) => `${t} in ${c} — premium craftsmanship with a modern aesthetic that elevates every room.`),
  ...buildProducts(ACCESSORIES,   'Accessories',      'Accessories',      POOLS.accessories, (t,c) => `${t} in ${c} — a timeless accessory that effortlessly completes every look.`),
];

console.log(`Generated ${ALL_PRODUCTS.length} unique products across ${new Set(ALL_PRODUCTS.map(p => p.category)).size} categories.`);

// Validate: check for truly duplicate names
const nameSet = new Set();
let dupCount = 0;
ALL_PRODUCTS.forEach(p => {
  if (nameSet.has(p.name)) dupCount++;
  else nameSet.add(p.name);
});
console.log(`Duplicate names found: ${dupCount} (should be 0 or very low).`);

// Write output
const outPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
fs.writeFileSync(outPath, JSON.stringify(ALL_PRODUCTS, null, 2));
console.log(`Written to: ${outPath}`);
