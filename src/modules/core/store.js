
// Core State Management
// Simple reactive state for the application

const state = {
    view: 'dashboard', // dashboard | builder
    resume: {
        meta: {
            score: 0,
            border: false,
            template: 'modern' // classic | modern
        },
        personal: {
            firstName: '',
            lastName: '',
            jobTitle: '',
            email: '',
            phone: '',
            linkedin: '',
            country: '',
            city: '',
            address: '',
            postalCode: ''
        },
        socials: [], // { id, network, url }
        languages: [], // { id, language, proficiency }
        summary: '',
        education: [], // { id, institution, degree, city, country, startDate, endDate, score, desc }
        experience: [], // { id, jobTitle, employer, city, country, startDate, endDate, desc }
        skills: [], // { id, name, level }
        projects: [], // { id, title, link, desc }
        certifications: [], // { id, name, issuer, date }
        awards: [], // { id, name, date, desc }
        interests: '', // Text area
        references: [], // { id, name, contact }
        references: [], // { id, name, contact }
        custom: [] // { id, title, content }
    },
    aiUsage: {
        experience: 0,
        summary: 0,
        skills: 0,
        jobMatch: 0
    },
    limits: {
        free: 3
    }
};

const listeners = new Set();

export const store = {
    get: () => state,

    // Update a specific path in the state
    update: (path, value) => {
        const keys = path.split('.');
        let target = state;
        for (let i = 0; i < keys.length - 1; i++) {
            target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = value;
        notify();
    },

    // Add item to array
    addItem: (arrayPath, item) => {
        const keys = arrayPath.split('.');
        let target = state;
        for (let i = 0; i < keys.length; i++) {
            target = target[keys[i]];
        }
        if (Array.isArray(target)) {
            target.push(item);
            notify();
        }
    },

    // Remove item from array by ID
    removeItem: (arrayPath, id) => {
        const keys = arrayPath.split('.');
        let target = state;
        for (let i = 0; i < keys.length - 1; i++) {
            target = target[keys[i]];
        }
        const arrKey = keys[keys.length - 1];
        if (Array.isArray(target[arrKey])) {
            target[arrKey] = target[arrKey].filter(i => i.id !== id);
            notify();
        }
    },

    subscribe: (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
    }
};

function notify() {
    listeners.forEach(cb => cb(state));
}
