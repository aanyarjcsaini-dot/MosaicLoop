export default function Logo(props){
const s=props.s||34;
const spark=<path d="M0 -11 C1.5 -3.5 3.5 -1.5 11 0 C3.5 1.5 1.5 3.5 0 11 C-1.5 3.5 -3.5 1.5 -11 0 C-3.5 -1.5 -1.5 -3.5 0 -11 Z" fill="#C6F36B"/>;
if(props.row){return<svg width={s*4.6} height={s} viewBox="0 0 168 36" role="img" aria-label="Mosaic Loop"><text x="2" y="25" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="22" fill="#171747" textLength="140" lengthAdjust="spacingAndGlyphs">mosaic loop</text><g transform="translate(156,12) scale(0.75)">{spark}</g></svg>;}
return<svg width={s*2.7} height={s*2.05} viewBox="0 0 96 72" role="img" aria-label="Mosaic Loop"><text x="4" y="29" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="27" fill="#171747" textLength="80" lengthAdjust="spacingAndGlyphs">mosaic</text><text x="4" y="58" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="27" fill="#171747" textLength="56" lengthAdjust="spacingAndGlyphs">loop</text><g transform="translate(78,50) scale(0.8)">{spark}</g></svg>;
}
