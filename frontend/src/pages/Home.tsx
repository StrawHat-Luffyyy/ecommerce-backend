import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

export const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gray-50 flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center md:text-left md:flex items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block mb-2">The future of</span>
                <span className="block text-indigo-600">e-commerce is here</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto md:mx-0 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                Discover the latest products with our clean, fast, and fully responsive platform. Experience seamless shopping today.
              </p>
              <div className="mt-8 sm:flex sm:justify-center md:justify-start gap-4">
                <div className="rounded-md shadow">
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
                <img
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Tech workspace"
                  className="relative rounded-2xl shadow-xl w-full max-w-lg object-cover h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-indigo-100 flex items-center justify-center rounded-xl mb-4 text-indigo-600">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-500">Built on modern technologies to ensure a seamless and immediate shopping experience.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-indigo-100 flex items-center justify-center rounded-xl mb-4 text-indigo-600">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-500">Industry standard AES encryption and Stripe integration processing your payments safely.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-indigo-100 flex items-center justify-center rounded-xl mb-4 text-indigo-600">
                <Truck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Tracking</h3>
              <p className="text-gray-500">Real-time order statuses and integrated fulfillment tracking to keep you updated.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
