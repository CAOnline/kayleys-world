
// ============== SUPABASE ==============
const SUPABASE_URL = 'https://dvszoijgydqzkxnmlxmy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TdkDtE_ZxkXb8194CD6A_Q_oUliAHBR';
let sb = null;
try{ sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }catch(e){ console.warn('supabase init failed, using local fallback'); }

// ============== STATE ==============
const state = {
  currentPage:'landing',
  time:'am',
  mood:'normal',
  products:[],
  filteredCategory:'all',
  searchQuery:'',
  editingProduct:null,
  pin:null,
  pinUnlocked:false,
  pinBuffer:'',
  todayMood:null,
  weekMoods:[],
  sleepData:{},
  journalEntries:[],
  streak:0,
  scriptureFilter:'all',
  scriptureIndex:null,
  reflections:{},
  wellTab:'checkin',
  highlights:[],
};

// ============== DEFAULT INVENTORY (Kayley's full collection) ==============
const DEFAULT_PRODUCTS = [
  // Cleansers
  {name:"Garnier Micellar Cleansing Water (Pink Cap)",cat:"cleansers",notes:"Daily makeup remove — cotton pad 10-15s, never foam bottle"},
  {name:"Nuage Micellar Cleansing Water — Vitamin C",cat:"cleansers",notes:"AM only — light makeup or no-makeup mornings, cotton pad 10-15s"},
  {name:"Micellar Cleansing Rose Water",cat:"cleansers",notes:"Refresh / very light makeup — toner-style use"},
  {name:"NIP+FAB Salicylic Fix Gel Cleanser",cat:"cleansers",notes:"2-3×/week — oily/congested days"},
  {name:"Supreme Skin CBD Cleansing Serum",cat:"cleansers",notes:"1-2×/week MAX — menthol can irritate"},
  {name:"Kanzen Hypochlorous Cleansing Spray",cat:"cleansers",store:"Lookfantastic",notes:"After cleanse, before toner. Also for spots & tools"},
  {name:"CeraVe Foaming Cleanser (Normal-Oily, Niacinamide)",cat:"cleansers",notes:"Daily go-to once arrived",stock:"empty"},
  {name:"Elemis Pro-Collagen Hydrating Cleansing Mousse",cat:"cleansers",notes:"Gentle daily — calming, hydrating second cleanse"},
  // Toners
  {name:"Simple Soothing Facial Toner",cat:"toners"},
  {name:"Super Facialist Salicylic Acid Purifying Toner",cat:"toners"},
  {name:"The Ordinary Glycolic Acid 7% Toning Solution",cat:"toners",notes:"1×/week, calm skin only — Tue or Thu"},
  // Serums
  {name:"AOC Hyaluronic Serum (with peptides)",cat:"serums",notes:"On damp skin AM & PM"},
  {name:"The Ordinary Niacinamide 10%",cat:"serums",notes:"Not same day as Vit C"},
  {name:"Florence by Mills Vitamin C Serum",cat:"serums",notes:"AM only"},
  {name:"Maybelline Fit Me 2% Niacinamide Primer Serum",cat:"serums"},
  {name:"The Ordinary Rose Hip Seed Oil",cat:"serums",notes:"Last step PM"},
  {name:"DermaVitamins Cold-Pressed Rosehip Oil",cat:"serums"},
  {name:"Geek & Gorgeous A-Game 101 Retinol Serum",cat:"serums",notes:"Mon / Wed / Fri nights"},
  {name:"Supreme Skin CBD Retinol Serum",cat:"serums"},
  {name:"The Ordinary Salicylic Acid 2% Solution",cat:"serums"},
  {name:"Tea Tree Essential Oil",cat:"serums",notes:"Spot treatment — let dry"},
  {name:"Rosemary Essential Oil",cat:"serums",notes:"Brow growth — daily"},
  {name:"Sunkissed Vitamin C Energising Mist (with Aloe)",cat:"serums",notes:"AM only"},
  {name:"Sunkissed Hydrating Mist (HA + Vit E)",cat:"serums",notes:"AM & PM — over moisturiser"},
  // Eyes
  {name:"Anovia Rejuvenating Caffeine Eye Cream",cat:"eyes"},
  {name:"The Body Shop Vitamin E Eye Cream",cat:"eyes"},
  {name:"Caffeine Eye Serum 360° Massage Ball (HA)",cat:"eyes",store:"Amazon",price:"£9.99",notes:"Roll outward from inner corner"},
  {name:"Garnier Vitamin C Brightening Eye Mask",cat:"eyes"},
  {name:"Garnier Moisture Bomb Cooling Eye Mask",cat:"eyes"},
  {name:"Face Facts Wrinkle Care Eye Patches",cat:"eyes"},
  {name:"Eye Massage Roller Serum",cat:"eyes"},
  {name:"Skin Technique Vitamin C Eye Patches",cat:"eyes"},
  {name:"Champneys Energising Eye Gel Patches",cat:"eyes"},
  {name:"Medi Grade Cooling Gel Face Mask Set",cat:"eyes",notes:"Standalone depuff — AM or PM, fridge it"},
  // Lips
  {name:"Vaseline Lip Therapy — Original",cat:"lips"},
  {name:"Vaseline Lip Therapy — Aloe",cat:"lips"},
  {name:"Vaseline Lip Therapy — Rosy Lips",cat:"lips"},
  {name:"Carmex Lip Balm",cat:"lips"},
  {name:"Dr. Organic Rose Otto Lip Serum",cat:"lips"},
  {name:"Beeswax Miracle Balm",cat:"lips"},
  {name:"Aloe Vera 99% Lip Gel",cat:"lips"},
  {name:"Aloe Vera 99% Lip Gel Mini ×2",cat:"lips"},
  {name:"W7 Gloss Away — Cherry",cat:"lips"},
  {name:"W7 Gloss Away — Vanilla",cat:"lips"},
  {name:"Daise Peptide Lip Butter — Cake Pop",cat:"lips"},
  {name:"Daise Peptide Lip Butter — Sugar Bear",cat:"lips"},
  {name:"Daise Peptide Lip Butter — Hot Mocha",cat:"lips"},
  {name:"Daise Peptide Lip Butter — Very Vanilla",cat:"lips"},
  {name:"Daise Lip Balm — Juicy Pomegranate",cat:"lips"},
  {name:"Cherry Sweet Sugar Lip Scrub",cat:"lips",notes:"Standalone — before or well after face routine"},
  {name:"Strawberry Sweet Sugar Lip Scrub",cat:"lips",notes:"Standalone — before or well after face routine"},
  {name:"Cherry Swirl Overnight Lip Mask",cat:"lips"},
  {name:"Bubblegum Swirl Overnight Lip Mask",cat:"lips"},
  {name:"Watermelon Swirl Overnight Lip Mask",cat:"lips"},
  {name:"Strawberry Lip Mask",cat:"lips"},
  {name:"Propolis Lip Mask",cat:"lips"},
  {name:"Collagen Lip Mask",cat:"lips"},
  {name:"Lip Gloss Mask (clear gel)",cat:"lips"},
  // Moisturisers
  {name:"Nuage Ceramide Daily Moisturiser",cat:"moisturisers"},
  {name:"E45 Daily Care Hydrating Lotion",cat:"moisturisers"},
  {name:"Neutrogena Clear & Defend Moisturiser (0.5% SA)",cat:"moisturisers",notes:"Breakout days"},
  {name:"Aloe Vera Gel — Slow & Day",cat:"moisturisers"},
  {name:"PS… Facial Moisturiser (Basic)",cat:"moisturisers"},
  {name:"Botanics Gel Moisturiser",cat:"moisturisers",stock:"low"},
  {name:"Innisfree Green Tea Ceramide Milk",cat:"moisturisers",notes:"Lightweight hydration — green tea + ceramides, great daily"},
  {name:"Cetaphil Moisturising Lotion",cat:"moisturisers",notes:"Gentle, non-comedogenic — sensitive/reactive days"},
  // Sunscreen
  {name:"Bondi Sands Face SPF 50+",cat:"sunscreen",notes:"Daily — even WFH, even cloudy"},
  {name:"Rodial Bee Venom SPF 30",cat:"sunscreen"},
  // Masks
  {name:"Skin Techniques Charcoal Bubble Sheet Mask",cat:"masks"},
  {name:"Skin Techniques Charcoal Clay Mask ×2",cat:"masks"},
  {name:"PS… Purifying Charcoal Peel-Off Mask",cat:"masks"},
  {name:"PS… Mattifying Priming Peel-Off Mask",cat:"masks"},
  {name:"Amazonian White Clay Deep Cleansing Mask",cat:"masks"},
  {name:"Skin Techniques Rose Clay Mask",cat:"masks"},
  {name:"Skin Techniques Algae Clay Mask",cat:"masks"},
  {name:"BeautyPro Bakuchiol Sheet Mask",cat:"masks",store:"Lookfantastic",notes:"Single use — fridge it. NOT on retinol nights"},
  {name:"Champneys Energising Face Sheet Mask",cat:"masks"},
  {name:"PS… Cucumber Infused Sheet Mask",cat:"masks"},
  {name:"PS… Pomegranate Infused Peel-Off Mask",cat:"masks"},
  {name:"PS… Vitamin C & Collagen Sheet Mask",cat:"masks"},
  {name:"Garnier SkinActive Vitamin C Brightening Sheet Mask",cat:"masks"},
  {name:"Skin Technique Hydrogel Eye Mask",cat:"masks"},
  {name:"Hyaluron Expert Brightening Tissue Mask",cat:"masks"},
  {name:"Peel-Off Nose Strips — Bulk Pack",cat:"masks"},
  {name:"Reusable Silicone Sheet Mask Cover",cat:"masks"},
  // Tools
  {name:"LED Light Therapy Face Mask",cat:"tools",notes:"After serums, before moisturiser. Blue=acne, Red=aging"},
  {name:"K-Skin Facial Steamer",cat:"tools"},
  {name:"Ultrasonic Skin Scrubber/Spatula",cat:"tools"},
  {name:"Sonic Facial Cleansing Brush — Brush Head",cat:"tools",notes:"Deep cleanse, oily days, 2-3×/week"},
  {name:"Sonic Brush — Silicone Head",cat:"tools",notes:"Gentle daily, sensitive/normal"},
  {name:"Sonic Brush — Exfoliating Head",cat:"tools",notes:"1-2×/week, glow boost"},
  {name:"Sonic Brush — Pumice Head",cat:"tools",notes:"Rough patches only, 1×/week"},
  {name:"Sonic Brush — Massage Head",cat:"tools",notes:"Circulation, any day"},
  {name:"Face/Neck LED + Vibration Massager",cat:"tools",notes:"Retinol nights: cool/green on NECK only"},
  {name:"Double-Ended Silicone Spatula",cat:"tools"},
  {name:"Silicone Lip Scrubber",cat:"tools"},
  // Body
  {name:"L'Occitane Amande Smoothing Milk Concentrate",cat:"body",store:"Lookfantastic",notes:"Body only — arms/legs/torso, on damp skin"},
  {name:"L'Occitane Amande Sublime Hand Cream",cat:"body",store:"Lookfantastic"},
  {name:"Hydrocolloid Acne Patches (360 pack)",cat:"body",notes:"After cleanse & tone, before serums"},
];

