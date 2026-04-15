import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Package } from "lucide-react";
import { toast } from "react-hot-toast";

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    images: string[];
  }
}

interface Order {
  id: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export const CustomerDashboard = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data.data.orders || []);
      } catch (error) {
        toast.error("Failed to fetch order history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName || "Customer"}!</h1>
          <p className="text-gray-600 mt-1">Here is a record of all your past orders.</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Order ID: {order.id.slice(0, 8)}...</h3>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${order.totalAmount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Items</h4>
                  <ul className="space-y-3">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center">
                        <img 
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt={item.product?.name} 
                          className="h-12 w-12 rounded object-cover border border-gray-200"
                        />
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} x ${item.price}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <EmptyState 
              title="No orders found" 
              description="You haven't placed any orders yet. Visit our products page to start shopping!"
              icon={<Package size={48} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};
