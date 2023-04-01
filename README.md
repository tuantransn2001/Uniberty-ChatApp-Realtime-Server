1. Create Env File with: PORT = 8000 , DB_PW = C5xrkKevH57at25b

2. Flow

   - Step 1:
     Login
     -> Client emit event "new-user"
     -> Server trả về list user đã từng chat vs user hiện tại.
     -> Client render list user vào sideBar

   - Step 2:
     Client - user ( đang đăng nhập ) click vào user muốn chat
     -> client emit ev`ent "join-chat" và gửi kèm thông tin phòng chat hiện tại và phòng chat mới ( khi click )
     -> server nhận thông tin phòng chat mới và trả về tin nhắn phòng chat đó.
