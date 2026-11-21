/* Mochi Munch: data-driven recipe discovery. No in-game recipe book. */
export const INGREDIENTS=Object.freeze([
 {id:'strawberry',name:'Strawberry',emoji:'🍓'},
 {id:'blueberry',name:'Blueberry',emoji:'🫐'},
 {id:'banana',name:'Banana',emoji:'🍌'},
 {id:'flour',name:'Flour',emoji:'🌾'},
 {id:'sugar',name:'Sugar',emoji:'🍬'},
 {id:'milk',name:'Milk',emoji:'🥛'},
 {id:'mango',name:'Mango',emoji:'🥭'},
 {id:'starfruit',name:'Star Fruit',emoji:'⭐'},
 {id:'dragonfruit',name:'Dragon Fruit',emoji:'🐉'}
]);
export const REWARDS=Object.freeze({1:1,2:5,3:10,4:15,5:20});
const dishes=[
 {id:'strawberry-smoothie',name:'Strawberry Smoothie',emoji:'🥤',method:'mix',needs:['strawberry','milk'],quality:5,group:'fruit'},
 {id:'blueberry-shake',name:'Blueberry Shake',emoji:'🥤',method:'mix',needs:['blueberry','milk'],quality:5,group:'fruit'},
 {id:'banana-smoothie',name:'Banana Smoothie',emoji:'🥤',method:'mix',needs:['banana','milk'],quality:5,group:'fruit'},
 {id:'fruit-salad',name:'Rainbow Fruit Salad',emoji:'🍨',method:'mix',needs:['banana','strawberry','blueberry'],quality:5,group:'fruit'},
 {id:'strawberry-jam',name:'Strawberry Jam',emoji:'🍓',method:'mix',needs:['strawberry','sugar'],quality:4,group:'fruit'},
 {id:'blueberry-jam',name:'Blueberry Jam',emoji:'🫐',method:'mix',needs:['blueberry','sugar'],quality:4,group:'fruit'},
 {id:'sweet-muffin',name:'Sweet Muffin',emoji:'🧁',method:'bake',needs:['flour','milk','sugar'],quality:4,group:'baked'},
 {id:'blueberry-muffin',name:'Blueberry Muffin',emoji:'🧁',method:'bake',needs:['blueberry','flour','milk'],quality:5,group:'baked'},
 {id:'banana-bread',name:'Banana Bread',emoji:'🍞',method:'bake',needs:['banana','flour','milk'],quality:5,group:'baked'},
 {id:'strawberry-cake',name:'Strawberry Cake',emoji:'🍰',method:'bake',needs:['flour','strawberry','sugar'],quality:5,group:'baked'},
 {id:'sugar-cookie',name:'Sugar Cookie',emoji:'🍪',method:'bake',needs:['flour','sugar'],quality:4,group:'baked'},
 {id:'mango-smoothie',name:'Mango Smoothie',emoji:'🥤',method:'mix',needs:['mango','milk'],quality:5,group:'fruit'},
 {id:'mango-cake',name:'Mango Cake',emoji:'🍰',method:'bake',needs:['mango','flour','sugar'],quality:5,group:'baked'},
 {id:'starfruit-sparkle',name:'Starry Fruit Surprise',emoji:'🍨',method:'mix',needs:['starfruit','milk'],quality:5,group:'fruit'},
 {id:'starry-tart',name:'Starry Tart',emoji:'🥧',method:'bake',needs:['starfruit','flour'],quality:5,group:'baked'},
 {id:'dragonfruit-delight',name:'Dragonfruit Delight',emoji:'🍧',method:'mix',needs:['dragonfruit'],quality:5,group:'special'},
 {id:'dragonfruit-cake',name:'Dragonfruit Magic Cake',emoji:'🎂',method:'bake',needs:['dragonfruit'],quality:5,group:'special'}
];
export const RECIPE_CATALOG=Object.freeze(dishes.map(r=>Object.freeze({...r,needs:Object.freeze([...r.needs])})));
function hashKey(value){let n=2166136261;for(let i=0;i<value.length;i++){n^=value.charCodeAt(i);n=Math.imul(n,16777619)}return n>>>0}
export function resolveFood(ingredients,method){
 if(!['mix','bake'].includes(method))throw Error('Unknown cooking method');
 if(!Array.isArray(ingredients)||ingredients.length<1||ingredients.length>4)throw Error('Choose 1–4 ingredients');
 const valid=new Set(INGREDIENTS.map(i=>i.id));if(ingredients.some(x=>!valid.has(x)))throw Error('Unknown ingredient');
 const counts=new Map();for(const i of ingredients)counts.set(i,(counts.get(i)||0)+1);
 if(counts.has('dragonfruit'))return {id:method==='bake'?'dragonfruit-cake':'dragonfruit-delight',name:method==='bake'?'Dragonfruit Magic Cake':'Dragonfruit Delight',emoji:method==='bake'?'🎂':'🍧',quality:5,group:'special'};
 const matches=RECIPE_CATALOG.filter(r=>r.method===method&&r.needs.every(x=>counts.has(x)))
 .map(r=>({r,extra:ingredients.length-r.needs.length})).filter(x=>x.extra>=0)
 .sort((a,b)=>a.extra-b.extra||b.r.needs.length-a.r.needs.length);
 if(matches.length){const d=matches[0];return {id:d.r.id,name:d.r.name,emoji:d.r.emoji,quality:Math.max(1,d.r.quality-(d.extra>=2?1:0)),group:d.r.group}}
 const seed=[...ingredients].sort().join('+')+'|'+method,hash=hashKey(seed);
 const names=method==='bake'?['Wobbly Cake','Mystery Crumble','Surprise Puff','Curious Biscuit']:['Rainbow Goo','Silly Smoothie','Mystery Mousse','Wiggle Pudding'];
 return{id:'mystery-'+hash.toString(36),name:names[hash%names.length],emoji:method==='bake'?'🥧':'🍮',quality:1+hash%3,group:method==='bake'?'baked':'other'};
}
export function rateFood(food,preference){
 if(food.group==='special')return 5;
 let n=food.quality;
 if(preference==='fruit'&&food.group==='fruit')n++;
 if(preference==='baked'&&food.group==='baked')n++;
 if(preference==='fruit'&&food.group==='baked')n--;
 if(preference==='baked'&&food.group==='fruit')n--;
 return Math.max(1,Math.min(5,n));
}
