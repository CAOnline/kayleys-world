
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
  ceNotes:{},
  studyNotes:[],
  routineSwaps:{},
  swapTarget:null,
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
{ref:"Psalm 46:10",trans:"kjv",text:"Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",context:"Written during national upheaval — wars, shaking mountains, roaring waters — and the psalmist offers a single command: stillness.",meaning:"To 'be still' is not passivity. The Hebrew implies cease striving, let your hands fall, stop trying to control. Deliberate surrender — not weakness, but trust.",application:"When the day feels too loud and your heart too tired — pause. The God who holds galaxies also holds you.",prompt:"Where in your life are you striving hardest right now?"},
{ref:"Mark 1:1",trans:"modern",text:"The beginning of the good news about Jesus the Messiah, the Son of God.",context:"Mark opens his Gospel with a thunderclap — no genealogy, no birth story, straight to the claim: this is good news, and Jesus is the Son of God.",meaning:"Mark calls his whole account 'gospel' — good news, not good advice. Something that has happened, not something you must do.",application:"Today, let faith be news you receive rather than a performance you deliver.",prompt:"What would change if you treated faith as news rather than a to-do list?"},
{ref:"Mark 2:17",trans:"modern",text:"It is not the healthy who need a doctor, but those who are ill. I have not come to call the righteous, but sinners.",context:"Jesus is eating with tax collectors and outcasts, scandalising the religious elite. This is his answer to their disgust.",meaning:"Jesus positions himself as a doctor — meaning the qualification for coming to him is not being well, but admitting you're not.",application:"You don't have to tidy yourself up before you pray. Come as the patient, not the physician.",prompt:"What part of you have you been hiding, thinking it disqualifies you?"},
{ref:"Mark 4:39",trans:"kjv",text:"And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.",context:"A furious squall on Galilee, seasoned fishermen terrified, and Jesus asleep on a cushion. They wake him, and he speaks to weather like it's a misbehaving child.",meaning:"Mark wants you to ask the disciples' question: 'Who is this? Even the wind and waves obey him.' Authority over chaos itself.",application:"Whatever storm is loud today — speak his name into it. The one who silenced Galilee has not lost his voice.",prompt:"What storm do you need to invite him into rather than ride out alone?"},
{ref:"Mark 8:29",trans:"modern",text:"'But what about you?' he asked. 'Who do you say I am?' Peter answered, 'You are the Messiah.'",context:"The hinge of Mark's whole Gospel. Halfway through, Jesus stops asking what the crowds say and makes it personal.",meaning:"Everyone must answer this question themselves. Second-hand opinions about Jesus don't count — Jesus asks 'who do YOU say I am?'",application:"Today, answer it fresh. Not what church says, not what family says — what do you say?",prompt:"Who do you say Jesus is — honestly, today?"},
{ref:"Mark 8:36",trans:"kjv",text:"For what shall it profit a man, if he shall gain the whole world, and lose his own soul?",context:"Jesus has just told the crowd that following him means denying self and taking up a cross. Then he does the maths.",meaning:"The most searching cost-benefit analysis ever posed. Every gain in the world's column can be outweighed by one loss in the soul's.",application:"Check what you're trading your hours for today. Some wins are losses in disguise.",prompt:"What are you gaining right now — and what is it costing you?"},
{ref:"Mark 10:45",trans:"modern",text:"For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",context:"James and John have just asked for thrones. Jesus flips the whole idea of greatness on its head — and states his mission in one line.",meaning:"'Ransom' is a rescue price. Jesus declares his death is not tragedy but purpose — a deliberate payment to set people free.",application:"Greatness today looks like serving someone who can't repay you.",prompt:"Who could you serve today with no expectation of return?"},
{ref:"Mark 12:30-31",trans:"modern",text:"Love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength. Love your neighbour as yourself.",context:"Asked to pick the greatest of 613 commandments, Jesus gives two that contain all the rest.",meaning:"All of faith distilled: total love upward, honest love outward. Notice it assumes you also treat yourself with care — you can't pour from an empty vessel.",application:"Loving your neighbour as yourself includes not speaking to yourself in ways you'd never speak to a friend.",prompt:"Which of the two loves needs attention today — upward, outward, or the quiet third one, inward?"},
{ref:"Mark 15:39",trans:"modern",text:"And when the centurion, who stood there in front of Jesus, saw how he died, he said, 'Surely this man was the Son of God!'",context:"A hardened Roman executioner, who had watched hundreds die, watches this death — and becomes the first human in Mark to declare it fully.",meaning:"Mark's Gospel opens with the claim 'Son of God' and closes with a pagan soldier agreeing at the foot of the cross. The cross is the proof, not the defeat.",application:"When faith feels shaky, go stand where the centurion stood. Look at the cross and draw your conclusion again.",prompt:"What does the cross say to you, personally, today?"},
{ref:"Mark 16:6",trans:"modern",text:"Don't be alarmed. You are looking for Jesus the Nazarene, who was crucified. He has risen! He is not here.",context:"Women arrive at dawn to anoint a corpse and find an empty tomb and an angel with the most important sentence in history.",meaning:"Christianity stands or falls here. Not a philosophy that survived its founder — a founder who survived his execution.",application:"Whatever feels dead in your life — hope, a dream, a relationship with God — resurrection is his speciality.",prompt:"What have you written off as dead that God might not be finished with?"},
{ref:"Isaiah 41:10",trans:"kjv",text:"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",context:"Spoken to a nation in exile, far from home, certain they'd been forgotten.",meaning:"Five promises stacked in one verse: presence, identity, strength, help, upholding. Fear is answered not with arguments but with company.",application:"You are not asked to be fearless alone. You're promised company inside the fear.",prompt:"What would today look like if you truly believed you weren't facing it alone?"},
{ref:"Zephaniah 3:17",trans:"modern",text:"The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",context:"Buried in one of the shortest, sternest prophetic books — a sudden burst of tenderness.",meaning:"God doesn't merely tolerate you. He delights, quiets, and sings. The warrior image and the lullaby image in the same breath.",application:"Sit with this one: God sings over you. Let that be louder than the inner critic today.",prompt:"When did you last let yourself feel delighted in, rather than merely tolerated?"},
{ref:"Matthew 11:28",trans:"kjv",text:"Come unto me, all ye that labour and are heavy laden, and I will give you rest.",context:"Jesus speaking to people crushed by religious burden — endless rules stacked on tired shoulders.",meaning:"The invitation has one qualification: being tired. Not being good, sorted, or certain. Just weary.",application:"Rest is not a reward for finishing everything. It's an invitation that stands open right now.",prompt:"What burden are you carrying that was never yours to carry?"},
{ref:"John 8:12",trans:"modern",text:"I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.",context:"Spoken at the temple during the Festival of Tabernacles, as giant lamps lit up Jerusalem — Jesus points at them and says: that's me.",meaning:"Light doesn't argue with darkness. It just outshines it. Following isn't about perfect steps, but direction of travel.",application:"You don't need the whole path lit — just the next step.",prompt:"What's the one next step the light is showing you?"},
{ref:"John 10:10",trans:"kjv",text:"The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.",context:"Jesus contrasts himself with everything that drains and diminishes.",meaning:"Two agendas in one verse — one that subtracts from your life, one that multiplies it. Abundance here means fullness, not luxury.",application:"Audit today by this verse: which voices and habits steal life, and which multiply it?",prompt:"What in your daily rhythm gives life — and what steals it?"},
{ref:"John 14:27",trans:"kjv",text:"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",context:"The night before the cross. Jesus, hours from betrayal, is comforting them.",meaning:"His peace isn't circumstantial — he offers it on the worst night of his life. World-peace depends on conditions; his doesn't.",application:"Peace independent of circumstances is possible. Breathe it in before the day makes its demands.",prompt:"Where are you waiting for circumstances to change before you allow yourself peace?"},
{ref:"Romans 8:1",trans:"modern",text:"Therefore, there is now no condemnation for those who are in Christ Jesus.",context:"Paul's mid-letter crescendo, after seven chapters wrestling with sin and failure.",meaning:"'No condemnation' is a courtroom verdict, already delivered. The case is closed even when the inner prosecutor keeps talking.",application:"When the inner critic reopens the case today, remind it the verdict is in.",prompt:"What old verdict against yourself are you still serving time for?"},
{ref:"Romans 8:28",trans:"kjv",text:"And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",context:"Written by a man who had been shipwrecked, beaten, and imprisoned — not naive optimism.",meaning:"Not everything is good. But nothing is wasted. God's economy recycles even wreckage into purpose.",application:"The chapter you're in isn't the whole story. Wait for the weaving.",prompt:"Looking back, what hard thing turned out to carry hidden good?"},
{ref:"Romans 12:2",trans:"modern",text:"Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",context:"Paul pivots from theology to daily living — starting with the mind.",meaning:"Transformation runs through thought patterns. What you feed the mind shapes the life — renewal is a practice, not a moment.",application:"Notice one recurring thought today and ask: is this a pattern I want to keep?",prompt:"What thought pattern needs renewing most right now?"},
{ref:"1 Corinthians 13:4-5",trans:"modern",text:"Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonour others, it is not self-seeking.",context:"Written to a church in conflict, dropped like a plumb line into their arguments.",meaning:"Every clause is behavioural, not emotional. Love here is a way of acting, available even on days you don't feel it.",application:"Pick one clause and practise it deliberately on one person today.",prompt:"Which clause is hardest for you — and with whom?"},
{ref:"2 Corinthians 12:9",trans:"kjv",text:"My grace is sufficient for thee: for my strength is made perfect in weakness.",context:"Paul begged three times for a painful 'thorn' to be removed. This was the answer — not removal, but sufficiency.",meaning:"God's power doesn't wait for you to be strong. Weakness is not the obstacle to grace; it's the venue.",application:"The thing you're most ashamed of struggling with may be exactly where grace wants to work.",prompt:"What weakness might you stop fighting and start offering?"},
{ref:"Galatians 2:20",trans:"kjv",text:"I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me.",context:"Paul describing the exchange at the heart of faith — an old self ended, a new life begun.",meaning:"Identity is no longer self-built. The exhausting project of constructing yourself is replaced by receiving a life.",application:"You don't have to invent yourself today. You're allowed to simply live loved.",prompt:"What part of your self-image are you most tired of maintaining?"},
{ref:"Ephesians 2:8-9",trans:"kjv",text:"For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: not of works, lest any man should boast.",context:"Paul dismantling the idea that anyone earns their way to God.",meaning:"Gift, not wage. The whole structure of earning collapses — which is terrifying to pride and glorious to exhaustion.",application:"Today, practise receiving without immediately trying to repay.",prompt:"Why is receiving freely harder for you than earning?"},
{ref:"Philippians 4:6-7",trans:"modern",text:"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds.",context:"Written from a prison cell — Paul isn't theorising about anxiety from a comfortable distance.",meaning:"The verse gives a mechanism, not a scolding: anxiety is rerouted through prayer with thanksgiving, and peace stands guard like a sentry.",application:"Next anxious spiral: name it, pray it, add one genuine thank-you, and let the sentry take the door.",prompt:"What's one anxiety you could convert into a prayer right now?"},
{ref:"Philippians 4:13",trans:"kjv",text:"I can do all things through Christ which strengtheneth me.",context:"The 'all things' in context is contentment — Paul had learned to be steady in plenty and in hunger.",meaning:"Less a superhero slogan, more a secret of endurance: strength arrives for whatever state you're actually in.",application:"Strength for today's actual circumstances is promised — not for imaginary ones.",prompt:"What situation needs endurance-strength rather than escape?"},
{ref:"Colossians 3:12",trans:"modern",text:"Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",context:"Paul uses a getting-dressed metaphor — character as clothing you deliberately put on.",meaning:"Notice the order: identity first ('chosen, holy, dearly loved'), behaviour second. You dress from who you are, not to become it.",application:"As you do your morning ritual, mentally 'put on' one of the five garments for the day.",prompt:"Which garment does today require — compassion, kindness, humility, gentleness or patience?"},
{ref:"Hebrews 4:16",trans:"kjv",text:"Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.",context:"Written to believers tempted to shrink back, reminding them the throne room door is open.",meaning:"Boldly — not grovelling, not sneaking. The throne is named for grace, not judgement, and its supply is timed to need.",application:"Approach today's prayers like a welcomed child, not a nervous applicant.",prompt:"What have you been too hesitant to actually ask for?"},
{ref:"Hebrews 12:1-2",trans:"modern",text:"Let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus.",context:"After a whole chapter listing heroes of faith — you're pictured running with a stadium of witnesses cheering.",meaning:"The race is 'marked out for us' — your lane, not someone else's. And the technique is eye-line: you drift toward whatever you stare at.",application:"Comparison is running in someone else's lane. Run yours today.",prompt:"Whose lane have you been staring at instead of your own?"},
{ref:"James 1:5",trans:"modern",text:"If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",context:"James writing to scattered, pressured believers making hard decisions.",meaning:"'Without finding fault' — God doesn't sigh at your questions. Wisdom is promised to the asker, not the already-wise.",application:"That decision you're chewing on? Ask. Out loud. Before you doom-scroll for answers.",prompt:"What decision needs wisdom rather than more information?"},
{ref:"1 Peter 5:7",trans:"kjv",text:"Casting all your care upon him; for he careth for you.",context:"Peter — who knew about failure and restoration — writing to suffering churches.",meaning:"'Casting' is a violent, deliberate throw, like heaving a load off a cart. And the reason is startlingly tender: he cares about you.",application:"Anxiety isn't managed by gripping tighter. Throw it. Properly.",prompt:"What care are you still holding that was meant to be thrown?"},
{ref:"1 John 1:9",trans:"kjv",text:"If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",context:"John writing so believers wouldn't live in either denial or despair about failure.",meaning:"Confession isn't informing God of something he missed — it's agreeing with him so the wound can be cleaned. Faithful and just: forgiveness is his character, not his mood.",application:"Whatever's sitting heavy on your conscience: say it, receive the cleansing, walk lighter.",prompt:"What do you need to finally say out loud to God?"},
{ref:"Proverbs 3:5-6",trans:"kjv",text:"Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",context:"A father's advice to a child, distilling a lifetime of wisdom.",meaning:"Your understanding is a real tool but a poor foundation. Leaning is about where you put your full weight.",application:"Make today's decisions with your mind but rest your weight on something steadier than your own analysis.",prompt:"Where is leaning on your own understanding exhausting you?"},
{ref:"Psalm 23:1-3",trans:"kjv",text:"The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.",context:"David, once a shepherd himself, describing God with the job he knew best.",meaning:"Sheep don't lie down while anxious — the shepherd 'maketh' rest possible by removing threats. Restoration is on the itinerary.",application:"Rest is not laziness; it's shepherded. Let yourself be led to still waters today.",prompt:"What would 'soul restoration' actually look like for you this week?"},
{ref:"Psalm 34:18",trans:"modern",text:"The LORD is close to the broken-hearted and saves those who are crushed in spirit.",context:"David wrote this while fleeing for his life, pretending madness to survive.",meaning:"God's geography: nearest at the lowest points. Brokenness doesn't repel him — it draws him.",application:"On the days you feel furthest from okay, you are not furthest from God.",prompt:"Can you let God be close to the broken part instead of only the presentable part?"},
{ref:"Psalm 121:1-2",trans:"kjv",text:"I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.",context:"A pilgrim song, sung while walking dangerous mountain roads to Jerusalem.",meaning:"The question 'where does help come from' gets a maker-of-everything answer. Help with cosmic credentials.",application:"Lift your eyes today — literally. Look up from the phone, the desk, the worry.",prompt:"Where have you been looking for help lately?"},
{ref:"Psalm 139:13-14",trans:"kjv",text:"For thou hast possessed my reins: thou hast covered me in my mother's womb. I will praise thee; for I am fearfully and wonderfully made.",context:"David marvelling that God's knowledge of him precedes his own existence.",meaning:"You were crafted, not assembled. 'Fearfully and wonderfully' — with awe and wonder, deliberately.",application:"Tonight in the mirror, mid-routine: fearfully and wonderfully made. Say it like you mean it.",prompt:"What would change if you treated your body as crafted rather than criticised?"},
{ref:"Lamentations 3:22-23",trans:"kjv",text:"It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",context:"Written in the smoking ruins of Jerusalem — hope declared from inside catastrophe.",meaning:"Mercy operates on a daily delivery schedule. Yesterday's failures don't carry into today's account.",application:"Every morning routine is a small liturgy of this: new day, new mercy, fresh start.",prompt:"What from yesterday do you need to leave in yesterday?"},
{ref:"Jeremiah 29:11",trans:"modern",text:"'For I know the plans I have for you,' declares the LORD, 'plans to prosper you and not to harm you, plans to give you hope and a future.'",context:"Spoken to exiles facing seventy years in Babylon — a long-game promise, not a quick fix.",meaning:"The promise wasn't instant rescue but purposeful presence through the long middle. Hope with a horizon.",application:"You can endure a long chapter when you trust the author.",prompt:"What long season are you in — and can you trust there's a plan inside it?"},
{ref:"Micah 6:8",trans:"modern",text:"He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.",context:"Micah answers the anxious question 'what does God actually want from me?' with startling simplicity.",meaning:"Not more sacrifice, more performance, more religious production. Three verbs: act, love, walk.",application:"Faith today can be this simple: one just act, one merciful response, one humble step.",prompt:"Which of the three verbs is your growth edge?"},
{ref:"Habakkuk 3:17-18",trans:"modern",text:"Though the fig-tree does not bud and there are no grapes on the vines... yet I will rejoice in the LORD, I will be joyful in God my Saviour.",context:"A prophet choosing joy while describing total economic collapse — every crop failed, every pen empty.",meaning:"'Though... yet' — the grammar of defiant joy. Joy anchored in God survives the failure of everything else.",application:"Joy isn't dishonest about hard circumstances. It just refuses to let them have the last word.",prompt:"What's your 'though' right now — and can you find the 'yet'?"},
{ref:"Isaiah 40:31",trans:"kjv",text:"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",context:"Spoken to an exhausted, exiled people who felt God had forgotten them.",meaning:"Notice the descent: soaring, running, walking. Sometimes the miracle isn't flying — it's not fainting. Strength for each pace of life.",application:"Some seasons are walking seasons. Not fainting is a victory.",prompt:"Which pace are you in — soaring, running, or just walking without fainting?"},
{ref:"Isaiah 43:2",trans:"modern",text:"When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you. When you walk through the fire, you will not be burned.",context:"God's promise to a people who had known both flood and fire, literally and figuratively.",meaning:"Notice: 'when', not 'if'. And 'through', not 'around'. The promise is company and passage, not exemption.",application:"You're not promised a detour around hard things — you're promised through, accompanied.",prompt:"What are you currently passing through — and where is the evidence you're not alone in it?"},
{ref:"Deuteronomy 31:8",trans:"modern",text:"The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.",context:"Moses handing over to Joshua before the biggest challenge of his life.",meaning:"'Goes before you' — God is already in your tomorrow, arranging things, before you arrive.",application:"The future you're anxious about is already occupied territory — by him.",prompt:"What upcoming thing could you reframe as 'already gone before'?"},
{ref:"Joshua 1:9",trans:"kjv",text:"Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",context:"God's commissioning speech to Joshua, repeated three times in one chapter because he clearly needed it.",meaning:"Courage is commanded, which means it's a choice available even when the feeling isn't. And it's grounded in company, not competence.",application:"Courage isn't the absence of fear — it's fear that has said its prayers.",prompt:"Where do you need commanded courage rather than waiting for felt courage?"},
{ref:"1 Enoch 1:8",trans:"enoch",text:"But with the righteous He will make peace, and will protect the elect, and mercy shall be upon them. And they shall all belong to God, and they shall be prospered, and they shall all be blessed.",context:"From the opening vision of the Book of Enoch — the ancient text quoted in Jude, treasured at Qumran, preserved by the Ethiopian church.",meaning:"Amid Enoch's dramatic visions of judgement, this promise: peace, protection, mercy and belonging for those aligned with God.",application:"Whatever the world's chaos, the trajectory for those who belong to God bends toward peace.",prompt:"What does 'belonging to God' mean to you in practical, daily terms?"},
{ref:"1 Enoch 5:7",trans:"enoch",text:"But for the elect there shall be light and joy and peace, and they shall inherit the earth.",context:"Enoch contrasts the fate of the faithless with a threefold promise — a line Jesus echoes in the Beatitudes: 'the meek shall inherit the earth'.",meaning:"Light, joy, peace, inheritance. The ancient hope wasn't escape from the world but its renewal — and a place in it.",application:"Live today as someone with an inheritance, not someone scrambling for scraps.",prompt:"Which do you need most today — light, joy, or peace?"},
{ref:"1 Enoch 104:2",trans:"enoch",text:"Be hopeful; for aforetime ye were put to shame through ill and affliction; but now ye shall shine as the lights of heaven, ye shall shine and ye shall be seen.",context:"Enoch's word to the righteous who suffered unseen — a promise of reversal and radiance.",meaning:"Shame swapped for shining. What was hidden and hurt becomes luminous and visible. Daniel 12:3 carries the same image.",application:"Past shame does not get to write your future. You were made to shine and be seen.",prompt:"What old shame is ready to be traded for light?"},
{ref:"Matthew 5:14-16",trans:"modern",text:"You are the light of the world. A town built on a hill cannot be hidden... let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",context:"From the Sermon on the Mount — Jesus tells ordinary fishermen and farmers what they now are.",meaning:"Not 'try to become light' — you ARE light. The only instruction is placement: don't hide it.",application:"Shining today might be as small as genuine kindness at work. Small lights still defeat darkness.",prompt:"Where are you currently hiding light that's meant to be visible?"},
{ref:"Matthew 6:34",trans:"modern",text:"Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",context:"Jesus closing his teaching on anxiety with disarming practicality.",meaning:"Grace is issued in daily rations, like manna. Borrowing tomorrow's troubles means facing them without tomorrow's grace.",application:"Just today. Handle just today. Tomorrow's version of you will have tomorrow's strength.",prompt:"What tomorrow-problem are you trying to solve with today's limited rations?"},
{ref:"Matthew 7:7",trans:"kjv",text:"Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.",context:"Jesus teaching on prayer with three escalating verbs — asking, seeking, knocking.",meaning:"Persistence is invited, not resented. The verbs are present continuous: keep asking, keep seeking, keep knocking.",application:"That prayer you gave up on? Knock again.",prompt:"What did you stop asking for that you should resume?"},
{ref:"John 15:5",trans:"modern",text:"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",context:"Jesus's last extended teaching before the cross, using the vineyard outside Jerusalem as a living illustration.",meaning:"Fruit is the byproduct of connection, not effort. Branches don't strain to produce grapes — they stay attached.",application:"Today's priority isn't producing more — it's staying connected. The fruit follows.",prompt:"What does 'remaining' practically look like in your week?"},
{ref:"John 16:33",trans:"modern",text:"I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.",context:"Jesus's final sentence to his disciples before praying and walking to his arrest.",meaning:"Brutal honesty and blazing hope in one breath: trouble is guaranteed, and so is his victory over it.",application:"Expect trouble without being surprised by it; expect victory without earning it.",prompt:"How does 'he has overcome' change how you face this week's trouble?"},
{ref:"Psalm 27:1",trans:"kjv",text:"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?",context:"David writing surrounded by literal enemies, armies encamped against him.",meaning:"Two rhetorical questions that answer themselves. Fear shrinks when set beside the size of the protector.",application:"Name today's fear, then set it next to 'the strength of my life' and compare sizes.",prompt:"Whom — or what — shall you fear? Actually list it, then answer it."},
{ref:"Psalm 118:24",trans:"kjv",text:"This is the day which the LORD hath made; we will rejoice and be glad in it.",context:"From a processional psalm sung entering the temple — the same psalm Jesus quoted about the rejected stone.",meaning:"Today is made, given, deliberate. Rejoicing is a decision made before checking the day's contents.",application:"Gladness as a choice, first thing, before the day earns it.",prompt:"Can you rejoice in the day itself, before knowing how it goes?"},
{ref:"Ecclesiastes 3:11",trans:"modern",text:"He has made everything beautiful in its time. He has also set eternity in the human heart.",context:"The Teacher, after surveying life's seasons, concludes with this quiet stunner.",meaning:"Two claims: timing matters to beauty, and your longing for 'more than this' is factory-installed, not a malfunction.",application:"The ache for meaning isn't a problem to fix — it's a compass to follow.",prompt:"Where does the 'eternity in your heart' ache most these days?"},
{ref:"2 Timothy 1:7",trans:"kjv",text:"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",context:"Paul's final letter, written from death row to a timid young pastor he loved like a son.",meaning:"Fear's origin is disowned — it's not from God. What is: power, love, and a sound (disciplined, calm) mind.",application:"When anxiety claims to be realistic, check the source. The sound mind is your inheritance.",prompt:"Which gift do you need to claim today — power, love, or the sound mind?"},
{ref:"Revelation 21:4",trans:"kjv",text:"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",context:"The Bible's closing vision — not clouds and harps, but a renewed earth and a God close enough to touch faces.",meaning:"The wiping of tears is intimate, parental, individual. History ends not in destruction but in comfort.",application:"Every current grief has an expiry date. Hope is not naive — it's calendared.",prompt:"What tear are you most looking forward to having wiped away?"},
{ref:"Numbers 6:24-26",trans:"kjv",text:"The LORD bless thee, and keep thee: the LORD make his face shine upon thee, and be gracious unto thee: the LORD lift up his countenance upon thee, and give thee peace.",context:"The blessing God commanded the priests to speak over the people — some of the oldest words in the Bible, found on silver scrolls older than the Dead Sea Scrolls.",meaning:"God's face 'shining' on you is the Hebrew image of a delighted parent looking at a beloved child.",application:"Receive this over yourself tonight, name inserted: 'The LORD bless you, Kayley, and keep you...'",prompt:"What would it feel like to live a whole day under a shining face rather than a suspicious one?"},
{ref:"Galatians 5:22-23",trans:"modern",text:"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",context:"Paul contrasting what grows naturally from God's Spirit versus what grows from self-effort.",meaning:"Fruit, singular — one cluster, nine flavours. And fruit grows; it isn't manufactured. Conditions, not straining.",application:"Pick one of the nine and water it deliberately today.",prompt:"Which of the nine is most in season for you — and which needs watering?"},
{ref:"Psalm 51:10",trans:"kjv",text:"Create in me a clean heart, O God; and renew a right spirit within me.",context:"David's prayer after his worst failure was exposed — the prayer of a man with nothing left to hide.",meaning:"'Create' is the same word as Genesis 1 — making something from nothing. David asks for new creation, not renovation.",application:"No failure is beyond the God who creates from nothing. Fresh hearts are his speciality.",prompt:"What would you ask God to create brand new in you?"}
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

