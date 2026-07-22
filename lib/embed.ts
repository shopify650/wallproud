import type { WidgetType, WidgetConfig } from "@/types";

function starSvg(n: number, accent: string) {
  let s = "";
  for (let i = 1; i <= 5; i++) {
    const fill = i <= n ? accent : "#d1d5db";
    s += `<svg width="14" height="14" viewBox="0 0 20 20" style="display:inline-block;vertical-align:middle"><path fill="${fill}" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.174 0l-2.8 2.034c-.784.57-1.838-.381-1.54-1.205.384-1.107 1.07-3.292 1.07-3.292a1 1 0 00-.364-1.118L2.979 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  }
  return s;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

function renderCard(t: any, c: WidgetConfig, accent: string) {
  const s = c.styling!;
  const r = `border-radius:${s.cardBorderRadius}px;padding:${s.cardPadding}px;background:${s.cardBackground}`;
  let h = `<div class="c" style="${r}">`;
  if (s.showRating && t.rating) h += `<div class="r">${starSvg(t.rating, accent)}</div>`;
  h += `<div class="t">&ldquo;${esc(t.content)}&rdquo;</div>`;
  h += `<div class="a">`;
  if (s.showAuthorImage && t.author_image) {
    h += `<img src="${esc(t.author_image)}" alt="" loading="lazy" class="av">`;
  } else {
    h += `<span class="av af" style="background:${accent}">${(t.author_name || "?").charAt(0).toUpperCase()}</span>`;
  }
  h += `<div><div class="n">${esc(t.author_name)}</div>`;
  if (s.showAuthorCompany && (t.author_company || t.author_role)) {
    h += `<div class="m">${esc([t.author_company, t.author_role].filter(Boolean).join(" · "))}</div>`;
  }
  h += `</div>`;
  if (s.showDate) h += `<span class="d">${fmtDate(t.created_at)}</span>`;
  h += `</div></div>`;
  return h;
}

function baseCSS(c: WidgetConfig) {
  const s = c.styling!;
  const maxWidth = c.layout?.maxWidth || 1000;
  return [
    `@media (max-width: 640px) { .wp { padding: 16px 12px; } .g { grid-template-columns: 1fr !important; } .w { columns: 1 !important; } }`,
    `.wp{font-family:${s.fontFamily || "system-ui,sans-serif"};background:${s.backgroundColor};color:${s.textColor};max-width:${maxWidth}px;margin:0 auto;padding:24px 16px;box-sizing:border-box;width:100%}`,
    `.c{color:${s.textColor};box-shadow:0 1px 4px rgba(0,0,0,.08);break-inside:avoid;box-sizing:border-box}`,
    `.t{font-size:15px;line-height:1.6;word-wrap:break-word}`,
    `.a{display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}`,
    `.av{width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff}`,
    `.n{font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
    `.m{font-size:12px;opacity:.6}`,
    `.d{font-size:11px;opacity:.5;margin-left:auto;white-space:nowrap}`,
    `.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:${c.layout?.gap || 20}px}`,
    `.w{columns:${Math.min(c.layout?.columns || 3, 4)};column-gap:${c.layout?.gap || 20}px}.w>.c{margin-bottom:${c.layout?.gap || 20}px;display:inline-block;width:100%}`,
    `.sw{position:relative;overflow:hidden;min-height:200px}.sl{position:absolute;inset:0;opacity:0;transition:opacity .6s ease;pointer-events:none}.sl.a{opacity:1;position:relative;pointer-events:auto}.wd{display:flex;justify-content:center;gap:8px;margin-top:16px}.wb{width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0;background:#d1d5db;transition:background .3s}.wb.a{background:${s.accentColor || "#000000"}}`,
    `.cw{position:relative;overflow:hidden}.ci{display:flex;transition:transform .5s ease}.cs{min-width:100%;padding:0 4px;box-sizing:border-box}.wd{display:flex;justify-content:center;gap:8px;margin-top:16px}.wb{width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0;background:#d1d5db;transition:background .3s}.wb.a{background:${s.accentColor || "#000000"}}`,
  ].join("");
}

function renderGrid(items: any[], c: WidgetConfig) {
  const accent = c.styling!.accentColor!;
  const col = Math.min(c.layout?.columns || 2, 4);
  const gap = c.layout?.gap || 20;
  const css = baseCSS(c) + `.g{display:grid;grid-template-columns:repeat(${col},1fr);gap:${gap}px}`;
  return `<style>${css}</style><div class="wp"><div class="g">${items.map((t) => renderCard(t, c, accent)).join("")}</div></div>`;
}

function renderMinimal(items: any[], c: WidgetConfig) {
  const accent = c.styling!.accentColor!;
  const s = c.styling!;
  const css = baseCSS(c) + `.mi{padding:${s.cardPadding}px;border-left:3px solid ${accent};margin-bottom:12px;border-radius:0 12px 12px 0}`;
  const html = items.map((t) => {
    let h = `<div class="mi">`;
    if (s.showRating && t.rating) h += `<div class="r">${starSvg(t.rating, accent)}</div>`;
    h += `<div class="t">&ldquo;${esc(t.content)}&rdquo;</div>`;
    h += `<div class="a" style="margin-top:8px"><div class="n">${esc(t.author_name)}</div>`;
    if (s.showAuthorCompany && t.author_company) h += `<div class="m">${esc(t.author_company)}</div>`;
    h += `</div></div>`;
    return h;
  }).join("");
  return `<style>${css}</style><div class="wp">${html}</div>`;
}

function renderWall(items: any[], c: WidgetConfig) {
  const accent = c.styling!.accentColor!;
  const col = Math.min(c.layout?.columns || 3, 4);
  const gap = c.layout?.gap || 20;
  const css = baseCSS(c) + `.w{columns:${col};column-gap:${gap}px}.w>.c{margin-bottom:${gap}px;display:inline-block;width:100%}`;
  return `<style>${css}</style><div class="wp"><div class="w">${items.map((t) => renderCard(t, c, accent)).join("")}</div></div>`;
}

function renderSlider(items: any[], c: WidgetConfig) {
  const accent = c.styling!.accentColor!;
  const css = baseCSS(c) + `.sw{position:relative;overflow:hidden}.sl{position:absolute;inset:0;opacity:0;transition:opacity .6s ease;pointer-events:none}.sl.a{opacity:1;position:relative;pointer-events:auto}.wd{display:flex;justify-content:center;gap:8px;margin-top:16px}.wb{width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0;background:#d1d5db;transition:background .3s}.wb.a{background:${accent}}`;
  const slides = items.map((t, i) => `<div class="sl${i === 0 ? " a" : ""}" data-i="${i}">${renderCard(t, c, accent)}</div>`).join("");
  const dots = items.map((_, i) => `<button class="wb${i === 0 ? " a" : ""}" data-i="${i}"></button>`).join("");
  return `<style>${css}</style><div class="wp"><div class="sw">${slides}</div><div class="wd">${dots}</div></div>`;
}

function renderCarousel(items: any[], c: WidgetConfig) {
  const accent = c.styling!.accentColor!;
  const css = baseCSS(c) + `.cw{position:relative;overflow:hidden}.ci{display:flex;transition:transform .5s ease}.cs{min-width:100%;padding:0 4px;box-sizing:border-box}.wd{display:flex;justify-content:center;gap:8px;margin-top:16px}.wb{width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0;background:#d1d5db;transition:background .3s}.wb.a{background:${accent}}`;
  const slides = items.map((t) => `<div class="cs">${renderCard(t, c, accent)}</div>`).join("");
  const dots = items.map((_, i) => `<button class="wb${i === 0 ? " a" : ""}" data-i="${i}"></button>`).join("");
  return `<style>${css}</style><div class="wp"><div class="cw"><div class="ci">${slides}</div></div><div class="wd">${dots}</div></div>`;
}

function escJS(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

function carouselJSLiteral(n: number, interval: number, autoplay: boolean) {
  return `var ci=root.querySelector('.ci'),wd=root.querySelector('.wd');var i=0;function g(j){ci.style.transform='translateX(-'+(j*100)+'%)';if(wd){var a=wd.querySelector('.a');if(a)a.classList.remove('a');if(wd.children[j])wd.children[j].classList.add('a')}i=j}function nx(){g((i+1)%${n})}if(wd)wd.addEventListener('click',function(e){var t=e.target;if(t.classList.contains('wb'))g(parseInt(t.dataset.i))});var it=null;function st(){it=setInterval(nx,${interval})}function sp(){if(it){clearInterval(it);it=null}}${autoplay?"st();":""}if(ci)ci.addEventListener('touchstart',function(e){sp();var x=e.touches[0].clientX;ci.addEventListener('touchend',function h(e){var d=e.changedTouches[0].clientX-x;if(Math.abs(d)>40){d>0?g((i-1+${n})%${n}):nx()}ci.removeEventListener('touchend',h);${autoplay?"st();":""}},{once:true})});`;
}

function sliderJSLiteral(n: number, interval: number, autoplay: boolean) {
  return `var sw=root.querySelector('.sw'),wd=root.querySelector('.wd');var i=0;function g(j){var a=sw.querySelector('.a');if(a){a.classList.remove('a');a.style.position='absolute'}var c=sw.children[j];c.classList.add('a');c.style.position='relative';sw.style.height=c.offsetHeight+'px';if(wd){var b=wd.querySelector('.a');if(b)b.classList.remove('a');wd.children[j].classList.add('a')}i=j}function nx(){g((i+1)%${n})}if(wd)wd.addEventListener('click',function(e){var t=e.target;if(t.classList.contains('wb'))g(parseInt(t.dataset.i))});var it=null;function st(){it=setInterval(nx,${interval})}function sp(){if(it){clearInterval(it);it=null}}${autoplay?"st();":""}if(sw)sw.addEventListener('touchstart',function(e){sp();var x=e.touches[0].clientX;sw.addEventListener('touchend',function h(e){var d=e.changedTouches[0].clientX-x;if(Math.abs(d)>40){d>0?g((i-1+${n})%${n}):nx()}sw.removeEventListener('touchend',h);${autoplay?"st();":""}},{once:true})});if(sw&&sw.children.length){g(0)}}`;
}

export function generateEmbedScript(
  widget: { id: string; type: WidgetType; config: WidgetConfig },
  testimonials: any[],
): string {
  const conf = widget.config;
  const items = testimonials.filter((t) => t.status === "approved");
  const max = conf.filter?.maxItems || items.length;
  const slice = items.slice(0, max);

  if (slice.length === 0) return "";

  const type = widget.type;
  let html: string;
  let extraJS = "";

  switch (type) {
    case "grid":
      html = renderGrid(slice, conf);
      break;
    case "minimal":
      html = renderMinimal(slice, conf);
      break;
    case "wall":
    case "masonry":
      html = renderWall(slice, conf);
      break;
    case "carousel":
      html = renderCarousel(slice, conf);
      extraJS = carouselJSLiteral(slice.length, conf.animation?.interval || 4000, conf.animation?.autoplay !== false);
      break;
    case "slider":
      html = renderSlider(slice, conf);
      extraJS = sliderJSLiteral(slice.length, conf.animation?.interval || 4000, conf.animation?.autoplay !== false);
      break;
    default:
      html = renderGrid(slice, conf);
  }

  const escapedHtml = escJS(html);

  return [
    `(function(){`,
    `var e=document.createElement('wallproud-widget');`,
    `var root=e.attachShadow({mode:'open'});`,
    `root.innerHTML='${escapedHtml}';`,
    extraJS,
    `var s=document.currentScript;`,
    `if(!s){var scripts=document.querySelectorAll('script[src*="wallproud.com/embed/"]');s=scripts[scripts.length-1];}`,
    `if(s&&s.parentNode){s.parentNode.insertBefore(e,s)}else{document.body.appendChild(e)}`,
    `})();`,
  ].join("");
}
