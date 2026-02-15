// Initialize the Single Page Application
import('./src/modules/core/router.js')
    .then(module => {
        module.initRouter();
    })
    .catch(e => {
        document.body.innerHTML = `
            <div style="color:red; padding:20px; font-family:sans-serif;">
                <h1>Startup Error</h1>
                <h3 style="white-space:pre-wrap;">${e.message}</h3>
                <pre style="background:#eee; padding:10px;">${e.stack}</pre>
            </div>
        `;
    });

window.onerror = function (msg, url, lineNo, columnNo, error) {
    document.body.innerHTML += `
        <div style="background:white; color:red; padding:20px; border:1px solid red; margin:20px;">
            <h3>Error: ${msg}</h3>
            <p>${url}:${lineNo}:${columnNo}</p>
            <pre>${error ? error.stack : ''}</pre>
        </div>
    `;
    return false;
};
