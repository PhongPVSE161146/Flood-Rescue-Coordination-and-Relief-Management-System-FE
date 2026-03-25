# -Flood-Rescue-Coordination-and-Relief-Management-System-FE


link web của nhóm : https://cuuhoswp.netlify.app/
link hệ thống quản lý của nhóm: https://hethongcuhoswp.netlify.app/



lệnh chạy 
npm run dev



Hướng dẫn cách deploy lên netlìy

#1 nếu dã cấu hình rôi dùng lệnh 

  Window + Mac 
npm run build (nếu lỗi ở mac)
chạy lệnh (sudo chown -R $(whoami) dist)
chạy xong băt đầu chạy lại lệnh (npm run build )
xong xóa thư muc dist chạy lẹnh (rm -rf dist)
sau đó build lại lệnh (npm run build)
 cuối cùng dploy lên lại cả win và mac dùng lệnh (netlify deploy --prod) đốp với mac phải thêm sudo dùng lệnh (sudo netlify deploy --prod)

 #2 nếu chưa cấu hình thì dùng lệnh đối với máy mac phải thêm  sudo 

 1. Cài Netlify CLI
 npm install -g netlify-cli
 2. Đăng nhập Netlify
 netlify login
 note:Trình duyệt sẽ mở ra để bạn đăng nhập tài khoản trên Netlify.
 3. Build project React (lệnh này mac không cần dùng sudo)
 npm run build
 note: Sau khi build, thư mục build/ sẽ được tạo (đây là thứ Netlify dùng để deploy).
 4. Khởi tạo site trên Netlify (không nên dùng sudo nếu mà khong dùng được nên sudo ở mac)
 netlify init
 note: Chọn:
+ "Create & configure a new site"
+ Chọn team (nếu có)
+ Đặt tên site (hoặc để random)
 5. Deploy lần đầu
 netlify deploy --prod
 note: Sau đó site sẽ được deploy và bạn sẽ nhận được URL 







 