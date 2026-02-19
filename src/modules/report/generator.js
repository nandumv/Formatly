// Project Report Generator — DOCX Export
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, ImageRun, PageBreak, Header, Footer, PageNumber, PageNumberSeparator, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

const LINE_SPACING = 360; // 1.5 spacing (240 * 1.5)
const FONT = 'Times New Roman';

export function generateReportDocx(s) {
    const children = [];

    // ─── Cover Page ──────────────────────────────
    children.push(...buildCoverPage(s));
    children.push(pageBreak());

    // ─── Certificate ────────────────────────────
    // Header: College + Department
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun(`${(s.collegeName || '').toUpperCase()}${s.collegeAddress ? `, ${s.collegeAddress.toUpperCase()}` : ''}`, 32, true)], // 16pt
        spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
    }));
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun(`DEPARTMENT OF ${(s.departmentName || '').toUpperCase()}`, 28, true)], // 14pt
        spacing: { after: 480, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // Certificate Logo (or University Logo fallback)
    const certLogo = s.certificateLogo || s.universityLogo;
    if (certLogo) {
        try {
            const image = new ImageRun({
                data: certLogo.split(',')[1],
                transformation: { width: 120, height: 120 }, // Slightly larger logo
            });
            children.push(new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [image],
                spacing: { after: 480, line: LINE_SPACING, lineRule: 'auto' },
            }));
        } catch (e) {
            console.warn('Failed to add certificate logo to DOCX', e);
        }
    }

    // CERTIFICATE heading
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'CERTIFICATE', font: FONT, size: 40, bold: true, color: '000000' })], // 20pt
        spacing: { after: 720, line: LINE_SPACING, lineRule: 'auto' }, // More space after title
        keepNext: true,
        keepLines: true,
    }));
    // Certificate body
    const certText = s.certificateText || generateCertBodyText(s);
    if (certText) {
        certText.split('\n').filter(p => p.trim()).forEach(p => {
            children.push(bodyPara(p, 28)); // 14pt body
        });
    }
    // Signatory blocks
    children.push(...buildSignatoryRows(s));
    children.push(pageBreak());

    // ─── Declaration ────────────────────────────
    children.push(heading('DECLARATION'));

    // Construct the specific declaration text with mixed formatting
    const declMemberNames = s.members.filter(m => m.name).map(m => m.name.toUpperCase()).join(', ');
    const declPara = new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 360, lineRule: 'auto' }, // 1.5 spacing
        children: [
            textRun('We hereby certify that the work which is being presented in the Project stage Entitled "', 28, false),
            textRun((s.projectTitle || '').toUpperCase(), 28, true), // Bold Title
            textRun('" by ', 28, false),
            textRun(declMemberNames || '[MEMBER NAMES]', 28, true), // Bold Names
            textRun(' in partial fulfilment of requirements for the award of degree of ', 28, false),
            textRun(s.degreeName || 'B. Tech', 28, false),
            textRun(' in the Department of ', 28, false),
            textRun(s.departmentName || '[Department]', 28, false),
            textRun(' at ', 28, false),
            textRun((s.collegeName || '[COLLEGE NAME]').toUpperCase(), 28, true), // Bold College
            textRun(' under ', 28, false),
            textRun((s.universityName || '[UNIVERSITY NAME]').toUpperCase(), 28, true), // Bold University
            textRun(' is an authentic record of our own work carried out during a period ', 28, false),
            textRun(s.academicYear || '[Year]', 28, false),
            textRun('. The matter presented in this project has not been submitted by us or anybody else in any other University / Institute for the award of ', 28, false),
            textRun(s.degreeName || 'B. Tech', 28, false),
            textRun(' Degree.', 28, false),
        ],
    });

    children.push(declPara);

    // Declaration Footer (Date & Signature)
    children.push(new Paragraph({ spacing: { before: 1440 } })); // Large Spacer (approx 2 inches or enough to push to bottom)
    children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [textRun('Date :', 28, false)] })],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [textRun('Signature :', 28, false)] })],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                ],
            }),
        ],
    }));

    children.push(pageBreak());

    // ─── Acknowledgement ────────────────────────
    // ─── Acknowledgement ────────────────────────
    children.push(heading('ACKNOWLEDGEMENT'));

    // Para 1: Almighty + Project Title
    children.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 240, line: 360, lineRule: 'auto' },
        children: [
            textRun('First and foremost, we sincerely thank the Almighty for his grace for the successful and timely completion of the stage of our project "', 28, false),
            textRun((s.projectTitle || '[PROJECT TITLE]').toUpperCase(), 28, true), // Bold Title
            textRun('". We are greatly indebted to all those who helped us to make this project successful.', 28, false),
        ],
    }));

    // Para 2: Principal, HOD, Guide, Coordinators
    children.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 240, line: 360, lineRule: 'auto' },
        children: [
            textRun('We are also grateful to ', 28, false),
            textRun(s.principalName || '[Principal Name]', 28, true), // Bold Principal
            textRun(', Principal, ', 28, false),
            textRun(s.collegeName || '[College Name]', 28, false),
            textRun(', for providing us with the best facilities and atmosphere for our project development. We also wish to express our gratitude to ', 28, false),
            textRun(s.hodName || '[HOD Name]', 28, true), // Bold HOD
            textRun(', ', 28, false),
            textRun(s.hodDesignation || 'Head of Department', 28, false), // e.g. "Associate Professor & H.O.D"
            textRun(', Department of ', 28, false),
            textRun(s.departmentName || '[Department]', 28, false),
            textRun('. We owe special thanks to our Project Guide ', 28, false),
            textRun(s.guideName || '[Guide Name]', 28, true), // Bold Guide
            textRun(', ', 28, false),
            textRun(s.guideDesignation || 'Assistant Professor', 28, false),
            textRun(', Department of ', 28, false),
            textRun(s.guideDepartment || s.departmentName || '[Department]', 28, false),
            textRun(' and our coordinators ', 28, false),
            textRun(s.coordinator1Name || '[Coordinator 1]', 28, true), // Bold Coord 1
            textRun(' and ', 28, false),
            textRun(s.coordinator2Name || '[Coordinator 2]', 28, true), // Bold Coord 2
            textRun(', ', 28, false),
            textRun(s.coordinator1Designation || 'Assistant Professors', 28, false),
            textRun(', Department of ', 28, false),
            textRun(s.departmentName || '[Department]', 28, false),
            textRun(', for their corrections, valuable and countless suggestions, support and timely guidance.', 28, false),
        ],
    }));

    // Para 3: Friends
    children.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 240, line: 360, lineRule: 'auto' },
        children: [
            textRun('Finally, but not least we would like to acknowledge our friends who were inevitable for the successful completion of this project.', 28, false),
        ],
    }));

    children.push(pageBreak());

    // ─── Abstract ───────────────────────────────
    if (s.abstract) {
        children.push(heading('ABSTRACT'));
        s.abstract.split('\n').filter(p => p.trim()).forEach(p => {
            children.push(bodyPara(p));
        });
        children.push(pageBreak());
    }

    // Second section: Chapters with page numbering
    const chapterChildren = [];

    // ─── Chapters ───────────────────────────────
    s.chapters.forEach((ch, ci) => {
        if (ci > 0) chapterChildren.push(pageBreak());

        chapterChildren.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun(`Chapter ${ci + 1}`, 32, true)],
            spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
            keepNext: true,
        }));
        chapterChildren.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun(ch.title.toUpperCase(), 32, true)],
            spacing: { after: 360, line: LINE_SPACING, lineRule: 'auto' },
            keepNext: true, // Keep title with first section/content
        }));

        let figCount = 0;
        let textCount = 0;
        ch.subsections.forEach((sub, si) => {
            // Handle Diagram
            if (sub.image) {
                figCount++;
                try {
                    // Page margins: Left 1.5" (2160 dxa), Right 1" (1440 dxa). Width 8.5" (12240 dxa).
                    // Writable width = 12240 - 2160 - 1440 = 8640 dxa = 6 inches.
                    const userPct = (sub.width || 75) / 100;
                    const finalWidthPx = 6 * 96 * userPct; // 96 DPI approximation for calculation

                    // Maintain aspect ratio if we have dimensions
                    let transform = { width: finalWidthPx, height: finalWidthPx * 0.75 }; // Default 4:3

                    if (sub.imgWidth && sub.imgHeight) {
                        const ratio = sub.imgHeight / sub.imgWidth;
                        transform = { width: finalWidthPx, height: finalWidthPx * ratio };
                    }

                    const image = new ImageRun({
                        data: sub.image.split(',')[1],
                        transformation: transform,
                    });

                    // Image
                    chapterChildren.push(new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [image],
                        spacing: { before: 240, after: 120, line: LINE_SPACING, lineRule: 'auto' },
                        keepNext: true,
                    }));

                    // Caption
                    chapterChildren.push(new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: `Figure ${ci + 1}.${figCount}: ${sub.caption || ''}`, font: FONT, size: 22, italics: true })],
                        spacing: { after: 360, line: LINE_SPACING, lineRule: 'auto' },
                    }));
                } catch (e) {
                    console.warn('Failed to add diagram to DOCX', e);
                }
                return; // Skip text rendering for this item
            }

            // Handle Text
            textCount++;
            if (sub.title) {
                chapterChildren.push(new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [textRun(`${ci + 1}.${textCount} ${sub.title}`, 28, true)],
                    spacing: { before: 240, after: 120, line: LINE_SPACING, lineRule: 'auto' },
                    keepNext: true, // Keep subheading with content
                    keepLines: true,
                }));
            }
            if (sub.content) {
                sub.content.split('\n').filter(p => p.trim()).forEach(p => {
                    chapterChildren.push(new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        indent: { firstLine: 720 },
                        children: [textRun(p, 24, false)],
                        spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
                    }));
                });
            }
        });
    });

    // ─── References ─────────────────────────────
    if (s.references && s.references.trim()) {
        chapterChildren.push(pageBreak());
        chapterChildren.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun('REFERENCES', 32, true)],
            spacing: { after: 360, line: LINE_SPACING, lineRule: 'auto' },
        }));

        const refs = s.references.split('\n').filter(r => r.trim());
        refs.forEach((r, i) => {
            chapterChildren.push(new Paragraph({
                children: [textRun(`[${i + 1}] ${r}`, 24, false)],
                spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
            }));
        });
    }

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: FONT, size: 24 },
                    paragraph: { spacing: { line: LINE_SPACING, lineRule: 'auto' } },
                },
            },
        },
        sections: [
            // Front matter section (no page numbers)
            {
                properties: {
                    page: {
                        margin: { top: 1440, bottom: 1440, left: 2160, right: 1440 }, // 1" T/B/R, 1.5" L
                    },
                },
                children: children,
            },
            // Chapters section (with page numbers starting at 1)
            {
                properties: {
                    page: {
                        margin: { top: 1440, bottom: 1440, left: 2160, right: 1440 },
                        pageNumbers: { start: 1 },
                    },
                },
                headers: {},
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                        font: FONT,
                                        size: 20,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: chapterChildren,
            },
        ],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${s.projectTitle || 'Project_Report'}.docx`);
    }).catch(err => {
        console.error('DOCX generation error:', err);
        alert('Failed to generate DOCX. Check console for details.');
    });
}

// ─── Helpers ────────────────────────────────────
function textRun(text, size, bold) {
    return new TextRun({ text, font: FONT, size, bold });
}

function heading(text) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, font: FONT, size: 32, bold: true, underline: {} })],
        spacing: { after: 480, line: LINE_SPACING, lineRule: 'auto' },
        keepNext: true,
        keepLines: true,
    });
}

function bodyPara(text, size = 24) {
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [textRun(text, size, false)],
        spacing: { after: 200, line: LINE_SPACING, lineRule: 'auto' },
    });
}

function pageBreak() {
    return new Paragraph({
        children: [new TextRun({ break: 1 })],
        spacing: { line: LINE_SPACING, lineRule: 'auto' },
    });
}

function buildCoverPage(s) {
    const paras = [];
    const memberNames = s.members.filter(m => m.name).map(m => `${m.name.toUpperCase()}${m.regNo ? ` (${m.regNo})` : ''}`);

    // Project Title (underlined, at top) - 18pt
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun((s.projectTitle || '').toUpperCase(), 36, true)], // 18pt
        spacing: { before: 240, after: 480, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // Report Type (e.g. MINI PROJECT REPORT) - 16pt
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun(s.reportType || 'MINI PROJECT REPORT', 32, true)], // 16pt
        spacing: { after: 720, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // "Submitted by" (italic) - 12pt
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Submitted by', font: FONT, size: 24, italics: true })],
        spacing: { after: 240, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // Member names (bold, uppercase, with reg numbers) - 14pt
    memberNames.forEach(name => {
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun(name, 28, true)], // 14pt
            spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
        }));
    });

    // "Under the guidance of" (italic) - 12pt
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Under the guidance of', font: FONT, size: 24, italics: true })],
        spacing: { before: 720, after: 240, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // Guide Name (bold, larger) - 16pt
    if (s.guideName) {
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun(s.guideName.toUpperCase(), 32, true)], // 16pt
            spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
        }));
    }

    // Guide Designation (italic) - 12pt
    if (s.guideDesignation) {
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: s.guideDesignation, font: FONT, size: 24, italics: true })],
            spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
        }));
    }

    // Guide Department (bold, italic) - 12pt
    if (s.departmentName) {
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Department of ${s.departmentName}`, font: FONT, size: 24, bold: true, italics: true })],
            spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
        }));
    }

    // Guide College (bold, italic) - 12pt
    if (s.collegeName) {
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: s.collegeName, font: FONT, size: 24, bold: true, italics: true })],
            spacing: { after: 240, line: LINE_SPACING, lineRule: 'auto' },
        }));
    }

    // "to" - 12pt
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun('to', 24, false)],
        spacing: { after: 240, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // University (bold) - 14pt
    if (s.universityName) {
        const uniText = `the ${s.universityName}${s.collegeAddress ? `, ${s.collegeAddress}` : ''}`;
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun(uniText, 28, true)], // 14pt
            spacing: { after: 240, line: LINE_SPACING, lineRule: 'auto' },
        }));
    }

    // Fulfillment text - 12pt
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun('in partial fulfillment of the requirements for the award of', 24, false)],
        spacing: { after: 120, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // Degree name - 14pt
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun(s.degreeName || s.course || '', 28, true)], // 14pt
        spacing: { after: 480, line: LINE_SPACING, lineRule: 'auto' },
    }));

    // University Logo (Centered at bottom)
    if (s.universityLogo) {
        try {
            const image = new ImageRun({
                data: s.universityLogo.split(',')[1],
                transformation: { width: 120, height: 120 },
            });
            paras.push(new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [image],
                spacing: { after: 480, line: LINE_SPACING, lineRule: 'auto' },
            }));
        } catch (e) {
            console.warn('Failed to add university logo to DOCX cover page', e);
        }
    }

    // Bottom: Department + College - 14pt/12pt
    if (s.departmentName) {
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun(`Department of ${s.departmentName}`, 28, true)], // 14pt
            spacing: { before: 240, after: 120, line: LINE_SPACING, lineRule: 'auto' },
        }));
    }

    if (s.collegeName) {
        const collegeBottom = `${s.collegeName}${s.collegeAddress ? `, ${s.collegeAddress}` : ''}`;
        paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [textRun(collegeBottom, 24, false)], // 12pt
            spacing: { line: LINE_SPACING, lineRule: 'auto' },
        }));
    }

    return paras;
}

