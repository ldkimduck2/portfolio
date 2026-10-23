(function(root){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 const colors={Ice:'Blue',BrainWash:'Green',Clone:'Red'};
 const destinations=[
  {id:'Hub',name:'중앙 거점',chapter:0,sector:0,order:0,image:'Assets/world.jpg',map:'Lvl_Hublevel'},
  {id:'Main01',name:'진입 회랑',chapter:1,sector:1,order:0,image:'Assets/BG_Rest_Preview_1920x1080.png',map:'Lvl_MainLevel01'},
  {id:'Gym',name:'시험의 뜰',chapter:1,sector:2,order:0,image:'Assets/world.jpg',map:'Lvl_TestGym'},
  {id:'Blue',name:'푸른 수문장',chapter:1,sector:3,order:0,image:'Assets/world.jpg',map:'Lvl_TestGym'},
  {id:'Green',name:'안개의 경계',chapter:2,sector:1,order:0,image:'Assets/BG_Menu_Fog_1920x1080.png',map:'Lvl_TestGym'},
  {id:'Red',name:'붉은 정원',chapter:3,sector:1,order:0,image:'Assets/world.jpg',map:'Lvl_TestGym'},
  {id:'Black',name:'검정의 돔',chapter:4,sector:1,order:0,image:'Assets/BG_Menu_Fog_1920x1080.png',map:'Lvl_BlackBossTest'}
 ];
 function session(preview=false){return {currency:preview?2400:0,materials:preview?12:0,collectibles:preview?24:0,sp:preview?3:0,levels:{},erased:[],flags:[],shopPurchases:{},equipment:'Katana',swordArt:'DashAttack',item:'Ice',hp:100,posture:0,healCharges:3,resurrections:2,resurrectionLocked:false,bonfires:['Hub'],lastRest:'Hub',location:'Hub',chapter:1,playSeconds:0,checkpoint:false};}
 class Model{
  constructor(data,stored){
   this.data=data;this.destinations=destinations;
   this.state={version:1,current:session(true),slots:[null,null,null],activeSlot:null,settings:{guide:false,pad:'auto',resolution:'1920 × 1080',mode:'창 모드',vsync:true,fps:'60 FPS',quality:2,master:80,music:65,effects:60,language:'한국어',bindings:{attack:'LMB',guard:'RMB',interact:'E',heal:'H',hook:'G',item:'F',cycle:'2',sword:'3',dodge:'Alt',jump:'Space',crouch:'C'}},debug:{master:false,enemy:false,tokens:false,perception:false,posture:false,hitbox:false,notifies:false,environment:false,camera:false,events:false},enemyDrafts:[]};
   if(stored&&stored.version===1&&Array.isArray(stored.slots)&&stored.slots.length===3&&stored.current&&stored.settings){const defaults=this.state;this.state={...defaults,...clone(stored)};this.state.settings={...defaults.settings,...stored.settings,bindings:{...defaults.settings.bindings,...stored.settings.bindings}};this.state.debug={...defaults.debug,...stored.debug};}
  }
  get s(){return this.state.current;}
  level(id){return this.s.levels[id]||0;}
  row(id){return this.data.upgrades.find(r=>r.Name===id);}
  root(id){const r=this.row(id);return r&&r.TreeParent!=='None'?r.TreeParent:id;}
  available(id){const c=colors[this.root(id)];return !c||this.s.erased.includes(c);}
  requirement(id){const c=colors[this.root(id)];return c?`${c.toUpperCase()} 보스를 처치하면 해금됩니다.`:'';}
  amount(id,secondary=false){const r=this.row(id),l=this.level(id);return r&&l?r.Steps[l-1][secondary?'ValueB':'ValueA']:0;}
  multiplier(id,secondary=false){return this.amount(id,secondary)||1;}
  get maxHP(){return 100+this.amount('Health');}
  get maxPosture(){return 100+this.amount('Posture');}
  get maxHeals(){return 3+this.amount('HealCount');}
  get healAmount(){return 60+this.amount('HealAmount');}
  upgradeStatus(id){const r=this.row(id);if(!r)return {ok:false,reason:'강화 항목이 없습니다.'};if(!this.available(id))return {ok:false,reason:this.requirement(id),kind:'locked'};const step=r.Steps[this.level(id)];if(!step)return {ok:false,reason:'최대 강화에 도달했습니다.',kind:'max'};if(this.s.chapter<step.RequiredChapter)return {ok:false,reason:`Chapter ${String(step.RequiredChapter).padStart(2,'0')} 진입 후 강화할 수 있습니다.`,kind:'chapter',step};if(this.s.currency<step.Currency||this.s.materials<step.Materials)return {ok:false,reason:'성장 재화 또는 강화 재료가 부족합니다.',kind:'poor',step};return {ok:true,step,kind:'ready'};}
  upgrade(id,expected){const c=this.upgradeStatus(id);if(!c.ok||this.level(id)!==expected)return false;this.s.currency-=c.step.Currency;this.s.materials-=c.step.Materials;this.s.levels[id]=expected+1;return true;}
  shopStatus(id){const r=this.data.shop.find(r=>r.Name===id);if(!r)return {ok:false,reason:'상품이 없습니다.'};const bought=this.s.shopPurchases[id]||0,left=r.Stock-bought;if(left<=0)return {ok:false,reason:'품절되었습니다.',left:0};if(this.s.collectibles<r.Price)return {ok:false,reason:'수집품 교환가치가 부족합니다.',left};return {ok:true,left};}
  purchase(id,expected){const r=this.data.shop.find(r=>r.Name===id);if(!this.shopStatus(id).ok||(this.s.shopPurchases[id]||0)!==expected)return false;this.s.collectibles-=r.Price;this.s.shopPurchases[id]=expected+1;if(r.Reward==='UpgradeMaterial')this.s.materials+=r.Amount;else if(r.Reward==='GrowthCurrency')this.s.currency+=r.Amount;return true;}
  damage(n){this.s.hp=Math.max(0,this.s.hp-Math.max(0,n));return this.s.hp===0;}
  heal(){if(!this.s.healCharges||this.s.hp>=this.maxHP||this.s.hp<=0)return false;this.s.healCharges--;this.s.hp=Math.min(this.maxHP,this.s.hp+this.healAmount);return true;}
  rest(id=this.s.location){if(!this.s.bonfires.includes(id))this.s.bonfires.push(id);this.s.location=id;this.s.lastRest=id;this.s.checkpoint=true;this.s.hp=this.maxHP;this.s.posture=0;this.s.healCharges=this.maxHeals;this.s.resurrections=2;this.s.resurrectionLocked=false;this.s.chapter=Math.max(this.s.chapter,destinations.find(d=>d.id===id)?.chapter||1);}
  activate(id){if(!destinations.some(d=>d.id===id))return false;if(!this.s.bonfires.includes(id))this.s.bonfires.push(id);this.s.chapter=Math.max(this.s.chapter,destinations.find(d=>d.id===id).chapter||1);return true;}
  travel(id){if(!this.s.bonfires.includes(id)||id===this.s.location)return false;this.s.location=id;return true;}
  save(slot){if(!Number.isInteger(slot)||slot<0||slot>2)return false;this.state.slots[slot]={id:Date.now()+':'+Math.random().toString(36).slice(2),at:new Date().toISOString(),data:clone(this.s)};this.state.activeSlot=slot;return true;}
  latest(){let at=-1;for(let i=0;i<3;i++)if(this.state.slots[i]&&(at<0||this.state.slots[i].at>this.state.slots[at].at))at=i;return at;}
  load(slot){const s=this.state.slots[slot];if(!s)return false;this.state.current=clone(s.data);this.state.activeSlot=slot;return true;}
  deleteSlot(slot,expectedId){const s=this.state.slots[slot];if(!s||s.id!==expectedId)return false;this.state.slots[slot]=null;if(this.state.activeSlot===slot)this.state.activeSlot=null;return true;}
  newGame(){this.state.current=session(false);this.state.activeSlot=null;}
  resurrect(){if(this.s.hp>0||this.s.resurrections<1||this.s.resurrectionLocked)return false;this.s.resurrections--;this.s.hp=Math.round(this.maxHP*.5);this.s.posture=0;this.s.resurrectionLocked=true;return true;}
  respawn(){this.s.location=this.s.lastRest;this.rest(this.s.lastRest);}
  defeat(color){if(!['Blue','Green','Red','Black'].includes(color)||this.s.erased.includes(color))return false;this.s.erased.push(color);this.s.currency+=color==='Black'?1500:500;this.s.sp++;this.s.resurrectionLocked=false;return true;}
  flag(id){if(!this.s.flags.includes(id))this.s.flags.push(id);}
  dialogueRow(id){return this.data.dialogue.find(r=>r.Name===id);}
  choices(row){return (row.Choices||[]).filter(c=>c.RequiredFlags.every(f=>this.s.flags.includes(f))&&!c.BlockedFlags.some(f=>this.s.flags.includes(f))).slice(0,2);}
  addResources(){this.s.currency+=3000;this.s.materials+=15;this.s.collectibles+=12;this.s.sp+=3;}
  sampleSaved(){this.state.current=session(true);this.rest('Hub');this.save(0);}
  export(){return clone(this.state);}
 }
 root.SSModel={Model,session,destinations};
})(typeof window!=='undefined'?window:globalThis);
