/* Mochi Munch gameplay content: shop, guests and special events. */
export const SPECIES=Object.freeze({
 cat:{name:'Calico Cat',emoji:'🐱',rarity:'common'},
 capybara:{name:'Capybara',emoji:'🦫',rarity:'common'},
 dog:{name:'Puppy',emoji:'🐶',rarity:'common'},
 otter:{name:'Otter',emoji:'🦦',rarity:'common'},
 giraffe:{name:'Giraffe',emoji:'🦒',rarity:'common'},
 'unicorn-cat':{name:'Unicorn Kitty',emoji:'🦄',rarity:'rare'},
 'inspector-cat':{name:'Friday Inspector Cat',emoji:'🐈',rarity:'inspector'},
 turkey:{name:'Autumn Turkey',emoji:'🦃',rarity:'seasonal'},
 ghost:{name:'Friendly Ghost',emoji:'👻',rarity:'seasonal'},
 'santa-capybara':{name:'Santa Capybara',emoji:'🎅',rarity:'seasonal'}
});
export const SHOP_CATALOG=Object.freeze([
 {id:'mango',kind:'ingredients',name:'Mango',emoji:'🥭',price:20,desc:'A bright, sweet fruit'},
 {id:'starfruit',kind:'ingredients',name:'Star Fruit',emoji:'⭐',price:50,desc:'A fruity star'},
 {id:'dragonfruit',kind:'ingredients',name:'Dragon Fruit',emoji:'🐉',price:1000,desc:'Everyone loves it!'},
 {id:'dog',kind:'customers',name:'Puppy Invitation',emoji:'🐶',price:35,desc:'Puppies may visit'},
 {id:'otter',kind:'customers',name:'Otter Invitation',emoji:'🦦',price:55,desc:'Otters may visit'},
 {id:'giraffe',kind:'customers',name:'Giraffe Invitation',emoji:'🦒',price:85,desc:'Giraffes may visit'},
 {id:'plush-cushion',kind:'furniture',name:'Plush Cushion',emoji:'🛋️',price:20,desc:'A cozy place to wait'},
 {id:'potted-flower',kind:'furniture',name:'Potted Flowers',emoji:'🌷',price:30,desc:'Cheerful decorations'},
 {id:'heart-rug',kind:'furniture',name:'Heart Rug',emoji:'💗',price:45,desc:'Brighten the floor'},
 {id:'cloud-lamp',kind:'furniture',name:'Cloud Lamp',emoji:'☁️',price:60,desc:'A warm glow'},
 {id:'mint-wallpaper',kind:'wallpaper',name:'Mint Wallpaper',emoji:'🍃',price:35,desc:'A new wall color'},
 {id:'sky-wallpaper',kind:'wallpaper',name:'Sky Wallpaper',emoji:'☁️',price:35,desc:'A blue sky café'},
 {id:'sunset-wallpaper',kind:'wallpaper',name:'Sunset Wallpaper',emoji:'🌅',price:55,desc:'Soft coral walls'},
 {id:'fast-mixer',kind:'tools',name:'Fast Mixer',emoji:'🌀',price:120,desc:'Mixes three times faster'},
 {id:'sparkly-oven',kind:'tools',name:'Sparkly Oven',emoji:'✨',price:175,desc:'Bakes twice as fast'}
]);
export const FURNITURE_COLORS=Object.freeze([
 {id:'pink',hex:'#f1a7be'}, {id:'mint',hex:'#9ed9bf'},
 {id:'lavender',hex:'#bcb0e8'}, {id:'sunshine',hex:'#f5d68b'}
]);
export const ACHIEVEMENTS=Object.freeze([
 {id:'first-customer',name:'First Customer!',at:1},
 {id:'five-customers',name:'Five Happy Visits!',at:5},
 {id:'ten-customers',name:'Ten Dishes Served!',at:10},
 {id:'fifty-customers',name:'Fifty Customer Party!',at:50}
]);
export function itemById(id){return SHOP_CATALOG.find(x=>x.id===id)||null}
export function dateKey(date=new Date()){return String(date.getFullYear())+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0')}
export function eventSpecies(date=new Date(),random=Math.random){
 const m=date.getMonth();
 if(m===9&&random()<.15)return 'ghost';
 if(m===10&&random()<.15)return 'turkey';
 if(m===11&&random()<.15)return 'santa-capybara';
 return null;
}
export function guestLabel(c){return SPECIES[c?.species]?.name||'Guest'}
