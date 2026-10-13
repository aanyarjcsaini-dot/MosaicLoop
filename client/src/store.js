import {create} from 'zustand';
function loadProfile(){try{return JSON.parse(localStorage.getItem('profile')||'null');}catch(e){return null;}}
export const useApp=create(set=>({tab:'home',setTab:(tab)=>set({tab}),brandPref:localStorage.getItem('brandPref')||'Be Bodywise',setBrand:(brandPref)=>{localStorage.setItem('brandPref',brandPref);set({brandPref});},buddy:false,setBuddy:(buddy)=>set({buddy}),
profile:loadProfile(),
signIn:(name,email)=>{const p={name:name.trim(),email:email.trim(),photo:null};localStorage.setItem('profile',JSON.stringify(p));set({profile:p});},
signOut:()=>{localStorage.removeItem('profile');set({profile:null});}}));
