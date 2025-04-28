# FLOWA-TAF-FRONTEND

## Giới thiệu

Đây là dự án frontend cho nền tảng Flowa TAF, được phát triển bằng [Next.js](https://nextjs.org) và được khởi tạo với [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Hệ thống cung cấp giao diện quản lý và theo dõi cho các sản phẩm, thương hiệu, nội dung và tích hợp mạng xã hội.

## Công nghệ sử dụng

- **Next.js 14**: Framework React với server-side rendering và định tuyến
- **React 18**: Thư viện UI
- **TypeScript**: Ngôn ngữ lập trình mạnh mẽ với kiểu dữ liệu tĩnh
- **TailwindCSS**: Framework CSS tiện ích
- **React Query**: Quản lý trạng thái và data fetching
- **Formik & Yup**: Xử lý form và validation
- **Recharts**: Thư viện biểu đồ dữ liệu
- **Axios**: Thư viện HTTP client

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 18.x hoặc cao hơn
- npm hoặc yarn hoặc pnpm

### Các bước cài đặt

1. Clone dự án:

```bash
git clone <đường-dẫn-repository>
cd flowa-taf-frontend
```

2. Cài đặt các dependency:

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. Chạy môi trường phát triển:

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

4. Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

## Cấu trúc dự án

- `/app`: Chứa các components và trang của ứng dụng
  - `/components`: Các component được tái sử dụng
  - `/dashboard`: Các trang dashboard cho quản lý sản phẩm, thương hiệu và nội dung
  - `/auth`: Các trang xác thực (đăng nhập, đăng ký)
  - `/lib`: Các tiện ích và hàm hỗ trợ
- `/public`: Chứa tài nguyên tĩnh (hình ảnh, fonts,...)

## Triển khai

Dự án được cấu hình để triển khai dễ dàng trên Vercel:

1. Đẩy code lên repository GitHub, GitLab hoặc Bitbucket
2. Import dự án vào Vercel: https://vercel.com/new
3. Cấu hình các biến môi trường trong Vercel:
   - `NEXT_PUBLIC_API_URL`: URL của API backend

4. Vercel sẽ tự động phát hiện dự án Next.js và cấu hình đúng cách.

### Triển khai thủ công

Bạn cũng có thể triển khai thủ công bằng Vercel CLI:

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Đăng nhập vào Vercel
vercel login

# Triển khai
vercel
```

## Phát triển

Bạn có thể bắt đầu chỉnh sửa trang bằng cách sửa đổi các file trong thư mục `app`. Trang sẽ tự động cập nhật khi bạn chỉnh sửa file.

## Tài liệu tham khảo

- [Tài liệu Next.js](https://nextjs.org/docs) - tìm hiểu về các tính năng và API của Next.js
- [Học Next.js](https://nextjs.org/learn) - hướng dẫn tương tác về Next.js

## Liên hệ và hỗ trợ

Nếu bạn có bất kỳ câu hỏi hoặc gặp vấn đề nào, vui lòng liên hệ với team phát triển hoặc tạo issue trong repository của dự án.

---

&copy; 2023-2024 Flowa TAF. Bản quyền được bảo lưu.
