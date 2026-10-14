export default function Logo(props){
const s=props.s||34;const row=props.row||false;
const spark=<path d="M0 -11 C1.5 -3.5 3.5 -1.5 11 0 C3.5 1.5 1.5 3.5 0 11 C-1.5 3.5 -3.5 1.5 -11 0 C-3.5 -1.5 -1.5 -3.5 0 -11 Z" fill="#C6F36B"/>;
if(row){return<svg width={s*3.4} height={s} viewBox="0 0 120 36" role="img" aria-label="Mosaic Loop"><text x="4" y="24" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="21" fill="#171747">mosaic loop</text><g transform="translate(112,10) scale(0.7)">{spark}</g></svg>;}
return<svg width={s*2.6} height={s*2} viewBox="0 0 92 70" role="img" aria-label="Mosaic Loop"><text x="4" y="28" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="26" fill="#171747">mosaic</text><text x="4" y="56" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="26" fill="#171747">loop</text><g transform="translate(82,48) scale(0.85)">{spark}</g></svg>;
}
