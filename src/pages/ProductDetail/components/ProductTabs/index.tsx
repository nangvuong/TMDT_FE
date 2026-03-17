import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../../../types/product';
import Description from './Description';
import Reviews from './Reviews';
import Detail from './Detail';

interface ProductTabsProps {
  product: Product;
  isUserLoggedIn?: boolean;
}

type TabType = 'description' | 'reviews' | 'detail';

interface Tab {
  id: TabType;
  label: string;
  component: React.ReactNode;
}

/**
 * ProductTabs - Tabbed interface for product information
 */
const ProductTabs: React.FC<ProductTabsProps> = ({ product, isUserLoggedIn = false }) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs: Tab[] = [
    {
      id: 'description',
      label: 'Mô tả sản phẩm',
      component: <Description product={product} />,
    },
    {
      id: 'reviews',
      label: `Đánh giá (${product.reviewCount || 0})`,
      component: <Reviews product={product} isUserLoggedIn={isUserLoggedIn} />,
    },
    {
      id: 'detail',
      label: 'Chi tiết',
      component: <Detail product={product} />,
    },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductTabs;
