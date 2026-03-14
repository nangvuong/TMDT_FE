import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button/Button';
import bannerImage from '../../../assets/banner/3.png';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  headline = 'Nâng Tầm Hành Trình Fitness Của Bạn',
  subheadline = 'Thiết bị tập gym, thực phẩm bổ sung và thời trang thể thao dành cho mọi cấp độ luyện tập',
  buttonLabel = 'Mua Ngay',
  onButtonClick,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      },
    },
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-xl">
          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            variants={itemVariants}
          >
            {headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-2xl text-gray-100 mb-8"
            variants={itemVariants}
          >
            {subheadline}
          </motion.p>

          {/* Button */}
          <motion.div variants={itemVariants}>
            <Button
              onClick={onButtonClick}
              size="lg"
              className="group relative bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black focus:ring-white border border-white/40 hover:border-white transition-all duration-300 ease-out shadow-lg hover:shadow-2xl font-semibold tracking-wide"
            >
              {buttonLabel}
              <motion.span
                className="inline-block group-hover:translate-x-1 transition-transform duration-300"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                →
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
