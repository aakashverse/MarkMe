import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'

import './index.css'
import App from './App.jsx'
import Home from './component/Home.jsx'
import FacultySession from "./component/FacultySession.jsx";
import StudentAttendance from './component/StudentAttendance.jsx'
import TeacherDashboard from './component/TeacherDashboard.jsx'
import AboutUs from './component/About.jsx'
import StudentRegistration from './component/StudentRegistration.jsx'
import FacultyLogin from './component/FacultyLogin.jsx'
import FacultyRegistration from './component/FacultyRegistration.jsx'
import StudentLogin from './component/StudentLogin.jsx'


  let router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/faculty-session",
        element: <FacultySession />,
      },
      {
        path: "/student-registration",
        element: <StudentRegistration />,
      },
      {
        path: "/student-login",
        element: <StudentLogin />,
      },
      {
        path: "/teacher-dashboard",
        element: <TeacherDashboard />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/student-registration",
        element: <StudentRegistration />
      },
      {
        path: "/faculty-login",
        element: <FacultyLogin />
      },
      {
        path: "/faculty-registration",
        element: <FacultyRegistration />
      },
      {
        path: "/student-attendance",
        element: <StudentAttendance />
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-center" />
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
