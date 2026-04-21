import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Package, ShoppingBag, BarChart3 } from "lucide-react";

export const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading admin panel...</div>;
  if (!isAuthenticated || user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  const navigation = [
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Package },
    // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 }, // If analytics is needed later
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.href);

              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center p-2 rounded-lg group ${isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-700' : 'text-gray-500 group-hover:text-gray-900'
                      }`} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};
