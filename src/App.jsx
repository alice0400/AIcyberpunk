import React, { useState, useEffect } from 'react';
import { Battery, Zap, ShoppingCart, Activity, AlertTriangle, Hammer, Cpu, Map, Skull, ShieldAlert, Bot, Sun, Trash2, Building2, Flame, RefreshCcw, Crosshair, LogOut, X, CheckCircle2, Wallet, ArrowDownLeft, ArrowUpRight, Copy, ExternalLink, Plus, Coins, Scroll, Factory, Diamond, Hexagon, Wrench, Heart, Percent, Globe, Filter, ReplyAll, Loader2 } from 'lucide-react';

/**
 * --------------------------------------------------------------------------
 * 🟢 PRODUCTION IMPORTS (Uncomment when deploying to real environment)
 * --------------------------------------------------------------------------
 */
// import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
// import { beginCell, toNano } from '@ton/core';

/**
 * --------------------------------------------------------------------------
 * 🟡 PREVIEW SIMULATION LAYERS (Remove this block in production)
 * --------------------------------------------------------------------------
 */
// Mock Address
const useTonAddress = () => "EQC...TEST_USER";

// Mock TonConnect Hook
const useTonConnectUI = () => {
  return [{
    sendTransaction: async (tx) => {
      console.log("------------------------------------------------");
      console.log("🚀 SIMULATED TRANSACTION SENT");
      console.log("To:", tx.messages[0].address);
      console.log("Amount (Nano):", tx.messages[0].amount);
      console.log("Payload:", tx.messages[0].payload);
      console.log("------------------------------------------------");
      await new Promise(r => setTimeout(r, 1500)); // Fake delay
      return true;
    }
  }];
};

// Mock TonConnect Button
const TonConnectButton = () => (
  <button className="bg-[#0098EA] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
    <span>Connect Wallet (Simulated)</span>
  </button>
);

// Mock @ton/core Helper functions
const toNano = (val) => Number(val) * 1000000000;
const beginCell = () => {
    const data = [];
    return {
        storeUint: (val, bits) => { data.push(`Uint(${val},${bits})`); return beginCell(); }, // Recursive mock to allow chaining
        endCell: () => ({
            toBoc: () => ({
                toString: () => `[BOC_DATA:${data.join('-')}]`
            })
        })
    };
};

// --- ⚙️ CONFIGURATION ---
const CONTRACT_ADDRESS = "kQAIYlrr3UiMJ9fqI-B4j2nJdiiD7WzyaNL1MX_wiONc4F6o"; 
const EXPLORER_URL = `https://testnet.tonscan.org/address/${CONTRACT_ADDRESS}`;

// Game Balancing Config
const GAME_CONFIG = {
    TIME_SCALE: 60, 
    DROP_RATES: { COMMON: 80, RARE: 18, EPIC: 2 },
    REWARD_RATES: { TON: 0.0000005, SCRAP: 0.05, USDT: 0.000002, BLUEPRINT: 0.000001 },
    DAMAGE_RATES: { A: 0.5, B: 0.2, C: 2.0, D: 1.0, OMEGA: 2000 },
    REPAIR_COST_PER_HP: 0.5,
    CRAFT_COST: { BP: 50, SCRAP: 2000 },
    GACHA_PRICE: { SINGLE: 1, BULK: 20 }
};

// OpCodes (Must match Smart Contract)
const OP_CODES = {
    BuyGacha: 1,
    Dispatch: 2,
    Recall: 3,
    Repair: 4,
    EnterOmega: 5
};

