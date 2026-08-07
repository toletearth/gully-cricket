
// ---------- STANDALONE STORAGE FALLBACK ----------
// window.storage is provided by Claude's artifact preview. Outside that
// context (a Capacitor-wrapped app, or this file hosted as a plain webpage),
// it doesn't exist. This shim installs a localStorage-backed equivalent with
// the exact same shape, so the game saves squads/career stats correctly
// whether it's running inside Claude or released as a standalone app.
(function(){
  if(typeof window.storage !== 'undefined') return; // real Claude bridge present, leave it alone
  const PREFIX = 'gully_storage:';
  function fullKey(key, shared){ return PREFIX + (shared ? 'shared:' : 'personal:') + key; }
  window.storage = {
    async get(key, shared){
      try{
        const raw = localStorage.getItem(fullKey(key, shared));
        if(raw === null) throw new Error('key not found: ' + key);
        return { key, value: raw, shared: !!shared };
      }catch(e){ throw e; }
    },
    async set(key, value, shared){
      localStorage.setItem(fullKey(key, shared), value);
      return { key, value, shared: !!shared };
    },
    async delete(key, shared){
      localStorage.removeItem(fullKey(key, shared));
      return { key, deleted: true, shared: !!shared };
    },
    async list(prefix, shared){
      const scopePrefix = PREFIX + (shared ? 'shared:' : 'personal:') + (prefix||'');
      const keys = [];
      for(let i=0; i<localStorage.length; i++){
        const k = localStorage.key(i);
        if(k && k.indexOf(scopePrefix) === 0){
          keys.push(k.slice((PREFIX + (shared ? 'shared:' : 'personal:')).length));
        }
      }
      return { keys, prefix, shared: !!shared };
    }
  };
})();

// ---------- CHARACTER ART (small, mobile-sized action-pose crops) ----------
const AVATARS = { bat: {}, bowl: {} };
AVATARS.bat["tony"] = "assets/tony_bat.jpg";
AVATARS.bat["monu"] = "assets/monu_bat.jpg";
AVATARS.bat["manish"] = "assets/manish_bat.jpg";
AVATARS.bat["sonu"] = "assets/sonu_bat.jpg";
AVATARS.bat["govinda"] = "assets/govinda_bat.jpg";
AVATARS.bat["lali"] = "assets/lali_bat.jpg";
AVATARS.bat["ganji"] = "assets/ganji_bat.jpg";
AVATARS.bat["kaali"] = "assets/kaali_bat.jpg";
AVATARS.bowl["tony"] = "assets/tony_bowl.jpg";
AVATARS.bowl["monu"] = "assets/monu_bowl.jpg";
AVATARS.bowl["manish"] = "assets/manish_bowl.jpg";
AVATARS.bowl["sonu"] = "assets/sonu_bowl.jpg";
AVATARS.bowl["govinda"] = "assets/govinda_bowl.jpg";
AVATARS.bowl["lali"] = "assets/lali_bowl.jpg";
AVATARS.bowl["ganji"] = "assets/ganji_bowl.jpg";
AVATARS.bowl["kaali"] = "assets/kaali_bowl.jpg";
AVATARS._banner = "assets/banner.jpg";
// additional generic characters, selectable via the squad avatar picker
AVATARS.bat["hero1"] = "assets/hero1_bat.jpg";
AVATARS.bowl["hero1"] = "assets/hero1_bowl.jpg";
AVATARS.bat["hero2"] = "assets/hero2_bat.jpg";
AVATARS.bowl["hero2"] = "assets/hero2_bowl.jpg";
AVATARS.bat["hero3"] = "assets/hero3_bat.jpg";
AVATARS.bowl["hero3"] = "assets/hero3_bowl.jpg";
AVATARS.bat["hero4"] = "assets/hero4_bat.jpg";
AVATARS.bowl["hero4"] = "assets/hero4_bowl.jpg";
AVATARS.bat["hero5"] = "assets/hero5_bat.jpg";
AVATARS.bowl["hero5"] = "assets/hero5_bowl.jpg";
AVATARS.bat["hero6"] = "assets/hero6_bat.jpg";
AVATARS.bowl["hero6"] = "assets/hero6_bowl.jpg";
AVATARS.bat["hero7"] = "assets/hero7_bat.jpg";
AVATARS.bowl["hero7"] = "assets/hero7_bowl.jpg";
AVATARS.bat["hero8"] = "assets/hero8_bat.jpg";
AVATARS.bowl["hero8"] = "assets/hero8_bowl.jpg";

const AVATAR_PURCHASE_PRICE = 250;
const RENAME_COST = 100;
const LOGO_PRICE = 100;
const FREE_LOGOS = ["bomb", "ravana"]; // match the existing default team names
const AVAILABLE_AVATARS = [
  { key: "tony", label: "Tony" },
  { key: "monu", label: "Monu" },
  { key: "manish", label: "Manish" },
  { key: "sonu", label: "Sonu" },
  { key: "govinda", label: "Govinda" },
  { key: "lali", label: "Lali" },
  { key: "ganji", label: "Ganji" },
  { key: "kaali", label: "Kaali" },
  { key: "hero1", label: "Tarzan", price: AVATAR_PURCHASE_PRICE },
  { key: "hero2", label: "Chahat", price: AVATAR_PURCHASE_PRICE },
  { key: "hero3", label: "Prince", price: AVATAR_PURCHASE_PRICE },
  { key: "hero4", label: "Bhola", price: AVATAR_PURCHASE_PRICE },
  { key: "hero5", label: "Foji", price: AVATAR_PURCHASE_PRICE },
  { key: "hero6", label: "Bhero", price: AVATAR_PURCHASE_PRICE },
  { key: "hero7", label: "Rishu", price: AVATAR_PURCHASE_PRICE },
  { key: "hero8", label: "Goru", price: AVATAR_PURCHASE_PRICE },
];

const TEAM_LOGOS = {
  "ravana": "assets/logo_ravana.jpg",
  "bomb": "assets/logo_bomb.jpg",
  "tiger": "assets/logo_tiger.jpg",
  "panda": "assets/logo_panda.jpg",
  "shooter": "assets/logo_shooter.jpg",
  "lamboo": "assets/logo_lamboo.jpg",
  "hunters": "assets/logo_hunters.jpg",
  "stryker": "assets/logo_stryker.jpg",
};

const COIN_HEADS = "assets/coin_heads.jpg";
const COIN_TAILS = "assets/coin_tails.jpg";

function avatarFor(name, pose){
  const key = (name||'').trim().split(/\s+/)[0].toLowerCase();
  const p = pose === 'bowl' ? 'bowl' : 'bat';
  return AVATARS[p][key] || AVATARS.bat[key] || AVATARS.bowl[key] || null;
}
function avatarForKey(key, pose){
  if(!key) return null;
  const p = pose === 'bowl' ? 'bowl' : 'bat';
  return AVATARS[p][key] || AVATARS.bat[key] || AVATARS.bowl[key] || null;
}
function logoFor(key){
  return key ? (TEAM_LOGOS[key] || null) : null;
}
function avatarForPlayer(name, avatarKey, pose){
  return avatarForKey(avatarKey, pose) || avatarFor(name, pose);
}

const TOSS_BG = "assets/toss_bg.jpg";
const PLAY_BG = "assets/play_bg.jpg";

