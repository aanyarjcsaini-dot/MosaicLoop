import {weekDist,patternBullets,describeIdentity} from '../lib/wellness.js';import Blob from './Blobs.jsx';
const LBL={sleep:'Sleep',energy:'Energy',mood:'Mood',stress:'Stress',food:'Food',skin:'Skin'};
export default function IdentityPopup(props){
const ident=props.ident,list=props.entries||[],now=props.picks||{},close=props.onClose;
const dist=weekDist(list);
const low=dist.slice(0,2);
const pats=patternBullets(list);
const an=describeIdentity(ident.id,list);
return<div><div className="scrim" onClick={close}/>
<div className="sheet" role="dialog" aria-label={ident.name}>
<div style={{display:'flex',gap:10,alignItems:'center'}}><Blob c={ident.blob||'#F8A8C8'} m={ident.mood||'happy'} s={44}/>
<div><h3 style={{margin:0,color:ident.color}}>{ident.name}</h3><p className="muted" style={{margin:0}}>{ident.blurb}</p></div></div>
{pats.length>0&&<div style={{marginTop:8}}><b>Patterns in your data</b>{pats.map(function(p,i){return<div key={i} className="muted">• {p}</div>;})}</div>}
<div style={{marginTop:8,background:'#E6E0FF',borderRadius:14,padding:10}}><b>Tomorrow, try:</b> {an.tip}</div>
<div style={{marginTop:8}}><b>Last 7 days — share of your best answers</b>
{dist.length?dist.map(function(d){return<div key={d.key} style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}><span style={{width:64,fontSize:12}}>{LBL[d.key]||d.key}</span><div style={{flex:1,height:10,background:'#EFE9F5',borderRadius:99}}><div style={{width:d.pct+'%',height:'100%',background:ident.color,borderRadius:99}}/></div><span style={{fontSize:12,width:36}}>{d.pct}%</span></div>;}):<p className="muted">Check in a few days to grow this chart.</p>}</div>
{low.length>0&&<p className="muted">Gentle focus: {(low.map(function(d){return LBL[d.key]||d.key;})).join(' + ')}</p>}
<button className="btn" style={{marginTop:8}} onClick={close}>Close</button>
</div></div>;
}
