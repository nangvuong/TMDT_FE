import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import FloatingActionButton from '../common/FAB/FloatingActionButton';
import ScrollToTopButton from '../common/FAB/ScrollToTopButton';

interface LayoutProps {
  children: React.ReactNode;
  logo?: string;
  hideFAB?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  logo,
  hideFAB = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header logo={logo} hideFAB={hideFAB} />
      <main className="flex-1">
        {children}
      </main>
      {!hideFAB && <Footer />}
      {!hideFAB && <FloatingActionButton />}
      {!hideFAB && <ScrollToTopButton />}
    </div>
  );
};

export default Layout;
