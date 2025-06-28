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
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNotes(newExpanded);
  };

  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);

  const renderNoteList = (notesList: Note[], title?: string) => (
    <div className="space-y-2">
      {title && <h3 className="font-medium text-muted-foreground">{title}</h3>}
      {notesList.map((note) => (
        <Collapsible
          key={note.id}
          open={expandedNotes.has(note.id)}
          onOpenChange={() => toggleExpanded(note.id)}
        >
          <Card className={cn(
            "overflow-hidden transition-shadow hover:shadow-md",
            note.color !== 'default' && `bg-${note.color}-50 dark:bg-${note.color}-900/10`
          )}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {expandedNotes.has(note.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <h3 className="font-semibold">{note.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePin(note.id)}
                  >
                    {note.isPinned ? (
                      <Pin className="h-4 w-4" />
                    ) : (
                      <PinOff className="h-4 w-4" />
                    )}
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

              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
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

              <CollapsibleContent className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </div>
          </Card>
        </Collapsible>
      ))}
    </div>
  );

  return (
    <div className="col-span-4 space-y-6">
      {pinnedNotes.length > 0 && renderNoteList(pinnedNotes, 'Pinned Notes')}
      {renderNoteList(unpinnedNotes, pinnedNotes.length > 0 ? 'Other Notes' : undefined)}

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