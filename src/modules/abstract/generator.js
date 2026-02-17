
import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBorderDisplay, BorderStyle, convertInchesToTwip, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

// 1.5 line spacing in OOXML = 360 (240 * 1.5) — Build v2
const LINE_SPACING_1_5 = 360;

export function generateDocx(state) {
    // Prepare Member List
    const memberParagraphs = state.members
        .filter(m => m.name.trim() || m.reg.trim())
        .map(m => new Paragraph({
            children: [
                new TextRun({
                    text: m.reg ? `${m.name} (${m.reg})` : m.name,
                    font: "Times New Roman",
                    size: 24,
                })
            ],
            spacing: { line: 360, lineRule: "auto" }
        }));

    // Prepare Guide Details
    const guideParagraphs = [];
    if (state.guide && state.guide.name.trim()) {
        guideParagraphs.push(
            new Paragraph({
                children: [new TextRun({ text: state.guide.name, font: "Times New Roman", size: 24, bold: true })],
                spacing: { line: 360, lineRule: "auto" }
            })
        );
        if (state.guide.designation) {
            guideParagraphs.push(new Paragraph({
                children: [new TextRun({ text: state.guide.designation, font: "Times New Roman", size: 24 })],
                spacing: { line: 360, lineRule: "auto" }
            }));
        }
        if (state.guide.dept) {
            guideParagraphs.push(new Paragraph({
                children: [new TextRun({ text: state.guide.dept, font: "Times New Roman", size: 24 })],
                spacing: { line: 360, lineRule: "auto" }
            }));
        }
        if (state.guide.college) {
            guideParagraphs.push(new Paragraph({
                children: [new TextRun({ text: state.guide.college, font: "Times New Roman", size: 24 })],
                spacing: { line: 360, lineRule: "auto" }
            }));
        }
    }

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
                    spacing: { after: 1440, line: 360, lineRule: "auto" } // 1 inch approx margin before signatures
                })] : [new Paragraph({ spacing: { after: 1440 } })]),

                // Signatures Table (Using a table for correct alignment)
                ...(memberParagraphs.length > 0 || guideParagraphs.length > 0 ? [
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            ...(memberParagraphs.length > 0 ? [
                                                new Paragraph({
                                                    children: [new TextRun({ text: "GROUP MEMBERS", bold: true, font: "Times New Roman", size: 24 })],
                                                    spacing: { after: 240 }
                                                }),
                                                ...memberParagraphs
                                            ] : [])
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            ...(guideParagraphs.length > 0 ? [
                                                new Paragraph({
                                                    alignment: AlignmentType.RIGHT,
                                                    children: [new TextRun({ text: "GUIDE", bold: true, font: "Times New Roman", size: 24 })],
                                                    spacing: { after: 240 }
                                                }),
                                                // Align guide details to right as well
                                                ...guideParagraphs.map(p => new Paragraph({
                                                    alignment: AlignmentType.RIGHT,
                                                    children: p.options.children,
                                                    spacing: { line: 360, lineRule: "auto" }
                                                }))
                                            ] : [])
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    })
                ] : [])
            ],
        }],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "abstract.docx");
    });
}
