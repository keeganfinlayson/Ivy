/* Modular vector character renderer — shared rig and interchangeable accessories. */
export const CHARACTER_RIG=Object.freeze({width:120,height:145,head:{x:60,y:64},neck:{x:60,y:94},headwear:{x:60,y:24},hands:{left:[24,103],right:[96,103]}});
const palette={
 cat:['#fff8ef','#e9a36c'],capybara:['#d9a778','#ba825b'],dog:['#e9ca9c','#be9066'],
 otter:['#b88d69','#8b6148'],giraffe:['#f1c979','#c7894d'],
 'unicorn-cat':['#fff3fe','#e3b7ed'],'inspector-cat':['#fff8ef','#e9a36c'],
 turkey:['#bf8066','#d99c4f'],ghost:['#f8fdff','#cbd9ed'],
 'santa-capybara':['#d9a778','#ba825b']
};
const safeColor=id=>palette[id]||palette.capybara;
const oval=(x,y,rx,ry,fill)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'"/>';
export function characterSVG(c,expression='idle'){
 const type=palette[c.species]?c.species:'capybara',cat=['cat','unicorn-cat','inspector-cat'].includes(type);
 const [fur,accent]=safeColor(type);
 const sleep=expression==='sleep',love=expression==='love',disgust=expression==='yuck',joy=expression==='happy';
 const eye=sleep?'<path d="M33 61 Q41 67 49 61 M71 61 Q79 67 87 61" fill="none" stroke="#594037" stroke-width="3" stroke-linecap="round"/>':love?'<path d="M34 63 Q39 52 45 62 Q51 52 54 63 L44 74 Z M69 63 Q74 52 80 62 Q86 52 89 63 L79 74 Z" fill="#e885a8" stroke="none"/>':oval(41,62,4,4,'#372b29')+oval(79,62,4,4,'#372b29');
 const mouth=disgust?'<path d="M51 90 Q60 78 69 90" fill="none" stroke="#68463d" stroke-width="3"/>':joy||love?'<path d="M49 82 Q60 99 71 82 Q60 90 49 82" fill="#9c5963" stroke="#704b43" stroke-width="2"/>':'<path d="M52 82 Q60 90 68 82" fill="none" stroke="#704b43" stroke-width="2"/>';
 let behind='',ears='',faceExtra='',bodyExtra='',headExtra='';
 if(cat){
  ears='<path d="M17 51 L21 9 L45 29 Q60 23 75 29 L100 9 L103 51" fill="'+fur+'"/><path d="M25 21 L27 42 L41 32 M94 21 L93 41 L80 32" fill="#f3aec2" stroke="none"/>';
  faceExtra='<path d="M15 45 Q34 25 51 38 L54 54 L19 61 Z" fill="'+accent+'" stroke="none"/><path d="M74 33 Q93 27 104 49 L80 56 Z" fill="#a4a1b5" stroke="none"/><path d="M20 83 L39 82 M81 82 L100 83" stroke="#80676c" stroke-width="2"/>';
  if(type==='unicorn-cat')headExtra='<path d="M55 28 L62 -8 L69 30 Z" fill="#f7d787" stroke="#a97b72" stroke-width="2"/><path d="M60 15 L66 10" stroke="#fff" stroke-width="2"/>';
  if(type==='inspector-cat')headExtra='<rect x="30" y="10" width="60" height="10" rx="3" fill="#52445c"/><path d="M43 11 L48 -3 L72 -3 L78 11" fill="#52445c"/>';
 } else if(type==='dog'){
  ears='<ellipse cx="18" cy="56" rx="14" ry="29" fill="'+accent+'" transform="rotate(12 18 56)"/><ellipse cx="102" cy="56" rx="14" ry="29" fill="'+accent+'" transform="rotate(-12 102 56)"/>';
  faceExtra=oval(60,80,26,17,'#f5dfc3')+oval(60,75,6,4,'#5e4239')+'<path d="M31 43 Q44 32 52 43" fill="none" stroke="'+accent+'" stroke-width="8"/>';
 } else if(type==='otter'){
  ears=oval(21,45,13,13,accent)+oval(99,45,13,13,accent);
  behind='<path d="M83 118 Q128 134 112 143" fill="none" stroke="'+accent+'" stroke-width="13" stroke-linecap="round"/>';
  faceExtra=oval(60,82,27,16,'#f8e4d0')+oval(60,77,5,4,'#60453e');
  bodyExtra=oval(60,110,24,20,'#f2d6be');
 } else if(type==='giraffe'){
  behind='<rect x="42" y="28" width="36" height="86" rx="18" fill="'+fur+'" stroke="#895c40" stroke-width="2"/>';
  ears='<path d="M21 34 Q5 18 21 10 Q38 15 41 32 Z M79 32 Q84 15 100 10 Q117 18 99 34 Z" fill="'+fur+'"/><path d="M43 27 L41 2 M77 27 L79 2" stroke="#9c734a" stroke-width="6" stroke-linecap="round"/>'+oval(41,4,7,6,accent)+oval(79,4,7,6,accent);
  bodyExtra=oval(39,104,8,10,accent)+oval(78,111,10,12,accent)+oval(61,129,8,7,accent);
  faceExtra=oval(60,83,23,13,'#f1d4ad')+oval(60,79,5,3,'#966345');
 } else if(type==='turkey'){
  behind='<path d="M60 97 L6 47 Q-2 14 27 36 L37 10 Q58 -9 61 26 Q79 -9 91 11 L104 37 Q128 9 114 50 Z" fill="#d79b4c" stroke="#98674d" stroke-width="3"/><path d="M60 98 L17 39 M60 98 L37 19 M60 98 L81 19 M60 98 L105 40" stroke="#b36c4e" stroke-width="5"/>';
  ears='';faceExtra='<path d="M52 79 L71 79 L60 95 Z" fill="#edac4b" stroke="#a56839" stroke-width="2"/>';
 } else if(type==='ghost'){
  behind='<path d="M20 118 L20 60 A40 42 0 0 1 100 60 L100 128 L85 116 L70 130 L55 118 L40 131 Z" fill="#fafdff" stroke="#c2cfe0" stroke-width="3"/>';
  ears='';faceExtra=oval(60,80,8,11,'#b5c4da');
 } else{
  ears=oval(22,44,14,14,accent)+oval(98,44,14,14,accent);
  faceExtra=oval(60,80,27,17,'#f6ddc4')+oval(60,74,6,4,'#65473d');
 }
 if(type==='santa-capybara')headExtra='<path d="M27 33 Q50 -9 86 3 L101 25 L89 32 Z" fill="#d85b68" stroke="#a63f54" stroke-width="2"/>'+oval(103,25,11,11,'#fff')+'<rect x="25" y="27" width="69" height="10" rx="5" fill="#fff"/>';
 const arms='<g class="arms">'+oval(23,104,11,22,fur)+oval(97,104,11,22,fur)+'</g>';
 const scarf=c.outfit==='scarf'?'<path d="M27 96 Q60 110 92 95 L87 108 Q60 123 33 108 Z" fill="#ec96b1"/><path d="M80 106 L99 129 L87 132 L72 114" fill="#e98aab"/>':'';
 const apron=c.outfit==='apron'?'<path d="M42 98 L78 98 L87 132 Q60 143 33 132 Z" fill="#f5ebee" stroke="#b08d99" stroke-width="2"/><path d="M50 119 Q60 126 70 119" fill="none" stroke="#cf8ba1" stroke-width="3"/>':'';
 const hat=c.headwear==='chef'?'<path d="M31 32 Q16 12 37 8 Q52 -5 62 7 Q82 -5 91 12 Q104 29 86 33 Z" fill="#fff" stroke="#cbbbc5" stroke-width="2"/><rect x="30" y="27" width="61" height="11" rx="4" fill="#fff0f7" stroke="#cbbbc5" stroke-width="2"/>':'';
 const bow=c.headwear==='bow'?'<path d="M89 32 Q112 15 111 39 Q110 52 89 42 Q70 56 72 37 Q75 26 89 32 Z" fill="#ed9cb8" stroke="#b97694" stroke-width="2"/>':'';
 const inspector=type==='inspector-cat'?'<path d="M57 97 L65 97 L68 116 L60 125 L53 116 Z" fill="#536579"/><circle cx="81" cy="65" r="12" fill="none" stroke="#8e7a56" stroke-width="3"/><path d="M93 64 L101 72" stroke="#8e7a56" stroke-width="2"/>':'';
 return '<svg viewBox="0 0 120 145" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+type+'"><g stroke="#745248" stroke-linejoin="round" stroke-width="2.5">'+behind+'<g class="legs">'+oval(40,128,13,17,fur)+oval(80,128,13,17,fur)+'</g>'+oval(60,102,38,39,fur)+bodyExtra+arms+ears+oval(60,62,48,43,fur)+faceExtra+eye+mouth+headExtra+inspector+scarf+apron+hat+bow+'</g></svg>';
}
