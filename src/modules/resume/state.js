
import { store } from '../core/store.js';

// This file is mainly to document the data structure, 
// but the actual state is held in the core store.
// We can add helper selectors here if needed.

export const getResume = () => store.get().resume;

export const calculateProgress = () => {
    const r = getResume();
    let score = 0;

    // Weights
    if (r.personal.fullName) score += 10;
    if (r.personal.email) score += 10;
    if (r.personal.phone) score += 5;
    if (r.summary) score += 10;
    if (r.education.length > 0) score += 15;
    if (r.experience.length > 0) score += 20;
    if (r.skills.length > 0) score += 15;
    if (r.projects.length > 0) score += 10;
    if (r.additional) score += 5; // Bonus

    return Math.min(100, score);
};
