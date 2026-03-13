import React from 'react';

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  onClick,
}) => {
  return (
    <div className="product-card" onClick={onClick}>
      {image && <img src={image} alt={name} />}
      <h3>{name}</h3>
      <p className="price">${price}</p>
    </div>
  );
};

export default ProductCard;
