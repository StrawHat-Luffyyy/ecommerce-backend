import { useEffect, type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Placeholder for pages we will build in Phase 4
const Home = () => <div className="p-8 text-center text-2xl font-bold">Home Page</div>;
const Login = () => <div className="p-8 text-center text-xl">Login Page</div>;
const Register = () => <div className="p-8 text-center text-xl">Register Page</div>;
const Dashboard = () => <div className="p-8 text-center text-xl">Customer Dashboard</div>;

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <div className="p-8 text-center">Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Attempt hydration / refresh logic when the app loads
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Placeholder Navbar */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between">
            <h1 className="text-xl font-bold text-gray-900">E-Commerce</h1>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
