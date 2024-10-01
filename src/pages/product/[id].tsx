import { GetServerSideProps } from 'next';
import ProductDetails from '@/components/ProductDetails/ProductDetails'; // ایمپورت کامپوننت جزئیات محصول
import { Product } from '@/data/types'; // ایمپورت تایپ محصول

interface ProductPageProps {
  product: Product; // نوع محصول
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  return <ProductDetails product={product} />;
};

// استفاده از GetServerSideProps برای دریافت داده محصول از API
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  // فراخوانی API داخلی برای دریافت اطلاعات محصول
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  
  if (!res.ok) {
    return {
      notFound: true, // در صورت نبودن محصول، صفحه 404 نمایش داده می‌شود
    };
  }

  const product: Product = await res.json();

  return {
    props: {
      product,
    },
  };
};

export default ProductPage;