function slotKey(title){
  return (state.time+'_'+title).toLowerCase().replace(/[^a-z0-9]+/g,'_');
}

// Map each routine step title to the shelf category it draws from
const STEP_CATEGORY={
  'cleanse':'cleansers','second cleanse':'cleansers','remove the day':'cleansers',
  'hypochlorous mist':'toners','energising mist':'toners','tone':'toners','skip toner — retinol night':'toners',
  'serums':'serums','glow serums':'serums','treat & calm':'serums','ha buffer':'serums','retinol':'serums',
  'spot treat':'serums','spot patch':'serums','treatment mask':'masks','after mask':'serums',
  'eye care':'eyes','moisturise':'moisturisers','moisturise & seal':'moisturisers','after mask ':'moisturisers',
  'spf — non-negotiable':'sunscreen','prime':'body','lips':'lips','lip care':'lips',
  'led therapy':'tools','lymphatic drainage':'tools','energising mist ':'toners'
};

function outputSteps(steps){
  const html=steps.map((s,i)=>{
    const key=slotKey(s.title);
    const swap=state.routineSwaps[key];
    let toolGuideHTML='';
    if(s.toolGuide){
      toolGuideHTML=`<div class="tool-guide">
        <div class="tool-pill"><strong>Brush</strong>Deep cleanse, oily days, 2-3×/wk</div>
        <div class="tool-pill"><strong>Silicone</strong>Gentle daily, sensitive</div>
        <div class="tool-pill"><strong>Exfoliating</strong>1-2×/wk glow, never broken skin</div>
        <div class="tool-pill"><strong>Massage</strong>Circulation, any day</div>
      </div>`;
    }

    // If Kayley swapped this slot to her own product, show hers as the lead line
    let productLines;
    if(swap){
      productLines=`<div class="product-line product-line-swapped">
          <div class="product-bullet" style="background:var(--gold)"></div>
          <div style="flex:1">
            <strong>${swap.name} <span class="your-pick">your pick</span></strong>
            ${swap.note?`<div class="product-meta">${swap.note}</div>`:''}
            <div class="swap-orig">was: ${swap.origName}</div>
          </div>
          <button class="swap-reset" onclick="resetSwap('${key}')" title="restore default">↺</button>
        </div>`;
    } else {
      productLines=s.products.map((p,pi)=>`<div class="product-line">
          <div class="product-bullet"></div>
          <div style="flex:1"><strong>${p.p}</strong>${p.m?`<div class="product-meta">${p.m}</div>`:''}</div>
          ${pi===0?`<button class="swap-btn" onclick="openSwap('${key}','${s.title.replace(/'/g,"")}', '${(s.products[0].p).replace(/'/g,"")}')" title="use my own">swap</button>`:''}
        </div>`).join('');
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
        ${productLines}
      </div>
      ${toolGuideHTML}
      ${s.note?`<div class="step-note">${s.note}</div>`:''}
    </div>`;
  }).join('');
  $('routine').innerHTML=html;
}

// ── Swap picker ──
function openSwap(key,title,origName){
  state.swapTarget={key,title,origName};
  const cat=STEP_CATEGORY[title.toLowerCase()]||null;
  let pool=state.products.filter(p=>p.stock!=='empty');
  if(cat)pool=pool.filter(p=>p.cat===cat);
  if(pool.length===0)pool=state.products.filter(p=>p.stock!=='empty'); // fall back to whole shelf

  const modal=document.getElementById('swapModal');
  const body=document.getElementById('swapModalBody');
  if(!modal||!body)return;
  document.getElementById('swapModalTitle').textContent='Use your own for "'+title+'"';
  document.getElementById('swapModalSub').textContent=cat?('From your '+(CATEGORY_LABELS[cat]||cat)):'From your shelf';

  if(pool.length===0){
    body.innerHTML='<div class="empty" style="padding:30px 10px">Nothing on your shelf for this step yet. Add products on the Shelf page first.</div>';
  } else {
    body.innerHTML=pool.map(p=>`<div class="swap-option" onclick="applySwap(${p.id})">
      <div class="stock-dot stock-${p.stock||'full'}"></div>
      <div style="flex:1">
        <div class="swap-option-name">${p.name}</div>
        <div class="swap-option-meta">${[CATEGORY_LABELS[p.cat]||p.cat,p.store].filter(Boolean).join(' · ')}</div>
      </div>
    </div>`).join('');
  }
  modal.classList.add('show');
}

function applySwap(productId){
  const p=state.products.find(x=>x.id===productId);
  if(!p||!state.swapTarget)return;
  state.routineSwaps[state.swapTarget.key]={
    name:p.name,
    note:p.notes||'',
    origName:state.swapTarget.origName
  };
  saveLocal();
  sbSetting('routine_swaps',JSON.stringify(state.routineSwaps));
  closeSwapModal();
  renderSkincare();
  toast('Swapped to '+p.name+' ✓');
}

function resetSwap(key){
  delete state.routineSwaps[key];
  saveLocal();
  sbSetting('routine_swaps',JSON.stringify(state.routineSwaps));
  renderSkincare();
  toast('Default restored');
}

function closeSwapModal(){
  document.getElementById('swapModal')?.classList.remove('show');
  state.swapTarget=null;
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
        if(s.key&&s.key.startsWith('ce_notes_')&&s.value){
          state.ceNotes[s.key.replace('ce_notes_','')]=s.value;
        }
        if(s.key==='study_notes'&&s.value){
          try{state.studyNotes=JSON.parse(s.value)}catch(e){}
        }
        if(s.key==='routine_swaps'&&s.value){
          try{state.routineSwaps=JSON.parse(s.value)}catch(e){}
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
      ceNotes:state.ceNotes,
      studyNotes:state.studyNotes,
      routineSwaps:state.routineSwaps,
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
      state.ceNotes=s.ceNotes||{};
      state.studyNotes=s.studyNotes||[];
      state.routineSwaps=s.routineSwaps||{};
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


// ============== ROUTINE vs SHELF CHECK ==============
function checkRoutineAgainstShelf(){
  const lines = document.querySelectorAll('#routine .product-line strong');
  const needed = Array.from(lines).map(el=>el.textContent.trim()).filter(t=>
    !t.toLowerCase().includes('splash of water') &&
    !t.toLowerCase().startsWith('or ') &&
    !t.toLowerCase().includes('acts as your buffer')
  );

  const shelfNames = state.products.map(p=>p.name.toLowerCase());

  function normalize(s){
    return s.toLowerCase()
      .replace(/\(.*?\)/g,'')
      .replace(/[^a-z0-9\s]/g,'')
      .split(/\s+/)
      .filter(w=>w.length>2 && !['the','and','for','with','your'].includes(w));
  }

  const missing=[];
  const low=[];
  needed.forEach(name=>{
    const words = normalize(name);
    const match = state.products.find(p=>{
      const pWords = normalize(p.name);
      const overlap = words.filter(w=>pWords.some(pw=>pw.includes(w)||w.includes(pw)));
      return overlap.length >= Math.min(2, words.length) || pWords.some(pw=>name.toLowerCase().includes(pw)&&pw.length>3);
    });
    if(!match){
      if(!missing.includes(name)) missing.push(name);
    } else if(match.stock==='empty'||match.stock==='low'){
      if(!low.find(l=>l.name===name)) low.push({name,stock:match.stock,productName:match.name});
    }
  });

  renderCheckResults(missing, low);
}

function renderCheckResults(missing, low){
  const modal = document.getElementById('checkModal');
  const body = document.getElementById('checkModalBody');
  if(!modal||!body) return;

  if(missing.length===0 && low.length===0){
    body.innerHTML = `<div class="check-all-good">
      <div class="check-icon">✓</div>
      <div class="check-title">You're fully stocked</div>
      <div class="check-sub">Everything in today's routine is on your shelf and ready to go.</div>
    </div>`;
  } else {
    let html = '';
    if(low.length){
      html += `<div class="check-section-label">Running low</div>`;
      html += low.map(l=>`<div class="check-row check-row-low">
        <div class="stock-dot stock-${l.stock}"></div>
        <div class="check-row-text"><strong>${l.productName}</strong><div class="check-row-sub">used tonight — ${l.stock==='empty'?'empty, needs replacing':'getting low'}</div></div>
      </div>`).join('');
    }
    if(missing.length){
      html += `<div class="check-section-label">Not on your shelf</div>`;
      html += missing.map(m=>`<div class="check-row check-row-missing">
        <div class="stock-dot" style="background:var(--red)"></div>
        <div class="check-row-text"><strong>${m}</strong><div class="check-row-sub">add it to your shelf, or the routine will skip it</div></div>
      </div>`).join('');
    }
    body.innerHTML = html;
  }
  modal.classList.add('show');
}

function closeCheckModal(){
  document.getElementById('checkModal')?.classList.remove('show');
}


// ============== CHRISTIANITY EXPLORED + STUDY NOTES ==============
function saveCENote(session){
  const el=document.getElementById('ceNote_'+session);
  if(!el)return;
  state.ceNotes[session]=el.value;
  saveLocal();
  sbSetting('ce_notes_'+session,el.value);
  toast('Session '+session+' notes saved ✓');
}

function addStudyNote(){
  const titleEl=document.getElementById('studyNoteTitle');
  const bodyEl=document.getElementById('studyNoteBody');
  if(!bodyEl||!bodyEl.value.trim())return;
  state.studyNotes.unshift({
    id:Date.now(),
    date:new Date().toISOString().split('T')[0],
    title:(titleEl&&titleEl.value.trim())||'Bible study',
    body:bodyEl.value.trim()
  });
  if(titleEl)titleEl.value='';
  bodyEl.value='';
  saveLocal();
  sbSetting('study_notes',JSON.stringify(state.studyNotes));
  renderStudyNotes();
  toast('Note saved ✓');
}

function deleteStudyNote(id){
  state.studyNotes=state.studyNotes.filter(n=>n.id!==id);
  saveLocal();
  sbSetting('study_notes',JSON.stringify(state.studyNotes));
  renderStudyNotes();
}

function renderStudyNotes(){
  const c=document.getElementById('studyNotesList');
  if(!c)return;
  if(!state.studyNotes.length){
    c.innerHTML='<div class="empty" style="padding:24px 10px">No notes yet — your first study note will live here.</div>';
    return;
  }
  c.innerHTML=state.studyNotes.map(n=>`<div class="past-entry">
    <div class="past-entry-date">${new Date(n.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} — ${n.title}</div>
    <div style="font-size:13px;color:var(--ink-dim);line-height:1.5;white-space:pre-wrap">${n.body}</div>
    <div style="margin-top:8px"><span class="edit-link" onclick="deleteStudyNote(${n.id})">delete</span></div>
  </div>`).join('');
}
