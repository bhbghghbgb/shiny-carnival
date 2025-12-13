import * as XLSX from "xlsx";

export async function importTableExcel(createFields, file, onCreate) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                for (const row of rows) {

                    for (const field of createFields) {
                        payload[field] = row[field] ?? "";
                    }

                    console.log("📦 Payload gửi API:", payload);

                    await onCreate({ request: payload });
                }

                resolve(true);

            } catch (err) {
                console.error("❌ Import Excel Error:", err);
                reject(err);
            }
        };

        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}