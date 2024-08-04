# p2p-messaging
Peer-to-Peer Communication System: A Node.js application for managing peer registrations, connections, and messaging in a P2P network. Includes a server and client components.

# Peer-to-Peer Messaging System

این پروژه یک سیستم پیام‌رسانی همتا به همتا (P2P) ساده است که شامل یک سرور و کلاینت است. کاربران می‌توانند با ثبت‌نام، اتصال به همتایان دیگر، و ارسال پیام‌ها ارتباط برقرار کنند.

## نصب

1. **کلون کردن مخزن:**
    ```bash
    git clone https://github.com/yourusername/your-repo.git
    ```

2. **نصب وابستگی‌ها:**
    ```bash
    cd your-repo
    npm install
    ```

## راه‌اندازی سرور

1. **اجرا کردن سرور:**
    ```bash
    node server.js
    ```
    سرور به صورت پیش‌فرض روی پورت `3000` در حال اجرا است.

## راه‌اندازی کلاینت

1. **اجرا کردن کلاینت:**
    ```bash
    node peer.js <username> <ip> <port>
    ```
    - `username`: نام کاربری منحصر به فرد برای شناسایی
    - `ip`: آدرس IP محلی
    - `port`: پورتی که کلاینت در آن گوش می‌دهد

## استفاده

- **دستورات کلاینت:**
  - `connect <ip> <port>`: اتصال به همتای مشخص
  - `list`: نمایش لیست همتایان در دسترس
  - `unregister`: لغو ثبت‌نام و خروج از برنامه

>>>>>>> eab7805 (Initial commit)