// --- TRANSLATIONS (Same as before) ---
const TRANSLATIONS = {
    en: { hangar: "HANGAR", zones: "ZONES", workshop: "WORKSHOP", market: "MARKET", commander: "COMMANDER", totalPower: "TOTAL POWER", recruit: "RECRUIT", deploy: "DEPLOY", recall: "RECALL", repair: "REPAIR", ready: "READY", working: "WORKING", broken: "BROKEN", recallAll: "RECALL ALL", filter: "FILTER", all: "ALL", deposit: "DEPOSIT", withdraw: "WITHDRAW", available: "AVAILABLE BALANCE", inventory: "INVENTORY", craft: "CRAFT UNIT", crafting: "MECH FACTORY", craftDesc: "Forge the ultimate Commander Unit", blueprints: "Blueprints", scrap: "Scrap", insufficient: "Insufficient Resources", successCraft: "Crafting Complete!", zoneReward: "EARN", zoneDanger: "DANGER", death: "DEATH", hpLoss: "HP/s", jackpot: "JACKPOT", confirmBatch: "CONFIRM BATCH", abort: "ABORT", batchTitle: "BATCH DEPLOY", batchDesc: "Sending units to Zone Omega.", shopTitle: "BLACK MARKET", shopDesc: "Smuggled mining droids", singleDrop: "SINGLE DROP", warlordBundle: "WARLORD BUNDLE", guaranteed: "GUARANTEED RARE +", selected: "SELECTED", noUnits: "NO UNITS SELECTED", clear: "Clear", legendaryEffect: "RANDOM GLOBAL EFFECT", effect: "Effect", zoneRecall: "Recall All", activeUnits: "Active Units", connectWallet: "Connect Wallet First", txPending: "Processing Transaction...", txSuccess: "Transaction Sent!", testnetMode: "TESTNET MODE" },
    th: { hangar: "โรงเก็บ", zones: "เขตแดน", workshop: "โรงงาน", market: "ร้านค้า", commander: "ผู้บัญชาการ", totalPower: "พลังรวม", recruit: "จ้างหุ่น", deploy: "ส่งออก", recall: "เรียกกลับ", repair: "ซ่อมแซม", ready: "พร้อม", working: "กำลังขุด", broken: "พังเสียหาย", recallAll: "เรียกกลับหมด", filter: "ตัวกรอง", all: "ทั้งหมด", deposit: "ฝากเหรียญ", withdraw: "ถอนเหรียญ", available: "ยอดเงินคงเหลือ", inventory: "กระเป๋าของ", craft: "สร้างหุ่น", crafting: "โรงงานจักรกล", craftDesc: "สร้างหุ่นรบระดับตำนาน", blueprints: "แบบแปลน", scrap: "เศษเหล็ก", insufficient: "ทรัพยากรไม่พอ", successCraft: "สร้างสำเร็จ!", zoneReward: "รางวัล", zoneDanger: "อันตราย", death: "ตายแน่นอน", hpLoss: "HP/วิ", jackpot: "แจ็คพอต", confirmBatch: "ยืนยันส่งหมู่", abort: "ยกเลิก", batchTitle: "ส่งกองทัพ", batchDesc: "กำลังส่งหุ่นไปเขต Omega", shopTitle: "ตลาดมืด", shopDesc: "หุ่นยนต์เถื่อนจากโลกเบื้องบน", singleDrop: "กล่องเดี่ยว", warlordBundle: "กล่องสงคราม", guaranteed: "การันตี RARE+", selected: "เลือกแล้ว", noUnits: "ยังไม่เลือก", clear: "ล้าง", legendaryEffect: "สุ่มเอฟเฟคทีม", effect: "เอฟเฟค", zoneRecall: "เรียกกลับทั้งโซน", activeUnits: "หุ่นยนต์ที่มี", connectWallet: "กรุณาเชื่อมต่อกระเป๋า", txPending: "กำลังทำรายการ...", txSuccess: "ส่งคำสั่งเรียบร้อย!", testnetMode: "โหมดทดสอบ (TESTNET)" }
};