// ============== MOTIVATION POOL ==============
const MOTIVATIONS = [
  {t:"You did not wake up today to be mediocre. Get up. Glow up.", a:"Hype"},
  {t:"Babe, the universe literally rearranged itself so you'd be here today.", a:"Cosmic"},
  {t:"Your skin is healing. Your soul is healing. Trust the timing.", a:"Soft Reminder"},
  {t:"Wakey wakey buttercup — today's main character is YOU.", a:"Energy"},
  {t:"Let's fucking go. No, seriously. Get up, drink water, do the thing.", a:"NSFW Energy"},
  {t:"Be the kind of woman that when your feet hit the floor each morning, the devil says: oh shit, she's up.", a:"Hype"},
  {t:"\"Be still, and know that I am God.\"", a:"Psalm 46:10"},
  {t:"\"And after the fire a still small voice.\"", a:"1 Kings 19:12 — KJV"},
  {t:"Bro, life is testing you because you signed up for the hard mode. Pass it.", a:"Chris would say"},
  {t:"You are allowed to take up space. Loud, soft, messy, glowing — all of it.", a:"For You"},
  {t:"Hot girls hydrate. Hot girls SPF. Hot girls go the fuck to bed.", a:"NSFW Wisdom"},
  {t:"\"And the Lord will guide you continually, and satisfy your soul in drought.\"", a:"Isaiah 58:11"},
  {t:"Soft life is not lazy life. It's intentional. It's choosing peace.", a:"Soft Reminder"},
  {t:"You're not behind. You're not late. You're exactly where the lesson is.", a:"For You"},
  {t:"Tell me you're a baddie without telling me — oh wait, your skincare routine already did.", a:"Energy"},
  {t:"\"Enoch walked with God; and he was not, for God took him.\"", a:"Genesis 5:24"},
  {t:"Your only competition is who you were yesterday. And honestly? She's losing.", a:"Hype"},
  {t:"It's giving: glowy, grounded, and gone are the days she chased anyone.", a:"Energy"},
  {t:"\"For I know the plans I have for you, plans to prosper you.\"", a:"Jeremiah 29:11"},
  {t:"Drink the water. Take the supplement. Apply the SPF. Send the text. Be brave.", a:"For You"},
  {t:"You are not a backup plan. You are the whole-ass blueprint.", a:"NSFW Energy"},
  {t:"Soft on the inside, sharp on the outside, holy in spirit. Triple threat.", a:"Energy"},
  {t:"Today's vibe: gentle but unbothered.", a:"Mantra"},
  {t:"\"And I beheld, and I saw a great multitude.\"", a:"Enoch 39:6"},
  {t:"Your peace is more expensive than gold. Don't give it away for free.", a:"Soft Reminder"},
  {t:"Get the bag. Glow the skin. Save the soul. We're doing it ALL today.", a:"Hype"},
  {t:"You don't need permission to start over today. This is your sign.", a:"For You"},
  {t:"\"The Lord is my shepherd; I shall not want.\"", a:"Psalm 23:1 — KJV"},
  {t:"Treat yourself like someone you love. Be patient. Be kind. Bring snacks.", a:"Soft Reminder"},
  {t:"They said you couldn't. So you did. And now you're glowing about it.", a:"Energy"},
  {t:"\"Cast all your anxiety on him because he cares for you.\"", a:"1 Peter 5:7"},
  {t:"You are not too much. They were not enough.", a:"NSFW Energy"},
  {t:"Some days you're the lavender, some days you're the storm. Both are needed.", a:"Mantra"},
  {t:"\"Trust in the Lord with all thine heart; and lean not unto thine own understanding.\"", a:"Proverbs 3:5 — KJV"},
  {t:"Bestie, you're literally that girl. Walk like it.", a:"Energy"},
  {t:"Healing is not linear. Neither is your skin. Neither is your story.", a:"Soft Reminder"},
  {t:"You owe nobody an explanation for the path you're walking.", a:"For You"},
  {t:"\"And the angel of the Lord said unto Enoch...\"", a:"Enoch 1:2"},
  {t:"Coffee, retinol, and audacity. The holy trinity for today.", a:"NSFW Energy"},
  {t:"Romanticise the small things — the morning light, the cleanser, the quiet.", a:"Soft Life"},
  {t:"\"Weeping may endure for a night, but joy cometh in the morning.\"", a:"Psalm 30:5 — KJV"},
  {t:"You came this far. You're not stopping now. Onwards, divine girl.", a:"Hype"},
  {t:"Even the moon goes through phases. Be gentle with yourself.", a:"Mantra"},
  {t:"\"Greater is he that is in you, than he that is in the world.\"", a:"1 John 4:4 — KJV"},
  {t:"Your standards are not high. Theirs were low.", a:"NSFW Wisdom"},
  {t:"Today, choose the version of you that makes future-you proud.", a:"For You"},
  {t:"You are not behind in life. You are exactly on time. Promise.", a:"Soft Reminder"},
  {t:"Get up. Get dressed. Get going. The world's gonna feel YOU today.", a:"Hype"},
];

