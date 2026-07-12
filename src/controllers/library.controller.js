const libraryService = require('../services/library.service');
const { sendPaginated, sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getLibrary = asyncHandler(async (req, res) => {
  const result = await libraryService.getLibrary(req.user.id, req.validated.query);

  return sendPaginated(res, result.data, result.pagination);
});

const addToLibrary = asyncHandler(async (req, res) => {
  const data = await libraryService.addToLibrary(req.user.id, req.validated.body);

  return sendSuccess(res, data, 201);
});

const updateLibraryEntry = asyncHandler(async (req, res) => {
  const data = await libraryService.updateLibraryEntry(req.user.id, req.validated.params.id, req.validated.body);

  return sendSuccess(res, data);
});

const deleteLibraryEntry = asyncHandler(async (req, res) => {
  await libraryService.deleteLibraryEntry(req.user.id, req.validated.params.id);

  return res.status(204).send();
});

module.exports = { getLibrary, addToLibrary, updateLibraryEntry, deleteLibraryEntry };
