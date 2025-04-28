import { useRouter } from 'next/router';
import SearchBar from './SearchBar';

export default function Hero() {
  const router = useRouter();
  
  const handleAnimeSelect = (animeId) => {
    router.push(`/anime/${animeId}`);
  };
  
  return (
    <section className="hero-section">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="hero-title">Discover Your Next Favorite Anime</h1>
          <p className="hero-description">
            Search from thousands of anime titles and find detailed information about your favorite series.
          </p>
          <SearchBar onAnimeSelect={handleAnimeSelect} />
        </div>
      </div>
    </section>
  );
}