
import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBorderDisplay, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export function generateDocx(state) {
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1440, // 1 inch (twips)
                        right: 1440,
                        bottom: 1440,
                        left: 1440,
                    },
                    borders: state.showBorder ? {
                        pageBorderTop: { style: BorderStyle.DOUBLE, size: 24, space: 24, color: "000000" },
                        pageBorderRight: { style: BorderStyle.DOUBLE, size: 24, space: 24, color: "000000" },
                        pageBorderBottom: { style: BorderStyle.DOUBLE, size: 24, space: 24, color: "000000" },
                        pageBorderLeft: { style: BorderStyle.DOUBLE, size: 24, space: 24, color: "000000" },
                        display: PageBorderDisplay.ALL_PAGES,
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
                    spacing: { after: 720 },
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
                    spacing: { after: 240 },
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
                    spacing: { after: 480 },
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
                    spacing: { after: 2500 } // Push signature down
                })] : [new Paragraph({ spacing: { after: 2500 } })]),

                // Signatures Table (Simulated with tabs or table)
                // Using Tabs for simplicity or a Table without borders
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "GROUP MEMBERS",
                            bold: true,
                            font: "Times New Roman",
                            size: 24,
                        }),
                        new TextRun({
                            text: "\t\t\t\t\t\tGUIDE", // Tabbed over
                            bold: true,
                            font: "Times New Roman",
                            size: 24,
                        }),
                    ],
                    tabStops: [
                        { position: 8000, type: "left" } // Adjust tab position
                    ]
                }),

                // Spacing
                new Paragraph({ spacing: { before: 240 } }),

                // Members and Guide - using a simple loop might not align perfectly if lists have different lengths
                // Better to use a table invisible borders
                ...renderSignatureSection(state)
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
            ]
        }));
    }

    return paragraphs;
}
