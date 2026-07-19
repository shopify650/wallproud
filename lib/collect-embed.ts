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

  const posCSS = w.position === "bottom-left" ? "left:24px" : "right:24px";

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

var cid='wp-collect-'+WID;
if(document.getElementById(cid))return;
var c=document.createElement('div');
c.id=cid;
c.style.cssText='position:fixed;inset:0;z-index:99999;pointer-events:none';
var sh=c.attachShadow({mode:'open'});
var posCSS='${posCSS}';
sh.innerHTML='<style>'
+'*{box-sizing:border-box}'
+'.wp-panel{position:absolute;bottom:90px;'+posCSS+';width:380px;max-height:80vh;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.15);z-index:99999;overflow:hidden;transform:translateY(20px);opacity:0;transition:all 0.3s;pointer-events:none;display:flex;flex-direction:column}'
+'.wp-panel.open{transform:translateY(0);opacity:1;pointer-events:all}'
+'.wp-hdr{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 0}'
+'.wp-hdr h3{font-size:18px;font-weight:700;color:#111}'
+'.wp-close{width:32px;height:32px;border-radius:50%;border:none;background:#f3f4f6;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;color:#6b7280}'
+'.wp-desc{padding:8px 24px 0;font-size:14px;color:#6b7280}'
+'.wp-form{padding:16px 24px 20px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}'
+'.wp-stars{display:flex;gap:4px;font-size:28px;cursor:pointer;justify-content:center}'
+'.wp-stars span{transition:transform 0.15s;filter:grayscale(1) opacity(0.3)}'
+'.wp-stars span.sel,.wp-stars span:hover{filter:none;transform:scale(1.1)}'
+'.wp-field{width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:10px;font-size:14px;font-family:inherit;outline:none;transition:border-color 0.2s}'
+'.wp-field:focus{border-color:'+W+';box-shadow:0 0 0 3px '+W+'33}'
+'.wp-field.error{border-color:#ef4444}'
+'.wp-char{font-size:12px;color:#9ca3af;text-align:right}'
+'.wp-submit{width:100%;padding:12px;border:none;border-radius:10px;background:'+W+';color:#fff;font-size:15px;font-weight:600;cursor:pointer;transition:opacity 0.2s}'
+'.wp-submit:hover{opacity:0.9}'
+'.wp-submit:disabled{opacity:0.5;cursor:not-allowed}'
+'.wp-succ{display:none;padding:40px 24px;text-align:center}'
+'.wp-succ-ic{font-size:48px;margin-bottom:12px}'
+'.wp-succ h3{font-size:20px;font-weight:700;color:#111}'
+'.wp-succ p{font-size:14px;color:#6b7280}'
+'.wp-err{color:#ef4444;font-size:13px;text-align:center;display:none}'
+'.wp-ft{padding:12px 24px;border-top:1px solid #eee;text-align:center;font-size:12px}'
+'.wp-ft a{color:#9ca3af;text-decoration:none}'
+'.wp-ft a:hover{color:#6b7280}'
+'.cfetti{position:fixed;top:50%;left:50%;pointer-events:none;z-index:100000}'
+'.cfetti span{position:absolute;width:10px;height:10px;border-radius:2px;animation:cfa 1.5s ease-out forwards}'
+'@keyframes cfa{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-200px) rotate(720deg);opacity:0}}'
+'</style>'
+'<div class="wp-panel" id="pn">'
+'<div class="wp-hdr"><h3>'+H+'</h3><button class="wp-close" id="cb">✕</button></div>'
+'<div class="wp-desc">'+D+'</div>'
+'<form class="wp-form" id="fm">'
+(S?'<div class="wp-stars" id="st">★'.repeat(5)+'</div>':'')
+'<textarea class="wp-field" id="ct" placeholder="'+PL+'" rows="4" maxlength="'+MX+'"></textarea>'
+'<div class="wp-char" id="cc">0 / '+MX+'</div>'
+(SN?'<input class="wp-field" id="nm" placeholder="Your name" '+(NR?'required':'')+' />':'')
+(SE?'<input class="wp-field" id="em" type="email" placeholder="Email" '+(ER?'required':'')+' />':'')
+(SC?'<input class="wp-field" id="co" placeholder="Company" '+(CR?'required':'')+' />':'')
+(SP?'<input class="wp-field" id="ph" type="tel" placeholder="Phone" '+(PR?'required':'')+' />':'')
+(SV?'<input class="wp-field" id="vi" type="url" placeholder="Video URL" />':'')
+'<button type="submit" class="wp-submit" id="sb">Submit Testimonial</button>'
+'<div class="wp-err" id="er"></div>'
+'</form>'
+'<div class="wp-succ" id="sc"><div class="wp-succ-ic">🎉</div><h3>'+TY+'</h3><p>Your feedback means a lot to us.</p></div>'
+'<div class="wp-ft"><span id="pw" style="display:'+(PB?'block':'none')+'"><a href="https://wallproud.com" target="_blank">Powered by WallProud</a></span></div>'
+'</div>'

var s = document.currentScript || (document.scripts ? document.scripts[document.scripts.length - 1] : null);
document.body.appendChild(c);

${w.display_type === 'floating' ? `
var tb=document.createElement('button');
tb.id='tb';
tb.textContent='💬';
tb.style.cssText='position:fixed;bottom:24px;${posCSS};width:56px;height:56px;border-radius:50%;background:${w.primary_color};color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);font-size:24px;z-index:99999;display:flex;align-items:center;justify-content:center;transition:transform 0.2s';
tb.addEventListener('mouseenter',function(){this.style.transform='scale(1.1)'});
tb.addEventListener('mouseleave',function(){this.style.transform='scale(1)'});
document.body.appendChild(tb);
` : ''}

var pn=sh.getElementById('pn');
var fm=sh.getElementById('fm');
var rg=0;

${w.display_type === 'floating' ? `
if(tb)tb.addEventListener('click',function(){pn.classList.toggle('open')});
` : `pn.classList.add('open');`}

sh.getElementById('cb').addEventListener('click',function(){pn.classList.remove('open')});

${w.show_star_rating ? `
var st=sh.getElementById('st');
if(st){var ss=st.children;st.addEventListener('click',function(e){
var t=e.target;if(t.tagName==='SPAN'){rg=Array.from(ss).indexOf(t)+1;Array.from(ss).forEach(function(s,i){s.classList.toggle('sel',i<rg)})}
})}
` : ''}

var ct=sh.getElementById('ct');
var cc=sh.getElementById('cc');
if(ct&&cc)ct.addEventListener('input',function(){
var l=this.value.length;cc.textContent=l+' / '+MX;
if(l<MN)cc.style.color='#ef4444';else cc.style.color='#9ca3af';
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
document.body.appendChild(cf);setTimeout(function(){cf.remove()},2500);
` : ''}
setTimeout(function(){pn.classList.remove('open')},AC*1000);
}else{if(el){el.textContent=d.error||'Submission failed';el.style.display='block'}if(sb){sb.disabled=false;sb.textContent='Submit Testimonial'}}
}).catch(function(){if(el){el.textContent='Network error. Try again.';el.style.display='block'}if(sb){sb.disabled=false;sb.textContent='Submit Testimonial'}});
});
})();`;
}
