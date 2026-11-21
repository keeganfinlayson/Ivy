/* Mochi Munch v0.16: world layout, clear queue lane, and camera geometry. */
export const WORLD_WIDTH=1660;
export const LINE_SPOTS=Object.freeze([
 Object.freeze({x:.58,y:.855}),
 Object.freeze({x:.49,y:.855}),
 Object.freeze({x:.40,y:.855})
]);
// The floor corridor is reserved for customers. Furniture is kept to its perimeter.
export const LINE_CORRIDOR=Object.freeze({left:.32,right:.86,top:.675,bottom:.96});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function isInLineCorridor(x,y){
 return x>=LINE_CORRIDOR.left&&x<=LINE_CORRIDOR.right&&y>=LINE_CORRIDOR.top&&y<=LINE_CORRIDOR.bottom;
}
export function safeFurniturePosition(x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('Invalid furniture position');
 let xx=clamp(x,.06,.94), yy=clamp(y,.37,.92);
 // Keep the furniture away from both the standing line and its walking corridor.
 if(isInLineCorridor(xx,yy)){
  const choices=[
   {x:xx,y:.62,cost:Math.abs(yy-.62)},
   {x:.285,y:yy,cost:Math.abs(xx-.285)*1.4},
   {x:.905,y:yy,cost:Math.abs(xx-.905)*1.4}
  ].sort((a,b)=>a.cost-b.cost);
  xx=choices[0].x;yy=choices[0].y;
 }
 return {x:xx,y:yy};
}
export function routeFor(start,destination){
 // Customers walk along a corridor behind the line, rather than through standing guests.
 if(destination==='waiting'){
  return [{x:.18,y:.69},{x:.645,y:.69},{x:.645,y:.855}];
 }
 if(destination==='bench'){
  return [{x:start.x,y:.69},{x:.24,y:.69}];
 }
 if(destination==='counter'){
  if(start.x<.4||start.y<.75)return [{x:start.x,y:.69},{x:.73,y:.69},{x:.79,y:.855}];
  return [{x:.79,y:.855}];
 }
 if(destination==='entrance'){
  return [{x:.79,y:.69},{x:.18,y:.69},{x:.09,y:.69}];
 }
 return [];
}
export function cameraPosition(worldX,worldWidth,viewportWidth){
 if(!Number.isFinite(worldWidth)||!Number.isFinite(viewportWidth)||worldWidth<=0||viewportWidth<=0)return 0;
 return clamp(worldX*worldWidth-viewportWidth*.49,0,Math.max(0,worldWidth-viewportWidth));
}
export function distanceAlongRoute(start,route,width,height){
 let d=0,prev=start;for(const point of route){d+=Math.hypot((point.x-prev.x)*width,(point.y-prev.y)*height);prev=point}
 return d;
}
