import test from 'node:test';
import assert from 'node:assert/strict';
import {Restaurant} from '../src/restaurant-v3.js';
import {STATES} from '../src/game-core.js';
import {resolveFood,rateFood} from '../src/recipes.js';
import {SHOP_CATALOG,eventSpecies,dateKey} from '../src/game-content.js';

function arrive(g){if(g.phase==='arriving'){g.planMove('waiting',STATES.WAITING);g.finishMove()}assert.equal(g.phase,'waiting')}
function counter(g){g.toCounter();g.finishMove()}
function mix(g,items){g.openKitchen();items.forEach(i=>g.addIngredient(i));g.startMix();while(g.cooking?.method==='mix')g.stir();g.bringFood()}
function bake(g,items){g.openKitchen();items.forEach(i=>g.addIngredient(i));g.startBake(1000);g.openOven(4000);g.bringFood()}
test('50 complete visits and 50-customer achievement',()=>{
 const g=new Restaurant(null,{random:()=>.8});
 for(let i=0;i<50;i++){arrive(g);if(i%4===0){g.sit();g.finishMove();g.nap()}counter(g);if(i%2)mix(g,['milk','strawberry']);else bake(g,['flour','sugar']);g.serve();g.beginLeave();g.finishLeave()}
 assert.equal(g.served,50);assert.ok(g.game.achievements.includes('fifty-customers'));
});
test('recipes are consistent and dragon fruit always gets 5 stars',()=>{
 const a=resolveFood(['banana','milk'],'mix'),b=resolveFood(['milk','banana'],'mix');
 assert.equal(a.id,b.id);
 for(const method of ['mix','bake'])for(const preference of ['fruit','baked']){
  assert.equal(rateFood(resolveFood(['flour','dragonfruit','sugar'],method),preference),5)
 }
});
test('shop prices and nonrepeatable purchases',()=>{
 const g=new Restaurant();g.game.coins=1200;
 for(const [id,cost] of [['mango',20],['starfruit',50],['dragonfruit',1000]])assert.equal(g.purchase(id).price,cost);
 assert.equal(g.game.coins,130);assert.throws(()=>g.purchase('mango'));assert.throws(()=>g.purchase('sparkly-oven'));
});
test('mixing and oven upgrades',()=>{
 const g=new Restaurant();g.game.coins=500;g.purchase('fast-mixer');g.purchase('sparkly-oven');
 arrive(g);counter(g);g.openKitchen();g.addIngredient('milk');g.startMix();assert.equal(g.cooking.stirsNeeded,1);g.stir();assert.equal(g.phase,'prepared');
 const h=new Restaurant();h.game.coins=200;h.purchase('sparkly-oven');arrive(h);counter(h);h.openKitchen();h.addIngredient('flour');h.startBake(1000);assert.equal(h.ovenReady(1900),true)
});
test('coin credit once per customer',()=>{
 const g=new Restaurant();arrive(g);counter(g);mix(g,['strawberry','milk']);g.serve();const n=g.game.coins;assert.throws(()=>g.serve());assert.equal(g.game.coins,n)
});
test('daily gifts once per day',()=>{
 const g=new Restaurant();g.claimDaily(new Date(2026,10,20));assert.throws(()=>g.claimDaily(new Date(2026,10,20)));g.claimDaily(new Date(2026,10,21));assert.equal(g.game.coins,20)
});
test('Friday inspector and seasonal guests',()=>{
 const g=new Restaurant();g.now=()=>new Date(2026,10,27,12);g.currentId=null;g.game.daily.lastInspection=null;g.startNext();assert.equal(g.customer.species,'inspector-cat');
 arrive(g);counter(g);bake(g,['blueberry','flour','milk']);const r=g.serve();assert.equal(r.reward,30);assert.equal(g.game.daily.lastInspection,dateKey(new Date(2026,10,27,12)));
 assert.equal(eventSpecies(new Date(2026,9,31),()=>0),'ghost');
 assert.equal(eventSpecies(new Date(2026,10,21),()=>0),'turkey');
 assert.equal(eventSpecies(new Date(2026,11,25),()=>0),'santa-capybara');
});
test('rare customer gets 50 coins at 5 stars',()=>{
 const g=new Restaurant();g.customer.rarity='rare';g.customer.species='unicorn-cat';g.customer.preference='fruit';
 arrive(g);counter(g);mix(g,['strawberry','milk']);assert.equal(g.serve().reward,50)
});
test('decorations and complete sessions restore',()=>{
 const g=new Restaurant();g.game.coins=100;g.purchase('plush-cushion');g.purchase('mint-wallpaper');g.decorate('plush-cushion',.73,.62,'mint');
 const saved=g.serialize(),h=new Restaurant(saved);assert.equal(h.wallpaper,'mint-wallpaper');assert.equal(h.game.decorations[0].x,.73);
 arrive(h);counter(h);h.openKitchen();h.addIngredient('banana');h.startMix();h.stir();
 const restored=new Restaurant(h.serialize());assert.equal(restored.cooking.stirs,1);assert.equal(restored.scene,'kitchen');
});
test('interrupted movement and version-2 saves restore',()=>{
 const g=new Restaurant();g.planMove('waiting',STATES.WAITING);const h=new Restaurant(g.serialize());assert.equal(h.phase,'waiting');
 const old=h.serialize();old.version=2;delete old.wallpaper;const later=new Restaurant(old);assert.equal(later.phase,'waiting');
});
