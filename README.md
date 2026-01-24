# Mark_Me is a Next-gen smart, secure and effortless Attendance System built with complete attendance analysis, speed, privacy & security. It reduces proxy and fasten up the attendance.

# - Tech Stacks -
# Frontend - React, Bootstrap
# Backend - Express.js
# Database - MongoDB
# Models - face.api.js


# - Features -
# JWT Authentication & Authorization ensuring privacy & security
# Session Controls (open/close) for respective subjects [from backend]
# Attendance with minimal details + Face detection [128B descriptor]
# Responsive & Modern that compatible with all devices
# Dashboard for quick attendance analysis [Piechart & Table]
# Track Student's Physical Presence within class/campus area (in radius 600-800 m)   [ONGOING..]


# - Working Flow/Architecture - 
# Faculty Logged in or Register (if New)
                |
# Faculty Starts Session (can control start & stop)
                |
# Student registers itself by details such as rollno, year, branch & subject (face models loaded)
                |
# Face Capturing starts and as soon as the face is detected
                |
# A 128B descriptor (consider it as a mathematical representation of your face) is generated & send to backend
                |
# Backend receives & check if this is existing in db,
                |
# If yes, marked you present (you can see in Dashboard in form of charts, %age, etc)
                |
# Otherwise contact your college/scholl admin


# - How to start? -
# git clone https://github.com/aakashverse
# npm install (install dependencies)
# configure your mongoDB database
# start client - npm run dev
# start server - node app.js
# Mark_Me is ready to use, mark your attendance :)