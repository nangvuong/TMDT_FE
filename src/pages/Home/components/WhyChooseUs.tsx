import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import image1 from '../../../assets/banner/1.png';
import image2 from '../../../assets/banner/4.png';

interface WhyChooseUsProps {}

const WhyChooseUs: React.FC<WhyChooseUsProps> = () => {
  const features = [
    {
      icon: '✔',
      title: 'Sản phẩm chính hãng',
      description: 'Tất cả sản phẩm đều được từ các nhà cung cấp uy tín'
    },
    {
      icon: '✔',
      title: 'Giao hàng nhanh',
      description: 'Giao hàng trong 24-48 giờ toàn bộ khu vực'
    },
    {
      icon: '✔',
      title: 'Đổi trả dễ dàng',
      description: 'Chính sách đổi trả trong 30 ngày không điều kiện'
    },
    {
      icon: '✔',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ khách hàng sẵn sàng giúp đỡ'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
          {/* Left: Features */}
          <motion.div className="space-y-6">
            {/* Heading */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Tại Sao Chọn Chúng Tôi?
              </h2>
              <p className="text-base md:text-lg text-gray-400">
                Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho bạn
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4 items-start"
                  variants={itemVariants}
                >
                  <motion.div
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.2 }}
                  >
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Images */}
          <motion.div
            className="hidden md:flex gap-4 md:gap-6"
            variants={itemVariants}
          >
            {/* Main Image */}
            <div className="flex-1 overflow-hidden rounded-lg">
              <motion.img
                src={image1}
                alt="Why Choose Us - 1"
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
                  alt="Why Choose Us - 2"
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
