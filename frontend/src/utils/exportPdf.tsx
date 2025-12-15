import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;
function extractText(value: any): string {
    if (value === null || value === undefined) return "";

    if (typeof value === "string") return value;

    if (typeof value === "number") return value.toString();

    if (value?.props?.children) {
        const child = value.props.children;

        if (typeof child === "string" || typeof child === "number") return child.toString();

        if (Array.isArray(child)) return child.join(" ");

        return "";
    }

    return "";
}
export const exportTablePdf = (config: any, items: any[], fileName: string) => {
    const columns = config?.table?.columns ?? [];

    const headers = columns.map((c: any) => c.title);

        const rows = items.map(row =>
            columns.map(col => {
                const rawValue = row[col.dataIndex];

            if (typeof col.renderText === "function") {
                return col.renderText(rawValue, row) ?? "";
            }

            if (typeof col.render === "function") {
                try {
                    const rendered = col.render(rawValue, row);
                    return extractText(rendered);
                } catch {
                    return "";
                }
            }

            return extractText(rawValue);
        })
    );

    const docDefinition = {
        content: [
            { text: config.entity.displayNamePlural, style: "header" },
            {
                table: {
                    headerRows: 1,
                    widths: headers.map(() => "auto"),
                    body: [headers, ...rows],
                },
            },
        ],
        styles: {
            header: { fontSize: 18, bold: true, margin: [0, 0, 0, 20] },
        },
    };

    pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
};
