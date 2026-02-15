
import { store } from './store.js';
import { initDashboard } from '../dashboard/dashboard.js';
import { initResumeBuilder } from '../resume/ui.js';
import { initAbstract } from '../abstract/ui.js';

const app = document.getElementById('app');

export function initRouter() {
    // Initial render
    render();

    // Subscribe to state changes
    store.subscribe((state) => {
        // Simple check if view changed to avoid unnecessary re-renders of the whole app
        // In a real app we'd have diffing, but here we just re-render if top-level view changes
        // For sub-module updates (like resume preview), the modules subscribe themselves.
        if (app.dataset.currentView !== state.view) {
            render();
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.view) {
            store.update('view', e.state.view);
        }
    });
}

import { initFeatures } from '../features/features.js';
import { initAbout } from '../about/about.js';

function render() {
    const view = store.get().view;
    app.dataset.currentView = view;
    app.innerHTML = ''; // Clear current view

    if (view === 'dashboard') {
        initDashboard(app);
    } else if (view === 'builder') {
        initResumeBuilder(app);
    } else if (view === 'features') {
        initFeatures(app);
    } else if (view === 'about') {
        initAbout(app);
    } else if (view === 'abstract') {
        initAbstract(app);
    }
}

export function navigate(viewName) {
    store.update('view', viewName);
    history.pushState({ view: viewName }, '', `#${viewName}`);
}

// Expose to window for inline calls
window.navigate = navigate;

// Handle Hash Change
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) store.update('view', hash);
});
