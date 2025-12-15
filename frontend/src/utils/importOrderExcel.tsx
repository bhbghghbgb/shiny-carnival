import * as XLSX from 'xlsx';
import type { DropDownWithFilterOption } from '../components/common/DropDownWithFilter';
import { fetchCustomerOptions, fetchProductOptions } from '../features/orders/config/orderPageConfig';
import type { CreateOrderRequest } from '../features/orders/types/api';


/**
 * Nhập Excel và tạo đơn hàng
 * @param file File Excel
 * @param createOrderFn Hàm mutateAsync của createOrder
 */
export const importOrderExcel = async (
  file: File,
  createOrderFn: (payload: CreateOrderRequest) => Promise<any>
) => {
  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = e.target?.result;
      if (!data) throw new Error('Không đọc được file');

      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      // Nhóm theo orderGroup
      const orderGroups: Record<string, any[]> = {};
      rows.forEach((row) => {
        const group = row['orderGroup'];
        if (!orderGroups[group]) orderGroups[group] = [];
        orderGroups[group].push(row);
      });

      for (const group of Object.values(orderGroups)) {
        const firstRow = group[0];

        // Lấy customerId từ tên khách
        const customerOptions: DropDownWithFilterOption[] = await fetchCustomerOptions(firstRow['customer']);
        const customerMatch = customerOptions.find(o => o.label.startsWith(firstRow['customer']));
        const customerId =Number(customerMatch?.value);
        if (!customerId) {
          console.warn(`Không tìm thấy khách hàng: ${firstRow['customer']}`);
          continue; // Bỏ qua nếu không tìm thấy
        }

        // Map orderItems
        const orderItems = await Promise.all(group.map(async (r) => {
          const productOptions: DropDownWithFilterOption[] = await fetchProductOptions(r['product']);
          const productMatch = productOptions.find(o => o.label.startsWith(r['product']));
          const productId = Number(productMatch?.value);
          if (!productId) {
            console.warn(`Không tìm thấy sản phẩm: ${r['product']}`);
            return null;
          }
          return {
            productId,
            quantity: Number(r['quantity']) || 1,
          };
        }));

        // Lọc bỏ các item null
        const validItems = orderItems.filter(Boolean);

        if (!validItems.length) continue;

        // Tạo payload
        const payload: CreateOrderRequest = {
          customerId,
          promoCode: firstRow['promoCode'] || undefined,
          orderItems: validItems,
        };

        await createOrderFn(payload);
      }

      console.log('Import Excel hoàn tất');
    } catch (error) {
      console.error('Import Excel Error:', error);
    }
  };

  reader.readAsBinaryString(file);
};
