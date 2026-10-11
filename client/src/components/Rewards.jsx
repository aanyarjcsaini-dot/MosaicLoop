import {useState} from 'react';
const TRIALS={'Be Bodywise':['Little Joys Kids DHA Trial','Man Matters Hair Trial'],'Little Joys':['Be Bodywise Sleep Trial','Root Labs Magnesium Trial'],'Man Matters':['Be Bodywise Sleep Trial','Little Joys DHA Trial'],'Root Labs':['Be Bodywise Sleep Trial','Man Matters Hair Trial']};
export default function Rewards(){
const brand=localStorage.getItem('brand')||'Be Bodywise';
const[claimed,setClaimed]=useState(JSON.parse(localStorage.getItem('trials')||'[]'));
const hist=JSON.parse(localStorage.getItem('hist')||'[]');
const streak=new Set(hist.map(h=>h.date)).size;
const unlocked=streak>=2; // demo threshold (prod 30)
const claim=t=>{const c=[...claimed,t];setClaimed(c);localStorage.setItem('trials',JSON.stringify(c));};
return<div className="card"><h3>Habit Rewards 🎉</h3>
<p className="muted">{streak} active days {unlocked?'— 30-Day Habit Unlocked (demo at 2+)!':'— reach 30 for a trial.'} Rewards consistency, not spending.</p>
{(TRIALS[brand]||[]).map(t=><div key={t} style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #ECE4D4',padding:'8px 0'}}><span>{t} <small className="muted">• from another Mosaic brand</small></span>{claimed.includes(t)?<b>✓</b>:<button className="btn" disabled={!unlocked} onClick={()=>claim(t)}>Claim trial</button>}</div>)}
{unlocked&&claimed.length>0&&<p>🎉 Trial claimed — discover in Discover tab. Habit → reward → trial → new habit.</p>}
</div>;
}
