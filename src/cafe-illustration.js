/* Mochi Munch illustrated café scenery v0.17.
   Static scalable background and foreground, independent of the gameplay layer. */
const path=(d,fill,extra='')=>'<path d="'+d+'" fill="'+fill+'" '+extra+'/>';
const rect=(x,y,w,h,r,fill,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'" '+extra+'/>';
const ellipse=(x,y,rx,ry,fill,extra='')=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" '+extra+'/>';
const line=(d,stroke,w=3,extra='')=>path(d,'none','stroke="'+stroke+'" stroke-width="'+w+'" stroke-linecap="round" '+extra);
function berry(x,y,k=.8){
 const shape=path('M0 4 Q-18 -8 -18 10 Q-19 27 0 41 Q18 27 18 10 Q18 -8 0 4 Z','#EF8C9D','stroke="#A65E63" stroke-width="3"')+
 path('M0 7 Q-14 7 -13 -2 L0 0 Q2 -13 5 0 L15 -2 Q15 7 0 7 Z','#89AF78','stroke="#659064" stroke-width="2"')
 +ellipse(-7,16,2,2,'#FFF0CD')+ellipse(5,18,2,2,'#FFF0CD')+ellipse(0,28,2,2,'#FFF0CD');
 return '<g transform="translate('+x+' '+y+') scale('+k+')">'+shape+'</g>';
}
function flower(x,y,k=1){
 return '<g transform="translate('+x+' '+y+') scale('+k+')">'+ellipse(-7,0,8,8,'#FFF9E6')+ellipse(7,0,8,8,'#FFF9E6')+ellipse(0,-7,8,8,'#FFF9E6')+ellipse(0,7,8,8,'#FFF9E6')+ellipse(0,0,5,5,'#F3C078')+'</g>';
}
function pottedPlant(x,y,k=1){
 let leaves='';for(const [xx,yy,angle] of [[-22,-50,-32],[-9,-70,-25],[13,-65,19],[29,-42,34],[-29,-29,-43],[24,-18,28]]){
  leaves+=line('M0 0 Q'+(xx*.5)+' '+(yy*.6)+' '+xx+' '+yy,'#709774',4)
   +ellipse(xx,yy,16,9,'#A6C490','transform="rotate('+angle+' '+xx+' '+yy+')" stroke="#698D6A" stroke-width="2.5"');
 }
 return '<g transform="translate('+x+' '+y+') scale('+k+')">'+leaves
  +path('M-25 0 H25 L18 39 Q0 47 -18 39 Z','#E5A486','stroke="#AA7966" stroke-width="4"')
  +rect(-29,-5,58,11,6,'#F5C8A7','stroke="#AE7B67" stroke-width="3"')+'</g>';
}
function windowScene(x,y,w=266,h=177){
 const o='#BC7F78';
 return '<g class="illustrated-window">'
 +rect(x-9,y-9,w+18,h+26,28,'#D7A09D','stroke="#A96E6B" stroke-width="4"')
 +rect(x,y,w,h,21,'url(#mm-sky)','stroke="#FFF4E6" stroke-width="10"')
 +'<g class="window-nature">'+path('M'+x+' '+(y+h*.82)+' Q'+(x+w*.24)+' '+(y+h*.49)+' '+(x+w*.48)+' '+(y+h*.79)+' T'+(x+w)+' '+(y+h*.63)+' L'+(x+w)+' '+(y+h)+' H'+x+' Z','#B6D2A3')
 +ellipse(x+68,y+45,32,10,'#FFFFFF','opacity=".78"')+ellipse(x+w-67,y+31,36,11,'#FFFFFF','opacity=".74"')+'</g>'
 +'<g class="window-rain">'+line('M'+(x+35)+' '+(y+16)+' l-13 38 M'+(x+106)+' '+(y+11)+' l-15 42 M'+(x+w-37)+' '+(y+24)+' l-13 38','#DCF3FC',3,'opacity=".85"')+'</g>'
 +line('M'+(x+w/2)+' '+(y+5)+' V'+(y+h-7),'#FFF7EA',10)
 +line('M'+(x+4)+' '+(y+h*.57)+' H'+(x+w-4),'#FFF7EA',10)
 +path('M'+x+' '+y+' Q'+(x+35)+' '+(y+35)+' '+(x+15)+' '+(y+h*.55)+' Q'+(x+34)+' '+(y+h-2)+' '+(x-8)+' '+(y+h-4)+' Z','#ECA7B3','stroke="#C98393" stroke-width="2.5"')
 +path('M'+(x+w)+' '+y+' Q'+(x+w-35)+' '+(y+35)+' '+(x+w-15)+' '+(y+h*.55)+' Q'+(x+w-34)+' '+(y+h-2)+' '+(x+w+8)+' '+(y+h-4)+' Z','#ECA7B3','stroke="#C98393" stroke-width="2.5"')
 +line('M'+x+' '+(y+h*.58)+' l22 3 M'+(x+w)+' '+(y+h*.58)+' l-22 3','#FFF4D9',7)
 +rect(x-16,y+h+5,w+32,16,7,'#FFEADA','stroke="'+o+'" stroke-width="3.5"')
 +'</g>';
}
function hangingLamp(x,y,k=1){
 return '<g transform="translate('+x+' '+y+') scale('+k+')">'
 +line('M0 -125 V-43','#BB8B80',5)
 +path('M-48 4 Q-48 -32 0 -47 Q48 -32 48 4 Z','#F8D0B7','stroke="#B97F74" stroke-width="4.3"')
 +ellipse(0,4,49,8,'#FFEAC6','stroke="#BB8D7F" stroke-width="3')
 +ellipse(0,16,61,11,'#FFEBBA','opacity=".32"')+'</g>';
}
function sofa(x,y){
 return '<g transform="translate('+x+' '+y+')">'
 +rect(0,42,266,91,27,'#ECADB7','stroke="#A87875" stroke-width="5')
 +rect(10,0,248,95,39,'#F4C3C6','stroke="#AC7B7B" stroke-width="5')
 +rect(22,13,224,75,31,'#FAD3D2')
 +line('M94 21 Q104 54 94 84 M170 21 Q160 54 170 84','#E6AEB7',3.3)
 +rect(-18,55,55,69,18,'#F5B7C2','stroke="#AD7F7B" stroke-width="5')
 +rect(233,55,55,69,18,'#F5B7C2','stroke="#AD7F7B" stroke-width="5')
 +rect(21,110,226,34,15,'#E7A3AE','stroke="#A57370" stroke-width="4')
 +rect(27,138,24,17,5,'#AF7968')+rect(216,138,24,17,5,'#AF7968')
 +rect(48,77,54,49,15,'#FFE6D3','stroke="#CCA18F" stroke-width="2')
 +rect(167,76,52,48,15,'#F8D5E0','stroke="#CCA0AD" stroke-width="2')
 +berry(75,93,.57)+path('M194 89 C182 79 175 93 194 105 C213 90 205 79 194 89 Z','#E986A5')
 +'</g>';
}
function hangingPot(x,y){
 return '<g transform="translate('+x+' '+y+')">'+line('M-22 -70 L-15 -28 M22 -70 L15 -28','#B58F86',3)
 +pottedPlant(0,-7,.68)+berry(8,-54,.38)+'</g>';
}
function menuBoard(){
 return rect(1283,76,222,153,15,'#B47E70','stroke="#8A5A55" stroke-width="5')
  +rect(1294,89,200,125,8,'#59796B','stroke="#F2E2CD" stroke-width="3')
  +'<text x="1394" y="119" text-anchor="middle" fill="#FFF4E2" font-size="19" font-weight="bold" font-family="system-ui">MOCHI MUNCH</text>'
  +'<text x="1394" y="157" text-anchor="middle" fill="#FFF5E5" font-size="15" font-family="system-ui">♡ tiny treats ♡</text>'
  +'<text x="1394" y="189" text-anchor="middle" fill="#F9DCB6" font-size="17" font-family="system-ui">Strawberries &amp; smiles</text>';
}
export function cafeBackdropSVG(){
 let floorLines='';
 for(let x=0;x<1700;x+=105)floorLines+=line('M'+x+' 313 L'+(x+(x-830)*.11)+' 502','#BA8B7B',2,'opacity=".22"');
 for(let y=343;y<520;y+=45)floorLines+=line('M0 '+y+' H1660','#FFF3E2',3,'opacity=".48"');
 const wall=rect(0,0,1660,311,0,'url(#mm-wall)','class="wall-fill"')
 +Array.from({length:13},(_,i)=>rect(22+i*131,8,117,279,12,'none','stroke="#E6B4B4" stroke-width="2.2" opacity=".36"')).join('')
 +rect(0,290,1660,13,0,'#F8D4C9')+rect(0,304,1660,10,0,'#C48C84');
 const entrance=rect(48,108,122,205,57,'#AB7169','stroke="#875957" stroke-width="5')
 +rect(62,120,94,193,45,'#F4BBC2','stroke="#FFF0E0" stroke-width="6')
 +path('M79 164 Q91 146 109 166 Q126 149 143 167 L143 203 Q127 228 109 250 Q90 226 79 202 Z','#D6E6E9','stroke="#B88E88" stroke-width="4')
 +ellipse(138,268,7,7,'#F6D68B','stroke="#AA7E52" stroke-width="2.5"');
 const art=rect(628,63,134,114,13,'#FFF5E9','stroke="#BA8581" stroke-width="7')
 +rect(642,76,106,87,8,'#F9D7DC')+berry(696,100,1.15);
 const shelf=rect(986,166,205,13,5,'#BC8C7A','stroke="#956A5F" stroke-width="3')
 +rect(1024,126,32,40,6,'#F0CDB8','stroke="#AA796D" stroke-width="3')
 +berry(1042,133,.42)+rect(1110,137,48,28,7,'#FFF8EA','stroke="#B28B7C" stroke-width="3');
 const counterBack=rect(1440,268,149,95,18,'#F6BDB7','stroke="#B5817B" stroke-width="5')
 +rect(1424,264,181,22,6,'#FFF0DD','stroke="#BD8F7B" stroke-width="4');
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1660 500" preserveAspectRatio="none" aria-hidden="true">'
 +'<defs><linearGradient id="mm-wall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#FFF2EE"/><stop offset="1" stop-color="#F7C6C5"/></linearGradient>'
 +'<linearGradient id="mm-floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#F8D6BB"/><stop offset="1" stop-color="#E5A78F"/></linearGradient>'
 +'<linearGradient id="mm-sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#B5DDEB"/><stop offset="1" stop-color="#EDF7DC"/></linearGradient></defs>'
 +wall+rect(0,315,1660,185,0,'url(#mm-floor)')+floorLines
 +entrance+windowScene(210,45)+windowScene(904,43)
 +sofa(287,151)+ellipse(411,405,76,17,'#B77A78','opacity=".18"')
 +rect(343,367,132,43,19,'#EBAAB9','stroke="#AD797D" stroke-width="4"')
 +rect(350,358,118,24,12,'#F7CCD4','stroke="#BD8992" stroke-width="3"')
 +menuBoard()+art+shelf+counterBack
 +hangingLamp(790,113,.8)+hangingLamp(1539,115,.8)
 +hangingPot(610,155)+hangingPot(1185,150)
 +pottedPlant(195,345,.65)+pottedPlant(875,299,.68)
 +berry(1150,269,.45)+flower(1212,263,.77)
 +'</svg>';
}
export function cafeForegroundSVG(){
 let stripes='';
 for(let x=1280;x<1660;x+=62)stripes+=rect(x,409,31,85,3,'#F9CFD0','opacity=".44"');
 const counter=rect(1250,385,418,31,12,'#FFF3E1','stroke="#A97872" stroke-width="5')
 +rect(1261,405,403,103,19,'url(#mm-counter)','stroke="#A97170" stroke-width="6')
 +stripes+line('M1268 476 H1660','#B87B7D',4,'opacity=".65"')
 +berry(1380,450,.68)+berry(1585,452,.68);
 const bell=ellipse(1375,380,20,8,'#C87891','stroke="#9C6673" stroke-width="3')
 +path('M1358 377 Q1357 348 1375 348 Q1393 350 1394 377 Z','#F1A8B9','stroke="#9C6673" stroke-width="3.5"')
 +ellipse(1375,350,5,5,'#FFE0E3');
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1660 500" preserveAspectRatio="none" aria-hidden="true">'
 +'<defs><linearGradient id="mm-counter" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#F8C6C9"/><stop offset="1" stop-color="#D88996"/></linearGradient></defs>'
 +pottedPlant(33,454,.74)+counter+bell+pottedPlant(1635,481,.72)+'</svg>';
}
