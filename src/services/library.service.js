const { ERROR_CODES } = require('../constants/errorCodes');
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
    alternativeTitles: anime.alternativeTitles || [],
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
  const anime = await animeService.findOrCreateAnime(input);
  const existingEntry = await libraryRepository.findLibraryEntryByAnime(userId, anime.id);

  if (existingEntry) {
    throw new AppError('Anime already exists in library', 409, ERROR_CODES.ANIME_ALREADY_IN_LIBRARY);
  }

  const entry = await libraryRepository.createLibraryEntry({
    userId,
    animeId: anime.id,
    status: input.status,
    episodesWatched: input.status === 'COMPLETED' && anime.episodes ? anime.episodes : 0,
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

function validateLibraryProgress(entry) {
  if (entry.anime.episodes && entry.episodesWatched > entry.anime.episodes) {
    throw new AppError('Episodes watched cannot exceed anime episodes', 422, ERROR_CODES.VALIDATION_ERROR, [
      {
        field: 'episodesWatched',
        message: `Episodes watched cannot exceed ${entry.anime.episodes}`,
      },
    ]);
  }

  if (entry.startedAt && entry.finishedAt && entry.finishedAt < entry.startedAt) {
    throw new AppError('finishedAt cannot be before startedAt', 422, ERROR_CODES.VALIDATION_ERROR, [
      {
        field: 'finishedAt',
        message: 'Finished date cannot be before started date',
      },
    ]);
  }
}

module.exports = { getLibrary, addToLibrary, updateLibraryEntry, deleteLibraryEntry };
