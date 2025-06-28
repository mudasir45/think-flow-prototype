import { Note, NoteCategory, NoteColor } from '../types/notes';
import { getFromStorage, setToStorage } from '../utils/storage';

const STORAGE_KEY = 'notes';

// Sample notes for initial state
const sampleNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Welcome to Notes!',
    content: '# Welcome to Your Personal Notes Space\n\nThis is a powerful note-taking app designed to help you organize your thoughts, ideas, and important information. Here are some key features:\n\n- Rich text editing\n- Categories and tags\n- Pin important notes\n- Color coding\n- Attachments support\n- Reminders\n\nStart by creating your first note!',
    category: 'personal',
    color: 'blue',
    isPinned: true,
    isArchived: false,
    isFavorite: true,
    tags: ['welcome', 'getting-started'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastEditedAt: new Date().toISOString(),
    collaborators: [],
    attachments: [],
    reminders: []
  },
  {
    id: 'note-2',
    title: 'Project Ideas',
    content: '## Future Project Ideas\n\n1. Mobile app for task management\n2. Personal finance tracker\n3. Recipe collection app\n\n### Key Features\n- Cross-platform support\n- Cloud sync\n- Offline mode',
    category: 'ideas',
    color: 'yellow',
    isPinned: false,
    isArchived: false,
    isFavorite: true,
    tags: ['projects', 'ideas', 'development'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastEditedAt: new Date().toISOString(),
    collaborators: [],
    attachments: [],
    reminders: []
  }
];

// Initialize notes if they don't exist
const initializeNotes = () => {
  if (typeof window !== 'undefined') {
    const existingNotes = localStorage.getItem(STORAGE_KEY);
    if (!existingNotes) {
      setToStorage(STORAGE_KEY, sampleNotes);
    }
  }
};

export const getNotes = (): Note[] => {
  if (typeof window === 'undefined') {
    return sampleNotes;
  }
  
  initializeNotes();
  return getFromStorage<Note[]>(STORAGE_KEY, []);
};

export const getNote = (id: string): Note | null => {
  const notes = getNotes();
  return notes.find(note => note.id === id) || null;
};

export const addNote = (note: Partial<Note>): Note => {
  const notes = getNotes();
  
  const newNote: Note = {
    id: crypto.randomUUID(),
    title: note.title || 'Untitled Note',
    content: note.content || '',
    category: note.category || 'other',
    color: note.color || 'default',
    isPinned: note.isPinned || false,
    isArchived: note.isArchived || false,
    isFavorite: note.isFavorite || false,
    tags: note.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastEditedAt: new Date().toISOString(),
    collaborators: note.collaborators || [],
    attachments: note.attachments || [],
    reminders: note.reminders || []
  };

  setToStorage(STORAGE_KEY, [...notes, newNote]);
  return newNote;
};

export const updateNote = (updatedNote: Note): void => {
  const notes = getNotes();
  const updatedNotes = notes.map(note =>
    note.id === updatedNote.id
      ? { ...updatedNote, updatedAt: new Date().toISOString() }
      : note
  );
  setToStorage(STORAGE_KEY, updatedNotes);
};

export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  setToStorage(STORAGE_KEY, filteredNotes);
};

export const togglePin = (id: string): void => {
  const notes = getNotes();
  const updatedNotes = notes.map(note =>
    note.id === id
      ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
      : note
  );
  setToStorage(STORAGE_KEY, updatedNotes);
};

export const toggleFavorite = (id: string): void => {
  const notes = getNotes();
  const updatedNotes = notes.map(note =>
    note.id === id
      ? { ...note, isFavorite: !note.isFavorite, updatedAt: new Date().toISOString() }
      : note
  );
  setToStorage(STORAGE_KEY, updatedNotes);
};

export const toggleArchive = (id: string): void => {
  const notes = getNotes();
  const updatedNotes = notes.map(note =>
    note.id === id
      ? { ...note, isArchived: !note.isArchived, updatedAt: new Date().toISOString() }
      : note
  );
  setToStorage(STORAGE_KEY, updatedNotes);
};

export const addReminder = (noteId: string, date: string): void => {
  const notes = getNotes();
  const note = notes.find(n => n.id === noteId);
  
  if (!note) return;

  const reminder = {
    id: crypto.randomUUID(),
    date,
    isCompleted: false,
    createdAt: new Date().toISOString()
  };

  const updatedNote = {
    ...note,
    reminders: [...note.reminders, reminder],
    updatedAt: new Date().toISOString()
  };

  updateNote(updatedNote);
};