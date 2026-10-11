import {create} from 'zustand';
export const useApp=create(set=>({tab:'home',setTab:(tab)=>set({tab}),brand:localStorage.getItem('brand')||'',setBrand:(brand)=>{if(brand)localStorage.setItem('brand',brand);else localStorage.removeItem('brand');set({brand});},buddy:false,setBuddy:(buddy)=>set({buddy})}));
