# Research Summary (Context7 + code_research)

## Nguồn Context7 (chính thức)
- Ant Design Modal + Form trong Modal: khuyến nghị `forceRender` để form instance gắn đúng khi modal chưa render. Nguồn: `/ant-design/ant-design`, chủ đề “modal form”.
- Modal static/hook APIs: `Modal.useModal`, `Modal.destroyAll`, cập nhật/destroy modal instance. Nguồn: `/ant-design/ant-design`.
- TanStack Router search params: navigate với `search={(prev)=>({...prev,...})}`, giữ hoặc thay search params, pagination/filter patterns. Nguồn: `/tanstack/router`, chủ đề “search params navigate”.

## Code_research
- Từ khóa: “react typescript generic crud page antd table form config driven”. Không tìm thấy ví dụ cụ thể trên GitHub (dịch vụ tạm unavailable); tài nguyên MDN chỉ là khái niệm CRUD, không hữu dụng trực tiếp.

## Áp dụng
- Modal/Form: thêm `forceRender` khi Form nằm trong Modal để tránh cảnh báo instance.
- Navigate search params: dùng functional updater để merge giữ filter/pagination khi thay đổi một tham số; clearFilters thay toàn bộ search về default.

