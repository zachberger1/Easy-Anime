import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import AnimeGrid from '../components/AnimeGrid';
import GenreList from '../components/GenreList';
import AnimeDetailsModal from '../components/AnimeDetailsModal';
import { fetchTrendingAnime } from '../lib/api';

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getTrendingAnime = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingAnime();
        setTrendingAnime(data);
      } catch (error) {
        console.error('Error fetching trending anime:', error);
      } finally {
        setLoading(false);
      }
    };

    const getRecentlyViewed = () => {
      try {
        const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
        if (storedRecentlyViewed) {
          setRecentlyViewed(JSON.parse(storedRecentlyViewed));
        }
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    };

    getTrendingAnime();
    getRecentlyViewed();
  }, []);

  const handleAnimeSelect = (animeId) => {
    setSelectedAnimeId(animeId);
    setIsModalOpen(true);
  };

  const handleAnimeView = (anime) => {
    const updatedRecentlyViewed = [anime];
    recentlyViewed.forEach(item => {
      if (item.mal_id !== anime.mal_id) {
        updatedRecentlyViewed.push(item);
      }
    });
    const limitedRecentlyViewed = updatedRecentlyViewed.slice(0, 10);
    setRecentlyViewed(limitedRecentlyViewed);
    localStorage.setItem('recentlyViewed', JSON.stringify(limitedRecentlyViewed));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnimeId(null);
  };

  return (
    <>
      <Head>
        <title>Easy Anime - Find Your Next Anime</title>
        <meta name="description" content="Search and discover anime series with Easy Anime" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Hero />

        <section className="py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
            <GenreList />
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <h2 className="section-title">Trending Anime</h2>
            <AnimeGrid 
              animeList={trendingAnime} 
              loading={loading} 
              onAnimeSelect={handleAnimeSelect}
              onAnimeView={handleAnimeView} 
            />
          </div>
        </section>

        {recentlyViewed.length > 0 && (
          <section className="py-12">
            <div className="container">
              <h2 className="section-title">Recently Viewed</h2>
              <AnimeGrid 
                animeList={recentlyViewed} 
                loading={false}
                onAnimeSelect={handleAnimeSelect}
                onAnimeView={handleAnimeView} 
              />
            </div>
          </section>
        )}

        <AnimeDetailsModal 
          animeId={selectedAnimeId} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </Layout>
    </>
  );
}