import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Student from './component/Student.jsx'
import ServerContextProvider from './Context/ServerContextProvider.jsx'
import Home from './component/Home.jsx'
import FacultySession from "./component/FacultySession.jsx";
import StudentAttendance from './component/StudentAttendance.jsx'
import TeacherDashboard from './component/TeacherDashboard.jsx'
import AboutUs from './component/About.jsx'
import StudentRegistration from './component/StudentRegistrationForm.jsx'
import FacultyLogin from './component/FacultyLogin.jsx'
import FacultyRegistration from './component/FacultyRegistration.jsx'


let router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ServerContextProvider>
        <App />
      </ServerContextProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/student",
        element: <Student />,
      },
      {
        path: "/faculty-session",
        element: <FacultySession />,
      },
      {
        path: "/student-login",
        element: <StudentAttendance />,
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
        path: "/Faculty-Login",
        element: <FacultyLogin />
      },
      {
        path: "/Faculty-Registration",
        element: <FacultyRegistration />
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
