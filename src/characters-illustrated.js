/* Mochi Munch illustrated character rig v0.17.
 * Layered, independent body / limbs / headwear; scalable SVG, no raster dependence.
 * Visual reference: original capybara customer and strawberry café storyboards.
 */
export const CHARACTER_RIG=Object.freeze({
  viewBox:'0 -10 174 224',
  bodyPivot:{x:87,y:144},
  headPivot:{x:87,y:113},
  hands:{left:[36,143],right:[140,143]},
  feet:{left:[55,194],right:[121,194]}
});
const COLORS={
  capybara:{fur:'#E6A86F',light:'#FFD09A',shade:'#BB744B',muzzle:'#E8AA80',patch:'#E6A86F'},
  'santa-capybara':{fur:'#E6A86F',light:'#FFD09A',shade:'#BB744B',muzzle:'#E8AA80',patch:'#E6A86F'},
  cat:{fur:'#FFF8EE',light:'#FFFFFF',shade:'#E8D3C5',muzzle:'#FFF8EE',patch:'#E8A16E'},
  'unicorn-cat':{fur:'#FDF3F9',light:'#FFFFFF',shade:'#E5C9E1',muzzle:'#FCE9F6',patch:'#E8A9D1'},
  'inspector-cat':{fur:'#FFF8EE',light:'#FFFFFF',shade:'#E8D3C5',muzzle:'#FFF8EE',patch:'#E8A16E'},
  dog:{fur:'#DCA16C',light:'#F7D9AC',shade:'#B7784D',muzzle:'#FFF0D7',patch:'#A96B41'},
  otter:{fur:'#B98562',light:'#E8B48D',shade:'#92583F',muzzle:'#FFE4CA',patch:'#C38A66'},
  giraffe:{fur:'#F6CE83',light:'#FFEAB2',shade:'#C68F53',muzzle:'#FCE0B0',patch:'#C08A4D'},
  turkey:{fur:'#CB9070',light:'#F3B38B',shade:'#9A5C48',muzzle:'#E6AC8C',patch:'#C08A4D'},
  ghost:{fur:'#F4F9FE',light:'#FFFFFF',shade:'#CADBEF',muzzle:'#FFFFFF',patch:'#B9D1E5'}
};
const OUTLINE='#6C4036';
const S=(d,fill,extra='')=>'<path d="'+d+'" fill="'+fill+'" '+extra+'/>';
const E=(x,y,rx,ry,fill,extra='')=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" '+extra+'/>';
const R=(x,y,w,h,rx,fill,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" '+extra+'/>';
const g=(className,body)=>'<g class="'+className+'">'+body+'</g>';
const escapeId=s=>String(s||'animal').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,60)||'animal';
const CAT=new Set(['cat','unicorn-cat','inspector-cat']);