// ============== SCRIPTURE LIBRARY ==============
const VERSES = [
  {
    ref:"Psalm 46:10",
    trans:"kjv",
    text:"Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",
    context:"Written during a time of national upheaval. The psalmist speaks to a people surrounded by chaos — wars, shaking mountains, roaring waters — and offers them a single command: stillness.",
    meaning:"To 'be still' here is not passivity. The Hebrew word implies cease striving, let your hands fall, stop trying to control. It is a deliberate surrender — not weakness, but trust.",
    application:"When the day feels too loud, the to-do list too long, your skin too reactive, your heart too tired — pause. The God who holds galaxies also holds you. You don't have to fix everything today.",
    prompt:"Where in your life right now are you striving when stillness is what's being asked of you?"
  },
  {
    ref:"Jeremiah 29:11",
    trans:"modern",
    text:"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    context:"Written to Israelites in exile in Babylon — a people displaced, anxious, uncertain whether they had any future at all. Jeremiah delivers this letter from God to people who felt forgotten.",
    meaning:"God's plans rarely match our timeline. The Israelites would remain in exile for 70 more years. The promise wasn't immediate rescue — it was assured purpose. He knows. He sees. The plan is good even when the chapter you're in is hard.",
    application:"You are not a mistake. You are not behind. The waiting is part of the plan, not a delay in it. Trust the chapter you're in is preparing you for the one you can't see yet.",
    prompt:"What part of your life feels like 'exile' right now — and what might God be preparing in you through it?"
  },
  {
    ref:"Genesis 5:24",
    trans:"kjv",
    text:"And Enoch walked with God: and he was not; for God took him.",
    context:"Tucked into a list of genealogies, this single verse stands out. Among generations who 'lived and died,' Enoch alone is described differently. He walked. And then — he was simply taken.",
    meaning:"To 'walk with God' is a pattern, not a moment. It's daily, ordinary closeness. Enoch's intimacy with God was so real that death didn't fit the rhythm of his life. He didn't die — he was translated, taken up while still walking.",
    application:"You don't need a dramatic spiritual life to be close to God. Just walk. One day at a time. Talk to Him while you do your skincare, while you commute, while you wash dishes. The walk is the point.",
    prompt:"What does walking with God look like for you in this season — not in a perfect future, but in this very ordinary today?"
  },
  {
    ref:"1 Enoch 1:2",
    trans:"enoch",
    text:"And he took up his parable and said — Enoch, a righteous man, whose eyes were opened by God, saw the vision of the Holy One in the heavens, which the angels showed me.",
    context:"The Book of Enoch (1 Enoch) is an ancient Jewish text — quoted in the New Testament book of Jude. Though not in the Protestant canon, it was widely read by early Christians and is canonical in Ethiopian Orthodox tradition.",
    meaning:"Enoch is described as a righteous man whose eyes were opened — he sees what most cannot. The text frames spiritual sight as a gift, something granted, not earned. The angels are the messengers; Enoch is the witness.",
    application:"There are seasons where God opens your eyes to things others don't see. Don't dismiss the small visions, the gut nudges, the quiet knowings. They might be the very things you're meant to carry forward.",
    prompt:"What has God shown you recently that you've been tempted to dismiss as coincidence or imagination?"
  },
  {
    ref:"Proverbs 3:5-6",
    trans:"kjv",
    text:"Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    context:"Proverbs is wisdom literature — written largely by Solomon to his son. This passage sits in a chapter teaching a young man how to live a good and steady life.",
    meaning:"'Lean not unto thine own understanding' isn't a dismissal of intelligence — it's a warning against self-reliance. Our understanding is partial. God's is complete. Acknowledge Him in everything, and the path becomes clear.",
    application:"You don't have to have it figured out. Surrender the timeline, the outcome, the how. Direction comes when you stop demanding to see the whole map.",
    prompt:"What decision are you trying to figure out right now where you need to lean less on your own understanding?"
  },
  {
    ref:"Isaiah 58:11",
    trans:"modern",
    text:"The Lord will guide you continually, and satisfy your soul in drought, and make strong your bones; and you shall be like a watered garden, like a spring of water, whose waters do not fail.",
    context:"Isaiah is speaking to a people who had been performing religion without justice — fasting while oppressing the poor. God promises that genuine devotion (caring for the broken) leads to deep, sustaining life.",
    meaning:"Even in drought — emotional, spiritual, financial, relational — God promises continual guidance and inner satisfaction. A 'watered garden' is fed from underground; the source isn't visible, but it never fails.",
    application:"When you feel dry, look beneath. The spring is still flowing even when the surface looks parched. Care for others. Show up. The water will rise.",
    prompt:"Where do you feel spiritually or emotionally dry right now? What 'underground spring' might still be feeding you?"
  },
  {
    ref:"Psalm 23:1-3",
    trans:"kjv",
    text:"The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.",
    context:"Written by David — a former shepherd himself. He understood intimately what it took to keep a flock alive: finding water, fending off predators, leading them through dangerous terrain.",
    meaning:"The shepherd doesn't drive the sheep — he leads. He doesn't shame them into the green pastures — he makes them lie down. There is a tenderness here. A patience. A rest that's commanded, not optional.",
    application:"You are not behind. You are being led. If you feel exhausted, maybe today is a 'lie down in green pastures' kind of day — and rest is obedience, not laziness.",
    prompt:"What does your soul need restoring from? Can you give it permission to rest today?"
  },
  {
    ref:"1 Peter 5:7",
    trans:"modern",
    text:"Cast all your anxiety on him because he cares for you.",
    context:"Peter writes to scattered, persecuted Christians — believers facing real fear, loss, displacement. This isn't wishful thinking; it's a survival instruction.",
    meaning:"The Greek word for 'cast' is forceful — to hurl, to throw with intention. Anxiety isn't just felt, it's carried. Peter says: don't carry it. Throw it. He cares.",
    application:"Pick one anxiety today. Name it specifically. Then physically — out loud or in writing — give it to Him. Don't pick it back up an hour later. Practice the casting.",
    prompt:"What anxiety have you been carrying that you need to actively cast onto Him today?"
  },
  {
    ref:"Psalm 30:5",
    trans:"kjv",
    text:"For his anger endureth but a moment; in his favour is life: weeping may endure for a night, but joy cometh in the morning.",
    context:"David writes this after recovering from serious illness — a song of dedication and gratitude. The psalm holds the full arc of grief and restoration.",
    meaning:"The 'night' here isn't always literal. It's the season of weeping, of unanswered prayers, of feeling far from God. But mornings come. Always. Joy isn't absent — it's coming.",
    application:"If today is a night for you, hold on. Mornings are not earned by doing more. They arrive. Your job is to keep breathing through the dark.",
    prompt:"What 'night' are you in right now, and what would believing morning is coming change about how you face today?"
  },
  {
    ref:"1 John 4:4",
    trans:"kjv",
    text:"Greater is he that is in you, than he that is in the world.",
    context:"John writes to early Christians being deceived by false teachers. He reminds them that the Spirit of God within them is more powerful than any spirit of deception working in the world.",
    meaning:"You are not weaker than what's coming against you. The accuser, the doubt, the fear, the comparison — none of it has the final word. The One in you outranks the one out there.",
    application:"When the lies feel loud — that you're not enough, not loved, not progressing — remember whose voice carries more weight. The Greater One is in you. Walk like it.",
    prompt:"What lie about yourself have you been agreeing with that the Greater One in you would push back against?"
  },
  {
    ref:"Philippians 4:6-7",
    trans:"modern",
    text:"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and minds.",
    context:"Paul writes from prison — a man genuinely entitled to anxiety. Yet he speaks of peace as something present and available even there.",
    meaning:"The formula isn't magic — pray, ask, give thanks, then peace guards you. The Greek word for 'guard' is military: to garrison, to stand watch. Peace doesn't wait until problems resolve. It posts up before they do.",
    application:"Anxiety lies about what you can control. Prayer reframes. Thanksgiving rewires. Try it as practice today: name one anxiety, ask specifically, then thank Him for three things — and watch what guards your mind.",
    prompt:"What three things — small or big — can you genuinely give thanks for today, even in the middle of what's hard?"
  },
  {
    ref:"1 Enoch 39:6",
    trans:"enoch",
    text:"In those days mine eyes saw the dwelling of the elect and the dwelling of the righteous, where the holy and elect ones rest. And there mine eyes saw their dwellings with His righteous angels.",
    context:"This passage from 1 Enoch describes a vision of the heavenly realms — the resting place of the righteous. The book is heavy with apocalyptic imagery and a vivid spiritual cosmology.",
    meaning:"There is rest prepared for the righteous. Not earned by perfection, but prepared by grace. The dwelling exists. The angels are already there. Your weariness is not the final word.",
    application:"When the day demands more than you have, remember: there is a rest prepared. The exhaustion is temporary. Show up tired if you must. Just keep showing up.",
    prompt:"What does 'rest prepared for the righteous' mean for you in a culture that worships hustle?"
  },
  {
    ref:"Romans 8:28",
    trans:"modern",
    text:"And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    context:"Paul writes to Roman Christians during a tense political climate. This verse follows a section about creation groaning and the Spirit interceding when we don't know what to pray.",
    meaning:"It does NOT say all things are good — that would be a lie. It says God WORKS in all things for good. The pain isn't reframed as positive; it's woven into a larger purpose you may not yet see.",
    application:"You don't have to pretend the hard thing is fine. You can grieve. You can be angry. AND — you can trust that none of it is wasted. Both can be true at once.",
    prompt:"What painful thing in your past can you now see God worked good through, even though it was real pain?"
  },
  {
    ref:"Lamentations 3:22-23",
    trans:"kjv",
    text:"It is of the Lord's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    context:"Lamentations is a book of grief — written after the destruction of Jerusalem. The prophet Jeremiah weeps through five chapters. And yet here, in the middle of devastation, this song of mercy.",
    meaning:"His mercies are NEW every morning. Not recycled. Not earned. Brand new, custom-made for the day you wake into. Yesterday's failures don't reduce today's mercy.",
    application:"Whatever you carried yesterday — the missed routine, the harsh words, the comfort eating, the spiritual drift — does not deplete today's mercy. There is fresh grace waiting. Receive it.",
    prompt:"What from yesterday do you need to release in order to receive the mercy that is new this morning?"
  },
  {
    ref:"Matthew 11:28-29",
    trans:"modern",
    text:"Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.",
    context:"Jesus speaks these words after harshly rebuking unrepentant cities. The contrast is striking: stern with the proud, tender with the tired.",
    meaning:"He doesn't ask you to be less weary before you come. The invitation is for the weary. The yoke — usually a symbol of burden — is offered as the path TO rest. His way is lighter than the way you've been carrying it alone.",
    application:"Stop trying to earn the rest by finishing the list. Come tired. Come overwhelmed. He's not waiting for the version of you that has it together.",
    prompt:"What burden have you been carrying alone that He's actually inviting you to bring to Him?"
  },
  {
    ref:"Psalm 139:14",
    trans:"kjv",
    text:"I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.",
    context:"David writes one of the most intimate psalms — a meditation on being fully known by God. This verse comes after marveling at how God formed him in the womb.",
    meaning:"'Fearfully' means with reverence and awe. You weren't an accident. You weren't manufactured. You were crafted with deliberate, awe-inspiring care. Every freckle, every scar, every tendency.",
    application:"The skin you criticise was knit. The body you rush past was formed. The personality you apologise for was designed. You are not a problem to be solved — you are a marvel to be marvelled at.",
    prompt:"What part of yourself have you been treating as a flaw that you might receive as fearfully and wonderfully made?"
  },
];

// ============== HELPERS ==============
function $(id){return document.getElementById(id)}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}

function isRetinolNight(date=new Date()){
  const d=date.getDay(); // 0 Sun 1 Mon 2 Tue 3 Wed 4 Thu 5 Fri 6 Sat
  return d===1||d===3||d===5;
}
function isMaskFriendlyNight(date=new Date()){
  const d=date.getDay();
  return d===2||d===4||d===6||d===0;
}
function todayKey(){
  const d=new Date();
  return d.toISOString().split('T')[0];
}
function dayOfYear(){
  const d=new Date();
  const start=new Date(d.getFullYear(),0,0);
  return Math.floor((d-start)/86400000);
}

// ============== NAVIGATION ==============
function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  $(page).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${page}"]`)?.classList.add('active');
  state.currentPage=page;
  window.scrollTo({top:0,behavior:'instant'});

  if(page==='skincare'){renderSkincare()}
  if(page==='products'){renderProducts()}
  if(page==='motivation'){renderMotivation()}
  if(page==='scripture'){renderScripture()}
  if(page==='wellness'){renderWellness()}
}

