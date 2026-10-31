import type { CartDirection } from './navigation';
import { cartSprites } from './cartSprites';

export function GolfCart({wheelStep=0,direction=1}:{wheelStep?:number;direction?:CartDirection}) {
 return <g data-cart-direction={direction} transform="translate(-32.9 -42.3) scale(2.35)" shapeRendering="crispEdges">
  {cartSprites[direction*2+wheelStep%2].map((layer,i)=><path key={i} {...layer}/>)}
 </g>;
}
