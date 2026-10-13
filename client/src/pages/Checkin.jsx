import CheckinFlow from '../components/CheckinFlow.jsx';
export default function Checkin(){
return<div style={{display:'grid',gap:12}}>
<div><h1 className="pagehead">Check-in</h1><p className="muted">6 quick taps. Your mirror, not a medical test.</p></div>
<CheckinFlow/>
</div>;
}
