
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, TabStopType, ImageRun, SectionType, Header, Footer } from "docx";
import { saveAs } from "file-saver";
import { store } from '../core/store.js';

export async function generateDOCX() {
    const r = store.get().resume;
    const FONTS = { primary: "Times New Roman" };
    const SIZES = { NAME: 32, HEADING: 28, BODY: 24, SMALL: 20 }; // 16pt, 14pt, 12pt, 10pt

    const docSections = [];

    // --- Header Generator ---
    const createHeader = () => {
        if (r.personal.profilePic) {
            // Layout with Image: 3-Column Table
            const imageBuffer = Uint8Array.from(atob(r.personal.profilePic.split(",")[1]), c => c.charCodeAt(0));
            return new Header({
                children: [
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({})] }), // Col 1: Spacer
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({ text: (r.personal.firstName + ' ' + r.personal.lastName).toUpperCase(), style: "ResumeTitle", alignment: AlignmentType.CENTER }),
                                            new Paragraph({ text: (r.personal.jobTitle || '').toUpperCase(), style: "JobTitle", alignment: AlignmentType.CENTER }),
                                            new Paragraph({ text: [r.personal.city, r.personal.country].filter(Boolean).join(', '), style: "SmallInfo", alignment: AlignmentType.CENTER }),
                                            new Paragraph({ text: [r.personal.email, r.personal.phone].filter(Boolean).join(' | '), style: "SmallInfo", alignment: AlignmentType.CENTER }),
                                            new Paragraph({ text: [r.personal.linkedin, r.personal.address, ...r.socials.map(s => s.url)].filter(Boolean).join(' | '), style: "SmallInfo", alignment: AlignmentType.CENTER })
                                        ]
                                    }),
                                    new TableCell({
                                        width: { size: 20, type: WidthType.PERCENTAGE },
                                        verticalAlign: "center",
                                        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new ImageRun({ data: imageBuffer, transformation: { width: 100, height: 100 } })] })]
                                    })
                                ]
                            })
                        ]
                    }),
                    // Dedicated Paragraph for Border Bottom (with Non-Breaking Space to Force Render)
                    new Paragraph({
                        children: [new TextRun({ text: "\u00A0", size: 1 })], // Almost invisible space
                        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } }, // 1/2 pt line
                        spacing: { after: 200, line: 240 } // Specific line height to ensure visibility
                    })
                ]
            });
        } else {
            // Text-Only Header
            return new Header({
                children: [
                    new Paragraph({ text: (r.personal.firstName + ' ' + r.personal.lastName).toUpperCase(), heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, style: "ResumeTitle", spacing: { after: 0 } }),
                    new Paragraph({ text: (r.personal.jobTitle || '').toUpperCase(), alignment: AlignmentType.CENTER, style: "JobTitle", spacing: { before: 50, after: 0 } }),
                    new Paragraph({ text: [r.personal.city, r.personal.country].filter(Boolean).join(', '), alignment: AlignmentType.CENTER, style: "SmallInfo", spacing: { before: 50, after: 0 } }),
                    new Paragraph({ text: [r.personal.email, r.personal.phone].filter(Boolean).join(' | '), alignment: AlignmentType.CENTER, style: "SmallInfo", spacing: { before: 50, after: 0 } }),
                    // Attach Border DIRECTLY to the last content paragraph
                    new Paragraph({
                        text: [r.personal.linkedin, r.personal.address, ...r.socials.map(s => s.url)].filter(Boolean).join(' | '),
                        alignment: AlignmentType.CENTER,
                        style: "SmallInfo",
                        spacing: { before: 50, after: 200 },
                        border: { bottom: { color: "000000", space: 5, style: BorderStyle.SINGLE, size: 6 } }
                    })
                ]
            });
        }
    };

    // Helper: Grey Section Header with Left Border
    const createSectionHeader = (text) => new Paragraph({
        children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONTS.primary, size: 28 })],
        shading: { fill: "F3F4F6", color: "auto", type: "clear" }, // Matches preview background
        border: { left: { color: "333333", space: 10, value: "single", size: 24 } }, // 4px solid #333
        spacing: { before: 240, after: 120 },
        alignment: AlignmentType.LEFT
    });

    // Helper: Entry Header with Right Aligned Date
    const createEntryHeader = (leftText, rightText, bold = true) => new Paragraph({
        children: [
            new TextRun({ text: leftText, bold: bold, font: FONTS.primary, size: 24 }),
            new TextRun({ text: "\t" + (rightText || ''), bold: bold, font: FONTS.primary, size: 24 })
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: 10300 }], // Approx right margin for A4
        spacing: { after: 0 }
    });

    // Helper: Entry Sub-Header (Italic)
    const createEntrySubHeader = (leftText, rightText) => new Paragraph({
        children: [
            new TextRun({ text: leftText, italics: true, font: FONTS.primary, size: 24 }),
            new TextRun({ text: "\t" + (rightText || ''), italics: true, font: FONTS.primary, size: 24 })
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: 10300 }],
        spacing: { after: 50 }
    });

    // --- Summary ---
    if (r.summary && r.summary.trim()) {
        docSections.push(createSectionHeader("PROFESSIONAL SUMMARY"));
        // Use text-align: justify
        docSections.push(new Paragraph({ text: r.summary, style: "Normal", alignment: AlignmentType.JUSTIFIED }));
    }

    // --- Experience ---
    if (r.experience.length > 0) {
        docSections.push(createSectionHeader("EXPERIENCE"));
        r.experience.forEach(e => {
            docSections.push(createEntryHeader(e.jobTitle, `${e.startDate} – ${e.endDate}`));
            docSections.push(createEntrySubHeader(e.employer, e.city));

            // Bullets
            const lines = e.desc.split('\n').filter(l => l.trim());
            lines.forEach(l => {
                docSections.push(new Paragraph({
                    text: l,
                    bullet: { level: 0 },
                    style: "Normal",
                    alignment: AlignmentType.JUSTIFIED, // Justify bullets
                    spacing: { after: 0 }
                }));
            });
            docSections.push(new Paragraph({ text: "", spacing: { after: 120 } })); // Spacer
        });
    }

    // --- Education ---
    if (r.education.length > 0) {
        docSections.push(createSectionHeader("EDUCATION"));
        r.education.forEach(e => {
            docSections.push(createEntryHeader(e.institution, `${e.startDate} – ${e.endDate}`));
            docSections.push(createEntrySubHeader(e.degree, e.city));
            if (e.desc) docSections.push(new Paragraph({ text: e.desc, style: "Normal", alignment: AlignmentType.JUSTIFIED }));
            docSections.push(new Paragraph({ text: "", spacing: { after: 120 } }));
        });
    }

    // --- Skills (2 Column Table) ---
    if (r.skills.length > 0) {
        docSections.push(createSectionHeader("SKILLS"));

        const rows = [];
        for (let i = 0; i < r.skills.length; i += 2) {
            const s1 = r.skills[i];
            const s2 = r.skills[i + 1];

            rows.push(new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "• ", font: FONTS.primary }), new TextRun({ text: s1.name, bold: true, font: FONTS.primary, size: 24 })] })],
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                    }),
                    new TableCell({
                        children: [s2 ? new Paragraph({ children: [new TextRun({ text: "• ", font: FONTS.primary }), new TextRun({ text: s2.name, bold: true, font: FONTS.primary, size: 24 })] }) : new Paragraph({})],
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                    })
                ]
            }));
        }

        docSections.push(new Table({
            rows: rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } }
        }));
    }

    // --- Languages --
    if (r.languages.length > 0) {
        docSections.push(createSectionHeader("LANGUAGES"));
        const langText = r.languages.map(l => `${l.language} (${l.proficiency})`).join('  •  ');
        docSections.push(new Paragraph({ text: langText, style: "Normal" }));
    }

    // --- Projects ---
    if (r.projects.length > 0) {
        docSections.push(createSectionHeader("PROJECTS"));
        r.projects.forEach(p => {
            docSections.push(new Paragraph({
                children: [
                    new TextRun({ text: p.title, bold: true, font: FONTS.primary, size: 24 }),
                ],
                spacing: { after: 0 }
            }));
            docSections.push(new Paragraph({ text: p.desc, style: "Normal", spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED }));
        });
    }

    // --- Certifications ---
    if (r.certifications.length > 0) {
        docSections.push(createSectionHeader("CERTIFICATIONS"));
        r.certifications.forEach(c => {
            docSections.push(new Paragraph({ text: c.name, bullet: { level: 0 }, style: "Normal", spacing: { after: 0 } }));
        });
    }

    // --- Awards ---
    if (r.awards.length > 0) {
        docSections.push(createSectionHeader("AWARDS"));
        r.awards.forEach(a => {
            docSections.push(new Paragraph({
                children: [
                    new TextRun({ text: a.name, bold: true }),
                    new TextRun({ text: a.desc ? ' - ' + a.desc : '' })
                ],
                bullet: { level: 0 },
                style: "Normal",
                spacing: { after: 0 }
            }));
        });
    }

    // --- Interests ---
    if (r.interests) {
        docSections.push(createSectionHeader("INTERESTS"));
        docSections.push(new Paragraph({ text: r.interests, style: "Normal", alignment: AlignmentType.JUSTIFIED }));
    }

    // --- References ---
    if (r.references.length > 0) {
        docSections.push(createSectionHeader("REFERENCES"));
        r.references.forEach(ref => {
            docSections.push(new Paragraph({
                children: [new TextRun({ text: `${ref.name} (${ref.contact})` })],
                bullet: { level: 0 },
                style: "Normal",
                spacing: { after: 0 }
            }));
        });
    }

    // --- Custom ---
    if (r.custom.length > 0) {
        r.custom.forEach(c => {
            docSections.push(createSectionHeader(c.title));
            docSections.push(new Paragraph({ text: c.content, style: "Normal", alignment: AlignmentType.JUSTIFIED }));
        });
    }

    // Generate
    const doc = new Document({
        styles: {
            paragraphStyles: [
                { id: "ResumeTitle", name: "Resume Title", run: { font: FONTS.primary, size: SIZES.NAME, bold: true, color: "000000" } },
                { id: "JobTitle", name: "Job Title", run: { font: FONTS.primary, size: 24, smallCaps: true, color: "000000" } }, // 12pt Small Caps
                { id: "SmallInfo", name: "Small Info", run: { font: FONTS.primary, size: 20, color: "000000" }, paragraph: { spacing: { line: 276 } } }, // 10pt with 1.15 spacing (276)
                { id: "Normal", name: "Normal", run: { font: FONTS.primary, size: SIZES.BODY, color: "000000" }, paragraph: { spacing: { line: 276 } } } // 1.15 spacing (276)
            ]
        },
        sections: [{
            headers: {
                first: createHeader()
            },
            properties: {
                titlePage: true, // Enable first page header
                page: {
                    margin: {
                        top: 1728, // 1.2 inch (Page 2+ body start)
                        right: 1440,
                        bottom: 1440,
                        left: 1440,
                        header: 720 // Header starts at 0.5 inch from top
                    },
                    borders: r.meta.border ? {
                        pageBorder: { style: BorderStyle.SINGLE, size: 12, color: "000000", display: "allPages", offsetFrom: "page" }
                    } : undefined
                }
            },
            children: docSections // Body only
        }]
    });

    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${(r.personal.firstName + '_' + r.personal.lastName).replace(/\\s+/g, '_') || 'Resume'}_${timestamp}.docx`);
    } catch (error) {
        console.error(error);
        alert("Error generating resume");
    }
}
