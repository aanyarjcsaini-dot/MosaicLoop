export default function Blob(props){
const c=props.c||'#F8A8C8';const s=props.s||64;const mood=props.m||'happy';
const dk='rgba(73,51,79,.85)';
const eyes=mood==='sleepy'
?<g><path d="M22 30 q3 3 6 0" stroke={dk} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M36 30 q3 3 6 0" stroke={dk} strokeWidth="2" fill="none" strokeLinecap="round"/></g>
:<g><circle cx="25" cy="29" r="3" fill={dk}/><circle cx="39" cy="29" r="3" fill={dk}/><circle cx="26" cy="28" r="1" fill="#fff"/><circle cx="40" cy="28" r="1" fill="#fff"/></g>;
const mouth=mood==='sleepy'
?<path d="M29 38 q3 2 6 0" stroke={dk} strokeWidth="2" fill="none" strokeLinecap="round"/>
:<path d="M27 37 q5 5 10 0" stroke={dk} strokeWidth="2.2" fill="none" strokeLinecap="round"/>;
return<svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Wellness buddy">
<ellipse cx="32" cy="56" rx="14" ry="4" fill={dk} opacity=".12"/>
<path d="M32 6 Q48 6 50 24 Q52 42 40 50 Q32 55 24 50 Q12 42 14 24 Q16 6 32 6 Z" fill={c}/>
<path d="M22 14 Q26 8 33 9" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".65"/>
{eyes}{mouth}
<circle cx="19" cy="35" r="3" fill="#FF7F91" opacity=".55"/><circle cx="45" cy="35" r="3" fill="#FF7F91" opacity=".55"/>
{mood==='starry'&&<g fill="#FFE59A"><path d="M50 10 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 z"/><circle cx="12" cy="12" r="1.6"/></g>}
{mood==='calm'&&<path d="M26 20 q6 -4 12 0" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".8"/>}
</svg>;
}
export function Crew(props){
const n=props.n||5;const all=['#F8A8C8','#FFE59A','#C9EAD8','#C7E5FF','#BCA5F5','#FF7F91'];
const moods=['happy','happy','sleepy','calm','happy','starry'];
const out=[];for(let i=0;i<n&&i<6;i++){out.push(<span key={i} style={{display:'inline-block',margin:'0 -6px'}}><Blob c={all[i]} m={moods[i]} s={props.s||56}/></span>);}
return<span>{out}</span>;
}
