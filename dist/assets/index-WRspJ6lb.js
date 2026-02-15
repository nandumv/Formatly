(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))d(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&d(r)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function d(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();const h="modulepreload",y=function(o){return"/Formatly/"+o},u={},g=function(c,l,d){let e=Promise.resolve();if(l&&l.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),n=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));e=Promise.allSettled(l.map(i=>{if(i=y(i),i in u)return;u[i]=!0;const a=i.endsWith(".css"),f=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${f}`))return;const s=document.createElement("link");if(s.rel=a?"stylesheet":h,a||(s.as="script"),s.crossOrigin="",s.href=i,n&&s.setAttribute("nonce",n),document.head.appendChild(s),a)return new Promise((p,m)=>{s.addEventListener("load",p),s.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${i}`)))})}))}function t(r){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=r,window.dispatchEvent(n),!n.defaultPrevented)throw r}return e.then(r=>{for(const n of r||[])n.status==="rejected"&&t(n.reason);return c().catch(t)})};g(()=>import("./router-Dq7kIlcG.js"),[]).then(o=>{o.initRouter()}).catch(o=>{document.body.innerHTML=`
            <div style="color:red; padding:20px; font-family:sans-serif;">
                <h1>Startup Error</h1>
                <h3 style="white-space:pre-wrap;">${o.message}</h3>
                <pre style="background:#eee; padding:10px;">${o.stack}</pre>
            </div>
        `});window.onerror=function(o,c,l,d,e){return document.body.innerHTML+=`
        <div style="background:white; color:red; padding:20px; border:1px solid red; margin:20px;">
            <h3>Error: ${o}</h3>
            <p>${c}:${l}:${d}</p>
            <pre>${e?e.stack:""}</pre>
        </div>
    `,!1};
