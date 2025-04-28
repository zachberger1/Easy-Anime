import { useRouter } from 'next/router';
import { BsArrowLeft } from 'react-icons/bs';

export default function BackButton() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.back()}
      className="fixed top-24 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
      aria-label="Go back"
    >
      <BsArrowLeft className="w-5 h-5" />
    </button>
  );
}