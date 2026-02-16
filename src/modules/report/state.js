// Project Report Generator — Reactive State
// Observer-pattern state management for live preview updates

const defaultState = {
    // Project Details
    projectTitle: '',
    academicYear: '',
    course: 'B.Tech CSE',
    semester: '',
    collegeName: '',
    collegeAddress: '',
    universityName: '',
    departmentName: '',
    submissionMonth: '',
    submissionYear: new Date().getFullYear().toString(),
    reportType: 'MINI PROJECT REPORT',
    degreeName: '',

    // Members & Guide
    members: [{ name: '', regNo: '' }],
    guideName: '',
    guideDesignation: '',
    coordinator1Name: '',
    coordinator1Designation: '',
    coordinator2Name: '',
    coordinator2Designation: '',
    hodName: '',
    hodDesignation: '',

    // Logos
    collegeLogo: null,    // base64 data URL
    universityLogo: null, // base64 data URL
    certificateLogo: null, // base64 data URL for certificate page only

    // Faculty Departments (Optional overrides)
    guideDepartment: '',
    coordinator1Department: '',
    coordinator2Department: '',
    hodDepartment: '',

    // Cover Page Settings
    showBorder: true,

    // Certificate
    certificateText: '',

    // Declaration
    declarationText: '',

    // Acknowledgement
    acknowledgement: '',

    // Abstract
    abstract: '',

    // Chapters
    chapters: [
        { title: 'Introduction', subsections: [{ title: '', content: '' }] },
        { title: 'Literature Survey', subsections: [{ title: '', content: '' }] },
        { title: 'Methodology', subsections: [{ title: '', content: '' }] },
        { title: 'Results', subsections: [{ title: '', content: '' }] },
        { title: 'Analysis', subsections: [{ title: '', content: '' }] },
        { title: 'Conclusion', subsections: [{ title: '', content: '' }] },
    ],

    // Diagrams — array of { chapterIndex, file (base64), caption }
    diagrams: [],

    // References — raw text, one per line
    references: '',

    // UI state
    activeSection: 0,
};

let state = JSON.parse(JSON.stringify(defaultState));
const listeners = new Set();

export const reportState = {
    get() {
        return state;
    },

    set(key, value) {
        state[key] = value;
        this._notify();
    },

    /** Deep-update a nested path, e.g. updatePath('members.0.name', 'John') */
    updatePath(path, value) {
        const keys = path.split('.');
        let obj = state;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = isNaN(keys[i]) ? keys[i] : Number(keys[i]);
            obj = obj[k];
        }
        const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : Number(keys[keys.length - 1]);
        obj[lastKey] = value;
        this._notify();
    },

    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },

    _notify() {
        listeners.forEach(fn => fn(state));
    },

    reset() {
        state = JSON.parse(JSON.stringify(defaultState));
        this._notify();
    }
};
