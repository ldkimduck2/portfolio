(function(){
'use strict';
const D=window.SS_DATA,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fmt=x=>Number(x).toLocaleString('ko-KR'),copy=x=>JSON.parse(JSON.stringify(x));
let stored=null,storageOK=true;try{stored=JSON.parse(localStorage.getItem('projectss-ui-atlas-v1')||'null');}catch(e){storageOK=false;}
const model=new SSModel.Model(D,stored);
const groups=[
 ['main','FRONT END','메인메뉴','첫 시작부터 저장한 여정을 이어가는 화면.','05'],
 ['hud','IN GAME','인게임 HUD','체력·체간·아이템과 은신 상태를 실시간으로 확인합니다.','07'],
 ['pause','PAUSE & INVENTORY','퍼즈 · 인벤토리','상태 확인, 장비·검술 장착과 기록 열람.','06'],
 ['rest','REST POINT','화톳불','활성화부터 휴식·거점 이동·저장까지.','04'],
 ['upgrade','UPGRADES','강화','실제 DT의 비용과 아이템 강화 트리를 체험합니다.','05'],
 ['dialogue','NPC DIALOGUE','NPC 대화','대사, 두 갈래 선택과 다음 화면이 연결됩니다.','03'],
 ['shop','EXCHANGE SHOP','교환 상점','수집품 교환가치, 구매 확인과 재고가 이어집니다.','03'],
 ['death','DEATH & REVIVAL','사망 · 부활','남은 부활 기회와 마지막 휴식 지점으로 복귀.','02'],
 ['loading','TRAVEL LOADING','로딩','최소 5초 진행 표시와 실제 DT 팁 넘기기.','02'],
 ['boss','COLOR PROGRESSION','보스 · 획득 알림','색상 소거, 능력 보상과 허브 구체 해금.','04'],
 ['debug','DEBUG TOOLS','디버그','필요한 디버그 표시만 켜고 끕니다.','05'],
 ['enemy','EDITOR TOOL','적 만들기','프리셋을 고르고 적 설정 초안을 만듭니다.','01']
];
const ui={group:'main',route:'main',tab:'status',selection:'Katana',settingsSection:'GAMEPLAY',upgradeCategory:'Weapon',upgradeRoot:'Katana',upgradeNode:'Katana',itemCategory:0,journal:0,journalTopic:0,frontSettings:false,returnFromSlots:'main',saving:false,slot:0,restPage:'main',restOption:'rest',travelSelection:'Main01',expanded:[1],currentFire:'Hub',device:'keyboard',manualDevice:false,modal:null,modalIndex:1,notice:'',toastTimer:0,dialogueRow:'Greeting',dialoguePhase:'line',dialogueChoice:0,shop:'Material',tip:0,loading:null,mainOpening:false,restLeaving:false,activation:false,trail:model.s.hp,trailHold:0,itemCooldown:0,artCooldown:0,bossHP:1,bossPosture:0,showBoss:false,stealth:'none',aware:false,awareness:0,lock:false,executionReady:false,dangerUntil:0,pickupUntil:0,world:'hub',bossColor:'Blue',banner:false,rewardPending:null,debugPage:'enemy',analogNext:0,lastPad:[],focusIndex:0,form:{preset:'Katana',name:'순찰병',weapon:'Katana',scale:1,hp:100,posture:100,boss:false,patrol:true,grass:true,environment:true},lastTick:performance.now()};

const Native=window.SS_NATIVE_FACTORY({D,N:window.SS_NATIVE_DATA,model,ui,h,fmt,act,go,render,persist,startLoading,afterSaving,art,itemInfo,toast,upgradeSummary,guideOverlay:()=>''});
function persist(){try{localStorage.setItem('projectss-ui-atlas-v1',JSON.stringify(model.export()));}catch(e){storageOK=false;}}
function art(){return D.swordArts.find(r=>r.Name===model.s.swordArt)||D.swordArts[0];}
function itemInfo(id=model.s.item){return {Ice:{name:'얼음',icon:'Ice',cooldown:12},BrainWash:{name:'세뇌',icon:'MindControl',cooldown:18},Clone:{name:'분신 소환',icon:'Clone',cooldown:22}}[id];}
function img(name,cls='',alt=''){const mapped={I_Weapon:'Katana.svg',I_BodyUpgrade:'BodyUpgrade.png',I_SwordArt:'SwordArt.png',I_Heal:'Heal.png',I_Ice:'Ice.png',I_MindControl:'MindControl.png',I_Clone:'Clone.png',I_KeyItem:'Crystal.png'};const path=D.icons?.[name]||'Assets/'+(mapped[name]||(/[.]/.test(name)?name:name+'.png'));return `<img src="${path}" class="${cls}" alt="${h(alt)}" draggable="false">`;}
function key(k,p){return Native.key(k,p,22);
}
const prompt=(k,p,label)=>`<span class="prompt">${key(k,p)}${h(label)}</span>`;
const b=(label,action,cls='',extra='')=>`<button type="button" data-action="${h(action)}" class="${cls}" data-nav ${extra}>${label}</button>`;
const list=(label,action,active,small='',extra='')=>b(`<span>${h(label)}</span>${small?`<small>${small}</small>`:''}`,action,'list-button '+(active?'selected-line':''),extra);
const brand=place=>`<div class="game-brand">PROJECTSS</div>${place?`<div class="game-place">${h(place)}</div>`:''}`;
const wallet=shop=>`<div class="wallet">${shop?`<span><small>수집품 교환가치</small>${fmt(model.s.collectibles)}</span>`:`<span><small>성장 재화</small>${fmt(model.s.currency)}</span>`}<span><small>강화 재료</small>${fmt(model.s.materials)}</span>${shop?'':`<span><small>SP</small>${model.s.sp}</span>`}</div>`;
const footer=(back='back',caption='돌아가기',right='결정')=>`<footer class="game-footer">${b(prompt('Backspace','B',caption),back)}<span class="prompt">${key('↑ ↓','D-pad')} 항목 이동</span><span class="spacer"></span>${right?b(prompt('Enter','A',right),'activate'):''}</footer>`;
function paperHeader(title,subtitle='',place=''){return `${brand(place)}<h2 class="game-title">${h(title)}</h2>${subtitle?`<p class="game-subtitle">${h(subtitle)}</p>`:''}<div class="game-line"></div>`;}
function toast(text){clearTimeout(ui.toastTimer);$('#toast').textContent=text;$('#toast').classList.add('show');ui.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2200);}
function setDevice(device,manual=false){if(ui.device===device&&!manual)return;ui.device=device;if(manual)ui.manualDevice=true;render();}
function go(route,opts={}){
 ui.modal=null;ui.notice='';ui.route=route;ui.focusIndex=0;
 if(opts.group)ui.group=opts.group;else if(groups.some(g=>g[0]===route))ui.group=route;
 if(route==='slots'){ui.slot=model.latest()>=0?model.latest():0;}
 if(route==='hud')ui.trail=Math.max(ui.trail,model.s.hp);
 if(route==='upgrade'){model.activate(ui.currentFire);}
 history.replaceState(null,'','#'+ui.group);render();
}
function chooseGroup(group){
 if(ui.mainOpening||ui.restLeaving)return;
 clearTimeout(ui.toastTimer);$('#toast').classList.remove('show');
 ui.loading=null;ui.modal=null;ui.nativeTravelConfirm=null;ui.nativeOverwrite=null;ui.frontSettings=false;if(group==='main')ui.mainPage='menu';
 if(group==='loading'){startLoading(model.s.location,'hud',true);return;}
 if(group==='death'){model.s.hp=0;model.s.resurrectionLocked=false;ui.finalDeath=false;go('death');return;}
 if(group==='rest'){ui.currentFire=model.s.location;ui.restPage='main';go('rest');return;}
 if(group==='dialogue'){startDialogue();return;}
 if(group==='shop'){go('shop');return;}
 if(group==='boss'){ui.world='hub';go('boss');return;}
 if(group==='upgrade'){ui.upgradeCategory='Weapon';ui.upgradeRoot=ui.upgradeNode='Katana';}
 if(group==='pause'){ui.tab='home';ui.frontSettings=false;}
 go(group);
}
// Keep Slate-like persistent focus and scroll containers during preview changes.
function patchNative(parent,html){
 const template=document.createElement('template');template.innerHTML=html;
 const same=(a,b)=>a.nodeType===b.nodeType&&(a.nodeType!==1||(a.tagName===b.tagName&&(a.dataset.action||'')===(b.dataset.action||'')));
 function children(target,source){
  const next=[...source.childNodes];let cursor=target.firstChild;
  for(const incoming of next){
   let current=cursor;
   if(!current||!same(current,incoming)){
    current=[...target.childNodes].find(n=>same(n,incoming)&&n!==cursor&&n.nodeType===1&&n.dataset.action);
    if(current)target.insertBefore(current,cursor);else{current=incoming.cloneNode(true);target.insertBefore(current,cursor);cursor=current.nextSibling;continue;}
   }
   if(current.nodeType===3){if(current.textContent!==incoming.textContent)current.textContent=incoming.textContent;}
   else if(current.nodeType===1){
    for(const attr of [...current.attributes])if(!incoming.hasAttribute(attr.name))current.removeAttribute(attr.name);
    for(const attr of [...incoming.attributes])if(current.getAttribute(attr.name)!==attr.value)current.setAttribute(attr.name,attr.value);
    children(current,incoming);
   }
   cursor=current.nextSibling;
  }
  while(cursor){const stale=cursor;cursor=cursor.nextSibling;stale.remove();}
 }
 children(parent,template.content);
}
function render(){
 const group=groups.find(g=>g[0]===ui.group)||groups[0];
 $('#group-code').textContent=String(groups.indexOf(group)+1).padStart(2,'0')+' / '+group[1];$('#group-name').textContent=group[2];$('#group-description').textContent=group[3];
 $$('.category-button').forEach(el=>{el.classList.toggle('active',el.dataset.group===ui.group);el.setAttribute('aria-current',el.dataset.group===ui.group?'page':'false');});
 $('#device').textContent=ui.device==='pad'?'패드 표시':'키보드 / 마우스';
 const world=$('#world');world.className='world';if(['pause','upgrade','shop','slots','enemy'].includes(ui.route))world.classList.add('paper-world');else if(ui.route==='rest'&&!ui.activation)world.classList.add('rest-world');
 if(ui.world==='white')world.classList.add('white-world');if(ui.world==='black')world.classList.add('black-world');if(ui.route!=='main')world.classList.add('playing');
 $('#canvas').className='mode-'+ui.route;
 const views={main:mainView,hud:hudView,pause:pauseView,rest:restView,upgrade:upgradeView,dialogue:dialogueView,shop:shopView,death:deathView,loading:loadingView,boss:bossView,slots:slotsView,debug:debugView,enemy:enemyView};
 const priorLayout=$('#screen [data-native-layout]')?.dataset.nativeLayout,priorFinal=!!$('#screen .n-final-death');
 const screenHTML=(Native.views[ui.route]||views[ui.route]||mainView)();
 if(priorLayout===ui.route)patchNative($('#screen'),screenHTML);else $('#screen').innerHTML=screenHTML;
 if(priorLayout===ui.route&&(ui.route!=='death'||priorFinal===!!ui.finalDeath))$$('#screen [data-native-layout]').forEach(e=>e.classList.add('n-no-enter'));
 renderModal();renderSceneTabs();renderTools();updateHUD();
 const notes={main:'NEW GAME은 즉시 시작합니다. 첫 저장은 화톳불에서 슬롯을 선택하세요.',hud:'실제 UI 규칙에 맞춰 빨강 HP는 즉시 줄고 노랑 피해 게이지가 늦게 따라옵니다. 은신 표시는 아이콘만 사용합니다.',pause:'상단 탭과 왼쪽 목록은 마우스를 올리거나 키보드로 이동하면 즉시 미리보기가 바뀝니다.',rest:'화톳불 활성화 → 휴식 메뉴 → HUB / Chapter / Sector 목적지 → 확인 → 최소 5초 로딩으로 이어집니다.',upgrade:'비용·효과·진행 조건은 현재 DT_Upgrade 19개 행을 사용합니다. 색상 능력은 보스 처치로 해금합니다.',dialogue:'대사와 최대 2개 선택지는 같은 위치에 이어서 표시됩니다. 대화 중 HUD는 좌우로 사라집니다.',shop:'실제 DT_Shop의 3개 상품입니다. 교환 확인 후 수집품 가치와 재고가 함께 줄어듭니다.',death:'부활 기회가 없으면 최종 사망 화면으로 바뀝니다. 다시 시작하면 마지막 휴식 장소로 돌아갑니다.',loading:'최소 5초가 지난 뒤 완료됩니다. Q/E 또는 X/B로 실제 DT_LoadingTips 32개 팁을 넘깁니다.',boss:'BLUE → 얼음, GREEN → 세뇌, RED → 분신. 세 빛을 모으면 허브 구체가 흰색으로 변합니다.',slots:'브라우저 안의 시안 저장입니다. 슬롯은 최대 3개이며 삭제·덮어쓰기 전 확인을 거칩니다.',debug:'선택한 표시만 켜집니다. 전체 OFF를 해도 개별 선택 상태는 유지됩니다.',enemy:'에디터 도구의 HTML 체험입니다. 생성한 적 설정은 JSON으로 내려받을 수 있습니다.'};
 $('#screen-note').textContent=notes[ui.route]||'';
}
function mainView(){
 if(ui.mainPage==='quit')return `<section class="view" style="background:#060906;display:grid;place-items:center"><div style="text-align:center;color:#d2ddc3"><h2 style="font-size:20px;letter-spacing:.3em;font-weight:400">PROJECTSS</h2>${b('메인메뉴로','credits-back','quiet',`style="margin-top:25px;color:#9baa88"`)}</div></section>`;
 const has=model.latest()>=0;
 const entries=[...(has?[['CONTINUE','continue'],['NEW GAME','new-game'],['LOAD GAME','load-menu']]:[['NEW GAME','new-game']]),['OPTIONS','front-settings'],['CREDITS','credits'],['QUIT','quit']];
 if(ui.mainPage==='credits')return `<section class="view dark-key"><div class="main-intro"></div><div class="menu-letterbox top"></div><div class="menu-letterbox bottom"></div><div class="credits"><h2>CREDITS</h2><p>PROJECTSS<br>변화하는 브루탈리즘 공간을 탐험하는 액션 어드벤처.<br><br>개발 · ProjectSS<br>엔진 · Unreal Engine 5.8<br>글꼴 · Pretendard</p>${b('BACK','credits-back')}</div></section>`;
 return `<section class="view dark-key ${ui.mainOpening?'starting':''}"><div class="main-intro"></div><div class="menu-letterbox top"></div><div class="menu-letterbox bottom"></div><nav class="main-list" aria-label="메인메뉴">${entries.map(([name,action],i)=>b(name,action,i===ui.focusIndex?'active':'')).join('')}</nav><div class="main-help">${prompt('Enter','A','선택')}</div><div class="main-version">PROJECTSS / UI 2026.10.18</div></section>`;
}
function startNewGame(){
 if(ui.mainOpening)return;model.newGame();ui.trail=model.s.hp;ui.stealth='none';ui.aware=false;ui.lock=false;ui.executionReady=false;ui.cooldowns={};ui.artCooldown=0;ui.showBoss=false;ui.finalDeath=false;ui.mainOpening=true;ui.world='hub';persist();render();
 setTimeout(()=>{ui.mainOpening=false;go('hud');},3200);
}
function topTabs(){const names=[['status','STATUS'],['equipment','EQUIPMENT'],['sword','SWORD ART'],['item','ITEM'],['journal','JOURNAL'],['system','SYSTEM']];return `${brand('')}<nav class="top-tabs">${b(`${key('Q','LB')} ‹`,'tab-prev','nav-arrow')}${names.map(([id,name])=>b(name,'pause-tab:'+id,'tab '+(ui.tab===id?'active':''),`data-preview="pause-tab:${id}"`)).join('')}${b(`› ${key('E','RB')}`,'tab-next','nav-arrow')}</nav>`;}
function pauseView(){
 if(ui.tab==='home'){
  const names=[['계속하기','resume'],['상태','pause-tab:status'],['장비','pause-tab:equipment'],['검술','pause-tab:sword'],['아이템','pause-tab:item'],['기록','pause-tab:journal'],['설정','pause-tab:system'],['타이틀로 돌아가기','return-title']];
  return `<section class="view paper-view">${brand('')}<h2 class="pause-title">PAUSED</h2><nav class="pause-list">${names.map(([n,a],i)=>list(n,a,i===ui.focusIndex)).join('')}</nav>${img('Player_Stand','pause-hero')}<div class="pause-summary"><span>생명력 <strong>${model.s.hp} / ${model.maxHP}</strong></span><span>장착 검술 <strong>${h(art().DisplayName)}</strong></span></div>${footer('resume','계속하기','선택')}</section>`;
 }
 const titles={status:'STATUS',equipment:'EQUIPMENT',sword:'SWORD ART',item:'ITEM',journal:'JOURNAL',system:'SYSTEM'};
 const subtitles={status:'현재 신체와 장착 정보를 확인합니다.',equipment:'전투에 사용할 무기를 선택합니다.',sword:'한 번에 하나의 검술을 장착합니다.',item:'휴대할 아이템을 확인하고 선택합니다.',journal:'탑을 오르며 익힌 전투와 탐험의 기록.',system:'게임 환경을 설정합니다.'};
 const header=ui.frontSettings?`${brand('')}<h2 class="game-title">OPTIONS</h2><p class="game-subtitle">게임 환경을 설정합니다.</p>`:`${topTabs()}<h2 class="game-title">${titles[ui.tab]}</h2><p class="game-subtitle">${subtitles[ui.tab]}</p>`;
 let body='';
 if(ui.tab==='status')body=`<div class="menu-columns fade-content"><section class="status-list"><h3>현재 상태</h3>${[['생명력',`${model.s.hp} / ${model.maxHP}`],['최대 체간',model.maxPosture],['신체 강화',`HP +${model.level('Health')} / 체간 +${model.level('Posture')}`],['스킬 포인트',model.s.sp],['성장 재화',fmt(model.s.currency)],['강화 재료',model.s.materials]].map(([k,v])=>`<div class="status-line"><span>${k}</span><strong>${v}</strong></div>`).join('')}</section>${img('Player_Stand','profile-hero')}<section class="info-block"><h3>장착 장비</h3><div class="status-line"><span>현재 무기</span><strong>${h(model.s.equipment)}</strong></div><div class="status-line"><span>장착 검술</span><strong>${h(art().DisplayName)}</strong></div><h3 style="margin-top:35px">습득한 색상 능력</h3>${['Ice','BrainWash','Clone'].filter(id=>model.available(id)).map(id=>`<p>${h(itemInfo(id).name)}</p>`).join('')||'<p>아직 습득한 능력이 없습니다.</p>'}</section></div>`;
 else if(ui.tab==='sword'){
  const r=D.swordArts.find(r=>r.Name===ui.selection)||art();
  body=`<nav class="side-menu">${D.swordArts.map(r=>list(r.DisplayName,'select-art:'+r.Name,r.Name===ui.selection,r.Name===model.s.swordArt?'장착':'',`data-preview="select-art:${r.Name}"`)).join('')}</nav><div class="entry-detail fade-content"><div>${img(r.Movement==='Leap'?'LeapSlash':'DashAttack','large-art')}<h2>${h(r.DisplayName)}</h2><p>${r.Movement==='Leap'?'적에게 도약하여 착지 지점을 내려베는 검술.':'적 앞까지 한순간에 파고들어 베는 검술.'}</p><p class="sword-use-hint">${key('LMB','RB')} + ${key('RMB','LB')} 사용</p></div><section class="tick-stats"><h3>기술 정보</h3>${[['피해량',r.Damage],['체간 피해',r.PostureDamage],['사거리',`${D.lockRange/100} m`],['재생 속도',r.AttackPlayRate+'x'],['재사용',r.Cooldown+' s']].map(([k,v])=>`<div class="status-line"><span>${k}</span><strong>${v}</strong></div>`).join('')}<p>${r.Name===model.s.swordArt?'현재 장착한 검술입니다.':'선택 후 장착하면 HUD에도 반영됩니다.'}</p>${b(`${r.Name===model.s.swordArt?'장착 중':'장착'} ${key('Enter','A')}`,'equip-art:'+r.Name,'primary',r.Name===model.s.swordArt?'disabled':'')}</section></div>`;
 }
 else if(ui.tab==='equipment'){
  const weapons=['Katana','Nodachi','Greatsword','Double Axe','Sword & Shield','Spear'];const selected=weapons.includes(ui.selection)?ui.selection:model.s.equipment;
  body=`<nav class="side-menu">${weapons.map(id=>list(id,'select-weapon:'+id,id===selected,id===model.s.equipment?'장착 중':'',`data-preview="select-weapon:${id}"`)).join('')}</nav><div class="entry-detail fade-content"><div><div class="hero" style="height:250px">${img('Katana.svg')}</div><h2 style="margin-top:275px">${h(selected)}</h2></div><section class="tick-stats"><h3>장착 정보</h3><div class="status-line"><span>강화 단계</span><strong>+${selected==='Katana'?model.level('Katana'):0}</strong></div><div class="status-line"><span>무기 분류</span><strong>${h(selected)}</strong></div><p>장착한 무기는 저장 슬롯과 레벨 이동 후에도 유지됩니다.</p>${b(`장착 ${key('Enter','A')}`,'equip-weapon:'+selected,'primary',selected===model.s.equipment?'disabled':'')}</section></div>`;
 }
 else if(ui.tab==='item')body=itemInventoryView();
 else if(ui.tab==='journal')body=journalView();
 else if(ui.tab==='system')body=settingsView();
 return `<section class="view paper-view">${header}${body}${footer(ui.frontSettings?'front-back':'pause-home',ui.frontSettings?'뒤로':'계속하기',ui.tab==='status'?'':'결정')}</section>`;
}
function itemInventoryView(){
 const cats=['소비 아이템','투척 아이템','특수 아이템','중요 아이템'];const ids=ui.itemCategory===0?['Heal']:ui.itemCategory===1?['Ice','BrainWash']:ui.itemCategory===2?['Clone']:[];
 const id=ids.includes(ui.selection)?ui.selection:ids[0];
 const info=id==='Heal'?{name:'회복약',icon:'Heal',description:'휴식하면 회복 횟수가 다시 채워집니다.'}:id?{...itemInfo(id),description:model.row(id).Description}:null;
 return `<nav class="side-menu">${cats.map((n,i)=>list(n,'item-category:'+i,ui.itemCategory===i,'',`data-preview="item-category:${i}"`)).join('')}</nav><div class="entry-detail fade-content"><div>${info?`${img(info.icon,'large-art')}<h2>${h(info.name)}</h2><p>${h(info.description)}</p>`:'<h2>중요 아이템</h2><p>아직 발견한 중요 아이템이 없습니다.</p>'}</div><section class="info-block">${ids.map(i=>list(i==='Heal'?'회복약':itemInfo(i).name,'select-item:'+i,id===i,i==='Heal'?`${model.s.healCharges} / ${model.maxHeals}`:model.available(i)?(model.s.item===i?'선택 중':'보유'):'미습득',`data-preview="select-item:${i}"`)).join('')}${id&&id!=='Heal'?`<p style="margin-top:28px">${model.available(id)?'선택한 아이템은 F / RT로 사용합니다.':h(model.requirement(id))}</p>${b(`선택 ${key('Enter','A')}`,'equip-item:'+id,'primary',model.available(id)?'':'disabled')}`:''}</section></div>`;
}
function journalView(){
 const cats=['전투','탐험','잠입'];const topics=[['공격과 방어','검술','인살'],['갈고리','벽 달리기','회피와 달리기'],['앉기','후방 인살']];const texts=[['공격과 방어는 적의 체간을 압박하는 기본입니다. 정확한 타이밍에 가드하면 패링이 발생합니다.','검술을 장착한 뒤 공격과 가드를 함께 누르면 발동합니다. 락온한 적이나 바라보는 방향의 적에게 접근합니다.','체간이 붕괴된 적에게 빨간 표시가 나타납니다. 공격을 누르면 인살합니다.'],['갈고리 대상을 바라보고 G / LT를 누르면 이동합니다. 연속 이동으로 수직 공간을 탐험할 수 있습니다.','전용 벽 근처에서 점프하며 이동하면 벽을 따라 달립니다.','닷지 후 방향 입력을 유지하면 바로 이동합니다. 버튼을 누른 채 이동하면 달립니다.'],['앉아서 은신 가능한 풀숲에 들어가면 감은 눈 아이콘이 나타납니다. 이미 발각된 적의 시야 안에서는 숨을 수 없습니다.','눈치채지 못한 적의 뒤로 접근하면 인살할 수 있습니다. 소리를 내거나 공격하면 은신이 해제됩니다.']];
 const t=Math.min(ui.journalTopic,topics[ui.journal].length-1);
 return `<nav class="side-menu">${cats.map((n,i)=>list(n,'journal-category:'+i,ui.journal===i,'',`data-preview="journal-category:${i}"`)).join('')}</nav><div class="entry-detail journal-detail fade-content"><nav>${topics[ui.journal].map((n,i)=>list(n,'journal-topic:'+i,t===i,'',`data-preview="journal-topic:${i}"`)).join('')}</nav><section>${img(ui.journal===0?'DashAttack':ui.journal===1?'Player_Stand':'BodyUpgrade','journal-art')}<h2>${h(topics[ui.journal][t])}</h2><p>${h(texts[ui.journal][t])}</p></section></div>`;
}
function settingsView(){
 const s=model.state.settings,sections=['GAMEPLAY','DISPLAY','VIDEO','SOUND','LANGUAGE','REMAPPING'];
 const choice=(name,value,id)=>`<div class="setting"><span class="setting-name">${name}</span><div class="setting-control">${b('‹','setting:'+id+':-1')}<span class="setting-value">${h(value)}</span>${b('›','setting:'+id+':1')}</div></div>`;
 let body='';
 if(ui.settingsSection==='GAMEPLAY')body=choice('조작 안내',s.guide?'켬':'끔','guide')+choice('디버그 설정','열기','debug')+choice('패드 아이콘',s.pad==='auto'?'자동':s.pad,'pad')+'<p class="setting-note">최근 사용한 입력 장치에 맞춰 버튼 안내가 바뀝니다.</p>';
 if(ui.settingsSection==='DISPLAY'){const pending=ui.display||{resolution:s.resolution,mode:s.mode};body=choice('해상도',pending.resolution,'resolution')+choice('화면 모드',pending.mode,'mode')+choice('수직 동기화',s.vsync?'켬':'끔','vsync')+choice('프레임 제한',s.fps,'fps')+`<p class="setting-note">해상도와 화면 모드를 선택한 뒤 적용하세요.<br>현재 적용값 ${h(s.resolution)} · ${h(s.mode)}</p><div class="setting-apply">${b(`적용 ${key('Enter','A')}`,'apply-display','primary',!ui.display?'disabled':'')}</div>`;}
 if(ui.settingsSection==='VIDEO')body=choice('그래픽 품질',['낮음','보통','높음','매우 높음'][s.quality],'quality')+'<p class="setting-note">선택한 품질을 저장합니다.</p>';
 if(ui.settingsSection==='SOUND')body=[['master','전체 음량'],['music','배경 음악'],['effects','효과음']].map(([id,n])=>`<label class="setting"><span class="setting-name">${n}</span><div class="setting-control"><input aria-label="${n}" type="range" min="0" max="100" value="${s[id]}" data-setting-range="${id}"><span class="setting-value" style="min-width:55px">${s[id]}</span></div></label>`).join('');
 if(ui.settingsSection==='LANGUAGE')body=choice('언어',s.language,'language');
 if(ui.settingsSection==='REMAPPING'){const labels={attack:'공격 / 인살',guard:'가드',interact:'상호작용',heal:'회복',hook:'갈고리',item:'선택 아이템',cycle:'아이템 전환',sword:'검술 전환',dodge:'닷지',jump:'점프',crouch:'앉기'};body=`<div style="max-height:326px;overflow:auto">${Object.entries(labels).map(([id,n])=>`<div class="rebind-row"><span>${n}</span>${b(key(s.bindings[id],s.bindings[id]),'rebind:'+id)}</div>`).join('')}</div>${b('기본값으로 복원','reset-bindings','quiet',`style="margin-top:20px"`)}`;}
 return `<nav class="side-menu">${sections.map(n=>list(n,'settings-section:'+n,ui.settingsSection===n,'',`data-preview="settings-section:${n}"`)).join('')}</nav><div class="settings-body fade-content">${body}</div>`;
}

function eyeSVG(state){const closed=state==='hidden'||state==='search';return `<svg viewBox="0 0 40 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">${closed?'<path d="M4 10Q20 26 36 10M10 15l-3 4m13-1v5m10-8 3 4"/>':'<path d="M3 14Q20-1 37 14Q20 29 3 14Z"/><circle cx="20" cy="14" r="4"/>'}</svg>`;}
function playerWorld(){return `<div class="player-shadow"></div>${img('Player_Stand','player-cutout '+(ui.stealth!=='none'?'crouched':''))}`;}
function postureColor(f){const t=Math.max(0,Math.min(1,f));return `rgb(${Math.round(230+5*t)},${Math.round(185-100*t)},${Math.round(20-5*t)})`;}
function hudView(options={}){
 const hp=100*model.s.hp/model.maxHP,trail=100*ui.trail/model.maxHP,item=itemInfo();
 const conceal=ui.stealth!=='none';const concealedColor={hidden:'#cce5be',search:'#f1c65a',spotted:'#ff3d25',revealed:'#ffc348'}[ui.stealth];
 const cuts=options.characters===false?'':playerWorld();
 let content=`${cuts}<div class="hud-left"><div class="art-icon" title="${h(art().DisplayName)}">${img(art().Movement==='Leap'?'LeapSlash':'SwordArt')}</div><div class="hp-cluster"><div class="revives" aria-label="남은 부활 ${model.s.resurrections}회">${[0,1].map(i=>`<i class="${i<model.s.resurrections?'':'spent'}"></i>`).join('')}</div><div class="hp-frame" aria-label="현재 HP ${model.s.hp}"><div class="hp-trail" data-hp-trail style="width:${trail}%"></div><div class="hp-fill" data-hp-fill style="width:${hp}%"></div><div class="hp-value" data-hp-value>${Math.round(model.s.hp)} / ${model.maxHP}</div></div></div></div><div class="hud-right"><div class="hud-slot"><small>회복</small>${img('Heal')}<strong data-heal-count>${model.s.healCharges}</strong></div><div class="hud-slot item"><small>스킬</small>${img(item.icon)}${b('‹','cycle-item:-1','cycle prev',`aria-label="이전 아이템"`)}${b('›','cycle-item:1','cycle next',`aria-label="다음 아이템"`)}<strong>${h(item.name)}</strong><div class="slot-dots">${['Ice','BrainWash','Clone'].map(id=>`<b class="${model.s.item===id?'on':''}">•</b>`).join('')}</div><span data-item-cooldown style="font-size:10px;position:absolute;bottom:-17px;left:0;right:0">${ui.itemCooldown>0?ui.itemCooldown.toFixed(1)+' s':''}</span></div></div>`;
 if(model.s.posture>0)content+=`<div class="posture-frame"><i class="posture-fill" style="width:${100*model.s.posture/model.maxPosture}%;background:${postureColor(model.s.posture/model.maxPosture)}"></i><i class="posture-tick"></i></div>`;
 if(ui.showBoss)content+=`<div class="boss-hud">${({Blue:'BLUE / 푸른 수문장',Green:'GREEN / 안개의 지배자',Red:'RED / 붉은 군주',Black:'BLACK / 검정의 왕'})[ui.bossColor]}<div class="boss-hp"><i style="width:${100*ui.bossHP}%"></i></div><div class="boss-posture"><i style="width:${ui.bossPosture*100}%;background:${postureColor(ui.bossPosture)}"></i></div></div>`;
 if(conceal)content+=`<div class="stealth-eye" style="color:${concealedColor}" aria-label="${({hidden:'은신 중',search:'적 수색 중',spotted:'발각됨',revealed:'은신 해제'})[ui.stealth]}">${eyeSVG(ui.stealth)}</div>`;
 if(ui.lock)content+=`<div class="lock-dot ${ui.executionReady?'ready':''}" aria-label="${ui.executionReady?'인살 가능':'락온'}"></div>`;
 if(ui.aware)content+=`<div class="aware-icon"><svg viewBox="0 0 40 44" width="40" height="44"><defs><clipPath id="notice-clip"><path d="M20 3L38 39H2Z"/></clipPath></defs><rect data-awareness-fill x="0" y="${44*(1-ui.awareness)}" width="40" height="44" fill="#f4d483" clip-path="url(#notice-clip)"/><path d="M20 3L38 39H2Z" fill="none" stroke="#f4e9bd" stroke-width="1.5"/></svg></div>`;
 if(ui.dangerUntil>performance.now())content+='<div class="danger-icon" data-danger aria-label="위험 공격">危</div>';
 if(ui.pickupUntil>performance.now())content+='<div class="pickup" data-pickup>수집품 획득 · 교환가치 +3</div>';
 if(options.interact)content+=b(prompt('E','X',options.interactLabel||'화톳불에서 휴식'),'interact','interact-prompt dark-key');
 if(model.state.settings.guide)content+=`<div style="position:absolute;right:18px;top:18px;padding:17px 20px;background:#101b1bcc;color:#e4eadb;font-size:12px;line-height:2.4;min-width:250px">조작 안내${[['공격 / 인살','LMB','RB'],['가드','RMB','LB'],['닷지','Alt','B'],['갈고리','G','LT'],['아이템 사용','F','RT'],['상호작용','E','X'],['메뉴','Esc','Menu']].map(([n,k,p])=>`<div style="display:flex;justify-content:space-between;gap:25px"><span>${n}</span>${key(k,p)}</div>`).join('')}</div>`;
 if(model.state.debug.master)content+=`<div class="debug-overlay">${Object.entries(model.state.debug).filter(([k,v])=>v&&k!=='master').map(([k])=>h(({enemy:'AI · Strafe / Patrol',tokens:'ATTACK TOKEN · 1 / 3',perception:'SIGHT · LAST KNOWN POSITION',posture:'POSTURE · '+Math.round(model.s.posture),hitbox:'WEAPON TRACE · CAPSULE',notifies:'NOTIFY · ATTACK WINDOW',environment:'PRISMATISCAPE · BODY / WIND',camera:'CAMERA · LOCK ON',events:'COMBAT EVENT LOG'})[k])).join('<br>')}</div>`;
 return `<section class="view ${options.hideHUD?'hud-hidden':''}">${content}</section>`;
}
function updateHUD(){
 Native.update();return;
 const hp=Math.max(0,Math.min(100,model.s.hp/model.maxHP*100));
 $$('[data-hp-fill]').forEach(e=>e.style.width=hp+'%');$$('[data-hp-trail]').forEach(e=>e.style.width=(Math.max(model.s.hp,ui.trail)/model.maxHP*100)+'%');$$('[data-hp-value]').forEach(e=>e.textContent=`${Math.round(model.s.hp)} / ${model.maxHP}`);$$('[data-heal-count]').forEach(e=>e.textContent=model.s.healCharges);
 $$('[data-item-cooldown]').forEach(e=>e.textContent=ui.itemCooldown>0?ui.itemCooldown.toFixed(1)+' s':'');
 const notice=$('[data-awareness-fill]');if(notice)notice.setAttribute('y',44*(1-ui.awareness));
 $$('[data-danger]').forEach(e=>{if(ui.dangerUntil<=performance.now())e.remove();});$$('[data-pickup]').forEach(e=>{if(ui.pickupUntil<=performance.now())e.remove();});
}
function restView(){
 const active=model.s.bonfires.includes(ui.currentFire),fire=model.destinations.find(d=>d.id===ui.currentFire)||model.destinations[0];
 if(ui.activation)return `<section class="view">${playerWorld()}<div class="bonfire-object active"></div><div class="activation-banner">BONFIRE ACTIVATED</div></section>`;
 if(!active)return hudView({interact:true,interactLabel:'화톳불 활성화'})+'<div class="bonfire-object"></div>';
 const title=ui.restPage==='travel'?'이동':'REST';
 const left=`<div class="rest-left-content"><div class="rest-place">${h(fire.name)}</div><h2>${title}</h2><div class="short-rule"></div><p class="rest-blurb">${ui.restPage==='travel'?'활성화한 목적지를 선택하고<br>이동을 확정하세요.':'이곳에서 몸을 회복하고,<br>다음 여정을 준비합니다.'}</p>${ui.restPage==='travel'?'<p class="rest-blurb" style="margin-top:35px">HUB<br>↓<br>CHAPTER<br>↓<br>SECTOR</p>':`<nav class="rest-options">${[['휴식','rest-again','rest'],['이동','rest-travel','travel'],['강화','rest-upgrade','upgrade'],['떠나기','rest-leave','leave']].map(([n,a,id])=>list(n,a,ui.restOption===id,'',`data-preview="rest-option:${id}"`)).join('')}</nav><p class="rest-blurb" style="margin-top:46px;font-size:11px">휴식하면 생명력과 회복약이 보충되고<br>일반 적이 다시 나타납니다.</p>`}</div>`;
 const right=ui.restPage==='travel'?travelView():`<section class="rest-checkpoint fade-content"><h3>체크포인트</h3><div class="status-line"><span>생명력</span><strong>${model.s.hp} / ${model.maxHP}</strong></div><div class="status-line"><span>회복 횟수</span><strong>${model.s.healCharges} / ${model.maxHeals}</strong></div><div class="status-line"><span>부활 기회</span><strong>${model.s.resurrections}</strong></div><div class="rest-status">${h(ui.notice||'화톳불 활성화 · 이동 거점 등록 완료')}</div></section>`;
 return `<section class="view rest-panels ${ui.restLeaving?'rest-exit':''}"><div class="rest-panel-left"></div><div class="rest-panel-right"></div>${left}${right}<div class="rest-back">${b(prompt('Backspace','B',ui.restPage==='travel'?'뒤로':'떠나기'),ui.restPage==='travel'?'rest-back':'rest-leave')}</div><div class="rest-footer">${prompt('↑ ↓','D-pad','항목 선택')}${b(prompt('Enter','A',ui.restPage==='travel'?'목적지 선택':'결정'),'activate')}</div></section>`;
}
function travelView(){
 const active=model.destinations.filter(d=>model.s.bonfires.includes(d.id));const selected=active.find(d=>d.id===ui.travelSelection)||active.find(d=>d.id!==model.s.location)||active[0];if(selected)ui.travelSelection=selected.id;
 const row=d=>b(`<small>${d.chapter===0?'HUB':`SECTOR ${String(d.sector).padStart(2,'0')}`}</small><span>${h(d.name)}${d.id===model.s.location?' · 현재 위치':''}</span>`,'travel-select:'+d.id,'destination-row '+(d.id===ui.travelSelection?'active':''),`data-preview="travel-preview:${d.id}"`);
 let rows=active.filter(d=>d.chapter===0).map(row).join('');
 for(const chapter of [...new Set(active.filter(d=>d.chapter>0).map(d=>d.chapter))].sort((a,b)=>a-b)){
  rows+=b(`<span>CHAPTER ${String(chapter).padStart(2,'0')}</span><span>${ui.expanded.includes(chapter)?'−':'+'}</span>`,'travel-chapter:'+chapter,'chapter-row');
  if(ui.expanded.includes(chapter))rows+=active.filter(d=>d.chapter===chapter).sort((a,b)=>a.sector-b.sector||a.order-b.order).map(row).join('');
 }
 return `<div class="travel-content"><nav class="travel-list">${rows||'<p class="quiet">활성화한 거점이 없습니다.</p>'}</nav><section class="travel-preview fade-content">${selected?`<img src="${selected.image}" alt="${h(selected.name)} 미리보기"><h3>${h(selected.name)}</h3><p>${selected.chapter===0?'HUB':`CHAPTER ${String(selected.chapter).padStart(2,'0')} · SECTOR ${String(selected.sector).padStart(2,'0')}`}<br>${h(selected.map)}</p>${b(`이동 ${key('Enter','A')}`,'travel-confirm:'+selected.id,'primary',selected.id===model.s.location?'disabled':'')}${selected.id===model.s.location?'<p>현재 머무는 거점입니다.</p>':''}`:''}</section></div>`;
}
function beginRest(){
 model.rest(ui.currentFire);ui.trail=model.s.hp;ui.itemCooldown=ui.artCooldown=0;persist();
 if(model.state.activeSlot===null){ui.saving=true;ui.returnFromSlots='rest';go('slots',{group:'rest'});}
 else{model.save(model.state.activeSlot);ui.notice='휴식 완료 · 체크포인트 저장 완료';persist();render();}
}
function activateFire(){
 if(ui.activation)return;ui.activation=true;render();
 setTimeout(()=>{model.activate(ui.currentFire);ui.activation=false;ui.restPage='main';persist();render();},1700);
}
function leaveRest(){if(ui.restLeaving)return;ui.restLeaving=true;render();setTimeout(()=>{ui.restLeaving=false;ui.itemCooldown=ui.artCooldown=0;go('hud');},340);}
function upgradeRows(){return D.upgrades.filter(r=>r.Category===ui.upgradeCategory&&r.TreeParent==='None').sort((a,b)=>a.Order-b.Order);}
function upgradeSummary(r,l){
 const step=l?r.Steps[l-1]:null,a=step?.ValueA??0,c=step?.ValueB??0;
 const mul=v=>(v||1).toFixed(2)+'×';
 switch(r.Effect){
  case 'Katana':return [['일반 공격 피해',mul(a)],['체간 피해',mul(c)]];
  case 'Health':return [['최대 체력',100+a]];
  case 'Posture':return [['최대 체간',100+a]];
  case 'HealCount':return [['회복 횟수',3+a+' 회']];
  case 'HealAmount':return [['회복량',60+a]];
  case 'Dash':return [['체간 피해',mul(a)],['재사용 대기시간',mul(c)]];
  case 'Leap':return [['도약 피해',mul(a)],['체간 피해',mul(c)]];
  case 'Ice':case 'IceReuse':return [['재사용 대기시간',mul(a)]];
  case 'BrainReuse':return [['재사용 대기시간',mul(a)]];
  case 'CloneCount':return [['추가 분신 수','+'+a+' 체']];
  case 'CloneDamage':case 'Clone':return [['분신 피해',mul(a)]];
  case 'IceRange':case 'BrainRange':return [['공격 범위',mul(a)]];
  default:return [['지속시간',mul(a)]];
 }
}
function statUpgradeRows(r,l){const before=upgradeSummary(r,l),after=l<r.Steps.length?upgradeSummary(r,l+1):[];return before.map(([label,v],i)=>`<div class="stat-row"><span>${h(label)}</span><span>${v}</span><span>${after.length?'→':'—'}</span><strong>${after[i]?.[1]??'MAX'}</strong></div>`).join('');}
function upgradeView(){
 const roots=upgradeRows();if(!roots.some(r=>r.Name===ui.upgradeRoot)){ui.upgradeRoot=ui.upgradeNode=roots[0]?.Name;}
 const root=model.row(ui.upgradeRoot),r=model.row(ui.upgradeNode)||root;if(!root||!r)return '';
 const l=model.level(r.Name),status=model.upgradeStatus(r.Name),node=ui.upgradeCategory==='Item';
 const cats=[['Weapon','무기'],['Body','신체'],['SwordArt','검술'],['Healing','회복'],['Item','아이템']];
 const heroIcons={Katana:'Katana.svg',Health:'Player_Stand',Posture:'BodyUpgrade',Dash:'DashAttack',Leap:'LeapSlash',HealCount:'Heal',HealAmount:'Heal',Ice:'Ice',BrainWash:'MindControl',Clone:'Clone'};
 const treeNode=(entry,i)=>b(`${img(heroIcons[root.Name]||root.Icon)}<strong>${h(entry.DisplayName)}</strong><span class="tree-rank">+${model.level(entry.Name)} / ${entry.Steps.length}</span>`,'upgrade-node:'+entry.Name,`tree-node ${i<0?'tree-root':'tree-child tree-child-'+i} ${entry.Name===r.Name?'active':''} ${model.available(entry.Name)?'':'locked'}`,`data-preview="upgrade-node:${entry.Name}"`);
 let left=node?`<div class="tree">${treeNode(root,-1)}${D.upgrades.filter(x=>x.TreeParent===root.Name).map((x,i)=>treeNode(x,i)).join('')}</div>`:`<div class="hero"><span class="hero-code">${h(ui.upgradeCategory.toUpperCase())} / ${r.Name.toUpperCase()}</span>${img(heroIcons[r.Name]||r.Icon,['Health','Dash','Leap'].includes(r.Name)?'':'glyph')}<div class="level-dots">${r.Steps.map((x,i)=>`<i class="${i<l?'on':''}"></i>`).join('')}</div></div>`;
 let bottom='';
 if(status.kind==='locked')bottom=`<div class="locked-note">${img('Lock.png')} ${h(status.reason)}</div>`;
 else if(status.kind==='max')bottom='<div class="max-label">최대 강화에 도달했습니다.</div><p class="state-copy">더 이상 자원을 사용하지 않습니다.</p>';
 else bottom=`<div class="cost-grid"><div><small>성장 재화</small><strong class="${model.s.currency<status.step.Currency?'poor':''}">${fmt(status.step.Currency)}</strong><em>보유 ${fmt(model.s.currency)}</em></div><div><small>강화 재료</small><strong class="${model.s.materials<status.step.Materials?'poor':''}">${status.step.Materials}</strong><em>보유 ${model.s.materials}</em></div></div>${b(`<span>${status.ok?'강화하기':status.kind==='poor'?'필요 자원 부족':'진행 조건 미충족'}</span>${key('Enter','A')}`,'upgrade-confirm','primary',status.ok?'':'disabled')}<p class="state-copy ${status.kind==='poor'?'poor':''}">${h(status.ok?'확인 전에는 자원이 소모되지 않습니다.':status.reason)}</p>`;
 return `<section class="view paper-view">${brand('중앙 거점 · 화톳불')}${wallet(false)}<h2 class="game-title">강화</h2><nav class="top-tabs" style="top:106px;left:342px">${b(`${key('Q','LB')} ‹`,'upgrade-prev','nav-arrow')}${cats.map(([id,n])=>b(n,'upgrade-category:'+id,'tab '+(ui.upgradeCategory===id?'active':''),`data-preview="upgrade-category:${id}"`)).join('')}${b(`› ${key('E','RB')}`,'upgrade-next','nav-arrow')}</nav><div class="game-line" style="top:174px"></div><nav class="side-menu" style="top:220px"><p class="list-caption">${node?'특수 아이템':'강화할 항목'}</p>${roots.map(x=>list(x.DisplayName,'upgrade-root:'+x.Name,x.Name===root.Name,model.available(x.Name)?'+'+model.level(x.Name):'미습득',`data-preview="upgrade-root:${x.Name}"`)).join('')}</nav><p class="side-foot">강화: 성장 재화 + 강화 재료<br>색상 능력: 보스 처치로 획득</p><div class="detail-area fade-content" style="top:215px">${left}<article class="detail-copy" style="left:${node?370:337}px"><p class="eyebrow">${model.available(r.Name)?`강화 단계 ${l} / ${r.Steps.length}`:'보스 처치 필요'}</p><h2>${h(r.DisplayName)} <small>${model.available(r.Name)?'+'+l:''}</small></h2><p class="description">${h(r.Description)}</p><div class="stats">${statUpgradeRows(r,l)}</div>${bottom}</article></div>${footer('upgrade-back')}</section>`;
}

function startDialogue(){
 ui.dialogueRow=model.s.flags.includes('Merchant.Met')?'Return':'Greeting';ui.dialoguePhase='line';ui.dialogueChoice=0;go('dialogue');
}
function dialogueView(){
 const row=model.dialogueRow(ui.dialogueRow)||D.dialogue[0];const choices=model.choices(row);
 let speech=ui.dialoguePhase==='choice'?`<div class="dialogue-choices">${choices.map((c,i)=>b(i===0?`${h(c.Text)} ${key('1','LB')}`:`${key('3','RB')} ${h(c.Text)}`,'dialogue-choice:'+i,'dialogue-choice '+(ui.dialogueChoice===i?'active':''),`data-preview="dialogue-preview:${i}"`)).join('')}</div>`:`<p class="speaker">${h(row.Speaker)}</p>${b(h(row.Text),'dialogue-next','dialogue-line')}<div class="dialogue-keys">${b(prompt('E','A','다음'),'dialogue-next')}${b(prompt('Esc','B','닫기'),'dialogue-close')}</div>`;
 return `<section class="view dark-key hud-hidden">${playerWorld()}${img('Player_Stand','npc-cutout')}<div class="dialogue-panel">${speech}</div></section>`;
}
function nextDialogue(){
 const row=model.dialogueRow(ui.dialogueRow);if(!row)return;
 if(ui.dialoguePhase==='choice'){chooseDialogue(ui.dialogueChoice);return;}
 row.SetFlags.forEach(f=>model.flag(f));persist();
 if(model.choices(row).length){ui.dialoguePhase='choice';ui.dialogueChoice=0;render();}
 else if(row.NextRow&&row.NextRow!=='None'){ui.dialogueRow=row.NextRow;render();}
 else go('hud');
}
function chooseDialogue(index){
 const row=model.dialogueRow(ui.dialogueRow),choice=model.choices(row)[index];if(!choice)return;
 choice.SetFlags.forEach(f=>model.flag(f));persist();
 if(choice.Action==='OpenShop'){go('shop');return;}
 if(choice.NextRow&&choice.NextRow!=='None'){ui.dialogueRow=choice.NextRow;ui.dialoguePhase='line';render();}
 else go('hud');
}
function shopView(){
 const r=D.shop.find(x=>x.Name===ui.shop)||D.shop[0],status=model.shopStatus(r.Name),bought=model.s.shopPurchases[r.Name]||0;
 return `<section class="view paper-view">${paperHeader('상점','발견한 수집품을 필요한 물건으로 교환합니다.','수집가 · 교환 상점')}${wallet(true)}<nav class="side-menu">${D.shop.map(x=>list(x.DisplayName,'shop-select:'+x.Name,r.Name===x.Name,'',`data-preview="shop-select:${x.Name}"`)).join('')}</nav><p class="side-foot">수집품은 상점에서 교환합니다.<br>성장 재화와 강화 재료는<br>화톳불 강화에 사용합니다.</p><section class="detail-area fade-content"><div class="hero">${img(r.Icon,'glyph')}</div><article class="detail-copy"><p class="eyebrow">COLLECTOR / EXCHANGE</p><h2>${h(r.DisplayName)}</h2><p class="description">${h(r.Description)}</p><div class="status-line"><span>교환가치</span><strong>${r.Price}</strong></div><div class="status-line"><span>남은 재고</span><strong>${Math.max(0,r.Stock-bought)} / ${r.Stock}</strong></div>${b(`교환하기 ${key('Enter','A')}`,'shop-confirm','primary',status.ok?'':'disabled')}<p class="state-copy">${h(status.ok?'확인 후 수집품 교환가치가 차감됩니다.':status.reason)}</p></article></section>${footer('shop-back','떠나기','교환')}</section>`;
}
function slotsView(){
 const selected=model.state.slots[ui.slot],s=selected?.data,place=s?model.destinations.find(d=>d.id===s.location):null;
 return `<section class="view paper-view">${paperHeader(ui.saving?'SAVE GAME':'LOAD GAME',ui.saving?'진행 상황을 저장할 슬롯을 선택하세요.':'이어갈 여정을 선택하세요.')}<nav class="slots-list">${model.state.slots.map((slot,i)=>b(`<strong>SLOT ${String(i+1).padStart(2,'0')}</strong><div><b>${slot?h(model.destinations.find(d=>d.id===slot.data.location)?.name||slot.data.location):'빈 슬롯'}</b><small>${slot?`CHAPTER ${String(slot.data.chapter).padStart(2,'0')} · ${slot.data.equipment}`:'새로운 여정을 저장할 수 있습니다.'}</small></div><small>${slot?`${new Date(slot.at).toLocaleDateString('ko-KR')}<br>${Math.floor(slot.data.playSeconds/60)}분`:'—'}</small>`,'slot:'+i,'save-slot '+(i===ui.slot?'active':''),`${!ui.saving&&!slot?'disabled':''} data-preview="slot:${i}"`)).join('')}</nav><aside class="slot-preview fade-content"><small>선택한 저장 데이터</small>${selected?`<img src="${place?.image||'Assets/world.jpg'}" alt="거점 미리보기"><h3>${h(place?.name||s.location)}</h3><div class="status-line"><span>검술</span><strong>${h(D.swordArts.find(r=>r.Name===s.swordArt)?.DisplayName||s.swordArt)}</strong></div><div class="status-line"><span>소거한 색상</span><strong>${s.erased.length} / 4</strong></div>`:`<div class="empty-preview">${ui.saving?'새 저장 데이터':'저장 데이터 없음'}</div><h3>빈 슬롯</h3><p>이 슬롯에 저장된 여정이 없습니다.</p>`}${b(`${ui.saving?'저장':'불러오기'} ${key('Enter','A')}`,'slot-commit','primary',!ui.saving&&!selected?'disabled':'')}${selected?b('저장 파일 삭제','slot-delete','delete-slot'):''}</aside>${footer('slots-back','뒤로',ui.saving?'저장':'불러오기')}</section>`;
}
function openSlots(saving,back){ui.saving=saving;ui.returnFromSlots=back;go('slots',{group:saving?'rest':'main'});}
function commitSlot(){
 if(ui.saving){const old=model.state.slots[ui.slot];if(old){openModal({kind:'overwrite',slot:ui.slot,expected:old.id});return;}model.save(ui.slot);persist();afterSaving();}
 else if(model.load(ui.slot)){persist();ui.trail=model.s.hp;startLoading(model.s.location,'hud');}
}
function afterSaving(){
 toast('진행 상황을 저장했습니다.');
 if(ui.afterSave==='main'){ui.afterSave=null;ui.mainPage='menu';go('main');}
 else{ui.restPage='main';ui.notice='체크포인트 저장 완료';go(ui.returnFromSlots==='rest'?'rest':'hud');}
}
function deathView(){
 const can=model.s.resurrections>0&&!model.s.resurrectionLocked&&!ui.finalDeath;
 return `<section class="view dark-key">${playerWorld()}<div class="death-shade"></div><div class="death-copy"><div class="death-word">${ui.finalDeath?'YOU DIED':'死亡'}</div><nav class="death-options">${ui.finalDeath?b(`${key('Enter','A')} 다시 시작`,'respawn','active'):`${b(`${key('Enter','A')} 부활`,'resurrect','active',can?'':'disabled')}${b(`${key('Backspace','B')} 죽음`,'final-death')}`}</nav><p class="death-note">${ui.finalDeath?'마지막으로 휴식한 곳에서 다시 시작합니다.':can?`남은 부활 기회 ${model.s.resurrections}회`:model.s.resurrectionLocked?'아직 다시 부활할 수 없습니다.':'남은 부활 기회가 없습니다.'}</p></div></section>`;
}
function loadingView(){
 const tip=D.tips[ui.tip%D.tips.length],dest=model.destinations.find(d=>d.id===(ui.loading?.destination||model.s.location))||model.destinations[0];
 return `<section class="view dark-key"><div class="loading-bg"></div><div class="loading-vignette"></div><div class="loading-title"><small>${h(tip.Category)}</small><h2>${h(dest.name)}</h2><p data-loading-tip>${h(tip.Tip)}</p></div><div class="loading-progress"><i data-loading-progress style="width:${ui.loading?Math.min(100,(performance.now()-ui.loading.start)/50):0}%"></i></div><div class="loading-bottom"><nav class="loading-tip-keys">${b(prompt('Q','X','이전 팁'),'tip:-1')}${b(prompt('E','B','다음 팁'),'tip:1')}</nav><span>TIP ${String(ui.tip+1).padStart(2,'0')} / ${D.tips.length}</span><span data-loading-percent>LOADING 0%</span></div></section>`;
}
function startLoading(destination,returnRoute='hud',preview=false){
 ui.loading={destination,returnRoute,start:performance.now(),preview};ui.tip=0;ui.modal=null;ui.route='loading';ui.group=preview?'loading':ui.group;render();
}
function bossView(){
 if(ui.world==='white')return `<section class="view"><div class="black-monolith"></div>${b(`${key('E','X')} 빛에 손을 뻗는다`,'black-start','center-interact',`style="color:#3c4337"`)}</section>`;
 if(ui.world==='hub-orb'){
  const ready=['Blue','Green','Red'].every(c=>model.s.erased.includes(c));
  return `<section class="view"><div class="hub-orb ${ready?'white':''}"></div><div class="orb-lights">${['Blue','Green','Red'].map(c=>`<i class="orb-light ${c.toLowerCase()} ${model.s.erased.includes(c)?'on':''}"></i>`).join('')}</div>${b(`${key('E','X')} ${ready?'흰빛에 닿는다':'세 빛을 모아야 합니다'}`,'orb-interact','center-interact',ready?'':'disabled')}</section>`;
 }
 const banner=ui.banner?`<div class="color-banner"><strong>COLOR ERASED</strong><small>${ui.bossColor.toUpperCase()}</small></div>`:'';
 return hudView({characters:true})+banner+(ui.blackTransition?'<div class="black-transition"></div>':'');
}
function defeatBoss(color){
 if(model.s.erased.includes(color)){toast('이미 소거한 색상입니다. 획득한 능력은 인벤토리에서 확인하세요.');return;}
 model.defeat(color);persist();ui.bossColor=color;ui.showBoss=false;ui.banner=true;ui.rewardPending=color;go('boss');
 setTimeout(showColorReward,2400);
}
function showColorReward(){if(!ui.rewardPending)return;const color=ui.rewardPending;ui.rewardPending=null;ui.banner=false;render();openModal({kind:'reward',color});}
function debugView(){
 const pages=[['enemy','적 AI'],['combat','전투'],['notifies','노티파이'],['other','기타'],['output','출력']];
 const fields={enemy:[['enemy','적 행동 상태'],['tokens','공격 토큰 · Strafe'],['perception','시야 · 인지 · 수색']],combat:[['posture','체간 · 체간 붕괴'],['hitbox','피격 · 무기 판정']],notifies:[['notifies','애니메이션 노티파이']],other:[['environment','환경 반응'],['camera','락온 카메라']],output:[['events','이벤트 기록']]};
 return hudView({characters:false})+`<section class="debug-modal"><h2>디버그 설정</h2><p>확인할 항목만 선택하세요. 창을 닫아도 선택한 표시는 유지됩니다.</p><label class="debug-check"><strong>디버그 전체 표시</strong><input type="checkbox" data-debug="master" ${model.state.debug.master?'checked':''}></label><div class="debug-presets">${b('모두 끄기','debug-preset:off')}${b('적 이동만','debug-preset:enemy')}${b('피격 · 판정만','debug-preset:combat')}</div><nav class="debug-tabs">${pages.map(([id,n])=>b(n,'debug-page:'+id,id===ui.debugPage?'active':'')).join('')}</nav>${fields[ui.debugPage].map(([id,n])=>`<label class="debug-check">${n}<input type="checkbox" data-debug="${id}" ${model.state.debug[id]?'checked':''}></label>`).join('')}<p style="margin-top:25px">전체 OFF는 선택 상태를 보존합니다.</p>${b(prompt('Esc','B','닫고 확인'),'debug-close','debug-close')}</section>`;
}
function enemyView(){
 const f=ui.form,presets=['Katana','Nodachi','Greatsword','Double Axe','Sword & Shield','Spear','Giant Golem','Wild Monster'];
 const field=(label,id,type='number')=>`<label class="form-row"><span>${label}</span><input data-enemy-field="${id}" type="${type}" ${type==='number'?'min="0.1" step="0.1"':''} value="${h(f[id])}"></label>`;
 return `<section class="view paper-view">${paperHeader('적 만들기','프리셋을 선택하고 필요한 설정을 조절하세요.','EDITOR · ENEMY WORKSHOP')}<div class="workshop-grid"><nav>${presets.map(p=>list(p,'enemy-preset:'+p,p===f.preset)).join('')}</nav><section><h3>기본 설정</h3>${field('이름','name','text')}${field('스케일','scale')}${field('HP','hp')}${field('체간','posture')}${[['boss','보스'],['patrol','Spline 순찰'],['grass','풀숲 은신 감지'],['environment','Prismatiscape 환경 반응']].map(([id,n])=>`<label class="form-row"><span>${n}</span><input style="width:18px" type="checkbox" data-enemy-check="${id}" ${f[id]?'checked':''}></label>`).join('')}${b(`생성 ${key('Enter','A')}`,'enemy-create','primary')}<p class="tiny-form-note">HTML 미리보기용 생성 목록입니다.<br>설정 초안을 JSON으로 저장할 수 있습니다.</p></section><section><h3>미리보기</h3><div class="draft-preview">${img('Player_Stand','',f.preset)}</div><h3 style="margin-top:28px">생성 목록 · ${model.state.enemyDrafts.length}</h3><div style="max-height:150px;overflow:auto">${model.state.enemyDrafts.map((e,i)=>`<div class="draft-row"><span>${h(e.name)} · ×${e.scale}</span>${b('×','enemy-remove:'+i,'',`aria-label="${h(e.name)} 삭제"`)}</div>`).join('')||'<p class="quiet">아직 생성한 적이 없습니다.</p>'}</div>${b('설정 JSON 저장 ↗','enemy-export','primary',model.state.enemyDrafts.length?'':'disabled')}</section></div>${footer('enemy-back','닫기')}</section>`;
}

function openModal(value){ui.modal=value;ui.modalIndex=['delete','reset','quit','title','overwrite'].includes(value.kind)?0:1;renderModal();}
function closeModal(){ui.modal=null;renderModal();}
function renderModal(){
 const projected=Native.modal(ui.modal);if(projected!==null){$('#modal-layer').innerHTML=projected;const focus=$('#modal-layer [data-action="'+(ui.modalIndex===0?'modal-cancel':'modal-confirm')+'"]');focus?.focus({preventScroll:true});return;}
 const m=ui.modal;if(!m){$('#modal-layer').innerHTML='';return;}
 let title='',eyebrow='',body='',confirm='확인',destructive=false,onlyClose=false;
 if(m.kind==='upgrade'){const r=model.row(m.id);eyebrow='강화 확인';title=`${r.DisplayName} +${m.expected} → +${m.expected+1}`;body=`<div class="stats">${statUpgradeRows(r,m.expected)}</div><p style="margin-top:18px">아래 자원을 사용해 강화합니다.</p><div class="modal-values"><span>성장 재화 ${fmt(r.Steps[m.expected].Currency)}</span><span>강화 재료 ${r.Steps[m.expected].Materials}</span></div>`;confirm='강화';}
 if(m.kind==='purchase'){const r=D.shop.find(r=>r.Name===m.id);eyebrow='교환 확인';title=r.DisplayName;body=`<p>${h(r.Description)}</p><div class="modal-values"><span>수집품 교환가치</span><strong>${r.Price}</strong></div>`;confirm='교환';}
 if(m.kind==='delete'){eyebrow='저장 파일 삭제';title=`SLOT ${String(m.slot+1).padStart(2,'0')}을 삭제할까요?`;body='<p>이 저장 슬롯의 진행 상황이 삭제됩니다.<br>삭제한 데이터는 복구할 수 없습니다.</p>';confirm='삭제';destructive=true;}
 if(m.kind==='overwrite'){eyebrow='덮어쓰기 확인';title=`SLOT ${String(m.slot+1).padStart(2,'0')}에 저장할까요?`;body='<p>선택한 슬롯의 이전 저장 데이터를 현재 여정으로 덮어씁니다.</p>';confirm='덮어쓰기';}
 if(m.kind==='travel'){const d=model.destinations.find(d=>d.id===m.id);eyebrow='이동 확인';title=d.name;body=`<p>${d.chapter===0?'HUB':`CHAPTER ${String(d.chapter).padStart(2,'0')} · SECTOR ${String(d.sector).padStart(2,'0')}`}<br>선택한 화톳불로 이동합니다.</p><img src="${d.image}" alt="목적지 미리보기" style="width:100%;height:190px;object-fit:cover;opacity:.8">`;confirm='이동';}
 if(m.kind==='title'){eyebrow='타이틀로 돌아가기';title='타이틀로 돌아갈까요?';body='<p>진행 내용을 저장한 후 타이틀 화면으로 돌아갑니다.</p>';confirm='돌아가기';}
 if(m.kind==='quit'){eyebrow='게임 종료';title='게임을 종료할까요?';body='<p>저장하지 않은 진행 내용은 저장 슬롯에 반영되지 않습니다.</p>';confirm='종료';}
 if(m.kind==='reset'){eyebrow='시안 초기화';title='HTML 체험 데이터를 초기화할까요?';body='<p>이 브라우저에 저장한 시안의 슬롯·강화·재고가 초기화됩니다.<br>실제 Unreal 게임 저장 파일에는 영향을 주지 않습니다.</p>';confirm='초기화';destructive=true;}
 if(m.kind==='reward'){
  const id=({Blue:'Ice',Green:'BrainWash',Red:'Clone'})[m.color],info=id?itemInfo(id):{name:'어둠의 기억',icon:'Crystal'};
  eyebrow='아이템 획득';title=info.name;body=`${img(info.icon,'reward-icon')}<p>${id?'색상의 힘을 얻었습니다. 아이템에서 선택하거나 화톳불에서 강화할 수 있습니다.':'검정의 왕을 넘어 여정을 마쳤습니다.'}</p>`;confirm='닫기';onlyClose=true;
 }
 if(m.kind==='gift'){eyebrow='보상 획득';title='수집가의 선물';body=`${img('Crystal','reward-icon')}<p>강화 재료 1개를 받았습니다.</p>`;confirm='닫기';onlyClose=true;}
 if(m.kind==='rebind'){eyebrow='조작 변경';title='사용할 키를 눌러주세요';body=`<p>현재 설정 ${h(model.state.settings.bindings[m.id])}<br>Esc로 취소할 수 있습니다. 중복된 키는 사용할 수 없습니다.</p>`;confirm='';}
 const actions=`<div class="modal-actions">${onlyClose?'':b(`${key('Backspace','B')} 취소`,'modal-cancel',ui.modalIndex===0?'selected-line no-line':'')}${confirm?b(`${key('Enter','A')} ${h(confirm)}`,'modal-confirm',(destructive?'destructive ':'')+(ui.modalIndex===1?'selected-line no-line':''),'data-confirm'):''}</div>`;
 $('#modal-layer').innerHTML=`<div class="modal"><section class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="eyebrow">${eyebrow}</div><h2 id="modal-title">${h(title)}</h2>${body}${actions}</section></div>`;
 const target=$('#modal-layer [data-action="'+(ui.modalIndex===0?'modal-cancel':'modal-confirm')+'"]')||$('#modal-layer button');target?.focus({preventScroll:true});
}
function confirmModal(){
 const m=ui.modal;if(!m)return;ui.modal=null;
 if(m.kind==='upgrade'){const success=model.upgrade(m.id,m.expected);persist();render();toast(success?`${model.row(m.id).DisplayName} +${model.level(m.id)} · 강화 완료`:'보유 자원이나 강화 단계가 변경되었습니다. 다시 확인하세요.');}
 else if(m.kind==='purchase'){const success=model.purchase(m.id,m.expected);persist();render();toast(success?'교환을 완료했습니다.':'보유량·재고가 변경되었습니다. 다시 확인하세요.');}
 else if(m.kind==='delete'){const success=model.deleteSlot(m.slot,m.expected);persist();ui.slot=model.latest()>=0?model.latest():m.slot;render();toast(success?'저장 데이터를 삭제했습니다.':'저장 데이터가 변경되었습니다. 다시 확인하세요.');}
 else if(m.kind==='overwrite'){if(model.state.slots[m.slot]?.id!==m.expected){render();toast('저장 데이터가 변경되었습니다. 다시 확인하세요.');return;}model.save(m.slot);persist();afterSaving();}
 else if(m.kind==='travel'){if(!model.travel(m.id)){render();toast('현재 이 거점으로 이동할 수 없습니다.');return;}ui.currentFire=m.id;persist();startLoading(m.id,'hud');}
 else if(m.kind==='title'){
  if(model.state.activeSlot===null){ui.afterSave='main';openSlots(true,'main');}
  else{model.save(model.state.activeSlot);persist();ui.mainPage='menu';go('main');}
 }
 else if(m.kind==='quit'){ui.mainPage='quit';render();}
 else if(m.kind==='reset'){
  const clean=new SSModel.Model(D);model.state=clean.state;ui.mainPage='menu';ui.stealth='none';ui.world='hub';ui.bossColor='Blue';ui.showBoss=false;ui.loading=null;ui.banner=false;ui.rewardPending=null;ui.aware=false;ui.lock=false;ui.executionReady=false;ui.cooldowns={};ui.artCooldown=0;ui.finalDeath=false;ui.trail=model.s.hp;persist();go('main');toast('시안 데이터를 초기화했습니다.');
 }
 else{renderModal();render();}
}
function renderSceneTabs(){
 const map={main:[['메인메뉴','scene:main'],['불러오기','load-menu'],['옵션','front-settings']],hud:[['HUD','scene:hud'],['조작 안내','tool:guide']],pause:[['퍼즈','pause-home'],['상태','pause-tab:status'],['장비','pause-tab:equipment'],['검술','pause-tab:sword'],['아이템','pause-tab:item'],['기록','pause-tab:journal'],['설정','pause-tab:system']],rest:[['휴식','rest-main'],['이동','rest-travel'],['강화','rest-upgrade']],upgrade:[['무기','upgrade-category:Weapon'],['신체','upgrade-category:Body'],['검술','upgrade-category:SwordArt'],['회복','upgrade-category:Healing'],['아이템','upgrade-category:Item']],dialogue:[['대화 시작','dialogue-restart'],['선택지','dialogue-topics']],shop:[['강화 재료','shop-select:Material'],['재료 묶음','shop-select:MaterialBundle'],['성장 재화','shop-select:GrowthBundle']],death:[['부활 선택','tool:death-choice'],['최종 사망','tool:death-final']],loading:[['이동 로딩','tool:loading']],boss:[['보스 처치','boss-arena'],['허브 구체','boss-orb'],['검정의 돔','boss-white']],debug:[['적 AI','debug-page:enemy'],['전투','debug-page:combat'],['노티파이','debug-page:notifies'],['기타','debug-page:other'],['출력','debug-page:output']],enemy:[['적 생성','scene:enemy']]};
 const tabs=map[ui.group]||[];
 const selected={main:ui.route==='slots'?'load-menu':ui.frontSettings?'front-settings':'scene:main',hud:'scene:hud',pause:ui.tab==='home'?'pause-home':'pause-tab:'+ui.tab,rest:ui.restPage==='travel'?'rest-travel':'rest-main',upgrade:'upgrade-category:'+ui.upgradeCategory,dialogue:ui.dialoguePhase==='choice'?'dialogue-topics':'dialogue-restart',shop:'shop-select:'+ui.shop,death:ui.finalDeath?'tool:death-final':'tool:death-choice',loading:'tool:loading',boss:ui.world==='hub-orb'?'boss-orb':ui.world==='white'||ui.world==='black'?'boss-white':'boss-arena',debug:'debug-page:'+ui.debugPage,enemy:'scene:enemy'}[ui.group];
 $('#scene-tabs').innerHTML=tabs.map(([n,a])=>b(n,a,a===selected?'active':'')).join('');
}
function renderTools(){
 const tool=(n,a)=>b(n,'tool:'+a);
 const common=tool('재화 지급','resources');let html='';
 switch(ui.group){
  case 'main':html=tool('첫 실행 상태','fresh-main')+tool('저장 후 상태','saved-main')+tool('모든 체험 데이터 초기화','reset');break;
  case 'hud':html=tool('피해 받기 −25','damage')+tool('회복','heal')+tool('체간 +25','posture')+tool('위험 공격','danger')+tool('인지 세모','aware')+tool('락온','lock')+tool('인살 가능','execution')+tool('보스 HP','boss-hud')+`<label>은신 <select data-tool-select="stealth">${[['none','없음'],['hidden','은신 중'],['search','적 수색 중'],['spotted','발각됨'],['revealed','은신 해제']].map(([id,n])=>`<option value="${id}" ${ui.stealth===id?'selected':''}>${n}</option>`).join('')}</select></label>`+tool('아이템 사용','use-item')+tool('검술 사용','use-art');break;
  case 'pause':html=tool('HUD에서 확인','hud')+common+tool('세 색상 능력 해금','unlock')+tool('HP 회복','hp-full');break;
  case 'rest':html=tool('미활성화 상태','inactive-fire')+tool('다른 거점 모두 등록','activate-all')+tool('직접 저장','save')+`<label>현재 거점 <select data-tool-select="fire">${model.destinations.map(d=>`<option value="${d.id}" ${d.id===ui.currentFire?'selected':''}>${h(d.name)}</option>`).join('')}</select></label>`;break;
  case 'upgrade':html=common+tool('재료 부족','poor')+tool('최대 강화','max')+tool('선택 항목 단계 초기화','level-reset')+tool('세 색상 능력 해금','unlock')+`<label>진행 <select data-tool-select="chapter">${[1,2,3,4].map(n=>`<option ${n===model.s.chapter?'selected':''} value="${n}">CHAPTER ${String(n).padStart(2,'0')}</option>`).join('')}</select></label>`;break;
  case 'dialogue':html=tool('첫 만남','dialogue-first')+tool('재방문','dialogue-return')+tool('2개 선택지','dialogue-choice')+tool('한 번만 보상 받기','dialogue-gift')+tool('상점 연결','shop');break;
  case 'shop':html=tool('수집품 가치 +12','collectibles')+tool('교환가치 부족','collectibles-zero')+tool('현재 상품 품절','sold-out')+tool('재고 초기화','restock')+tool('대화로 돌아가기','dialogue-return');break;
  case 'death':html=tool('부활 기회 있음','death-choice')+tool('부활 기회 없음','death-empty')+tool('최종 사망','death-final')+tool('마지막 휴식: 시험의 뜰','checkpoint-gym');break;
  case 'loading':html=tool('5초 로딩 다시 보기','loading')+tool('이전 팁','tip-prev')+tool('다음 팁','tip-next');break;
  case 'boss':html=`<label>보스 <select data-tool-select="boss">${['Blue','Green','Red','Black'].map(c=>`<option ${ui.bossColor===c?'selected':''} value="${c}">${c.toUpperCase()}</option>`).join('')}</select></label>`+tool('보스 처치','defeat')+tool('보상 창 바로 보기','reward')+tool('허브 구체','orb')+tool('세 빛 모두 켜기','unlock')+tool('검정의 돔','white');break;
  case 'debug':html=tool('HUD에서 확인','hud')+tool('적 이동만','debug-enemy')+tool('모두 끄기','debug-off');break;
  case 'enemy':html=tool('창 중간보스','spear-boss')+tool('JSON 내보내기','enemy-export');break;
 }
 $('#tools').innerHTML=html;
}
function chooseUpgradeCategory(id){if(ui.modal)return;ui.upgradeCategory=id;const r=upgradeRows()[0];ui.upgradeRoot=r.Name;ui.upgradeNode=id==='Item'?(D.upgrades.find(x=>x.TreeParent===r.Name)?.Name||r.Name):r.Name;if(ui.route!=='upgrade')go('upgrade',{group:'upgrade'});else render();}
function setPauseTab(id){ui.tab=id;ui.frontSettings=ui.group==='main'&&id==='system';if(id==='sword')ui.selection=model.s.swordArt;if(id==='equipment')ui.selection=model.s.equipment;if(id==='item'){ui.itemCategory=0;ui.selection='Heal';}if(ui.route!=='pause')go('pause',{group:ui.frontSettings?'main':'pause'});else render();}
function selectPreview(command){
 const at=command.indexOf(':'),type=command.slice(0,at),value=command.slice(at+1);let changed=false;
 switch(type){
  case 'main-entry':if(ui.focusIndex!==+value){ui.focusIndex=+value;changed=true;}break;
  case 'pause-tab':if(ui.tab!==value){setPauseTab(value);return;}break;
  case 'select-art':case 'select-weapon':case 'select-item':if(ui.selection!==value){ui.selection=value;changed=true;}break;
  case 'settings-section':if(ui.settingsSection!==value){ui.settingsSection=value;changed=true;}break;
  case 'item-category':if(ui.itemCategory!==+value){ui.itemCategory=+value;ui.selection=+value===0?'Heal':+value===1?'Ice':'Clone';changed=true;}break;
  case 'journal-category':if(ui.journal!==+value){ui.journal=+value;ui.journalTopic=0;changed=true;}break;
  case 'journal-topic':if(ui.journalTopic!==+value){ui.journalTopic=+value;changed=true;}break;
  case 'upgrade-category':if(ui.upgradeCategory!==value){chooseUpgradeCategory(value);return;}break;
  case 'upgrade-root':if(ui.upgradeRoot!==value){ui.upgradeRoot=value;ui.upgradeNode=ui.upgradeCategory==='Item'?(D.upgrades.find(x=>x.TreeParent===value)?.Name||value):value;changed=true;}break;
  case 'upgrade-node':if(ui.upgradeNode!==value){ui.upgradeNode=value;changed=true;}break;
  case 'rest-option':if(ui.restOption!==value){ui.restOption=value;changed=true;}break;
  case 'travel-preview':if(ui.nativeTravelConfirm)break;if(ui.travelSelection!==value){ui.travelSelection=value;changed=true;}break;
  case 'shop-select':if(ui.shop!==value){ui.shop=value;changed=true;}break;
  case 'slot':if(ui.nativeOverwrite||(!ui.saving&&!model.state.slots[+value]))break;if(ui.slot!==+value){ui.slot=+value;changed=true;}break;
  case 'dialogue-preview':if(ui.dialogueChoice!==+value){ui.dialogueChoice=+value;changed=true;}break;
 }
 if(changed)render();
}

function cycleItem(direction=1){const ids=['Ice','BrainWash','Clone'];model.s.item=ids[(ids.indexOf(model.s.item)+direction+3)%3];ui.itemCooldown=ui.cooldowns?.[model.s.item]||0;persist();render();}
function useItem(){
 if(!model.available(model.s.item)){toast(model.requirement(model.s.item));return;}
 if(ui.itemCooldown>0){toast('아직 재사용할 수 없습니다.');return;}
 if(model.s.hp<=0)return;
 const item=itemInfo();ui.cooldowns??={};ui.cooldowns[model.s.item]=item.cooldown*model.multiplier(model.s.item);ui.itemCooldown=ui.cooldowns[model.s.item];render();toast(item.name+' 사용');
}
function useArt(){if(ui.artCooldown>0){toast('검술 재사용 대기 중입니다.');return;}if(model.s.hp<=0)return;ui.artCooldown=art().Cooldown;ui.showBoss=true;ui.bossPosture=Math.min(1,ui.bossPosture+.25);ui.bossHP=Math.max(0,ui.bossHP-.12);render();toast(art().DisplayName+' · 발동');}
function adjustSetting(id,direction){
 const s=model.state.settings;
 const cycle=(field,values)=>{s[field]=values[(Math.max(0,values.indexOf(s[field]))+direction+values.length)%values.length];};
 if(id==='debug'){go('debug');return;}
 if(id==='guide'||id==='vsync')s[id]=!s[id];
 else if(id==='pad')cycle('pad',['auto','Xbox','PlayStation','Switch']);
 else if(id==='quality')s.quality=(s.quality+direction+4)%4;
 else if(id==='fps')cycle('fps',['무제한','60 FPS','90 FPS','120 FPS']);
 else if(id==='language')cycle('language',['한국어','English']);
 else if(id==='resolution'||id==='mode'){
  ui.display??={resolution:s.resolution,mode:s.mode};const values=id==='resolution'?['1280 × 720','1600 × 900','1920 × 1080','2560 × 1440','3840 × 2160']:['전체 화면','테두리 없는 전체 화면','창 모드'];
  ui.display[id]=values[(Math.max(0,values.indexOf(ui.display[id]))+direction+values.length)%values.length];
 }
 persist();render();
}
function tool(action){
 switch(action){
  case 'resources':model.addResources();toast('성장 재화 +3,000 · 강화 재료 +15 · 수집품 가치 +12 · SP +3');break;
  case 'fresh-main':model.newGame();model.state.slots=[null,null,null];ui.mainPage='menu';go('main');break;
  case 'saved-main':model.sampleSaved();ui.mainPage='menu';go('main');break;
  case 'reset':openModal({kind:'reset'});return;
  case 'damage':if(model.s.hp<=0)return;ui.trail=Math.max(model.s.hp,ui.trail);ui.trailHold=performance.now()+350;if(model.damage(25)){ui.finalDeath=false;go('death');}else{render();}break;
  case 'heal':if(model.heal()){ui.trail=model.s.hp;render();toast('회복했습니다.');}else toast(model.s.healCharges?'이미 체력이 가득 찼거나 회복할 수 없습니다.':'회복 횟수가 없습니다.');break;
  case 'hp-full':model.s.hp=model.maxHP;ui.trail=model.s.hp;break;
  case 'posture':model.s.posture=Math.min(model.maxPosture,model.s.posture+25);ui.bossPosture=Math.min(1,ui.bossPosture+.25);break;
  case 'danger':ui.dangerUntil=performance.now()+1400;break;
  case 'aware':ui.aware=!ui.aware;ui.awareness=0;break;
  case 'lock':ui.lock=!ui.lock;break;
  case 'execution':ui.lock=true;ui.executionReady=!ui.executionReady;break;
  case 'boss-hud':ui.showBoss=!ui.showBoss;break;
  case 'use-item':useItem();return;
  case 'use-art':useArt();return;
  case 'guide':model.state.settings.guide=!model.state.settings.guide;break;
  case 'hud':go('hud');return;
  case 'inactive-fire':model.s.bonfires=model.s.bonfires.filter(id=>id!==ui.currentFire);ui.restPage='main';go('rest');break;
  case 'activate-all':model.destinations.forEach(d=>model.activate(d.id));toast('이동 확인을 위해 모든 목적지를 등록했습니다.');break;
  case 'save':openSlots(true,'rest');return;
  case 'poor':model.s.materials=0;break;
  case 'max':{const r=model.row(ui.upgradeNode);if(r)model.s.levels[r.Name]=r.Steps.length;break;}
  case 'level-reset':model.s.levels[ui.upgradeNode]=0;break;
  case 'unlock':['Blue','Green','Red'].forEach(c=>model.defeat(c));toast('얼음 · 세뇌 · 분신을 해금했습니다.');break;
  case 'dialogue-first':model.s.flags=model.s.flags.filter(f=>!f.startsWith('Merchant.'));ui.dialogueRow='Greeting';ui.dialoguePhase='line';go('dialogue');break;
  case 'dialogue-return':model.flag('Merchant.Met');startDialogue();return;
  case 'dialogue-choice':ui.dialogueRow='Topics';ui.dialoguePhase='choice';go('dialogue');break;
  case 'dialogue-gift':if(model.s.flags.includes('Demo.Gift')){toast('이미 이 보상을 받았습니다.');return;}model.flag('Demo.Gift');model.s.materials++;persist();openModal({kind:'gift'});return;
  case 'shop':go('shop');return;
  case 'collectibles':model.s.collectibles+=12;break;
  case 'collectibles-zero':model.s.collectibles=0;break;
  case 'sold-out':model.s.shopPurchases[ui.shop]=D.shop.find(r=>r.Name===ui.shop).Stock;break;
  case 'restock':model.s.shopPurchases={};break;
  case 'death-choice':model.s.hp=0;model.s.resurrections=2;model.s.resurrectionLocked=false;ui.finalDeath=false;go('death');break;
  case 'death-empty':model.s.hp=0;model.s.resurrections=0;ui.finalDeath=false;go('death');break;
  case 'death-final':model.s.hp=0;ui.finalDeath=true;go('death');break;
  case 'checkpoint-gym':model.rest('Gym');model.s.hp=0;ui.finalDeath=true;go('death');break;
  case 'loading':startLoading('Main01','hud',true);return;
  case 'tip-prev':ui.tip=(ui.tip-1+D.tips.length)%D.tips.length;break;
  case 'tip-next':ui.tip=(ui.tip+1)%D.tips.length;break;
  case 'defeat':defeatBoss(ui.bossColor);return;
  case 'reward':if(ui.rewardPending)showColorReward();else openModal({kind:'reward',color:ui.bossColor});return;
  case 'orb':ui.world='hub-orb';go('boss');return;
  case 'white':ui.world='white';go('boss');return;
  case 'debug-enemy':act('debug-preset:enemy');return;
  case 'debug-off':act('debug-preset:off');return;
  case 'spear-boss':ui.form={...ui.form,preset:'Spear',weapon:'Spear',name:'창의 파수꾼',scale:1.2,hp:450,posture:250,boss:true};break;
  case 'enemy-export':act('enemy-export');return;
 }
 persist();render();
}
function act(command){
 if(Native.action(command))return;
 const at=command.indexOf(':'),type=at<0?command:command.slice(0,at),value=at<0?'':command.slice(at+1);
 if(type==='tool'){tool(value);return;}
 if(type==='scene'){if(value==='main')ui.mainPage='menu';go(value);return;}
 if(['select-art','select-weapon','select-item','settings-section','item-category','journal-category','journal-topic','upgrade-root','upgrade-node','slot'].includes(type)){
  if(type==='slot'&&!ui.saving&&!model.state.slots[+value])return;
  selectPreview(command);return;
 }
 switch(type){
  case 'new-game':startNewGame();return;
  case 'continue':if(model.load(model.latest())){ui.trail=model.s.hp;persist();startLoading(model.s.location,'hud');}return;
  case 'load-menu':openSlots(false,'main');return;
  case 'front-settings':ui.frontSettings=true;ui.tab='system';ui.settingsSection='GAMEPLAY';go('pause',{group:'main'});return;
  case 'front-back':ui.frontSettings=false;ui.mainPage='menu';go('main');return;
  case 'credits':ui.mainPage='credits';render();return;
  case 'credits-back':ui.mainPage='menu';render();return;
  case 'quit':openModal({kind:'quit'});return;
  case 'pause-tab':ui.frontSettings=false;setPauseTab(value);return;
  case 'pause-home':ui.tab='home';ui.focusIndex=0;ui.frontSettings=false;go('pause');return;
  case 'resume':if(model.s.hp<=0){go('death');return;}go('hud');return;
  case 'tab-prev':case 'tab-next':{const tabs=['status','equipment','sword','item','journal','system'],i=Math.max(0,tabs.indexOf(ui.tab)),d=type==='tab-next'?1:-1;setPauseTab(tabs[(i+d+tabs.length)%tabs.length]);return;}
  case 'equip-art':if(D.swordArts.some(r=>r.Name===value)){model.s.swordArt=value;persist();render();toast('검술을 장착했습니다.');}return;
  case 'equip-weapon':model.s.equipment=value;persist();render();toast('무기를 장착했습니다.');return;
  case 'equip-item':if(model.available(value)){model.s.item=value;persist();render();toast('사용할 아이템을 선택했습니다.');}return;
  case 'setting':{const [id,n]=value.split(':');adjustSetting(id,+n);return;}
  case 'apply-display':if(ui.display){Object.assign(model.state.settings,ui.display);ui.display=null;persist();render();toast('화면 설정을 적용했습니다.');}return;
  case 'rebind':openModal({kind:'rebind',id:value});return;
  case 'reset-bindings':model.state.settings.bindings=copy(new SSModel.Model(D).state.settings.bindings);persist();render();toast('기본 조작으로 복원했습니다.');return;
  case 'return-title':openModal({kind:'title'});return;
  case 'interact':
   if(ui.route==='boss'){if(ui.world==='white')act('black-start');else if(ui.world==='hub-orb')act('orb-interact');return;}
   ui.currentFire=model.s.location;
   if(ui.route==='hud'){ui.restPage='main';go('rest');return;}
   if(ui.route==='rest'&&!model.s.bonfires.includes(ui.currentFire))activateFire();return;
  case 'rest-main':ui.restPage='main';ui.restOption='rest';go('rest');return;
  case 'rest-travel':if(!model.s.bonfires.includes(ui.currentFire)){toast('화톳불을 먼저 활성화하세요.');return;}ui.restPage='travel';go('rest');return;
  case 'rest-back':ui.restPage='main';render();return;
  case 'rest-again':beginRest();return;
  case 'rest-upgrade':if(!model.s.bonfires.includes(ui.currentFire)){toast('화톳불을 먼저 활성화하세요.');return;}go('upgrade');return;
  case 'rest-leave':leaveRest();return;
  case 'travel-chapter':if(ui.expanded.includes(+value))ui.expanded=ui.expanded.filter(n=>n!==+value);else ui.expanded.push(+value);render();return;
  case 'travel-select':ui.travelSelection=value;render();if(value!==model.s.location&&model.s.bonfires.includes(value))openModal({kind:'travel',id:value});return;
  case 'travel-confirm':if(value!==model.s.location&&model.s.bonfires.includes(value))openModal({kind:'travel',id:value});return;
  case 'upgrade-category':chooseUpgradeCategory(value);return;
  case 'upgrade-prev':case 'upgrade-next':{const cats=['Weapon','Body','SwordArt','Healing','Item'],i=cats.indexOf(ui.upgradeCategory);chooseUpgradeCategory(cats[(i+(type==='upgrade-next'?1:-1)+5)%5]);return;}
  case 'upgrade-confirm':if(model.upgradeStatus(ui.upgradeNode).ok)openModal({kind:'upgrade',id:ui.upgradeNode,expected:model.level(ui.upgradeNode)});return;
  case 'upgrade-back':ui.restPage='main';ui.restOption='upgrade';go('rest');return;
  case 'dialogue-restart':startDialogue();return;
  case 'dialogue-topics':ui.dialogueRow='Topics';ui.dialoguePhase='choice';go('dialogue');return;
  case 'dialogue-next':nextDialogue();return;
  case 'dialogue-choice':chooseDialogue(+value);return;
  case 'dialogue-close':go('hud');return;
  case 'shop-select':if(ui.route!=='shop'){ui.shop=value;go('shop');}else selectPreview(command);return;
  case 'shop-confirm':if(model.shopStatus(ui.shop).ok)openModal({kind:'purchase',id:ui.shop,expected:model.s.shopPurchases[ui.shop]||0});return;
  case 'shop-back':ui.dialogueRow='Return';ui.dialoguePhase='line';go('dialogue');return;
  case 'slot-commit':commitSlot();return;
  case 'slot-delete':{const slot=model.state.slots[ui.slot];if(slot)openModal({kind:'delete',slot:ui.slot,expected:slot.id});return;}
  case 'slots-back':if(ui.afterSave){ui.afterSave=null;go('pause',{group:'pause'});}else go(ui.returnFromSlots);return;
  case 'resurrect':if(model.resurrect()){ui.trail=model.s.hp;persist();go('hud');toast('부활했습니다.');}return;
  case 'final-death':ui.finalDeath=true;render();return;
  case 'respawn':model.respawn();ui.finalDeath=false;ui.trail=model.s.hp;ui.cooldowns={};ui.itemCooldown=ui.artCooldown=0;persist();startLoading(model.s.lastRest,'hud');return;
  case 'tip':ui.tip=(ui.tip+(+value)+D.tips.length)%D.tips.length;render();return;
  case 'cycle-item':cycleItem(+value);return;
  case 'boss-arena':ui.world='hub';ui.showBoss=true;ui.bossHP=1;ui.bossPosture=0;go('boss');return;
  case 'boss-orb':ui.world='hub-orb';go('boss');return;
  case 'boss-white':ui.world='white';go('boss');return;
  case 'orb-interact':if(!['Blue','Green','Red'].every(c=>model.s.erased.includes(c)))return;model.activate('Black');model.s.location='Black';persist();startLoading('Black','boss');ui.worldAfterLoad='white';return;
  case 'black-start':ui.world='black';ui.showBoss=true;ui.bossColor='Black';ui.bossHP=1;ui.blackTransition=true;render();setTimeout(()=>{ui.blackTransition=false;render();},2300);return;
  case 'debug-page':ui.debugPage=value;if(ui.route!=='debug')go('debug');else render();return;
  case 'debug-close':go('hud');return;
  case 'debug-preset':{
   const d=model.state.debug;if(value==='off')d.master=false;else{Object.keys(d).forEach(k=>d[k]=false);d.master=true;if(value==='enemy')d.enemy=d.tokens=true;else d.hitbox=d.posture=true;}persist();render();return;
  }
  case 'enemy-preset':ui.form.preset=ui.form.weapon=value;ui.form.name=value==='Spear'?'창의 파수꾼':value==='Giant Golem'?'거대 골렘':'순찰병';render();return;
  case 'enemy-create':{
   const f=ui.form;if(!f.name.trim()||![f.scale,f.hp,f.posture].every(n=>Number.isFinite(+n)&&+n>0)){toast('이름과 0보다 큰 스케일·HP·체간 값을 확인하세요.');return;}
   model.state.enemyDrafts.push(copy({...f,scale:+f.scale,hp:+f.hp,posture:+f.posture}));persist();render();toast('적 설정을 생성 목록에 추가했습니다.');return;
  }
  case 'enemy-remove':model.state.enemyDrafts.splice(+value,1);persist();render();return;
  case 'enemy-export':{
   if(!model.state.enemyDrafts.length){toast('먼저 적 설정을 생성하세요.');return;}
   const blob=new Blob([JSON.stringify({format:'ProjectSS Enemy UI Draft',enemies:model.state.enemyDrafts},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='ProjectSS_Enemy_Drafts.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
  }
  case 'enemy-back':go('hud');return;
  case 'modal-cancel':closeModal();return;
  case 'modal-confirm':confirmModal();return;
  case 'activate':activateCurrent();return;
  case 'back':back();return;
 }
}
function activateCurrent(){
 if(ui.modal){if(ui.modalIndex===0&&ui.modal.kind!=='reward'&&ui.modal.kind!=='gift')closeModal();else confirmModal();return;}
 const active=document.activeElement;if(active?.closest('#canvas')&&active.matches('button[data-action]:not(:disabled)')&&active.dataset.action!=='activate'){act(active.dataset.action);return;}
 switch(ui.route){
  case 'main':{const buttons=$$('.n-main-entry');buttons[ui.focusIndex%Math.max(1,buttons.length)]?.click();break;}
  case 'pause':if(ui.tab==='home')$$('.n-menu-button')[ui.focusIndex%8]?.click();else if(ui.tab==='sword')act('equip-art:'+ui.selection);else if(ui.tab==='equipment')act('equip-weapon:'+ui.selection);else if(ui.tab==='item')act('equip-item:'+ui.selection);break;
  case 'rest':if(!model.s.bonfires.includes(ui.currentFire))activateFire();else if(ui.restPage==='travel')act('travel-confirm:'+ui.travelSelection);else act(({rest:'rest-again',travel:'rest-travel',upgrade:'rest-upgrade',leave:'rest-leave'})[ui.restOption]);break;
  case 'upgrade':act('upgrade-confirm');break;
  case 'shop':act('shop-confirm');break;
  case 'slots':act('slot-commit');break;
  case 'dialogue':nextDialogue();break;
  case 'death':act(ui.finalDeath?'respawn':'resurrect');break;
  case 'boss':act(ui.world==='white'?'black-start':'orb-interact');break;
  case 'enemy':act('enemy-create');break;
 }
}
function back(){
 if(ui.modal){closeModal();return;}
 if(ui.route==='loading')return;
 if(ui.route==='pause'){if(ui.frontSettings)act('front-back');else if(ui.tab==='home')act('resume');else act('pause-home');return;}
 const actions={upgrade:'upgrade-back',rest:ui.restPage==='travel'?'rest-back':'rest-leave',dialogue:'dialogue-close',shop:'shop-back',slots:'slots-back',debug:'debug-close',death:ui.finalDeath?'respawn':'final-death',enemy:'enemy-back'};
 if(actions[ui.route])act(actions[ui.route]);else if(ui.route==='hud')act('pause-home');else if(ui.route==='main'&&ui.mainPage!=='menu')act('credits-back');
}
function navigate(x,y){
 if(ui.modal){const buttons=$$('#modal-layer button');if(buttons.length>1){ui.modalIndex=ui.modalIndex===0?1:0;renderModal();}return;}
 if(ui.route==='dialogue'&&ui.dialoguePhase==='choice'){ui.dialogueChoice=(ui.dialogueChoice+1)%Math.max(1,model.choices(model.dialogueRow(ui.dialogueRow)).length);render();return;}
 const buttons=$$('#screen [data-nav]:not(:disabled)').filter(e=>e.getClientRects().length),active=document.activeElement;
 if(!buttons.length)return;
 let target;
 if(!buttons.includes(active)){target=buttons.find(e=>e.classList.contains('selected-line'))||buttons[0];}
 else{
  const a=active.getBoundingClientRect(),center={x:a.x+a.width/2,y:a.y+a.height/2};let score=Infinity;
  for(const btn of buttons){if(btn===active)continue;const r=btn.getBoundingClientRect(),dx=r.x+r.width/2-center.x,dy=r.y+r.height/2-center.y,along=x?dx*x:dy*y,cross=x?Math.abs(dy):Math.abs(dx);if(along<3)continue;const s=along+cross*2.2;if(s<score){score=s;target=btn;}}
  if(!target)target=buttons[(buttons.indexOf(active)+(x||y)+buttons.length)%buttons.length];
 }
 if(!target)return;const action=target.dataset.action,preview=target.dataset.preview;
 if(preview)selectPreview(preview);
 const next=$$('#screen [data-action]').find(e=>e.dataset.action===action);next?.focus({preventScroll:true});next?.scrollIntoView({block:'nearest',inline:'nearest'});
}
function cycleTop(direction){if(ui.route==='pause'&&!ui.frontSettings)act(direction>0?'tab-next':'tab-prev');else if(ui.route==='upgrade')act(direction>0?'upgrade-next':'upgrade-prev');else if(ui.route==='loading')act('tip:'+direction);}
document.addEventListener('click',e=>{
 const category=e.target.closest('[data-group]');if(category){chooseGroup(category.dataset.group);return;}
 const button=e.target.closest('button[data-action]');if(button&&!button.disabled){if(ui.modal&&button.closest('#canvas')&&!button.closest('#modal-layer'))return;act(button.dataset.action);}
});
document.addEventListener('pointerover',e=>{const button=e.target.closest('[data-preview]');if(!button||button.contains(e.relatedTarget)||button.disabled||ui.modal)return;selectPreview(button.dataset.preview);});
document.addEventListener('focusin',e=>{if(!ui.modal||!e.target.closest('#modal-layer'))return;if(e.target.dataset.action==='modal-cancel')ui.modalIndex=0;else if(e.target.dataset.action==='modal-confirm')ui.modalIndex=1;});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.dataset.toolSelect==='stealth'){ui.stealth=t.value;render();}
 if(t.dataset.toolSelect==='chapter'){model.s.chapter=+t.value;persist();render();}
 if(t.dataset.toolSelect==='fire'){ui.currentFire=t.value;model.s.location=t.value;persist();go('rest');}
 if(t.dataset.toolSelect==='boss'){ui.bossColor=t.value;ui.showBoss=true;ui.bossHP=1;ui.world='hub';go('boss');}
 if(t.dataset.settingRange){model.state.settings[t.dataset.settingRange]=+t.value;persist();render();}
 if(t.dataset.debug){model.state.debug[t.dataset.debug]=t.checked;if(t.dataset.debug!=='master'&&t.checked)model.state.debug.master=true;persist();render();}
 if(t.dataset.enemyField){ui.form[t.dataset.enemyField]=t.type==='number'?+t.value:t.value;}
 if(t.dataset.enemyCheck){ui.form[t.dataset.enemyCheck]=t.checked;render();}
});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.settingRange){model.state.settings[t.dataset.settingRange]=+t.value;t.nextElementSibling.textContent=t.value;}if(t.dataset.enemyField)ui.form[t.dataset.enemyField]=t.type==='number'?+t.value:t.value;});
window.addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('.bench-head')||e.target.closest('#tools')||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
 if(e.repeat)return;
 if(!ui.manualDevice&&ui.device!=='keyboard'){ui.device='keyboard';render();}
 const k=e.key.toLowerCase();
 if(ui.modal?.kind==='rebind'){
  e.preventDefault();if(k==='escape'){closeModal();return;}const value=({ ' ':'Space',control:'Ctrl',shift:'Shift',alt:'Alt'})[k]||e.key.toUpperCase();
  if(Object.entries(model.state.settings.bindings).some(([id,v])=>id!==ui.modal.id&&v.toUpperCase()===value.toUpperCase())){toast('이미 사용 중인 키입니다. 다른 키를 누르세요.');return;}
  model.state.settings.bindings[ui.modal.id]=value;persist();ui.modal=null;render();return;
 }
 if(['escape','backspace','enter',' ','arrowup','arrowdown','arrowleft','arrowright','q','e','f3'].includes(k))e.preventDefault();
 if(ui.route==='loading'){if(k==='q')act('tip:-1');if(k==='e')act('tip:1');return;}
 if(ui.modal){if(k==='escape'||k==='backspace')back();else if(k==='enter'||k===' ')activateCurrent();else if(k.startsWith('arrow'))navigate(1,0);return;}
 if(k==='escape'||k==='backspace'){back();return;}
 if(k==='f3'){if(ui.route==='debug')back();else go('debug');return;}
 if(ui.route==='dialogue'&&ui.dialoguePhase==='choice'&&(k==='1'||k==='3')){chooseDialogue(k==='1'?0:1);return;}
 if(k==='enter'||k===' '){activateCurrent();return;}
 if(k==='arrowup'){navigate(0,-1);return;}if(k==='arrowdown'){navigate(0,1);return;}if(k==='arrowleft'){navigate(-1,0);return;}if(k==='arrowright'){navigate(1,0);return;}
 if(k==='q'&&['pause','upgrade'].includes(ui.route)){cycleTop(-1);return;}
 if(k==='e'){
  if(ui.route==='dialogue')nextDialogue();else if(['hud','rest','boss'].includes(ui.route))act('interact');else cycleTop(1);return;
 }
 if(ui.route==='hud'||ui.route==='boss'){
  const bindings=model.state.settings.bindings;
  if(k===bindings.heal.toLowerCase())tool('heal');if(k===bindings.item.toLowerCase())useItem();if(k===bindings.cycle.toLowerCase())cycleItem();
  if(k===bindings.sword.toLowerCase()){const index=D.swordArts.findIndex(r=>r.Name===model.s.swordArt);model.s.swordArt=D.swordArts[(index+1)%D.swordArts.length].Name;persist();render();}
  if(k===bindings.crouch.toLowerCase()){ui.stealth=ui.stealth==='none'?'hidden':'none';render();}
 }
 if(k==='p'){model.s.currency+=500;persist();render();}if(k==='['){model.s.materials++;persist();render();}if(k===']'){model.s.sp++;persist();render();}
});
let heldMouse=new Set();
$('#frame').addEventListener('pointerdown',e=>{
 if(ui.route!=='hud'&&ui.route!=='boss'||ui.modal||e.target.closest('button'))return;
 if(!ui.manualDevice&&ui.device!=='keyboard'){ui.device='keyboard';render();}
 heldMouse.add(e.button);if(heldMouse.has(0)&&heldMouse.has(2))useArt();
});
window.addEventListener('pointerup',e=>heldMouse.delete(e.button));window.addEventListener('blur',()=>heldMouse.clear());
$('#frame').addEventListener('contextmenu',e=>e.preventDefault());
$('#device').onclick=()=>setDevice(ui.device==='keyboard'?'pad':'keyboard',true);
$('.wordmark').onclick=e=>{e.preventDefault();chooseGroup('main');};
function toggleCinema(){document.body.classList.toggle('cinema');resize();$('#frame').focus({preventScroll:true});}
$('#fullscreen').onclick=toggleCinema;$('#cinema-exit').onclick=toggleCinema;
function resize(){const frame=$('#frame'),fullscreen=document.body.classList.contains('cinema')||!!document.fullscreenElement;const scale=fullscreen?Math.min(frame.clientWidth/1280,frame.clientHeight/720):frame.clientWidth/1280;const canvas=$('#canvas');canvas.style.transform=`scale(${scale})`;canvas.style.left=fullscreen?Math.max(0,(frame.clientWidth-1280*scale)/2)+'px':'0';canvas.style.top=fullscreen?Math.max(0,(frame.clientHeight-720*scale)/2)+'px':'0';}
new ResizeObserver(resize).observe($('#frame'));document.addEventListener('fullscreenchange',()=>setTimeout(resize,0));
function gamepadKey(index){
 if(ui.route==='loading'){if(index===2)act('tip:-1');if(index===1)act('tip:1');return;}
 if(!ui.modal&&(ui.route==='hud'||ui.route==='boss')){if(index===12){tool('heal');return;}if(index===13){cycleItem();return;}}
 if(ui.route==='dialogue'&&ui.dialoguePhase==='choice'&&(index===4||index===5)){chooseDialogue(index===4?0:1);return;}
 if(index===0)activateCurrent();else if(index===1)back();else if(index===12)navigate(0,-1);else if(index===13)navigate(0,1);else if(index===14)navigate(-1,0);else if(index===15)navigate(1,0);else if(index===4)cycleTop(-1);else if(index===5)cycleTop(1);else if(index===9){if(ui.route==='pause')go('hud');else act('pause-home');}else if(index===8){if(ui.route==='debug')back();else go('debug');}else if(index===7&&ui.route==='hud')useItem();else if(index===2&&ui.route==='hud')act('interact');
}
function tick(now){
 const dt=Math.min(.1,Math.max(0,(now-ui.lastTick)/1000));ui.lastTick=now;
 if(ui.route==='hud')model.s.playSeconds+=dt;
 if(now>=ui.trailHold)ui.trail=Math.max(model.s.hp,ui.trail-dt*model.maxHP*.45);if(ui.trail<model.s.hp)ui.trail=model.s.hp;
 if(ui.cooldowns)for(const id of Object.keys(ui.cooldowns))ui.cooldowns[id]=Math.max(0,ui.cooldowns[id]-dt);
 ui.itemCooldown=ui.cooldowns?.[model.s.item]||0;ui.artCooldown=Math.max(0,ui.artCooldown-dt);
 if(ui.aware)ui.awareness=Math.min(1,ui.awareness+dt/1.8);updateHUD();
 if(ui.loading&&ui.route==='loading'){
  const progress=Math.min(1,(now-ui.loading.start)/5000),bar=$('[data-loading-progress]'),text=$('[data-loading-percent]');if(bar)bar.style.width=progress*100+'%';if(text)text.textContent='LOADING '+Math.floor(progress*100)+'%';
  if(progress>=1){const loading=ui.loading;ui.loading=null;model.s.location=loading.destination;if(ui.worldAfterLoad){ui.world=ui.worldAfterLoad;ui.worldAfterLoad=null;}else ui.world='hub';ui.currentFire=loading.destination;persist();go(loading.returnRoute);}
 }
 const gp=[...(navigator.getGamepads?.()||[])].find(Boolean);
 if(gp){const pressed=gp.buttons.map(b=>b.pressed);for(let i=0;i<pressed.length;i++)if(pressed[i]&&!ui.lastPad[i]){if(!ui.manualDevice&&ui.device!=='pad'){ui.device='pad';render();}gamepadKey(i);}if(now>ui.analogNext){const x=gp.axes[0]||0,y=gp.axes[1]||0;if(Math.max(Math.abs(x),Math.abs(y))>.6){if(!ui.manualDevice&&ui.device!=='pad'){ui.device='pad';render();}navigate(Math.abs(x)>Math.abs(y)?Math.sign(x):0,Math.abs(y)>=Math.abs(x)?Math.sign(y):0);ui.analogNext=now+220;}}if(pressed[4]&&pressed[5]&&!(ui.lastPad[4]&&ui.lastPad[5])&&(ui.route==='hud'||ui.route==='boss'))useArt();ui.lastPad=pressed;}
 else ui.lastPad=[];
 requestAnimationFrame(tick);
}
function boot(){
 $('#categories').innerHTML=groups.map(([id,code,n,desc,count],i)=>`<button type="button" class="category-button" data-group="${id}"><span class="number">${String(i+1).padStart(2,'0')}</span><span>${n}</span><span class="count">${count}</span></button>`).join('');
 const hash=location.hash.slice(1);if(groups.some(g=>g[0]===hash)){if(hash==='main')render();else chooseGroup(hash);}else render();resize();requestAnimationFrame(tick);
 if(!storageOK)toast('브라우저 저장을 사용할 수 없어 현재 탭에서만 상태가 유지됩니다.');
}
window.SS_ATLAS={model,ui,go,act,chooseGroup,render,tool,startLoading,closeModal,openModal};
boot();
})();