// ============== LANDING ==============
function renderLanding(){
  const d=new Date();
  const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  $('dateDay').textContent=days[d.getDay()];
  $('dateNum').textContent=String(d.getDate()).padStart(2,'0');
  $('dateMonth').textContent=`${months[d.getMonth()]} ${d.getFullYear()}`;

  const hour=d.getHours();
  let greeting='good morning, sunshine';
  let vibe='Soft mornings, slow rituals — your skin, your sanctuary.';
  if(hour>=12&&hour<17){greeting='hello, lovely';vibe='Afternoon glow check — sip water, breathe in.'}
  else if(hour>=17&&hour<21){greeting='good evening, beautiful';vibe='Evening rituals, soft lights, gentle hands.'}
  else if(hour>=21||hour<5){greeting='wind down, dreamer';vibe='Wash the day away. Tomorrow holds promises.'}
  $('greeting').textContent=greeting;
  $('todaysVibe').textContent=vibe;

  $('statRoutine').textContent=hour<12?'AM':(hour<19?'PM':'PM');
  $('statProducts').textContent=state.products.length;
  $('statMood').textContent=state.todayMood?['😔','😕','😐','🙂','✨'][state.todayMood-1]:'—';

  const ritualMeta=isRetinolNight()?'tonight is a retinol night':(isMaskFriendlyNight()?'mask-friendly evening':'gentle evening ahead');
  $('ritualMeta').textContent=`— ${ritualMeta}`;
  // Today's verse ref on landing
  const todaysVerse=VERSES[dayOfYear()%VERSES.length];
  if(todaysVerse&&$('verseRefHome'))$('verseRefHome').textContent=todaysVerse.ref;

  $('streakNum').textContent=state.streak;
}

// ============== SKINCARE ==============
function renderSkincare(){
  renderWeekStrip();
  renderSmartHint();
  document.querySelectorAll('.mood-pill').forEach(p=>{
    p.classList.toggle('selected',p.dataset.mood===state.mood);
  });
  document.querySelectorAll('.time-toggle button').forEach(b=>{
    b.classList.toggle('active',b.dataset.time===state.time);
  });
  renderRoutine();
}

function renderWeekStrip(){
  const days=['S','M','T','W','T','F','S'];
  const today=new Date();
  const sunday=new Date(today);
  sunday.setDate(today.getDate()-today.getDay());
  let html='';
  for(let i=0;i<7;i++){
    const d=new Date(sunday);
    d.setDate(sunday.getDate()+i);
    const isToday=d.toDateString()===today.toDateString();
    const isRet=isRetinolNight(d);
    html+=`<div class="day-cell ${isToday?'today':''} ${isRet?'retinol':''}">
      <div class="day-name">${days[i]}</div>
      <div class="day-num">${d.getDate()}</div>
    </div>`;
  }
  $('weekStrip').innerHTML=html;
}

function renderSmartHint(){
  const isAM=state.time==='am';
  const ret=isRetinolNight();
  let hint='';

  if(!isAM && ret){
    hint=`<div class="smart-hint"><div class="hint-mark">✦</div><div class="hint-text"><strong>Tonight is a retinol night.</strong> Skip toner, no salicylic, and the neck massager stays on cool/green only.</div></div>`;
  } else if(!isAM && state.mood==='mask') {
    if(ret){
      hint=`<div class="smart-hint"><div class="hint-mark">!</div><div class="hint-text"><strong>Heads up — masks clash with retinol.</strong> Either swap retinol for the mask tonight, or save mask for Tue/Thu/Sat/Sun.</div></div>`;
    } else {
      hint=`<div class="smart-hint"><div class="hint-mark">✿</div><div class="hint-text"><strong>Mask night.</strong> No retinol tonight if you're masking — your barrier will thank you.</div></div>`;
    }
  } else if(isAM){
    hint=`<div class="smart-hint"><div class="hint-mark">☼</div><div class="hint-text"><strong>SPF non-negotiable today</strong> — even cloudy, even WFH. UV comes through windows.</div></div>`;
  }
  $('smartHint').innerHTML=hint;
}

function setTime(t){state.time=t;renderSkincare()}
function setMood(m){state.mood=m;renderSkincare()}