function generateCertBodyText(s) {
    const memberList = s.members.filter(m => m.name).map(m => `${m.name.toUpperCase()}${m.regNo ? ` (${m.regNo})` : ''}`).join(', ') || '[Member Names]';
    return `Certified that this report entitled '${s.projectTitle || '[Project Title]'}' is the report of ${(s.reportType || 'mini project').toLowerCase()} presented by ${memberList} during the year (${s.academicYear || '[Year]'}) in partial fulfilment of the requirements for the award of the Degree of ${s.degreeName || s.course || '[Degree]'} of the ${s.universityName || '[University Name]'}${s.collegeAddress ? `, ${s.collegeAddress}` : ''}.`;
}

function buildSignatoryRows(s) {
    const paras = [];
    const dept = s.departmentName ? `Department of ${s.departmentName}` : '';
    const college = s.collegeName || '';

    // Helper to create a cell content (array of paragraphs)
    function createCellContent(name, role, designation, specificDept) {
        if (!name) return [new Paragraph({})]; // Empty paragraph for alignment

        const lines = [];
        const deptText = specificDept ? `Department of ${specificDept}` : dept;

        lines.push(new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [textRun(name, 24, true)], // 12pt
            spacing: { line: LINE_SPACING, lineRule: 'auto' },
        }));
        if (role) {
            lines.push(new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: `(${role})`, font: FONT, size: 24, italics: false })], // 12pt, normal
                spacing: { line: LINE_SPACING, lineRule: 'auto' },
            }));
        }
        if (designation) {
            lines.push(new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [textRun(designation, 24, false)],
                spacing: { line: LINE_SPACING, lineRule: 'auto' },
            }));
        }
        if (deptText) {
            lines.push(new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [textRun(deptText + ',', 24, false)],
                spacing: { line: LINE_SPACING, lineRule: 'auto' },
            }));
        }
        if (college) {
            lines.push(new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [textRun(college, 24, false)],
                spacing: { line: LINE_SPACING, lineRule: 'auto' },
            }));
        }
        return lines;
    }


    // Add spacer before signatories
    paras.push(new Paragraph({ spacing: { before: 600, line: LINE_SPACING, lineRule: 'auto' }, children: [] }));

    // Create a 2x2 table (invisible borders)
    const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
        },
        rows: [
            // Row 1: Guide | Coordinator 1
            new TableRow({
                children: [
                    new TableCell({
                        children: createCellContent(s.guideName, 'Project Guide', s.guideDesignation, s.guideDepartment),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: { bottom: 400 }, // Margin between rows
                    }),
                    new TableCell({
                        children: createCellContent(s.coordinator1Name, 'Project Coordinator', s.coordinator1Designation, s.coordinator1Department),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: { bottom: 400 },
                    }),
                ],
            }),
            // Spacer Row
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ spacing: { after: 400 } })], columnSpan: 2, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE } } })
                ]
            }),
            // Row 2: Coordinator 2 | HOD
            new TableRow({
                children: [
                    new TableCell({
                        children: createCellContent(s.coordinator2Name, 'Project Coordinator', s.coordinator2Designation, s.coordinator2Department),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: createCellContent(s.hodName, s.hodDesignation || 'HOD', s.hodDesignation ? '' : '', s.hodDepartment),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                ],
            }),
        ],
    });

    paras.push(table);
    return paras;
}
