export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 py-6 text-center mt-12">
      <div className="container">
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
          &copy; {new Date().getFullYear()} EasyAnime. All rights reserved.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Data provided by Jikan API
        </p>
      </div>
    </footer>
  );
}