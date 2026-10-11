import {create} from 'zustand';
export const useApp=create(set=>({tab:'home',setTab:(tab)=>set({tab}),brandPref:localStorage.getItem('brandPref')||'Be Bodywise',setBrand:(brandPref)=>{localStorage.setItem('brandPref',brandPref);set({brandPref});},buddy:false,setBuddy:(buddy)=>set({buddy})}));
