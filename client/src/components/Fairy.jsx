export default function Fairy(props){
const s=(props&&props.size)||52;const wave=props&&props.wave;
const svg=<svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="AI Wellness Fairy">
<ellipse cx="18" cy="24" rx="11" ry="15" fill="#BFE6D2" opacity=".95" transform="rotate(-18 18 24)"/>
<ellipse cx="46" cy="24" rx="11" ry="15" fill="#D9F3E5" opacity=".95" transform="rotate(18 46 24)"/>
<ellipse cx="18" cy="24" rx="5" ry="8" fill="#E7F7EE" opacity=".9" transform="rotate(-18 18 24)"/>
<ellipse cx="46" cy="24" rx="5" ry="8" fill="#EFFBF4" opacity=".9" transform="rotate(18 46 24)"/>
<circle cx="32" cy="36" r="13" fill="#FFE3C2"/>
<circle cx="27" cy="34" r="2.4" fill="#14231D"/><circle cx="37" cy="34" r="2.4" fill="#14231D"/>
<circle cx="27.5" cy="34.5" r=".8" fill="#fff"/><circle cx="37.5" cy="34.5" r=".8" fill="#fff"/>
<circle cx="24" cy="38.5" r="2.2" fill="#FFB3A7" opacity=".8"/><circle cx="40" cy="38.5" r="2.2" fill="#FFB3A7" opacity=".8"/>
<path d="M28.5 39.5 Q32 42 35.5 39.5" stroke="#14231D" fill="none" strokeWidth="1.8" strokeLinecap="round"/>
<rect x="43" y="40" width="9" height="13" rx="3.5" fill="#0E3B2E"/><rect x="44.5" y="37" width="6" height="4.5" rx="2" fill="#5CFFB1"/>
<path d="M12 10 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 z" fill="#E8A13D"/>
<circle cx="53" cy="10" r="1.6" fill="#C86B8A"/><circle cx="56" cy="46" r="1.6" fill="#E8A13D"/>
</svg>;
if(wave){return<span className="fairywave">{svg}</span>;}
return svg;
}
