import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BsX, BsCalendar, BsClock, BsTv, BsStarFill } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';
import Loading from './Loading';
import { fetchAnimeById } from '../lib/api';
import { formatDate } from '../lib/utils';

export default function AnimeDetailsModal({ animeId, isOpen, onClose }) {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const getAnimeDetails = async () => {
      if (!animeId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAnimeById(animeId);
        setAnime(data);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && animeId) {
      getAnimeDetails();
    }
  }, [animeId, isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Client-side only
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-card w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-lg"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-end p-2">
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label="Close"
              >
                <BsX size={24} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-48px)]">
              {loading ? (
                <Loading />
              ) : error ? (
                <div className="text-center py-8 text-error">
                  <p>{error}</p>
                </div>
              ) : anime ? (
                <div className="anime-details">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 lg:w-1/4">
                      <div className="relative w-full aspect-[3/4] rounded-card overflow-hidden shadow-card dark:shadow-card-dark">
                        <Image
                          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '/placeholder.jpg'}
                          alt={anime.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 200px"
                        />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3 lg:w-3/4">
                      <h2 className="text-xl md:text-2xl font-bold mb-2">{anime.title}</h2>
                      {anime.title_english && anime.title_english !== anime.title && (
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{anime.title_english}</p>
                      )}
                      
                      <div className="flex items-center mt-3 mb-4">
                        <BsStarFill className="text-accent mr-2" />
                        <span className="font-bold">{anime.score || 'N/A'}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                          ({anime.scored_by ? `${Math.floor(anime.scored_by).toLocaleString()} votes` : 'No votes'})
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {anime.genres?.map(genre => (
                          <span 
                            key={genre.mal_id}
                            className="px-3 py-1 bg-primary-light/90 text-white text-xs rounded-full"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <BsCalendar className="mr-2" />
                          <span>Aired: {formatDate(anime.aired?.from)} - {anime.aired?.to ? formatDate(anime.aired.to) : 'Present'}</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <BsClock className="mr-2" />
                          <span>Episodes: {anime.episodes || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <BsTv className="mr-2" />
                          <span>Status: {anime.status || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Synopsis</h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {anime.synopsis || 'No synopsis available.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center md:justify-end">
                    <Link
                      href={`/anime/${anime.mal_id}`}
                      className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition text-center"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Select an anime to view details
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}