function renderRoutine(){
  const isAM=state.time==='am';
  const ret=isRetinolNight();
  const m=state.mood;
  const steps=[];

  // ============== AM ==============
  if(isAM){
    // 1. Splash + cleanse
    steps.push({
      title:"Cleanse",
      icon:"𓆟",
      products:[
        {p:"Splash of water",m:"start with cold or lukewarm — wakes skin gently"},
        m==='oily'||m==='breakout'?
          {p:"NIP+FAB Salicylic Gel Cleanser",m:"2-3×/week MAX — with brush head if used"}:
          (m==='dull'||m==='normal'?
            {p:"Nuage Vitamin C Micellar (cotton pad)",m:"AM brightening cleanse — hold 10-15 sec, never foam bottle"}:
            {p:"Garnier Micellar (Pink Cap) on cotton pad",m:"hold 10-15 sec, never foam bottle"}),
        {p:"CeraVe Foaming or Elemis Pro-Collagen Mousse",m:"daily second cleanse — gentle, hydrating"}
      ],
      note: m==='breakout'? "Brush head okay 2-3×/week max — don't overdo it on active spots":null
    });

    // 1b. Brush head guide (only on certain moods)
    if(m==='oily'||m==='dull'){
      steps[steps.length-1].toolGuide=true;
    }

    // 2. Kanzen spray
    steps.push({
      title:"Hypochlorous mist",
      icon:"❀",
      products:[
        {p:"Kanzen Hypochlorous Cleansing Spray",m:"spritz on face, let sit a few seconds — calms & preps"}
      ],
      note: m==='sensitive'?"Sensitive day? This can replace toner today.":null
    });

    // 3. Acne patch (breakout)
    if(m==='breakout'){
      steps.push({
        title:"Spot patch",
        icon:"❍",
        products:[{p:"Hydrocolloid Acne Patch",m:"on clean dry skin — let it work while you do the rest"}]
      });
    }

    // 4. Tone (skip if sensitive only used Kanzen)
    if(m!=='sensitive'){
      steps.push({
        title:"Tone",
        icon:"♢",
        products:[
          m==='oily'||m==='breakout'?
            {p:"Super Facialist Salicylic Toner",m:"only if not using salicylic cleanser today"}:
            {p:"Simple Soothing Facial Toner",m:"gentle pH balance"}
        ]
      });
    }

    // 5. Spot treatment (breakout, after tone)
    if(m==='breakout'){
      steps.push({
        title:"Spot treat",
        icon:"✦",
        products:[{p:"Tea Tree Essential Oil",m:"cotton bud — only on forming spots, let dry fully"}]
      });
    }

    // 6. Serums (HA always first on damp skin, then actives)
    const serumProducts=[{p:"AOC Hyaluronic Serum",m:"on damp skin — always first"}];
    
    if(m==='dull'){
      serumProducts.push({p:"Florence by Mills Vitamin C Serum",m:"after HA — glow boost, never with niacinamide same day"});
    } else if(m==='oily'){
      serumProducts.push({p:"The Ordinary Niacinamide 10%",m:"after HA — oil control & calm, not with Vit C"});
    } else if(m==='breakout'){
      serumProducts.push({p:"The Ordinary Niacinamide 10%",m:"after HA — calms inflammation"});
    } else if(m==='calm'){
      serumProducts.push({p:"The Ordinary Niacinamide",m:"after HA, before moisturiser"});
    }
    // Sensitive gets HA only (no extra actives)
    
    steps.push({title:"Serums",icon:"✺",products:serumProducts});

    // 7. Eye care
    steps.push({
      title:"Eye care",
      icon:"◐",
      products:[
        {p:"Caffeine Eye Serum (360° massage ball)",m:"roll outward from inner corner — depuff"},
        {p:"Anovia Caffeine Eye Cream",m:"pat with ring finger"}
      ]
    });

    // 8. Moisturise → HA mist
    const moisturiser = m==='breakout' ? "Neutrogena Clear & Defend Moisturiser" : (m==='sensitive'?"Cetaphil Moisturising Lotion":(m==='dull'||m==='normal'?"Innisfree Green Tea Ceramide Milk":"Nuage Ceramide Daily Moisturiser"));
    steps.push({
      title:"Moisturise",
      icon:"❁",
      products:[
        {p:moisturiser,m:"press in, don't rub"},
        {p:"Sunkissed Hydrating Mist (HA + Vit E)",m:"spritz over moisturiser to seal hydration"}
      ]
    });

    // 9. Vit C mist (energising)
    steps.push({
      title:"Energising mist",
      icon:"☼",
      products:[{p:"Sunkissed Vitamin C Energising Mist (Aloe)",m:"AM only — glow boost. Skip if using niacinamide today"}]
    });

    // 10. SPF
    steps.push({
      title:"SPF — non-negotiable",
      icon:"☀",
      products:[{p:"Bondi Sands Face SPF 50+",m:"two finger lengths — every single day"}]
    });

    // 11. Primer
    steps.push({
      title:"Prime",
      icon:"◇",
      products:[{p:"Maybelline Fit Me 2% Niacinamide Primer Serum",m:"after SPF — preps for makeup + extends wear"}]
    });

    // 12. Lips
    steps.push({
      title:"Lips",
      icon:"♡",
      products:[
        {p:"Vaseline / Daise Peptide Lip Butter",m:"hydrate before makeup"}
      ]
    });

    return outputSteps(steps);
  }

  // ============== PM ==============
  // 1. First cleanse (makeup)
  steps.push({
    title:"Remove the day",
    icon:"𓆝",
    products:[{p:"Garnier Micellar (Pink Cap) on cotton pad",m:"hold 10-15 sec — twice if heavy makeup. Never foam bottle"}]
  });

  // 2. Second cleanse
  if(ret){
    steps.push({
      title:"Second cleanse",
      icon:"𓆟",
      products:[{p:"CeraVe Foaming or Elemis Pro-Collagen Mousse",m:"keep it gentle — never salicylic on retinol nights"}],
      note:"On retinol nights — keep cleansing gentle. No actives in cleanser."
    });
  } else if(m==='oily'||m==='breakout'){
    steps.push({
      title:"Second cleanse",
      icon:"𓆟",
      products:[{p:"NIP+FAB Salicylic Gel Cleanser",m:"2-3×/week — with brush head"}],
      toolGuide:true
    });
  } else {
    steps.push({
      title:"Second cleanse",
      icon:"𓆟",
      products:[
        {p:"CeraVe Foaming or Elemis Pro-Collagen Mousse",m:"daily go-to — gentle & hydrating"},
        {p:"Supreme Skin CBD Cleanser",m:"1-2×/week MAX — menthol can irritate"}
      ]
    });
  }

  // 3. Acne patch — after cleanse, before tone
  if(m==='breakout'||(ret&&m==='breakout')){
    steps.push({
      title:"Spot patch",
      icon:"❍",
      products:[{p:"Hydrocolloid Acne Patch",m:"on clean dry skin — apply before any other steps"}]
    });
  }

  // 4. Tone (skipped on retinol)
  if(!ret){
    let toneProd;
    if(m==='dull'){toneProd={p:"The Ordinary Glycolic Acid 7%",m:"1×/week MAX — never with salicylic, retinol, Vit C"}}
    else if(m==='oily'||m==='breakout'){toneProd={p:"Super Facialist Salicylic Toner",m:"only if not used salicylic cleanser tonight"}}
    else {toneProd={p:"Simple Soothing Facial Toner",m:"gentle pH"}}
    steps.push({title:"Tone",icon:"♢",products:[toneProd]});
  } else {
    steps.push({
      title:"Skip toner — retinol night",
      icon:"⊘",
      products:[{p:"HA serum acts as your buffer instead",m:"prep skin with hydration before retinol"}]
    });
  }

  // 5. Spot treatment (breakout, after tone)
  if(m==='breakout'){
    steps.push({
      title:"Spot treat",
      icon:"✦",
      products:[{p:"Tea Tree Essential Oil",m:ret?"dab, let DRY fully — apply retinol around it not on top":"dab on forming spots, let dry"}]
    });
  }

  // 6. Serums
  if(ret){
    steps.push({
      title:"HA buffer",
      icon:"✺",
      products:[{p:"AOC Hyaluronic Serum",m:"damp skin — must come BEFORE retinol to buffer"}]
    });
    steps.push({
      title:"Retinol",
      icon:"✦",
      products:[{p:"Geek & Gorgeous A-Game 101 Retinol",m:"pea size — avoid eye area & active spots"}],
      note:"If using tea tree on a spot, apply retinol around it, not on top."
    });
  } else if(m==='mask'){
    steps.push({
      title:"Treatment mask",
      icon:"⌘",
      products:[
        {p:"BeautyPro Bakuchiol Sheet Mask",m:"15-20min — pat in residue, NEVER on retinol nights"},
        {p:"or Skin Techniques Charcoal Clay",m:"oily/congested — rinse off"},
        {p:"or Rose / Algae Clay Mask",m:"calming alternatives"}
      ]
    });
    steps.push({
      title:"After mask",
      icon:"✺",
      products:[{p:"AOC Hyaluronic Serum",m:"on damp skin to seal in mask benefits"}]
    });
  } else if(m==='dull'){
    steps.push({
      title:"Glow serums",
      icon:"✺",
      products:[
        {p:"AOC Hyaluronic Serum",m:"first, on damp skin"},
        {p:"The Ordinary Rose Hip Oil",m:"after HA"}
      ]
    });
  } else if(m==='breakout'){
    steps.push({
      title:"Treat & calm",
      icon:"✺",
      products:[
        {p:"AOC Hyaluronic Serum",m:"hydrate first"},
        {p:"The Ordinary Niacinamide",m:"after HA — calms inflammation"}
      ]
    });
  } else {
    steps.push({
      title:"Serums",
      icon:"✺",
      products:[
        {p:"AOC Hyaluronic Serum",m:"on damp skin"},
        {p:"The Ordinary Niacinamide",m:"after HA"}
      ]
    });
  }

  // 7. LED mask (after serums, before moisturiser) — NOT on retinol nights
  if(!ret && m!=='sensitive'){
    steps.push({
      title:"LED therapy",
      icon:"⊕",
      products:[{p:"LED Light Therapy Mask",m:m==='breakout'?"BLUE mode — kills acne bacteria":(m==='dull'?"RED mode — collagen & glow":"choose blue for spots, red for ageing")}]
    });
  }

  // 8. Eye care
  steps.push({
    title:"Eye care",
    icon:"◐",
    products:[
      {p:"The Body Shop Vitamin E Eye Cream",m:"pat with ring finger"},
      {p:"Or Caffeine 360° Massage Ball",m:"roll outward — depuff"}
    ]
  });

  // 9. Moisturise → HA mist → Rosehip (correct order!)
  const pmMoist = ret?"Cetaphil or E45 (gentle barrier support)":(m==='breakout'?"Neutrogena Clear & Defend":m==='sensitive'?"Cetaphil Moisturising Lotion":"Nuage Ceramide or Innisfree Green Tea Ceramide");
  steps.push({
    title:"Moisturise & seal",
    icon:"❁",
    products:[
      {p:pmMoist,m:"press in"},
      {p:"Sunkissed Hydrating Mist (HA + Vit E)",m:"spritz over moisturiser"},
      {p:"The Ordinary Rosehip Oil",m:"final layer — locks it all in"}
    ]
  });

  // 10. Massager (cool/green only on retinol)
  steps.push({
    title:"Lymphatic drainage",
    icon:"◇",
    products:[{p:"Face/Neck Massager",m:ret?"COOL/GREEN mode — NECK ONLY on retinol nights":"red/heat okay on non-retinol nights — boost circulation"}]
  });

  // 11. Lips
  steps.push({
    title:"Lip care",
    icon:"♡",
    products:[
      {p:"Overnight Lip Mask (Cherry/Watermelon/Strawberry/Bubblegum/Propolis/Collagen)",m:"thick layer overnight"},
      {p:"Lip scrub",m:"STANDALONE — do before face routine or well after, wipes can disturb face products"}
    ]
  });

  outputSteps(steps);
}

function outputSteps(steps){
  const html=steps.map((s,i)=>{
    let toolGuideHTML='';
    if(s.toolGuide){
      toolGuideHTML=`<div class="tool-guide">
        <div class="tool-pill"><strong>Brush</strong>Deep cleanse, oily days, 2-3×/wk</div>
        <div class="tool-pill"><strong>Silicone</strong>Gentle daily, sensitive</div>
        <div class="tool-pill"><strong>Exfoliating</strong>1-2×/wk glow, never broken skin</div>
        <div class="tool-pill"><strong>Massage</strong>Circulation, any day</div>
      </div>`;
    }
    return `<div class="step-card stagger" style="animation-delay:${i*0.05}s">
      <div class="step-head">
        <div class="step-num-block">
          <div class="step-num">${String(i+1).padStart(2,'0')}</div>
          <div class="step-title">${s.title}</div>
        </div>
        <div class="step-icon">${s.icon}</div>
      </div>
      <div class="step-products">
        ${s.products.map(p=>`<div class="product-line">
          <div class="product-bullet"></div>
          <div><strong>${p.p}</strong>${p.m?`<div class="product-meta">${p.m}</div>`:''}</div>
        </div>`).join('')}
      </div>
      ${toolGuideHTML}
      ${s.note?`<div class="step-note">${s.note}</div>`:''}
    </div>`;
  }).join('');
  $('routine').innerHTML=html;
}

// ============== PRODUCTS ==============
const CATEGORY_LABELS={
  cleansers:"Cleansers",toners:"Toners",serums:"Serums & Treatments",
  eyes:"Eye Care",lips:"Lip Care",moisturisers:"Moisturisers",
  sunscreen:"Sunscreen",masks:"Masks",tools:"Tools & Devices",body:"Body & Other"
};

