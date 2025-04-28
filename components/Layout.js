import { useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ThemeContext } from '../contexts/ThemeContext';

export default function Layout({ children }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}