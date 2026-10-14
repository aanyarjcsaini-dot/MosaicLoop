import {create} from 'zustand';
function loadProfile(){try{return JSON.parse(localStorage.getItem('profile')||'null');}catch(e){return null;}}
function newUid(){return' ml-'.slice(1)+Math.random().toString(36).slice(2,8).toUpperCase();}
export const useApp=create(set=>({tab:'home',setTab:(tab)=>set({tab}),brandPref:localStorage.getItem('brandPref')||'Be Bodywise',setBrand:(brandPref)=>{localStorage.setItem('brandPref',brandPref);set({brandPref});},buddy:false,setBuddy:(buddy)=>set({buddy}),
sideOpen:false,setSideOpen:(sideOpen)=>set({sideOpen}),
sideCollapsed:true,setSideCollapsed:(sideCollapsed)=>set({sideCollapsed}),
aiSeen:false,setAiSeen:(aiSeen)=>set({aiSeen}),
profile:loadProfile(),
signIn:(name,email)=>{const n=name.trim();const p={name:n,username:n.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')||'member',uid:newUid(),email:email.trim(),photo:null};localStorage.setItem('profile',JSON.stringify(p));set({profile:p});},
signOut:()=>{localStorage.removeItem('profile');set({profile:null});}}));