function renderProducts(){
  // Render category chips
  const cats=['all',...new Set(state.products.map(p=>p.cat))];
  $('catChips').innerHTML=cats.map(c=>{
    const label=c==='all'?'All':CATEGORY_LABELS[c]||c;
    return `<div class="cat-chip ${state.filteredCategory===c?'active':''}" onclick="filterCat('${c}')">${label}</div>`;
  }).join('');

  // Filter products
  let filtered=state.products;
  if(state.filteredCategory!=='all'){
    filtered=filtered.filter(p=>p.cat===state.filteredCategory);
  }
  if(state.searchQuery){
    const q=state.searchQuery.toLowerCase();
    filtered=filtered.filter(p=>p.name.toLowerCase().includes(q)||(p.notes||'').toLowerCase().includes(q));
  }

  // Group by category
  const groups={};
  filtered.forEach(p=>{(groups[p.cat]=groups[p.cat]||[]).push(p)});

  if(Object.keys(groups).length===0){
    $('productsList').innerHTML=`<div class="empty">Nothing matches that search.</div>`;
    return;
  }

  $('productsList').innerHTML=Object.entries(groups).map(([cat,prods])=>{
    return `<div class="cat-group">
      <div class="cat-header">
        <div class="cat-name">${CATEGORY_LABELS[cat]||cat}</div>
        <div class="cat-count">${prods.length} ${prods.length===1?'item':'items'}</div>
      </div>
      ${prods.map(p=>{
        const stock=p.stock||'full';
        const meta=[p.store,p.price].filter(Boolean).join(' · ')||p.notes||'tap to add details';
        return `<div class="product-card" onclick="editProduct(${p.id})">
          <div class="stock-dot stock-${stock}"></div>
          <div class="product-info">
            <div class="product-name">${p.name}</div>
            <div class="product-meta-row">${meta}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--ink-faint);flex-shrink:0"><path d="M9 6l6 6-6 6"/></svg>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

function filterCat(c){state.filteredCategory=c;renderProducts()}
$('searchInput')?.addEventListener('input',e=>{state.searchQuery=e.target.value;renderProducts()});

function editProduct(id){
  const p=state.products.find(x=>x.id===id);
  if(!p)return;
  state.editingProduct=p;
  $('productModalTitle').textContent='Edit product';
  $('productModalSub').textContent=p.name.length>40?p.name.slice(0,40)+'...':p.name;
  $('pName').value=p.name;
  $('pCategory').value=p.cat;
  $('pStore').value=p.store||'';
  $('pPrice').value=p.price||'';
  $('pNotes').value=p.notes||'';
  setStock(p.stock||'full');
  $('deleteBtn').style.display='block';
  $('productModal').classList.add('show');
}

function openAddProduct(){
  state.editingProduct=null;
  $('productModalTitle').textContent='Add product';
  $('productModalSub').textContent='Something new for the shelf';
  $('pName').value='';
  $('pCategory').value='cleansers';
  $('pStore').value='';
  $('pPrice').value='';
  $('pNotes').value='';
  setStock('full');
  $('deleteBtn').style.display='none';
  $('productModal').classList.add('show');
}

function setStock(s){
  document.querySelectorAll('.stock-opt').forEach(o=>o.classList.toggle('selected',o.dataset.stock===s));
  state.editingStock=s;
}

async function saveProduct(){
  const name=$('pName').value.trim();
  if(!name){toast('Name needed');return}
  const data={
    name,
    cat:$('pCategory').value,
    store:$('pStore').value,
    price:$('pPrice').value,
    stock:state.editingStock||'full',
    notes:$('pNotes').value,
  };
  
  try{
    if(state.editingProduct){
      Object.assign(state.editingProduct,data);
      const updated=await sbUpdate(state.editingProduct);
      if(updated===false){
        toast('Save failed — check connection');
        return;
      }
      toast('Updated');
    } else {
      data.id=Date.now();
      state.products.push(data);
      const inserted=await sbInsert(data);
      if(inserted===false){
        toast('Save failed — check connection');
        return;
      }
      toast('Added to your shelf');
    }
    closeModal('productModal');
    renderProducts();
    renderLanding();
    saveLocal();
  }catch(e){
    console.error('Product save error:',e);
    toast('Save failed');
  }
}

async function deleteCurrentProduct(){
  if(!state.editingProduct)return;
  state.products=state.products.filter(p=>p.id!==state.editingProduct.id);
  await sbDelete(state.editingProduct.id);
  closeModal('productModal');
  renderProducts();
  renderLanding();
  saveLocal();
  toast('Removed');
}

function closeModal(id){$(id).classList.remove('show')}

// ============== MOTIVATION ==============
function renderMotivation(){
  const idx=dayOfYear()%MOTIVATIONS.length;
  const m=MOTIVATIONS[idx];
  $('motiText').textContent=m.t;
  $('motiAttribution').textContent=`— ${m.a} —`;
}
function rerollMotivation(){
  const m=MOTIVATIONS[Math.floor(Math.random()*MOTIVATIONS.length)];
  $('motiText').textContent=m.t;
  $('motiAttribution').textContent=`— ${m.a} —`;
}
function shareMotivation(){
  const text=$('motiText').textContent;
  if(navigator.share){navigator.share({text})}
  else if(navigator.clipboard){navigator.clipboard.writeText(text);toast('Copied')}
}

// ============== SCRIPTURE ==============
function getFilteredVerses(){
  if(state.scriptureFilter==='all')return VERSES;
  return VERSES.filter(v=>v.trans===state.scriptureFilter);
}

function renderScripture(){
  const list=getFilteredVerses();
  if(list.length===0){
    $('verseRef').textContent='—';
    $('verseText').textContent='No verses in this translation yet.';
    return;
  }
  // Stay on current verse if visible, else default to today's verse
  if(state.scriptureIndex===null||state.scriptureIndex>=list.length){
    state.scriptureIndex=dayOfYear()%list.length;
  }
  const v=list[state.scriptureIndex];
  $('verseRef').textContent=v.ref;
  $('verseText').textContent=v.text;
  const transLabels={kjv:'King James Version',modern:'Modern Translation',enoch:'Book of Enoch'};
  $('verseTrans').textContent=transLabels[v.trans]||'';
  $('studyContext').textContent=v.context;
  $('studyMeaning').textContent=v.meaning;
  $('studyApplication').textContent=v.application;
  $('reflectionPrompt').textContent=v.prompt;

  // Update toggle state
  document.querySelectorAll('.trans-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.trans===state.scriptureFilter);
  });

  // Load saved reflection for this verse
  const saved=state.reflections[v.ref]||'';
  if($('reflectionText'))$('reflectionText').value=saved;
}

function setTrans(t){
  state.scriptureFilter=t;
  state.scriptureIndex=null;  // reset to today's index in new filter
  renderScripture();
}

function nextVerse(){
  const list=getFilteredVerses();
  state.scriptureIndex=(state.scriptureIndex+1)%list.length;
  renderScripture();
}
function prevVerse(){
  const list=getFilteredVerses();
  state.scriptureIndex=(state.scriptureIndex-1+list.length)%list.length;
  renderScripture();
}

async function saveReflection(){
  const text=$('reflectionText').value;
  const list=getFilteredVerses();
  const v=list[state.scriptureIndex];
  if(!v)return;
  state.reflections[v.ref]=text;
  await sbSetting('reflection_'+v.ref,text);
  saveLocal();
  toast('Reflection saved');
}

// ============== WELLNESS ==============
function renderWellness(){
  if(state.todayMood){
    document.querySelectorAll('.mood-btn').forEach(b=>b.classList.toggle('selected',Number(b.dataset.m)===state.todayMood));
  }
  const today=state.sleepData[todayKey()];
  if(today){
    $('bedTime').value=today.bed||'';
    $('wakeTime').value=today.wake||'';
    if(today.bed&&today.wake)calcSleep();
  }
  renderMoodChart();
  renderJournalCard();
  renderHighlights();
}

function setWellTab(tab){
  state.wellTab=tab;
  document.querySelectorAll('.well-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.well-tab-content').forEach(c=>c.classList.remove('active'));
  $('tab-'+tab).classList.add('active');
  if(tab==='highlights')renderHighlights();
}

async function setDailyMood(m){
  state.todayMood=m;
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.toggle('selected',Number(b.dataset.m)===m));
  await sbUpsertWellness({entry_date:todayKey(),mood:m});
  // update local week cache
  const existing=state.weekMoods.find(x=>x.entry_date===todayKey());
  if(existing){existing.mood=m}else{state.weekMoods.push({entry_date:todayKey(),mood:m})}
  renderMoodChart();
  renderLanding();
  saveLocal();
  toast('Saved');
}

function calcSleep(){
  const bed=$('bedTime').value;
  const wake=$('wakeTime').value;
  if(!bed||!wake)return;
  const [bh,bm]=bed.split(':').map(Number);
  const [wh,wm]=wake.split(':').map(Number);
  let bedMin=bh*60+bm;
  let wakeMin=wh*60+wm;
  if(wakeMin<=bedMin)wakeMin+=24*60;
  const total=wakeMin-bedMin;
  const hrs=Math.floor(total/60);
  const mins=total%60;
  $('sleepHours').textContent=`${hrs}.${Math.round(mins/60*10)}`;
  let label='hours';
  if(total>=480&&total<=540)label='restful sleep';
  else if(total<360)label='short night';
  else if(total>540)label='deep rest';
  $('sleepLabel').textContent=label;
  $('sleepResult').style.display='block';
  state.sleepData[todayKey()]={bed,wake,total};
  sbUpsertWellness({entry_date:todayKey(),bed_time:bed,wake_time:wake});
  saveLocal();
}

function renderMoodChart(){
  const days=['S','M','T','W','T','F','S'];
  const today=new Date();
  const sunday=new Date(today);
  sunday.setDate(today.getDate()-today.getDay());
  let html='';
  for(let i=0;i<7;i++){
    const d=new Date(sunday);
    d.setDate(sunday.getDate()+i);
    const k=d.toISOString().split('T')[0];
    const entry=state.weekMoods.find(x=>x.entry_date===k);
    const mood=entry?entry.mood:0;
    const height=mood?(mood/5)*100:5;
    html+=`<div class="chart-day">
      <div class="chart-bar" style="height:${height}%"></div>
      <div class="chart-day-label">${days[i]}</div>
    </div>`;
  }
  $('chartWeek').innerHTML=html;
}

