const JIKAN_SOURCE = 'JIKAN';

function getImageUrl(anime) {
  return anime?.images?.webp?.large_image_url
    || anime?.images?.webp?.image_url
    || anime?.images?.jpg?.large_image_url
    || anime?.images?.jpg?.image_url
    || null;
}

function mapSearchItem(anime) {
  return {
    externalId: String(anime.mal_id),
    source: JIKAN_SOURCE,
    title: anime.title,
    imageUrl: getImageUrl(anime),
    type: anime.type || null,
    year: anime.year || anime.aired?.prop?.from?.year || null,
    status: anime.status || null,
    score: anime.score || null,
  };
}

function mapHomeItem(anime) {
  return {
    ...mapSearchItem(anime),
    synopsis: anime.synopsis || null,
    episodes: anime.episodes || null,
    genres: Array.isArray(anime.genres) ? anime.genres.map((genre) => genre.name).filter(Boolean) : [],
    trailerUrl: anime.trailer?.url || anime.trailer?.embed_url || null,
    rank: anime.rank || null,
    popularity: anime.popularity || null,
    members: anime.members || null,
  };
}

function mapRecommendationItem(recommendation) {
  const entry = recommendation.entry?.[0];

  if (!entry) {
    return null;
  }

  return {
    externalId: String(entry.mal_id),
    source: JIKAN_SOURCE,
    title: entry.title,
    imageUrl: getImageUrl(entry),
    recommendationUrl: recommendation.url || null,
    votes: recommendation.votes || null,
  };
}

function mapGenre(genre) {
  return {
    id: genre.mal_id,
    name: genre.name,
    count: genre.count || 0,
  };
}

function mapDetail(anime) {
  return {
    externalId: String(anime.mal_id),
    source: JIKAN_SOURCE,
    title: anime.title,
    titleEnglish: anime.title_english || null,
    synopsis: anime.synopsis || null,
    imageUrl: getImageUrl(anime),
    episodes: anime.episodes || null,
    duration: anime.duration || null,
    status: anime.status || null,
    type: anime.type || null,
    season: anime.season || null,
    year: anime.year || anime.aired?.prop?.from?.year || null,
    score: anime.score || null,
    genres: Array.isArray(anime.genres) ? anime.genres.map((genre) => genre.name).filter(Boolean) : [],
    studio: Array.isArray(anime.studios) && anime.studios.length > 0 ? anime.studios[0].name : null,
    airedFrom: anime.aired?.from || null,
  };
}

function mapPagination(pagination, fallbackPage, fallbackLimit) {
  return {
    page: pagination?.current_page || fallbackPage,
    limit: pagination?.items?.per_page || fallbackLimit,
    total: pagination?.items?.total || 0,
    totalPages: pagination?.last_visible_page || 0,
  };
}

module.exports = { JIKAN_SOURCE, mapSearchItem, mapHomeItem, mapRecommendationItem, mapGenre, mapDetail, mapPagination };
