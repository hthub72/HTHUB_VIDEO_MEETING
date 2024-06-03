(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{4814:function(e,t,a){Promise.resolve().then(a.bind(a,523))},3472:function(e,t,a){"use strict";Object.defineProperty(t,"$",{enumerable:!0,get:function(){return s}});let n=a(5355);function s(e){let{createServerReference:t}=a(6671);return t(e,n.callServer)}},523:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return m}});var n=a(7437),s=a(8008),c=a(2618),i=a(4256),r=a(8994);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,a(7461).Z)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);var o=a(8792),d=a(2265),u=a(1335);function m(){let[e,t]=(0,d.useState)(""),[a,l]=(0,d.useState)(""),[o,m]=(0,d.useState)(""),[g,b]=(0,d.useState)(),j=(0,i.b12)(),{user:y}=(0,c.aF)();async function v(){if(j&&y)try{let t=crypto.randomUUID(),n=j.call(o?"private-meeting":"default",t),s=o.split(",").map(e=>e.trim()),c=(await (0,u.h)(s)).map(e=>({user_id:e,role:"call_member"})).concat({user_id:y.id,role:"call_member"}).filter((e,t,a)=>a.findIndex(t=>t.user_id===e.user_id)===t),i=new Date(a||Date.now()).toISOString();await n.getOrCreate({data:{starts_at:i,members:c,custom:{description:e}}}),b(n)}catch(e){console.error(e),alert("Something went wrong. Please try again later.")}}return j&&y?(0,n.jsxs)("div",{className:"flex flex-col items-center space-y-6",children:[(0,n.jsxs)("h1",{className:"text-center text-2xl font-bold",children:["Welcome ",y.username,"!"]}),(0,n.jsxs)("div",{className:"mx-auto w-80 space-y-6 rounded-md bg-slate-100 p-5",children:[(0,n.jsx)("h2",{className:"text-xl font-bold",children:"Create a new meeting"}),(0,n.jsx)(f,{value:e,onChange:t}),(0,n.jsx)(h,{value:a,onChange:l}),(0,n.jsx)(x,{value:o,onChange:m}),(0,n.jsx)(s.Z,{onClick:v,className:"w-full",children:"Create meeting"})]}),g&&(0,n.jsx)(p,{call:g})]}):(0,n.jsx)(r.Z,{className:"mx-auto animate-spin"})}function f(e){let{value:t,onChange:a}=e,[s,c]=(0,d.useState)(!1);return(0,n.jsxs)("div",{className:"space-y-2",children:[(0,n.jsx)("div",{className:"font-medium",children:"Meeting info:"}),(0,n.jsxs)("label",{className:"flex items-center gap-1.5",children:[(0,n.jsx)("input",{type:"checkbox",checked:s,onChange:e=>{c(e.target.checked),a("")}}),"Add description"]}),s&&(0,n.jsxs)("label",{className:"block space-y-1",children:[(0,n.jsx)("span",{className:"font-medium",children:"Description"}),(0,n.jsx)("textarea",{value:t,onChange:e=>a(e.target.value),maxLength:500,className:"w-full rounded-md border border-gray-300 p-2"})]})]})}function h(e){let{value:t,onChange:a}=e,[s,c]=(0,d.useState)(!1),i=new Date(new Date().getTime()-6e4*new Date().getTimezoneOffset()).toISOString().slice(0,16);return(0,n.jsxs)("div",{className:"space-y-2",children:[(0,n.jsx)("div",{className:"font-medium",children:"Meeting start:"}),(0,n.jsxs)("label",{className:"flex items-center gap-1.5",children:[(0,n.jsx)("input",{type:"radio",checked:!s,onChange:()=>{c(!1),a("")}}),"Start meeting immediately"]}),(0,n.jsxs)("label",{className:"flex items-center gap-1.5",children:[(0,n.jsx)("input",{type:"radio",checked:s,onChange:()=>{c(!0),a(i)}}),"Start meeting at date/time"]}),s&&(0,n.jsxs)("label",{className:"block space-y-1",children:[(0,n.jsx)("span",{className:"font-medium",children:"Start time"}),(0,n.jsx)("input",{type:"datetime-local",value:t,onChange:e=>a(e.target.value),min:i,className:"w-full rounded-md border border-gray-300 p-2"})]})]})}function x(e){let{value:t,onChange:a}=e,[s,c]=(0,d.useState)(!1);return(0,n.jsxs)("div",{className:"space-y-2",children:[(0,n.jsx)("div",{className:"font-medium",children:"Participants:"}),(0,n.jsxs)("label",{className:"flex items-center gap-1.5",children:[(0,n.jsx)("input",{type:"radio",checked:!s,onChange:()=>{c(!1),a("")}}),"Everyone with link can join"]}),(0,n.jsxs)("label",{className:"flex items-center gap-1.5",children:[(0,n.jsx)("input",{type:"radio",checked:s,onChange:()=>c(!0)}),"Private meeting"]}),s&&(0,n.jsxs)("label",{className:"block space-y-1",children:[(0,n.jsx)("span",{className:"font-medium",children:"Participant emails"}),(0,n.jsx)("textarea",{value:t,onChange:e=>a(e.target.value),placeholder:"Enter participant email addresses separated by commas",className:"w-full rounded-md border border-gray-300 p-2"})]})]})}function p(e){let{call:t}=e,a="".concat("http://localhost:3000","/meeting/").concat(t.id);return(0,n.jsxs)("div",{className:"flex flex-col items-center gap-3 text-center",children:[(0,n.jsxs)("div",{className:"flex items-center gap-3",children:[(0,n.jsxs)("span",{children:["Invitation link:"," ",(0,n.jsx)(o.default,{href:a,className:"font-medium",children:a})]}),(0,n.jsx)("button",{title:"Copy invitation link",onClick:()=>{navigator.clipboard.writeText(a),alert("Copied to clipboard")},children:(0,n.jsx)(l,{})})]}),(0,n.jsx)("a",{href:function(e,t,a){let n=t?t.toLocaleString("en-US",{dateStyle:"full",timeStyle:"short"}):void 0;return"mailto:?subject=".concat(encodeURIComponent("Join my meeting"+(n?" at ".concat(n):"")),"&body=").concat(encodeURIComponent("Join my meeting at ".concat(e,".")+(n?"\n\nThe meeting starts at ".concat(n,"."):"")+(a?"\n\nDescription: ".concat(a):"")))}(a,t.state.startsAt,t.state.custom.description),target:"_blank",className:"text-blue-500 hover:underline",children:"Send email invitation"})]})}},1335:function(e,t,a){"use strict";a.d(t,{L:function(){return c},h:function(){return s}}),a(5355);var n=a(3472),s=(0,n.$)("1b4f9284597a43d66db82f86a066c56361b8abf7"),c=(0,n.$)("cc86ed12f27c36e272456a16cfd86ee0d9f21cf5")},8008:function(e,t,a){"use strict";a.d(t,{P:function(){return r},Z:function(){return i}});var n=a(7437),s=a(3167),c=a(1367);function i(e){let{className:t,...a}=e;return(0,n.jsx)("button",{className:function(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,c.m6)((0,s.Z)(t))}(r,t),...a})}let r="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-600 disabled:bg-gray-200"}},function(e){e.O(0,[463,674,250,558,769,971,69,744],function(){return e(e.s=4814)}),_N_E=e.O()}]);