function specialParts(species,p){
  if(CAT.has(species)){
    return {
      rear:S('M32 69 L34 12 Q34 5 41 11 L72 39 L105 33 L140 9 Q149 6 149 18 L148 74 Z','url(#{{fur}})', 'stroke="'+OUTLINE+'" stroke-width="5" stroke-linejoin="round"')
      +S('M42 25 L42 53 L62 40 Z','#F2B6BE')+S('M138 24 L137 54 L119 41 Z','#F2B6BE'),
      markings:S('M34 68 Q39 38 62 39 Q69 43 70 67 Q58 74 44 79 Z',p.patch,'opacity=".94"')
        +S('M107 42 Q138 36 144 65 L133 78 Q116 77 105 66 Z','#A8A7B5','opacity=".88"')
        +S('M42 91 L24 85 M43 101 L23 105 M133 91 L151 87 M133 103 L153 108','none','stroke="#A28D8B" stroke-width="2.5" stroke-linecap="round"'),
      extras:species==='unicorn-cat'
        ?S('M76 40 L88 -10 L102 39 Z','#F5D18E','stroke="'+OUTLINE+'" stroke-width="3.5"')+S('M86 8 L94 20','none','stroke="#FFF8D8" stroke-width="3.5"')
        :species==='inspector-cat'?g('inspector-hat',R(48,17,79,13,5,'#65627A','stroke="'+OUTLINE+'" stroke-width="3"')+S('M63 16 L69 -5 L109 -5 L118 16 Z','#65627A','stroke="'+OUTLINE+'" stroke-width="3"')):'',
      tail:S('M121 158 Q162 149 164 176 Q165 191 142 186','none','stroke="'+OUTLINE+'" stroke-width="15" stroke-linecap="round"')+S('M121 158 Q155 153 157 176 Q157 184 145 181','none','stroke="'+(species==='unicorn-cat'?'#F3C9EA':'#F4DFCE')+'" stroke-width="10" stroke-linecap="round"')
    };
  }
  if(species==='dog'){
    return {
      rear:E(32,83,22,44,p.shade,'transform="rotate(18 32 83)" stroke="'+OUTLINE+'" stroke-width="5"')
        +E(145,84,21,43,p.shade,'transform="rotate(-18 145 84)" stroke="'+OUTLINE+'" stroke-width="5"'),
      markings:S('M37 70 Q41 34 74 42 Q79 64 68 85 Q52 94 40 90 Z',p.patch)
        +S('M113 49 Q134 52 142 77 Q133 87 123 84 Z','#C48B63')
        +E(87,115,33,22,p.muzzle)+E(87,102,8,6,'#51362F'),
      extras:'',tail:S('M134 162 Q160 143 159 157 Q170 172 150 178','none','stroke="'+OUTLINE+'" stroke-width="13" stroke-linecap="round"')+S('M138 161 Q159 153 153 168','none','stroke="'+p.light+'" stroke-width="9" stroke-linecap="round"')
    };
  }
  if(species==='giraffe'){
    return {
      rear:S('M47 67 L39 38 Q20 33 21 49 Q29 68 50 72 Z',p.fur,'stroke="'+OUTLINE+'" stroke-width="4"')
        +S('M125 67 L135 38 Q153 32 155 49 Q144 69 124 72 Z',p.fur,'stroke="'+OUTLINE+'" stroke-width="4"')
        +S('M62 43 L59 4 M115 43 L117 4','none','stroke="'+OUTLINE+'" stroke-width="8" stroke-linecap="round"')
        +E(59,4,9,9,p.shade,'stroke="'+OUTLINE+'" stroke-width="3"')
        +E(117,4,9,9,p.shade,'stroke="'+OUTLINE+'" stroke-width="3"'),
      markings:E(50,73,13,14,p.patch)+E(132,90,12,10,p.patch)+E(88,51,10,12,p.patch),
      extras:'',tail:S('M134 156 Q152 161 146 187','none','stroke="'+OUTLINE+'" stroke-width="6" stroke-linecap="round"')
    };
  }
  if(species==='turkey'){
    return {
      rear:S('M87 160 C10 130 -2 76 36 72 Q25 21 60 46 Q88 8 102 46 Q138 20 136 63 Q167 63 159 98 Q149 140 87 160 Z','#CF8959','stroke="'+OUTLINE+'" stroke-width="4"')
      +S('M87 154 L32 82 M87 154 L55 58 M87 154 L94 47 M87 154 L130 69 M87 154 L149 95','none','stroke="#AE6E55" stroke-width="5"'),
      markings:S('M73 105 L104 104 L87 120 Z','#EDA94D','stroke="'+OUTLINE+'" stroke-width="2.5"'),extras:'',tail:''
    };
  }
  if(species==='ghost'){
    return {
      rear:'',markings:'',extras:'',tail:'',
      ghostShape:S('M25 112 Q23 42 86 40 Q150 41 149 110 L150 192 L131 180 L113 192 L93 182 L74 193 L53 181 L30 190 Z','#F6FAFF','stroke="'+OUTLINE+'" stroke-width="5"')
    };
  }
  return {
    rear:E(38,50,18,19,p.shade,'stroke="'+OUTLINE+'" stroke-width="4"')
      +E(137,50,18,19,p.shade,'stroke="'+OUTLINE+'" stroke-width="4"')
      +E(38,53,8,8,p.light)+E(137,53,8,8,p.light),
    markings:E(88,109,34,23,p.muzzle,'opacity=".55"'),extras:'',tail:''
  };
}

