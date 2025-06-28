'use client';

import { NotesHeader } from '@/components/notes/notes-header';
import { NotesList } from '@/components/notes/notes-list';
import { NotesGrid } from '@/components/notes/notes-grid';
import { NotesAnalytics } from '@/components/notes/notes-analytics';
import { useState } from 'react';
import { NoteView } from '@/lib/types/notes';

export default function NotesPage() {
  const [view, setView] = useState<NoteView>('grid');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <NotesHeader view={view} onViewChange={setView} />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        {view === 'grid' ? <NotesGrid /> : <NotesList />}
        <NotesAnalytics />
      </div>
    </div>
  );
}