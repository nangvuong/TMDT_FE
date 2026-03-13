import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
}

/**
 * Footer Component - E-commerce footer with links and company info
 */
const Footer: React.FC = () => {
  const shopLinks: FooterLink[] = [
    { label: 'Equipment', href: '/shop/equipment' },
    { label: 'Supplements', href: '/shop/supplements' },
    { label: 'Clothing', href: '/shop/clothing' },
    { label: 'Sale', href: '/shop/sale' },
  ];

  const supportLinks: FooterLink[] = [
    { label: 'Contact', href: '/support/contact' },
    { label: 'Shipping', href: '/support/shipping' },
    { label: 'Returns', href: '/support/returns' },
    { label: 'FAQ', href: '/support/faq' },
  ];

  const companyLinks: FooterLink[] = [
    { label: 'About us', href: '/company/about' },
    { label: 'Blog', href: '/company/blog' },
    { label: 'Careers', href: '/company/careers' },
    { label: 'Privacy policy', href: '/company/privacy' },
  ];

  const socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: <Facebook size={20} />, href: 'https://facebook.com' },
    { name: 'Instagram', icon: <Instagram size={20} />, href: 'https://instagram.com' },
    { name: 'YouTube', icon: <Youtube size={20} />, href: 'https://youtube.com' },
  ];

  const linkVariants = {
    initial: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    whileHover: { scale: 1.05 },
  };

  const socialIconVariants = {
    initial: { scale: 1 },
    whileHover: { scale: 1.2, rotate: 5 },
    whileTap: { scale: 0.95 },
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Shop Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <motion.li key={link.href}>
                  <motion.a
                    href={link.href}
                    className="text-gray-800 text-sm hover:text-black font-small transition-colors no-underline"
                    variants={linkVariants}
                    initial="initial"
                    animate="visible"
                    whileHover="whileHover"
                  >
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <motion.li key={link.href}>
                  <motion.a
                    href={link.href}
                    className="text-gray-800 text-sm hover:text-black font-small transition-colors no-underline"
                    variants={linkVariants}
                    initial="initial"
                    animate="visible"
                    whileHover="whileHover"
                  >
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <motion.li key={link.href}>
                  <motion.a
                    href={link.href}
                    className="text-gray-800 text-sm hover:text-black font-small transition-colors no-underline"
                    variants={linkVariants}
                    initial="initial"
                    animate="visible"
                    whileHover="whileHover"
                  >
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Follow Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">
              Follow us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-all"
                  variants={socialIconVariants}
                  initial="initial"
                  whileHover="whileHover"
                  whileTap="whileTap"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 text-sm">
            © 2026 FitnessMart. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
