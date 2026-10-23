/* Browser projection of the retained Slate/UMG layouts in C:/ProjectSS/ProjectSS.
   Coordinates below are copied from the corresponding widget source; no UI artwork is redrawn. */
window.SS_NATIVE_FACTORY=function(E){
 'use strict';
 const {D,N,model,ui,h,fmt,act,go,render,persist,startLoading,afterSaving,art,itemInfo,toast}=E;
 const ink=N.theme.ink.css,muted=N.theme.muted.css,paper=N.theme.paper.css;
 const at=(x,y,w,hh)=>`left:${x}px;top:${y}px;${w!==undefined?'width:'+w+'px;':''}${hh!==undefined?'height:'+hh+'px;':''}`;
 const tex=name=>N.textures[name]?.file||'';
 const I=(name,x,y,w,hh=w,opacity=1,cls='')=>tex(name)?(cls.includes('n-hud-tint')?`<span class="n-image n-hud-mask" style="${at(x,y,w,hh)}opacity:${opacity};mask-image:url('${h(tex(name))}')"></span>`:`<img class="n-image ${cls}" src="${h(tex(name))}" alt="" draggable="false" style="${at(x,y,w,hh)}opacity:${opacity}">`):'';
 const T=(text,x,y,w=500,size=26,bold=false,color=ink,cls='')=>`<div class="n-text ${cls}" style="${at(x,y,w)}font-size:${size}px;font-weight:${bold?700:400};color:${color}">${h(text)}</div>`;
 const P=(html,x,y,w,hh,cls='')=>`<div class="n-position ${cls}" style="${at(x,y,w,hh)}">${html}</div>`;
 const L=(x,y,w,hh=1,alpha=.2)=>`<div class="n-line" style="${at(x,y,w,hh)}background:rgba(0,0,0,${alpha})"></div>`;
 const B=(label,action,x,y,w,hh=46,selected=false,preview='',cls='')=>`<button type="button" data-action="${h(action)}" ${preview?`data-preview="${h(preview)}"`:''} data-nav class="n-button ${selected?'n-selected':''} ${cls}" style="${at(x,y,w,hh)}">${label}</button>`;
 const shell=(content,unit=1920,cls='')=>`<section class="native-shell n-unit-${unit} ${cls}" data-native-layout="${ui.route}">${content}</section>`;
 function key(k,p,height=27){
  const pad=ui.device==='pad',platform=!pad?'keyboard_mouse':model.state.settings.pad==='PlayStation'?'play_station':model.state.settings.pad==='Switch'?'switch':'xbox';
  const map={A:'Gamepad_FaceButton_Bottom',B:'Gamepad_FaceButton_Right',X:'Gamepad_FaceButton_Left',Y:'Gamepad_FaceButton_Top',LB:'Gamepad_LeftShoulder',RB:'Gamepad_RightShoulder',LT:'Gamepad_LeftTrigger',RT:'Gamepad_RightTrigger',Menu:'Gamepad_Special_Right',View:'Gamepad_Special_Left','D-pad':'Gamepad_DPad_Up','D-pad ↑':'Gamepad_DPad_Up','D-pad ↓':'Gamepad_DPad_Down','↑ ↓':'Up','↑':'Up','↓':'Down',Esc:'Escape',Space:'SpaceBar',Del:'Delete'};
  Object.assign(map,{'0':'Zero','1':'One','2':'Two','3':'Three','4':'Four','5':'Five','6':'Six','7':'Seven','8':'Eight','9':'Nine',Alt:'LeftAlt',Shift:'LeftShift',LS:'Gamepad_Left2D',RS:'Gamepad_Right2D','LS click':'Gamepad_LeftThumbstick','RS click':'Gamepad_RightThumbstick'});
  const text=pad?p:k,id=map[text]||text;
  if(!pad&&(k==='LMB'||k==='RMB'))return `<span class="n-mouse-group"><svg width="${height*.72}" height="${height}" viewBox="0 0 19 26" aria-label="${k}"><rect x=".7" y=".7" width="17.6" height="24.6" rx="7.3" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="${k==='LMB'?'M2.3 9.9V5.8Q2.3 2.6 8.4 2.6V9.9Z':'M10 2.6Q16.7 2.6 16.7 5.8V9.9H10Z'}" fill="currentColor"/><path d="M9.5 1.3V11.7M1.5 11.7H17.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg><span>${k}</span></span>`;
  if(!pad&&k==='Backspace')return `<kbd class="n-backspace" style="height:${height*.75}px;border-radius:${height*.75*.3}px;font-size:${Math.max(8,Math.round(height*.75*.44))*4/3}px">Backspace</kbd>`;
  if(!pad&&k==='↑ ↓')return key('↑',p,height)+key('↓',p,height);
  const entry=N.inputMaps[platform]?.mapping[id];
  return entry?`<span role="img" class="n-key-mask" aria-label="${h(text)}" title="${h(text)}" style="height:${height}px;width:${Math.max(height*.5,Math.min(height*3,height*entry.size[0]/entry.size[1]))}px;mask-image:url('${h(entry.file)}')"></span>`:`<span class="n-key-text">${h(text)}</span>`;
 }
 const prompt=(k,p,text,height=27,size=17.333)=>`<span class="n-prompt" style="font-size:${size}px">${key(k,p,height)}${text?`<span>${h(text)}</span>`:''}</span>`;
 const C=(k,p,label,action,x,y,w=250,hh=40,height=27,size=17.333)=>B(prompt(k,p,label,height,size),action,x,y,w,hh,false,'','n-prompt-button');
 const nativePaper=(content,unit=1920)=>shell(content,unit,'n-paper n-fog');
 const backFooter=(action='pause-home',label='뒤로')=>C('Backspace','B',label,action,1670,994,220);
 function tabs(){
  const names=[['status','STATUS',530,130],['equipment','EQUIPMENT',700,130],['sword','SWORD ART',900,170],['item','ITEM',1120,130],['journal','JOURNAL',1270,130],['system','SYSTEM',1420,130]];
  return T('P R O J E C T S S',100,79,350,20,true)+names.map(([id,n,x,w])=>B(h(n),'pause-tab:'+id,x,71,w,40,ui.tab===id,'pause-tab:'+id,'n-top-tab')+(ui.tab===id?L(x,113,42,2,.9):'')).join('')+B(prompt('Q','LB','',27)+'‹','tab-prev',425,71,100,40,false,'','n-page-arrow')+B('›'+prompt('E','RB','',27),'tab-next',1590,71,100,40,false,'','n-page-arrow');
 }
 function main(){
  if(ui.mainPage==='quit')return shell('',1920,'n-exited');
  const all=[...(model.latest()>=0?[['CONTINUE','continue']]:[]),['NEW GAME','new-game'],...(model.latest()>=0?[['LOAD GAME','load-menu']]:[]),['OPTIONS','front-settings'],['CREDITS','credits'],['QUIT','quit']];
  let content=ui.mainPage==='credits'?T('CREDITS',100,365,700,29.333,true,'white')+T('PROJECTSS\nMade with Unreal Engine',100,430,1250,24,false,'white')+B('BACK','credits-back',100,860,350,55,true,'','n-main-entry'):all.map(([n,a],i)=>B(n,a,100,425+58*i,450,54,i===ui.focusIndex,'main-entry:'+i,'n-main-entry')).join('');
  return shell(`<div class="n-main-shade"></div><div class="n-band n-band-top"></div><div class="n-band n-band-bottom"></div><div class="n-main-type">${content}${P(prompt('Enter','A',ui.mainPage==='credits'?'뒤로':'선택',25,17.333),100,1020,350,36,'n-main-help')}${T('PROJECTSS  ·  DEVELOPMENT',1320,1015,500,14.667,false,'rgba(255,255,255,.3)','n-right')}</div>`,1920,'n-main '+(ui.mainOpening?'n-starting':''));
 }
 function pause(){
  let content='';const titles={status:'STATUS',equipment:'EQUIPMENT',sword:'SWORD ART',item:'ITEM',journal:'JOURNAL',system:'SYSTEM'},desc={status:'현재 상태를 확인합니다.',equipment:'장착한 장비를 확인합니다.',sword:'검술을 선택해 장착합니다.',item:'사용할 아이템을 선택합니다.',journal:'여정에 필요한 조작과 전투 안내입니다.',system:'게임 환경을 설정합니다.'};
  if(ui.tab==='home'){
   const entries=[['계속하기','resume'],['상태','pause-tab:status'],['장비','pause-tab:equipment'],['검술','pause-tab:sword'],['아이템','pause-tab:item'],['기록','pause-tab:journal'],['설정','pause-tab:system'],['타이틀로 돌아가기','return-title']];
   content=T('PAUSED',100,255,600,34,true)+entries.map(([n,a],i)=>B(h(n),a,100,365+62*i,500,46,i===ui.focusIndex,'','n-menu-button')).join('')+I('ILL_Player_Stand',1165,340,350,390,.45)+T('생명력',1030,862,160,20)+T(`${model.s.hp} / ${model.maxHP}`,1208,860,200,24,true)+T('장착 검술',1380,862,180,20)+T(art().DisplayName,1540,860,270,24,true,ink,'n-right')+C('Enter','A','선택','activate',1515,998,140)+backFooter('resume','계속하기');
   return nativePaper(content);
  }
  content=(ui.frontSettings?T('P R O J E C T S S',100,79,350,20,true):tabs())+T(ui.frontSettings?'SYSTEM':titles[ui.tab],100,195,600,34,true)+T(desc[ui.tab],100,249,900,20,false,muted)+backFooter(ui.frontSettings?'front-back':'pause-home');
  const part={status:statusBody,equipment:equipmentBody,sword:swordBody,item:itemBody,journal:journalBody,system:settingsBody}[ui.tab];
  return nativePaper(content+part());
 }
 function statusBody(){
  let out=I('ILL_Player_Stand',710,360,420,410)+T('현재 상태',100,330,480,26,true);
  [['생명력',`${model.s.hp} / ${model.maxHP}`],['최대 체간',model.maxPosture],['신체 강화',`HP +${model.level('Health')} / 체간 +${model.level('Posture')}`],['스킬 포인트',model.s.sp],['성장 재화',fmt(model.s.currency)],['강화 재료',model.s.materials]].forEach(([n,v],i)=>{const y=390+i*80;out+=T(n,100,y,210,23)+T(v,330,y-2,250,25,true,ink,'n-right')+L(100,y+48,480);});
  return out+T('장착 장비',1300,330,500,26,true)+T('현재 무기',1300,390,200,23)+T(weaponLabel(model.s.equipment),1510,390,300,25,true)+T('장착 검술',1300,455,200,23)+T(art().DisplayName,1510,455,310,23,true)+L(1300,510,510)+T('습득한 스킬',1300,550,510,26,true)+T(['Ice','BrainWash','Clone'].filter(id=>model.available(id)).map(id=>itemInfo(id).name).join('\n')||'아직 습득한 스킬이 없습니다.',1300,615,510,20,false,muted)+T('신체 강화와 스킬 습득은 휴식 거점에서 진행합니다.',100,937,1200,19,false,muted);
 }
 function swordBody(){
  const r=D.swordArts.find(r=>r.Name===ui.selection)||art(),equipped=r.Name===model.s.swordArt;
  let list=D.swordArts.map((a,i)=>I(a.Movement==='Leap'?'I_ShatterStrike':'I_DashAttack',103,341+i*69,40,40,ui.selection===a.Name?1:.65)+B(h(a.DisplayName),'select-art:'+a.Name,165,337+i*69,330,46,ui.selection===a.Name,'select-art:'+a.Name,'n-menu-button')+(model.s.swordArt===a.Name?T('장착',405,349+i*69,95,17,true):'')).join('');
  let detail=T('검술 미리보기',550,330,650,24,true)+I(r.Movement==='Leap'?'ILL_LeapSlash':'ILL_DashAttack',550,388,580,330)+T(r.DisplayName,558,762,650,30,true)+T(r.Movement==='Leap'?'상대에게 도약하여 내려베는 검술.':'상대 앞까지 한순간에 접근해 베는 검술.',558,811,670,20)+T('기술 정보',1295,334,480,28,true);
  [['피해량',r.Damage,100,''],['사거리',D.lockRange/100,25,'m'],['재생 속도',r.AttackPlayRate,3,'x'],['재사용',r.Cooldown,10,'s']].forEach(([n,v,max,s],i)=>{const y=411+i*50;detail+=T(n,1295,y,220,24)+L(1398,y+20,105,1,.18)+Array.from({length:12},(_,t)=>L(1530+t*17,y+9,2,8,t<Math.round(v/max*12)?1:.18)).join('')+T(v+s,1750,y+1,155,19,true);});
  detail+=L(1295,642,510)+T('장착 상태',1295,683,500,24,true)+T(equipped?'현재 장착한 검술입니다.':'선택하여 장착할 수 있습니다.',1295,736,530,20)+T('검술은 이 화면에서 장착할 수 있습니다.',1295,810,530,19,false,muted)+P(`<span class="n-prompt">${key('LMB','RB',28)} + ${key('RMB','LB',28)} 사용</span>`,558,875,600,38)+C('Enter','A','장착','equip-art:'+r.Name,1280,994,320)+T('검술은 한 번에 하나만 장착할 수 있습니다.',100,1007,1100,18,false,muted);
  return list+P(detail,0,0,1920,1080,'n-details');
 }
 const weaponLabel=id=>D.weapons?.find(w=>w.Name===id)?.DisplayName||id;
 function equipmentBody(){
  const names=['Katana','Nodachi','Greatsword','Double Axe','Sword & Shield','Spear'],chosen=names.includes(ui.selection)?ui.selection:model.s.equipment;
  let out=names.map((n,i)=>B(h(weaponLabel(n)),'select-weapon:'+n,105,337+i*78,380,46,chosen===n,'select-weapon:'+n,'n-menu-button')+(model.s.equipment===n?T('장착 중',390,351+i*78,105,16,true):'')).join('');
  const stats=D.weapons?.find(w=>w.Name===chosen);
  return out+T('무기',550,337,600,24,true)+T(weaponLabel(chosen),550,405,680,38,true)+L(550,478,650)+T(stats?.Description||'공격과 방어 모션이 함께 전환됩니다.',550,515,650,23)+T('장착 정보',1295,337,490,26,true)+T('일반 공격',1295,423,230,22)+T(stats?stats.combo+' 연계':'—',1570,423,230,22,true)+T('일반 공격 피해',1295,481,250,22)+T(stats?.damage??'—',1570,481,230,22,true)+T('체간 피해',1295,539,230,22)+T(stats?.posture??'—',1570,539,230,22,true)+L(1295,626,480)+T(model.s.equipment===chosen?'현재 장착한 무기입니다.':'장착하면 무기와 전투 모션이 함께 바뀝니다.',1295,676,490,22,true)+T('무기를 고른 뒤 장착을 눌러 적용하세요.',550,850,680,20,false,muted)+C('Enter','A','장착','equip-weapon:'+chosen,1280,994,320);
 }
 function itemBody(){
  const cats=['소비 아이템','투척 아이템','특수 아이템','중요 아이템'],icons=['I_Heal','I_Throw','I_Crystal','I_KeyItem'],ids=ui.itemCategory===0?['Heal']:ui.itemCategory===1?['Ice','BrainWash']:ui.itemCategory===2?['Clone']:[];const chosen=ids.includes(ui.selection)?ui.selection:ids[0];
  let out=cats.map((n,i)=>I(icons[i],102,339+i*92,40,40,ui.itemCategory===i?1:.6)+B(h(n),'item-category:'+i,165,337+i*92,315,46,ui.itemCategory===i,'item-category:'+i,'n-menu-button')).join('');
  const icon=id=>id==='Heal'?'I_Heal':id==='Clone'?'I_Clone':id==='Ice'?'I_Ice':'I_MindControl';
  for(let i=0;i<12;i++){const x=535+160*(i%4),y=347+160*Math.floor(i/4),id=ids[i];out+=I(id===chosen?'W_InventorySlot_Selected':'W_InventorySlot',x,y,146,146,id===chosen?1:.18);if(id)out+=I(icon(id),x+35,y+35,76)+B('','select-item:'+id,x,y,146,146,chosen===id,'select-item:'+id,'n-grid-hit')+(id===model.s.item?T('장착',x+85,y+113,75,17,true):id==='Heal'?T(model.s.healCharges,x+115,y+112,45,19,true):'');}
  if(chosen==='Heal')out+=I('I_Heal',1340,347,110)+T('회복',1340,516,500,30,true)+T('생명력을 회복합니다.',1340,573,490,20)+P(prompt('H','D-pad ↑','회복',28,18.667),1340,605,470,28)+L(1330,650,480)+T('보유 횟수',1330,685,350,24)+T(`${model.s.healCharges} / ${model.maxHeals}`,1710,685,150,24,true)+T('회복량  '+model.healAmount,1330,775,490,20);
  else if(chosen)out+=I(icon(chosen),1340,347,110)+T(itemInfo(chosen).name,1340,516,500,30,true)+T(chosen==='Ice'?'얼음 투사체를 발사해 적을 잠시 얼립니다.':chosen==='BrainWash'?'세뇌 투사체를 발사합니다.':'분신이 함께 적을 공격합니다.',1340,573,490,20)+L(1330,760,480)+T(model.s.item===chosen?'장착 중':'선택하여 장착',1330,795,490,22,true)+C('Enter','A','장착','equip-item:'+chosen,1280,994,320);
  else out+=T('보유한 아이템이 없습니다.',1330,516,500,22);
  return out+P(prompt('F','RT','아이템 사용',28,18.667),100,994,400,40)+P(prompt('2','D-pad ↓','아이템 전환',28,18.667),550,994,400,40);
 }
 function journalBody(){
  const cats=['전투','이동','잠입'],icons=['I_Weapon','I_WallConstruct','I_Execution'],topics=[['공격과 방어','검술','인살'],['갈고리','벽 달리기','회피와 달리기'],['앉기','후방 인살']],j=ui.journal,t=Math.min(ui.journalTopic,topics[j].length-1);
  const body=[['공격을 이어가고, 가드와 패링으로 적의 체간을 압박합니다.','장착한 검술을 사용합니다. 검술 메뉴에서 기술을 바꿀 수 있습니다.','체간이 무너진 적에게 접근해 인살 가능 표시를 확인합니다.'],['갈고리 대상 표시가 보일 때 사용할 수 있습니다.','전용 벽을 향해 이동합니다. 벽 달리기 중 점프하면 도약합니다.','입력 방향으로 회피합니다. 홀드하며 이동하면 달립니다.'],['앉아서 이동하면 소음을 줄일 수 있습니다.','적의 뒤에서 조용히 접근해 인살 가능 표시를 확인합니다.']][j][t];
  return cats.map((n,i)=>I(icons[i],102,339+i*70,40,40,i===j?1:.6)+B(h(n),'journal-category:'+i,165,337+i*70,315,46,i===j,'journal-category:'+i,'n-menu-button')).join('')+topics[j].map((n,i)=>I(j===1&&i===0?'I_Hook_Available':'I_Tutorial',540,342+i*90,40)+B(h(n),'journal-topic:'+i,600,337+i*90,360,46,t===i,'journal-topic:'+i,'n-menu-button')).join('')+I(j===0?'ILL_DashAttack':'Traversal_Tutorial_Diagram',1040,385,680,216)+T(topics[j][t],1040,662,700,30,true)+T(body,1040,718,760,20)+P(prompt(j===1?(t===0?'G':t===1?'Space':'Alt'):j===2?(t===0?'C':'LMB'):'LMB',j===1?(t===0?'LT':t===1?'A':'B'):j===2?(t===0?'LS':'RB'):'RB',topics[j][t],28,18.667),1040,780,760,38)+P(prompt('F1','Y','플레이 중 조작 안내',27),100,994,600,40);
 }
 function settingsBody(){
  const s=model.state.settings,names=['GAMEPLAY','DISPLAY','VIDEO','SOUND','LANGUAGE','REMAPPING'];let out=names.map((n,i)=>B(n,'settings-section:'+n,100,326+58*i,420,46,ui.settingsSection===n,'settings-section:'+n,'n-menu-button')).join('');
  const choice=(n,v,id,y)=>T(n,620,y+8,235,25)+L(865,y+23,175,1,.2)+B('‹','setting:'+id+':-1',1070,y,40,46,false,'','n-setting-arrow')+T(v,1110,y+7,290,25,true,ink,'n-center')+B('›','setting:'+id+':1',1400,y,40,46,false,'','n-setting-arrow');
  let note='';
  if(ui.settingsSection==='GAMEPLAY'){out+=choice('조작 안내',s.guide?'켬':'끔','guide',326)+choice('디버그 설정','열기','debug',406)+choice('패드 아이콘',s.pad==='auto'?'자동':s.pad,'pad',486);note='최근 사용한 입력 장치에 맞춰 버튼 안내가 바뀝니다.';}
  if(ui.settingsSection==='DISPLAY'){const d=ui.display||s;out+=choice('해상도',d.resolution,'resolution',326)+choice('화면 모드',d.mode,'mode',406)+choice('수직 동기화',s.vsync?'켬':'끔','vsync',486)+choice('프레임 제한',s.fps,'fps',566)+C('Enter','A','적용','apply-display',1510,326,200);note='해상도와 화면 모드를 선택한 뒤 적용을 누르세요. 변경한 설정은 저장됩니다.';}
  if(ui.settingsSection==='VIDEO'){out+=choice('그래픽 품질',['낮음','보통','높음','매우 높음'][s.quality],'quality',326);note='그래픽 품질은 변경 즉시 적용됩니다.';}
  if(ui.settingsSection==='SOUND'){out+=T('전체 음량',620,334,235,25)+L(865,349,175,1,.2)+I('W_Slider_Dots',1080,341,264,16)+P(`<input type="range" aria-label="전체 음량" min="0" max="100" value="${s.master}" data-setting-range="master" class="n-slider"><span>${s.master} %</span>`,1076,329,520,40);note='전체 음량을 조절합니다. 변경한 값은 자동으로 저장됩니다.';}
  if(ui.settingsSection==='LANGUAGE'){out+=T('언어',620,334,235,25)+L(865,349,175,1,.2)+T('한국어',1110,334,290,25,true,ink,'n-center');note='현재 게임에서 제공하는 언어입니다.';}
  if(ui.settingsSection==='REMAPPING'){
   out+=T(ui.device==='pad'?'패드':'키보드 / 마우스',620,326,480,24,true)+L(620,368,48,2,.9)+T('동작',620,396,450,20,false,muted)+T('현재 입력',1130,396,600,20,false,muted);
   [['공격','LMB','RB'],['가드','RMB','LB'],['회피','Alt','B'],['점프','Space','A'],['회복','H','D-pad ↑'],['아이템 전환','2','D-pad ↓'],['검술 전환','3','—']].forEach(([n,k,p],i)=>out+=T(n,620,442+58*i,490,24)+P(prompt(k,p,'',28),1130,442+58*i,650,35));
  }
  return out+T(note,620,853,1150,20,false,muted);
 }
 function loading(){
  return nativePaper(T('PROJECTSS',100,88,400,20,true,ink,'n-loading-brand')+I('I_Checkpoint',921,392,78)+T('공간을 연결하는 중',660,509,600,26.667,false,'#565656','n-center')+P('<div class="n-loading-track"><i data-loading-progress></i></div>',660,568,600,4)+P(prompt('Q','X','이전 팁',22,16),100,950,135,30)+P(prompt('E','B','다음 팁',22,16),248,950,135,30)+T(`${ui.tip+1} / ${D.tips.length}`,405,952,130,14.667,false,'#858585')+`<div class="n-text" data-loading-tip style="${at(100,991,1350)}font-size:18.667px;color:#696969">${h(D.tips[ui.tip%D.tips.length].Tip)}</div>`+T('불러오는 중',1624,991,150,18.667,false,'#565656'));
 }
 function death(){
  const final=ui.finalDeath,can=model.s.resurrections>0&&!model.s.resurrectionLocked;
  let out=I('W_Death_Vignette_1920x1080',0,0,1920,1080)+I('W_Death_FadeBlack_16x16',0,0,1920,1080,final?.89:0,'n-death-fade')+I('W_Death_Mark_Glow_512',704,248,512,512,final?.18:0)+I(final?'I_Death_Mark_Red_512':'I_Downed_Mark_512',704,248,512)+T(final?'DEAD':'DOWN',710,718,500,25.333,false,final?'#d42f2d':'#b6b8b9','n-death-title n-center');
  if(final)out+=C('Enter','A','체크포인트에서 다시 시작','respawn',760,940,400,56,24,26.667);
  else out+=C('Backspace','B','사망하기','final-death',586,940,300,56,24,26.667)+`<div class="n-resurrect-option ${can?'':'n-disabled'}">${C('Enter','A','부활','resurrect',1034,940,300,56,24,26.667)}</div>`+I('W_Death_ChoiceDivider_2x32',959,950,2,32)+I('W_Death_FocusLine_64x2',can?1152:704,994,64,2)+T(can?'':model.s.resurrectionLocked?'부활 잠김 · 인살 또는 적 처치로 다시 활성화':'남은 부활 자원이 없습니다.',560,1002,800,16,false,'#dededf','n-center')+I('W_HP_Frame',140,944,320,24,.5)+T('0 / '+model.maxHP,140,946,320,14.667,false,'white','n-center')+T('회복 '+model.s.healCharges+'   ◁ '+itemInfo().name+' ▷',1535,946,320,14.667,false,'white');
  return shell(out,1920,'n-death '+(final?'n-final-death':'n-downed'));
 }
 function rest(){
  if(ui.activation)return shell(T('BONFIRE ACTIVATED',0,495,1920,56,false,'#f3d994','n-center n-activation'),1920,'n-activation-screen');
  if(!model.s.bonfires.includes(ui.currentFire))return hud(true,'화톳불 활성화');
  const fire=model.destinations.find(d=>d.id===ui.currentFire)||model.destinations[0],travel=ui.restPage==='travel';
  let left=T(fire.name,100,128,600,15)+T(travel?'이동':'REST',100,180,650,34,true)+I('W_Rest_DecorativeLine_64x4',100,242,28,3)+T(travel?'활성화한 목적지를 선택하고 이동을 확정하세요.\nChapter를 펼쳐 Sector별 목적지를 확인하세요.':'이곳에서 몸을 회복하고, 다음 여정을 준비합니다.',100,278,460,21);
  let right='';
  if(!travel){left+=[['휴식','rest-again','rest'],['이동','rest-travel','travel'],['강화','rest-upgrade','upgrade'],['떠나기','rest-leave','leave']].map(([n,a,id],i)=>B(h(n),a,122,370+i*62,324,57,ui.restOption===id,'rest-option:'+id,'n-rest-option')+(ui.restOption===id?L(122,370+i*62+51.5,180,1.5,1):'')).join('')+T('휴식을 선택하면 생명력·회복약이 보충되고\n일반 적이 다시 나타납니다.',100,720,440,19)+T('검술과 아이템 장착은 퍼즈 메뉴에서 변경할 수 있습니다.',100,808,440,17);
   [['생명력',`${model.s.hp} / ${model.maxHP}`],['성장 재화',fmt(model.s.currency)],['강화 재료',model.s.materials],['스킬 포인트',model.s.sp]].forEach(([n,v],i)=>{const y=380+i*98;right+=T(n,1482,y,150,24)+T(v,1625,y-2,185,i===2?24:30,true,ink,'n-right')+I('W_Rest_Divider_512x4',1482,y+58,334,3);});
  }else{
   const rows=model.destinations.filter(d=>model.s.bonfires.includes(d.id)),selected=rows.find(d=>d.id===ui.travelSelection)||rows.find(d=>d.id!==model.s.location)||rows[0];if(selected)ui.travelSelection=selected.id;
   let y=0,items='';const row=(d,hub=false)=>{const sel=ui.travelSelection===d.id;items+=B(h(hub?'HUB':d.name),'travel-select:'+d.id,hub?20:68,y,hub?400:360,49,sel,'travel-preview:'+d.id,'n-travel-row')+(sel?L(hub?20:68,y+45,hub?240:254,1.5,1):'');y+=49;if(d.id===model.s.location){items+=T('현재 위치',hub?22:68,y,350,14,false,muted);y+=26;}};
   rows.filter(d=>d.chapter===0).forEach(d=>row(d,true));if(rows.some(d=>d.chapter===0)){items+=L(20,y+16,460,1,.18);y+=51;}
   for(const ch of [...new Set(rows.filter(d=>d.chapter>0).map(d=>d.chapter))].sort((a,b)=>a-b)){
    const expanded=ui.expanded.includes(ch);items+=B((expanded?'▾  ':'▸  ')+`Chapter ${String(ch).padStart(2,'0')}`,'travel-chapter:'+ch,20,y,440,53,false,'','n-travel-row');y+=53;
    if(expanded)for(const d of rows.filter(d=>d.chapter===ch)){items+=T('Sector '+String(d.sector).padStart(2,'0'),50,y+14,380,16,false,muted);y+=40;row(d);}
   }
   left+=P(`<div class="n-travel-scroll"><div style="position:relative;height:${y}px">${items}</div></div>`,78,352,500,475);
   if(selected){const here=selected.id===model.s.location,confirm=ui.nativeTravelConfirm===selected.id;right+=T(selected.chapter===0?'HUB':`Chapter ${String(selected.chapter).padStart(2,'0')} · Sector ${String(selected.sector).padStart(2,'0')}`,1430,290,390,17)+T(selected.name,1430,330,390,30,true)+P(`<div class="n-preview-placeholder">미리보기 이미지</div>`,1430,397,390,220,'n-destination-image')+T(here?'현재 위치':'활성화된 화톳불',1430,641,390,18,true)+T(here?'다른 목적지를 선택하세요.':'이동할 목적지를 확인하세요.',1430,682,390,19);
    if(!here)right+=(confirm?T('선택한 거점으로 이동할까요?',1430,748,390,22,true):'')+B(confirm?'이동 확정':'이동 준비','travel-confirm:'+selected.id,1430,confirm?805:772,390,48,true,'','n-rest-commit');
   }
  }
  left+=L(100,858,348,3,.35)+T(ui.notice||'체크포인트 저장 완료',100,885,650,18);
  if(travel)left+=P(prompt('↑ ↓','D-pad','Chapter · 목적지 선택',27,18),100,975,400,36);
  const foot=C('Enter','A',travel?(ui.nativeTravelConfirm?'이동 확정':'이동 준비'):'결정','activate',1445,975,220,36)+C('Backspace','B',ui.nativeTravelConfirm?'이동 취소':travel?'뒤로':'떠나기',travel?'rest-back':'rest-leave',1685,975,210,36);
  return shell(`<div class="n-rest-side n-rest-left">${I('W_Rest_Fade_Both_1920x1080',0,0,1920,1080)}${left}</div><div class="n-rest-side n-rest-right">${I('W_Rest_Fade_Both_1920x1080',0,0,1920,1080)}${right}${foot}</div>`,1920,'n-rest '+(ui.restLeaving?'n-leaving':''));
 }
 function dialogue(){
  const row=model.dialogueRow(ui.dialogueRow)||D.dialogue[0],choices=model.choices(row);let out='<div class="n-dialogue-feather"></div>';
  if(ui.dialoguePhase==='choice')out+=P(choices.map((c,i)=>B(i===0?`<span>${h(c.Text)}</span>${key('1','LB',32)}`:`${key('3','RB',32)}<span>${h(c.Text)}</span>`,'dialogue-choice:'+i,i===0?0:644,0,596,120,ui.dialogueChoice===i,'dialogue-preview:'+i,'n-dialogue-choice')).join(''),340,836,1240,120);
  else out+=T(row.Speaker,330,818,1260,22.667,false,'#f8f8f3')+B(h(row.Text),'dialogue-next',330,863,1260,76,false,'','n-dialogue-speech')+C('E','A','다음','dialogue-next',1345,964,130,32,25,18.667)+C('Esc','B','닫기','dialogue-close',1505,964,120,32,25,18.667);
  return shell(out,1920,'n-dialogue');
 }
 function shop(){
  const r=D.shop.find(r=>r.Name===ui.shop)||D.shop[0],status=model.shopStatus(r.Name),bought=model.s.shopPurchases[r.Name]||0;
  return shell(T('P R O J E C T S S',48,33,250,14,true)+T('수집가 · 교환 상점',260,34,360,12,false,muted)+T(`수집품 교환가치  ${model.s.collectibles}     강화 재료  ${model.s.materials}`,760,32,475,15)+T('상점',48,109,400,30,true)+T('발견한 수집품을 필요한 물건으로 교환합니다.',48,165,1000,14,false,muted)+L(48,209,1184,1,.65)+D.shop.map((r,i)=>B(h(r.DisplayName),'shop-select:'+r.Name,48,265+i*60,275,40,ui.shop===r.Name,'shop-select:'+r.Name,'n-shop-row')+(ui.shop===r.Name?L(48,305+i*60,275,1,1):'')).join('')+I(r.Icon,355,282,265,265,.8)+P(`<h2>${h(r.DisplayName)}</h2><p>${h(r.Description)}</p><div class="n-shop-counts">교환가치   ${r.Price}<br><br>남은 재고   ${status.left} / ${r.Stock}</div><button data-action="shop-confirm" data-nav class="n-button n-flow-button" ${status.ok?'':'disabled'}>교환하기  →</button><p>${h(status.ok?'확인 후 수집품 교환가치가 차감됩니다.':status.reason)}</p>`,680,260,552,355,'n-shop-detail n-details')+T('수집품은 상점에서 교환합니다.\n성장 재화와 강화 재료는\n화톳불에서 강화에 사용합니다.',48,557,500,12,false,muted)+L(48,644,1184,1,.65)+C('Backspace','B','떠나기','shop-back',48,662,230,35,19,13.333)+P(prompt('↑','D-pad','상품 선택',19,13.333),300,662,230,35)+C('Enter','A','교환','shop-confirm',1090,662,140,35,19,13.333),1280,'n-flat-paper');
 }
 function upgrade(){
  const roots=D.upgrades.filter(r=>r.Category===ui.upgradeCategory&&r.TreeParent==='None').sort((a,b)=>ui.upgradeCategory==='Item'?['Ice','Clone','BrainWash'].indexOf(a.Name)-['Ice','Clone','BrainWash'].indexOf(b.Name):a.Order-b.Order);
  if(!roots.some(r=>r.Name===ui.upgradeRoot))ui.upgradeRoot=roots[0].Name;const root=model.row(ui.upgradeRoot),r=model.row(ui.upgradeNode)||root,tree=ui.upgradeCategory==='Item',level=model.level(r.Name),status=model.upgradeStatus(r.Name);
  const cats=[['Weapon','무기'],['Body','신체'],['SwordArt','검술'],['Healing','회복'],['Item','아이템']];
  let out=T('P R O J E C T S S',48,33,250,14,true)+T('화톳불',230,35,350,11,false,muted)+T(`성장 재화  ${fmt(model.s.currency)}      강화 재료  ${model.s.materials}      SP  ${model.s.sp}`,720,33,510,13)+T('강화',48,109,270,30,true)+cats.map(([id,n],i)=>B(n,'upgrade-category:'+id,415+i*151,111,130,44,ui.upgradeCategory===id,'','n-upgrade-tab')+(ui.upgradeCategory===id?L(415+i*151,143,110,1.5,1):'')).join('')+C('Q','LB','‹','upgrade-prev',342,111,60,30,19,13.333)+C('E','RB','›','upgrade-next',1210,111,60,30,19,13.333)+L(48,174,1184,1,.65);
  out+=roots.map((row,i)=>B(h(row.DisplayName),'upgrade-root:'+row.Name,48,229+i*60,245,40,row.Name===root.Name,'upgrade-root:'+row.Name,'n-upgrade-row')+T(model.available(row.Name)?'+'+model.level(row.Name):'미습득',230,235+i*60,63,12,false,muted,'n-right')+(row.Name===root.Name?L(48,270+i*60,227,1,1):'')).join('');
  out+=T('강화: 성장 재화 + 강화 재료\n색상 능력: 보스 처치로 획득',48,552,255,11,false,muted)+L(48,644,1184,1,.65)+C('Backspace','B','돌아가기','upgrade-back',48,662,240,35,19,13.333)+P(prompt('↑','D-pad','항목 이동',19,13.333),310,662,230,35)+C('Enter','A','결정','activate',1100,662,130,35,19,13.333);
  if(tree)out+=treeView(root);else out+=I(root.Icon,365,268,240,240,.7);
  const bodyWidth=tree?315:535;
  let detail=`<div class="n-upgrade-caption">강화 단계 ${level} / ${r.Steps.length}</div><h2>${h(r.DisplayName)}  +${level}</h2><p>${h(tree&&r.TreeParent==='None'?'색상 보스를 처치하면 자동으로 획득합니다. 획득 후 가운데 노드에서 능력을 강화할 수 있습니다.':r.Description)}</p>`;
  if(tree&&r.TreeParent==='None')detail+=`<p>${h(model.available(r.Name)?'획득 완료 · 가운데 강화 노드를 선택하세요.':model.requirement(r.Name))}</p>`;
  else{const summary=n=>E.upgradeSummary(r,n).map(([a,b])=>a+'  '+b).join('\n');detail+=`<div class="n-upgrade-comparison"><span>${h(summary(level))}</span><span>→</span><strong>${h(level>=r.Steps.length?'MAX':summary(level+1))}</strong></div>`;
   if(!model.available(r.Name))detail+=`<p>${h(model.requirement(r.Name))}</p>`;else if(status.kind==='max')detail+='<div>최대 강화에 도달했습니다.</div>';else{const cost=status.step;detail+=`<div class="n-upgrade-costs">성장 재화  ${fmt(cost.Currency)}   / 보유 ${fmt(model.s.currency)}<br><br>강화 재료  ${cost.Materials}   / 보유 ${model.s.materials}</div><button data-action="upgrade-confirm" data-nav class="n-button n-flow-button" ${status.ok?'':'disabled'}>강화하기  →</button><p>${h(status.ok?'확인 전에는 자원이 소모되지 않습니다.':status.reason)}</p>`;}
  }
  return shell(out+P(detail,tree?900:677,215,tree?332:555,415,'n-upgrade-details n-details'),1280,'n-flat-paper');
 }
 function treeView(root){
  const nodes=D.upgrades.filter(r=>r.TreeParent===root.Name),x0=310,y0=215;let out=T(root.DisplayName+' 계열',x0+15,y0,270,18.667)+T('← → 강화 노드 선택',x0+15,y0+33,190,14.667)+I(ui.upgradeNode===root.Name?'W_TreeNode_Selected':'W_TreeNode_Default',x0+218,y0+42,64)+I(root.Icon,x0+233,y0+57,34)+B('','upgrade-node:'+root.Name,x0+218,y0+42,64,64,false,'','n-grid-hit')+T(root.DisplayName,x0+293,y0+47,160,24,true)+T(model.available(root.Name)?'습득 완료':'보스 처치로 해금',x0+293,y0+77,190,16,false,muted)+L(x0+250,y0+106,1,56,.5)+L(x0+95,y0+162,310,1,.5);
  nodes.forEach((r,i)=>{const x=x0+65+155*i;out+=L(x+30,y0+162,1,51,.5)+I(ui.upgradeNode===r.Name?'W_TreeNode_Selected':model.level(r.Name)>0?'W_TreeNode_Learned':'W_TreeNode_Default',x,y0+213,60)+I(r.Icon,x+16,y0+229,28)+B('','upgrade-node:'+r.Name,x,y0+213,60,60,false,'upgrade-node:'+r.Name,'n-grid-hit')+T(r.DisplayName,x-36,y0+282,132,20,ui.upgradeNode===r.Name,ink,'n-center')+T(`Lv ${model.level(r.Name)} / ${r.Steps.length}`,x-20,y0+314,100,16,false,muted,'n-center')+L(x+30,y0+340,1,25,.5)+I('W_TreeNode_Default',x+14,y0+365,32)+(model.level(r.Name)>0?'':I('I_Lock',x+22,y0+373,16))+T(model.level(r.Name)>0?'다음 단계':'미해금',x-20,y0+405,100,13.333,false,muted,'n-center');});return out;
 }
 function slots(){
  const chosen=model.state.slots[ui.slot],s=chosen?.data,d=model.destinations.find(d=>d.id===s?.location);let out=I('W_Rest_Fade_Both_1920x1080',0,0,1920,1080)+T('PROJECTSS',90,67,500,17.333,true,ink,'n-loading-brand')+T(ui.saving?'SAVE GAME':'LOAD GAME',90,165,1000,56,true)+T(ui.saving?'진행 상황을 저장할 슬롯을 선택하세요.':'이어갈 여정을 선택하세요.',90,244,1000,26.667,false,'#4d4d4d');
  model.state.slots.forEach((slot,i)=>{const y=365+165*i,sel=ui.slot===i,place=model.destinations.find(d=>d.id===slot?.data.location);out+=B('',`slot:${i}`,90,y,1000,135,sel,'slot:'+i,'n-slot-hit')+T(`SLOT ${String(i+1).padStart(2,'0')}`,90,y+10,250,37.333,sel,ink)+T(place?.name||'빈 슬롯',360,y+8,440,29.333,sel,ink)+(slot?T(`Chapter ${String(slot.data.chapter).padStart(2,'0')}`,360,y+58,440,22.667,false,'#4d4d4d')+T('플레이 시간  '+Math.floor(slot.data.playSeconds/60)+'분',815,y+12,300,21.333,false,'#4d4d4d')+T(new Date(slot.at).toLocaleString('ko-KR'),815,y+54,300,21.333,false,'#4d4d4d'):'')+L(90,y+117,1000,1.5,sel?.85:.15);});
  out+=L(1158,247,1,630,.12)+T('선택한 저장 데이터',1225,245,605,20,false,'#4d4d4d')+P(d?`<img src="${h(d.image)}" alt="저장 거점 미리보기">`:`<span>${ui.saving?'새 저장 데이터':'저장 데이터 없음'}</span>`,1225,287,605,340,'n-save-preview')+T(d?.name||(ui.saving?'새 저장 데이터':'저장 데이터 없음'),1225,654,605,40,true)+(s?T(`Chapter ${String(s.chapter).padStart(2,'0')}`,1225,710,605,24,false,'#4d4d4d')+T('Lv. 1    |    플레이 시간 '+Math.floor(s.playSeconds/60)+'분',1225,765,605,24,false,'#4d4d4d'):'')+(ui.nativeOverwrite?T('이 슬롯의 기존 진행을 덮어씁니다. 저장할까요?',1225,805,605,20,true):'')+B(ui.saving?(ui.nativeOverwrite?'덮어쓰고 저장':'저장하기'):'불러오기','slot-commit',1225,861,605,60,true,'','n-slot-commit')+(!ui.saving&&chosen?C('Del','X','저장 삭제','slot-delete',1225,930,605,42):'')+T(ui.saving?'사용 중인 슬롯을 선택하면 덮어쓰기 확인이 필요합니다.':'저장된 진행 상황을 선택해 불러올 수 있습니다.',90,980,950,18.667,false,'#4d4d4d')+C('Enter','A',ui.saving?'저장':'불러오기','slot-commit',1430,975,210,40)+C('Backspace','B','뒤로','slots-back',1670,975,210,40);
  return shell(out,1920,'n-save');
 }
 function hud(interact=false,label=''){
  const fg=N.theme.hud_foreground.css,scale=N.theme.hud_scale;let out=`<div class="n-hud-left" style="color:${fg}"><div class="n-health-feather"></div>${P(`<div class="n-art-ring">${I(model.s.swordArt==='KatanaLeap'?'I_CrossSlash':'I_DashAttack',22,22,60,60,1,'n-hud-tint')}</div>`,50,944,104,104)}${P(Array.from({length:2},(_,i)=>`<i class="n-revive ${i>=model.s.resurrections?'n-spent':''}"></i>`).join(''),174,922,150,38)}<div class="n-hp-layer" style="${at(177,982,372,24)}"><i data-hp-trail style="background:${N.theme.hud_health_damage_color.css}"></i><i data-hp-fill style="background:${N.theme.hud_health_color.css}"></i></div>${I('W_HP_Frame',174,979,378,30,1,'n-hud-tint')}<div class="n-hud-text n-center" data-hp-value style="${at(177,981,372,26)}font-size:22px">${model.s.hp} / ${model.maxHP}</div></div>`;
  out+=`<div class="n-hud-right" style="color:${fg}"><div class="n-item-feather"></div>${I('I_Heal',1566,899,68,80,1,'n-hud-tint')}${T('회복',1540,865,120,22,true,fg,'n-center n-hud-text')}${T(model.s.healCharges,1540,981,120,24,true,fg,'n-center n-hud-text')}${L(1680,898,1,88,.5)}${I(model.s.item==='Ice'?'I_Ice':model.s.item==='Clone'?'I_Clone':'I_MindControl',1740,899,72,80,1,'n-hud-tint')}${T('스킬',1716,865,120,22,true,fg,'n-center n-hud-text')}${B(I('I_Chevron_Left',0,0,22,22,1,'n-hud-tint'),'cycle-item:-1',1700,927,22,22,false,'','n-grid-hit')}${B(I('I_Chevron_Right',0,0,22,22,1,'n-hud-tint'),'cycle-item:1',1830,927,22,22,false,'','n-grid-hit')}${T(itemInfo().name,1686,981,180,22,true,fg,'n-center n-hud-text')}<div class="n-hud-text n-center" data-item-cooldown style="${at(1686,1015,180,24)}font-size:18px"></div>${P(['Ice','BrainWash','Clone'].map(id=>`<i class="n-item-dot ${model.s.item===id?'n-on':''}"></i>`).join(''),1740,1046,80,12)}</div>`;
  if(model.s.posture>0)out+=`<div class="n-posture-track" style="${at(690,1004,540,8)}background:${N.theme.hud_posture_track.css}"><i data-posture-fill></i></div>${I('W_Posture_Frame',688,1001,544,14,1,'n-hud-tint')}${I('W_Posture_CenterTick',958,995,4,26,1,'n-hud-tint')}`;
  if(ui.showBoss)out+=T(ui.bossColor.toUpperCase()+' / '+({Blue:'푸른 수문장',Green:'녹색 군주',Red:'붉은 군주',Black:'검정의 왕'})[ui.bossColor],510,96,900,22,true,fg,'n-center n-hud-text')+`<div class="n-boss-track" style="${at(520,148,880,8)}"><i data-boss-health></i></div><div class="n-posture-track" style="${at(520,189,880,7)}background:${N.theme.hud_posture_track.css}"><i data-boss-posture></i></div>`;
  if(ui.stealth!=='none'){const hidden=['hidden','search'].includes(ui.stealth),color=ui.stealth==='hidden'?N.theme.hud_stealth_concealed_color.css:ui.stealth==='spotted'?N.theme.hud_stealth_spotted_color.css:N.theme.hud_stealth_warning_color.css;out+=P(`<svg viewBox="0 0 64 42" style="color:${color}" aria-label="${hidden?'은신 중':'노출됨'}"><path d="M17 21Q32 33 47 21${hidden?'M23 25l-3 5M32 27v5M41 25l3 5':'M17 21Q32 9 47 21M35 21a3 3 0 1 0-6 0a3 3 0 1 0 6 0'}"/></svg>`,924,936,72,42,'n-stealth');}
  if(ui.aware)out+=`<svg class="n-awareness" viewBox="0 0 50 50" style="${at(1160,450,50,50)}"><defs><clipPath id="n-aware-clip"><path d="M25 3 48 46H2Z"/></clipPath></defs><rect x="0" y="44" width="50" height="50" data-awareness-fill clip-path="url(#n-aware-clip)" fill="#efe4bb"/><path d="M25 3 48 46H2Z" fill="none" stroke="#f7edc7" stroke-width="2"/></svg>`;
  if(ui.lock)out+=I(ui.executionReady?'I_Execution':'I_LockOn',1140,480,40,40,1,ui.executionReady?'':'n-hud-tint');
  if(ui.dangerUntil>performance.now())out+=I('I_Perilous',912,400,96,96,1,'n-danger');
  if(interact)out+=C('E','X',label,'interact',740,788,500,64,30,24);
  if(model.state.settings.guide)out+=P(guide(),0,0,1920,1080,'n-guide-wrap');
  return shell(out,1920,'n-hud');
 }
 function boss(){
  if(ui.world==='white')return shell(C('E','X','빛에 손을 뻗는다','black-start',720,788,500,64,30,24),1920,'n-white-interact');
  if(ui.world==='hub-orb'){const ready=['Blue','Green','Red'].every(c=>model.s.erased.includes(c));return shell(`<div class="hub-orb ${ready?'white':''}"></div><div class="orb-lights">${['Blue','Green','Red'].map(c=>`<i class="orb-light ${c.toLowerCase()} ${model.s.erased.includes(c)?'on':''}"></i>`).join('')}</div>`+C('E','X',ready?'흰빛에 닿는다':'세 빛을 모아야 합니다','orb-interact',720,788,500,64,30,24),1920,'n-orb');}
  return hud()+ (ui.banner?shell(`<div class="n-color-banner">${T(ui.bossColor==='Black'?'DARKNESS ERASED':'COLOR ERASED',0,465,1920,69.333,false,'#fff7e4','n-center')}${T(ui.bossColor.toUpperCase(),0,574,1920,24,true,ui.bossColor==='Blue'?'#6fb5ff':ui.bossColor==='Green'?'#58e875':'#ff6256','n-center')}</div>`,1920,'n-banner-layer'):'')+(ui.blackTransition?'<div class="black-transition"></div>':'');
 }
 function guide(){
  const mappings={IA_Move:['WASD / ↑↓←→','LS'],IA_MouseLook:['Mouse','RS'],IA_Attack:['LMB','RB'],IA_Guard:['RMB','LB'],IA_DodgeRun:['Alt','B'],IA_CycleSwordArt:['3','Menu'],IA_Crouch:['C','LS click'],IA_Walk:['Shift','LS'],IA_Jump:['Space','A'],IA_TargetLock:['Q','RS click'],IA_TargetSwitch:['Wheel ↑ / ↓','RS'],IA_Heal:['H','D-pad ↑'],IA_Hook:['G','LT'],IA_Interact:['E','X'],IA_SpecialAttack:['F','RT'],IA_Menu:['Esc','Menu'],IA_ToggleDebug:['F3','View'],IA_ToggleControlsGuide:['F1','Y'],IA_ToggleWeaponStance:['T','—'],IA_CycleItem:['2','D-pad ↓']};
  const pad=ui.device==='pad',rows=N.guide.map(r=>{const m=mappings[r.action]||['—','—'];let label=r.label,hint=r.hint;if(pad&&r.action==='IA_Walk')hint='스틱을 조금 기울이기';if(pad&&r.action==='IA_CycleSwordArt'){label='검술 장착';hint='메뉴에서 기술 선택';}const icons=key(m[0],m[1],28)+(r.chord_action?' + '+key('RMB','LB',28):'')+(pad&&r.action==='IA_CycleSwordArt'?' → 검술':'');return `<div class="n-guide-row"><div><span>${h(label)}</span>${hint?`<small>${h(hint)}</small>`:''}</div><div>${icons}</div></div>`;}).join('');
  return `<aside class="n-controls-guide"><h2>조작 안내 · ${pad?'패드':'키보드 / 마우스'}</h2>${rows}</aside>`;
 }
 function enemy(){
  const f=ui.form,presets=[['Katana','카타나','빠른 검술 · 가드 / 패링'],['Nodachi','노다치','긴 리치 · 묵직한 공방'],['Giant Golem','거대 골렘','대형 보스 · 범위 공격 / 잡기'],['Double Axe','쌍도끼','양손 연계 · 높은 체간 피해'],['Sword & Shield','검 · 방패','방패 방어 · 검 연계'],['Spear','창','긴 사거리 · 투척 / 회수'],['Wild Monster','야수형 몬스터','할퀴기 · 연속 공격 · 회전 공격']];
  const field=(n,id,type='number')=>`<label>${n}<input type="${type}" data-enemy-field="${id}" value="${h(f[id]??'')}" ${type==='number'?'min="1" max="1000000"':''}></label>`,toggle=(id,n,def=false)=>`<label class="n-editor-toggle"><input type="checkbox" data-enemy-check="${id}" ${f[id]===undefined?def?'checked':'':f[id]?'checked':''}>${n}</label>`;
  return shell(`<section class="n-editor-dialog"><header><h2>적 만들기</h2><p>프리셋을 고르고 이름과 전투 스타일을 정한 뒤, 바로 레벨에 배치하세요.</p></header><main><div class="n-editor-presets">${presets.map(([id,n,d])=>`<button data-action="enemy-preset:${id}" class="${f.preset===id?'n-current':''}"><b>${n}</b><small>${d}</small></button>`).join('')}</div><button class="n-editor-source" disabled>선택한 적 BP를 기반으로 만들기</button><div class="n-editor-fields"><div>${field('적 이름','name','text')}<div class="n-editor-numbers">${field('체력 HP','hp')}${field('체간','posture')}</div><label>방어 스타일</label><div class="n-editor-defense">${['공방형','균형형','수비형','패링형'].map(n=>`<button data-action="enemy-defense:${n}" class="${(f.defense||'공방형')===n?'n-current':''}">${n}</button>`).join('')}</div><p>막기 · 패링 · 회피 확률은 선택한 방어 스타일에 따라 적용됩니다.</p></div><div><label>선택 기능</label>${toggle('boss','보스 HUD 사용')}${toggle('footwork','좌우로 움직이며 간보기',true)}${toggle('draw','플레이어를 인지하면 발도',true)}${toggle('revives','부활 사용')}${f.revives?field('부활 횟수','reviveCount')+field('부활 체력 (%)','reviveHP'):''}</div></div><button class="n-editor-source" data-action="enemy-advanced">${ui.enemyAdvanced?'추가 설정 접기':'추가 설정 열기 · 무기 / 감지 / 순찰 / 저장 위치'}</button>${ui.enemyAdvanced?`<div class="n-editor-fields">${field('에셋 이름','asset','text')}${field('저장 위치','folder','text')}${field('스케일','scale')}${toggle('patrol','순찰 사용')}${field('경험치 보상','xp')}</div>`:''}</main><section class="n-editor-files"><b>생성될 파일</b><p>/Game/Stickman/Characters/Enemy/Custom/BP_CustomEnemy<br>/Game/Stickman/Data/Enemies/Custom/DA_CustomEnemy</p></section><footer>${toggle('place','현재 레벨에 바로 배치',true)}<button data-action="enemy-back">취소</button><button class="n-current" data-action="enemy-create">${f.place===false?'적 만들기':'만들기 · 레벨 배치'}</button></footer>${model.state.enemyDrafts.length?`<div class="n-editor-result">생성 목록 ${model.state.enemyDrafts.length}개 · HTML 체험 초안 <button data-action="enemy-export">설정 JSON 저장</button></div>`:''}</section>`,1280,'n-editor-shell');
 }
 function debug(){
  const page=ui.debugPage,groups={enemy:'Enemy',combat:'Combat',notifies:'Animation',other:'Other',output:'Output'},rows=(N.debugControls||[]).filter(r=>r.page===groups[page]);
  const d=model.state.debug,check=(id,n)=>`<label class="n-debug-check"><input type="checkbox" data-debug="${h(id)}" ${d[id]?'checked':''}><span>${h(n)}</span></label>`;
  return hud()+shell(`<div class="n-debug-shade"></div><div class="n-debug-modal"><h2>디버그 설정</h2><p>확인할 항목만 선택하세요. 창을 닫아도 선택한 표시는 유지됩니다.</p><div class="n-debug-master">${check('master','디버그 전체 표시')}<span>${d.master?'표시 ON':'표시 OFF · 선택 상태 보존'}</span></div><div class="n-debug-presets">${['모두 끄기','적 이동만','피격 · 판정만'].map((n,i)=>`<button data-action="debug-preset:${['off','enemy','combat'][i]}" class="n-debug-button">${n}</button>`).join('')}</div><div class="n-debug-columns"><nav>${[['enemy','적 AI'],['combat','전투'],['notifies','노티파이'],['other','기타'],['output','출력']].map(([id,n])=>`<button data-action="debug-page:${id}" class="n-debug-button ${id===page?'n-current':''}">${n}</button>`).join('')}</nav><div class="n-debug-scroll">${rows.map(r=>check(r.id,r.label)).join('')}</div></div><p>체크하면 필요한 상위 항목도 켜집니다. 전체 OFF는 선택만 유지합니다.</p><footer>${prompt('Esc','B','닫기',24,16)}<button data-action="debug-close" class="n-debug-button">닫고 확인</button></footer></div>`,1920,'n-debug');
 }
 function modal(m){
  if(!m)return '';
  if(m.kind==='reward'||m.kind==='gift'){const id=({Blue:'Ice',Green:'BrainWash',Red:'Clone'})[m.color],name=m.kind==='gift'?'수집가의 선물':D.colorRewards?.[m.color]?.name||'검정의 잔광',icon=m.kind==='gift'?'I_Crystal':id==='Ice'?'I_Ice':id==='BrainWash'?'I_MindControl':id==='Clone'?'I_Clone':'I_KeyItem';return shell(`<div class="n-reward-shade"></div>`+T('색의 잔재 획득',545,275,900,26.667)+I(icon,550,390,120)+T(name,740,390,680,48,true)+T(m.kind==='gift'?'강화 재료 1개를 받았습니다.':D.colorRewards?.[m.color]?.description||'색의 힘을 획득했습니다.',740,480,650,26.667)+L(545,650,830,1,.2)+C('Enter','A','닫기','modal-confirm',1030,715,350,55,27,24),1920,'n-modal-root');}
  if(m.kind==='delete'){const data=model.state.slots[m.slot]?.data,place=model.destinations.find(d=>d.id===data?.location);return shell(`<div class="n-delete-shade"></div>`+T('저장 데이터를 삭제할까요?',535,350,850,45.333,true)+T(`SLOT ${String(m.slot+1).padStart(2,'0')}   ·   ${place?.name||'저장 데이터'}`,535,435,850,28)+T('이 슬롯의 진행 상황이 삭제됩니다. 삭제한 데이터는 복구할 수 없습니다.',535,492,850,22.667)+B('취소','modal-cancel',535,600,350,85,ui.modalIndex===0,'','n-delete-choice')+B('삭제','modal-confirm',965,600,350,85,ui.modalIndex===1,'','n-delete-choice')+C('Enter','A','선택','activate',535,730,300)+C('Backspace','B','취소','modal-cancel',965,730,300),1920,'n-modal-root');}
  if(m.kind==='title')return nativePaper(T('타이틀로 돌아가기',100,255,1000,34,true)+T('타이틀로 돌아갈까요?',100,420,1000,30,true)+T('진행 내용을 저장한 후 타이틀 화면으로 돌아갑니다.',100,480,1100,20)+B('돌아가기','modal-cancel',100,580,350,46,ui.modalIndex===0,'','n-menu-button')+B('타이틀로 돌아가기','modal-confirm',100,650,500,46,ui.modalIndex===1,'','n-menu-button'));
  if(m.kind==='upgrade'&&ui.upgradeCategory==='Item'){const r=model.row(m.id),parent=model.row(r.TreeParent),s=r.Steps[m.expected];return shell(L(400,250,480,1,.65)+T('강화할까요?',415,278,430,24,true)+T(`${parent?.DisplayName||''} · ${r.DisplayName} 강화`,415,321,440,18,false,muted)+T('현재 단계',415,380,250,16)+T('Lv '+m.expected,830,380,70,17)+T('강화 후',415,415,250,16)+T('Lv '+(m.expected+1),830,415,70,17,true)+T('성장 재화',415,460,230,16)+T(`${s.Currency} / 보유 ${model.s.currency}`,690,460,220,16)+T('강화 재료',415,495,230,16)+T(`${s.Materials} / 보유 ${model.s.materials}`,690,495,220,16)+L(400,550,480,1,.65)+C('Enter','A','강화','modal-confirm',555,590,150,35,19,14.667)+C('Backspace','B','취소','modal-cancel',720,590,180,35,19,14.667),1280,'n-flat-paper n-modal-root');}
  let caption='',title='',body='',confirm='확인';
  if(m.kind==='purchase'){const r=D.shop.find(r=>r.Name===m.id);caption='교환 확인';title=r.DisplayName;body=`수집품 교환가치 ${r.Price}를 사용합니다.`;confirm='교환';}
  else if(m.kind==='upgrade'){const r=model.row(m.id);caption='강화 확인';title=`${r.DisplayName}  +${m.expected} → +${m.expected+1}`;body=E.upgradeSummary(r,m.expected).map(x=>x.join('  ')).join('\n')+'\n\n↓\n\n'+E.upgradeSummary(r,m.expected+1).map(x=>x.join('  ')).join('\n')+`\n\n성장 재화  ${r.Steps[m.expected].Currency}       강화 재료  ${r.Steps[m.expected].Materials}`;confirm='강화';}
  else if(m.kind==='reset'){caption='시안 초기화';title='HTML 체험 데이터를 초기화할까요?';body='이 브라우저의 시안 저장 상태만 초기화합니다.';confirm='초기화';}
  else return null;
  return shell(`<div class="n-modal-dim"></div><section class="n-native-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><small>${h(caption)}</small><h2 id="modal-title">${h(title)}</h2><p>${h(body)}</p><footer><button data-action="modal-cancel" class="n-button n-card-button">취소  / ${m.kind==='purchase'?'Backspace · B':'B'}</button><button data-action="modal-confirm" class="n-button n-card-button n-selected">${confirm}  / Enter · A</button></footer></section>`,1280,'n-modal-root');
 }
 function update(){
  const each=(s,fn)=>document.querySelectorAll(s).forEach(fn),frac=model.s.hp/model.maxHP,posture=model.s.posture/model.maxPosture;
  each('[data-hp-fill]',e=>e.style.width=frac*100+'%');each('[data-hp-trail]',e=>e.style.width=ui.trail/model.maxHP*100+'%');each('[data-hp-value]',e=>e.textContent=`${model.s.hp} / ${model.maxHP}`);
  const postureColor=f=>{const a=N.theme.hud_posture_low_color.linear,b=N.theme.hud_posture_high_color.linear;const conv=v=>Math.round((v<=.0031308?12.92*v:1.055*v**(1/2.4)-.055)*255);return `rgb(${a.slice(0,3).map((v,i)=>conv(v+(b[i]-v)*f)).join(',')})`;};
  each('[data-posture-fill]',e=>{e.style.width=posture*100+'%';e.style.background=postureColor(posture);});each('[data-boss-health]',e=>{e.style.width=ui.bossHP*100+'%';e.style.background=N.theme.hud_boss_health_color.css;});each('[data-boss-posture]',e=>{e.style.width=ui.bossPosture*100+'%';e.style.background=postureColor(ui.bossPosture);});each('[data-item-cooldown]',e=>e.textContent=ui.itemCooldown>0?ui.itemCooldown.toFixed(1)+' s':'');each('[data-awareness-fill]',e=>e.setAttribute('y',46*(1-ui.awareness)));if(ui.dangerUntil<=performance.now())each('.n-danger',e=>e.remove());
 }
 function action(command){
  if(command==='enemy-advanced'){ui.enemyAdvanced=!ui.enemyAdvanced;render();return true;}
  if(command.startsWith('enemy-defense:')){ui.form.defense=command.split(':')[1];render();return true;}
  if(command==='quit'){ui.mainPage='quit';render();return true;}
  if(command.startsWith('travel-select:')){if(!ui.nativeTravelConfirm){ui.travelSelection=command.split(':')[1];render();}return true;}
  if(command==='rest-travel'){if(!model.s.bonfires.includes(ui.currentFire))return true;ui.restPage='travel';ui.nativeTravelConfirm=null;const dest=model.destinations.find(d=>d.id!==model.s.location&&model.s.bonfires.includes(d.id));if(dest){ui.travelSelection=dest.id;if(!ui.expanded.includes(dest.chapter))ui.expanded.push(dest.chapter);}go('rest');return true;}
  if(command==='rest-back'&&ui.nativeTravelConfirm){ui.nativeTravelConfirm=null;render();return true;}
  if(command.startsWith('travel-confirm:')){const id=command.split(':')[1];if(id===model.s.location)return true;if(ui.nativeTravelConfirm!==id){ui.nativeTravelConfirm=id;render();}else if(model.travel(id)){ui.nativeTravelConfirm=null;persist();startLoading(id,'hud');}return true;}
  if(command==='slot-commit'&&ui.saving&&model.state.slots[ui.slot]){const old=model.state.slots[ui.slot];if(ui.nativeOverwrite!==old.id){ui.nativeOverwrite=old.id;render();}else{model.save(ui.slot);ui.nativeOverwrite=null;persist();afterSaving();}return true;}
  if(command==='slots-back'&&ui.nativeOverwrite){ui.nativeOverwrite=null;render();return true;}
  if(command==='upgrade-confirm'&&ui.upgradeCategory==='Item'&&model.row(ui.upgradeNode)?.TreeParent==='None')return true;
  return false;
 }
 return {views:{main,pause,hud:()=>hud(),rest,loading,death,dialogue,shop,upgrade,slots,boss,debug,enemy},key,modal,update,action};
};