// ============== JOURNAL ==============
function renderJournalCard(){
  const c=$('journalContent');
  if(!state.pin){
    // First time — set PIN
    $('journalTitleSub').textContent='set a 4-digit PIN';
    c.innerHTML=`<div class="journal-locked">
      <div class="lock-icon">⌅</div>
      <div style="font-family:'Fraunces',serif;font-style:italic;color:var(--ink-soft);margin-bottom:14px">Choose a 4-digit PIN to lock your diary.</div>
      <div class="pin-display" id="pinDisplay">
        <div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div>
      </div>
      ${pinPadHTML('handleSetPin')}
    </div>`;
  } else if(!state.pinUnlocked){
    $('journalTitleSub').textContent='locked';
    c.innerHTML=`<div class="journal-locked">
      <div class="lock-icon">⌅</div>
      <div style="font-family:'Fraunces',serif;font-style:italic;color:var(--ink-soft);margin-bottom:14px">Enter your PIN.</div>
      <div class="pin-display" id="pinDisplay">
        <div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div>
      </div>
      ${pinPadHTML('handleUnlockPin')}
      <div class="edit-link" onclick="resetPinPrompt()" style="margin-top:14px;display:inline-block">forgot PIN?</div>
    </div>`;
  } else {
    $('journalTitleSub').textContent='today';
    const todaysEntry=state.journalEntries.find(e=>e.entry_date===todayKey());
    c.innerHTML=`
      <textarea class="journal-textarea" id="journalText" placeholder="how is today, really...">${todaysEntry?.text||''}</textarea>
      <button class="btn-primary" onclick="saveJournal()">Save entry</button>
      <button class="btn-secondary" onclick="lockJournal()">Lock diary</button>
      ${state.journalEntries.length>0?`<div style="margin-top:20px"><div class="section-eyebrow">Past entries</div>
        ${state.journalEntries.filter(e=>e.entry_date!==todayKey()).slice(0,5).map(e=>`
          <div class="past-entry">
            <div class="past-entry-date">${formatEntryDate(e.entry_date)}</div>
            <div class="past-entry-preview">${e.text||'—'}</div>
          </div>`).join('')}</div>`:''}
    `;
  }
}

function formatEntryDate(s){
  const d=new Date(s);
  return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
}

function pinPadHTML(handler){
  return `<div class="pin-pad">
    ${[1,2,3,4,5,6,7,8,9].map(n=>`<button onclick="pinPress('${n}','${handler}')">${n}</button>`).join('')}
    <button class="pin-action" onclick="pinClear('${handler}')">Clear</button>
    <button onclick="pinPress('0','${handler}')">0</button>
    <button class="pin-action" onclick="pinBackspace('${handler}')">←</button>
  </div>`;
}

function pinPress(n,handler){
  if(state.pinBuffer.length>=4)return;
  state.pinBuffer+=n;
  updatePinDots();
  if(state.pinBuffer.length===4){window[handler]?.()}
}
function pinClear(){state.pinBuffer='';updatePinDots()}
function pinBackspace(){state.pinBuffer=state.pinBuffer.slice(0,-1);updatePinDots()}
function updatePinDots(){
  document.querySelectorAll('#pinDisplay .pin-dot').forEach((d,i)=>{
    d.classList.toggle('filled',i<state.pinBuffer.length);
  });
}

async function handleSetPin(){
  state.pin=state.pinBuffer;
  state.pinBuffer='';
  state.pinUnlocked=true;
  await sbSetting('pin',state.pin);
  toast('PIN set');
  renderJournalCard();
}

async function handleUnlockPin(){
  if(state.pinBuffer===state.pin){
    state.pinUnlocked=true;
    state.pinBuffer='';
    renderJournalCard();
  } else {
    state.pinBuffer='';
    updatePinDots();
    toast('Wrong PIN');
  }
}

function resetPinPrompt(){
  if(confirm('Reset PIN? You will need to set a new one. Existing entries stay safe.'))
  {state.pin=null;state.pinBuffer='';sbSetting('pin','');renderJournalCard()}
}

async function saveJournal(){
  const text=$('journalText').value;
  const k=todayKey();
  await sbSaveJournal(k,text);
  const existing=state.journalEntries.find(e=>e.entry_date===k);
  if(existing){existing.text=text}else{state.journalEntries.unshift({entry_date:k,text})}
  toast('Saved');
}

function lockJournal(){state.pinUnlocked=false;renderJournalCard()}

