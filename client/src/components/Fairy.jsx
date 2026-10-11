export default function Fairy({size=52}){
return<svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="AI Wellness Fairy">
<ellipse cx="20" cy="26" rx="10" ry="14" fill="#BFE6D2" opacity=".9" transform="rotate(-20 20 26)"/>
<ellipse cx="44" cy="26" rx="10" ry="14" fill="#D6F2E3" opacity=".9" transform="rotate(20 44 26)"/>
<circle cx="32" cy="34" r="12" fill="#FFE7CF"/>
<circle cx="28" cy="32" r="1.8" fill="#14231D"/><circle cx="36" cy="32" r="1.8" fill="#14231D"/>
<path d="M28 38 Q32 41 36 38" stroke="#14231D" fill="none" strokeWidth="1.6" strokeLinecap="round"/>
<rect x="42" y="38" width="8" height="12" rx="3" fill="#0E3B2E"/><rect x="43.5" y="35" width="5" height="4" rx="1.5" fill="#5CFFB1"/>
<circle cx="14" cy="14" r="1.6" fill="#E8A13D"/><circle cx="50" cy="12" r="1.3" fill="#C86B8A"/><circle cx="54" cy="44" r="1.5" fill="#E8A13D"/>
</svg>;
}
