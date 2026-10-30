export function Golfer({swinging}:{swinging:boolean}) {
 return <g aria-label="A golfer practicing with an iron" role="img">
  <g transform="translate(350 489)">
   <ellipse cx="2" cy="7" rx="13" ry="5" fill="#244d3433"/>
   <path d="M-6-6h5V6h-5zM3-6h5V6H3z" fill="#d8c698"/>
   <path d="M-8 5h7v4h-7zM3 5h9v4H3z" fill="#293f34"/>
   <path d="M-7-22H7v17H-7z" fill="#f7ecd0"/><path d="M-7-19h14v3H-7z" fill="#345944"/>
   <path d="M-4-31h9v9h-9z" fill="#bb8961"/><path d="M-6-33H5v4h6v3H-6z" fill="#2e513e"/>
   <g className={swinging?'golfer-arm swinging':'golfer-arm'}>
    <path d="M4-21h4v10h6v4H5v-5H2v-9z" fill="#bb8961"/>
    <path d="M12-9h2v22h-2z" fill="#adb8a6"/><path d="M12 11h8v4h-8z" fill="#34493c"/>
   </g>
  </g>
  <g transform="translate(371 502)"><rect className={swinging?'practice-ball in-flight':'practice-ball'} width="3" height="3" fill="#fff9e2"/></g>
  <g transform="translate(328 494)"><path d="M-5-15h11v20H-5z" fill="#9c4d39"/><path d="M-7-11h3v11h-3z" fill="#573e2e"/><path d="M-3-26v11m5-14v14m5-22v22" stroke="#c6ccba" strokeWidth="2"/><path d="M-7-28h5v3h-5zM2-31h5v3H2zM6-24h5v3H6z" fill="#455748"/></g>
 </g>;
}
