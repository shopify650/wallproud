import type { CollectWidgetRow } from "@/lib/supabase/types";

function escJS(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/`/g, "\\`");
}

export function generateCollectEmbedScript(
  widget: CollectWidgetRow,
  baseUrl: string,
): string {
  const origin = baseUrl || "https://wallproud.com";
  const w = widget;

  const posCSS = w.position === "bottom-left" ? "left:24px" : w.position === "bottom-center" ? "left:50%;transform:translateX(-50%)" : "right:24px";
  const isPopup = w.display_type === "popup";
  const panelPosCSS = isPopup
    ? "top:50%;left:50%;transform:translate(-50%,-50%)"
    : "bottom:90px;" + posCSS;
  const panelClosedTransform = isPopup ? "" : w.position === "bottom-center" ? "translateX(-50%) translateY(20px)" : "translateY(20px)";
  const panelOpenTransform = isPopup ? "" : w.position === "bottom-center" ? "translateX(-50%) translateY(0)" : "translateY(0)";
  const panelCSS = isPopup
    ? "opacity:0;transition:opacity 0.3s ease,transform 0.3s ease;transform:translate(-50%,-48%);pointer-events:none;"
    : "transform:" + panelClosedTransform + ";opacity:0;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);pointer-events:none;";
  const panelOpenCSS = isPopup
    ? "opacity:1;pointer-events:all;transform:translate(-50%,-50%)"
    : "opacity:1;pointer-events:all;transform:" + panelOpenTransform;

  const panelStartClass = w.display_type === 'inline' ? 'wp-inline-host' : 'wp-panel';

  return `(function(){
'use strict';
var W='${escJS(w.primary_color)}';
var H='${escJS(w.heading)}';
var D='${escJS(w.description)}';
var PL='${escJS(w.placeholder)}';
var TY='${escJS(w.thank_you_message)}';
var S=${w.show_star_rating};
var SN=${w.show_name};
var NR=${w.name_required};
var SE=${w.show_email};
var ER=${w.email_required};
var SC=${w.show_company};
var CR=${w.company_required};
var SP=${w.show_phone};
var PR=${w.phone_required};
var SV=${w.show_video};
var MX=${w.max_characters};
var MN=${w.min_characters};
var AC=${w.auto_close_seconds};
var CF=${w.show_confetti};
var PB=${w.show_powered_by};
var TR='${escJS(w.trigger)}';
var SCROLL_PCT=${w.scroll_percent};
var DELAY_S=${w.delay_seconds};
var POS='${escJS(w.position)}';
var DT='${escJS(w.display_type)}';
var WID='${w.id}';
var API='${origin}';
var panelPosCSS='${panelPosCSS}';
var isPopup=${isPopup};

var cid='wp-collect-'+WID;
if(document.getElementById(cid))return;
var c=document.createElement('div');
c.id=cid;
var isInline=DT==='inline';
if(isInline){
  c.className='wp-inline-host';
  c.style.cssText='width:100%;max-width:560px;margin:0 auto;background:#fff;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25),0 0 0 1px rgba(0,0,0,0.05);overflow:hidden;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;opacity:1;transform:none;pointer-events:auto';
}else{
  c.style.cssText='position:fixed;inset:0;z-index:99999;pointer-events:none';
}
var sh=isInline ? c : c.attachShadow({mode:'open'});
var posCSS='${posCSS}';
sh.innerHTML='<style>'
+'@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");'
+'*{box-sizing:border-box;margin:0;padding:0}'
+'body{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:15px;color:#1f2937;line-height:1.5}'
+'.wp-panel{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'+(isInline ? 'position:static;' : 'position:absolute;'+panelPosCSS+';')+'width:100%;max-width:100%;max-height:none;background:#fff;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25),0 0 0 1px rgba(0,0,0,0.05);overflow:hidden;'+(isInline ? 'opacity:1;transform:none;pointer-events:auto;' : isPopup ? 'opacity:0;transition:opacity 0.3s ease,transform 0.3s ease;transform:translate(-50%,-48%);pointer-events:none;' : 'transform:'+panelClosedTransform+';opacity:0;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);pointer-events:none;')+'display:flex;flex-direction:column}'
+'.wp-panel.open{opacity:1;pointer-events:all'+(isInline ? '' : isPopup ? ';transform:translate(-50%,-50%)' : ';transform:'+panelOpenTransform)+'}'
+'.wp-inline-host{position:relative;width:100%;max-width:560px;margin:0 auto;background:#fff;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25),0 0 0 1px rgba(0,0,0,0.05);overflow:hidden;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;opacity:1;transform:none;pointer-events:auto}'
+'.wp-inline-host .wp-form{padding:24px}'
+'.wp-inline-host .wp-hdr{padding:24px 24px 0}'
+'.wp-inline-host .wp-ft{padding:16px 24px}'
+'.wp-hdr{display:flex;align-items:flex-start;justify-content:space-between;padding:24px 24px 0}'
+'.wp-hdr h3{font-size:20px;font-weight:700;color:#111827;letter-spacing:-0.02em;line-height:1.3}'
+'.wp-subtitle{font-size:13px;color:#6b7280;margin-top:4px;line-height:1.4}'
+'.wp-close{width:32px;height:32px;border-radius:10px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all 0.15s;flex-shrink:0;margin-top:2px}'
+'.wp-close:hover{background:#f3f4f6;color:#111827;border-color:#d1d5db}'
+'.wp-desc{display:none}'
+'.wp-form{padding:20px 24px 24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}'
+'.wp-stars{display:flex;gap:8px;font-size:32px;cursor:pointer;justify-content:center;padding:4px 0}'
+'.wp-stars span{transition:transform 0.15s ease,filter 0.15s ease;filter:grayscale(1) opacity(0.25);cursor:pointer;user-select:none;display:flex;align-items:center;justify-content:center}'
+'.wp-stars span.sel,.wp-stars span:hover{filter:none;transform:scale(1.15)}'
+'.wp-stars svg{width:32px;height:32px;color:#d1d5db}'
+'.wp-stars span.sel svg,.wp-stars span:hover svg{color:#fbbf24}'
+'.wp-field-group{display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid #e5e7eb;border-radius:14px;padding:0 16px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);box-shadow:0 1px 2px rgba(0,0,0,0.04)}'
+'.wp-field-group:focus-within{border-color:'+W+';background:#fff;box-shadow:0 0 0 4px '+W+'12,0 1px 2px rgba(0,0,0,0.04)}'
+'.wp-field-icon{color:#9ca3af;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:color 0.25s}'
+'.wp-field-group:focus-within .wp-field-icon{color:'+W+'}'
+'.wp-field-icon svg{width:18px;height:18px}'
+'.wp-field-group .wp-field,.wp-field-group input,.wp-field-group textarea{width:100%;padding:14px 0;border:none;background:transparent;font-size:14px;font-family:inherit;color:#111827;outline:none;font-weight:500}'
+'.wp-field-group .wp-field::placeholder,.wp-field-group input::placeholder,.wp-field-group textarea::placeholder{color:#b0b7c3;font-weight:400}'
+'.wp-textarea{width:100%;padding:14px 16px;border:1.5px solid #e5e7eb;border-radius:14px;font-size:14px;font-family:inherit;color:#111827;outline:none;resize:vertical;min-height:110px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);background:#fff;font-weight:500;box-shadow:0 1px 2px rgba(0,0,0,0.04)}'
+'.wp-textarea::placeholder{color:#b0b7c3;font-weight:400}'
+'.wp-textarea:focus{border-color:'+W+';box-shadow:0 0 0 4px '+W+'12,0 1px 2px rgba(0,0,0,0.04)}'
+'.wp-textarea-wrap{display:flex;flex-direction:column;gap:8px}'
+'.wp-char{font-size:12px;color:#9ca3af;text-align:right;font-weight:500;padding-right:4px}'
+'.wp-submit{width:100%;padding:14px;border:none;border-radius:12px;background:'+W+';color:#fff;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:-0.01em;margin-top:4px}'
+'.wp-submit:hover{opacity:0.92;transform:translateY(-1px);box-shadow:0 4px 12px '+W+'44}'
+'.wp-submit:active{transform:translateY(0)}'
+'.wp-submit:disabled{opacity:0.6;cursor:not-allowed;transform:none;box-shadow:none}'
+'.wp-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99998;opacity:0;transition:opacity 0.3s ease;pointer-events:none;backdrop-filter:blur(4px)}'
+'.wp-backdrop.open{opacity:1;pointer-events:auto}'
+'.wp-succ{display:none;padding:48px 24px;text-align:center}'
+'.wp-succ-ic{font-size:56px;margin-bottom:16px;animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1)}'
+'.wp-succ h3{font-size:22px;font-weight:700;color:#111827;margin-bottom:8px;letter-spacing:-0.02em}'
+'.wp-succ p{font-size:14px;color:#6b7280;line-height:1.5}'
+'.wp-err{color:#ef4444;font-size:13px;text-align:center;display:none;padding:8px 12px;background:#fef2f2;border-radius:8px;font-weight:500}'
+'.wp-ft{padding:16px 24px;border-top:1px solid #f3f4f6;text-align:center;font-size:12px;color:#9ca3af}'
+'.wp-ft a{color:#9ca3af;text-decoration:none;font-weight:500;transition:color 0.15s}'
+'.wp-ft a:hover{color:'+W+'}'
+'.cfetti{position:absolute;top:50%;left:50%;pointer-events:none;z-index:100000;transform:translate(-50%,-50%)}'
+'.cfetti span{position:absolute;width:10px;height:10px;border-radius:3px;animation:cfa 1.5s ease-out forwards}'
+'@keyframes cfa{0%{transform:translateY(0) rotate(0deg) scale(1);opacity:1}50%{opacity:1}100%{transform:translateY(-200px) rotate(720deg) scale(0.5);opacity:0}}'
+'@keyframes popIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}'
+'@keyframes fieldFocus{0%{transform:scale(1)}50%{transform:scale(1.01)}100%{transform:scale(1)}}'
+'</style>'
+'<div class="'+panelStartClass+'" id="pn">'
+'<div class="wp-hdr"><div><h3>'+H+'</h3><p class="wp-subtitle">'+D+'</p></div><button class="wp-close" id="cb"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg></button></div>'
+'<form class="wp-form" id="fm">'
+(S?'<div class="wp-stars" id="st">'+Array(5).fill(0).map((_,i)=>'<span data-i="'+i+'"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>').join('')+'</div>':'')
+'<div class="wp-textarea-wrap">'
+'<textarea class="wp-field wp-textarea" id="ct" placeholder="'+PL+'" rows="4" maxlength="'+MX+'"></textarea>'
+'</div>'
+'<div class="wp-char"><span id="cc">0</span> / '+MX+'</div>'
+(SN?'<div class="wp-field-group"><div class="wp-field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><input class="wp-field" id="nm" placeholder="Your name" '+(NR?'required':'')+' /></div>':'')
+(SE?'<div class="wp-field-group"><div class="wp-field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div><input class="wp-field" id="em" type="email" placeholder="Email" '+(ER?'required':'')+' /></div>':'')
+(SC?'<div class="wp-field-group"><div class="wp-field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><input class="wp-field" id="co" placeholder="Company" '+(CR?'required':'')+' /></div>':'')
+(SP?'<div class="wp-field-group"><div class="wp-field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div><input class="wp-field" id="ph" type="tel" placeholder="Phone" '+(PR?'required':'')+' /></div>':'')
+(SV?'<div class="wp-field-group"><div class="wp-field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg></div><input class="wp-field" id="vi" type="url" placeholder="Video URL" /></div>':'')
+'<button type="submit" class="wp-submit" id="sb">Submit Testimonial</button>'
+'<div class="wp-err" id="er"></div>'
+'</form>'
+'<div class="wp-succ" id="sc"><div class="wp-succ-ic"><svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="27" stroke="#10b981" stroke-width="2"/><path d="M18 28l7 7 13-14" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h3>'+TY+'</h3><p>Your feedback means a lot to us.</p></div>'
+'<div class="wp-ft"><span id="pw" style="display:'+(PB?'block':'none')+'"><a href="https://wallproud.com" target="_blank">Powered by WallProud</a></span></div>'
+'</div>'

var s = document.currentScript || (document.scripts ? document.scripts[document.scripts.length - 1] : null);
var cParent=isInline ? (s && s.parentNode && s.parentNode !== document.head ? s.parentNode : document.body) : ((document.documentElement && document.documentElement !== document.body) ? document.documentElement : document.body);
cParent.appendChild(c);

${w.display_type === 'floating' ? `
var tb=document.createElement('button');
tb.id='tb';
tb.textContent='💬';
var btnPos='position:fixed;bottom:24px;${posCSS};width:56px;height:56px;border-radius:50%;background:${w.primary_color};color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);font-size:24px;z-index:99999;display:flex;align-items:center;justify-content:center;transition:transform 0.2s;pointer-events:auto';
tb.style.cssText=btnPos;
tb.addEventListener('mouseenter',function(){this.style.transform=(this.style.transform||'').includes('translateX')?'translateX(-50%) scale(1.1)':'scale(1.1)'});
tb.addEventListener('mouseleave',function(){this.style.transform=(this.style.transform||'').includes('translateX')?'translateX(-50%)':'scale(1)'});
var tbParent=(document.documentElement && document.documentElement !== document.body) ? document.documentElement : document.body;
tbParent.appendChild(tb);
` : ''}

var pn=sh.getElementById('pn');
var fm=sh.getElementById('fm');
var rg=0;

${isPopup ? `var bd=document.createElement('div');bd.className='wp-backdrop';document.body.appendChild(bd);bd.addEventListener('click',function(){pn.classList.remove('open');bd.classList.remove('open')});` : ''}

${w.display_type === 'floating' ? `
if(tb)tb.addEventListener('click',function(){pn.classList.toggle('open')});
` : w.display_type === 'inline' ? '' : `pn.classList.add('open');`+(isPopup ? 'bd.classList.add("open");' : '')}

sh.getElementById('cb').addEventListener('click',function(){if(w.display_type !== 'inline'){pn.classList.remove('open')${isPopup ? ';bd.classList.remove("open")' : ''}}});

${w.show_star_rating ? `
var st=sh.getElementById('st');
if(st){var ss=st.children;st.addEventListener('click',function(e){
var t=e.target;var sp=t.closest('span');if(sp&&ss){rg=Array.from(ss).indexOf(sp)+1;Array.from(ss).forEach(function(s,i){s.classList.toggle('sel',i<rg)})}
})}
` : ''}

var ct=sh.getElementById('ct');
var cc=sh.getElementById('cc');
if(ct&&cc)ct.addEventListener('input',function(){
var l=this.value.length;cc.textContent=l;
if(l<MN)cc.parentElement.style.color='#ef4444';else cc.parentElement.style.color='#9ca3af';
});

if(TR==='scroll-70'||TR==='scroll'){
var pct=TR==='scroll'?50:SCROLL_PCT;
var sd=false;
window.addEventListener('scroll',function fn(){
var sp=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
if(sp>=pct&&!sd){sd=true;pn.classList.add('open');window.removeEventListener('scroll',fn)}
});
}else if(TR==='exit-intent'){
document.addEventListener('mouseleave',function(e){if(e.clientY<=0)pn.classList.add('open')});
}else if(TR==='timed'){
setTimeout(function(){pn.classList.add('open')},(DELAY_S||5)*1000);
}

if(fm)fm.addEventListener('submit',function(e){
e.preventDefault();
var el=sh.getElementById('er');if(el)el.style.display='none';
var cv=(ct?ct.value:'').trim();
if(cv.length<MN){if(el){el.textContent='Minimum '+MN+' characters';el.style.display='block'}return}
if(cv.length>MX){if(el){el.textContent='Maximum '+MX+' characters';el.style.display='block'}return}
var sb=sh.getElementById('sb');if(sb){sb.disabled=true;sb.textContent='Submitting...'}
var b={widgetId:WID,content:cv,rating:rg,pageUrl:window.location.href,referrer:document.referrer||''};
${w.show_name ? `b.authorName=(sh.getElementById('nm')?sh.getElementById('nm').value:'').trim();` : ''}
${w.show_email ? `b.authorEmail=(sh.getElementById('em')?sh.getElementById('em').value:'').trim();` : ''}
${w.show_company ? `b.authorCompany=(sh.getElementById('co')?sh.getElementById('co').value:'').trim();` : ''}
fetch(API+'/api/collect/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)})
.then(function(r){return r.json()}).then(function(d){
if(d.success){
fm.style.display='none';sh.getElementById('sc').style.display='block';
${w.show_confetti ? `
var cf=document.createElement('div');cf.className='cfetti';
var cl=['#6366f1','#ec4899','#f59e0b','#10b981','#ef4444','#8b5cf6'];
for(var i=0;i<30;i++){var s=document.createElement('span');s.style.background=cl[i%6];s.style.left=Math.random()*200-100+'px';s.style.top=Math.random()*200-100+'px';s.style.animationDelay=Math.random()*0.8+'s';cf.appendChild(s)}
var cfParent=(document.documentElement && document.documentElement !== document.body) ? document.documentElement : document.body;
cfParent.appendChild(cf);setTimeout(function(){cf.remove()},2500);
` : ''}
setTimeout(function(){if(w.display_type !== 'inline'){pn.classList.remove('open')${isPopup ? ';bd.classList.remove("open")' : ''}}},AC*1000);
}else{if(el){el.textContent=d.error||'Submission failed';el.style.display='block'}if(sb){sb.disabled=false;sb.textContent='Submit Testimonial'}}
}).catch(function(){if(el){el.textContent='Network error. Try again.';el.style.display='block'}if(sb){sb.disabled=false;sb.textContent='Submit Testimonial'}});
});
})();`;
}
