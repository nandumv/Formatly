const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./router-Bfiwg0dZ.js","./router-BkYBkBCA.css"])))=>i.map(i=>d[i]);
(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();const y="modulepreload",g=function(n,i){return new URL(n,i).href},h={},v=function(i,l,a){let e=Promise.resolve();if(l&&l.length>0){const o=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),p=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));e=Promise.allSettled(l.map(s=>{if(s=g(s,a),s in h)return;h[s]=!0;const d=s.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(!!a)for(let u=o.length-1;u>=0;u--){const f=o[u];if(f.href===s&&(!d||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${m}`))return;const c=document.createElement("link");if(c.rel=d?"stylesheet":y,d||(c.as="script"),c.crossOrigin="",c.href=s,p&&c.setAttribute("nonce",p),document.head.appendChild(c),d)return new Promise((u,f)=>{c.addEventListener("load",u),c.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${s}`)))})}))}function t(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return e.then(o=>{for(const r of o||[])r.status==="rejected"&&t(r.reason);return i().catch(t)})};v(()=>import("./router-Bfiwg0dZ.js").then(n=>n.r),__vite__mapDeps([0,1]),import.meta.url).then(n=>{n.initRouter()}).catch(n=>{document.body.innerHTML=`
            <div style="color:red; padding:20px; font-family:sans-serif;">
                <h1>Startup Error</h1>
                <h3 style="white-space:pre-wrap;">${n.message}</h3>
                <pre style="background:#eee; padding:10px;">${n.stack}</pre>
            </div>
        `});window.onerror=function(n,i,l,a,e){return document.body.innerHTML+=`
        <div style="background:white; color:red; padding:20px; border:1px solid red; margin:20px;">
            <h3>Error: ${n}</h3>
            <p>${i}:${l}:${a}</p>
            <pre>${e?e.stack:""}</pre>
        </div>
    `,!1};export{v as _};
