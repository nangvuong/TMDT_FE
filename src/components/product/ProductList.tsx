import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
}

interface ProductListProps {
  products: Product[];
  onProductClick?: (productId: string | number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductClick }) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onClick={() => onProductClick?.(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;
