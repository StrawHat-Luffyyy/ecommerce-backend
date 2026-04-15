import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Product } from "../types";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { toast } from "react-hot-toast";
import { useCartStore } from "../store/cartStore";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data.product);
      } catch (error) {
        toast.error("Failed to load product details");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
      toast.success("Added to cart!");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="md:flex gap-8">
          <Skeleton className="w-full md:w-1/2 h-96 rounded-lg" />
          <div className="w-full md:w-1/2 flex flex-col gap-4 mt-8 md:mt-0">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-48 mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60";

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="md:flex md:gap-x-8 lg:gap-x-12">
          {/* Image */}
          <div className="md:w-1/2 rounded-lg overflow-hidden">
             <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Details */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex flex-col">
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="text-3xl text-gray-900 mt-4">${product.price}</p>
            
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-700">{product.description}</p>
            </div>

            <div className="mt-10 flex gap-4">
              <Button 
                size="lg" 
                className="w-full md:w-auto"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul role="list">
                  <li>In stock: {product.stock} units</li>
                  <li>Category: {product.categoryId}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