// ============== HIGHLIGHTS ==============
function getWeekKey(date=new Date()){
  // ISO week: Mon-Sun. Returns YYYY-Www
  const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  const dayNum=d.getUTCDay()||7;
  d.setUTCDate(d.getUTCDate()+4-dayNum);
  const yearStart=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNum=Math.ceil(((d-yearStart)/86400000+1)/7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2,'0')}`;
}

function getWeekRange(weekKey){
  // Returns "Mon DD - Sun DD" for a given week key
  const [year,wk]=weekKey.split('-W').map(Number);
  const jan4=new Date(Date.UTC(year,0,4));
  const dayOfWeek=jan4.getUTCDay()||7;
  const monday=new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate()-dayOfWeek+1+(wk-1)*7);
  const sunday=new Date(monday);
  sunday.setUTCDate(monday.getUTCDate()+6);
  const fmt=d=>d.toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'UTC'});
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

function renderHighlights(){
  const currentWeek=getWeekKey();
  $('weekBadge').textContent=getWeekRange(currentWeek);

  const thisWeek=state.highlights.find(h=>h.week_key===currentWeek);
  const status=$('thisWeekStatus');
  if(thisWeek){
    status.innerHTML=`<div class="this-week-photo">
      <img src="${thisWeek.photo_url}" alt="this week">
      <div class="this-week-overlay">
        <div class="this-week-meta">This week's pick</div>
        <button class="replace-link" onclick="document.getElementById('photoInput').click()">Replace</button>
      </div>
    </div>`;
  } else {
    status.innerHTML=`<button class="upload-cta" onclick="document.getElementById('photoInput').click()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
      Pick this week's moment
    </button>
    <div id="uploadProgress" style="display:none"><div class="upload-progress"><div class="upload-progress-bar" id="uploadProgressBar"></div></div></div>`;
  }

  // Past highlights (excluding current week)
  const past=state.highlights.filter(h=>h.week_key!==currentWeek).sort((a,b)=>b.week_key.localeCompare(a.week_key));
  const grid=$('highlightsGrid');
  if(past.length===0){
    grid.innerHTML=`<div class="highlights-empty">
      <div class="highlights-empty-mark">✦</div>
      <div class="highlights-empty-text">Your collection grows here.<br>One picture, one week at a time.</div>
    </div>`;
  } else {
    grid.innerHTML=past.map(h=>`
      <div class="highlight-tile" onclick="openLightbox('${h.week_key}')">
        <img src="${h.photo_url}" alt="${h.week_key}" loading="lazy">
        <div class="highlight-tile-overlay">${getWeekRange(h.week_key)}</div>
      </div>
    `).join('');
  }
}

async function handlePhotoUpload(event){
  const file=event.target.files[0];
  if(!file)return;
  if(!sb){toast('Cloud not connected');return}

  const currentWeek=getWeekKey();
  const progressWrap=$('uploadProgress');
  const progressBar=$('uploadProgressBar');
  if(progressWrap){progressWrap.style.display='block';progressBar.style.width='10%'}

  try{
    // Compress image first to keep storage costs sensible
    const compressed=await compressImage(file,1600,0.85);
    if(progressBar)progressBar.style.width='40%';

    const ext=file.name.split('.').pop()||'jpg';
    const path=`${currentWeek}-${Date.now()}.${ext}`;

    // Delete existing photo for this week if it exists
    const existing=state.highlights.find(h=>h.week_key===currentWeek);
    if(existing&&existing.storage_path){
      try{await sb.storage.from('kayley_highlights').remove([existing.storage_path])}catch(e){}
    }

    // Upload new photo
    const {data:uploadData,error:uploadErr}=await sb.storage.from('kayley_highlights').upload(path,compressed,{upsert:true,contentType:'image/jpeg'});
    if(uploadErr)throw uploadErr;
    if(progressBar)progressBar.style.width='75%';

    // Get public URL
    const {data:urlData}=sb.storage.from('kayley_highlights').getPublicUrl(path);
    const photoUrl=urlData.publicUrl;

    // Save metadata to DB
    await sb.from('kayley_highlights').upsert({
      week_key:currentWeek,
      photo_url:photoUrl,
      storage_path:path,
    },{onConflict:'week_key'});

    if(progressBar)progressBar.style.width='100%';

    // Update local state
    if(existing){
      existing.photo_url=photoUrl;
      existing.storage_path=path;
    } else {
      state.highlights.push({week_key:currentWeek,photo_url:photoUrl,storage_path:path});
    }

    setTimeout(()=>{
      renderHighlights();
      toast('Saved to your collection');
    },300);
  }catch(e){
    console.error(e);
    toast('Upload failed — try again');
    if(progressWrap)progressWrap.style.display='none';
  }

  // Reset input so same file can be picked again if needed
  event.target.value='';
}

function compressImage(file,maxDim,quality){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        let{width,height}=img;
        if(width>height&&width>maxDim){
          height=Math.round(height*(maxDim/width));
          width=maxDim;
        } else if(height>maxDim){
          width=Math.round(width*(maxDim/height));
          height=maxDim;
        }
        const canvas=document.createElement('canvas');
        canvas.width=width;canvas.height=height;
        const ctx=canvas.getContext('2d');
        ctx.drawImage(img,0,0,width,height);
        canvas.toBlob(blob=>resolve(blob),'image/jpeg',quality);
      };
      img.onerror=reject;
      img.src=e.target.result;
    };
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

let currentLightboxKey=null;
function openLightbox(weekKey){
  const h=state.highlights.find(x=>x.week_key===weekKey);
  if(!h)return;
  currentLightboxKey=weekKey;
  $('lightboxImg').src=h.photo_url;
  $('lightboxMeta').textContent=getWeekRange(weekKey);
  $('lightbox').classList.add('show');
}
function closeLightbox(){
  $('lightbox').classList.remove('show');
  currentLightboxKey=null;
}
function replaceCurrentHighlight(){
  if(!currentLightboxKey)return;
  // Temporarily swap current week so upload replaces this one
  const original=getWeekKey();
  const replaceKey=currentLightboxKey;
  closeLightbox();
  // Trigger picker; on upload, point to this week instead
  const input=$('photoInput');
  const originalHandler=input.onchange;
  input.onchange=async function(e){
    input.onchange=originalHandler;
    const file=e.target.files[0];
    if(!file)return;
    if(!sb){toast('Cloud not connected');return}
    try{
      const compressed=await compressImage(file,1600,0.85);
      const ext=file.name.split('.').pop()||'jpg';
      const path=`${replaceKey}-${Date.now()}.${ext}`;
      const existing=state.highlights.find(h=>h.week_key===replaceKey);
      if(existing&&existing.storage_path){
        try{await sb.storage.from('kayley_highlights').remove([existing.storage_path])}catch(e){}
      }
      const {error}=await sb.storage.from('kayley_highlights').upload(path,compressed,{upsert:true,contentType:'image/jpeg'});
      if(error)throw error;
      const {data:urlData}=sb.storage.from('kayley_highlights').getPublicUrl(path);
      await sb.from('kayley_highlights').upsert({week_key:replaceKey,photo_url:urlData.publicUrl,storage_path:path},{onConflict:'week_key'});
      if(existing){existing.photo_url=urlData.publicUrl;existing.storage_path=path}
      renderHighlights();
      toast('Replaced');
    }catch(err){console.error(err);toast('Upload failed')}
    e.target.value='';
  };
  input.click();
}
async function deleteCurrentHighlight(){
  if(!currentLightboxKey)return;
  if(!confirm('Delete this highlight? This cannot be undone.'))return;
  const h=state.highlights.find(x=>x.week_key===currentLightboxKey);
  if(!h)return;
  try{
    if(h.storage_path)await sb.storage.from('kayley_highlights').remove([h.storage_path]);
    await sb.from('kayley_highlights').delete().eq('week_key',currentLightboxKey);
    state.highlights=state.highlights.filter(x=>x.week_key!==currentLightboxKey);
    closeLightbox();
    renderHighlights();
    toast('Deleted');
  }catch(e){toast('Delete failed')}
}

// ============== SUPABASE OPS ==============
async function sbInsert(p){
  if(!sb){console.warn('Supabase not connected');return false}
  try{
    const {data,error}=await sb.from('kayley_products').insert({product_id:p.id,name:p.name,category:p.cat,store:p.store,price:p.price,stock:p.stock,notes:p.notes,custom:true});
    if(error){console.error('Insert error:',error);return false}
    return true;
  }catch(e){console.error('Insert exception:',e);return false}
}
async function sbUpdate(p){
  if(!sb){console.warn('Supabase not connected');return false}
  try{
    const {data,error}=await sb.from('kayley_products').update({name:p.name,category:p.cat,store:p.store,price:p.price,stock:p.stock,notes:p.notes,updated_at:new Date().toISOString()}).eq('product_id',p.id);
    if(error){console.error('Update error:',error);return false}
    return true;
  }catch(e){console.error('Update exception:',e);return false}
}
async function sbDelete(id){
  if(!sb){console.warn('Supabase not connected');return false}
  try{
    const {error}=await sb.from('kayley_products').delete().eq('product_id',id);
    if(error){console.error('Delete error:',error);return false}
    return true;
  }catch(e){console.error('Delete exception:',e);return false}
}
async function sbUpsertWellness(data){
  if(!sb)return;
  saveLocal();
  try{await sb.from('kayley_wellness').upsert(data,{onConflict:'entry_date'})}catch(e){console.warn(e)}
}
async function sbSaveJournal(date,text){
  if(!sb)return;
  saveLocal();
  try{await sb.from('kayley_journal').upsert({entry_date:date,text},{onConflict:'entry_date'})}catch(e){console.warn(e)}
}
async function sbSetting(key,val){
  if(!sb)return;
  saveLocal();
  try{await sb.from('kayley_settings').upsert({key,value:val},{onConflict:'key'})}catch(e){console.warn(e)}
}

async function loadFromCloud(){
  // CACHE-FIRST: render instantly from localStorage, sync cloud in background
  loadLocal();
  if(!sb)return;
  syncFromCloud(); // no await — background
}

function withTimeout(promise,ms=4000){
  return Promise.race([promise,new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
}

async function syncFromCloud(){
  try{
    const [prodsR,wellR,jourR,setR,hiR]=await withTimeout(Promise.allSettled([
      sb.from('kayley_products').select('*').order('product_id'),
      (()=>{const weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-6);
        return sb.from('kayley_wellness').select('*').gte('entry_date',weekAgo.toISOString().split('T')[0]);})(),
      (()=>{const monthAgo=new Date();monthAgo.setDate(monthAgo.getDate()-30);
        return sb.from('kayley_journal').select('*').gte('entry_date',monthAgo.toISOString().split('T')[0]).order('entry_date',{ascending:false});})(),
      sb.from('kayley_settings').select('*'),
      sb.from('kayley_highlights').select('*').order('week_key',{ascending:false})
    ]),6000);

    const prods=prodsR.status==='fulfilled'?prodsR.value.data:null;
    if(prods&&prods.length>0){
      state.products=prods.map(p=>({id:p.product_id,name:p.name,cat:p.category,store:p.store,price:p.price,stock:p.stock,notes:p.notes}));
    } else if(prods&&prods.length===0&&(!state.products||state.products.length===0)){
      state.products=DEFAULT_PRODUCTS.map((p,i)=>({...p,id:i+1,stock:p.stock||'full'}));
      seedCloud();
    }

    const wellness=wellR.status==='fulfilled'?wellR.value.data:null;
    if(wellness){
      state.weekMoods=wellness.filter(w=>w.mood);
      const t=wellness.find(w=>w.entry_date===todayKey());
      if(t){
        state.todayMood=t.mood;
        if(t.bed_time){state.sleepData[todayKey()]={bed:t.bed_time,wake:t.wake_time}}
      }
    }

    const journal=jourR.status==='fulfilled'?jourR.value.data:null;
    if(journal)state.journalEntries=journal;

    const settings=setR.status==='fulfilled'?setR.value.data:null;
    if(settings){
      const pinSetting=settings.find(s=>s.key==='pin');
      if(pinSetting&&pinSetting.value)state.pin=pinSetting.value;
      const streakSetting=settings.find(s=>s.key==='streak');
      if(streakSetting)state.streak=Math.max(state.streak||0,Number(streakSetting.value)||0);
      settings.forEach(s=>{
        if(s.key&&s.key.startsWith('reflection_')&&s.value){
          state.reflections[s.key.replace('reflection_','')]=s.value;
        }
      });
    }

    const highlights=hiR.status==='fulfilled'?hiR.value.data:null;
    if(highlights)state.highlights=highlights;

    saveLocal();
    // Re-render whatever page we're on with fresh data
    if(typeof renderLanding==='function'&&$('landing'))renderLanding();
    if(typeof renderSkincare==='function'&&$('skincare'))renderSkincare();
    if(typeof renderProducts==='function'&&$('productsList'))renderProducts();
    if(typeof renderScripture==='function'&&$('verseCard'))renderScripture();
    if(typeof renderWellness==='function'&&$('wellness'))renderWellness();
  }catch(e){
    console.warn('cloud sync failed, staying on local cache',e);
  }
}

async function seedCloud(){
  if(!sb)return;
  try{
    const rows=state.products.map(p=>({product_id:p.id,name:p.name,category:p.cat,store:p.store,price:p.price,stock:p.stock||'full',notes:p.notes,custom:false}));
    await sb.from('kayley_products').insert(rows);
  }catch(e){console.warn('seed failed',e)}
}

function saveLocal(){
  try{
    localStorage.setItem('kw_state',JSON.stringify({
      products:state.products,
      pin:state.pin,
      todayMood:state.todayMood,
      sleepData:state.sleepData,
      streak:state.streak,
      reflections:state.reflections,
      journalEntries:state.journalEntries,
      weekMoods:state.weekMoods,
      highlights:state.highlights,
      lastSeen:todayKey()
    }));
  }catch(e){}
}
function loadLocal(){
  try{
    const raw=localStorage.getItem('kw_state');
    if(raw){
      const s=JSON.parse(raw);
      state.products=s.products&&s.products.length?s.products:DEFAULT_PRODUCTS.map((p,i)=>({...p,id:i+1,stock:p.stock||'full'}));
      state.pin=s.pin||null;
      state.todayMood=s.lastSeen===todayKey()?(s.todayMood||null):null;
      state.sleepData=s.sleepData||{};
      state.streak=s.streak||0;
      state.reflections=s.reflections||{};
      state.journalEntries=s.journalEntries||[];
      state.weekMoods=s.weekMoods||[];
      state.highlights=s.highlights||[];
    } else {
      state.products=DEFAULT_PRODUCTS.map((p,i)=>({...p,id:i+1,stock:p.stock||'full'}));
    }
  }catch(e){
    state.products=DEFAULT_PRODUCTS.map((p,i)=>({...p,id:i+1,stock:p.stock||'full'}));
  }
}

function updateStreak(){
  // Increment streak if used app today, reset if missed yesterday
  const last=localStorage.getItem('kw_lastVisit');
  const today=todayKey();
  if(last===today)return; // already counted
  const yest=new Date();yest.setDate(yest.getDate()-1);
  const yestKey=yest.toISOString().split('T')[0];
  if(last===yestKey){state.streak++}
  else if(last!==today){state.streak=1}
  localStorage.setItem('kw_lastVisit',today);
  if(sb)sbSetting('streak',String(state.streak));
}

// ============== INIT ==============
// Each page handles its own init() — shared.js does not auto-run one.

