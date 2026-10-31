export function Golfer({swinging}:{swinging:boolean}) {
 return <g aria-label="A golfer practicing with an iron" role="img">
  <g transform="translate(350 489)" className={swinging?'practice-golfer is-swinging':'practice-golfer'}>
   <path d="M-11 7h25v4h-25zM-7 11h17v2H-7z" fill="#244d34" opacity=".22"/>
   {/* Feet parallel to the rightward shot; ball centered in front of the stance. */}
   <g className="golfer-trail-foot"><path d="M-7-7h7v8h-3v7h-5V0h1z" fill="#c8b584"/><path d="M-10 6h9v4h-9z" fill="#253f34"/><path d="M-8 6h5v2h-5z" fill="#f7edcf"/></g>
   <g><path d="M3-7h6v6h3v8H7V1H3z" fill="#ddcba0"/><path d="M7 6h8v4H7z" fill="#253f34"/><path d="M9 6h4v2H9z" fill="#f7edcf"/></g>
   <g className="golfer-torso">
    <path d="M-5-23H5v3h4v13H6v3H-7v-15h2z" fill="#f5e9c9"/>
    <path d="M-7-19h4v12h-4zM-3-7H6v3H-3z" fill="#ccca9e"/>
    <path d="M-6-5H7v3H-6z" fill="#365b45"/><rect x="1" y="-5" width="3" height="2" fill="#c3a26c"/>
    <path d="M-1-23h5v6l-3-3-2 2z" fill="#42664e"/>
    <path d="M-3-31h9v7H4v4H0v-4h-3z" fill="#c69570"/>
    <path d="M-3-32h3v8h-3z" fill="#916d51"/>
    <path d="M-4-33H6v3h2v4H-5v-4h1z" fill="#315b43"/><path d="M-3-33h8v2h-8z" fill="#638266"/>
   </g>
   {/* Discrete pixel poses keep the club and hands crisp throughout the swing. */}
   <g className="swing-pose pose-address"><path d="M-5-20h4v7h3v5h-4v-3h-3zM5-20h4v9H6v3H2v-5h3z" fill="#c69570"/><path d="M0-11h5v5H0z" fill="#fff5d9"/><path d="M2-6v22" stroke="#bdcdc0" strokeWidth="2" fill="none"/><path d="M1 14h5v3H1z" fill="#354f40"/><path d="M4 14h2v2H4z" fill="#d6dec9"/></g>
   <g className="swing-pose pose-takeaway"><path d="M-4-20L-12-13M7-20L-10-13" stroke="#c69570" strokeWidth="4" fill="none"/><rect x="-13" y="-15" width="5" height="4" fill="#fff5d9"/><path d="M-11-13L-38-21" stroke="#bfcec0" strokeWidth="2"/><path d="M-42-24h6v4h-6z" fill="#36523f"/></g>
   <g className="swing-pose pose-back"><path d="M-4-20L-13-25L-8-33M7-20L0-28L-8-33" stroke="#c69570" strokeWidth="4" fill="none"/><rect x="-10" y="-35" width="5" height="5" fill="#fff5d9"/><path d="M-8-33L18-46" stroke="#bfcec0" strokeWidth="2"/><path d="M17-49h6v4h-6z" fill="#36523f"/></g>
   <g className="swing-pose pose-down"><path d="M-4-20L-7-12M7-20L-5-12" stroke="#c69570" strokeWidth="4" fill="none"/><rect x="-8" y="-14" width="5" height="5" fill="#fff5d9"/><path d="M-6-12L-24-35" stroke="#bfcec0" strokeWidth="2"/><path d="M-28-38h6v4h-6z" fill="#36523f"/></g>
   <g className="swing-pose pose-release"><path d="M-4-20L5-12L17-16M7-20L17-16" stroke="#c69570" strokeWidth="4" fill="none"/><rect x="15" y="-18" width="5" height="5" fill="#fff5d9"/><path d="M17-16L38-37" stroke="#bfcec0" strokeWidth="2"/><path d="M36-40h6v4h-6z" fill="#36523f"/></g>
   <g className="swing-pose pose-finish"><path d="M-4-20L8-22L11-32M7-20L17-26L11-32" stroke="#c69570" strokeWidth="4" fill="none"/><rect x="9" y="-34" width="5" height="5" fill="#fff5d9"/><path d="M11-32L-17-43" stroke="#bfcec0" strokeWidth="2"/><path d="M-22-46h6v4h-6z" fill="#36523f"/></g>
   <path className="swing-contact" d="M3 15h3v-4h2v4h4v2H8v4H6v-4H3z" fill="#fff3c4"/>
  </g>
  <g transform="translate(357 506)"><rect className={swinging?'practice-ball in-flight':'practice-ball'} width="3" height="3" fill="#fff9e2"/></g>
  <g transform="translate(328 494)"><path d="M-5-15h11v20H-5z" fill="#9c4d39"/><path d="M-7-11h3v11h-3z" fill="#573e2e"/><path d="M-3-10h6v13h-6z" fill="#c17855"/><path d="M-3-26v11m5-14v14m5-22v22" stroke="#c6ccba" strokeWidth="2"/><path d="M-7-28h5v3h-5zM2-31h5v3H2zM6-24h5v3H6z" fill="#455748"/></g>

 </g>;
}
