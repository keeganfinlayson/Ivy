/* Mochi Munch interface v0.16 — scrollable scene with protected queue formation. */
import {STATES,LOCATIONS} from './game-core.js';
import {Restaurant,SAVE_KEY,convertLegacy} from './restaurant-v3.js';
import {INGREDIENTS} from './recipes.js';
import {SPECIES,SHOP_CATALOG,FURNITURE_COLORS,ACHIEVEMENTS,dateKey,itemById,guestLabel} from './game-content.js';
import {characterSVG} from './characters.js';
import {LINE_SPOTS,routeFor,cameraPosition,WORLD_WIDTH} from './scene-layout.js';

const $=id=>document.getElementById(id);
const room=$('room'),viewport=$('roomViewport'),animal=$('animal'),status=$('status');
const OS_REDUCED=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const SETTINGS_KEY='mochi-munch-settings';
function readSave(){try{
 const raw=localStorage.getItem(SAVE_KEY);if(raw)return JSON.parse(raw);
 const legacy=localStorage.getItem('mochi-munch-consolidated-v1');
 return legacy?convertLegacy(JSON.parse(legacy)):null;
}catch{return null}}
const session=new Restaurant(readSave());
let settings={sound:false,reduce:false};try{settings={...settings,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch{}
let view=session.scene==='kitchen'?'kitchen':'cafe',shopTab='ingredients',selectedDecor=null;
let visualPos={...session.customer.position},animating=false,frame=null,flashTimeout=null,audio=null,peekHiddenAt=-1;
const queueElements=new Map();
const reduceMotion=()=>settings.reduce||OS_REDUCED;

function announce(t){status.textContent=t}
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(session.serialize()))}catch{announce('Saving is not available on this device.')}}
function saveSettings(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}catch{}}
function playSound(tone=660){
 if(!settings.sound)return;
 try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
 audio=audio||new Context();const osc=audio.createOscillator(),gain=audio.createGain();
 osc.type='sine';osc.frequency.value=tone;gain.gain.setValueAtTime(.06,audio.currentTime);
 gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.16);
 osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+.16);
 }catch{}
}
function act(fn,tone=550){
 try{const result=fn();playSound(tone);render();persist();return result}
 catch(e){announce(e.message);return null}
}
function mood(c,active=false){
 if(active&&animating)return 'walk';
 if(active&&session.phase==='finished')return session.lastRating>=4?'love':session.lastRating<=2?'yuck':'happy';
 if(c.state===STATES.SLEEPING)return 'sleep';
 if(c.state===STATES.SEATED)return 'idle';
 return 'idle';
}
function renderAnimal(){
 const c=session.customer;if(!c)return;
 animal.innerHTML=characterSVG(c,mood(c,true));
 animal.className='animal '+(animating?'walk':session.phase==='finished'?'eat':c.state===STATES.SEATED?'sit':c.state===STATES.SLEEPING?'sleep':'');
 animal.style.left=(visualPos.x*100)+'%';animal.style.top=(visualPos.y*100)+'%';
 // Keep each queue animal's DOM element so position changes animate smoothly.
 const living=new Set(),layer=$('guestLayer');
 for(const [index,guest] of session.queue.entries()){
  living.add(guest.id);
  let node=queueElements.get(guest.id),isNew=!node;
  if(isNew){
   node=document.createElement('div');node.className='guest';
   node.dataset.guestId=guest.id;
   node.innerHTML=characterSVG(guest,mood(guest));
   node.style.left='34%';node.style.top='69%';
   queueElements.set(guest.id,node);layer.append(node);
  }
  const spot=LINE_SPOTS[index]||LINE_SPOTS[LINE_SPOTS.length-1];
  const move=()=>{if(!queueElements.has(guest.id))return;node.style.left=(spot.x*100)+'%';node.style.top=(spot.y*100)+'%'};
  // First draw is static; later new guests walk into the back of the line.
  if(isNew&&session.served>0&&!reduceMotion())requestAnimationFrame(move);
  else move();
 }
 for(const [id,node] of queueElements){
  if(!living.has(id)){node.remove?.();queueElements.delete(id)}
 }
}
function renderDecor(){
 const layer=$('decorLayer');layer.replaceChildren();
 const editing=view==='decorate';
 layer.classList.toggle('editing',editing);
 for(const decoration of session.game.decorations){
  const item=itemById(decoration.id);if(!item)continue;
  const el=document.createElement('button');el.type='button';el.className='decor-item';
  if(selectedDecor===decoration.id&&editing)el.classList.add('chosen');
  el.style.left=decoration.x*100+'%';el.style.top=decoration.y*100+'%';
  const color=FURNITURE_COLORS.find(c=>c.id===decoration.color)||FURNITURE_COLORS[0];
  el.style.setProperty('--tint',color.hex);
  el.textContent=item.emoji;el.title=item.name;el.setAttribute('aria-label','Move '+item.name);
  el.disabled=!editing;
  el.onclick=()=>{if(!editing)return;selectedDecor=decoration.id;$('colorSelect').value=decoration.color;renderDecor()};
  if(editing){
   let dragging=false;
   el.onpointerdown=e=>{if(e.button!==undefined&&e.button!==0)return;selectedDecor=decoration.id;dragging=true;el.setPointerCapture?.(e.pointerId);el.classList.add('chosen');$('colorSelect').value=decoration.color};
   el.onpointermove=e=>{if(!dragging)return;const bounds=room.getBoundingClientRect();const x=Math.max(.06,Math.min(.94,(e.clientX-bounds.left)/bounds.width)),y=Math.max(.35,Math.min(.92,(e.clientY-bounds.top)/bounds.height));el.style.left=x*100+'%';el.style.top=y*100+'%'};
   el.onpointerup=e=>{if(!dragging)return;dragging=false;const bounds=room.getBoundingClientRect();const x=(e.clientX-bounds.left)/bounds.width,y=(e.clientY-bounds.top)/bounds.height;
 const result=act(()=>session.decorate(decoration.id,x,y,decoration.color));
 if(result)announce(Math.abs(result.x-x)>.03||Math.abs(result.y-y)>.03?'Furniture moved to keep the customer line clear.':'Furniture moved. Choose Done to finish.');
};
   el.onpointercancel=()=>{dragging=false;renderDecor()};
  }
  layer.append(el);
 }
}
function renderWeather(){
 const date=new Date(),weather=(date.getDate()%4===0)?'rain':date.getHours()>=19||date.getHours()<6?'night':'sun';
 $('window').dataset.weather=weather;
 $('weatherCaption').textContent=weather==='rain'?'☂️ Rainy day':weather==='night'?'🌙 Cozy evening':'☀️ Sunny day';
}
function renderRoom(){
 const wall=session.wallpaper;
 room.dataset.wallpaper=wall;
 renderWeather();renderAnimal();renderDecor();
 $('peekKitty').classList.toggle('hidden',session.served<2||session.served%4!==2||session.phase!=='waiting'||peekHiddenAt===session.served);
 const finished=session.phase==='finished';
 $('foodInCafe').classList.toggle('hidden',!finished);
 $('reaction').classList.toggle('hidden',!finished);
 $('hearts').classList.toggle('hidden',!finished||session.lastRating<4);
 if(finished){
  const rating=session.lastRating,bonus=session.lastBonuses||[];
  $('foodInCafe').textContent=session.prepared?.emoji||'🍮';
  $('reaction').replaceChildren();
  const caption=document.createElement('strong');
  caption.textContent=rating>=5?'Love it!':rating===4?'So yummy!':rating===3?'Pretty tasty!':rating===2?'Hmm… a little unusual!':'What a wobbly surprise!';
  const stars=document.createElement('div');stars.className='reaction-stars';stars.textContent='★'.repeat(rating)+'☆'.repeat(5-rating);
  const reward=document.createElement('div');reward.className='reward';reward.textContent=(session.lastReward>=0?'+':'')+session.lastReward+' coins';
  $('reaction').append(caption,stars,reward);
  for(const achievement of bonus){const b=document.createElement('p');b.className='bonus';b.textContent='🏆 '+achievement.name+' +5';$('reaction').append(b)}
 }
 $('currentGuest').textContent=guestLabel(session.customer)+(session.customer.rarity==='rare'?' — rare visitor!':session.customer.rarity==='inspector'?' — Friday Inspector!':'');
 $('guestCount').textContent='Served: '+session.served;
 $('waiting').textContent='Waiting: '+session.queue.map(c=>SPECIES[c.species]?.emoji||'🐾').join(' ');
}
function renderCafeControls(){
 const p=session.phase,c=session.customer;
 $('counterBtn').disabled=animating||p!=='waiting';
 $('seatBtn').disabled=animating||p!=='waiting'||c.state===STATES.SEATED;
 $('sleepBtn').disabled=animating||p!=='waiting'||c.state===STATES.SLEEPING;
 $('kitchenBtn').disabled=animating||p!=='counter';
 $('serveBtn').disabled=animating||p!=='prepared';
 $('nextBtn').disabled=animating||p!=='finished';
 $('outfit').disabled=$('hat').disabled=animating;
 $('outfit').value=c.outfit;$('hat').value=c.headwear;
}
function renderKitchen(){
 const allowed=session.game.unlocked.ingredients;
 const grid=$('ingredients');grid.replaceChildren();
 for(const ingredient of INGREDIENTS){
  if(!allowed.includes(ingredient.id))continue;
  const b=document.createElement('button');b.type='button';b.className='ingredient';b.draggable=true;
  b.dataset.ingredient=ingredient.id;b.innerHTML='<span>'+ingredient.emoji+'</span>'+ingredient.name;
  b.disabled=session.phase!=='counter'||!!session.cooking||session.selected.length>=4;
  b.onclick=()=>act(()=>{session.addIngredient(ingredient.id);announce('Added '+ingredient.name+'!')},550);
  b.ondragstart=e=>e.dataTransfer.setData('text/plain',ingredient.id);
  grid.append(b);
 }
 $('selected').textContent=session.selected.length?session.selected.map(id=>{const i=INGREDIENTS.find(f=>f.id===id);return i.emoji+' '+i.name}).join(' + '):'Nothing in the bowl yet';
 const pieces=$('bowlPieces');pieces.replaceChildren();
 for(const id of session.selected){const item=INGREDIENTS.find(i=>i.id===id);if(!item)continue;const el=document.createElement('span');el.textContent=item.emoji;pieces.append(el)}
 $('bowl').classList.toggle('mixing',session.cooking?.method==='mix');
 const cooking=session.cooking,ready=session.phase==='prepared';
 $('preparation').classList.toggle('hidden',!!cooking||ready);
 $('mixing').classList.toggle('hidden',cooking?.method!=='mix');
 $('baking').classList.toggle('hidden',cooking?.method!=='bake');
 $('discovered').classList.toggle('hidden',!ready);
 $('mixBtn').disabled=$('bakeBtn').disabled=!session.selected.length;
 $('emptyBtn').disabled=!session.selected.length;
 $('stirText').textContent=cooking?.method==='mix'?'Stir '+(cooking.stirs||0)+' / '+(cooking.stirsNeeded||3):'';
 $('stirBtn').textContent='Stir the bowl! '+((cooking?.stirs||0)+1)+'/'+(cooking?.stirsNeeded||3);
 if(cooking?.method==='bake')updateOven();
 if(ready){
  $('dishEmoji').textContent=session.prepared.emoji;
  $('dishName').textContent=session.prepared.name;
 }
 $('mixBtn').textContent=session.hasTool('fast-mixer')?'Fast Mix! 🌀':'Mix ingredients';
 $('bakeBtn').textContent=session.hasTool('sparkly-oven')?'Sparkly Bake! ✨':'Bake in oven';
}
function updateOven(){
 if(session.cooking?.method!=='bake')return;
 const remain=Math.max(0,(session.cooking.duration||1800)-(Date.now()-session.cooking.startedAt));
 $('ovenBtn').disabled=remain>0;
 $('ovenText').textContent=remain>0?'Baking… '+(remain/1000).toFixed(1)+' seconds':'Ding! Open the oven!';
 $('ovenGauge').style.width=(100-Math.min(100,remain/(session.cooking.duration||1800)*100))+'%';
}
function renderShop(){
 document.querySelectorAll('[data-shop]').forEach(b=>{b.classList.toggle('active',b.dataset.shop===shopTab);b.setAttribute('aria-pressed',b.dataset.shop===shopTab)});
 const grid=$('shopItems');grid.replaceChildren();
 for(const item of SHOP_CATALOG.filter(x=>shopTab==='decor'?(x.kind==='furniture'||x.kind==='wallpaper'):x.kind===shopTab)){
  const owned=session.game.unlocked[item.kind].includes(item.id),afford=session.game.coins>=item.price;
  const article=document.createElement('article');article.className='shop-card';
  const icon=document.createElement('div');icon.className='shop-icon';icon.textContent=item.emoji;
  const title=document.createElement('h3');title.textContent=item.name;
  const desc=document.createElement('p');desc.textContent=item.desc;
  const buy=document.createElement('button');buy.textContent=owned?'Owned ✓':'🪙 '+item.price;buy.disabled=owned||!afford;
  buy.onclick=()=>act(()=>{session.purchase(item.id);announce('Purchased '+item.name+'!');playSound(890)},750);
  article.append(icon,title,desc,buy);grid.append(article);
 }
}
function renderDecorPanel(){
 const choices=$('wallpaperSelect');choices.replaceChildren();
 for(const [id,name] of [['default','Original Pink'],...SHOP_CATALOG.filter(i=>i.kind==='wallpaper'&&session.game.unlocked.wallpaper.includes(i.id)).map(i=>[i.id,i.name])]){
  const o=document.createElement('option');o.value=id;o.textContent=name;choices.append(o);
 }
 choices.value=session.wallpaper;
 const furniture=session.game.decorations;
 $('decorHint').textContent=furniture.length?'Drag furniture in the room. Pick a color, then tap Done.':'Buy furniture in the shop to decorate your café.';
 $('colorSelect').disabled=!furniture.length;
 if(!furniture.length){selectedDecor=null}
 else if(!selectedDecor||!furniture.find(d=>d.id===selectedDecor))selectedDecor=furniture[0].id;
 if(selectedDecor){const chosen=furniture.find(x=>x.id===selectedDecor);if(chosen)$('colorSelect').value=chosen.color}
}
function renderAchievements(){
 const grid=$('achievementItems');grid.replaceChildren();
 for(const a of ACHIEVEMENTS){
  const earned=session.game.achievements.includes(a.id);
  const el=document.createElement('div');el.className='achievement '+(earned?'earned':'');
  el.textContent=(earned?'🏆 ':'🔒 ')+a.name+' · '+a.at+' served · +5 coins';
  grid.append(el);
 }
}
function render(){
 $('coins').textContent='🪙 '+session.game.coins;
 $('giftBtn').disabled=session.game.daily.lastGift===dateKey();
 $('giftBtn').textContent=$('giftBtn').disabled?'Daily gift ✓':'🎁 Daily gift';
 $('navKitchen').disabled=animating||!(session.phase==='counter'||session.scene==='kitchen');
 document.body.classList.toggle('low-motion',settings.reduce);
 $('soundBtn').textContent=settings.sound?'🔊 Sound on':'🔈 Sound off';
 $('motionBtn').textContent=settings.reduce?'Motion: reduced':'Motion: normal';
 for(const [name,id] of [['cafe','navCafe'],['kitchen','navKitchen'],['shop','navShop'],['decorate','navDecor'],['achievements','navAchievements']]){
  $(id).classList.toggle('active',view===name);$(id).setAttribute('aria-pressed',String(view===name));
 }
 const showCafe=view==='cafe'||view==='decorate';
 $('cafeScreen').classList.toggle('hidden',!showCafe);
 $('cafeActions').classList.toggle('hidden',view!=='cafe');
 $('wardrobe').classList.toggle('hidden',view!=='cafe');
 $('decorPanel').classList.toggle('hidden',view!=='decorate');
 $('kitchenScreen').classList.toggle('hidden',view!=='kitchen');
 $('shopScreen').classList.toggle('hidden',view!=='shop');
 $('achievementsScreen').classList.toggle('hidden',view!=='achievements');
 renderRoom();renderCafeControls();
 if(view==='kitchen')renderKitchen();
 if(view==='shop')renderShop();
 if(view==='decorate')renderDecorPanel();
 if(view==='achievements')renderAchievements();
}
function followCamera(worldX){
 const width=room.clientWidth||WORLD_WIDTH,viewWidth=viewport.clientWidth||Math.min(width,960);
 viewport.scrollLeft=cameraPosition(worldX,width,viewWidth);
}
function moveTo(target,done,destination=''){
 if(animating)return;
 const start={...visualPos};
 const points=routeFor(start,destination);
 if(!points.length||Math.hypot(points[points.length-1].x-target.x,points[points.length-1].y-target.y)>.001)points.push({...target});
 // Walk via waypoints, following the scene without passing through the standing line.
 const legs=[];let total=0,prev=start;
 for(const end of points){
  const len=Math.hypot((end.x-prev.x)*room.clientWidth,(end.y-prev.y)*room.clientHeight);
  if(len>0.1){legs.push({from:prev,to:end,start:total,end:total+len,length:len});total+=len}
  prev=end;
 }
 animating=true;const duration=reduceMotion()?1:Math.max(280,total/230*1000);let begin=null;
 render();followCamera(start.x);
 function step(t){
  if(begin===null)begin=t;
  const progress=Math.min(1,(t-begin)/duration),distance=progress*total;
  const leg=legs.find(segment=>distance<=segment.end)||legs[legs.length-1];
  if(leg){
   const fraction=Math.max(0,Math.min(1,(distance-leg.start)/leg.length));
   visualPos={x:leg.from.x+(leg.to.x-leg.from.x)*fraction,y:leg.from.y+(leg.to.y-leg.from.y)*fraction};
   animal.style.left=visualPos.x*100+'%';animal.style.top=visualPos.y*100+'%';
   animal.style.setProperty('--walk-direction',leg.to.x<leg.from.x?'-1':'1');
   followCamera(visualPos.x);
  }
  if(progress<1)frame=requestAnimationFrame(step);
  else{
   frame=null;animating=false;
   try{done()}catch(e){announce(e.message)}
   visualPos={...session.customer.position};render();persist();
   followCamera(visualPos.x);
  }
 }
 frame=requestAnimationFrame(step);
}
function moveAction(fn,message){
 try{
  const target=fn();announce(message);
  if(target)moveTo(target,()=>{session.finishMove();announce('Your customer is ready!')},session.pendingMove?.destination);
  else{render();persist()}
 }catch(e){announce(e.message)}
}
function arrive(){
 if(session.phase!=='arriving'||animating)return;
 moveAction(()=>session.planMove('waiting',STATES.WAITING),'A new visitor is arriving!');
}
$('panLeft').onclick=()=>{viewport.scrollLeft=Math.max(0,viewport.scrollLeft-viewport.clientWidth*.8)};
$('panRight').onclick=()=>{viewport.scrollLeft=Math.min(Math.max(0,room.clientWidth-viewport.clientWidth),viewport.scrollLeft+viewport.clientWidth*.8)};
$('counterBtn').onclick=()=>moveAction(()=>session.toCounter(),'Come to the counter!');
$('seatBtn').onclick=()=>moveAction(()=>session.sit(),'Have a seat!');
$('sleepBtn').onclick=()=>moveAction(()=>session.nap(),'Shhh… sleepy customer!');
$('outfit').onchange=()=>act(()=>{session.customer.outfit=$('outfit').value});
$('hat').onchange=()=>act(()=>{session.customer.headwear=$('hat').value});
$('kitchenBtn').onclick=()=>act(()=>{session.openKitchen();view='kitchen';announce('Let’s make something delicious!')});
$('navKitchen').onclick=()=>{
 if(session.scene==='kitchen'){view='kitchen';render();return}
 act(()=>{session.openKitchen();view='kitchen';announce('Choose your ingredients!')});
};
$('navCafe').onclick=()=>act(()=>{session.returnCafe();view='cafe'});
$('navShop').onclick=()=>{view='shop';render()};
$('navDecor').onclick=()=>{view='decorate';render()};
$('navAchievements').onclick=()=>{view='achievements';render()};
$('returnBtn').onclick=()=>act(()=>{session.returnCafe();view='cafe';announce('Back to the café!')});
$('emptyBtn').onclick=()=>act(()=>{session.clearIngredients();announce('Bowl is empty!')});
$('mixBtn').onclick=()=>act(()=>{session.startMix();announce('Stir your ingredients!')});
$('stirBtn').onclick=()=>act(()=>{
 const b=$('bowl');b.classList.remove('stirring');void b.offsetWidth;b.classList.add('stirring');
 const food=session.stir();announce(food?'Surprise! '+food.name:'Keep stirring!');
});
$('bakeBtn').onclick=()=>act(()=>{session.startBake();announce('The oven is baking!')});
$('ovenBtn').onclick=()=>act(()=>{const food=session.openOven();announce('You made '+food.name+'!')});
$('bringBtn').onclick=()=>act(()=>{session.bringFood();view='cafe';announce('Serve your surprise!')});
$('serveBtn').onclick=()=>act(()=>{
 const r=session.serve();
 const title=r.special==='rare'?'Rare visitor! ':r.special==='inspector'?'Inspector rating! ':'';
 announce(title+r.stars+' stars · '+(r.reward>=0?'+':'')+r.reward+' coins'+(r.bonuses.length?' · Achievement +5!':''));
 if(r.stars>=4)playSound(980);
 if(r.bonuses.some(b=>b.name.includes('Fifty')))celebrate();
});
$('nextBtn').onclick=()=>{try{
 const target=session.beginLeave();announce('See you again!');
 persist();moveTo(target,()=>{session.finishLeave();announce('The line moves forward!');requestAnimationFrame(arrive)},'entrance');
}catch(e){announce(e.message)}};
$('bowl').ondragover=e=>e.preventDefault();
$('bowl').ondrop=e=>{e.preventDefault();act(()=>session.addIngredient(e.dataTransfer.getData('text/plain')))};
$('giftBtn').onclick=()=>act(()=>{const amount=session.claimDaily();announce('Daily gift! +'+amount+' coins');playSound(880)});
document.querySelectorAll('[data-shop]').forEach(btn=>btn.onclick=()=>{shopTab=btn.dataset.shop;render()});
$('wallpaperSelect').onchange=()=>act(()=>{session.setWallpaper($('wallpaperSelect').value);announce('Wallpaper changed!')});
$('colorSelect').onchange=()=>act(()=>{
 if(!selectedDecor)return;
 const d=session.game.decorations.find(x=>x.id===selectedDecor);
 session.decorate(d.id,d.x,d.y,$('colorSelect').value);announce('Color changed!');
});
$('doneBtn').onclick=()=>{view='cafe';announce('Your decorations are saved!');render();persist()};
$('shopFromDecor').onclick=()=>{shopTab='decor';view='shop';render()};
$('shopBackBtn').onclick=()=>{view=session.scene==='kitchen'?'kitchen':'cafe';render()};
$('peekKitty').onclick=()=>{peekHiddenAt=session.served;announce('Peekaboo! The shy kitty ducked out of sight.');playSound(770);render()};
$('soundBtn').onclick=()=>{settings.sound=!settings.sound;saveSettings();playSound(720);render()};
$('motionBtn').onclick=()=>{settings.reduce=!settings.reduce;saveSettings();render()};
function celebrate(){
 const layer=$('confetti');layer.replaceChildren();
 for(let i=0;i<25;i++){const e=document.createElement('span');e.textContent=['💗','⭐','✨','🎉'][i%4];e.style.left=(i*37%100)+'%';e.style.animationDelay=(i%5*.12)+'s';layer.append(e)}
 layer.classList.remove('hidden');setTimeout(()=>layer.classList.add('hidden'),reduceMotion()?500:3200);
}
window.addEventListener('pagehide',persist);
setInterval(updateOven,140);
render();persist();
requestAnimationFrame(()=>followCamera(visualPos.x));
if(session.phase==='arriving')requestAnimationFrame(arrive);
else if(session.phase==='finished')announce('Your customer is ready to leave when you are!');
else if(session.phase==='prepared')announce('Your surprise dish is ready!');
else announce('Welcome back to Mochi Munch!');
