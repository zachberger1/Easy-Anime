import AnimeCard from './AnimeCard';
import Loading from './Loading';

export default function AnimeGrid({ animeList = [], loading = false, onAnimeSelect, onAnimeView }) {
  if (loading) {
    return <Loading />;
  }

  if (!animeList || animeList.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No anime found.
      </div>
    );
  }

  return (
    <div className="anime-grid">
      {animeList.map(anime => (
        <AnimeCard 
          key={anime.mal_id} 
          anime={anime} 
          onAnimeSelect={onAnimeSelect}
          onAnimeView={onAnimeView}
        />
      ))}
    </div>
  );
}