"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer,
  AreaChart, Area, Tooltip, ReferenceArea,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"

// ── Types ────────────────────────────────────────────────────────────────
interface ScoreBucket { score: number; count: number; withEmail: number; withPhone: number; withAddress: number; demographics: { age: Record<string,number>; gender: Record<string,number>; homeownership: Record<string,number>; income: Record<string,number>; wealth: Record<string,number> } }
type SelectionMode = "efficiency" | "balanced" | "scale" | "custom"
type SelectionMethod = "range" | "percent" | "size"
interface AudienceSpectrumProps { onClose: () => void; onSave?: () => void }

// ── Glass + Chart Tokens ─────────────────────────────────────────────────
const C = {
  primary: "#6B8DE3", primaryLight: "#8BA6F0", primaryDim: "rgba(107,141,227,0.15)",
  positive: "#34D399", negative: "#F87171", mutedBar: "rgba(255,255,255,0.06)",
  axisText: "rgba(255,255,255,0.3)", axisLine: "rgba(255,255,255,0.06)",
  g: { bg: "rgba(10,10,16,0.82)", card: "rgba(255,255,255,0.03)", cb: "rgba(255,255,255,0.06)",
    inner: "rgba(255,255,255,0.025)", ib: "rgba(255,255,255,0.05)", div: "rgba(255,255,255,0.06)",
    bk: "rgba(0,0,0,0.55)", t1: "rgba(255,255,255,0.92)", t2: "rgba(255,255,255,0.5)",
    t3: "rgba(255,255,255,0.3)", accent: "#8BA6F0" },
}

// ── Tooltip ──────────────────────────────────────────────────────────────
function CTip({ active, payload, label, fmt }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string|number; fmt?: (v:number)=>string }) {
  if (!active||!payload?.length) return null
  return (<div className="mn-spectrum-tooltip" style={{ background:"rgba(12,12,18,0.9)", backdropFilter:"blur(16px)", border:`1px solid ${C.g.cb}`, borderRadius:10, padding:"8px 12px", fontSize:12, color:C.g.t1, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
    {label!==undefined&&<div style={{fontSize:10,color:C.g.t3,marginBottom:4,fontWeight:500}}>Score {label}</div>}
    {payload.map((e,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,marginTop:i>0?2:0}}><div style={{width:5,height:5,borderRadius:"50%",background:e.color||C.primary,flexShrink:0}}/><span style={{color:C.g.t2}}>{e.name}</span><span style={{fontWeight:600,marginLeft:"auto",fontVariantNumeric:"tabular-nums"}}>{fmt?fmt(e.value??0):e.value?.toLocaleString()}</span></div>))}
  </div>)
}

