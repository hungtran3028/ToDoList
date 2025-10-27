# To‑Do List — Ứng dụng React (Vite)

Ứng dụng to‑do list đã được chuyển sang React với Vite. Project bây giờ là một SPA nhỏ, mã nguồn nằm trong `src/`.

Nội dung chính:
- `index.html` — entry (dùng bởi Vite)
- `src/main.jsx` — entry React
- `src/App.jsx` — component chính
- `src/index.css` — CSS

Chạy ứng dụng (phát triển):

```bash
# từ thư mục Project1
npm install   # nếu bạn chưa cài dependencies
npm run dev
# mở http://localhost:5173 (hoặc URL được hiển thị)
```

Build production:

```bash
npm run build
npm run preview
```

Tính năng hiện có:
- Thêm nhiệm vụ
- Đánh dấu hoàn thành
- Xoá nhiệm vụ
- Chỉnh sửa (double‑click hoặc prompt)
- Bộ lọc: Tất cả / Chưa xong / Đã xong
- Xoá tất cả nhiệm vụ đã hoàn thành
- Lưu trữ ở localStorage (khóa `todo_app_tasks_v1`)

Nếu bạn muốn tiếp tục, tôi có thể:
- Thêm routing, authentication, hoặc backend lưu trữ
- Chuyển sang TypeScript hoặc thêm unit tests

