// Souls-like games with physical releases on PlayStation platforms
// Data source: PriceCharting.com and retail availability
// Prices are approximate and may vary by region and condition
// Cover images from IGDB.com

const gamesData = [
    {
        "id": "demons-souls-ps3",
        "name": "Demon's Souls",
        "platforms": [
            "PS3"
        ],
        "developer": "FromSoftware",
        "year": 2009,
        "price": 19.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w7m.jpg"
    },
    {
        "id": "demons-souls-remake",
        "name": "Demon's Souls (Remake)",
        "platforms": [
            "PS5"
        ],
        "developer": "Bluepoint Games / FromSoftware",
        "year": 2020,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2r4u.jpg"
    },
    {
        "id": "dark-souls-ps3",
        "name": "Dark Souls",
        "platforms": [
            "PS3"
        ],
        "developer": "FromSoftware",
        "year": 2011,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg"
    },
    {
        "id": "dark-souls-remastered",
        "name": "Dark Souls Remastered",
        "platforms": [
            "PS4"
        ],
        "developer": "FromSoftware",
        "year": 2018,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcb.jpg"
    },
    {
        "id": "dark-souls-2-ps3",
        "name": "Dark Souls II",
        "platforms": [
            "PS3"
        ],
        "developer": "FromSoftware",
        "year": 2014,
        "price": 19.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w85.jpg"
    },
    {
        "id": "dark-souls-2-scholar-ps4",
        "name": "Dark Souls II: Scholar of the First Sin",
        "platforms": [
            "PS4"
        ],
        "developer": "FromSoftware",
        "year": 2015,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5qfj.jpg"
    },
    {
        "id": "dark-souls-3-ps4",
        "name": "Dark Souls III",
        "platforms": [
            "PS4"
        ],
        "developer": "FromSoftware",
        "year": 2016,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s73.jpg"
    },
    {
        "id": "bloodborne-ps4",
        "name": "Bloodborne",
        "platforms": [
            "PS4"
        ],
        "developer": "FromSoftware",
        "year": 2015,
        "price": 19.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w7i.jpg"
    },
    {
        "id": "bloodborne-goty-ps4",
        "name": "Bloodborne: Game of the Year Edition",
        "platforms": [
            "PS4"
        ],
        "developer": "FromSoftware",
        "year": 2015,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2f97.jpg"
    },
    {
        "id": "sekiro-ps4",
        "name": "Sekiro: Shadows Die Twice",
        "platforms": [
            "PS4"
        ],
        "developer": "FromSoftware",
        "year": 2019,
        "price": 39.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wwy.jpg"
    },
    {
        "id": "elden-ring-ps4",
        "name": "Elden Ring",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "FromSoftware",
        "year": 2022,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg"
    },
    {
        "id": "elden-ring-deluxe-ps4",
        "name": "Elden Ring: Deluxe Edition",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "FromSoftware",
        "year": 2022,
        "price": 69.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg"
    },
    {
        "id": "nioh-ps4",
        "name": "Nioh",
        "platforms": [
            "PS4"
        ],
        "developer": "Team Ninja",
        "year": 2017,
        "price": 19.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg"
    },
    {
        "id": "nioh-2-ps4",
        "name": "Nioh 2",
        "platforms": [
            "PS4"
        ],
        "developer": "Team Ninja",
        "year": 2020,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r73.jpg"
    },
    {
        "id": "nioh-collection-ps5",
        "name": "The Nioh Collection",
        "platforms": [
            "PS5"
        ],
        "developer": "Team Ninja",
        "year": 2021,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co36t5.jpg"
    },
    {
        "id": "lords-fallen-ps4",
        "name": "Lords of the Fallen",
        "platforms": [
            "PS4"
        ],
        "developer": "Deck13 Interactive",
        "year": 2014,
        "price": 14.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w7s.jpg"
    },
    {
        "id": "lords-fallen-2023-ps5",
        "name": "Lords of the Fallen (2023)",
        "platforms": [
            "PS5"
        ],
        "developer": "Hexworks",
        "year": 2023,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co6pyl.jpg"
    },
    {
        "id": "mortal-shell-ps4",
        "name": "Mortal Shell",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Cold Symmetry",
        "year": 2020,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2gyg.jpg"
    },
    {
        "id": "mortal-shell-enhanced-ps5",
        "name": "Mortal Shell: Enhanced Edition",
        "platforms": [
            "PS5"
        ],
        "developer": "Cold Symmetry",
        "year": 2021,
        "price": 34.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3aw9.jpg"
    },
    {
        "id": "code-vein-ps4",
        "name": "Code Vein",
        "platforms": [
            "PS4"
        ],
        "developer": "Bandai Namco",
        "year": 2019,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1iz8.jpg"
    },
    {
        "id": "the-surge-ps4",
        "name": "The Surge",
        "platforms": [
            "PS4"
        ],
        "developer": "Deck13 Interactive",
        "year": 2017,
        "price": 19.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l7x.jpg"
    },
    {
        "id": "the-surge-2-ps4",
        "name": "The Surge 2",
        "platforms": [
            "PS4"
        ],
        "developer": "Deck13 Interactive",
        "year": 2019,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1ld0.jpg"
    },
    {
        "id": "remnant-ps4",
        "name": "Remnant: From the Ashes",
        "platforms": [
            "PS4"
        ],
        "developer": "Gunfire Games",
        "year": 2019,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1lnm.jpg"
    },
    {
        "id": "remnant-2-ps5",
        "name": "Remnant II",
        "platforms": [
            "PS5"
        ],
        "developer": "Gunfire Games",
        "year": 2023,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5w3h.jpg"
    },
    {
        "id": "lies-of-p-ps4",
        "name": "Lies of P",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Neowiz",
        "year": 2023,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5w9q.jpg"
    },
    {
        "id": "thymesia-ps5",
        "name": "Thymesia",
        "platforms": [
            "PS5"
        ],
        "developer": "OverBorder Studio",
        "year": 2022,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4tf0.jpg"
    },
    {
        "id": "salt-sanctuary-ps4",
        "name": "Salt and Sanctuary",
        "platforms": [
            "PS4"
        ],
        "developer": "Ska Studios",
        "year": 2016,
        "price": 34.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3iqm.jpg"
    },
    {
        "id": "hollow-knight-ps4",
        "name": "Hollow Knight",
        "platforms": [
            "PS4"
        ],
        "developer": "Team Cherry",
        "year": 2018,
        "price": 39.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg"
    },
    {
        "id": "ashen-ps4",
        "name": "Ashen",
        "platforms": [
            "PS4"
        ],
        "developer": "A44 Games",
        "year": 2019,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1m2q.jpg"
    },
    {
        "id": "deaths-gambit-ps4",
        "name": "Death's Gambit",
        "platforms": [
            "PS4"
        ],
        "developer": "White Rabbit",
        "year": 2018,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ixk.jpg"
    },
    {
        "id": "immortal-unchained-ps4",
        "name": "Immortal: Unchained",
        "platforms": [
            "PS4"
        ],
        "developer": "Toadman Interactive",
        "year": 2018,
        "price": 19.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w6c.jpg"
    },
    {
        "id": "hellpoint-ps4",
        "name": "Hellpoint",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Cradle Games",
        "year": 2020,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ktr.jpg"
    },
    {
        "id": "steelrising-ps5",
        "name": "Steelrising",
        "platforms": [
            "PS5"
        ],
        "developer": "Spiders",
        "year": 2022,
        "price": 39.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5ojf.jpg"
    },
    {
        "id": "stranger-paradise-ps4",
        "name": "Stranger of Paradise: Final Fantasy Origin",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Team Ninja",
        "year": 2022,
        "price": 39.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4blt.jpg"
    },
    {
        "id": "wo-long-ps4",
        "name": "Wo Long: Fallen Dynasty",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Team Ninja",
        "year": 2023,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5umt.jpg"
    },
    {
        "id": "pascal-wager-ps4",
        "name": "Pascal's Wager: Definitive Edition",
        "platforms": [
            "PS4"
        ],
        "developer": "TipsWorks",
        "year": 2021,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3e8n.jpg"
    },
    {
        "id": "sinner-ps4",
        "name": "Sinner: Sacrifice for Redemption",
        "platforms": [
            "PS4"
        ],
        "developer": "Dark Star Game Studios",
        "year": 2018,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1t9g.jpg"
    },
    {
        "id": "dark-devotion-ps4",
        "name": "Dark Devotion",
        "platforms": [
            "PS4"
        ],
        "developer": "Hibernian Workshop",
        "year": 2019,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1jmj.jpg"
    },
    {
        "id": "blasphemous-ps4",
        "name": "Blasphemous",
        "platforms": [
            "PS4"
        ],
        "developer": "The Game Kitchen",
        "year": 2019,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1qzo.jpg"
    },
    {
        "id": "blasphemous-2-ps4",
        "name": "Blasphemous 2",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "The Game Kitchen",
        "year": 2023,
        "price": 39.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co6p45.jpg"
    },
    {
        "id": "deaths-door-ps4",
        "name": "Death's Door",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Acid Nerve",
        "year": 2021,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3vwz.jpg"
    },
    {
        "id": "kena-ps4",
        "name": "Kena: Bridge of Spirits",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Ember Lab",
        "year": 2021,
        "price": 39.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3gon.jpg"
    },
    {
        "id": "jedi-fallen-order-ps4",
        "name": "Star Wars Jedi: Fallen Order",
        "platforms": [
            "PS4"
        ],
        "developer": "Respawn Entertainment",
        "year": 2019,
        "price": 24.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1jf2.jpg"
    },
    {
        "id": "jedi-survivor-ps5",
        "name": "Star Wars Jedi: Survivor",
        "platforms": [
            "PS5"
        ],
        "developer": "Respawn Entertainment",
        "year": 2023,
        "price": 49.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s1j.jpg"
    },
    {
        "id": "salt-sacrifice-ps4",
        "name": "Salt and Sacrifice",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Ska Studios",
        "year": 2022,
        "price": 29.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4x08.jpg"
    },
    {
        "id": "bleak-faith-ps5",
        "name": "Bleak Faith: Forsaken",
        "platforms": [
            "PS5"
        ],
        "developer": "Archangel Studios",
        "year": 2023,
        "price": 34.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s6j.jpg"
    },
    {
        "id": "asterigos-ps4",
        "name": "Asterigos: Curse of the Stars",
        "platforms": [
            "PS4",
            "PS5"
        ],
        "developer": "Acme Gamestudio",
        "year": 2022,
        "price": 34.99,
        "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5a65.jpg"
    }
];
