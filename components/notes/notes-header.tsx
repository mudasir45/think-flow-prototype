'use client';

import { Button } from '@/components/ui/button';
import { Plus, Grid, List } from 'lucide-react';
import { useState } from 'react';
import { NoteDialog } from './note-dialog';
import { NoteView } from '@/lib/types/notes';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface NotesHeaderProps {
  view: NoteView;
  onViewChange: (view: NoteView) => void;
}

export function NotesHeader({ view, onViewChange }: NotesHeaderProps) {
  const [showNewNote, setShowNewNote] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
        <p className="text-muted-foreground">
          Capture your thoughts and ideas
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && onViewChange(v as NoteView)}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button onClick={() => setShowNewNote(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>
      <NoteDialog open={showNewNote} onOpenChange={setShowNewNote} />
    </div>
  );
}