// --- CONFIGURATION OBJECTS ---
const ZONE_CONFIG = {
    A: { id: 1, hpLoss: GAME_CONFIG.DAMAGE_RATES.A, reward: 'TON', color: 'yellow', icon: Sun, desc: 'Radioactive Desert', image: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Cyberpunk/ZoneA.png', bgGradient: 'from-yellow-900/40 to-yellow-600/10' },
    B: { id: 2, hpLoss: GAME_CONFIG.DAMAGE_RATES.B, reward: 'SCRAP', color: 'green', icon: Trash2, desc: 'Old Robot Graveyard', image: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Cyberpunk/ZoneB.png', bgGradient: 'from-green-900/40 to-green-600/10' },
    C: { id: 3, hpLoss: GAME_CONFIG.DAMAGE_RATES.C, reward: 'USDT', color: 'purple', icon: Building2, desc: 'Corporate HQ Vault', image: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Cyberpunk/ZoneC.png', bgGradient: 'from-purple-900/40 to-purple-600/10' },
    D: { id: 4, hpLoss: GAME_CONFIG.DAMAGE_RATES.D, reward: 'B.PRINT', color: 'blue', icon: Scroll, desc: 'Ancient Factory', image: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Cyberpunk/ZoneD.png', bgGradient: 'from-blue-900/40 to-cyan-600/10' }
};
const OMEGA_IMAGE = 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Cyberpunk/ZoneOMEGA.png';
const ROBOT_IMAGES = { Common: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Robot/C1.png', Rare: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Robot/R1.png', Epic: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Robot/E1.png', Legendary: 'https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Robot/L1.png' };
const TIER_STYLES = { Common: { border: 'border-amber-800', bg: 'bg-amber-950/30', text: 'text-amber-500', shadow: '', glow: 'amber' }, Rare: { border: 'border-cyan-500', bg: 'bg-cyan-950/30', text: 'text-cyan-400', shadow: 'shadow-[0_0_10px_rgba(6,182,212,0.2)]', glow: 'cyan' }, Epic: { border: 'border-purple-500', bg: 'bg-purple-950/30', text: 'text-purple-400', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]', glow: 'purple' }, Legendary: { border: 'border-yellow-500', bg: 'bg-yellow-950/30', text: 'text-yellow-400', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.6)]', glow: 'yellow' } };

// --- COMPONENTS ---
const RobotPortrait = ({ tier }) => {
    let bgClass = "bg-gray-900"; let glowColor = "gray";
    if (tier === 'Common') { bgClass = "bg-gradient-to-b from-stone-900 to-amber-950"; glowColor = "amber"; } 
    else if (tier === 'Rare') { bgClass = "bg-gradient-to-b from-slate-900 to-cyan-950"; glowColor = "cyan"; } 
    else if (tier === 'Epic') { bgClass = "bg-gradient-to-b from-gray-900 to-purple-950"; glowColor = "purple"; } 
    else if (tier === 'Legendary') { bgClass = "bg-gradient-to-b from-neutral-900 to-yellow-950"; glowColor = "yellow"; }
    return (
        <div className={`w-full h-full flex items-end justify-center relative overflow-hidden ${bgClass} pb-4`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_80%)]"></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-${glowColor}-500/5 blur-xl`}></div>
            <img src={ROBOT_IMAGES[tier]} alt={`${tier} Robot`} className="relative z-10 h-[85%] w-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] transition-transform hover:scale-105" style={{ filter: 'contrast(1.1) saturate(1.1)', mixBlendMode: 'screen' }} />
            <div className={`absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-${glowColor}-900/40 to-transparent z-0`}></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20 z-30"></div>
        </div>
    );
};

const RobotCard = ({ bot, selected, onToggle, globalHpMult, globalPowerMult, onRecall, onRepair, t }) => {
    const style = TIER_STYLES[bot.tier] || TIER_STYLES.Common;
    const effectiveHp = (bot.hp * globalHpMult).toFixed(0);
    const effectivePower = (bot.power * globalPowerMult).toFixed(0);
    const EffectIcon = bot.effect?.type === 'power' ? Zap : bot.effect?.type === 'hp' ? Heart : Wrench;
    return (
      <div onClick={() => onToggle(bot.id)} className={`relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group border-2 ${selected ? 'border-yellow-400 scale-95 ring-2 ring-yellow-400/50' : style.border} ${style.bg} ${style.shadow}`}>
          {selected && (<div className="absolute top-2 right-2 z-30 bg-yellow-400 text-black rounded-full p-0.5 shadow-lg animate-in zoom-in duration-200"><CheckCircle2 size={16} /></div>)}
          <div className="w-full aspect-square relative border-b border-white/10">
              <RobotPortrait tier={bot.tier} />
              <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm border ${style.border} ${style.text} z-30`}>{bot.tier}</div>
              {bot.tier === 'Legendary' && bot.effect && (<div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[8px] font-bold shadow-lg z-30"><EffectIcon size={8} fill="black" /><span>+{bot.effect.value}%</span></div>)}
              {bot.status === 'Farming' && (<div className="absolute bottom-0 w-full bg-black/70 backdrop-blur-sm p-1 flex justify-center items-center gap-1 text-[10px] text-green-400 font-mono border-t border-white/10 z-30"><Activity size={10} className="animate-pulse"/> {t('working')} (Zone {bot.zone})</div>)}
          </div>
          <div className="p-2 space-y-2 bg-black/20">
              <div className="flex justify-between items-center"><div className="font-bold text-sm text-gray-100 truncate w-20">{bot.name}</div><div className="text-[10px] text-gray-400 font-mono">#{bot.id.toString().slice(-3)}</div></div>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="bg-black/40 rounded px-1.5 py-1 flex items-center gap-1 border border-white/5"><Zap size={10} className={globalPowerMult > 1 ? "text-green-400" : "text-yellow-500"} /><span className={globalPowerMult > 1 ? "text-green-400 font-bold" : "text-gray-300"}>{effectivePower}</span></div>
                  <div className="bg-black/40 rounded px-1.5 py-1 flex items-center gap-1 border border-white/5"><Activity size={10} className={bot.hp < bot.maxHp*0.3 ? 'text-red-500' : globalHpMult > 1 ? 'text-green-400' : 'text-green-500'} /><span className={globalHpMult > 1 ? "text-green-400 font-bold" : "text-gray-300"}>{effectiveHp}</span></div>
              </div>
              {bot.status === 'Farming' ? (
                   <button onClick={(e) => { e.stopPropagation(); onRecall(bot.id); }} className="w-full py-1.5 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 transition-colors bg-orange-700 hover:bg-orange-600 text-white shadow-lg border border-orange-500"><LogOut size={10} /> {t('recall')}</button>
              ) : bot.hp < bot.maxHp ? (
                  <button onClick={(e) => { e.stopPropagation(); onRepair(bot.id); }} className="w-full py-1.5 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 transition-colors bg-green-700 hover:bg-green-600 text-white shadow-lg"><Hammer size={10} /> {t('repair')}</button>
              ) : (<div className="text-[9px] text-center text-gray-500 font-mono py-1.5">{t('ready')}</div>)}
          </div>
      </div>
    );
};

const ZoneCard = ({ id, name, reward, hpLoss, color, desc, image, bgGradient, onClick, isOmega, onRecall, t }) => {
    const [imgError, setImgError] = useState(false);
    return (
        <button onClick={onClick} className={`w-full rounded-xl flex flex-col items-start relative overflow-hidden transition-all hover:brightness-110 active:scale-95 text-left border-2 group ${isOmega ? 'border-red-600 bg-black' : `border-${color}-800 bg-gray-950`}`}>
            <div className={`w-full h-40 relative flex items-center justify-center overflow-hidden bg-black`}> 
                {image && !imgError ? (<img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-80" onError={() => setImgError(true)} />) : (<div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${bgGradient} opacity-60`}></div>)}
                <div className={`absolute inset-0 bg-${color}-900/40 mix-blend-overlay pointer-events-none`}></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%'}}></div>
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90`}></div>
                <div className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-widest text-white/90 bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">{desc}</div>
                {!isOmega && (<div onClick={(e) => { e.stopPropagation(); onRecall(id); }} className="absolute bottom-2 left-2 z-20 bg-orange-600/80 hover:bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded border border-orange-400/50 flex items-center gap-1 backdrop-blur-sm transition-colors"><LogOut size={10} /> {t('zoneRecall')}</div>)}
            </div>
            <div className="w-full p-3 bg-black/80 backdrop-blur-md border-t border-white/10 relative z-20">
                <div className="flex justify-between w-full">
                    <h3 className={`font-black font-mono text-base uppercase ${isOmega ? 'text-red-500' : `text-${color}-400`}`}>{name}</h3>
                    {isOmega && <Skull size={16} className="text-red-500" />}
                </div>
                <div className="w-full flex justify-between text-xs font-mono mt-1">
                    <span className="text-gray-400">{t('zoneReward')}: <b className="text-white">{reward}</b></span>
                    <span className={`${isOmega ? 'text-red-500 font-bold' : 'text-red-400'}`}>{isOmega ? t('death') : `-${hpLoss} ${t('hpLoss')}`}</span>
                </div>
            </div>
        </button>
    );
};

const ResourceItem = ({ label, value, rate, color, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center py-2 px-1 relative">
        <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold mb-0.5">{Icon && <Icon size={10} className={`text-${color}-400`}/>} {label}</div>
        <div className={`text-${color}-400 font-bold text-xs`}>{value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div className="text-[8px] text-green-500 font-mono">+{rate.toFixed(4)}/s</div>
        <div className="absolute right-0 top-2 bottom-2 w-px bg-gray-800 last:hidden"></div>
    </div>
);

const WalletModal = ({ onClose, balances, onDeposit, onWithdraw, t }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
             <div className="bg-[#111] border border-gray-700 rounded-2xl w-full max-w-sm flex flex-col p-6 text-center text-gray-400">
                 <Wallet size={32} className="mx-auto text-gray-500 mb-2"/>
                 <h3 className="text-white font-bold mb-4">{t('inventory')}</h3>
                 <p className="text-xs mb-4">Real wallet integration required for deposit/withdraw on Mainnet.</p>
                 <button onClick={onClose} className="py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 text-white">Close</button>
             </div>
        </div>
    );
};

// --- MAIN APP ---
const App = () => {
  const [lang, setLang] = useState('en'); 
  const [activeTab, setActiveTab] = useState('hangar');
  const [balance, setBalance] = useState(100.00);
  const [scrap, setScrap] = useState(2500); 
  const [usdt, setUsdt] = useState(0.00); 
  const [blueprints, setBlueprints] = useState(100000); 
  const [poolSize, setPoolSize] = useState(15420.50);
  const [rates, setRates] = useState({ ton: 0, scrap: 0, usdt: 0, blueprint: 0 }); 
  const [showOmegaModal, setShowOmegaModal] = useState(false); 
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedRobotIds, setSelectedRobotIds] = useState([]);
  const [filterTier, setFilterTier] = useState('All');
  const [txPending, setTxPending] = useState(false);
  const [lastTick, setLastTick] = useState(Date.now()); 

  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const t = (key) => TRANSLATIONS[lang][key] || key;

  const [robots, setRobots] = useState([
    { id: 1, name: 'Scrapper-01', tier: 'Common', power: 100, hp: 800, maxHp: 1000, status: 'Idle', zone: null, visualSeed: 1 },
    { id: 2, name: 'Cobalt-X', tier: 'Rare', power: 350, hp: 1800, maxHp: 1800, status: 'Idle', zone: null, visualSeed: 2 },
    { id: 3, name: 'Nebula-Prime', tier: 'Epic', power: 2000, hp: 3500, maxHp: 3500, status: 'Farming', zone: 'A', visualSeed: 3 },
    { id: 4, name: 'Zeus-Command', tier: 'Legendary', power: 2000, hp: 3500, maxHp: 3500, status: 'Idle', zone: null, visualSeed: 4, effect: { type: 'power', value: 10 } }, 
  ]);

  const [logs, setLogs] = useState(['> System initialized...', '> TON Testnet Connected.']);

  // Global Buffs
  const globalModifiers = robots.reduce((acc, bot) => {
      if (bot.tier === 'Legendary' && bot.effect) {
          if (bot.effect.type === 'repair') acc.repairDiscount += bot.effect.value;
          if (bot.effect.type === 'power') acc.powerBoost += bot.effect.value;
          if (bot.effect.type === 'hp') acc.hpBoost += bot.effect.value;
      }
      return acc;
  }, { repairDiscount: 0, powerBoost: 0, hpBoost: 0 });

  const finalRepairDiscount = Math.min(globalModifiers.repairDiscount, 90) / 100;
  const finalPowerMultiplier = 1 + (globalModifiers.powerBoost / 100);
  const finalHpMultiplier = 1 + (globalModifiers.hpBoost / 100);

  const totalActivePower = robots.reduce((acc, bot) => {
      if (bot.status === 'Farming' && bot.hp > 0) {
          return acc + (bot.power * finalPowerMultiplier);
      }
      return acc;
  }, 0);

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
        const now = Date.now();
        const timeDiffSeconds = (now - lastTick) / 1000;
        setLastTick(now);

        setRobots(prevBots => prevBots.map(bot => {
            if (bot.status === 'Farming' && bot.zone) {
                const dmgRate = ZONE_CONFIG[bot.zone] ? ZONE_CONFIG[bot.zone].hpLoss : 0;
                const damage = dmgRate * timeDiffSeconds * GAME_CONFIG.TIME_SCALE; 
                const newHp = Math.max(0, bot.hp - damage);
                return { ...bot, hp: newHp, status: newHp <= 0 ? 'Broken' : 'Farming' };
            }
            return bot;
        }));

        setRobots(prevBots => {
            let totalTon = 0, totalScrap = 0, totalUsdt = 0, totalBlueprint = 0;
            prevBots.forEach(bot => {
                if (bot.status === 'Farming' && bot.hp > 0) {
                    const effectivePower = bot.power * finalPowerMultiplier;
                    const duration = timeDiffSeconds * GAME_CONFIG.TIME_SCALE;
                    if (bot.zone === 'A') totalTon += (effectivePower * duration * GAME_CONFIG.REWARD_RATES.TON);
                    if (bot.zone === 'B') totalScrap += (effectivePower * duration * GAME_CONFIG.REWARD_RATES.SCRAP);
                    if (bot.zone === 'C') totalUsdt += (effectivePower * duration * GAME_CONFIG.REWARD_RATES.USDT);
                    if (bot.zone === 'D') totalBlueprint += (effectivePower * duration * GAME_CONFIG.REWARD_RATES.BLUEPRINT);
                }
            });
            if (totalTon > 0) setBalance(p => p + totalTon);
            if (totalScrap > 0) setScrap(p => p + totalScrap);
            if (totalUsdt > 0) setUsdt(p => p + totalUsdt);
            if (totalBlueprint > 0) setBlueprints(p => p + totalBlueprint);
            setRates({ ton: totalTon / timeDiffSeconds, scrap: totalScrap / timeDiffSeconds, usdt: totalUsdt / timeDiffSeconds, blueprint: totalBlueprint / timeDiffSeconds });
            return prevBots;
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [finalPowerMultiplier, lastTick]);

  const addLog = (msg) => setLogs(p => [...p.slice(-4), `> ${msg}`]);

  // --- BLOCKCHAIN TRANSACTIONS (Build Real Payloads) ---
  const sendTransaction = async (opCode, amount = 0, payloadData = null) => {
      if (!userAddress) {
          addLog(t('connectWallet'));
          return false;
      }
      setTxPending(true);
      
      try {
          // --- BUILD PAYLOAD (BODY) USING @ton/core ---
          // OpCode (32bit) + QueryId (64bit) + Data
          
          // NOTE: In the simulated version, beginCell() is a mock.
          // In production, this generates a real cell.
          let bodyBuilder = beginCell()
              .storeUint(opCode, 32)
              .storeUint(0, 64); // QueryId = 0

          if (payloadData) {
              if (opCode === OP_CODES.BuyGacha) {
                  bodyBuilder.storeUint(payloadData.amount, 32); // Send amount (1 or 20)
              } else if (opCode === OP_CODES.Dispatch) {
                  bodyBuilder.storeUint(payloadData.robotId, 32);
                  bodyBuilder.storeUint(payloadData.zoneId, 8);
              } else if (opCode === OP_CODES.Recall || opCode === OP_CODES.Repair || opCode === OP_CODES.EnterOmega) {
                  bodyBuilder.storeUint(payloadData.robotId, 32);
              }
          }
          
          const body = bodyBuilder.endCell();

          const transaction = {
              validUntil: Math.floor(Date.now() / 1000) + 60,
              messages: [{
                  address: CONTRACT_ADDRESS,
                  amount: toNano(amount.toString()),
                  payload: body.toBoc().toString('base64')
              }]
          };

          await tonConnectUI.sendTransaction(transaction);
          setTxPending(false);
          addLog(t('txSuccess'));
          return true;
      } catch (e) {
          console.error(e);
          setTxPending(false);
          addLog("Transaction Failed");
          return false;
      }
  };

  // Handlers
  const handleGacha = async (bulk) => {
      const quantity = bulk ? 20 : 1;
      const cost = bulk ? GAME_CONFIG.GACHA_PRICE.BULK : GAME_CONFIG.GACHA_PRICE.SINGLE;
      
      const success = await sendTransaction(OP_CODES.BuyGacha, cost, { amount: quantity });
      
      if (success) {
          setBalance(p => p - cost);
          const newBots = [];
          for(let i=0; i<quantity; i++) {
               const roll = Math.random() * 100;
               let tier = 'Common', hp = 1000, pwr = 100;
               if (roll > 95) { tier = 'Epic'; hp = 3500; pwr = 2000; }
               else if (roll > 80) { tier = 'Rare'; hp = 1800; pwr = 350; }
               newBots.push({ id: Date.now() + i, name: `${tier}-Bot`, tier, power: pwr, hp, maxHp: hp, status: 'Idle', zone: null, visualSeed: Math.random() });
          }
          setRobots(p => [...p, ...newBots]);
          addLog(`${t('recruit')} ${quantity} units`);
      }
  };

  const handleDispatch = async (zoneId) => {
      if (selectedRobotIds.length === 0) return;
      if (zoneId === 'OMEGA') { setShowOmegaModal(true); return; }
      
      // Batch Dispatch: Loop through selected IDs and send transactions (or use a batch contract method if available)
      // For Demo: We send 1 transaction for the FIRST robot only to show proof of concept
      // In production: You need a Multi-Send Contract or loop in UI (bad UX)
      
      const firstRobotId = selectedRobotIds[0];
      const zoneConfig = ZONE_CONFIG[zoneId];
      // Convert Zone Letter to ID (A=1, B=2...)
      
      const success = await sendTransaction(OP_CODES.Dispatch, 0.05, { robotId: firstRobotId, zoneId: zoneConfig.id }); 
      
      if (success) {
          setRobots(prev => prev.map(bot => selectedRobotIds.includes(bot.id) ? { ...bot, status: 'Farming', zone: zoneId } : bot));
          addLog(`Dispatched to Zone ${zoneId}`);
          setSelectedRobotIds([]);
          setActiveTab('map');
      }
  };
  
  const confirmOmegaEntry = async () => {
       const firstRobotId = selectedRobotIds[0];
       const success = await sendTransaction(OP_CODES.EnterOmega, 0.5, { robotId: firstRobotId });
       if(success) {
           setShowOmegaModal(false);
           // ... Omega Logic ...
           addLog("Omega Entry Confirmed");
           setSelectedRobotIds([]);
       }
  };

  // Local Handlers (Off-chain for demo speed)
  const toggleSelect = (id) => setSelectedRobotIds(prev => prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]);
  const clearSelection = () => setSelectedRobotIds([]);
  const handleRecallAll = () => { setRobots(p => p.map(b => b.status === 'Farming' ? { ...b, status: 'Idle', zone: null } : b)); addLog(t('recallAll')); };
  
  const handleRecall = async (id) => { 
      // await sendTransaction(OP_CODES.Recall, 0.01, { robotId: id }); // Uncomment for real
      setRobots(p => p.map(b => b.id === id ? { ...b, status: 'Idle', zone: null } : b)); 
      addLog(t('recall'));
  };
  
  const handleRecallZone = (zoneId) => { setRobots(prev => prev.map(bot => (bot.status === 'Farming' && bot.zone === zoneId) ? { ...bot, status: 'Idle', zone: null } : bot)); addLog(`Recalled Zone ${zoneId}`); };
  
  const handleRepair = async (id) => { 
      // await sendTransaction(OP_CODES.Repair, 0.01, { robotId: id }); // Uncomment for real
      const bot = robots.find(r => r.id === id);
      if(scrap >= 100) { setScrap(s => s - 100); setRobots(p => p.map(b => b.id === id ? { ...b, hp: b.maxHp, status: 'Idle', zone: null } : b)); }
  };
  const handleCraft = () => {
      if (blueprints >= 50 && scrap >= 2000) {
          setBlueprints(p => p - 50); setScrap(p => p - 2000);
          setRobots(p => [...p, { id: Date.now(), name: 'Legendary', tier: 'Legendary', power: 2000, hp: 3500, maxHp: 3500, status: 'Idle', zone: null, visualSeed: Math.random(), effect: { type: 'power', value: 10 } }]);
          addLog("Crafted Legendary!");
          setActiveTab('hangar');
      }
  };

  // Placeholder functions for modal (not fully implemented in simulation)
  const handleDeposit = () => {};
  const handleWithdraw = () => {};


  const Scanline = () => <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"/>;
  const filteredRobots = filterTier === 'All' ? robots : robots.filter(r => r.tier === filterTier);

  return (
    <div className="w-full h-screen bg-[#0E0E10] text-white flex flex-col relative font-sans overflow-hidden select-none">
      <Scanline />
      {txPending && (<div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"><Loader2 size={64} className="text-cyan-400 animate-spin mb-4" /><div className="text-cyan-400 font-bold text-xl animate-pulse">{t('txPending')}</div></div>)}

      {showOmegaModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
              <div className="bg-gray-950 border-2 border-red-600 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-red-500 mb-4">CONFIRM OMEGA ENTRY</h3>
                  <p className="text-sm mb-4">Send {selectedRobotIds.length} units to death zone?</p>
                  <div className="flex gap-2">
                      <button onClick={() => setShowOmegaModal(false)} className="flex-1 border p-2 rounded">CANCEL</button>
                      <button onClick={confirmOmegaEntry} className="flex-1 bg-red-600 p-2 rounded font-bold">CONFIRM</button>
                  </div>
              </div>
          </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col w-full sticky top-0 z-30 shadow-lg shadow-black/50">
          <div className="flex justify-between items-center p-3 bg-black/95 border-b border-gray-800 backdrop-blur-md">
             <div className="flex items-center gap-4">
                <div className="flex flex-col"><span className="text-[9px] text-gray-500 font-mono tracking-wider">{t('commander')}</span><span className="text-cyan-400 font-bold text-sm">USER_882</span></div>
                <div className="flex flex-col items-start pl-4 border-l border-gray-800"><span className="text-[9px] text-gray-500 font-mono tracking-wider">{t('totalPower')}</span><div className="text-yellow-400 font-black text-sm flex items-center gap-1 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"><Zap size={14} fill="currentColor"/> {totalActivePower.toLocaleString()}</div></div>
             </div>
             <div className="flex items-center gap-2">
                 <div className="px-2 py-1 bg-gray-900 rounded border border-gray-700 text-[8px] text-green-500 font-bold animate-pulse">{t('testnetMode')}</div>
                 <button onClick={() => setLang(l => l === 'en' ? 'th' : 'en')} className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-[10px] font-bold text-gray-400 w-8">{lang.toUpperCase()}</button>
                 <TonConnectButton />
                 <button onClick={() => setShowWalletModal(true)} className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-3 py-1.5"><Wallet size={18} className="text-gray-400"/></button>
             </div>
          </div>
          <div className="grid grid-cols-4 bg-[#0a0a0a] border-b border-gray-800">
              <ResourceItem label="TON" value={balance} rate={rates.ton} color="purple" icon={Diamond} />
              <ResourceItem label="USDT" value={usdt} rate={rates.usdt} color="teal" icon={Coins} />
              <ResourceItem label="SCRAP" value={scrap} rate={rates.scrap} color="yellow" icon={Trash2} />
              <ResourceItem label="B.PRINT" value={blueprints} rate={rates.blueprint} color="blue" icon={Scroll} />
          </div>
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 pb-20 p-0">
          {activeTab === 'hangar' && (
              <div className="p-4 animate-in fade-in">
                  <div className="flex justify-between items-center mb-4 gap-2">
                      <button onClick={handleRecallAll} className="flex-1 bg-orange-900/40 border border-orange-600/50 text-orange-400 px-3 py-2 rounded text-[10px] font-bold flex gap-2 justify-center"><ReplyAll size={14}/> {t('recallAll')}</button>
                      <div className="flex bg-gray-900 rounded p-1 border border-gray-700 overflow-x-auto max-w-[60%] no-scrollbar">
                          {['All', 'Common', 'Rare', 'Epic', 'Legendary'].map(tier => (<button key={tier} onClick={() => setFilterTier(tier)} className={`px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap transition-colors ${filterTier === tier ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{tier === 'All' ? t('all') : tier}</button>))}
                      </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                      {filteredRobots.map(bot => (<RobotCard key={bot.id} bot={bot} selected={selectedRobotIds.includes(bot.id)} onToggle={toggleSelect} globalHpMult={finalHpMultiplier} globalPowerMult={finalPowerMultiplier} onRecall={handleRecall} onRepair={handleRepair} t={t} />))}
                  </div>
                  {selectedRobotIds.length > 0 && (<div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"><button onClick={() => setActiveTab('map')} className="bg-yellow-500 text-black font-black uppercase px-8 py-3 rounded-full flex gap-2 items-center shadow-lg active:scale-95"><Map size={18}/> {t('deploy')} {selectedRobotIds.length}</button></div>)}
              </div>
          )}

          {activeTab === 'map' && (
              <div className="p-4 space-y-4 animate-in fade-in">
                  <div className="space-y-3">
                      <ZoneCard id="A" name="Zone A" {...ZONE_CONFIG.A} onClick={() => handleDispatch('A')} onRecall={handleRecallZone} t={t}/>
                      <ZoneCard id="B" name="Zone B" {...ZONE_CONFIG.B} onClick={() => handleDispatch('B')} onRecall={handleRecallZone} t={t}/>
                      <ZoneCard id="C" name="Zone C" {...ZONE_CONFIG.C} onClick={() => handleDispatch('C')} onRecall={handleRecallZone} t={t}/>
                      <ZoneCard id="D" name="Zone D" {...ZONE_CONFIG.D} onClick={() => handleDispatch('D')} onRecall={handleRecallZone} t={t}/>
                      <div className="pt-2 border-t border-gray-800 mt-2"><ZoneCard id="OMEGA" name="ZONE OMEGA" isOmega={true} reward="JACKPOT" hpLoss="-2000" icon={Flame} desc="Core Meltdown" image={OMEGA_IMAGE} onClick={() => handleDispatch('OMEGA')} t={t}/></div>
                  </div>
              </div>
          )}

          {activeTab === 'workshop' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden animate-in fade-in">
                  <div className="absolute inset-0 z-0"><img src="https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Robot/MECH%20FACTORY.png" className="w-full h-full object-cover object-center opacity-60 filter contrast-125" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div></div>
                  <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">
                      <div className="text-center"><h2 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-xl">{t('crafting')}</h2></div>
                      <div className="w-full bg-gray-900/90 border-2 border-yellow-600/50 rounded-xl p-4 backdrop-blur-md shadow-2xl">
                          <button onClick={handleCraft} disabled={blueprints < 50 || scrap < 2000} className={`w-full py-3 rounded font-bold uppercase text-xs flex justify-center gap-2 ${blueprints >= 50 && scrap >= 2000 ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-600'}`}><Hammer size={16}/> {t('craft')}</button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'shop' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden animate-in fade-in">
                  <div className="absolute inset-0 z-0"><img src="https://upbpnshfqvavtxqkwofc.supabase.co/storage/v1/object/public/Robot/BLACK%20MARKET.png" className="w-full h-full object-cover object-center opacity-60 filter contrast-125" /><div className="absolute inset-0 bg-gradient-to-t from-black via-purple-950/50 to-black/40"></div></div>
                  <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">
                      <div className="text-center"><h2 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-xl">{t('shopTitle')}</h2></div>
                      <button onClick={() => handleGacha(false)} className="w-full py-4 bg-gray-900/80 rounded-xl border border-gray-600 text-left px-6 shadow-lg"><span className="text-purple-400 font-mono font-bold text-lg">1 TON</span> {t('singleDrop')}</button>
                      <button onClick={() => handleGacha(true)} className="w-full py-6 bg-purple-900/60 rounded-xl border-2 border-purple-500 text-left px-6 shadow-lg"><span className="text-white font-mono font-bold text-2xl">20 TON</span> {t('warlordBundle')}</button>
                  </div>
              </div>
          )}
      </main>

      {/* FOOTER & NAV */}
      <nav className="fixed bottom-0 w-full bg-black/95 border-t border-cyan-900/50 flex justify-around backdrop-blur z-30 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('hangar')} className={`flex flex-col items-center p-3 transition-colors ${activeTab==='hangar'?'text-cyan-400':'text-gray-600'}`}><Bot size={20} /><span className="text-[9px] mt-1 font-bold">{t('hangar')}</span></button>
        <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center p-3 transition-colors ${activeTab==='map'?'text-cyan-400':'text-gray-600'}`}><Map size={20} /><span className="text-[9px] mt-1 font-bold">{t('zones')}</span></button>
        <button onClick={() => setActiveTab('workshop')} className={`flex flex-col items-center p-3 transition-colors ${activeTab==='workshop'?'text-cyan-400':'text-gray-600'}`}><Wrench size={20} /><span className="text-[9px] mt-1 font-bold">{t('workshop')}</span></button>
        <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center p-3 transition-colors ${activeTab==='shop'?'text-cyan-400':'text-gray-600'}`}><ShoppingCart size={20} /><span className="text-[9px] mt-1 font-bold">{t('market')}</span></button>
      </nav>
      
      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} balances={{ ton: balance, usdt: usdt, scrap: scrap, 'bprint': blueprints }} onDeposit={handleDeposit} onWithdraw={handleWithdraw} t={t} />}
    </div>
  );
};

export default App;