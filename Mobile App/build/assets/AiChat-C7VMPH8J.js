import{c as m,r,j as e,B as d,A as B,h as G,I as K,H as b,i as Z}from"./index-Bqz_yRq7.js";import{A as y,b as w,a as g}from"./avatar-BY_DMo7l.js";import{B as T}from"./BottomNavigation-Bu4sqczf.js";import{W as E}from"./wifi-off-BpHlLpKY.js";import{m as O}from"./proxy-BKIinVtD.js";import"./index-D6KmJQJ9.js";import"./index-CN_ORhkT.js";import"./index-J6jMrZ_n.js";import"./house-DN19GmZm.js";import"./shopping-bag-2WnNt1kZ.js";import"./message-circle-DXZ5JbPq.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],R=m("check-check",X);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]],se=m("ellipsis-vertical",ee);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]],ae=m("mic",te);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M13.234 20.252 21 12.3",key:"1cbrk9"}],["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",key:"1pkts6"}]],re=m("paperclip",ne);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],le=m("send",ie);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],P=m("wifi",oe);function ge({onBack:Y,onNavigate:v,cartItemCount:j=0,wsUrl:$="ws://localhost:8080"}){const[a,N]=r.useState(null),[k,F]=r.useState(""),[u,I]=r.useState(!1),[S,x]=r.useState(""),l=r.useRef(null),p=r.useRef(),h=r.useRef(0),_=5,z=[{id:"bery-ai",name:"Bery AI Assistant",lastMessage:"I'm here to help with your finances!",timestamp:"Now",unread:0,isAI:!0,isOnline:!0},{id:"1",name:"Sarah Johnson",avatar:"https://i.pravatar.cc/150?img=45",lastMessage:"Thanks for the payment!",timestamp:"10:45 AM",unread:2,isOnline:!0},{id:"2",name:"Michael Chen",avatar:"https://i.pravatar.cc/150?img=33",lastMessage:"Can you send me the invoice?",timestamp:"Yesterday",unread:0,isOnline:!1},{id:"3",name:"Emma Wilson",avatar:"https://i.pravatar.cc/150?img=44",lastMessage:"Perfect, I'll send it tomorrow",timestamp:"Yesterday",unread:1,isOnline:!0},{id:"4",name:"James Rodriguez",avatar:"https://i.pravatar.cc/150?img=12",lastMessage:"How much did you invest?",timestamp:"2 days ago",unread:0,isOnline:!1}],[A,o]=r.useState({"bery-ai":[{id:1,text:`Hello! I'm Bery AI, your financial assistant. I can help you with:

• Balance inquiries
• Investment advice
• Transaction support
• Marketplace guidance

How can I help you today?`,isUser:!1,timestamp:new Date(Date.now()-6e4),status:"read"}],1:[{id:1,text:"Hey! Did you receive the payment?",isUser:!0,timestamp:new Date(Date.now()-12e4),status:"read"},{id:2,text:"Yes! Just got it. Thanks so much! 💙",isUser:!1,timestamp:new Date(Date.now()-6e4)},{id:3,text:"Thanks for the payment!",isUser:!1,timestamp:new Date(Date.now()-3e4)}]}),[c,M]=r.useState(""),W=r.useRef(null);r.useEffect(()=>(D(),()=>{l.current&&l.current.close(),p.current&&clearTimeout(p.current)}),[]);const D=()=>{try{const s=new WebSocket($);l.current=s,s.onopen=()=>{console.log("WebSocket connected"),I(!0),x(""),h.current=0,C({type:"connect",timestamp:new Date().toISOString()})},s.onmessage=t=>{try{const n=JSON.parse(t.data);L(n)}catch(n){console.error("Error parsing WebSocket message:",n)}},s.onerror=t=>{console.error("WebSocket error:",t),x("Connection error occurred")},s.onclose=()=>{if(console.log("WebSocket disconnected"),I(!1),h.current<_){h.current+=1;const t=Math.min(1e3*Math.pow(2,h.current),3e4);console.log(`Reconnecting in ${t}ms (attempt ${h.current})`),p.current=setTimeout(D,t)}else x("Unable to connect. Please refresh the page.")}}catch(s){console.error("Error creating WebSocket:",s),x("Failed to establish connection")}},C=s=>{l.current&&l.current.readyState===WebSocket.OPEN?l.current.send(JSON.stringify(s)):console.warn("WebSocket is not connected")},L=s=>{switch(s.type){case"message":if(s.contactId&&s.text){const t={id:s.messageId||Date.now(),text:s.text,isUser:!1,timestamp:s.timestamp?new Date(s.timestamp):new Date,status:"read"};o(n=>({...n,[s.contactId]:[...n[s.contactId]||[],t]}))}break;case"status":s.contactId&&s.messageId&&s.status&&o(t=>({...t,[s.contactId]:t[s.contactId]?.map(n=>n.id===s.messageId?{...n,status:s.status}:n)||[]}));break;case"typing":console.log(`${s.contactId} is typing...`);break;default:console.log("Unknown message type:",s.type)}},H=()=>{W.current?.scrollIntoView({behavior:"smooth"})};r.useEffect(()=>{a&&H()},[A,a]);const U=()=>{if(!c.trim()||!a)return;const s=Date.now(),t={id:s,text:c,isUser:!0,timestamp:new Date,status:"sent"};o(n=>({...n,[a.id]:[...n[a.id]||[],t]})),C({type:"message",contactId:a.id,messageId:s,text:c,timestamp:new Date().toISOString()}),M(""),setTimeout(()=>{o(n=>({...n,[a.id]:n[a.id].map(i=>i.id===t.id?{...i,status:"delivered"}:i)}))},500),a.isAI?setTimeout(()=>{const n={id:Date.now()+1,text:q(c),isUser:!1,timestamp:new Date,status:"read"};o(i=>({...i,[a.id]:[...i[a.id].map(f=>f.id===t.id?{...f,status:"read"}:f),n]}))},1500):setTimeout(()=>{o(n=>({...n,[a.id]:n[a.id].map(i=>i.id===t.id?{...i,status:"read"}:i)}))},2e3)},q=s=>{const t=s.toLowerCase();return t.includes("balance")||t.includes("money")||t.includes("wallet")?`Your current balance is:

💵 Total: $13,400
₿ Bery: 119,260 (1 USD = 8.9 ₿)

Would you like to see your transaction history or investment portfolio?`:t.includes("invest")?`Great question! We have several investment options:

📊 Fixed Deposit: 6% APY (Low risk)
💰 Lending Pool: 10% APY (Medium risk)
📈 Equity Pool: 15% APY (High risk)
🚀 Venture Capital: 30% APY (High risk/reward)
🏢 Real Estate: 12% APY (Medium risk)

Which interests you most?`:t.includes("send")||t.includes("transfer")?`To send money:

1. Tap 'Send' on your wallet
2. Select recipient or enter wallet ID
3. Enter amount in USD or Bery
4. Confirm transaction

You can send to any Bery user instantly with zero fees! Need help with a specific transfer?`:t.includes("marketplace")||t.includes("buy")||t.includes("shop")?`The Bery Marketplace has:

🛍️ Products: Electronics, home goods, fashion & more
💼 Services: Design, development, marketing, video editing

All payments accepted in Bery (₿) or USD. Want me to show you featured items?`:t.includes("bery")||t.includes("currency")?`Bery (₿) is the platform's native currency!

💱 Exchange Rate: 1 USD = 8.9 ₿
✅ Use for all marketplace purchases
⚡ Instant transfers, zero fees
🌍 Accepted globally on Bery

You can convert USD to Bery anytime from your wallet!`:t.includes("hi")||t.includes("hello")||t.includes("hey")?`Hi there! 👋 I'm Bery AI, your financial assistant.

I can help you with:
• Account & balance info
• Investment recommendations
• Transaction support
• Marketplace guidance
• Currency conversions

What would you like to know?`:t.includes("help")||t.includes("support")?`I'm here to help! You can ask me about:

💰 Wallet & balances
📊 Investments & returns
💸 Sending & receiving money
🛒 Marketplace purchases
₿ Bery currency info
🌍 Platform features

Just ask your question and I'll do my best to help!`:`I'm here to help with your Bery account! You can ask me about:

• Your balance & wallet
• Investment opportunities
• Sending money
• The marketplace
• Bery currency

What would you like to know?`},J=s=>s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),V=z.filter(s=>s.name.toLowerCase().includes(k.toLowerCase()));if(!a)return e.jsxs("div",{className:"h-screen flex flex-col bg-[#0a0a1a] pb-32",children:[e.jsxs("div",{className:"bg-[#1a1d24] px-5 pt-14 pb-4 flex-shrink-0 border-b border-slate-800/50",children:[e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx(d,{variant:"ghost",size:"icon",onClick:Y,className:"text-slate-300 hover:bg-slate-800/50 rounded-full h-9 w-9",children:e.jsx(B,{className:"w-5 h-5"})}),e.jsx("h1",{className:"text-xl text-white flex-1",style:{fontFamily:"Inter, sans-serif",fontWeight:700},children:"Messages"}),e.jsx("div",{className:"flex items-center gap-2",children:u?e.jsx(P,{className:"w-4 h-4 text-green-500"}):e.jsx(E,{className:"w-4 h-4 text-red-500"})})]}),S&&e.jsx("div",{className:"mb-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg",children:e.jsx("p",{className:"text-xs text-red-400",children:S})}),e.jsxs("div",{className:"relative",children:[e.jsx(G,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"}),e.jsx(K,{value:k,onChange:s=>F(s.target.value),placeholder:"Search contacts...",className:"pl-10 bg-[#2a2f38] border-slate-700/40 text-white placeholder:text-slate-500 h-10 rounded-xl"})]})]}),e.jsx("div",{className:"flex-1 overflow-y-auto",children:V.map((s,t)=>e.jsxs(O.button,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:t*.05,duration:.3},onClick:()=>N(s),className:"w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-800/30 transition-colors border-b border-slate-800/30",children:[e.jsxs("div",{className:"relative",children:[s.isAI?e.jsx("div",{className:"w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg",children:e.jsx(b,{className:"w-7 h-7 text-white"})}):e.jsxs(y,{className:"w-14 h-14 border-2 border-slate-700/50",children:[e.jsx(w,{src:s.avatar}),e.jsx(g,{children:s.name[0]})]}),s.isOnline&&e.jsx("div",{className:"absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a1a]"})]}),e.jsxs("div",{className:"flex-1 min-w-0 text-left",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("p",{className:"text-sm text-white truncate",style:{fontFamily:"Inter, sans-serif",fontWeight:600},children:s.name}),e.jsx("span",{className:"text-xs text-slate-400 ml-2 flex-shrink-0",children:s.timestamp})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("p",{className:"text-sm text-slate-400 truncate flex-1",children:s.lastMessage}),s.unread>0&&e.jsx("div",{className:"ml-2 flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center",children:e.jsx("span",{className:"text-xs text-white",style:{fontFamily:"Inter, sans-serif",fontWeight:600},children:s.unread})})]})]})]},s.id))}),e.jsx(T,{currentScreen:"ai-chat",onNavigate:v,cartItemCount:j})]});const Q=A[a.id]||[];return e.jsxs("div",{className:"h-screen flex flex-col bg-gradient-to-b from-[#0a0a1a] via-[#0d0d1d] to-[#0a0a1a] pb-32",children:[e.jsx("div",{className:"bg-gradient-to-b from-[#1a1d24] to-[#15181f] px-4 pt-14 pb-4 flex-shrink-0 border-b border-slate-800/50 shadow-xl",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(d,{variant:"ghost",size:"icon",onClick:()=>N(null),className:"text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl h-10 w-10 transition-all",children:e.jsx(B,{className:"w-5 h-5"})}),e.jsxs("div",{className:"relative",children:[a.isAI?e.jsx("div",{className:"w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/30",children:e.jsx(b,{className:"w-6 h-6 text-white"})}):e.jsxs(y,{className:"w-11 h-11 border-2 border-slate-700/50 rounded-xl",children:[e.jsx(w,{src:a.avatar}),e.jsx(g,{children:a.name[0]})]}),a.isOnline&&e.jsx("div",{className:"absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1a1d24]"})]}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("h1",{className:"text-sm text-white truncate",style:{fontFamily:"Inter, sans-serif",fontWeight:600},children:a.name}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("p",{className:"text-xs text-slate-400",children:a.isOnline?a.isAI?"AI Assistant":"Active now":"Offline"}),a.isOnline&&e.jsx("div",{className:"w-1 h-1 rounded-full bg-green-500"})]})]}),e.jsx("div",{className:"flex items-center gap-2",children:u?e.jsxs("div",{className:"flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-lg",children:[e.jsx(P,{className:"w-3.5 h-3.5 text-green-500"}),e.jsx("span",{className:"text-xs text-green-400",style:{fontFamily:"Inter, sans-serif",fontWeight:500},children:"Live"})]}):e.jsxs("div",{className:"flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/30 rounded-lg",children:[e.jsx(E,{className:"w-3.5 h-3.5 text-red-500"}),e.jsx("span",{className:"text-xs text-red-400",style:{fontFamily:"Inter, sans-serif",fontWeight:500},children:"Offline"})]})}),e.jsx(d,{variant:"ghost",size:"icon",className:"text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl h-10 w-10 transition-all",children:e.jsx(se,{className:"w-5 h-5"})})]})}),e.jsx("div",{className:"flex-1 overflow-y-auto px-4 py-4",children:e.jsxs("div",{className:"max-w-2xl mx-auto space-y-3",children:[Q.map((s,t)=>e.jsxs(O.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.3,ease:"easeOut"},className:`flex gap-3 ${s.isUser?"flex-row-reverse":"flex-row"}`,children:[!s.isUser&&e.jsx("div",{className:"flex-shrink-0 mt-1",children:a.isAI?e.jsx("div",{className:"w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg",children:e.jsx(b,{className:"w-4 h-4 text-white"})}):e.jsxs(y,{className:"w-8 h-8 border-2 border-slate-700/50",children:[e.jsx(w,{src:a.avatar}),e.jsx(g,{className:"text-xs",children:a.name[0]})]})}),e.jsxs("div",{className:`flex flex-col ${s.isUser?"items-end":"items-start"} max-w-[75%]`,children:[e.jsx("div",{className:`rounded-2xl px-4 py-3 ${s.isUser?"bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20":a.isAI?"bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 text-white shadow-lg":"bg-slate-800/80 border border-slate-700/30 text-white shadow-md"}`,style:{backdropFilter:"blur(10px)"},children:e.jsx("p",{className:"text-sm leading-relaxed break-words whitespace-pre-line",style:{fontFamily:"Inter, sans-serif"},children:s.text})}),e.jsxs("div",{className:`flex items-center gap-1.5 mt-1 px-1 ${s.isUser?"flex-row-reverse":"flex-row"}`,children:[e.jsx("span",{className:"text-xs text-slate-500",children:J(s.timestamp)}),s.isUser&&s.status&&e.jsxs("span",{className:"text-slate-400",children:[s.status==="sent"&&e.jsx(Z,{className:"w-3 h-3"}),s.status==="delivered"&&e.jsx(R,{className:"w-3 h-3"}),s.status==="read"&&e.jsx(R,{className:"w-3 h-3 text-blue-500"})]})]})]})]},s.id)),e.jsx("div",{ref:W})]})}),e.jsx("div",{className:"px-4 pb-6 flex-shrink-0 bg-gradient-to-b from-[#1a1d24] to-[#0a0a1a] border-t border-slate-800/50",children:e.jsxs("div",{className:"flex items-center gap-3 pt-4 max-w-2xl mx-auto",children:[e.jsx(d,{variant:"ghost",size:"icon",className:"text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl h-11 w-11 flex-shrink-0 transition-all",children:e.jsx(re,{className:"w-5 h-5"})}),e.jsx("div",{className:"flex-1 relative",children:e.jsx("input",{type:"text",value:c,onChange:s=>M(s.target.value),onKeyPress:s=>s.key==="Enter"&&U(),placeholder:"Type a message...",disabled:!u,className:"w-full bg-slate-800/50 border-slate-700/40 text-white placeholder:text-slate-500 h-12 px-5 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm cursor-text",style:{fontFamily:"Inter, sans-serif",cursor:"text"}})}),c.trim()?e.jsx(d,{onClick:U,disabled:!u,className:"h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 flex-shrink-0 p-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30 transition-all",children:e.jsx(le,{className:"w-5 h-5"})}):e.jsx(d,{variant:"ghost",size:"icon",disabled:!u,className:"text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl h-11 w-11 flex-shrink-0 disabled:opacity-50 transition-all",children:e.jsx(ae,{className:"w-5 h-5"})})]})}),e.jsx(T,{currentScreen:"ai-chat",onNavigate:v,cartItemCount:j})]})}export{ge as AiChat};
