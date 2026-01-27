# 📌 Mark_Me
### Next-Gen Smart Attendance System

**Mark_Me** is a smart, secure & next-generation attendance management system that eliminates proxy attendance by using face recognition technology while maintaining user privacy, security, and speed.

---

## 🛠 Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Frontend     | React.js, Bootstrap     |
| Backend      | Node.js, Express.js     |
| Database     | MongoDB                 |
| Authentication | JWT                   |
| Face Models  | face-api.js (128D)      |

---

## ✨ Features

- JWT Authentication & Authorization
- Faculty-controlled attendance sessions
- Face recognition-based attendance (128D descriptor)
- Attendance analytics dashboard (charts & tables)
- Responsive and mobile-friendly UI
- Geofencing-based physical presence tracking *(ongoing)*

---

## 🔄 System Architecture & Workflow

1. Faculty logs in or registers  
2. Faculty opens an attendance session  
3. Student registers with academic details  
4. Face models load on the client  
5. Face is captured via the camera  
6. A 128-dimension face descriptor is generated  
7. Descriptor is sent to the backend  
8. Backend matches the descriptor with the database  
9. Attendance is marked and the dashboard is updated

## ⚙️ Installation & Setup

- git clone https://github.com/aakashverse/MarkMe
- npm install
- npm run dev      
- node app.js      
