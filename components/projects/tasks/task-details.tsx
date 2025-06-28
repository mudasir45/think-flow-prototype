'use client';

import { useState } from 'react';
import { Task, TaskComment } from '@/lib/types/tasks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Clock, Paperclip, Send, Timer, Upload } from 'lucide-react';
import { addComment, logTime } from '@/lib/services/tasks';

interface TaskDetailsProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
}

export function TaskDetails({ task, onTaskUpdated }: TaskDetailsProps) {
  const [comment, setComment] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [showTimeLog, setShowTimeLog] = useState(false);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const updatedTask = addComment(task.id, 'user123', comment.trim());
    onTaskUpdated(updatedTask);
    setComment('');
  };

  const handleLogTime = () => {
    const hours = parseFloat(timeSpent);
    if (isNaN(hours) || hours <= 0) return;

    const updatedTask = logTime(task.id, hours);
    onTaskUpdated(updatedTask);
    setTimeSpent('');
    setShowTimeLog(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, this would upload to a storage service
    const attachment = {
      id: crypto.randomUUID(),
      taskId: task.id,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    onTaskUpdated({
      ...task,
      attachments: [...task.attachments, attachment],
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Time Tracking */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Time Tracking</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTimeLog(!showTimeLog)}
          >
            <Timer className="h-4 w-4 mr-2" />
            Log Time
          </Button>
        </div>

        {showTimeLog && (
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              placeholder="Hours spent"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              className="w-32"
              step="0.5"
              min="0"
            />
            <Button onClick={handleLogTime}>Log</Button>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Total time logged: {task.loggedHours || 0} hours
        </div>
      </Card>

      {/* Attachments */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Attachments</h3>
          </div>
          <Button variant="outline" size="sm" asChild>
            <label>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
        </div>

        <div className="space-y-2">
          {task.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 rounded-md bg-muted"
            >
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm font-medium">{attachment.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(attachment.size / 1024)} KB)
                </span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={attachment.url} download={attachment.name}>
                  Download
                </a>
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Comments */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Comments</h3>
        
        <ScrollArea className="h-[300px] pr-4 -mr-4">
          <div className="space-y-4">
            {task.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">User</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />
          <Button className="shrink-0" onClick={handleAddComment}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}