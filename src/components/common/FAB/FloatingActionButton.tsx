import React, { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionButtonProps {
  zaloLink?: string;
  chatbotLink?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  zaloLink = 'https://zalo.me/your-zalo-id',
  chatbotLink = '/chatbot',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleZaloClick = () => {
    window.open(zaloLink, '_blank');
  };

  const handleChatbotClick = () => {
    // Navigate to chatbot or open chatbot modal
    window.location.href = chatbotLink;
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6">
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-40 -top-36 md:bottom-20 md:z-50 left-1/2 md:left-auto md:right-0 -translate-x-1/2 md:translate-x-0 flex flex-col gap-2 md:gap-4"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {/* Zalo Button */}
            <motion.div
              className="flex items-center gap-2 md:gap-3 group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05, type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.span
                className="hidden md:block bg-gray-800 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
              >
                Liên hệ Zalo
              </motion.span>
              <motion.button
                onClick={handleZaloClick}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-700 hover:bg-gray-800 text-white shadow-lg transition-all duration-200 hover:scale-110 flex-shrink-0 active:scale-95"
                title="Liên hệ qua Zalo"
                aria-label="Contact via Zalo"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </motion.div>

            {/* Chatbot Button */}
            <motion.div
              className="flex items-center gap-2 md:gap-3 group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.span
                className="hidden md:block bg-gray-800 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
              >
                Chatbot hỗ trợ
              </motion.span>
              <motion.button
                onClick={handleChatbotClick}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg transition-all duration-200 hover:scale-110 flex-shrink-0 active:scale-95"
                title="Mở Chatbot"
                aria-label="Open Chatbot"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-300 text-white font-semibold active:scale-95 ${
          isOpen
            ? 'bg-gray-400 hover:bg-gray-500'
            : 'bg-black hover:bg-gray-900'
        }`}
        title={isOpen ? 'Đóng menu' : 'Liên hệ với chúng tôi'}
        aria-label={isOpen ? 'Close menu' : 'Contact us'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {isOpen ? (
          <X className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
