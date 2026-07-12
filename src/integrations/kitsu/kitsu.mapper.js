const KITSU_SOURCE = 'KITSU';

function getAttributes(resource) {
  return resource?.attributes || {};
}

function getPosterImage(attributes) {
  return attributes.posterImage?.large
    || attributes.posterImage?.medium
    || attributes.posterImage?.small
    || attributes.posterImage?.original
    || null;
}

function getCoverImage(attributes) {
  return attributes.coverImage?.large
    || attributes.coverImage?.small
    || attributes.coverImage?.original
    || null;
}

function getYear(date) {
  return date ? Number(date.slice(0, 4)) || null : null;
}

function getScore(averageRating) {
  if (averageRating === null || averageRating === undefined || averageRating === '') {
    return null;
  }

  const value = Number(averageRating);

  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round((value / 10) * 100) / 100;
}

function getTitleEnglish(attributes) {
  return attributes.titles?.en || attributes.titles?.en_us || null;
}

function getSeason(date) {
  if (!date) return null;

  const month = Number(date.slice(5, 7));

  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  if (month >= 10 && month <= 12) return 'fall';

  return null;
}

function mapSearchItem(resource) {
  const attributes = getAttributes(resource);

  return {
    externalId: String(resource.id),
    source: KITSU_SOURCE,
    title: attributes.canonicalTitle || getTitleEnglish(attributes) || 'Untitled',
    imageUrl: getPosterImage(attributes),
    type: attributes.subtype || attributes.showType || null,
    year: getYear(attributes.startDate),
    status: attributes.status || null,
    score: getScore(attributes.averageRating),
  };
}

function mapHomeItem(resource) {
  const attributes = getAttributes(resource);

  return {
    ...mapSearchItem(resource),
    synopsis: attributes.synopsis || attributes.description || null,
    episodes: attributes.episodeCount || null,
    genres: [],
    trailerUrl: attributes.youtubeVideoId ? `https://www.youtube.com/watch?v=${attributes.youtubeVideoId}` : null,
    rank: attributes.ratingRank || null,
    popularity: attributes.popularityRank || null,
    members: attributes.userCount || null,
    coverImageUrl: getCoverImage(attributes),
  };
}

function mapDetail(response) {
  const resource = response.data;
  const attributes = getAttributes(resource);

  return {
    externalId: String(resource.id),
    source: KITSU_SOURCE,
    title: attributes.canonicalTitle || getTitleEnglish(attributes) || 'Untitled',
    titleEnglish: getTitleEnglish(attributes),
    synopsis: attributes.synopsis || attributes.description || null,
    imageUrl: getPosterImage(attributes),
    episodes: attributes.episodeCount || null,
    duration: attributes.episodeLength ? `${attributes.episodeLength} min per ep` : null,
    status: attributes.status || null,
    type: attributes.subtype || attributes.showType || null,
    season: getSeason(attributes.startDate),
    year: getYear(attributes.startDate),
    score: getScore(attributes.averageRating),
    genres: getIncludedCategoryNames(response),
    studio: null,
    airedFrom: attributes.startDate || null,
  };
}

function getIncludedCategoryNames(response) {
  if (!Array.isArray(response.included)) {
    return [];
  }

  return response.included
    .filter((item) => item.type === 'categories')
    .map((item) => item.attributes?.title)
    .filter(Boolean);
}

function mapCategory(category) {
  const attributes = getAttributes(category);

  return {
    id: attributes.slug || String(category.id),
    externalId: String(category.id),
    name: attributes.title,
    slug: attributes.slug,
    count: attributes.totalMediaCount || 0,
  };
}

function mapPagination(meta, page, limit) {
  const total = meta?.count || 0;

  return {
    page,
    limit,
    total,
    totalPages: total > 0 ? Math.ceil(total / limit) : 0,
  };
}

module.exports = {
  KITSU_SOURCE,
  mapSearchItem,
  mapHomeItem,
  mapDetail,
  mapCategory,
  mapPagination,
};
