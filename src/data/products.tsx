import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/data/types"; // وارد کردن نوع Product از فایل types

// تابع fetch محصولات
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get("http://localhost:3001/products");
  return data.map((product: any) => ({
    ...product,
    id: product._id, // تبدیل _id به id
  }));
};

// استفاده از نام 'allProducts' به عنوان خروجی کامپوننت
export const allProducts = () => {
  const { data: products = [], isLoading, error } = useQuery<Product[], Error>({
    queryKey: ["products"], // تنظیم queryKey صحیح
    queryFn: fetchProducts, // تابع fetch
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching products</div>;

  return (
    <div>
      {products.map((product: Product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <div>Price: {product.price}</div>

          <div>Description: {product.description}</div>

          {/* اضافه کردن تصویر محصول */}
          {product.images && product.images.length > 0 && (
            <img src={product.images[0]} alt={product.name} width="100" />
          )}

          {/* مدیریت سایزها */}
          {product.sizes && (
            <div>
              Size:
              {Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : product.sizes}
            </div>
          )}

          {product.colors && (
            <div>
              Color:
              {Array.isArray(product.colors)
                ? product.colors.join(", ")
                : product.colors}
            </div>
          )}

          {product.category && <div>Category: {product.category}</div>}
        </div>
      ))}
    </div>
  );
};
