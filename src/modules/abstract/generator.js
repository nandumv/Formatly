
import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBorderDisplay, BorderStyle, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';

// 1.5 line spacing in OOXML = 360 (240 * 1.5) — Build v2
const LINE_SPACING_1_5 = 360;

export function generateDocx(state) {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Times New Roman",
                        size: 24, // 12pt
                    },
                    paragraph: {
                        spacing: { line: LINE_SPACING_1_5, lineRule: "auto" },
                    },
                },
            },
        },
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1250, // Approx 0.87 inch (Ensures gap inside border)
                        right: 1250,
                        bottom: 1250,
                        left: 1250,
                    },
                    borders: state.showBorder ? {
                        pageBorderTop: { style: BorderStyle.DOUBLE, size: 12, space: 12, color: "000000" },
                        pageBorderRight: { style: BorderStyle.DOUBLE, size: 12, space: 12, color: "000000" },
                        pageBorderBottom: { style: BorderStyle.DOUBLE, size: 12, space: 12, color: "000000" },
                        pageBorderLeft: { style: BorderStyle.DOUBLE, size: 12, space: 12, color: "000000" },
                        display: "allPages",
                        offsetFrom: "page",
                        top: 36,
                        right: 36,
                        bottom: 36,
                        left: 36,
                        zOrder: "front"
                    } : undefined,
                },
            },
            children: [
                // Title
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: state.title.toUpperCase(),
                            bold: true,
                            underline: {},
                            font: "Times New Roman",
                            size: 32, // 16pt
                        }),
                        ...(state.domain ? [
                            new TextRun({
                                text: `\n(${state.domain})`,
                                font: "Times New Roman",
                                size: 24, // 12pt
                                break: 1,
                            })
                        ] : []),
                    ],
                    spacing: { after: 720, line: 360, lineRule: "auto" },
                }),

                // ABSTRACT Heading
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({
                            text: "ABSTRACT",
                            bold: true,
                            underline: {},
                            font: "Times New Roman",
                            size: 28, // 14pt
                        }),
                    ],
                    spacing: { after: 240, line: 360, lineRule: "auto" },
                }),

                // Abstract Content
                new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    indent: { firstLine: 720 }, // Indent first line (0.5 inch)
                    children: [
                        new TextRun({
                            text: state.abstract,
                            font: "Times New Roman",
                            size: 24, // 12pt
                        }),
                    ],
                    spacing: { after: 480, line: 360, lineRule: "auto" },
                }),

                // Keywords Section (Conditional)
                ...(state.keywords ? [new Paragraph({
                    children: [
                        new TextRun({
                            text: "Keywords: ",
                            bold: true,
                            font: "Times New Roman",
                            size: 24,
                        }),
                        new TextRun({
                            text: state.keywords,
                            font: "Times New Roman",
                            size: 24,
                        }),
                    ],
                    spacing: { after: 2500, line: 360, lineRule: "auto" } // Push signature down
                })] : [new Paragraph({ spacing: { after: 2500 } })]),

                // Signatures Table (Simulated with tabs or table)
                // Using Tabs for simplicity or a Table without borders
                // Signatures Table (Simulated with tabs or table)
                // Using Tabs for simplicity or a Table without borders
                ...(state.members.filter(m => m.name.trim() || m.reg.trim()).length > 0 || state.guide.name.trim() ? [
                    new Paragraph({
                        children: [
                            ...(state.members.filter(m => m.name.trim() || m.reg.trim()).length > 0 ? [
                                new TextRun({
                                    text: "GROUP MEMBERS",
                                    bold: true,
                                    font: "Times New Roman",
                                    size: 24,
                                }),
                            ] : []),
                            ...(state.guide && state.guide.name.trim() ? [
                                new TextRun({
                                    text: "\t\t\t\t\t\tGUIDE", // Tabbed over
                                    bold: true,
                                    font: "Times New Roman",
                                    size: 24,
                                })
                            ] : [])
                        ],
                        tabStops: [
                            { position: 8000, type: "left" } // Adjust tab position
                        ],
                        spacing: { before: 240, line: 360, lineRule: "auto" }
                    }),

                    // Members and Guide - using a simple loop might not align perfectly if lists have different lengths
                    // Better to use a table invisible borders
                    ...renderSignatureSection(state)
                ] : [])
            ],
        }],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "abstract.docx");
    });
}

function renderSignatureSection(state) {
    const paragraphs = [];

    // We'll iterate the max length of members vs guide (1)
    for (let i = 0; i < state.members.length; i++) {
        const member = state.members[i];
        const isFirst = i === 0;
        const guideText = isFirst ? state.guide.name : "";

        const memberText = member.reg ? `${member.name} (${member.reg})` : member.name;

        paragraphs.push(new Paragraph({
            children: [
                new TextRun({
                    text: memberText,
                    font: "Times New Roman",
                    size: 24,
                }),
                new TextRun({
                    text: `\t\t\t\t\t\t${guideText}`,
                    font: "Times New Roman",
                    size: 24,
                    bold: isFirst // Bold name
                }),
                // Add Dept/College on subsequent lines if it's the first member
                ...(isFirst ? [
                    new TextRun({
                        text: `\n\t\t\t\t\t\t${state.guide.dept}`,
                        font: "Times New Roman",
                        size: 24,
                        break: 1
                    }),
                    new TextRun({
                        text: `\n\t\t\t\t\t\t${state.guide.college}`,
                        font: "Times New Roman",
                        size: 24,
                        break: 1
                    })
                ] : [])
            ],
            tabStops: [
                { position: 8000, type: "left" }
            ],
            spacing: { line: 360, lineRule: "auto" }
        }));
    }

    return paragraphs;
}
