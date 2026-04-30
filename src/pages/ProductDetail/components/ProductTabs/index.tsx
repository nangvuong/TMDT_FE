import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../../../types/product';
import { useIsLoggedIn } from '../../../../hooks/useAuth';
import Description from './Description';
import Reviews from './Reviews';
import Detail from './Detail';

interface ProductTabsProps {
  product: Product;
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
const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const { isLoggedIn } = useIsLoggedIn();
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
      component: <Reviews product={product} isUserLoggedIn={isLoggedIn} />,
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
      <div className="border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-4 sm:py-6 md:py-8">
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
