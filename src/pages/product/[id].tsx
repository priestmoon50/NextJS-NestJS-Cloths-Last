import Layout from '@/app/layout';
import ProductDetails from '@/components/ProductDetails/ProductDetails';
import { GetServerSideProps } from 'next';
import { Product } from '@/data/types';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  return (
    <Layout>
      <ProductDetails product={product} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  // Fetch your product from your API
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  
  if (!res.ok) {
    return {
      notFound: true,
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
