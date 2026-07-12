const { ERROR_CODES } = require('../constants/errorCodes');
const animeRepository = require('../repositories/anime.repository');
const libraryRepository = require('../repositories/library.repository');
const animeService = require('./anime.service');
const { AppError } = require('../utils/AppError');

function serializeLibraryEntry(entry) {
  return {
    id: entry.id,
    status: entry.status,
    episodesWatched: entry.episodesWatched,
    personalScore: entry.personalScore,
    notes: entry.notes,
    startedAt: entry.startedAt,
    finishedAt: entry.finishedAt,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    anime: serializeAnime(entry.anime),
  };
}

function serializeAnime(anime) {
  return {
    id: anime.id,
    externalId: anime.externalId,
    source: anime.source,
    title: anime.title,
    titleEnglish: anime.titleEnglish,
    imageUrl: anime.imageUrl,
    episodes: anime.episodes,
    status: anime.status,
    type: anime.type,
    year: anime.year,
    score: anime.score,
  };
}

async function getLibrary(userId, filters) {
  const total = await libraryRepository.countLibraryEntries(userId, filters);
  const entries = await libraryRepository.findLibraryEntries(userId, filters, {
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
  });

  return {
    data: entries.map(serializeLibraryEntry),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: total > 0 ? Math.ceil(total / filters.limit) : 0,
    },
  };
}

async function addToLibrary(userId, input) {
  const anime = await findOrCreateAnime(input.source, input.externalId);
  const existingEntry = await libraryRepository.findLibraryEntryByAnime(userId, anime.id);

  if (existingEntry) {
    throw new AppError('Anime already exists in library', 409, ERROR_CODES.ANIME_ALREADY_IN_LIBRARY);
  }

  const entry = await libraryRepository.createLibraryEntry({
    userId,
    animeId: anime.id,
    status: input.status,
    episodesWatched: 0,
  });

  return serializeLibraryEntry(entry);
}

async function updateLibraryEntry(userId, id, input) {
  const currentEntry = await findOwnedLibraryEntry(userId, id);
  const nextEntry = { ...currentEntry, ...input };

  validateLibraryProgress(nextEntry);

  const entry = await libraryRepository.updateLibraryEntry(id, input);

  return serializeLibraryEntry(entry);
}

async function deleteLibraryEntry(userId, id) {
  await findOwnedLibraryEntry(userId, id);
  await libraryRepository.deleteLibraryEntry(id);
}

async function findOwnedLibraryEntry(userId, id) {
  const entry = await libraryRepository.findLibraryEntryById(userId, id);

  if (!entry) {
    throw new AppError('Library entry not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  return entry;
}

async function findOrCreateAnime(source, externalId) {
  const existingAnime = await animeRepository.findAnimeBySourceAndExternalId(source, externalId);

  if (existingAnime) {
    return existingAnime;
  }

  const detail = await animeService.getAnimeDetail({ source, externalId });

  return animeRepository.createAnime({
    externalId: detail.externalId,
    source: detail.source,
    title: detail.title,
    titleEnglish: detail.titleEnglish,
    synopsis: detail.synopsis,
    imageUrl: detail.imageUrl,
    episodes: detail.episodes,
    duration: detail.duration,
    status: detail.status,
    type: detail.type,
    season: detail.season,
    year: detail.year,
    score: detail.score,
    genres: detail.genres,
  });
}

function validateLibraryProgress(entry) {
  if (entry.anime.episodes && entry.episodesWatched > entry.anime.episodes) {
    throw new AppError('Episodes watched cannot exceed anime episodes', 422, ERROR_CODES.VALIDATION_ERROR);
  }

  if (entry.startedAt && entry.finishedAt && entry.finishedAt < entry.startedAt) {
    throw new AppError('finishedAt cannot be before startedAt', 422, ERROR_CODES.VALIDATION_ERROR);
  }
}

module.exports = { getLibrary, addToLibrary, updateLibraryEntry, deleteLibraryEntry };