function face(exp,species,p){
  const y=87;let eyes,mouth,brows='';
  if(exp==='sleep'){
    eyes=S('M53 84 Q65 95 76 84 M100 84 Q112 95 124 84','none','stroke="'+OUTLINE+'" stroke-width="4" stroke-linecap="round"');
    mouth=S('M82 112 Q87 116 92 112','none','stroke="'+OUTLINE+'" stroke-width="2.5" stroke-linecap="round"');
  }else if(exp==='yuck'){
    eyes=S('M52 88 L67 80 L76 88 M100 88 L110 80 L125 88','none','stroke="'+OUTLINE+'" stroke-width="5" stroke-linecap="round"');
    mouth=S('M78 117 Q88 103 98 117','none','stroke="'+OUTLINE+'" stroke-width="3.5" stroke-linecap="round"');
    brows=S('M50 68 L74 72 M101 72 L125 67','none','stroke="'+OUTLINE+'" stroke-width="3.5" stroke-linecap="round"');
  }else if(exp==='love'){
    eyes=S('M51 84 Q55 73 64 81 Q72 71 77 84 L64 98 Z','#E67C9D','stroke="#B55F74" stroke-width="2"')
      +S('M99 84 Q104 73 112 81 Q119 71 124 84 L111 98 Z','#E67C9D','stroke="#B55F74" stroke-width="2"');
    mouth=S('M77 114 Q88 129 101 114 Q90 119 77 114 Z','#A9505A','stroke="'+OUTLINE+'" stroke-width="2.5"');
  }else if(exp==='surprise'){
    eyes=g('eyes',E(64,y,7,10,'#3E2928')+E(113,y,7,10,'#3E2928')+E(61,83,2.7,3.5,'#FFFFFF')+E(110,83,2.7,3.5,'#FFFFFF'));
    mouth=E(89,116,9,13,'#A85C5B','stroke="'+OUTLINE+'" stroke-width="2.7"')+E(89,122,5,4,'#E99397');
    brows=S('M55 65 Q65 60 75 65 M102 65 Q112 60 123 65','none','stroke="'+OUTLINE+'" stroke-width="2.3" stroke-linecap="round"');
  }else if(exp==='taste'){
    eyes=g('eyes',E(64,y,7,10,'#392728')+E(113,y,7,10,'#392728')+E(61,84,2.4,3.5,'#FFFFFF')+E(110,84,2.4,3.5,'#FFFFFF'));
    mouth=S('M80 114 Q89 119 97 114','none','stroke="'+OUTLINE+'" stroke-width="2.7" stroke-linecap="round"')+S('M87 117 Q92 124 96 117','#E38C91','stroke="none"');
  }else if(exp==='happy'){
    eyes=S('M52 85 Q64 68 77 85 M99 85 Q112 68 124 85','none','stroke="'+OUTLINE+'" stroke-width="4" stroke-linecap="round"');
    mouth=S('M75 113 Q88 138 104 112 Q88 123 75 113 Z','#A75860','stroke="'+OUTLINE+'" stroke-width="2.7"')+E(90,126,7,3.5,'#EF9EAA');
  }else{
    eyes=g('eyes',E(63,y,7.5,11,'#3A2726')+E(113,y,7.5,11,'#3A2726')+E(60,82,3.1,4.5,'#FFFFFF')+E(110,82,3.1,4.5,'#FFFFFF')+E(66,92,1.6,2,'#9A7168')+E(116,92,1.6,2,'#9A7168'))
      +g('blink-lids',S('M51 86 Q63 96 76 86 M100 86 Q113 96 126 86','none','stroke="'+OUTLINE+'" stroke-width="3.8" stroke-linecap="round"'));
    mouth=S('M78 113 Q87 124 97 113','none','stroke="'+OUTLINE+'" stroke-width="3.1" stroke-linecap="round"');
  }
  const blush=E(48,105,15,9,'url(#{{blush}})','opacity=".72"')+E(129,105,15,9,'url(#{{blush}})','opacity=".72"')
   +S('M45 103 L49 98 M52 106 L56 102 M119 104 L123 100 M126 106 L131 102','none','stroke="#EB8996" stroke-width="2.5" stroke-linecap="round" opacity=".82"');
  const nose=species==='turkey'?S('M83 109 L100 108 L92 125 Z','#EDA950','stroke="'+OUTLINE+'" stroke-width="2"')
    :S('M81 103 Q88 99 97 103 Q96 108 89 112 Q84 108 81 103 Z','#73493E','stroke="'+OUTLINE+'" stroke-width="1.5"')
    +S('M89 110 L89 115','none','stroke="'+OUTLINE+'" stroke-width="2.5" stroke-linecap="round"');
  return blush+brows+eyes+nose+mouth;
}
function clothing(c,p){
  let behind='',front='',top='';
  if(c.outfit==='scarf'){
    behind=S('M37 128 Q84 145 139 126 Q143 138 128 151 Q76 163 41 146 Z','#E8A0B8','stroke="'+OUTLINE+'" stroke-width="3.5"')
      +S('M115 138 L146 167 L130 172 L104 148 Z','#F2B3C8','stroke="'+OUTLINE+'" stroke-width="3"');
    front=S('M47 142 Q81 153 127 140','none','stroke="#F9D1DE" stroke-width="3" stroke-dasharray="6 7"');
  }else if(c.outfit==='apron'){
    front=S('M66 133 L110 133 L121 175 Q88 188 55 173 Z','#FFF8F7','stroke="'+OUTLINE+'" stroke-width="3.5"')
      +S('M67 137 L109 137 L113 170 Q87 179 63 169 Z','#F8BFD0')
      +S('M58 147 Q86 157 117 146','none','stroke="#E88AA6" stroke-width="3"')
      +S('M85 158 C73 149 67 161 86 173 C106 159 99 150 85 158 Z','#ED799D','stroke="#B95775" stroke-width="1.3"');
  }
  if(c.headwear==='chef'){
    top=g('chef-hat',S('M46 50 Q30 42 35 27 Q39 17 53 19 Q61 3 82 11 Q104 2 113 22 Q140 18 140 42 Q138 54 128 54 Z','#FFFDF8','stroke="'+OUTLINE+'" stroke-width="4.5"')
      +S('M56 27 Q58 37 59 48 M86 19 Q88 33 87 45 M116 27 Q115 37 115 47','none','stroke="#DDD3D1" stroke-width="2.3"')
      +R(42,46,93,17,5,'#FFF8F1','stroke="'+OUTLINE+'" stroke-width="3.7"')
      +S('M85 51 C80 46 75 52 85 61 C95 52 89 47 85 51 Z','#E87894','stroke="#A45667" stroke-width="1.5"'));
  }else if(c.headwear==='bow'){
    top=g('bow',S('M125 43 Q147 18 154 42 Q159 62 126 53 Q109 68 107 49 Q111 35 125 43 Z','#F5A6C2','stroke="'+OUTLINE+'" stroke-width="3.2"')
      +E(128,49,5,7,'#FBE3EA','stroke="'+OUTLINE+'" stroke-width="2"'));
  }
  return {behind,front,top};
}

