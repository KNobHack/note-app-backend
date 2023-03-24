const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  // {
  //   id: string,
  //   title: string,
  //   createdAt: string,
  //   updatedAt: string,
  //   tags: array of string,
  //   body: string,
  //  },

  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isFailed = notes.filter((note) => note.id === id).length < 1;

  // const res = h.response.header('Access-Control-Allow-Origin', '*');

  if (isFailed) {
    return h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    }).code(500);
  }

  return h.response({
    status: 'success',
    message: 'Catatan berhasil ditambahkan',
    data: {
      noteId: id,
    },
  }).code(201);
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note === undefined) {
    return h.response({
      status: 'failed',
      message: 'Catatan tidak ditemukan',
    }).code(404);
  }

  return {
    status: 'success',
    data: {
      note,
    },
  };
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbaharui catatan. Id tidak ditemukan',
    }).code(404);
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  return h.response({
    status: 'success',
    message: 'Catatan berhasil diperbaharui',
  }).code(200);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal menghapus catatan. Id tidak ditemukan',
    }).code(404);
  }

  notes.splice(index, 1);
  return h.response({
    status: 'success',
    message: 'Catatan berhasil di hapus',
  });
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
