import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import { fetchAnimeById } from '../../lib/api';
import { formatDate } from '../../lib/utils';
import { BsCalendar, BsClock, BsTv, BsStarFill, BsCollectionPlay } from 'react-icons/bs';

export default function AnimeDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnimeDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchAnimeById(id);
        setAnime(data);
        
        try {
          const storedRecentlyViewed = localStorage.getItem('recentlyViewed') || '[]';
          let recentlyViewed = JSON.parse(storedRecentlyViewed);
          recentlyViewed = [data, ...recentlyViewed.filter(item => item.mal_id !== data.mal_id)];
          recentlyViewed = recentlyViewed.slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        } catch (storageError) {
          console.error('Error updating recently viewed:', storageError);
        }
      } catch (fetchError) {
        console.error('Error fetching anime details:', fetchError);
        setError('Failed to load anime details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getAnimeDetails();
  }, [id]);

  if (loading) return (
    <Layout>
      <BackButton />
      <div className="container mt-[var(--header-height)] py-16">
        <Loading />
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <BackButton />
      <div className="container mt-[var(--header-height)] py-16 text-center">
        <p className="text-error text-lg">{error}</p>
        <button 
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
          onClick={() => router.push('/')}
        >
          Go Back Home
        </button>
      </div>
    </Layout>
  );

  if (!anime) return null;

  return (
    <Layout>
      <Head>
        <title>{anime.title} | Easy Anime</title>
        <meta name="description" content={anime.synopsis?.substring(0, 160) || `Details about ${anime.title}`} />
      </Head>

      <BackButton />

      <div className="container mt-[var(--header-height)] py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="relative w-full max-w-[300px] mx-auto md:mx-0 aspect-[3/4] rounded-card overflow-hidden shadow-card dark:shadow-card-dark">
              <Image
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '/placeholder.jpg'}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <BsStarFill className="text-accent mr-2" />
                <span className="font-bold text-lg">{anime.score || 'N/A'}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                  ({anime.scored_by ? `${Math.floor(anime.scored_by).toLocaleString()} votes` : 'No votes'})
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.genres?.map(genre => (
                  <span 
                    key={genre.mal_id}
                    className="px-3 py-1 bg-primary-light/90 text-white text-xs rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="space-y-2 text-sm">
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
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <BsCollectionPlay className="mr-2" />
                  <span>Seasons: {anime.seasons || 1}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-xl text-slate-600 dark:text-slate-300 mb-4">{anime.title_english}</h2>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">Synopsis</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {anime.synopsis || 'No synopsis available.'}
              </p>
            </div>

            {anime.trailer?.embed_url && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3">Trailer</h3>
                <div className="relative w-full pt-[56.25%] rounded-card overflow-hidden">
                  <iframe 
                    src={anime.trailer.embed_url}
                    className="absolute top-0 left-0 w-full h-full"
                    title={`${anime.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {anime.studios && anime.studios.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">Studios</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map(studio => (
                    <span 
                      key={studio.mal_id}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-full"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}