export function characterSVG(c,expression='idle'){
  const species=COLORS[c.species]?c.species:'capybara',p=COLORS[species];
  const id='mm-'+escapeId(c.id||species);
  const rim='stroke="'+OUTLINE+'" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"';
  const outlineThin='stroke="'+OUTLINE+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  let exp=['idle','blink','walk','wait','sit','sleep','order','taste','love','happy','yuck','surprise'].includes(expression)?expression:'idle';
  if(exp==='walk'||exp==='wait'||exp==='sit'||exp==='order')exp='idle';
  const special=specialParts(species,p),dress=clothing(c,p);
  const replaceDefs=s=>s.replace(/#\{\{fur\}\}/g,'#'+id+'-fur').replace(/#\{\{blush\}\}/g,'#'+id+'-blush');
  const torso=g('torso',
     E(87,157,47,42,'url(#'+id+'-body)',rim)
     +S('M60 139 Q79 131 110 141','none','stroke="'+p.light+'" stroke-width="5" stroke-linecap="round" opacity=".55"'));
  const legs=g('legs',
    g('leg leg-left',E(53,184,21,18,p.fur,rim)+E(52,192,18,8,p.shade)+S('M44 188 L42 194 M55 191 L54 197','none','stroke="#93624D" stroke-width="2.5" stroke-linecap="round"'))
   +g('leg leg-right',E(121,184,21,18,p.fur,rim)+E(121,192,18,8,p.shade)+S('M112 191 L111 197 M123 189 L123 196','none','stroke="#93624D" stroke-width="2.5" stroke-linecap="round"')));
  const arms=g('arms',
     g('arm arm-left',S('M50 133 Q31 133 28 148 Q26 167 47 171 Q60 167 57 154 Z',p.fur,rim)+E(41,160,13,10,p.light,'opacity=".35"'))
    +g('arm arm-right',S('M126 133 Q144 130 150 148 Q155 166 133 171 Q120 170 119 156 Z',p.fur,rim)+E(139,160,13,10,p.light,'opacity=".35"')));
  const headShape=CAT.has(species)?
     S('M24 78 Q18 42 54 39 Q86 26 120 39 Q154 44 150 91 Q149 130 112 142 Q88 150 58 142 Q18 132 24 78 Z','url(#'+id+'-fur)',rim):
     species==='giraffe'?S('M32 67 Q36 33 87 30 Q143 30 145 70 Q156 126 119 142 Q89 155 51 139 Q22 121 32 67 Z','url(#'+id+'-fur)',rim):
     S('M27 69 Q22 36 59 32 Q83 18 116 31 Q153 32 149 75 Q157 119 132 134 Q88 160 43 135 Q16 124 27 69 Z','url(#'+id+'-fur)',rim);
  const catPatch=CAT.has(species)?S('M30 71 Q37 46 65 48 Q76 58 69 80 Q50 87 31 83 Z',p.patch,'opacity=".95"')
      +S('M112 48 Q138 45 147 67 L145 81 Q130 88 114 76 Z','#A8A7B2','opacity=".93"')
      +S('M40 119 L24 113 M41 125 L23 129 M135 117 L151 111 M136 125 L156 130','none','stroke="#A88B8A" stroke-width="2.6" stroke-linecap="round"'):'';
  const berryClip=(species==='capybara')?
    g('strawberry-pin',S('M128 47 Q112 38 110 52 Q111 66 126 76 Q141 66 144 52 Q142 39 128 47 Z','#EF7E96','stroke="'+OUTLINE+'" stroke-width="2.6"')
    +S('M126 46 Q119 44 117 39 Q125 39 128 43 Q134 35 141 40 Q140 45 131 47 Z','#81AA76','stroke="#638C68" stroke-width="2"')
    +E(120,54,1.5,1.8,'#FFF6D6')+E(135,57,1.5,1.8,'#FFF6D6')):'';
  const faceArt=replaceDefs(face(exp,species,p));
  const isReaction=['love','happy','yuck'].includes(exp);
  const expressionLayer=g('reaction-features',faceArt);
  const firstTasteLayer=isReaction?g('tasting-features',replaceDefs(face('taste',species,p))):'';
  const head=g('head',
     replaceDefs(special.rear)
    +headShape
    +S('M39 62 Q67 29 113 43','none','stroke="#FFE5C4" stroke-width="8" stroke-linecap="round" opacity=".5"')
    +catPatch+replaceDefs(special.markings)+berryClip
    +expressionLayer+firstTasteLayer+replaceDefs(special.extras)+dress.top);
  const cheeks=species==='ghost'?E(86,137,7,5,'#D0DFF0'):''; 
  const body=species==='ghost'?replaceDefs(special.ghostShape||''):torso;
  const defs='<defs>'
    +'<radialGradient id="'+id+'-fur" cx="36%" cy="27%" r="78%"><stop stop-color="'+p.light+'"/><stop offset=".72" stop-color="'+p.fur+'"/><stop offset="1" stop-color="'+p.shade+'"/></radialGradient>'
    +'<linearGradient id="'+id+'-body" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="'+p.light+'"/><stop offset=".8" stop-color="'+p.fur+'"/><stop offset="1" stop-color="'+p.shade+'"/></linearGradient>'
    +'<radialGradient id="'+id+'-blush"><stop stop-color="#F48B9D" stop-opacity=".8"/><stop offset="1" stop-color="#F5A2A7" stop-opacity="0"/></radialGradient>'
    +'</defs>';
  const detail=species==='santa-capybara'?S('M44 33 Q70 -5 113 14 L146 41 L128 47 Z','#CE5565',rim)+E(144,40,10,10,'#FFF')+R(39,40,92,15,7,'#FFF7F6',outlineThin):'';
  const bodyGroup=g('body-rig',
    replaceDefs(special.tail)+legs+body+arms+dress.behind+dress.front+head+cheeks+detail
  );
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+CHARACTER_RIG.viewBox+'" role="img" aria-label="'+species.replace(/-/g,' ')+'" class="character-art" data-face="'+exp+'">'+defs
    +E(87,203,49,5,'#784A41','opacity=".17"')
    +bodyGroup+'</svg>';
}
