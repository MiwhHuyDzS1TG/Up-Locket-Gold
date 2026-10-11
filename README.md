# Locket Gold Guide

Website hướng dẫn cài đặt Locket Gold bằng tiếng Việt, xây dựng với Next.js App Router, TypeScript, Tailwind CSS, Motion và Lucide Icons. Giao diện mobile-first, tối ưu cho Safari trên iPhone và sẵn sàng triển khai lên Vercel.

## Chức năng

- Hướng dẫn ba bước theo timeline dọc.
- Thanh tiến trình sticky và lưu trạng thái hoàn thành bằng `localStorage`.
- Sao chép email, mật khẩu và Module bằng Clipboard API, có fallback cho Safari iOS.
- Hiện hoặc ẩn mật khẩu. Thông tin đăng nhập không được ghi vào `localStorage`.
- Tải trực tiếp tệp `.mobileconfig` do chủ website cung cấp.
- Phát video HTML5 có controls, `playsInline` và `preload="metadata"`.
- Nhúng YouTube ở chế độ tăng cường quyền riêng tư qua `youtube-nocookie.com`.
- Trạng thái kiểm tra tệp, đang tải, thiếu tệp và lỗi video.
- Tôn trọng safe area, reduced motion và reduced transparency.

## Yêu cầu môi trường

- Node.js 20.9 trở lên. Dự án đã được kiểm tra với Node.js 22.
- npm 10 trở lên.

## Chạy trên máy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Các lệnh kiểm tra:

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Vị trí hai tệp nội dung

Hai tệp thật đã được đặt đúng vị trí:

```text
public/downloads/locketgold.mobileconfig
public/videos/dns.mp4
```

Không tạo tệp giả. Nếu thay nội dung, giữ nguyên tên và đường dẫn để website tự nhận tệp mới.

## Chỉnh nội dung

Các URL và thông tin hiển thị nằm tại:

```text
src/config/site.ts
```

File này chứa:

- `APPSTORE_EMAIL`
- `APPSTORE_PASSWORD`
- `CONFIG_DOWNLOAD_URL`
- `DNS_VIDEO_URL`
- `MODULE_URL`
- `YOUTUBE_URL`
- `YOUTUBE_EMBED_URL`
- `SUPPORT_URL`
- Nội dung các bước đăng nhập App Store

`SUPPORT_URL` hiện trỏ đến kênh hỗ trợ Messenger và có thể thay đổi trong `src/config/site.ts`.

Quan trọng: mọi giá trị frontend đều công khai, kể cả mật khẩu hiển thị. Không xem các hằng số trong file này là bí mật an toàn.

## Deploy lên Vercel

1. Đưa source code lên GitHub, GitLab hoặc Bitbucket.
2. Trong Vercel, chọn **Add New Project** và import repository.
3. Vercel tự nhận diện Next.js. Không cần sửa Build Command hoặc Output Directory.
4. Chọn **Deploy**.
5. Sau khi deploy, kiểm tra lại đường dẫn tải cấu hình, video HTML5, YouTube và `SUPPORT_URL`.

Không cần database, backend hoặc biến môi trường cho cấu hình hiện tại.

## Cấu trúc chính

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    copy-field.tsx
    guide-experience.tsx
    step-card.tsx
  config/
    site.ts
public/
  assets/
    locket-gold-hero.webp
  downloads/
    locketgold.mobileconfig
  videos/
    dns.mp4
```

## Lưu ý bảo mật

- Chỉ hướng dẫn đăng nhập trong **Phương tiện & Mục mua**, không đăng xuất iCloud cá nhân.
- Không yêu cầu người dùng cung cấp mật khẩu cá nhân hoặc mã xác minh tài khoản riêng.
- Cấu hình DNS/VPN và Module có thể thay đổi cách thiết bị xử lý lưu lượng mạng. Người dùng chỉ nên tiếp tục khi hiểu rõ nguồn cung cấp và rủi ro.
- Việc hoàn thành ba bước chỉ xác nhận đã xem hướng dẫn, không đảm bảo thuê bao đã được kích hoạt.
