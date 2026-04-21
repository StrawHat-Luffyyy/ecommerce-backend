import { useEffect, type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/checkout/Checkout";
import { StripeSuccess } from "./pages/checkout/StripeSuccess";
import { StripeCancel } from "./pages/checkout/StripeCancel";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { OrdersList } from "./pages/admin/OrdersList";
import { ProductsManage } from "./pages/admin/ProductsManage";

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
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/checkout/success" element={<ProtectedRoute><StripeSuccess /></ProtectedRoute>} />
            <Route path="/checkout/cancel" element={<ProtectedRoute><StripeCancel /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="orders" element={<OrdersList />} />
              <Route path="products" element={<ProductsManage />} />
              <Route index element={<Navigate to="orders" replace />} />
            </Route>
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
