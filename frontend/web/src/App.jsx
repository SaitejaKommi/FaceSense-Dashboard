import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import Attendance from "./pages/Attendance";
import Classes from "./pages/Classes";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {!isAuthenticated ? (
        // PUBLIC ROUTES
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* If unauthenticated & tries private route → redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        // PRIVATE AUTHENTICATED LAYOUT
        <div className="flex min-h-screen bg-[#08091C] text-white overflow-hidden">

          {/* LEFT SIDEBAR */}
          <aside className="w-64 h-full bg-[#0C0D23] border-r border-gray-800 flex-shrink-0 hidden md:flex">
            <Sidebar />
          </aside>

          {/* RIGHT CONTENT AREA */}
          <div className="flex flex-col flex-1 overflow-hidden">

            {/* TOP NAV */}
            {/* Nav component handles its own container styling now */}
            <div className="flex-shrink-0 z-50">
              <Nav />
            </div>
            {/* SCROLLABLE MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-[#0C0D23] scrollbar-thumb-blue-700/50 hover:scrollbar-thumb-blue-600/70">
              <Routes>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
                <Route path="/add-student" element={<ProtectedRoute><AddStudent /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
                <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>

          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
