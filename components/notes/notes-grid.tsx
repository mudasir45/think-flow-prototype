'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/lib/types/notes';
import { getNotes, togglePin, toggleFavorite, deleteNote } from '@/lib/services/notes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NoteDialog } from './note-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Pin,
  PinOff,
  Star,
  StarOff,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export function NotesGrid() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      setNotes(getNotes());
    }
  };

  const handlePin = (id: string) => {
    togglePin(id);
    setNotes(getNotes());
  };

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    setNotes(getNotes());
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      'default': 'bg-card',
      'red': 'bg-red-50 dark:bg-red-900/10',
      'yellow': 'bg-yellow-50 dark:bg-yellow-900/10',
      'green': 'bg-green-50 dark:bg-green-900/10',
      'blue': 'bg-blue-50 dark:bg-blue-900/10',
      'purple': 'bg-purple-50 dark:bg-purple-900/10'
    };
    return colors[color] || colors.default;
  };

  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);

  return (
    <div className="col-span-4 space-y-6">
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-muted-foreground">Pinned Notes</h3>
          <div className="grid grid-cols-2 gap-4">
            {pinnedNotes.map((note) => (
              <Card
                key={note.id}
                className={cn(
                  "overflow-hidden transition-shadow hover:shadow-md",
                  getColorClass(note.color)
                )}
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{note.title}</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePin(note.id)}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFavorite(note.id)}
                      >
                        {note.isFavorite ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingNote(note)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(note.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <ScrollArea className="h-[200px] pr-4">
                    <div className="prose prose-sm dark:prose-invert">
                      <ReactMarkdown>{note.content}</ReactMarkdown>
                    </div>
                  </ScrollArea>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(note.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <div className="flex gap-1">
                          {note.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {pinnedNotes.length > 0 && <h3 className="font-medium text-muted-foreground">Other Notes</h3>}
        <div className="grid grid-cols-2 gap-4">
          {unpinnedNotes.map((note) => (
            <Card
              key={note.id}
              className={cn(
                "overflow-hidden transition-shadow hover:shadow-md",
                getColorClass(note.color)
              )}
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{note.title}</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePin(note.id)}
                    >
                      <PinOff className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFavorite(note.id)}
                    >
                      {note.isFavorite ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingNote(note)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <ScrollArea className="h-[200px] pr-4">
                  <div className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(note.updatedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <div className="flex gap-1">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {editingNote && (
        <NoteDialog
          open={!!editingNote}
          onOpenChange={(open) => {
            if (!open) {
              setEditingNote(null);
              setNotes(getNotes());
            }
          }}
          note={editingNote}
        />
      )}
    </div>
  );
}