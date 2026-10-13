export default function Fairy(props){
const s=(props&&props.size)||52;const wave=props&&props.wave;
const svg=<svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="AI Wellness Friend">
<ellipse cx="32" cy="56" rx="14" ry="4" fill="#D9CCE9" opacity=".7"/>
<ellipse cx="18" cy="30" rx="8" ry="12" fill="#E9E1F5" opacity=".9"/>
<ellipse cx="46" cy="30" rx="8" ry="12" fill="#E9E1F5" opacity=".9"/>
<path d="M24 62 Q24 46 32 44 Q40 46 40 62 Z" fill="#E9E1F5" stroke="#D9CCE9"/>
<circle cx="29" cy="52" r="1.4" fill="#A8BCA4"/><circle cx="35" cy="55" r="1.4" fill="#D8B8CA"/><circle cx="33" cy="49" r="1.2" fill="#A8BCA4"/>
<rect x="27" y="38" width="10" height="9" rx="3" fill="#FFD9C4"/>
<circle cx="32" cy="28" r="11" fill="#FFDCC3"/>
<path d="M21 28 Q20 14 32 13 Q44 14 43 28 Q42 22 38 21 Q36 26 32 26 Q28 26 26 21 Q22 22 21 28 Z" fill="#554B60"/>
<circle cx="28" cy="29" r="1.7" fill="#554B60"/><circle cx="36" cy="29" r="1.7" fill="#554B60"/>
<circle cx="28.6" cy="29.5" r=".6" fill="#fff"/><circle cx="36.6" cy="29.5" r=".6" fill="#fff"/>
<path d="M28.5 33.5 Q32 36 35.5 33.5" stroke="#554B60" fill="none" strokeWidth="1.6" strokeLinecap="round"/>
<circle cx="25" cy="32" r="1.8" fill="#D8B8CA" opacity=".8"/><circle cx="39" cy="32" r="1.8" fill="#D8B8CA" opacity=".8"/>
<circle cx="41" cy="16" r="2.4" fill="#D8B8CA"/><circle cx="41" cy="16" r="1" fill="#FFF5D9"/>
<g className="armwave"><rect x="42" y="30" width="5" height="13" rx="2.5" fill="#FFDCC3" transform="rotate(-18 44 32)"/><circle cx="47" cy="31" r="3" fill="#FFDCC3"/></g>
<rect x="17" y="34" width="5" height="11" rx="2.5" fill="#FFDCC3" transform="rotate(14 19 36)"/>
<path d="M12 12 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 z" fill="#E8B8CA"/>
<circle cx="54" cy="46" r="1.6" fill="#A8BCA4"/>
</svg>;
if(wave){return<span className="fairywave loop">{svg}</span>;}
return svg;
}
