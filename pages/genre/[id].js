import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import AnimeGrid from '../../components/AnimeGrid';
import BackButton from '../../components/BackButton';
import Loading from '../../components/Loading';

const genres = {
  1: 'Action', 2: 'Adventure', 4: 'Comedy', 8: 'Drama',
  10: 'Fantasy', 14: 'Horror', 7: 'Mystery', 22: 'Romance',
  24: 'Sci-Fi', 36: 'Slice of Life', 37: 'Supernatural', 41: 'Thriller'
};

export default function GenrePage() {
  const router = useRouter();
  const { id } = router.query;
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimeByGenre() {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${id}&order_by=popularity&sort=desc&limit=24`);
        const data = await response.json();
        setAnimeList(data.data || []);
      } catch (err) {
        setError('Failed to load anime list');
        console.error('Error fetching anime:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimeByGenre();
  }, [id]);

  if (!id || !genres[id]) {
    return <div>Invalid genre</div>;
  }

  return (
    <Layout>
      <Head>
        <title>{genres[id]} Anime | EasyAnime</title>
        <meta name="description" content={`Browse popular ${genres[id]} anime series`} />
      </Head>

      <BackButton />

      <div className="container mt-[calc(var(--header-height)+2rem)] mb-12">
        <h1 className="text-3xl font-bold mb-8">{genres[id]} Anime</h1>
        
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center text-error">{error}</div>
        ) : (
          <AnimeGrid animeList={animeList} />
        )}
      </div>
    </Layout>
  );
}