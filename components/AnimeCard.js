import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsStarFill } from 'react-icons/bs';
import Link from 'next/link';

export default function AnimeCard({ anime, onAnimeSelect, onAnimeView }) {
  if (!anime) return null;
  
  const handleClick = () => {
    if (onAnimeSelect) {
      onAnimeSelect(anime.mal_id);
    }
    
    if (onAnimeView) {
      onAnimeView(anime);
    }
  };
  
  return (
    <motion.div
      className="anime-card"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/anime/${anime.mal_id}`} onClick={handleClick}>
        <div className="anime-card-img-container">
          <Image
            src={anime.images?.jpg?.image_url || '/placeholder.jpg'}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        </div>
        <div className="anime-card-content">
          <h3 className="anime-card-title text-white ">{anime.title}</h3>
          <div className="anime-card-info">
            <div className="anime-card-year">
              {anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'Unknown'}
            </div>
            {anime.score && (
              <div className="anime-card-rating flex items-center">
                <BsStarFill className="text-accent mr-1" size={12} />
                <span>{anime.score}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}