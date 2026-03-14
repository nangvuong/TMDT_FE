import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button/Button';
import image1 from '../../../assets/banner/5.png';
import image2 from '../../../assets/banner/2.png';

interface AboutPreviewProps {}

const AboutPreview: React.FC<AboutPreviewProps> = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      },
    },
  };

  return (
    <section className="w-full bg-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left: Images */}
          <motion.div
            className="hidden md:flex gap-4 md:gap-6 order-2 md:order-1"
            variants={itemVariants}
          >
            {/* Main Image */}
            <div className="flex-1 overflow-hidden rounded-lg">
              <motion.img
                src={image1}
                alt="Fitness Equipment"
                className="w-full h-full object-cover"
                variants={imageVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Secondary Image */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded-lg">
                <motion.img
                  src={image2}
                  alt="Sports Apparel"
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div className="order-1 md:order-2">
            {/* Heading */}
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              variants={itemVariants}
            >
              Fitness Mart
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Chúng tôi xây dựng một nền tảng fitness toàn diện cung cấp thiết bị tập luyện, thực phẩm bổ sung và trang phục thể thao chất lượng.
              Tất cả cho hành trình fitness của bạn.
            </motion.p>

            {/* Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => console.log('Learn More clicked')}
                size="lg"
                className="bg-black text-black hover:bg-gray-100 focus:ring-white font-semibold"
              >
                Tìm Hiểu Thêm
                <motion.span
                    className="inline-block group-hover:translate-x-1 transition-transform duration-300"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                >
                    →
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPreview;
