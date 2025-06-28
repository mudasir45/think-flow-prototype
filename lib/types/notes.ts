export type NoteCategory = 'personal' | 'work' | 'ideas' | 'journal' | 'goals' | 'other';
export type NoteColor = 'default' | 'red' | 'yellow' | 'green' | 'blue' | 'purple';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  color: NoteColor;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastEditedAt: string;
  collaborators: string[];
  attachments: NoteAttachment[];
  reminders: NoteReminder[];
}

export interface NoteAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface NoteReminder {
  id: string;
  date: string;
  isCompleted: boolean;
  createdAt: string;
}

export type NoteView = 'grid' | 'list';