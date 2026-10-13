export default function Petals({dna}){
if(!dna)return null;
const keys=Object.keys(dna);const N=keys.length;const R=70;const cx=90;const cy=90;
const pts=keys.map((k,i)=>{const a=(i/N)*Math.PI*2-Math.PI/2;const r=(dna[k]/100)*R;return[cx+r*Math.cos(a),cy+r*Math.sin(a),k];});
const poly=pts.map(p=>p.slice(0,2).join(',')).join(' ');
return<svg viewBox="0 0 180 180" width="100%" role="img" aria-label="Wellness DNA petals">
<defs><radialGradient id="g" cx="50%" cy="40%"><stop offset="0%" stopColor="#FFE7CF"/><stop offset="100%" stopColor="#E7F4EA"/></radialGradient></defs>
<circle cx={cx} cy={cy} r={R} fill="url(#g)" opacity=".8"/>
{[25,50,75].map(r=><circle key={r} cx={cx} cy={cy} r={R*r/100} fill="none" stroke="#554B60" opacity=".15"/>)}
<polygon points={poly} fill="#6F9676" opacity=".8" style={{transition:'all .4s'}}/>
{pts.map(([x,y,k],i)=><g key={k}><circle cx={x} cy={y} r="4" fill="#6F9676"/><text x={x} y={y-8} fontSize="8" textAnchor="middle" fill="#554B60">{k}</text></g>)}
</svg>;
}
export function Ring({pct,label}){
const r=26;const c=2*Math.PI*r;
return<svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label={label}><circle cx="36" cy="36" r={r} fill="none" stroke="#EFE9F5" strokeWidth="8"/><circle cx="36" cy="36" r={r} fill="none" stroke="#6F9676" strokeWidth="8" strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round" style={{transition:'stroke-dashoffset .4s'}}/><text x="36" y="40" textAnchor="middle" fontSize="12" fontWeight="800">{label}</text></svg>;
}
