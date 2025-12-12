import * as XLSX from "xlsx";

/** Đọc Excel chính xác 100% thứ tự cột */
export async function readExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = e => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheet];

                // Ép XLSX lấy header đúng hàng 1
                const rows = XLSX.utils.sheet_to_json(worksheet, {
                    defval: "",
                    header: 1
                });

                resolve(rows);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

export async function importTableExcel(config, file, onCreate) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // Đọc dạng OBJECT
                const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                console.log("📘 RAW ROWS (Excel đọc được):", rows);

                 const createFields = config.form?.create?.map(f => f.name) ?? [];
                 console.log("📘 createFields:", createFields);

                for (const row of rows) {
                    const payload = {};

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


/** Import Excel → tự tạo dữ liệu qua config + API */
// export async function importTableExcel(config, file, onCreate) {
//     const rawRows = await readExcel(file);
//     console.log("📘 RAW ROWS (Excel đọc được):", rawRows);

//     const headers = rawRows[0];     // hàng header
//     const dataRows = rawRows.slice(1); // các dòng dữ liệu

//     for (const row of dataRows) {
//         const payload: any = {};
    
//         headers.forEach((header, i) => {
//             payload[header] = row[i];
//         });
    
//         console.log("📦 Payload gửi API:", payload);
//         await onCreate(payload);
//     }    
// }