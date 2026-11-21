/* Mochi Munch restaurant session engine v2: no DOM dependencies. */
import {Game,Customer,STATES,LOCATIONS} from './game-core.js';
import {INGREDIENTS,REWARDS,resolveFood,rateFood} from './recipes.js';
export const SAVE_KEY='mochi-munch-game';
export const SESSION_VERSION=2;
const validIngredients=new Set(INGREDIENTS.map(x=>x.id));
const validPhases=new Set(['arriving','waiting','moving','counter','prepared','finished','leaving']);
const validStates=new Set(Object.values(STATES));
function clampInt(v,def=0){return Number.isSafeInteger(v)&&v>=0?v:def}
export class Restaurant{
 constructor(saved=null,{random=Math.random}={}){
   this.random=random;this.game=new Game();this.currentId=null;this.queueIds=[];this.phase='arriving';this.scene='cafe';this.selected=[];this.cooking=null;this.prepared=null;this.served=0;this.lastReward=0;this.lastRating=null;this.pendingMove=null;
   if(!saved||!this.restore(saved)){this.fillQueue();this.startNext()}
 }
 get customer(){return this.game.customers.get(this.currentId)||null}
 get queue(){return this.queueIds.map(id=>this.game.customers.get(id)).filter(Boolean)}
 createGuest(){const c=this.game.addCustomer(this.random()<.5?'cat':'capybara');c.preference=this.random()<.5?'fruit':'baked';return c}
 fillQueue(){while(this.queueIds.length<3)this.queueIds.push(this.createGuest().id)}
 startNext(){if(this.currentId)throw Error('Finish the current visit first');this.fillQueue();this.currentId=this.queueIds.shift();this.fillQueue();const c=this.customer;c.position={...LOCATIONS.entrance};this.phase='arriving';this.scene='cafe';this.cooking=null;this.prepared=null;this.selected=[];this.lastRating=null;this.lastReward=0;this.pendingMove=null;return c}
 planMove(destination,arrivalState){
   if(this.pendingMove)throw Error('Customer is already moving');
   if(!LOCATIONS[destination])throw Error('Unknown destination');
   if(destination==='waiting'&&this.phase!=='arriving')throw Error('Only new guests enter the waiting area');
   if(destination==='counter'&&!['waiting','counter'].includes(this.phase))throw Error('Customer cannot approach now');
   if(destination==='bench'&&this.phase!=='waiting')throw Error('Customer cannot go to the bench now');
   const c=this.customer;if(!c)throw Error('No active customer');
   this.game.moveCustomer(c.id,destination,arrivalState);
   this.pendingMove={destination,arrivalState};this.phase='moving';
   return {...LOCATIONS[destination]};
 }
 finishMove(){if(this.phase!=='moving'||!this.pendingMove)throw Error('No move to finish');const {destination,arrivalState}=this.pendingMove;this.game.arrive(this.currentId,LOCATIONS[destination],arrivalState);this.pendingMove=null;this.phase=arrivalState===STATES.AT_COUNTER?'counter':'waiting';return this.customer}
 sit(){if(this.phase!=='waiting')throw Error('Customer is not waiting');if(this.customer.state===STATES.SLEEPING){this.customer.transition(STATES.SEATED);return null}return this.planMove('bench',STATES.SEATED)}
 nap(){if(this.phase!=='waiting')throw Error('Customer is not waiting');if(this.customer.state===STATES.SEATED){this.customer.transition(STATES.SLEEPING);return null}return this.planMove('bench',STATES.SLEEPING)}
 toCounter(){return this.planMove('counter',STATES.AT_COUNTER)}
 openKitchen(){if(this.phase!=='counter')throw Error('Serve this customer before returning to the kitchen');this.scene='kitchen'}
 returnCafe(){this.scene='cafe'}
 addIngredient(id){if(this.scene!=='kitchen'||this.phase!=='counter'||this.cooking)throw Error('The bowl is not available');if(!validIngredients.has(id))throw Error('Unknown ingredient');if(this.selected.length>=4)throw Error('The bowl holds four ingredients');this.selected.push(id)}
 clearIngredients(){if(this.cooking)throw Error('Finish cooking before emptying the bowl');this.selected=[]}
 startMix(){this.checkCook();this.cooking={method:'mix',stirs:0};return this.cooking}
 stir(){if(this.cooking?.method!=='mix')throw Error('Start mixing first');this.cooking.stirs++;if(this.cooking.stirs>=3)return this.completeCook();return null}
 startBake(now=Date.now()){this.checkCook();this.cooking={method:'bake',startedAt:now};return this.cooking}
 ovenReady(now=Date.now()){return this.cooking?.method==='bake'&&now-this.cooking.startedAt>=1800}
 openOven(now=Date.now()){if(!this.ovenReady(now))throw Error('The oven is still baking');return this.completeCook()}
 checkCook(){if(this.scene!=='kitchen'||this.phase!=='counter'||this.cooking||!this.selected.length)throw Error('Choose ingredients before cooking')}
 completeCook(){const food=resolveFood(this.selected,this.cooking.method),stars=rateFood(food,this.customer.preference);this.prepared={...food,stars,method:this.cooking.method,ingredients:[...this.selected]};this.cooking=null;this.phase='prepared';return this.prepared}
 bringFood(){if(this.phase!=='prepared'||!this.prepared)throw Error('Food is not ready');this.scene='cafe'}
 serve(){if(this.scene!=='cafe'||this.phase!=='prepared'||!this.prepared)throw Error('No food ready to serve');const c=this.customer;c.transition(STATES.EATING);this.lastRating=this.prepared.stars;this.lastReward=REWARDS[this.lastRating];this.game.awardCoins(this.lastReward,'customer rating');this.served++;this.phase='finished';return {stars:this.lastRating,reward:this.lastReward,food:this.prepared}}
 beginLeave(){if(this.phase!=='finished')throw Error('Customer is still eating or waiting');this.customer.transition(STATES.LEAVING);this.phase='leaving';return {...LOCATIONS.entrance}}
 finishLeave(){if(this.phase!=='leaving')throw Error('Customer has not left');this.game.customers.delete(this.currentId);this.currentId=null;return this.startNext()}
 serialize(){const details=Object.fromEntries([...this.game.customers.values()].map(c=>[c.id,{preference:c.preference}]));return {version:SESSION_VERSION,game:this.game.snapshot(),details,currentId:this.currentId,queueIds:[...this.queueIds],phase:this.phase,scene:this.scene,selected:[...this.selected],cooking:this.cooking?{...this.cooking}:null,prepared:this.prepared?{...this.prepared,ingredients:[...this.prepared.ingredients]}:null,served:this.served,lastRating:this.lastRating,lastReward:this.lastReward,pendingMove:this.pendingMove?{...this.pendingMove}:null}}
 restore(raw){try{
  if(!raw||raw.version!==SESSION_VERSION||!raw.game||!Array.isArray(raw.game.customers))return false;
  const customers=new Map();
  for(const data of raw.game.customers){if(!data||!validStates.has(data.state)||!data.id||customers.has(data.id))return false;const c=new Customer(data);c.preference=raw.details?.[c.id]?.preference==='baked'?'baked':'fruit';customers.set(c.id,c)}
  if(!customers.has(raw.currentId)||!Array.isArray(raw.queueIds)||raw.queueIds.some(id=>!customers.has(id)||id===raw.currentId))return false;
  this.game.customers=customers;this.game.coins=clampInt(raw.game.coins);this.game.nextId=clampInt(raw.game.nextId,1);
  this.game.unlocked=raw.game.unlocked||this.game.unlocked;this.game.achievements=raw.game.achievements||[];this.game.decorations=raw.game.decorations||[];this.game.daily=raw.game.daily||this.game.daily;
  this.currentId=raw.currentId;this.queueIds=[...new Set(raw.queueIds)];this.phase=validPhases.has(raw.phase)?raw.phase:'waiting';
  this.scene=raw.scene==='kitchen'?'kitchen':'cafe';this.selected=Array.isArray(raw.selected)?raw.selected.filter(x=>validIngredients.has(x)).slice(0,4):[];
  this.cooking=raw.cooking&&['mix','bake'].includes(raw.cooking.method)?{...raw.cooking}:null;
  this.prepared=raw.prepared&&Number.isInteger(raw.prepared.stars)?raw.prepared:null;
  this.served=clampInt(raw.served);this.lastRating=raw.lastRating||null;this.lastReward=clampInt(raw.lastReward);
  this.pendingMove=raw.pendingMove||null;
  // Resume interrupted movement at its starting location or complete it safely.
  if(this.phase==='moving'){const p=this.pendingMove;if(p&&LOCATIONS[p.destination]&&validStates.has(p.arrivalState)){this.game.arrive(this.currentId,LOCATIONS[p.destination],p.arrivalState);this.phase=p.arrivalState===STATES.AT_COUNTER?'counter':'waiting'}else{this.customer.state=STATES.WAITING;this.phase='waiting'}this.pendingMove=null}
  if(this.phase==='leaving'){this.game.customers.delete(this.currentId);this.currentId=null;this.startNext()}
  if(this.phase==='finished')this.customer.state=STATES.EATING;
  if(this.phase==='prepared'&&!this.prepared){this.phase='counter';this.scene='kitchen'}
  if(this.phase==='counter'||this.phase==='prepared')this.customer.state=STATES.AT_COUNTER;
  if(this.phase==='arriving'){this.customer.state=STATES.ENTERING;this.customer.position={...LOCATIONS.entrance}}
  this.fillQueue();return true
 }catch{return false}}
}
export function convertLegacy(old){if(!old||old.version!==1||!old.game)return null;
 const state={version:SESSION_VERSION,game:old.game,details:Object.fromEntries(Object.entries(old.preferences||{}).map(([id,preference])=>[id,{preference}])),currentId:old.current,queueIds:old.queue||[],phase:old.phase||'waiting',scene:'cafe',selected:old.selected||[],cooking:null,prepared:old.prepared||null,served:old.served||0,lastRating:null,lastReward:0,pendingMove:null};
 if(state.phase==='finished')state.lastRating=state.prepared?.stars||null;
 return state;
}
