import Filter from '@/components/models/filter';
import PageHandler from '@/components/pageHandler';
import { Stars } from '@/components/stars';
import { animeApi, api } from '@/utils/axios';
import { AnimeData, UserFollowingAnime } from '@/utils/Interfaces';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import nookies from 'nookies';

export default function Home({ data }: { data: AnimeData }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('');
  const [userFollowedAnimes, setUserFollowedAnimes] = useState<any>();
  const [toggle, setToggle] = useState<boolean>(false);
  const config = { headers: { Authorization: `Bearer ${nookies.get(null, 'token').token}` } };

  useEffect(() => {
    api
      .get('/anime/userlist', config)
      .then((e) => setUserFollowedAnimes(e.data));
  }, [toggle]);

  function handleUpdateFollowing({ animeId, progress }: { animeId: number, progress: number }) {
    api.put('/anime/userlist', { animeId, progress }, config);
    setToggle(!toggle);
  }

  const animeList = data.media.filter((e) => e.title.romaji.toLocaleLowerCase().includes(filter));
  return (
    <div className="flex m-7 gap-5">
      <div className="h-full flex flex-col w-[73%] rounded-xl p-5">
        <div className="h-[8%]">
          <Filter onChange={(e) => setFilter(e.target.value)} />
        </div>
        <h1 className="py-4 text-center" onClick={() => router.push('/pome/releases')}>
          Airing
        </h1>
        <div className="w-full flex flex-wrap gap-5 overflow-auto">
          {animeList.map((e: any) => (
            <div
              className="xl:w-[48.9%] w-full h-[19.5rem] bg-third rounded-xl p-4 flex cursor-pointer"
              onClick={() => router.push(`/pome/anime/${e.id}`)}
              key={e.id}
            >
              <img
                className="h-full w-40 rounded-xl"
                src={e.coverImage.extraLarge}
                alt="anime_image"
              />
              <div className="pl-5 h-full flex flex-col">
                <h1 className="cursor-pointer"> {e.title.romaji} </h1>
                {e.averageScore ? <Stars className='mb-3' score={e.averageScore} /> : null}
                <h3 className="cursor-pointer pb-3"> {e.startDate.year} </h3>
                <h3 className="cursor-pointer h-2/3 overflow-auto">
                  {e.description ? e.description.replace(/(<([^>]+)>)/ig, ' ').replace(/(\r\n|\n|\r)/gm, ' ') : 'No description yet'}
                </h3>
              </div>
            </div>
          ))}
          <PageHandler
            currentPage={data.pageInfo.currentPage}
            hasNextPage={data.pageInfo.hasNextPage}
            route=""
          />
        </div>
      </div>
      <div className="bg-third w-[27%] h-fit rounded-xl px-8 pb-10">
        <h1 className="font-bold py-5"> You are following </h1>
        <div className="w-full flex flex-wrap gap-4 overflow-auto">
          {userFollowedAnimes?.map((e: UserFollowingAnime) => (
            <div
              className="flex flex-col justify-end w-32 h-40 bg-fifth rounded-xl bg-cover cursor-pointer hover:shadow-black hover:shadow-inner"
              onClick={() => router.push(`/pome/anime/${e.anime.anime_id}`)}
              style={{ backgroundImage: `url(${e.anime.cover_image})` }}
              key={e.anime.anime_id}
            >
              <div className='flex flex-col justify-center items-center h-2/5 w-full bg-black bg-opacity-60 rounded-b-xl border-b-8 border-signature cursor-default'>
                {e.anime.next_airing_episode.episode - 1 - e.progress > 0 ?
                  <div className='flex items-center gap-5'>
                    <BiMinus
                      className='text-white text-xl cursor-pointer hover:text-eigth'
                      onClick={(event) => (event.stopPropagation(), handleUpdateFollowing({ progress: e.progress - 1, animeId: e.anime.anime_id }))}
                    />
                    <h3 className='text-white'> {e.anime.next_airing_episode.episode - 1 - e.progress} </h3>
                    <BiPlus
                      className='text-white text-xl cursor-pointer hover:text-eigth'
                      onClick={(event) => (event.stopPropagation(), handleUpdateFollowing({ progress: e.progress + 1, animeId: e.anime.anime_id }))}
                    />
                  </div>
                  : null
                }
                <h3 className='text-white'>
                  {Math.floor(e.anime.next_airing_episode.timeUntilAiring / 86400)}d {Math.floor((e.anime.next_airing_episode.timeUntilAiring % 86400) / 3600)}h {Math.floor((e.anime.next_airing_episode.timeUntilAiring % 3600) / 60)}m
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const variables = {
    page: Number(context.query.page) || 0,
    year: Number(new Date().getFullYear() + '0000')
  };
  const query = `
    query ($page: Int, $year: FuzzyDateInt) {
      Page (page: $page, perPage: 20) {
        pageInfo {
          currentPage
          hasNextPage
        }
        media (status: RELEASING, startDate_greater: $year, type: ANIME, format: TV, isAdult: false) {
          id
          title {
            romaji
            english
            native
          }
          type
          format
          status
          description
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          season
          episodes
          duration
          chapters
          volumes
          source
          hashtag
          trailer {
            id
            site
            thumbnail
          }
          updatedAt
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
          genres
          synonyms 
          averageScore
          meanScore
          popularity
          trending
          favourites
          tags {
            id
            name
            description
            category
            isAdult
          }
          characters {
            nodes {
              id
              name {
                full
              }
              image {
                large
                medium
              }
              gender
              description
              dateOfBirth {
                year
                month
                day
              }
              age
              bloodType
              isFavourite
              favourites
            }
          }
          isAdult
          nextAiringEpisode {
            id
            timeUntilAiring
            episode
          }
        }
      }
    }
  `;
  try {
    let { data } = await animeApi.post('', { query, variables }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    data = data.data.Page;

    return {
      props: {
        data
      },
    };
  } catch (error) {
    return {
      redirect: { destination: '/pome/signin', permanent: false }
    };
  }
}
