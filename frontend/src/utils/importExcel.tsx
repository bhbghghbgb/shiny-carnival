import * as XLSX from "xlsx";
import type { DropDownWithFilterOption } from "../components/common/DropDownWithFilter";

export const buildOptionMap = async (
    fetchOptions: (keyword: string) => Promise<DropDownWithFilterOption[]>
  ): Promise<Map<string, number>> => {
    const options = await fetchOptions('');
    return new Map(
      options.map(opt => [
        opt.label.trim().toLowerCase(),
        opt.value as number,
      ])
    );
  };

export const getIdFromOptionMap = (
    map: Map<string, number>,
    label: string,
    fieldName: string
  ): number => {
    const id = map.get(label.trim().toLowerCase());
    if (!id) {
      throw new Error(`${fieldName} không hợp lệ: ${label}`);
    }
    return id;
  };
  
export async function importTableExcel(
    file: File,
    onCreate: (payload: Record<string, any>, rowIndex: number) => Promise<any>
) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
                const [header, ...rowsData] = rawData;
                if (!header) throw new Error("Excel sheet trống hoặc không có header");

                const rows = rowsData.map((rowArray) => {
                    const rowObj: Record<string, any> = {};
                    header.forEach((col: string, colIndex: number) => {
                        if (col !== "__rowNum__") {
                            rowObj[col] = rowArray[colIndex] ?? "";
                        }
                    });
                    return rowObj;
                });

                console.log("📘 RAW ROWS (Excel đọc được, theo thứ tự cột):", rows);

                for (let i = 0; i < rows.length; i++) {
                    await onCreate(rows[i], i + 1);
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