// ── Data Gen ─────────────────────────────────────────────────────────────
function rng(s:number){return()=>{let t=(s+=0x6d2b79f5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function cl(v:number,a:number,b:number){return Math.max(a,Math.min(b,v))}
function norm(o:Record<string,number>){const s=Object.values(o).reduce((a,b)=>a+b,0);const r:Record<string,number>={};for(const k of Object.keys(o))r[k]=o[k]/s;return r}
function scl(d:Record<string,number>,n:number){const o:Record<string,number>={};let a=0;const k=Object.keys(d);for(let i=0;i<k.length-1;i++){o[k[i]]=Math.round(d[k[i]]*n);a+=o[k[i]]}o[k[k.length-1]]=Math.max(0,n-a);return o}
function dAge(t:number,r:()=>number){return norm({"18-24":Math.max(.02,.18-t*.14+(r()-.5)*.03),"25-34":Math.max(.02,.25-t*.18+(r()-.5)*.03),"35-44":.20+t*.05+(r()-.5)*.02,"45-54":.15+t*.15+(r()-.5)*.02,"55-64":.12+t*.12+(r()-.5)*.02,"65+":.08+t*.04+(r()-.5)*.02})}
function dGen(t:number,r:()=>number){const m=.52+t*.08+(r()-.5)*.04;return norm({male:m,female:1-m})}
function dHom(t:number,r:()=>number){const o=.35+t*.40+(r()-.5)*.04;return norm({owner:o,renter:1-o})}
function dInc(t:number,r:()=>number){return norm({"<50k":Math.max(.02,.30-t*.25+(r()-.5)*.03),"50-100k":Math.max(.02,.30-t*.10+(r()-.5)*.03),"100-250k":.22+t*.05+(r()-.5)*.02,"250-500k":.10+t*.18+(r()-.5)*.02,"500k+":.05+t*.15+(r()-.5)*.02})}
function dWlt(t:number,r:()=>number){return norm({"<100k":Math.max(.02,.35-t*.28+(r()-.5)*.03),"100-250k":Math.max(.02,.25-t*.08+(r()-.5)*.03),"250-500k":.20+t*.05+(r()-.5)*.02,"500k-1m":.12+t*.15+(r()-.5)*.02,"1m+":.05+t*.18+(r()-.5)*.02})}

function genBuckets():ScoreBucket[]{
  const r=rng(42),bk:ScoreBucket[]=[],rc:number[]=[];let tr=0
  for(let i=0;i<100;i++){const z=(i-48)/22;const b=Math.exp(-.5*z*z)*(0.85+r()*0.3);rc.push(b);tr+=b}
  const T=5000,cn=rc.map(v=>Math.max(1,Math.round((v/tr)*T)));cn[50]+=T-cn.reduce((a,b)=>a+b,0)
  for(let i=0;i<100;i++){const t=i/99,n=cn[i];bk.push({score:i,count:n,withEmail:Math.round(n*cl(.60+t*.35+(r()-.5)*.04,0,1)),withPhone:Math.round(n*cl(.40+t*.45+(r()-.5)*.05,0,1)),withAddress:Math.round(n*cl(.50+t*.40+(r()-.5)*.04,0,1)),demographics:{age:scl(dAge(t,r),n),gender:scl(dGen(t,r),n),homeownership:scl(dHom(t,r),n),income:scl(dInc(t,r),n),wealth:scl(dWlt(t,r),n)}})}
  return bk
}
const BK=genBuckets(),TP=BK.reduce((s,b)=>s+b.count,0)

// ── Aggregation ──────────────────────────────────────────────────────────
function agg(lo:number,hi:number){
  const sel=BK.filter(b=>b.score>=lo&&b.score<=hi),cnt=sel.reduce((s,b)=>s+b.count,0)
  const em=sel.reduce((s,b)=>s+b.withEmail,0),ph=sel.reduce((s,b)=>s+b.withPhone,0),ad=sel.reduce((s,b)=>s+b.withAddress,0)
  const avg=cnt>0?sel.reduce((s,b)=>s+b.score*b.count,0)/cnt:0
  const dk=["age","gender","homeownership","income","wealth"] as const
  const dm:Record<string,Record<string,number>>={}
  for(const d of dk){dm[d]={};for(const b of sel)for(const[k,v]of Object.entries(b.demographics[d]))dm[d][k]=(dm[d][k]||0)+v}
  const below=BK.filter(b=>b.score<lo).reduce((s,b)=>s+b.count,0)
  return{count:cnt,email:em,phone:ph,address:ad,avgScore:avg,demographics:dm,percentile:Math.round((1-(below+cnt)/TP)*100)}
}
function aggAll(){return agg(0,99)}
function dr(d:Record<string,number>,k:string){const t=Object.values(d).reduce((a,b)=>a+b,0);return t>0?(d[k]||0)/t:0}
function drm(d:Record<string,number>,ks:string[]){const t=Object.values(d).reduce((a,b)=>a+b,0);return t>0?ks.reduce((s,k)=>s+(d[k]||0),0)/t:0}
function pct(v:number){return`${(v*100).toFixed(1)}%`}
const MR:Record<Exclude<SelectionMode,"custom">,[number,number]>={efficiency:[85,99],balanced:[65,99],scale:[40,99]}
function spkData(fn:(b:ScoreBucket)=>number,w=5):{score:number;value:number}[]{
  const raw=BK.map(b=>({score:b.score,value:fn(b)}));return raw.map((d,i)=>{const lo=Math.max(0,i-Math.floor(w/2)),hi=Math.min(raw.length-1,i+Math.floor(w/2));let s=0,c=0;for(let j=lo;j<=hi;j++){s+=raw[j].value;c++}return{score:d.score,value:s/c}})
}

// ── Component ────────────────────────────────────────────────────────────
export function AudienceSpectrum({onClose,onSave}:AudienceSpectrumProps){
  const[mode,setMode]=useState<SelectionMode>("balanced")
  const[range,setRange]=useState<[number,number]>([65,99])
  const[method,setMethod]=useState<SelectionMethod>("range")
  const[isDrag,setIsDrag]=useState<"lo"|"hi"|null>(null)
  const cRef=useRef<HTMLDivElement>(null)

  const hMode=useCallback((m:SelectionMode)=>{setMode(m);if(m!=="custom")setRange(MR[m]);},[])
  const uRange=useCallback((nr:[number,number])=>{setRange(nr);const mt=(Object.keys(MR) as Exclude<SelectionMode,"custom">[]).find(k=>MR[k][0]===nr[0]&&MR[k][1]===nr[1]);setMode(mt||"custom");},[])
  const s2x=useCallback((cx:number):number=>{if(!cRef.current)return 0;const r=cRef.current.getBoundingClientRect();return cl(Math.round(((cx-r.left-48)/(r.width-64))*99),0,99);},[])

  useEffect(()=>{
    if(!isDrag)return
    const mv=(e:MouseEvent|TouchEvent)=>{const cx="touches"in e?e.touches[0].clientX:e.clientX;const s=s2x(cx);setRange(p=>isDrag==="lo"?[Math.min(s,p[1]-1),p[1]]:[p[0],Math.max(s,p[0]+1)]);setMode("custom")}
    const up=()=>setIsDrag(null)
    window.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);window.addEventListener("touchmove",mv);window.addEventListener("touchend",up)
    return()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);window.removeEventListener("touchmove",mv);window.removeEventListener("touchend",up)}
  },[isDrag,s2x])

  const sel=useMemo(()=>agg(range[0],range[1]),[range])
  const base=useMemo(()=>aggAll(),[])
  const hPct=useCallback((p:number)=>{let c=0,lo=99;for(let i=99;i>=0;i--){c+=BK[i].count;if(c>=Math.round((p/100)*TP)){lo=i;break}}uRange([lo,99])},[uRange])
  const hSize=useCallback((sz:number)=>{let c=0,lo=99;for(let i=99;i>=0;i--){c+=BK[i].count;if(c>=sz){lo=i;break}}uRange([lo,99])},[uRange])
  const curPct=useMemo(()=>Math.round((sel.count/TP)*100),[sel.count])

  const deltas=useMemo(()=>{
    const items:{label:string;selRate:number;baseRate:number;delta:number}[]=[]
    const cs:[string,string,string[]][]=[[" Homeowners","homeownership",["owner"]],["Age 45-64","age",["45-54","55-64"]],["Age 18-34","age",["18-24","25-34"]],["Age 55+","age",["55-64","65+"]],["Income $250k+","income",["250-500k","500k+"]],["Income <$50k","income",["<50k"]],["Wealth $1M+","wealth",["1m+"]],["Wealth <$100k","wealth",["<100k"]],["Renters","homeownership",["renter"]],["Age 65+","age",["65+"]]]
    for(const[l,dk,ks]of cs){const sr=drm(sel.demographics[dk]||{},ks),br=drm(base.demographics[dk]||{},ks);items.push({label:l,selRate:sr,baseRate:br,delta:sr-br})}
    items.sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));return items.slice(0,6)
  },[sel,base])

  const insight=useMemo(()=>{
    const d=sel.demographics,a45=drm(d.age||{},["45-54","55-64","65+"]),own=dr(d.homeownership||{},"owner"),hi=drm(d.income||{},["250-500k","500k+"]),er=sel.count>0?sel.email/sel.count:0
    const ba=drm(base.demographics.age||{},["45-54","55-64","65+"]),bo=dr(base.demographics.homeownership||{},"owner")
    const l:string[]=[]
    if(a45>.45)l.push(`This segment skews older — ${pct(a45)} are 45+ vs ${pct(ba)} baseline.`);else l.push(`Moderate age mix with ${pct(a45)} aged 45+.`)
    if(own>bo+.08)l.push(`Homeownership elevated at ${pct(own)} vs ${pct(bo)} — higher asset concentration.`)
    if(hi>.2)l.push(`${pct(hi)} earn $250k+ — strong premium suite targeting fit.`)
    if(er>.82)l.push(`${pct(er)} email reachability enables direct activation.`)
    return l.join(" ")
  },[sel,base])

  const rec=useMemo(()=>{
    const p=sel.count/TP
    if(p<.2){const ex=agg(Math.max(0,range[0]-15),range[1]);return{best:"Efficient targeting with strong demographic concentration",trade:"Smaller scale limits reach effectiveness",consider:`Expanding to ${Math.max(0,range[0]-15)}–${range[1]} adds ~${(ex.count-sel.count).toLocaleString()} people with moderate dilution`}}
    if(p<.5)return{best:"Balanced reach and quality — ideal for multi-channel",trade:"Moderate quality dilution at lower range",consider:"Test premium creative against top quartile"}
    return{best:"Maximum reach for awareness campaigns",trade:"Lower scores dilute premium targeting",consider:"Split into two tiers for differentiated messaging"}
  },[sel,range])

  const spk=useMemo(()=>({
    h:spkData(b=>dr(b.demographics.homeownership,"owner")),
    a:spkData(b=>drm(b.demographics.age,["45-54","55-64","65+"])),
    i:spkData(b=>drm(b.demographics.income,["250-500k","500k+"])),
    e:spkData(b=>b.count>0?b.withEmail/b.count:0),
  }),[])
  const cd=useMemo(()=>BK.map(b=>({score:b.score,count:b.count})),[])

  const handleSave = useCallback(() => {
    onSave?.()
    onClose()
  }, [onSave, onClose])

  // ── Render ─────────────────────────────────────────────────────────────
  return(<AnimatePresence>
    <motion.div className="mn-spectrum-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
      style={{position:"fixed",inset:0,zIndex:9999,background:C.g.bk,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}} onClick={onClose}>
      <motion.div className="mn-spectrum-modal" initial={{opacity:0,y:20,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.97}}
        transition={{duration:0.4,ease:[0.22,1,0.36,1]}} onClick={e=>e.stopPropagation()}
        style={{position:"absolute",top:48,left:16,right:16,bottom:16,borderRadius:20,background:C.g.bg,backdropFilter:"blur(40px) saturate(1.3)",WebkitBackdropFilter:"blur(40px) saturate(1.3)",border:`1px solid ${C.g.cb}`,boxShadow:"0 24px 80px rgba(0,0,0,0.5),0 0 0 0.5px rgba(255,255,255,0.04) inset",display:"flex",flexDirection:"column",overflow:"hidden",fontFamily:"'Overused Grotesk',system-ui,sans-serif",color:C.g.t1}}>

        {/* Header */}
        <div className="mn-spectrum-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${C.g.div}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:32,height:32,borderRadius:8,background:C.primaryDim,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="10" width="2" height="5" rx=".5" fill={C.primary} opacity=".5"/><rect x="4.5" y="7" width="2" height="8" rx=".5" fill={C.primary} opacity=".65"/><rect x="8" y="4" width="2" height="11" rx=".5" fill={C.primary} opacity=".8"/><rect x="11.5" y="1" width="2" height="14" rx=".5" fill={C.primary}/></svg>
            </div>
            <div><h2 style={{margin:0,fontSize:15,fontWeight:600,letterSpacing:"-0.01em"}}>Audience Spectrum</h2><p style={{margin:0,fontSize:12,color:C.g.t3,marginTop:1}}>Premium Suite Propensity · {TP.toLocaleString()} fans</p></div>
          </div>
          <button className="mn-spectrum-close" onClick={onClose} style={{background:"none",border:`1px solid ${C.g.cb}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.g.t2,transition:"all 0.2s"}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l12 12M13 1L1 13"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="mn-spectrum-body" style={{display:"grid",gridTemplateColumns:"1fr 1fr",flex:1,overflow:"hidden",minHeight:0}}>

          {/* LEFT */}
          <div className="mn-spectrum-left" style={{padding:"24px 28px",borderRight:`1px solid ${C.g.div}`,display:"flex",flexDirection:"column",gap:20,overflow:"hidden"}}>
            <div><h3 style={{margin:0,fontSize:18,fontWeight:600,letterSpacing:"-0.02em"}}>Score Distribution</h3><p style={{margin:"4px 0 0",fontSize:13,color:C.g.t3}}>Drag handles to define your target segment</p></div>

            {/* Modes */}
            <div style={{display:"flex",gap:6}}>
              {(["efficiency","balanced","scale","custom"] as SelectionMode[]).map(m=>(<button key={m} className={`mn-spectrum-mode-${m}`} onClick={()=>hMode(m)} style={{padding:"6px 14px",borderRadius:8,border:mode===m?`1px solid rgba(107,141,227,0.35)`:`1px solid ${C.g.cb}`,background:mode===m?C.primaryDim:"transparent",color:mode===m?C.g.accent:C.g.t2,fontSize:12,fontWeight:500,cursor:m==="custom"&&mode!=="custom"?"default":"pointer",opacity:m==="custom"&&mode!=="custom"?.35:1,textTransform:"capitalize",transition:"all 0.2s",fontFamily:"inherit"}}>{m}</button>))}
            </div>

            {/* Chart */}
            <div className="mn-spectrum-chart" ref={cRef} style={{position:"relative",flex:1,minHeight:180,maxHeight:240,userSelect:"none",borderRadius:12,background:C.g.inner,border:`1px solid ${C.g.ib}`,padding:"12px 0 0"}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cd} margin={{top:8,right:16,bottom:20,left:48}} barCategoryGap={0}>
                  <defs><linearGradient id="mn-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.primaryLight} stopOpacity={0.95}/><stop offset="100%" stopColor={C.primary} stopOpacity={0.55}/></linearGradient></defs>
                  <XAxis dataKey="score" tick={{fontSize:10,fill:C.axisText}} tickLine={false} axisLine={{stroke:C.axisLine}} ticks={[0,25,50,75,99]} interval={0}/>
                  <YAxis hide/>
                  <Tooltip content={<CTip/>} cursor={{fill:"rgba(255,255,255,0.02)"}}/>
                  <ReferenceArea x1={range[0]} x2={range[1]} fill="rgba(107,141,227,0.06)"/>
                  <Bar dataKey="count" radius={[2,2,0,0]} isAnimationActive={false}>
                    {cd.map(d=><Cell key={d.score} fill={d.score>=range[0]&&d.score<=range[1]?"url(#mn-bg)":C.mutedBar} style={{transition:"fill 0.15s ease"}}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {(["lo","hi"] as const).map(h=>{const sc=h==="lo"?range[0]:range[1];return(
                <div key={h} className={`mn-spectrum-handle-${h}`} onMouseDown={e=>{e.preventDefault();setIsDrag(h)}} onTouchStart={()=>setIsDrag(h)}
                  style={{position:"absolute",top:20,bottom:20,width:16,left:`calc(48px + ${(sc/99)*100}% * (1 - 64px/100%) - 8px)`,cursor:"ew-resize",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:4,height:32,borderRadius:2,background:isDrag===h?C.primary:"rgba(107,141,227,0.6)",transition:"background 0.15s",boxShadow:"0 0 12px rgba(107,141,227,0.3)"}}/>
                </div>)})}
              <div style={{position:"absolute",top:4,left:"50%",transform:"translateX(-50%)",fontSize:11,color:C.g.accent,fontWeight:600,background:"rgba(10,10,16,0.8)",backdropFilter:"blur(8px)",padding:"2px 10px",borderRadius:6,pointerEvents:"none",border:`1px solid ${C.g.ib}`}}>{range[0]}–{range[1]}</div>
            </div>

            {/* Method */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"inline-flex",background:C.g.inner,borderRadius:8,padding:3,gap:2,alignSelf:"flex-start",border:`1px solid ${C.g.ib}`}}>
                {([["range","Score Range"],["percent","Top %"],["size","Audience Size"]] as [SelectionMethod,string][]).map(([m,l])=>(<button key={m} onClick={()=>setMethod(m)} style={{padding:"5px 12px",borderRadius:6,border:"none",background:method===m?"rgba(255,255,255,0.06)":"transparent",color:method===m?C.g.t1:C.g.t3,fontSize:11,fontWeight:500,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit"}}>{l}</button>))}
              </div>
              {method==="percent"&&<div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:12,color:C.g.t2,minWidth:52}}>Top {curPct}%</span><input type="range" min={1} max={100} value={curPct} onChange={e=>hPct(Number(e.target.value))} style={{flex:1,accentColor:C.primary}}/></div>}
              {method==="size"&&<div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:12,color:C.g.t2,minWidth:52}}>{sel.count.toLocaleString()}</span><input type="range" min={50} max={TP} value={sel.count} onChange={e=>hSize(Number(e.target.value))} style={{flex:1,accentColor:C.primary}}/></div>}
              {method==="range"&&<p style={{fontSize:11,color:C.g.t3,margin:0}}>Drag the handles on the chart above</p>}
            </div>

            {/* Summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[{l:"SCORE RANGE",v:`${range[0]}–${range[1]}`},{l:"AUDIENCE",v:sel.count.toLocaleString()},{l:"PERCENTILE",v:`Top ${sel.percentile>0?sel.percentile:"<1"}%`},{l:"EMAIL REACH",v:pct(sel.count>0?sel.email/sel.count:0),s:sel.email.toLocaleString()},{l:"PHONE REACH",v:pct(sel.count>0?sel.phone/sel.count:0),s:sel.phone.toLocaleString()},{l:"AVG SCORE",v:sel.avgScore.toFixed(1)}].map((m,i)=>(
                <div key={i} className={`mn-spectrum-metric-${i}`} style={{background:C.g.inner,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.g.ib}`}}>
                  <div style={{fontSize:10,fontWeight:600,color:C.g.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{m.l}</div>
                  <div style={{fontSize:17,fontWeight:700,letterSpacing:"-0.02em",lineHeight:1.1}}>{m.v}</div>
                  {"s"in m&&m.s&&<div style={{fontSize:11,color:C.g.t3,marginTop:2}}>{m.s}</div>}
                </div>))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="mn-spectrum-right" style={{padding:"24px 28px",overflowY:"auto",display:"flex",flexDirection:"column",gap:24}}>
            {/* Segment */}
            <section><Lbl>Selected Segment</Lbl>
              <div style={{background:C.g.card,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.g.cb}`}}>
                <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:14}}>
                  <span style={{fontSize:32,fontWeight:700,letterSpacing:"-0.03em",lineHeight:1}}>{sel.count.toLocaleString()}</span>
                  <span style={{fontSize:13,color:C.g.t2}}>people · scores {range[0]}–{range[1]}</span>
                </div>
                <div style={{display:"flex",gap:20}}>
                  {([["Email",sel.email],["Phone",sel.phone],["Address",sel.address]] as [string,number][]).map(([lb,ct])=>{const rt=sel.count>0?ct/sel.count:0;return(
                    <div key={lb} style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:rt>.8?C.positive:rt>.6?"#FBBF24":C.g.t3}}/>
                      <span style={{fontSize:12,color:C.g.t2}}>{lb} <span style={{color:C.g.t1,fontWeight:600}}>{pct(rt)}</span></span>
                    </div>)})}
                </div>
              </div>
            </section>

            {/* Insight */}
            <section><Lbl>Why this segment matters</Lbl>
              <p style={{fontSize:13,lineHeight:1.7,color:C.g.t2,margin:0}}>{insight}</p>
            </section>

            {/* Deltas */}
            <section><Lbl>Compared to baseline</Lbl>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {deltas.map((d,i)=>{const pos=d.delta>=0,bw=Math.min(Math.abs(d.delta)*400,100);return(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"110px 80px 1fr 52px",alignItems:"center",gap:8,fontSize:12}}>
                    <span style={{color:C.g.t2,fontWeight:500}}>{d.label}</span>
                    <span style={{color:C.g.t3,fontSize:11}}>{pct(d.selRate)} vs {pct(d.baseRate)}</span>
                    <div style={{height:5,background:"rgba(255,255,255,0.04)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${bw}%`,borderRadius:3,background:pos?`linear-gradient(90deg,${C.primary},${C.primaryLight})`:`linear-gradient(90deg,${C.negative},rgba(248,113,113,0.6))`,transition:"width 0.3s ease"}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,color:pos?C.g.accent:C.negative,textAlign:"right"}}>{pos?"+":""}{(d.delta*100).toFixed(0)} pts</span>
                  </div>)})}
              </div>
            </section>

            {/* Sparklines */}
            <section><Lbl>How audience evolves across score</Lbl>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {([["Homeownership",spk.h],["Age 45+",spk.a],["Income $250k+",spk.i],["Email Reach",spk.e]] as [string,{score:number;value:number}[]][]).map(([lb,dt],idx)=>(
                  <div key={lb} style={{background:C.g.inner,borderRadius:10,padding:"12px 14px 8px",border:`1px solid ${C.g.ib}`}}>
                    <span style={{fontSize:11,fontWeight:500,color:C.g.t3,display:"block",marginBottom:6}}>{lb}</span>
                    <div style={{height:52}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dt} margin={{top:2,right:2,bottom:0,left:2}}>
                          <defs><linearGradient id={`mn-s${idx}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.primary} stopOpacity={0.3}/><stop offset="100%" stopColor={C.primary} stopOpacity={0}/></linearGradient></defs>
                          <ReferenceArea x1={range[0]} x2={range[1]} fill="rgba(107,141,227,0.08)"/>
                          <Area type="monotone" dataKey="value" stroke={C.primary} strokeWidth={1.5} fill={`url(#mn-s${idx})`} isAnimationActive={false}/>
                          <Tooltip content={<CTip fmt={v=>pct(v)}/>}/>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>))}
              </div>
            </section>

            {/* Rec */}
            <section><Lbl>Recommendation</Lbl>
              <div style={{background:C.g.card,borderRadius:14,padding:"16px 18px",border:`1px solid ${C.g.cb}`,display:"flex",flexDirection:"column",gap:10}}>
                {([["◎","Best for",rec.best],["△","Tradeoff",rec.trade],["→","Consider",rec.consider]] as [string,string,string][]).map(([ic,lb,tx],i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:13,lineHeight:"20px",color:C.g.accent,flexShrink:0}}>{ic}</span>
                    <div><span style={{fontSize:11,fontWeight:600,color:C.g.t3,marginRight:6}}>{lb}:</span><span style={{fontSize:13,color:C.g.t2,lineHeight:1.5}}>{tx}</span></div>
                  </div>))}
              </div>
              <div style={{display:"flex",gap:8,marginTop:14}}>
                <button onClick={handleSave} style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.primary},${C.primaryLight})`,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",boxShadow:"0 2px 12px rgba(107,141,227,0.25)"}}>Save Segment</button>
                <button style={{flex:1,padding:"11px 0",borderRadius:10,border:`1px solid ${C.g.cb}`,background:"transparent",color:C.g.t2,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>Export</button>
                <button style={{flex:1,padding:"11px 0",borderRadius:10,border:`1px solid ${C.g.cb}`,background:"transparent",color:C.g.t2,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>Activate</button>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>)
}

function Lbl({children}:{children:React.ReactNode}){return<h4 style={{margin:"0 0 10px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:C.g.t3}}>{children}</h4>}
