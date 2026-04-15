import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart, LogOut, User as UserIcon } from "lucide-react";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Nexus<span className="text-gray-900">Cart</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/products" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">
                Products
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-indigo-600">
                  <UserIcon className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">{user?.firstName || 'Account'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