// ---------- SOUND ENGINE (synthesized, no external audio files needed) ----------
let soundOn = true;
let audioCtx = null;
function getAudioCtx(){
  if(!audioCtx){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    audioCtx = new AC();
  }
  if(audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
  return audioCtx;
}
function playTone(freq, duration, type, startGain, delay){
  if(!soundOn) return;
  try{
    const ctx = getAudioCtx();
    if(!ctx) return;
    const t0 = ctx.currentTime + (delay||0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(startGain||0.25, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }catch(e){ /* audio unavailable in this context */ }
}
function playNoise(duration, startGain, filterFreq, delay){
  if(!soundOn) return;
  try{
    const ctx = getAudioCtx();
    if(!ctx) return;
    const t0 = ctx.currentTime + (delay||0);
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){ data[i] = Math.random()*2-1; }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq||1500;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(startGain||0.2, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(t0);
    noise.stop(t0 + duration + 0.02);
  }catch(e){ /* audio unavailable in this context */ }
}
function sfxBowl(){ playNoise(0.14, 0.14, 2000, 0); }
function sfxDefend(){ playTone(200, 0.12, 'triangle', 0.18, 0.35); playNoise(0.06, 0.12, 700, 0.35); }
function sfxHit(){ playTone(340, 0.12, 'square', 0.22, 0.35); playNoise(0.09, 0.16, 2600, 0.35); }
function sfxFour(){ sfxHit(); playTone(523, 0.18, 'sine', 0.2, 0.42); }
function sfxSix(){
  playTone(392, 0.15, 'square', 0.28, 0.35);
  playTone(523, 0.15, 'square', 0.28, 0.45);
  playTone(659, 0.28, 'square', 0.3, 0.55);
  playNoise(0.45, 0.18, 3200, 0.45);
}
function sfxTen(){
  playTone(392, 0.12, 'sawtooth', 0.3, 0.35);
  playTone(523, 0.12, 'sawtooth', 0.3, 0.45);
  playTone(659, 0.12, 'sawtooth', 0.3, 0.55);
  playTone(784, 0.32, 'sawtooth', 0.35, 0.65);
  playNoise(0.55, 0.22, 3600, 0.5);
  playNoise(0.2, 0.32, 6500, 2.22); // sharp glass-crack transient, timed to the boom
  playNoise(0.4, 0.18, 4200, 2.26);
}
function sfxOut(){
  playTone(180, 0.28, 'sawtooth', 0.28, 0.3);
  playTone(110, 0.4, 'sawtooth', 0.24, 0.45);
}
function vibrateOut(){
  if(!soundOn) return; // tied to the same effects toggle
  try{
    if(navigator.vibrate) navigator.vibrate([80, 40, 120]);
  }catch(e){ /* vibration unsupported or blocked */ }
}
function vibrateTen(){
  if(!soundOn) return;
  try{ if(navigator.vibrate) navigator.vibrate([30, 20, 30]); } // light tap on hit
  catch(e){ /* vibration unsupported or blocked */ }
}
function vibrateBoom(){
  if(!soundOn) return;
  try{ if(navigator.vibrate) navigator.vibrate([50, 40, 50, 40, 220]); } // heavier buzz at impact
  catch(e){ /* vibration unsupported or blocked */ }
}
function triggerScreenCrack(){
  const overlay = document.createElement('div');
  overlay.className = 'screen-crack-overlay';
  overlay.innerHTML = `
    <div class="crack-flash"></div>
    <img class="crack-image" src="assets/glass_crack.png">
  `;
  document.body.appendChild(overlay);
  document.body.classList.add('screen-shake');
  vibrateBoom();
  setTimeout(()=>{
    document.body.classList.remove('screen-shake');
  }, 420);
  setTimeout(()=>{
    overlay.classList.add('fade-out');
  }, 1900);
  setTimeout(()=> overlay.remove(), 2500);
}
function triggerRocketSequence(){
  const rocket = document.createElement('div');
  rocket.className = 'rocket-overlay';
  rocket.innerHTML = '<img class="rocket-img" src="assets/fireball.png">';
  rocket.style.left = '74%';
  rocket.style.top = '70%';
  document.body.appendChild(rocket);
  // force layout so the starting position registers before the animation class applies
  requestAnimationFrame(()=> requestAnimationFrame(()=> rocket.classList.add('rocket-fly')));
  setTimeout(()=>{
    rocket.remove();
    triggerScreenCrack();
  }, 1700);
}
function sfxWin(){
  [523,659,784,1047].forEach((f,i)=> playTone(f, 0.22, 'sine', 0.25, 0.1 + i*0.13));
}
function sfxClick(){ playTone(760, 0.05, 'sine', 0.12, 0); }

async function loadSoundPref(){
  if(!storageAvailable()) return;
  try{
    const r = await window.storage.get('gully:soundOn');
    if(r && r.value != null) soundOn = r.value === 'true';
  }catch(e){ /* default: sound on */ }
}
async function saveSoundPref(){
  if(!storageAvailable()) return;
  try{ await window.storage.set('gully:soundOn', String(soundOn)); }
  catch(e){ /* non-fatal */ }
}
function ensureSoundToggle(){
  if(document.getElementById('soundToggleBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'soundToggleBtn';
  btn.className = 'sound-toggle';
  btn.textContent = soundOn ? '🔊' : '🔇';
  btn.onclick = ()=>{
    soundOn = !soundOn;
    btn.textContent = soundOn ? '🔊' : '🔇';
    saveSoundPref();
    if(soundOn) sfxClick();
  };
  document.body.appendChild(btn);
}

// ---------- BACKGROUND MUSIC ----------
// Playlist support: add more songs by uploading additional mp3 files named
// music2.mp3, music3.mp3, etc. (same folder as index.html). Missing files
// are skipped automatically - you don't need to fill every slot.
const MUSIC_TRACKS = ['music.mp3', 'music2.mp3', 'music3.mp3', 'music4.mp3', 'music5.mp3', 'music6.mp3'];
let currentTrackIndex = 0;
let musicOn = true;
async function loadMusicPref(){
  if(!storageAvailable()) return;
  try{
    const r = await window.storage.get('gully:musicOn');
    if(r && r.value != null) musicOn = r.value === 'true';
  }catch(e){ /* default: music on */ }
}
async function saveMusicPref(){
  if(!storageAvailable()) return;
  try{ await window.storage.set('gully:musicOn', String(musicOn)); }
  catch(e){ /* non-fatal */ }
}
let musicVolume = 0.35;
async function loadMusicVolume(){
  if(!storageAvailable()) return;
  try{
    const r = await window.storage.get('gully:musicVolume');
    if(r && r.value != null) musicVolume = parseFloat(r.value);
  }catch(e){ /* default volume */ }
}
async function saveMusicVolume(){
  if(!storageAvailable()) return;
  try{ await window.storage.set('gully:musicVolume', String(musicVolume)); }
  catch(e){ /* non-fatal */ }
}

function ensureMusicToggle(){
  if(document.getElementById('musicToggleBtn')) return;
  const audio = document.getElementById('bgMusic');
  audio.volume = musicVolume;
  audio.removeAttribute('loop'); // looping is now handled per-playlist, not per-track
  audio.src = MUSIC_TRACKS[currentTrackIndex];

  const btn = document.createElement('button');
  btn.id = 'musicToggleBtn';
  btn.className = 'music-toggle';
  btn.textContent = '🎵';
  document.body.appendChild(btn);

  const popover = el(`
    <div id="musicPopover" class="music-popover hidden">
      <div class="section-label" style="margin-bottom:8px;">🎵 Background Music</div>
      <div id="musicStatusMsg" class="sub" style="font-size:11px; margin-bottom:6px;">Checking...</div>
      <div id="musicNowPlaying" class="sub" style="font-size:11px; margin-bottom:10px; color:var(--turmeric);"></div>
      <button type="button" class="btn btn-primary" id="musicPlayBtn" style="width:100%; margin-bottom:8px;">▶️ Play Music</button>
      <button type="button" class="btn btn-secondary" id="musicNextBtn" style="width:100%; margin-bottom:10px;">⏭️ Next Track</button>
      <label style="font-size:12px; color:rgba(242,236,220,0.6);">Volume</label>
      <div class="bet-amount-row" style="margin:6px 0 4px;">
        <input type="range" id="musicVolumeSlider" min="0" max="100" value="${Math.round(musicVolume*100)}">
        <div class="bet-amount-value" id="musicVolumeValue">${Math.round(musicVolume*100)}%</div>
      </div>
      <button type="button" class="btn btn-secondary" id="musicPopoverClose" style="width:100%; margin-top:10px;">Close</button>
    </div>
  `);
  document.body.appendChild(popover);

  const statusEl = document.getElementById('musicStatusMsg');
  const nowPlayingEl = document.getElementById('musicNowPlaying');
  const setStatus = (text, isError)=>{
    statusEl.textContent = text;
    statusEl.style.color = isError ? 'var(--ball-red-bright)' : '';
  };
  const updateNowPlaying = ()=>{
    nowPlayingEl.textContent = `Track ${currentTrackIndex+1} of ${MUSIC_TRACKS.length}: ${MUSIC_TRACKS[currentTrackIndex]}`;
  };
  updateNowPlaying();

  let errorSkipsInARow = 0;
  function loadTrack(index, autoplay){
    currentTrackIndex = ((index % MUSIC_TRACKS.length) + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    audio.src = MUSIC_TRACKS[currentTrackIndex];
    updateNowPlaying();
    if(autoplay && musicOn){
      audio.play().then(()=> setStatus('▶️ Playing')).catch(()=>{});
    }
  }

  audio.addEventListener('error', ()=>{
    errorSkipsInARow++;
    if(errorSkipsInARow >= MUSIC_TRACKS.length){
      setStatus('⚠️ No playable tracks found. Make sure music.mp3 is uploaded next to index.html.', true);
      return;
    }
    setStatus(`⚠️ ${MUSIC_TRACKS[currentTrackIndex]} not found — skipping to next track.`, true);
    loadTrack(currentTrackIndex + 1, true);
  });
  audio.addEventListener('playing', ()=>{ errorSkipsInARow = 0; setStatus('▶️ Playing'); });
  audio.addEventListener('pause', ()=> setStatus('⏸️ Paused'));
  audio.addEventListener('ended', ()=> loadTrack(currentTrackIndex + 1, true));

  btn.onclick = ()=>{
    popover.classList.toggle('hidden');
    if(!popover.classList.contains('hidden')){
      setStatus(audio.paused ? 'Not playing — tap Play below' : '▶️ Playing');
    }
  };
  document.getElementById('musicPopoverClose').onclick = ()=> popover.classList.add('hidden');

  document.getElementById('musicPlayBtn').onclick = ()=>{
    musicOn = true;
    saveMusicPref();
    audio.play().then(()=>{
      setStatus('▶️ Playing');
      btn.style.opacity = '1';
    }).catch(err=>{
      setStatus('⚠️ Playback blocked: ' + (err && err.message ? err.message : 'unknown error'), true);
    });
  };

  document.getElementById('musicNextBtn').onclick = ()=>{
    errorSkipsInARow = 0;
    loadTrack(currentTrackIndex + 1, true);
    sfxClick();
  };

  document.getElementById('musicVolumeSlider').oninput = (e)=>{
    musicVolume = parseInt(e.target.value, 10) / 100;
    audio.volume = musicVolume;
    document.getElementById('musicVolumeValue').textContent = e.target.value + '%';
    saveMusicVolume();
  };

  // browsers block autoplay until a real user gesture - try starting music
  // on the first tap anywhere; if that's blocked, the popover's manual
  // Play button always works since it's a direct user gesture
  const startOnFirstTap = ()=>{
    if(musicOn){
      audio.play().then(()=> setStatus('▶️ Playing'))
        .catch(err=> setStatus('Tap 🎵 then Play to start music (autoplay blocked by browser)', true));
    }
    document.removeEventListener('click', startOnFirstTap);
  };
  document.addEventListener('click', startOnFirstTap);
}

// ---------- POINTS & BETTING (in-game currency only - no real-money value, no cashout) ----------
const STARTING_POINTS = 200;
const MIN_BET = 10;
const MAX_BET = 100;
const MILESTONE_POINTS = 1000;
const STREAK_BONUS = [10, 15, 25, 40, 60, 90, 150]; // day 1..7, restarts after day 7

async function getPoints(){
  if(!storageAvailable()) return STARTING_POINTS;
  try{
    const r = await window.storage.get('gully:points');
    if(r && r.value != null) return parseInt(r.value, 10) || 0;
  }catch(e){ /* not set yet */ }
  try{ await window.storage.set('gully:points', String(STARTING_POINTS)); }catch(e){}
  return STARTING_POINTS;
}
async function setPoints(n){
  const clamped = Math.max(0, Math.round(n));
  if(!storageAvailable()) return clamped;
  try{ await window.storage.set('gully:points', String(clamped)); }catch(e){}
  return clamped;
}
async function addPoints(n){
  const current = await getPoints();
  return setPoints(current + n);
}

async function getPurchasedAvatars(){
  if(!storageAvailable()) return [];
  try{
    const r = await window.storage.get('gully:purchasedAvatars');
    if(r && r.value) return JSON.parse(r.value);
  }catch(e){ /* none purchased yet */ }
  return [];
}
async function purchaseAvatar(key){
  const price = AVATAR_PURCHASE_PRICE;
  const points = await getPoints();
  if(points < price) return { ok:false, points };
  const purchased = await getPurchasedAvatars();
  if(!purchased.includes(key)) purchased.push(key);
  try{ await window.storage.set('gully:purchasedAvatars', JSON.stringify(purchased)); }catch(e){}
  const newPoints = await setPoints(points - price);
  return { ok:true, points: newPoints };
}

async function getPurchasedLogos(){
  if(!storageAvailable()) return [];
  try{
    const r = await window.storage.get('gully:purchasedLogos');
    if(r && r.value) return JSON.parse(r.value);
  }catch(e){ /* none purchased yet */ }
  return [];
}
async function purchaseLogo(key){
  const points = await getPoints();
  if(points < LOGO_PRICE) return { ok:false, points };
  const purchased = await getPurchasedLogos();
  if(!purchased.includes(key)) purchased.push(key);
  try{ await window.storage.set('gully:purchasedLogos', JSON.stringify(purchased)); }catch(e){}
  const newPoints = await setPoints(points - LOGO_PRICE);
  return { ok:true, points: newPoints };
}

async function isSquadInitialized(){
  if(!storageAvailable()) return false;
  try{
    const r = await window.storage.get('gully:squadInitialized');
    return !!(r && r.value === 'true');
  }catch(e){ return false; }
}
async function markSquadInitialized(){
  if(!storageAvailable()) return;
  try{ await window.storage.set('gully:squadInitialized', 'true'); }catch(e){ /* non-fatal */ }
}

function todayStr(){ return new Date().toISOString().slice(0,10); }
function yesterdayStr(){ return new Date(Date.now() - 86400000).toISOString().slice(0,10); }

// Runs once per day on first load. Returns {day, bonus} if a new bonus was
// just credited, or null if today's bonus was already claimed (or storage
// is unavailable). Missing a day resets the streak back to day 1.
async function processLoginStreak(){
  if(!storageAvailable()) return null;
  let streak = { streakDay: 0, lastLoginDateStr: null };
  try{
    const r = await window.storage.get('gully:loginStreak');
    if(r && r.value) streak = JSON.parse(r.value);
  }catch(e){ /* first ever login */ }

  const today = todayStr();
  if(streak.lastLoginDateStr === today) return null; // already claimed today

  const newDay = (streak.lastLoginDateStr === yesterdayStr())
    ? (streak.streakDay % 7) + 1   // consecutive day -> advance, wrap 7->1
    : 1;                            // missed a day (or first time) -> restart

  const bonus = STREAK_BONUS[newDay - 1];
  try{
    await window.storage.set('gully:loginStreak', JSON.stringify({ streakDay: newDay, lastLoginDateStr: today }));
  }catch(e){ /* non-fatal */ }
  await addPoints(bonus);
  return { day: newDay, bonus };
}

// A bet is placed once per match, on the toss screen, before innings 1.
// Stake is deducted immediately; a correct pick pays back double the stake
// (stake + equal winnings). Nothing here is ever redeemable for real money.
async function placeBet(teamKey, amount){
  const points = await getPoints();
  const stake = Math.max(MIN_BET, Math.min(MAX_BET, Math.round(amount), points));
  if(stake < MIN_BET || stake > points) return null;
  await setPoints(points - stake);
  return { teamKey, stake };
}

// ---------- GAME DATA / RULES (mirrors the original probability model) ----------
const OVERS = 4;
const TOTAL_BALLS = OVERS * 6; // 24 balls -> each of the 4 bowlers gets exactly one over
const MAX_WICKETS = 3; // team of 4 -> all out when 3rd wicket falls (last man stands)

function makePlayer(name, avatarKey){
  return { name, avatarKey: avatarKey||null, runs:0, ballsFaced:0, isOut:false, dismissal:"", bowledBalls:0, runsConceded:0, wicketsTaken:0, points:0, tensHit:0, sixesHit:0, foursHit:0 };
}
function makeTeam(name, names, avatarKeys, logoKey){
  const keys = avatarKeys || [];
  return { name, logoKey: logoKey||null, players: names.map((n,i)=>makePlayer(n, keys[i])), score:0, wickets:0, strikerIdx:0, nonStrikerIdx:1, nextBatterIdx:2 };
}

function rand(){ return Math.random(); }
function weightedChoice(items, weights){
  const total = weights.reduce((a,b)=>a+b,0);
  let r = rand()*total;
  for(let i=0;i<items.length;i++){ r -= weights[i]; if(r<=0) return items[i]; }
  return items[items.length-1];
}

function simulateBall(){
  if(rand() < 0.05){
    if(rand() < 0.2) return {runs:10, isOut:false, dismissal:""}; // 1% unconditional -> rarest scoring shot in the game
    return {runs:0, isOut:true, dismissal:"over auntie's garden"};
  }
  if(rand() < 0.15){
    const types = ['bowled','catch out',"auntie's garden",'lbw'];
    const weights = [30,30,20,20];
    return {runs:0, isOut:true, dismissal: weightedChoice(types, weights)};
  }
  const runTypes = [0,1,2,3,4,6];
  const weights = [35,25,20,5,10,5];
  return {runs: weightedChoice(runTypes, weights), isOut:false, dismissal:""};
}

function ballMessage(batter, bowler, runs, isOut, dismissal){
  if(runs === 10) return { text: `${batter.name} takes the Auntie's Garden route! 10 RUNS! 🔥`, kind:'big' };
  if(isOut){
    if(dismissal === "over auntie's garden") return { text: `🌳 ${batter.name} goes big over Auntie's Garden... caught at the wall! ${bowler.name} strikes!`, kind:'out' };
    if(dismissal === 'bowled') return { text: `🏏 ${batter.name} is BOWLED by ${bowler.name}!`, kind:'out' };
    if(dismissal === 'catch out') return { text: `✈️ ${batter.name} is CAUGHT! Brilliant catch off ${bowler.name}!`, kind:'out' };
    if(dismissal === "auntie's garden") return { text: `🌿 ${batter.name} tries Auntie's Garden but gets caught! ${bowler.name} strikes!`, kind:'out' };
    if(dismissal === 'lbw') return { text: `🦵 ${batter.name} given OUT LBW! ${bowler.name} celebrates!`, kind:'out' };
    return { text: `❌ ${batter.name} is OUT! ${bowler.name} takes the wicket!`, kind:'out' };
  }
  if(runs === 4) return { text: `🔥 ${batter.name} smashes a BOUNDARY off ${bowler.name}!`, kind:'runs' };
  if(runs === 6) return { text: `💥 ${batter.name} launches a SIXER off ${bowler.name}!`, kind:'big' };
  if(runs === 0) return { text: `🔵 ${batter.name} defends ${bowler.name}'s delivery`, kind:'dot' };
  return { text: `🏃 ${batter.name} steals ${runs} run${runs>1?'s':''} off ${bowler.name}`, kind:'runs' };
}

// ---------- ROSTER / CAREER STATS (persisted via window.storage) ----------
const DEFAULT_ROSTER = {
  teamAName: "Team Bomb",
  teamAPlayers: ["Tony","Monu","Ganji","Sonu"],
  teamAAvatars: [null, null, null, null],
  teamALogo: "bomb",
  teamBName: "Team Ravn",
  teamBPlayers: ["Govinda","Lali","Manish","Kaali"],
  teamBAvatars: [null, null, null, null],
  teamBLogo: "ravana",
};

function slug(name){
  return (name||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'player';
}

function storageAvailable(){
  return typeof window !== 'undefined' && !!window.storage
    && typeof window.storage.get === 'function'
    && typeof window.storage.set === 'function';
}

async function loadRoster(){
  if(!storageAvailable()) return DEFAULT_ROSTER;
  try{
    const r = await window.storage.get('gully:roster');
    if(r && r.value){
      const parsed = JSON.parse(r.value);
      if(!parsed.teamAAvatars) parsed.teamAAvatars = [null,null,null,null];
      if(!parsed.teamBAvatars) parsed.teamBAvatars = [null,null,null,null];
      if(!parsed.teamALogo) parsed.teamALogo = "bomb";
      if(!parsed.teamBLogo) parsed.teamBLogo = "ravana";
      return parsed;
    }
  }catch(e){ /* no roster saved yet */ }
  return DEFAULT_ROSTER;
}
async function saveRoster(roster){
  if(!storageAvailable()) return false;
  try{
    await window.storage.set('gully:roster', JSON.stringify(roster));
    return true;
  }catch(e){
    console.error('Could not save roster', e);
    return false;
  }
}

async function getSeriesRecords(){
  if(!storageAvailable()) return [];
  try{
    const list = await window.storage.list('gully:seriesRecord:');
    if(!list || !list.keys || !list.keys.length) return [];
    const records = [];
    for(const k of list.keys){
      try{
        const res = await window.storage.get(k);
        if(res && res.value) records.push(JSON.parse(res.value));
      }catch(e){ /* skip unreadable entry */ }
    }
    records.sort((a,b)=> b.seriesWon - a.seriesWon);
    return records;
  }catch(e){ return []; }
}
async function updateSeriesRecord(teamName, won, tied, logoKey){
  if(!storageAvailable()) return;
  const key = 'gully:seriesRecord:' + slug(teamName);
  let existing = { name: teamName, seriesPlayed:0, seriesWon:0, seriesTied:0, logoKey: logoKey||null };
  try{
    const res = await window.storage.get(key);
    if(res && res.value) existing = JSON.parse(res.value);
  }catch(e){ /* first series for this team */ }
  existing.name = teamName;
  if(logoKey) existing.logoKey = logoKey;
  existing.seriesPlayed += 1;
  if(won) existing.seriesWon += 1;
  else if(tied) existing.seriesTied += 1;
  try{ await window.storage.set(key, JSON.stringify(existing)); }
  catch(e){ console.error('Could not save series record for', teamName, e); }
}

async function updateCareerStats(players){
  if(!storageAvailable()) return;
  for(const p of players){
    const key = 'gully:career:' + slug(p.name);
    let existing = { name:p.name, matches:0, runs:0, wickets:0, points:0, tens:0, sixes:0, fours:0, motm:0, ballsFaced:0, bowledBalls:0, runsConceded:0 };
    try{
      const res = await window.storage.get(key);
      if(res && res.value) existing = JSON.parse(res.value);
    }catch(e){ /* first time this player has played */ }
    existing.name = p.name;
    if(p.avatarKey) existing.avatarKey = p.avatarKey;
    existing.matches += 1;
    existing.runs += p.runs;
    existing.wickets += p.wicketsTaken;
    existing.points += p.points;
    existing.tens += (p.tensHit||0);
    existing.sixes += (p.sixesHit||0);
    existing.fours = (existing.fours||0) + (p.foursHit||0);
    existing.ballsFaced = (existing.ballsFaced||0) + (p.ballsFaced||0);
    existing.bowledBalls = (existing.bowledBalls||0) + (p.bowledBalls||0);
    existing.runsConceded = (existing.runsConceded||0) + (p.runsConceded||0);
    if(p.isMotm) existing.motm += 1;
    try{ await window.storage.set(key, JSON.stringify(existing)); }
    catch(e){ console.error('Could not save career stats for', p.name, e); }
  }
}

async function loadLeaderboard(){
  if(!storageAvailable()) return [];
  try{
    const list = await window.storage.list('gully:career:');
    if(!list || !list.keys || !list.keys.length) return [];
    const players = [];
    for(const k of list.keys){
      try{
        const res = await window.storage.get(k);
        if(res && res.value) players.push(JSON.parse(res.value));
      }catch(e){ /* skip unreadable entry */ }
    }
    players.sort((a,b)=> b.points - a.points);
    return players;
  }catch(e){ return []; }
}

// ---------- STATE ----------
let state = { screen: 'title' };
const app = document.getElementById('app');

function freshTeamState(team){
  team.players.forEach(p=>{
    p.runs=0; p.ballsFaced=0; p.isOut=false; p.dismissal="";
    p.bowledBalls=0; p.runsConceded=0; p.wicketsTaken=0; p.points=0;
    p.tensHit=0; p.sixesHit=0; p.foursHit=0;
  });
  team.score=0; team.wickets=0;
  team.strikerIdx=0; team.nonStrikerIdx=1; team.nextBatterIdx=2;
}

async function startSeries(format){
  const roster = await loadRoster();
  const teamA = makeTeam(roster.teamAName, roster.teamAPlayers, roster.teamAAvatars, roster.teamALogo);
  const teamB = makeTeam(roster.teamBName, roster.teamBPlayers, roster.teamBAvatars, roster.teamBLogo);
  state = {
    screen: 'toss',
    series: {
      format,                 // 3 or 5
      matchIndex: 0,           // 0-based index of the current match
      teamA, teamB,
      winsA: 0, winsB: 0, tiedMatches: 0,
      seriesBet: null,         // { teamRef, stake } - placed once, before match 1
    },
    innings: 1,
    lastMsg: null,
  };
  startSeriesMatch();
}

function startSeriesMatch(){
  const s = state.series;
  freshTeamState(s.teamA);
  freshTeamState(s.teamB);
  const battingFirst = rand() < 0.5 ? s.teamA : s.teamB;
  const bowlingFirst = battingFirst === s.teamA ? s.teamB : s.teamA;
  state.battingFirst = battingFirst;
  state.bowlingFirst = bowlingFirst;
  state.innings = 1;
  state.lastMsg = null;
  state.screen = 'toss';
  state.statsSavedForThisMatch = false;
  state.betResolvedForThisMatch = false;
  delete state.pendingBet; // no per-match betting inside a series - only the one series-level bet
}

async function newMatch(){
  const roster = await loadRoster();
  const teamA = makeTeam(roster.teamAName, roster.teamAPlayers, roster.teamAAvatars, roster.teamALogo);
  const teamB = makeTeam(roster.teamBName, roster.teamBPlayers, roster.teamBAvatars, roster.teamBLogo);
  const battingFirst = rand() < 0.5 ? teamA : teamB;
  const bowlingFirst = battingFirst === teamA ? teamB : teamA;
  state = {
    screen: 'toss',
    battingFirst, bowlingFirst,
    innings: 1,
    lastMsg: null,
  };
}

function startInnings1(){
  const bt = state.battingFirst, bw = state.bowlingFirst;
  state.match = {
    battingTeam: bt, bowlingTeam: bw,
    ballCount: 0, remaining: TOTAL_BALLS,
    bowlerIdx: 0,
    target: null,
    over: false, result: null,
    overBowlerLocked: false, awaitingBatterPick: false, pendingEndOfOverSwap: false,
    awaitingOpenersPick: bt === state.controlledTeamRef, openerStrikerPicked: null,
  };
  bt.strikerIdx = 0; bt.nonStrikerIdx = 1; bt.nextBatterIdx = 2;
  state.screen = 'play';
}

function startInnings2(){
  const bt = state.bowlingFirst, bw = state.battingFirst;
  // reset ONLY batting stats for bt; keep its bowling figures/points from innings 1
  bt.players.forEach(p=>{ p.runs=0; p.ballsFaced=0; p.isOut=false; p.dismissal=""; });
  bt.score = 0; bt.wickets = 0;
  bt.strikerIdx = 0; bt.nonStrikerIdx = 1; bt.nextBatterIdx = 2;
  state.match = {
    battingTeam: bt, bowlingTeam: bw,
    ballCount: 0, remaining: TOTAL_BALLS,
    bowlerIdx: 0,
    target: state.battingFirst.score,
    over: false, result: null,
    overBowlerLocked: false, awaitingBatterPick: false, pendingEndOfOverSwap: false,
    awaitingOpenersPick: bt === state.controlledTeamRef, openerStrikerPicked: null,
  };
  state.innings = 2;
  state.screen = 'play';
  state.lastMsg = null;
  state.lastRuns = undefined;
  state.lastIsOut = undefined;
}

function currentBowler(m){ return m.bowlingTeam.players[m.bowlerIdx]; }
function striker(m){ return m.battingTeam.players[m.battingTeam.strikerIdx]; }
function nonStriker(m){ return m.battingTeam.players[m.battingTeam.nonStrikerIdx]; }

function bowlBall(){
  const m = state.match;
  if(m.over) return;

  let bowler = currentBowler(m);
  if(bowler.bowledBalls >= 6 && m.bowlerIdx < m.bowlingTeam.players.length - 1 && m.bowlingTeam !== state.controlledTeamRef){
    m.bowlerIdx += 1;
    bowler = currentBowler(m);
  }

  const bt = m.battingTeam;
  const batter = striker(m);
  const {runs, isOut, dismissal} = simulateBall();
  bowler.bowledBalls += 1;
  const msg = ballMessage(batter, bowler, runs, isOut, dismissal);

  // sound effects - timed to roughly land when the bat-swing/out animation connects
  sfxBowl();
  if(isOut){ sfxOut(); vibrateOut(); }
  else if(runs === 10){ sfxTen(); vibrateTen(); setTimeout(triggerRocketSequence, 550); }
  else if(runs === 6) sfxSix();
  else if(runs === 4) sfxFour();
  else if(runs === 0) sfxDefend();
  else sfxHit();

  if(isOut){
    bt.wickets += 1;
    batter.isOut = true;
    batter.dismissal = dismissal;
    bowler.wicketsTaken += 1;
    bowler.points += 5;
  } else {
    bt.score += runs;
    bowler.runsConceded += runs;
    batter.runs += runs;
    batter.points += runs;
    batter.ballsFaced += 1;
    if(runs === 10) batter.tensHit += 1;
    if(runs === 6) batter.sixesHit += 1;
    if(runs === 4) batter.foursHit += 1;
  }

  m.ballCount += 1;
  state.lastMsg = msg;
  state.lastRuns = runs;
  state.lastIsOut = isOut;

  let matchWon = false;
  if(m.target !== null && bt.score > m.target){ matchWon = true; sfxWin(); }

  // Bring in the new batter FIRST (replacing the dismissed one at the
  // striker's end) so that any end-of-over strike swap below correctly
  // operates on the new batter + non-striker, not the player who just got out.
  let allOut = false;
  if(isOut){
    if(bt.wickets < MAX_WICKETS && bt.nextBatterIdx < bt.players.length){
      if(bt === state.controlledTeamRef){
        m.awaitingBatterPick = true;
        m.pendingEndOfOverSwap = (m.ballCount % 6 === 0);
      } else {
        bt.strikerIdx = bt.nextBatterIdx;
        bt.nextBatterIdx += 1;
      }
    } else {
      allOut = true;
    }
  }

  if(!isOut && runs % 2 !== 0){
    [bt.strikerIdx, bt.nonStrikerIdx] = [bt.nonStrikerIdx, bt.strikerIdx];
  }
  if(m.ballCount % 6 === 0 && !m.awaitingBatterPick){
    [bt.strikerIdx, bt.nonStrikerIdx] = [bt.nonStrikerIdx, bt.strikerIdx];
  }

  m.remaining -= 1;

  if(m.ballCount % 6 === 0 && m.remaining > 0){
    m.overBowlerLocked = false; // new over about to start - controlled team needs a fresh bowler pick
  }

  if(matchWon){
    m.over = true; m.result = 'won';
  } else if(allOut){
    m.over = true; m.result = 'allout';
  } else if(m.remaining <= 0){
    m.over = true; m.result = 'overs';
  }

  render();
}

function proceedAfterInnings1(){
  render('summary1');
}

function needsBowlerPick(m){
  if(!m || m.over) return false;
  if(m.bowlingTeam !== state.controlledTeamRef) return false;
  return !m.overBowlerLocked;
}

function availableBowlersForPick(m){
  // bowlers who haven't bowled yet this innings - each bowler bowls exactly one over
  return m.bowlingTeam.players.filter(p => p.bowledBalls === 0);
}

function pickBowler(playerIdx){
  const m = state.match;
  if(!m || !needsBowlerPick(m)) return;
  m.bowlerIdx = playerIdx;
  m.overBowlerLocked = true;
  sfxClick();
  render();
}

function availableBattersForPick(m){
  const bt = m.battingTeam;
  const ns = bt.players[bt.nonStrikerIdx];
  return bt.players.filter(p => !p.isOut && p !== ns);
}

function pickBatter(playerIdx){
  const m = state.match;
  if(!m || !m.awaitingBatterPick) return;
  const bt = m.battingTeam;
  bt.strikerIdx = playerIdx;
  bt.nextBatterIdx = Math.max(bt.nextBatterIdx, playerIdx + 1);
  m.awaitingBatterPick = false;
  if(m.pendingEndOfOverSwap){
    [bt.strikerIdx, bt.nonStrikerIdx] = [bt.nonStrikerIdx, bt.strikerIdx];
    m.pendingEndOfOverSwap = false;
  }
  sfxClick();
  render();
}

function pickOpener(playerIdx){
  const m = state.match;
  if(!m || !m.awaitingOpenersPick) return;
  const bt = m.battingTeam;
  if(m.openerStrikerPicked === null){
    // step 1: choose who's on strike
    m.openerStrikerPicked = playerIdx;
    sfxClick();
    render();
  } else {
    // step 2: choose the non-striker from whoever's left
    bt.strikerIdx = m.openerStrikerPicked;
    bt.nonStrikerIdx = playerIdx;
    m.awaitingOpenersPick = false;
    m.openerStrikerPicked = null;
    sfxClick();
    render();
  }
}

function computeFinal(){
  const a = state.battingFirst, b = state.bowlingFirst;
  let winner = null;
  if(a.score > b.score) winner = a;
  else if(b.score > a.score) winner = b;
  const all = [...a.players, ...b.players];
  const motm = all.reduce((best,p)=> p.points > best.points ? p : best, all[0]);
  return {winner, motm};
}

// ---------- RENDER ----------
function render(forceScreen){
  if(forceScreen) state.screen = forceScreen;
  app.innerHTML = '';
  if(state.screen === 'title') return renderTitle();
  if(state.screen === 'toss') return renderToss();
  if(state.screen === 'play') return renderPlay();
  if(state.screen === 'summary1') return renderSummary1();
  if(state.screen === 'final') return renderFinal();
  if(state.screen === 'squad') return renderSquad();
  if(state.screen === 'leaderboard') return renderLeaderboard();
  if(state.screen === 'seriesResult') return renderSeriesResult();
  if(state.screen === 'seriesLeaderboard') return renderSeriesLeaderboard();
}

function el(html){
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function renderTitle(){
  app.innerHTML = '';
  const wrap = el(`
    <div>
      <img class="banner-img" src="${AVATARS._banner}" alt="Gully Cricket">
      <div class="wall-strip">
        <div class="brand">STREET RULES APPLY</div>
        <h1 class="title">GULLY CRICKET</h1>
        <div class="sub">tape ball · 4-a-side · 4 overs a side</div>
      </div>
      <main>
        <div class="card center" id="pointsCard">
          <div class="sub">Loading your points...</div>
        </div>
        <div class="card rules">
          <div class="section-label">House Rules</div>
          <div><b>The lane:</b> batter stands at the chair (yes, an actual plastic chair for a wicket) between Buildings A & B, bowler operates up near C & D, where the wall by Building D marks the official boundary.</div>
          <div style="margin-top:6px;"><b>Auntie's Garden:</b> the toughest shot in the game. Clear the far boundary past C or D clean for 10 runs — but land in anyone's garden (front or back) and you're caught out.</div>
          <div style="margin-top:6px;"><b>All out:</b> 3 wickets down with a 4-a-side team, last man can't bat alone.</div>
          <div style="margin-top:6px;"><b>Match:</b> 4 overs (24 balls) per innings — each bowler gets exactly one over. Chase the target to win.</div>
        </div>
        <button class="btn btn-primary" id="startBtn">Toss the coin 🪙</button>
        <div class="series-btn-row">
          <button class="btn btn-secondary" id="series3Btn">Best of 3 🏆</button>
          <button class="btn btn-secondary" id="series5Btn">Best of 5 🏆</button>
        </div>
        <button class="btn btn-secondary" id="squadBtn">Edit your squad 📋</button>
        <button class="btn btn-secondary" id="leaderboardBtn">Gully leaderboard 🏆</button>
        <button class="btn btn-secondary" id="seriesLeaderboardBtn">Series leaderboard 🏅</button>
      </main>
      <footer>made for the gully · not for sale · points have no cash value</footer>
    </div>
  `);
  app.appendChild(wrap);
  const startBtn = document.getElementById('startBtn');
  startBtn.onclick = async ()=>{
    startBtn.disabled = true; startBtn.textContent = "Tossing...";
    await newMatch();
    render();
  };
  document.getElementById('series3Btn').onclick = async ()=>{
    await startSeries(3);
    render();
  };
  document.getElementById('series5Btn').onclick = async ()=>{
    await startSeries(5);
    render();
  };
  document.getElementById('squadBtn').onclick = ()=>{ state.screen='squad'; render(); };
  document.getElementById('leaderboardBtn').onclick = ()=>{ state.screen='leaderboard'; render(); };
  document.getElementById('seriesLeaderboardBtn').onclick = ()=>{ state.screen='seriesLeaderboard'; render(); };

  (async ()=>{
    const streakResult = await processLoginStreak();
    const points = await getPoints();
    const pointsCard = document.getElementById('pointsCard');
    if(pointsCard){
      pointsCard.innerHTML = `
        <div class="points-balance">💰 ${points} <span style="font-size:13px; opacity:0.7; font-family:'Rubik';">points</span></div>
        <div class="sub" style="font-size:11px;">in-game currency only · no cash value</div>
        ${points >= MILESTONE_POINTS ? `<div class="sub" style="color:var(--turmeric); margin-top:4px;">🎉 Crossed ${MILESTONE_POINTS} points — gully legend status!</div>` : ''}
      `;
    }
    if(streakResult) showStreakPopup(streakResult.day, streakResult.bonus);
  })();
}

function showStreakPopup(day, bonus){
  const popup = el(`
    <div class="avatar-modal" id="streakPopup">
      <div class="avatar-modal-inner center">
        <div style="font-size:36px;">🔥</div>
        <div class="avatar-modal-title">Day ${day} login streak!</div>
        <div class="sub" style="margin-bottom:14px;">+${bonus} points added to your balance</div>
        ${day===7 ? `<div class="sub" style="color:var(--turmeric); margin-bottom:14px;">Full week streak! Starts over tomorrow.</div>` : ''}
        <button type="button" class="btn btn-primary" id="streakPopupClose" style="width:100%;">Nice!</button>
      </div>
    </div>
  `);
  document.body.appendChild(popup);
  document.getElementById('streakPopupClose').onclick = ()=>{ popup.remove(); sfxClick(); };
}

function renderSquad(){
  app.innerHTML = '';
  app.appendChild(el(`
    <div>
      <div class="wall-strip">
        <div class="brand">SQUAD</div>
        <h1 class="title" style="font-size:24px;">Loading your roster...</h1>
      </div>
    </div>
  `));
  Promise.all([loadRoster(), getPurchasedAvatars(), getPoints()]).then(async ([roster, purchased, points])=>{
    app.innerHTML = '';
    const slotHTML = (prefix, players, avatars) => [0,1,2,3].map(i => {
      const explicitKey = (avatars && avatars[i]) || '';
      const previewSrc = explicitKey ? avatarForKey(explicitKey) : avatarFor(players[i]);
      const slotId = `${prefix}${i}`;
      return `
      <div class="squad-slot">
        <button type="button" class="avatar-pick-btn" id="${slotId}-avbtn" data-target="${slotId}">
          ${previewSrc ? `<img class="avatar-card" id="${slotId}-avimg" src="${previewSrc}">` : `<span class="avatar-card avatar-card-fallback" id="${slotId}-avimg">🏏</span>`}
          <span class="avatar-pick-badge">✏️</span>
        </button>
        <input type="hidden" id="${slotId}-key" value="${explicitKey}">
        <div class="squad-slot-fields">
          <label>Player ${i+1}</label>
          <input type="text" id="${slotId}" value="${players[i]||''}" placeholder="Player ${i+1} name">
        </div>
      </div>
    `;
    }).join('');
    const wrap = el(`
      <div>
        <div class="wall-strip">
          <div class="brand">EDIT SQUAD</div>
          <h1 class="title" style="font-size:24px;">Your Real Gully Four</h1>
          <div class="sub">saved to this device · tap a picture to change it</div>
          <div class="sub" style="font-size:11px;">First setup is free. After that, renaming a player costs ${RENAME_COST} points each — picking a different picture is always free.</div>
        </div>
        <main>
          <div class="card stack">
            <label>Team A name</label>
            <input type="text" id="teamAName" value="${roster.teamAName}">
            <button type="button" class="team-logo-pick-btn" id="teamALogoBtn" data-target="teamA">
              ${logoFor(roster.teamALogo) ? `<img class="team-logo-preview" id="teamALogoImg" src="${logoFor(roster.teamALogo)}">` : `<span class="team-logo-preview team-logo-fallback" id="teamALogoImg">🛡️</span>`}
              <span>Team Logo — tap to change</span>
            </button>
            <input type="hidden" id="teamALogo-key" value="${roster.teamALogo||''}">
            ${slotHTML('teamAP', roster.teamAPlayers, roster.teamAAvatars)}
          </div>
          <div class="card stack">
            <label>Team B name</label>
            <input type="text" id="teamBName" value="${roster.teamBName}">
            <button type="button" class="team-logo-pick-btn" id="teamBLogoBtn" data-target="teamB">
              ${logoFor(roster.teamBLogo) ? `<img class="team-logo-preview" id="teamBLogoImg" src="${logoFor(roster.teamBLogo)}">` : `<span class="team-logo-preview team-logo-fallback" id="teamBLogoImg">🛡️</span>`}
              <span>Team Logo — tap to change</span>
            </button>
            <input type="hidden" id="teamBLogo-key" value="${roster.teamBLogo||''}">
            ${slotHTML('teamBP', roster.teamBPlayers, roster.teamBAvatars)}
          </div>
          <button class="btn btn-primary" id="saveSquadBtn">Save squad</button>
          <div class="sub center" id="squadSaveMsg" style="font-size:12px; min-height:16px;"></div>
          <button class="btn btn-secondary" id="backBtn">Back</button>
        </main>
      </div>
    `);
    app.appendChild(wrap);

    const avatarModal = el(`
      <div id="avatarModal" class="avatar-modal hidden">
        <div class="avatar-modal-inner">
          <div class="avatar-modal-title">Choose a picture</div>
          <div class="sub center" id="avatarModalPoints" style="margin-bottom:8px;">💰 ${points} points</div>
          <div class="avatar-modal-grid">
            <button type="button" class="avatar-modal-pick" data-key="">
              <span class="avatar-modal-thumb avatar-modal-auto">🔄</span>
              <span class="avatar-modal-label">Auto (by name)</span>
            </button>
            ${AVAILABLE_AVATARS.map(av => {
              const locked = av.price && !purchased.includes(av.key);
              return `
              <button type="button" class="avatar-modal-pick" data-key="${av.key}" data-locked="${locked}" data-price="${av.price||0}">
                <span style="position:relative; display:inline-block;">
                  <img class="avatar-modal-thumb" src="${avatarForKey(av.key)}" style="${locked ? 'filter:grayscale(1) brightness(0.55);' : ''}">
                  ${locked ? `<span class="avatar-lock-badge">🔒 ${av.price}</span>` : ''}
                </span>
                <span class="avatar-modal-label">${av.label}</span>
              </button>
            `;}).join('')}
          </div>
          <div class="sub center" id="avatarModalMsg" style="min-height:16px; margin-bottom:8px;"></div>
          <button type="button" class="btn btn-secondary" id="avatarModalClose">Cancel</button>
        </div>
      </div>
    `);
    app.appendChild(avatarModal);

    const logoModal = el(`
      <div id="logoModal" class="avatar-modal hidden">
        <div class="avatar-modal-inner">
          <div class="avatar-modal-title">Choose a Team Logo</div>
          <div class="sub center" id="logoModalPoints" style="margin-bottom:8px;"></div>
          <div class="avatar-modal-grid" id="logoModalGrid"></div>
          <div class="sub center" id="logoModalMsg" style="min-height:16px; margin-bottom:8px;"></div>
          <button type="button" class="btn btn-secondary" id="logoModalClose">Cancel</button>
        </div>
      </div>
    `);
    app.appendChild(logoModal);

    let activeAvatarSlot = null;
    function openAvatarModal(slotId){
      activeAvatarSlot = slotId;
      avatarModal.classList.remove('hidden');
      const msgEl = document.getElementById('avatarModalMsg');
      msgEl.textContent = '';
      delete msgEl.dataset.confirming;
      delete msgEl.dataset.confirmKey;
    }
    function closeAvatarModal(){
      avatarModal.classList.add('hidden');
      activeAvatarSlot = null;
      const msgEl = document.getElementById('avatarModalMsg');
      if(msgEl){ msgEl.textContent=''; delete msgEl.dataset.confirming; delete msgEl.dataset.confirmKey; }
    }

    document.querySelectorAll('.avatar-pick-btn').forEach(btn=>{
      btn.onclick = ()=> openAvatarModal(btn.dataset.target);
    });
    document.getElementById('avatarModalClose').onclick = closeAvatarModal;
    avatarModal.addEventListener('click', (e)=>{ if(e.target === avatarModal) closeAvatarModal(); });

    let activeLogoTarget = null;
    let purchasedLogos = await getPurchasedLogos();
    function renderLogoGrid(){
      const grid = document.getElementById('logoModalGrid');
      grid.innerHTML = Object.keys(TEAM_LOGOS).map(key=>{
        const isFree = FREE_LOGOS.includes(key);
        const locked = !isFree && !purchasedLogos.includes(key);
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        return `
          <button type="button" class="avatar-modal-pick" data-key="${key}" data-locked="${locked}">
            <span style="position:relative; display:inline-block;">
              <img class="logo-modal-thumb" src="${TEAM_LOGOS[key]}" style="${locked ? 'filter:grayscale(1) brightness(0.55);' : ''}">
              ${locked ? `<span class="avatar-lock-badge">🔒 ${LOGO_PRICE}</span>` : ''}
            </span>
            <span class="avatar-modal-label">${label}</span>
          </button>`;
      }).join('');
      grid.querySelectorAll('.avatar-modal-pick').forEach(btn=> btn.onclick = ()=> handleLogoPick(btn));
    }
    async function handleLogoPick(btn){
      const key = btn.dataset.key;
      const isLocked = btn.dataset.locked === 'true';
      const msgEl = document.getElementById('logoModalMsg');
      if(isLocked){
        const currentPoints = await getPoints();
        if(currentPoints < LOGO_PRICE){
          msgEl.textContent = `Not enough points — need ${LOGO_PRICE}, you have ${currentPoints}.`;
          return;
        }
        const label = btn.querySelector('.avatar-modal-label').textContent;
        if(msgEl.dataset.confirmKey !== key){
          msgEl.textContent = `Buy the ${label} logo for ${LOGO_PRICE} points? Tap again to confirm.`;
          msgEl.dataset.confirmKey = key;
          return;
        }
        const result = await purchaseLogo(key);
        if(!result.ok){
          msgEl.textContent = `Not enough points — need ${LOGO_PRICE}, you have ${result.points}.`;
          return;
        }
        purchasedLogos.push(key);
        document.getElementById('logoModalPoints').textContent = `💰 ${result.points} points`;
        msgEl.textContent = `✅ Unlocked ${label}!`;
        sfxWin();
        renderLogoGrid();
        return;
      }
      const imgId = activeLogoTarget + 'LogoImg';
      const keyInput = document.getElementById(activeLogoTarget + 'Logo-key');
      keyInput.value = key;
      const imgEl = document.getElementById(imgId);
      if(imgEl.tagName === 'IMG'){ imgEl.src = TEAM_LOGOS[key]; }
      else {
        const newImg = document.createElement('img');
        newImg.className = 'team-logo-preview';
        newImg.id = imgId;
        newImg.src = TEAM_LOGOS[key];
        imgEl.replaceWith(newImg);
      }
      closeLogoModal();
    }
    function openLogoModal(target){
      activeLogoTarget = target;
      getPoints().then(p=> document.getElementById('logoModalPoints').textContent = `💰 ${p} points`);
      const msgEl = document.getElementById('logoModalMsg');
      msgEl.textContent = ''; delete msgEl.dataset.confirmKey;
      renderLogoGrid();
      logoModal.classList.remove('hidden');
    }
    function closeLogoModal(){
      logoModal.classList.add('hidden');
      activeLogoTarget = null;
    }
    document.getElementById('teamALogoBtn').onclick = ()=> openLogoModal('teamA');
    document.getElementById('teamBLogoBtn').onclick = ()=> openLogoModal('teamB');
    document.getElementById('logoModalClose').onclick = closeLogoModal;
    logoModal.addEventListener('click', (e)=>{ if(e.target === logoModal) closeLogoModal(); });

    avatarModal.querySelectorAll('.avatar-modal-pick').forEach(btn=>{
      btn.onclick = async ()=>{
        if(!activeAvatarSlot) return;
        const key = btn.dataset.key;
        const isLocked = btn.dataset.locked === 'true';
        const msgEl = document.getElementById('avatarModalMsg');

        if(isLocked){
          const price = parseInt(btn.dataset.price, 10) || AVATAR_PURCHASE_PRICE;
          const currentPoints = await getPoints();
          if(currentPoints < price){
            msgEl.textContent = `Not enough points — need ${price}, you have ${currentPoints}.`;
            return;
          }
          const label = btn.querySelector('.avatar-modal-label').textContent;
          if(!msgEl.dataset.confirming || msgEl.dataset.confirmKey !== key){
            msgEl.textContent = `Buy ${label} for ${price} points? Tap again to confirm.`;
            msgEl.dataset.confirming = 'true';
            msgEl.dataset.confirmKey = key;
            return;
          }
          const result = await purchaseAvatar(key);
          if(!result.ok){
            msgEl.textContent = `Not enough points — need ${price}, you have ${result.points}.`;
            return;
          }
          document.getElementById('avatarModalPoints').textContent = `💰 ${result.points} points`;
          const thumb = btn.querySelector('.avatar-modal-thumb');
          thumb.style.filter = '';
          const badge = btn.querySelector('.avatar-lock-badge');
          if(badge) badge.remove();
          btn.dataset.locked = 'false';
          msgEl.textContent = `✅ Unlocked ${label}!`;
          sfxWin();
        }

        document.getElementById(activeAvatarSlot+'-key').value = key;
        const nameVal = document.getElementById(activeAvatarSlot).value || '';
        const previewSrc = key ? avatarForKey(key) : avatarFor(nameVal);
        const imgEl = document.getElementById(activeAvatarSlot+'-avimg');
        if(previewSrc){
          if(imgEl.tagName === 'IMG'){ imgEl.src = previewSrc; }
          else {
            const newImg = document.createElement('img');
            newImg.className = 'avatar-card';
            newImg.id = imgEl.id;
            newImg.src = previewSrc;
            imgEl.replaceWith(newImg);
          }
        } else if(imgEl.tagName === 'IMG'){
          const span = document.createElement('span');
          span.className = 'avatar-card avatar-card-fallback';
          span.id = imgEl.id;
          span.textContent = '🏏';
          imgEl.replaceWith(span);
        }
        closeAvatarModal();
      };
    });

    document.getElementById('saveSquadBtn').onclick = async ()=>{
      const btn = document.getElementById('saveSquadBtn');
      const msgEl = document.getElementById('squadSaveMsg');
      const val = id => (document.getElementById(id).value || '').trim();
      const newRoster = {
        teamAName: val('teamAName') || 'Team A',
        teamAPlayers: [0,1,2,3].map(i => val('teamAP'+i) || `Player A${i+1}`),
        teamAAvatars: [0,1,2,3].map(i => val('teamAP'+i+'-key') || null),
        teamALogo: val('teamALogo-key') || 'bomb',
        teamBName: val('teamBName') || 'Team B',
        teamBPlayers: [0,1,2,3].map(i => val('teamBP'+i) || `Player B${i+1}`),
        teamBAvatars: [0,1,2,3].map(i => val('teamBP'+i+'-key') || null),
        teamBLogo: val('teamBLogo-key') || 'ravana',
      };
      btn.disabled = true;
      btn.textContent = 'Saving...';
      msgEl.textContent = '';

      // First-ever squad setup is free. After that, changing a player's
      // name costs points (picking a different picture stays free).
      const initialized = await isSquadInitialized();
      let renameCount = 0;
      if(initialized){
        const prevNames = [...roster.teamAPlayers, ...roster.teamBPlayers];
        const newNames = [...newRoster.teamAPlayers, ...newRoster.teamBPlayers];
        renameCount = prevNames.reduce((n,old,i)=> n + (old !== newNames[i] ? 1 : 0), 0);
      }
      const renameCost = renameCount * RENAME_COST;

      if(renameCost > 0){
        const currentPoints = await getPoints();
        if(currentPoints < renameCost){
          btn.disabled = false;
          btn.textContent = 'Save squad';
          msgEl.innerHTML = `⚠️ Renaming ${renameCount} player${renameCount>1?'s':''} costs ${renameCost} points (${RENAME_COST} each) — you only have ${currentPoints}. Picking a different picture is still free.`;
          return;
        }
      }

      await saveRoster(newRoster);
      // read back to actually confirm the save took, rather than trusting it silently
      let verified = false;
      try{
        const check = await loadRoster();
        verified = JSON.stringify(check.teamAPlayers) === JSON.stringify(newRoster.teamAPlayers)
                && JSON.stringify(check.teamBPlayers) === JSON.stringify(newRoster.teamBPlayers);
      }catch(e){ verified = false; }

      if(verified){
        if(renameCost > 0) await addPoints(-renameCost);
        await markSquadInitialized();
        state.screen = 'title';
        render();
      } else {
        btn.disabled = false;
        btn.textContent = 'Save squad';
        msgEl.innerHTML = '⚠️ Could not save. If you opened this file directly (not via a hosted link), your browser may be blocking storage. Try again, or host the page online.';
      }
    };
    document.getElementById('backBtn').onclick = ()=>{ state.screen='title'; render(); };
  });
}

function renderSeriesResult(){
  const s = state.series;
  const seriesWinner = s.winsA > s.winsB ? s.teamA : (s.winsB > s.winsA ? s.teamB : null);
  const wrap = el(`
    <div>
      <div class="wall-strip">
        <div class="brand">SERIES COMPLETE</div>
        <h1 class="title" style="font-size:24px;">Best of ${s.format} Result</h1>
      </div>
      <main>
        <div class="card center">
          <div style="display:flex; justify-content:space-between; font-family:'Baloo 2'; font-weight:700; font-size:16px;">
            <span>${s.teamA.name}</span><span>${s.winsA}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-family:'Baloo 2'; font-weight:700; font-size:16px; margin-top:6px;">
            <span>${s.teamB.name}</span><span>${s.winsB}</span>
          </div>
          ${s.tiedMatches ? `<div class="sub" style="margin-top:6px;">${s.tiedMatches} match${s.tiedMatches>1?'es':''} tied</div>` : ''}
          <div class="winner-banner">${seriesWinner ? `🏆 ${seriesWinner.name} Win the Series!` : '🤝 Series Tied!'}</div>
        </div>
        <div class="card bet-result-card" id="seriesBetResultCard" style="display:none;"></div>
        <button class="btn btn-primary" id="seriesLeaderboardLink">🏅 View Series Leaderboard</button>
        <button class="btn btn-secondary" id="seriesBackBtn">Back to Title</button>
      </main>
      <footer>gully cricket · house rules</footer>
    </div>
  `);
  app.appendChild(wrap);
  document.getElementById('seriesLeaderboardLink').onclick = ()=>{ state.screen='seriesLeaderboard'; render(); };
  document.getElementById('seriesBackBtn').onclick = ()=>{ state.screen='title'; state.series=null; render(); };

  if(!state.seriesRecordSaved){
    state.seriesRecordSaved = true;
    (async ()=>{
      await updateSeriesRecord(s.teamA.name, seriesWinner === s.teamA, !seriesWinner, s.teamA.logoKey);
      await updateSeriesRecord(s.teamB.name, seriesWinner === s.teamB, !seriesWinner, s.teamB.logoKey);

      if(s.seriesBet){
        const card = document.getElementById('seriesBetResultCard');
        const won = seriesWinner === s.seriesBet.teamRef;
        const tied = !seriesWinner;
        if(tied) await addPoints(s.seriesBet.stake);
        else if(won) await addPoints(s.seriesBet.stake * 2);
        const points = await getPoints();
        card.style.display = 'block';
        if(tied){
          card.className = 'card bet-result-card';
          card.innerHTML = `🎰 Series tied — your ${s.seriesBet.stake} point stake was refunded.<br><span class="sub">Balance: ${points} points</span>`;
        } else if(won){
          card.className = 'card bet-result-card win';
          card.innerHTML = `🎉 Series bet won! +${s.seriesBet.stake * 2} points<br><span class="sub">Balance: ${points} points</span>`;
        } else {
          card.className = 'card bet-result-card lose';
          card.innerHTML = `😬 Series bet lost — ${s.seriesBet.stake} points gone.<br><span class="sub">Balance: ${points} points</span>`;
        }
      }
    })();
  }
}

function renderSeriesLeaderboard(){
  app.innerHTML = '';
  app.appendChild(el(`
    <div>
      <div class="wall-strip">
        <div class="brand">SERIES RECORDS</div>
        <h1 class="title" style="font-size:24px;">Series Leaderboard</h1>
      </div>
    </div>
  `));
  const loadingMain = el(`<main><div class="card center sub">Loading records...</div></main>`);
  app.appendChild(loadingMain);
  Promise.all([getSeriesRecords(), loadLeaderboard()]).then(([records, players])=>{
    app.removeChild(loadingMain);

    const teamRowsHTML = records.length === 0
      ? `<div class="sub center">No series played yet. Try a Best of 3 or Best of 5!</div>`
      : `<table style="min-width:380px;">
          <tr><th>#</th><th>Team</th><th class="num">Played</th><th class="num">Won</th><th class="num">Tied</th></tr>
          ${records.map((r,i)=>`
            <tr>
              <td>${i+1}</td>
              <td class="lb-name">${logoFor(r.logoKey) ? `<img class="avatar-thumb" src="${logoFor(r.logoKey)}">` : ''}${r.name}</td>
              <td class="num">${r.seriesPlayed}</td>
              <td class="num">${r.seriesWon}</td>
              <td class="num">${r.seriesTied||0}</td>
            </tr>`).join('')}
        </table>`;

    const playerRowsHTML = players.length === 0
      ? `<div class="sub center">No player stats yet.</div>`
      : `<table style="min-width:680px;">
          <tr><th>#</th><th>Player</th><th class="num">M</th><th class="num">Runs</th><th class="num">SR</th><th class="num">Wkts</th><th class="num">Econ</th><th class="num">6s</th><th class="num">4s</th><th class="num">10s</th><th class="num">Pts</th></tr>
          ${players.map((p,i)=>{
            const balls = p.ballsFaced||0;
            const strikeRate = balls > 0 ? ((p.runs/balls)*100).toFixed(1) : '-';
            const overs = (p.bowledBalls||0)/6;
            const economy = overs > 0 ? (p.runsConceded/overs).toFixed(1) : '-';
            return `
            <tr>
              <td>${i+1}</td>
              <td class="lb-name">
                ${avatarForPlayer(p.name, p.avatarKey) ? `<img class="avatar-thumb" src="${avatarForPlayer(p.name, p.avatarKey)}">` : ''}
                ${p.name}${p.motm ? ` <span style="color:var(--turmeric)">★${p.motm}</span>` : ''}
              </td>
              <td class="num">${p.matches}</td>
              <td class="num">${p.runs}</td>
              <td class="num">${strikeRate}</td>
              <td class="num">${p.wickets}</td>
              <td class="num">${economy}</td>
              <td class="num">${p.sixes||0}</td>
              <td class="num">${p.fours||0}</td>
              <td class="num">${p.tens||0}</td>
              <td class="num">${p.points}</td>
            </tr>`;}).join('')}
        </table>`;

    const main = el(`
      <main>
        <div class="section-label">Team Series Records</div>
        <div class="card" style="overflow-x:auto;">${teamRowsHTML}</div>
        <div class="section-label" style="margin-top:6px;">Player Stats</div>
        <div class="card" style="overflow-x:auto;">${playerRowsHTML}</div>
        <button class="btn btn-secondary" id="seriesLbBackBtn">Back</button>
      </main>
    `);
    app.appendChild(main);
    document.getElementById('seriesLbBackBtn').onclick = ()=>{ state.screen = state.returnScreen || 'title'; render(); };
  });
}

function renderLeaderboard(){
  app.innerHTML = '';
  app.appendChild(el(`
    <div>
      <div class="wall-strip">
        <div class="brand">GULLY LEGENDS</div>
        <h1 class="title" style="font-size:24px;">Leaderboard</h1>
      </div>
    </div>
  `));
  const loadingMain = el(`<main><div class="card center sub">Loading stats...</div></main>`);
  app.appendChild(loadingMain);
  loadLeaderboard().then(players=>{
    app.removeChild(loadingMain);
    const rowsHTML = players.length === 0
      ? `<div class="sub center">No matches played yet. Play one to get on the board!</div>`
      : `<table style="min-width:680px;">
          <tr><th>#</th><th>Player</th><th class="num">M</th><th class="num">Runs</th><th class="num">SR</th><th class="num">Wkts</th><th class="num">Econ</th><th class="num">6s</th><th class="num">4s</th><th class="num">10s</th><th class="num">Pts</th></tr>
          ${players.map((p,i)=>{
            const balls = p.ballsFaced||0;
            const strikeRate = balls > 0 ? ((p.runs/balls)*100).toFixed(1) : '-';
            const overs = (p.bowledBalls||0)/6;
            const economy = overs > 0 ? (p.runsConceded/overs).toFixed(1) : '-';
            return `
            <tr>
              <td>${i+1}</td>
              <td class="lb-name">
                ${avatarForPlayer(p.name, p.avatarKey) ? `<img class="avatar-thumb" src="${avatarForPlayer(p.name, p.avatarKey)}">` : ''}
                ${p.name}${p.motm ? ` <span style="color:var(--turmeric)">★${p.motm}</span>` : ''}
              </td>
              <td class="num">${p.matches}</td>
              <td class="num">${p.runs}</td>
              <td class="num">${strikeRate}</td>
              <td class="num">${p.wickets}</td>
              <td class="num">${economy}</td>
              <td class="num">${p.sixes||0}</td>
              <td class="num">${p.fours||0}</td>
              <td class="num">${p.tens||0}</td>
              <td class="num">${p.points}</td>
            </tr>`;}).join('')}
        </table>`;
    const main = el(`
      <main>
        <div class="card" style="overflow-x:auto;">${rowsHTML}</div>
        <button class="btn btn-secondary" id="backBtn2">Back</button>
      </main>
    `);
    app.appendChild(main);
    document.getElementById('backBtn2').onclick = ()=>{ state.screen = state.returnScreen || 'title'; render(); };
  });
}

function renderToss(){
  const wrap = el(`
    <div>
      <div class="toss-hero" style="background-image: linear-gradient(180deg, rgba(20,15,8,0.35) 0%, rgba(15,10,5,0.75) 60%, var(--tarmac) 100%), url('${TOSS_BG}');">
        <div class="brand">TOSS TIME</div>
        <h1 class="title" style="font-size:26px;">Coin's in the air...</h1>
        <div class="vs-row">
          <div class="vs-team">${logoFor(state.battingFirst.logoKey) ? `<img class="vs-team-logo" src="${logoFor(state.battingFirst.logoKey)}">` : ''}${state.battingFirst.name}</div>
          <div class="vs-badge">VS</div>
          <div class="vs-team">${logoFor(state.bowlingFirst.logoKey) ? `<img class="vs-team-logo" src="${logoFor(state.bowlingFirst.logoKey)}">` : ''}${state.bowlingFirst.name}</div>
        </div>
        ${state.series ? `<div class="sub" style="margin-top:8px; position:relative; z-index:1;">Match ${state.series.matchIndex+1} of ${state.series.format} — Series: ${state.series.teamA.name} ${state.series.winsA} - ${state.series.winsB} ${state.series.teamB.name}</div>` : ''}
      </div>
      <main>
        <div class="card center" id="tossCard" style="padding:40px 18px;">
          <div class="coin-flip-scene">
            <img class="coin-flip" id="tossCoinImg" src="${COIN_HEADS}">
          </div>
          <div class="sub" style="font-size:16px; margin-top:10px;" id="tossText">Flipping...</div>
        </div>
        ${(!state.series || state.series.matchIndex === 0) ? `
        <div class="card" id="betCard">
          <div class="section-label">🎰 ${state.series ? 'Place Your Series Bet (optional)' : 'Place Your Bet (optional)'}</div>
          <div class="sub" style="font-size:11px; margin-bottom:8px;">In-game points only — no cash value, nothing to withdraw.${state.series ? ' This bet covers the whole series, not just this match.' : ''}</div>
          <div class="bet-teams">
            <button type="button" class="bet-team-btn" id="betTeamA">${state.battingFirst.name}</button>
            <button type="button" class="bet-team-btn" id="betTeamB">${state.bowlingFirst.name}</button>
          </div>
          <div class="bet-amount-row">
            <input type="range" id="betAmountSlider" min="${MIN_BET}" max="${MAX_BET}" value="${MIN_BET}" step="5">
            <div class="bet-amount-value" id="betAmountValue">${MIN_BET}</div>
          </div>
          <div class="sub" id="betBalanceNote" style="font-size:11px; margin-bottom:10px;">Loading balance...</div>
          <button type="button" class="btn btn-primary" id="placeBetBtn" style="width:100%;" disabled>Tap a team above first</button>
        </div>
        ` : `
        <div class="card center">
          <div class="sub">🎰 Series bet already locked in for this series.</div>
        </div>
        `}
      </main>
    </div>
  `);
  app.appendChild(wrap);

  // play the coin flip: squash the image and swap faces at each squash
  // midpoint - this avoids relying on CSS backface-visibility, which many
  // mobile browsers don't reliably support on <img> elements
  const coinImg = document.getElementById('tossCoinImg');
  if(coinImg){
    coinImg.classList.add('spinning');
    // Fixed flip sequence: 1=heads, 0=tails. Each digit shows for one
    // 150ms squash cycle; swapped at the cycle's 75ms midpoint (edge-on,
    // invisible) so the transition is seamless.
    const flipSequence = [1, 0, 1, 1, 0];
    const cycleMs = 150;
    let i = 0;
    setTimeout(function showNext(){
      coinImg.src = flipSequence[i] === 1 ? COIN_HEADS : COIN_TAILS;
      i++;
      if(i < flipSequence.length){
        setTimeout(showNext, cycleMs);
      } else {
        coinImg.classList.remove('spinning');
      }
    }, cycleMs/2);
  }

  // wire betting immediately - no setTimeout dependency
  const betCard = document.getElementById('betCard');
  if(betCard){
    let selectedTeamKey = null;
    const teamABtn = document.getElementById('betTeamA');
    const teamBBtn = document.getElementById('betTeamB');
    const placeBetBtn = document.getElementById('placeBetBtn');
    const updateBetBtnState = ()=>{
      placeBetBtn.disabled = !selectedTeamKey;
      placeBetBtn.textContent = selectedTeamKey ? 'Place Bet' : 'Tap a team above first';
    };
    teamABtn.onclick = ()=>{ selectedTeamKey='A'; teamABtn.classList.add('selected'); teamBBtn.classList.remove('selected'); updateBetBtnState(); sfxClick(); };
    teamBBtn.onclick = ()=>{ selectedTeamKey='B'; teamBBtn.classList.add('selected'); teamABtn.classList.remove('selected'); updateBetBtnState(); sfxClick(); };
    document.getElementById('betAmountSlider').oninput = (e)=>{
      document.getElementById('betAmountValue').textContent = e.target.value;
    };
    placeBetBtn.onclick = async ()=>{
      if(!selectedTeamKey) return;
      const amount = parseInt(document.getElementById('betAmountSlider').value, 10);
      const bet = await placeBet(selectedTeamKey, amount);
      if(!bet){
        document.getElementById('betBalanceNote').textContent = `Bet failed - check your balance.`;
        return;
      }
      const placedBet = { teamRef: selectedTeamKey === 'A' ? state.battingFirst : state.bowlingFirst, stake: bet.stake };
      if(state.series){ state.series.seriesBet = placedBet; state.controlledTeamRef = placedBet.teamRef; }
      else { state.pendingBet = placedBet; state.controlledTeamRef = placedBet.teamRef; }
      const points = await getPoints();
      betCard.innerHTML = `
        <div class="section-label">🎰 Bet Placed</div>
        <div class="sub">${bet.stake} points on <b style="color:var(--turmeric)">${placedBet.teamRef.name}</b> to win the ${state.series ? 'series' : 'match'}.</div>
        <div class="sub" style="font-size:11px; margin-top:4px;">Balance: ${points} points</div>
      `;
      sfxClick();
    };
    getPoints().then(points=>{
      const balanceNote = document.getElementById('betBalanceNote');
      if(!balanceNote) return; // bet already placed / card replaced
      balanceNote.textContent = `Balance: ${points} points`;
      const slider = document.getElementById('betAmountSlider');
      if(points < MIN_BET){
        betCard.innerHTML = `<div class="section-label">🎰 Betting</div><div class="sub">Not enough points to bet right now (need at least ${MIN_BET}). Come back tomorrow for your daily streak bonus!</div>`;
      } else if(slider){
        slider.max = Math.max(MIN_BET, Math.min(MAX_BET, points));
      }
    });
  }

  // toss reveal + Start Innings button, unchanged timing (just visual pacing)
  setTimeout(()=>{
    document.getElementById('tossText').innerHTML =
      `<b style="color:var(--turmeric)">${state.battingFirst.name}</b> won the toss and will bat first!`;
    const btn = el(`<button class="btn btn-primary" style="margin-top:18px; width:100%;">${state.series ? `Start Match ${state.series.matchIndex+1}` : 'Start Innings 1'}</button>`);
    btn.onclick = ()=>{ startInnings1(); render(); };
    document.getElementById('tossCard').appendChild(btn);
  }, 900);
  const style = document.createElement('style');
  style.textContent = `@keyframes spin{ from{transform:rotate(0deg) scale(1);} 50%{transform:rotate(540deg) scale(1.3);} to{transform:rotate(1080deg) scale(1);} }`;
  wrap.appendChild(style);
}

function overBallLabel(count){
  const overs = Math.floor(count/6);
  const balls = count % 6;
  return `${overs}.${balls}`;
}

function renderPlay(){
  const m = state.match;
  const bt = m.battingTeam, bw = m.bowlingTeam;
  const s = striker(m), ns = nonStriker(m), bowler = currentBowler(m);
  const msg = state.lastMsg;

  const targetLine = m.target !== null
    ? `<div class="target-line">🎯 Target: <b>${m.target+1}</b> — need ${Math.max(m.target+1-bt.score,0)} from ${m.remaining} ball${m.remaining!==1?'s':''}</div>`
    : '';

  let flashClass = 'runs-flash';
  let flashText = '';
  if(msg){
    if(state.lastIsOut) { flashClass += ' out'; flashText = 'OUT'; }
    else if(state.lastRuns === 10 || state.lastRuns === 6){ flashClass += ' big'; flashText = state.lastRuns; }
    else { flashText = state.lastRuns; }
  }

  // movement animation classes, only once a ball has actually been bowled
  let bowlerAnim = '', strikerAnim = '', runnerAnim = '', ballTravelClass = '';
  if(msg){
    bowlerAnim = 'anim-bowl';
    ballTravelClass = 'ball-travel';
    if(state.lastIsOut){
      strikerAnim = 'anim-out';
      ballTravelClass += ' fly-hit';
    } else if(state.lastRuns === 10){
      strikerAnim = 'anim-big-swing';
      bowlerAnim = 'anim-bowl anim-stunned';
    } else if(state.lastRuns === 6){
      strikerAnim = 'anim-big-swing';
      ballTravelClass += ' fly-six';
    } else if(state.lastRuns === 4){
      strikerAnim = 'anim-swing';
      ballTravelClass += ' fly-four';
    } else if(state.lastRuns === 0){
      strikerAnim = 'anim-defend';
      ballTravelClass += ' fly-block';
    } else {
      strikerAnim = 'anim-swing';
      runnerAnim = 'anim-run';
      ballTravelClass += ' fly-run';
    }
  }

  const wrap = el(`
    <div>
      <div class="wall-strip play-header" style="background-image: linear-gradient(180deg, rgba(50,35,15,0.5) 0%, rgba(30,20,8,0.85) 70%, var(--wall-dark) 100%), url('${PLAY_BG}');">
        <div class="brand">INNINGS ${state.innings} of 2</div>
        <h1 class="title" style="font-size:22px;">${bt.name} Batting</h1>
      </div>
      <main>
        <div class="scoreboard">
          <div class="team-row">
            <span class="team-name">${logoFor(bt.logoKey) ? `<img class="vs-team-logo" src="${logoFor(bt.logoKey)}" style="margin-right:6px; vertical-align:middle;">` : ''}${bt.name}</span>
            <span class="score-big">${bt.score}/${bt.wickets}</span>
          </div>
          <div class="meta-row">
            <span>Ball ${overBallLabel(m.ballCount)} / ${overBallLabel(TOTAL_BALLS)}</span>
            <span>vs ${bw.name}</span>
          </div>
          ${targetLine}
        </div>

        <div class="pitch">
          <div class="gully-map">
            <div class="lane compact">
              <div class="player-mini">
                <span class="avatar-wrap ${bowlerAnim}">${avatarForPlayer(bowler.name, bowler.avatarKey, 'bowl') ? `<img class="avatar-mini" src="${avatarForPlayer(bowler.name, bowler.avatarKey, 'bowl')}">` : '🤾'}</span>
                <span>${bowler.name}</span><small>bowling</small>
              </div>
              <div class="player-mini">
                <span class="avatar-wrap ${runnerAnim}">${avatarForPlayer(ns.name, ns.avatarKey) ? `<img class="avatar-mini" src="${avatarForPlayer(ns.name, ns.avatarKey)}">` : '🏏'}</span>
                <span>${ns.name}</span><small>${ns.runs} (${ns.ballsFaced})</small>
              </div>
              <div class="player-mini striker">
                <span class="avatar-wrap ${strikerAnim} ${runnerAnim}">${avatarForPlayer(s.name, s.avatarKey) ? `<img class="avatar-mini" src="${avatarForPlayer(s.name, s.avatarKey)}">` : '🏏'}</span>
                <span>${s.name} *</span><small>${s.runs} (${s.ballsFaced})</small>
              </div>
              ${ballTravelClass ? `<div class="${ballTravelClass}">${state.lastRuns === 10 ? '<img class="fireball-mini" src="assets/fireball.png">' : '🔴'}</div>` : ''}
            </div>
          </div>
          ${msg ? `
            <div class="${flashClass}">${flashText}</div>
            <div class="ball-msg">${msg.text}</div>
          ` : `<div class="ball-msg sub">Ready at the crease...</div>`}
        </div>

        ${m.over ? renderInningsOverPanel() : (
          m.awaitingOpenersPick ? `
            <div class="card" id="pickerCard">
              <div class="section-label">🏏 ${m.openerStrikerPicked === null ? 'Choose your striker (opens the batting)' : 'Choose your non-striker'}</div>
              <div class="picker-grid">
                ${m.battingTeam.players.filter((p,i) => m.openerStrikerPicked === null || i !== m.openerStrikerPicked).map(p => `
                  <button type="button" class="picker-option" data-idx="${m.battingTeam.players.indexOf(p)}">
                    ${avatarForPlayer(p.name, p.avatarKey) ? `<img class="avatar-mini" src="${avatarForPlayer(p.name, p.avatarKey)}">` : '🏏'}
                    <span>${p.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : needsBowlerPick(m) ? `
            <div class="card" id="pickerCard">
              <div class="section-label">🎯 Choose your bowler</div>
              <div class="picker-grid">
                ${availableBowlersForPick(m).map(p => `
                  <button type="button" class="picker-option" data-idx="${m.bowlingTeam.players.indexOf(p)}">
                    ${avatarForPlayer(p.name, p.avatarKey, 'bowl') ? `<img class="avatar-mini" src="${avatarForPlayer(p.name, p.avatarKey, 'bowl')}">` : '🤾'}
                    <span>${p.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : m.awaitingBatterPick ? `
            <div class="card" id="pickerCard">
              <div class="section-label">🏏 Choose your next batter</div>
              <div class="picker-grid">
                ${availableBattersForPick(m).map(p => `
                  <button type="button" class="picker-option" data-idx="${m.battingTeam.players.indexOf(p)}">
                    ${avatarForPlayer(p.name, p.avatarKey) ? `<img class="avatar-mini" src="${avatarForPlayer(p.name, p.avatarKey)}">` : '🏏'}
                    <span>${p.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `<button class="btn btn-primary" id="bowlBtn">Bowl the next ball 🏏</button>`
        )}

        <div class="card">
          <div class="section-label">Batting</div>
          <table>
            <tr><th>Batter</th><th class="num">R</th><th class="num">B</th><th class="num">SR</th></tr>
            ${bt.players.map(p=>`
              <tr>
                <td>${avatarForPlayer(p.name, p.avatarKey) ? `<img class="avatar-thumb" src="${avatarForPlayer(p.name, p.avatarKey)}">` : ''}${p.name} ${p===s?'<span class="not-out">●striker</span>':(p===ns?'<span class="not-out">●</span>':'')}
                  ${p.isOut?`<div class="out-tag">${p.dismissal}</div>`:''}
                </td>
                <td class="num">${p.runs}</td>
                <td class="num">${p.ballsFaced}</td>
                <td class="num">${p.ballsFaced > 0 ? ((p.runs/p.ballsFaced)*100).toFixed(1) : '-'}</td>
              </tr>`).join('')}
          </table>
        </div>

        <div class="card">
          <div class="section-label">Bowling</div>
          <table>
            <tr><th>Bowler</th><th class="num">Balls</th><th class="num">Wkts</th><th class="num">Econ</th></tr>
            ${bw.players.filter(p=>p.bowledBalls>0).map(p=>`
              <tr><td>${avatarForPlayer(p.name, p.avatarKey, 'bowl') ? `<img class="avatar-thumb" src="${avatarForPlayer(p.name, p.avatarKey, 'bowl')}">` : ''}${p.name}</td><td class="num">${p.bowledBalls}</td><td class="num">${p.wicketsTaken}</td><td class="num">${(p.runsConceded/(p.bowledBalls/6)).toFixed(1)}</td></tr>
            `).join('')}
          </table>
        </div>
      </main>
      <footer>tap the ball to keep playing</footer>
    </div>
  `);
  app.appendChild(wrap);
  const bowlBtn = document.getElementById('bowlBtn');
  if(bowlBtn) bowlBtn.onclick = bowlBall;
  document.querySelectorAll('.picker-option').forEach(btn=>{
    btn.onclick = ()=>{
      const idx = parseInt(btn.dataset.idx, 10);
      if(m.awaitingOpenersPick) pickOpener(idx);
      else if(needsBowlerPick(m)) pickBowler(idx);
      else if(m.awaitingBatterPick) pickBatter(idx);
    };
  });
}

function renderInningsOverPanel(){
  let text = '';
  if(state.innings === 1){
    text = "Innings complete!";
  } else {
    const m = state.match;
    if(m.result === 'won') text = `🎉 ${m.battingTeam.name} chased it down! 🎉`;
    else text = "Innings complete!";
  }
  const btnLabel = state.innings === 1 ? "See innings 1 summary" : "See final result";
  return `
    <div class="card center">
      <div class="sub" style="font-size:15px; margin-bottom:10px;">${text}</div>
      <button class="btn btn-primary" id="nextBtn">${btnLabel}</button>
    </div>
  `;
}

// event delegation for the dynamically-inserted nextBtn
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id === 'nextBtn'){
    if(state.innings === 1){ render('summary1'); }
    else { render('final'); }
  }
});

function renderSummary1(){
  const bt = state.battingFirst, bw = state.bowlingFirst;
  const wrap = el(`
    <div>
      <div class="wall-strip">
        <div class="brand">END OF INNINGS 1</div>
        <h1 class="title" style="font-size:24px;">${bt.score}/${bt.wickets}</h1>
        <div class="sub">${bw.name} need ${bt.score+1} to win</div>
      </div>
      <main>
        ${teamCardHTML(bt, true)}
        ${teamCardHTML(bw, false)}
        <button class="btn btn-primary" id="startInn2">Start Innings 2 🏏</button>
      </main>
    </div>
  `);
  app.appendChild(wrap);
  document.getElementById('startInn2').onclick = ()=>{ startInnings2(); render(); };
}

function teamCardHTML(team, showBatting){
  return `
    <div class="card" style="overflow-x:auto;">
      <div class="section-label">${team.name} — ${team.score}/${team.wickets}</div>
      <table style="min-width:420px;">
        <tr><th>Player</th><th class="num">R</th><th class="num">SR</th><th class="num">Wkts</th><th class="num">Econ</th><th class="num">Pts</th></tr>
        ${team.players.map(p=>{
          const sr = p.ballsFaced > 0 ? ((p.runs/p.ballsFaced)*100).toFixed(1) : '-';
          const econ = p.bowledBalls > 0 ? (p.runsConceded/(p.bowledBalls/6)).toFixed(1) : '-';
          return `
          <tr>
            <td>
              ${avatarForPlayer(p.name, p.avatarKey) ? `<img class="avatar-thumb" src="${avatarForPlayer(p.name, p.avatarKey)}">` : ''}${p.name}
              ${p.isOut?`<div class="out-tag">${p.dismissal}</div>`:''}
            </td>
            <td class="num">${p.runs}</td>
            <td class="num">${sr}</td>
            <td class="num">${p.wicketsTaken}</td>
            <td class="num">${econ}</td>
            <td class="num">${p.points}</td>
          </tr>`;}).join('')}
      </table>
    </div>
  `;
}

function renderFinal(){
  const {winner, motm} = computeFinal();
  const a = state.battingFirst, b = state.bowlingFirst;

  // series bookkeeping: record this match's result against the series tally,
  // exactly once per match
  if(state.series && !state.seriesMatchRecorded){
    state.seriesMatchRecorded = true;
    const s = state.series;
    if(winner === s.teamA) s.winsA += 1;
    else if(winner === s.teamB) s.winsB += 1;
    else s.tiedMatches += 1;
  }

  const seriesTallyHTML = state.series
    ? `<div class="sub center" style="margin-top:6px;">Series: ${state.series.teamA.name} ${state.series.winsA} - ${state.series.winsB} ${state.series.teamB.name}${state.series.tiedMatches ? ` (${state.series.tiedMatches} tied)` : ''}</div>`
    : '';
  const isLastMatchInSeries = state.series && (state.series.matchIndex + 1 >= state.series.format);
  const nextActionBtnHTML = state.series
    ? (isLastMatchInSeries
        ? `<button class="btn btn-primary" id="seriesResultBtn">🏆 See Series Result</button>`
        : `<button class="btn btn-primary" id="nextMatchBtn">Next Match ▶️</button>`)
    : `<button class="btn btn-secondary" id="replayBtn">Play again</button>`;

  const wrap = el(`
    <div>
      <div class="wall-strip">
        <div class="brand">${state.series ? `MATCH ${state.series.matchIndex+1} OF ${state.series.format}` : 'FULL & FINAL'}</div>
        <h1 class="title" style="font-size:24px;">Match Result</h1>
      </div>
      <main>
        <div class="card center">
          <div style="display:flex; justify-content:space-between; font-family:'Baloo 2'; font-weight:700;">
            <span>${a.name}</span><span>${a.score}/${a.wickets}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-family:'Baloo 2'; font-weight:700; margin-top:6px;">
            <span>${b.name}</span><span>${b.score}/${b.wickets}</span>
          </div>
          <div class="winner-banner">${winner ? `🏆 ${winner.name} Win!` : "🤝 Match Tied!"}</div>
          ${seriesTallyHTML}
          ${motm ? `<div class="motm">${avatarForPlayer(motm.name, motm.avatarKey) ? `<img class="avatar-card" src="${avatarForPlayer(motm.name, motm.avatarKey)}">` : ''}⭐ Man of the Match: <b>${motm.name}</b> (${motm.points} pts)</div>` : ''}
          <div class="sub" id="statsSaveMsg" style="margin-top:8px; font-size:11px;">Saving career stats...</div>
        </div>
        ${state.series ? '' : `<div class="card bet-result-card" id="betResultCard" style="display:none;"></div>`}
        ${teamCardHTML(a)}
        ${teamCardHTML(b)}
        <button class="btn btn-primary" id="statsBtn">📊 View Player Stats</button>
        ${nextActionBtnHTML}
      </main>
      <footer>gully cricket · house rules</footer>
    </div>
  `);
  app.appendChild(wrap);
  document.getElementById('statsBtn').onclick = ()=>{ state.returnScreen = state.screen; state.screen='leaderboard'; render(); };

  if(state.series){
    if(isLastMatchInSeries){
      document.getElementById('seriesResultBtn').onclick = ()=>{ state.screen='seriesResult'; render(); };
    } else {
      document.getElementById('nextMatchBtn').onclick = ()=>{
        state.series.matchIndex += 1;
        state.seriesMatchRecorded = false;
        startSeriesMatch();
        render();
      };
    }
  } else {
    document.getElementById('replayBtn').onclick = async ()=>{ await newMatch(); render(); };
  }

  // per-match betting only applies to standalone (non-series) matches -
  // series bets are resolved once, on the series result screen
  if(!state.series && !state.betResolvedForThisMatch){
    state.betResolvedForThisMatch = true;
    if(state.pendingBet){
      const won = winner === state.pendingBet.teamRef;
      const tied = !winner;
      (async ()=>{
        if(tied) await addPoints(state.pendingBet.stake);
        else if(won) await addPoints(state.pendingBet.stake * 2);
        // else: stake was already deducted when the bet was placed - nothing more to do

        const card = document.getElementById('betResultCard');
        const points = await getPoints();
        card.style.display = 'block';
        if(tied){
          card.className = 'card bet-result-card';
          card.innerHTML = `🎰 Match tied — your ${state.pendingBet.stake} point stake was refunded.<br><span class="sub">Balance: ${points} points</span>`;
        } else if(won){
          card.className = 'card bet-result-card win';
          card.innerHTML = `🎉 Bet won! +${state.pendingBet.stake * 2} points<br><span class="sub">Balance: ${points} points</span>`;
        } else {
          card.className = 'card bet-result-card lose';
          card.innerHTML = `😬 Bet lost — ${state.pendingBet.stake} points gone.<br><span class="sub">Balance: ${points} points</span>`;
        }
      })();
    }
  }

  if(!state.statsSavedForThisMatch){
    state.statsSavedForThisMatch = true;
    if(!storageAvailable()){
      const el2 = document.getElementById('statsSaveMsg');
      if(el2) el2.textContent = 'Career stats aren\'t available in this preview';
    } else {
      const allPlayers = [...a.players, ...b.players].map(p => ({ ...p, isMotm: p === motm }));
      updateCareerStats(allPlayers).then(()=>{
        const el2 = document.getElementById('statsSaveMsg');
        if(el2) el2.textContent = '✓ Career stats saved';
      }).catch(()=>{
        const el2 = document.getElementById('statsSaveMsg');
        if(el2) el2.textContent = 'Could not save stats';
      });
    }
  }
}

ensureSoundToggle();
ensureMusicToggle();
loadSoundPref().then(()=>{
  const btn = document.getElementById('soundToggleBtn');
  if(btn) btn.textContent = soundOn ? '🔊' : '🔇';
});
Promise.all([loadMusicPref(), loadMusicVolume()]).then(()=>{
  const audio = document.getElementById('bgMusic');
  if(audio) audio.volume = musicVolume;
  const slider = document.getElementById('musicVolumeSlider');
  if(slider){
    slider.value = Math.round(musicVolume*100);
    document.getElementById('musicVolumeValue').textContent = Math.round(musicVolume*100) + '%';
  }
});
render();
