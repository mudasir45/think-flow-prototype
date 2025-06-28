'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { ProjectMember } from '@/lib/types/projects';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdded: (member: ProjectMember) => void;
}

export function TeamDialog({
  open,
  onOpenChange,
  onMemberAdded,
}: TeamDialogProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('developer');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please provide a member name');
      return;
    }

    const member: ProjectMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role,
      avatar: `/avatars/0${Math.floor(Math.random() * 5) + 1}.png`,
    };

    onMemberAdded(member);
    onOpenChange(false);
    setName('');
    setRole('developer');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter member name"
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="product-manager">Product Manager</SelectItem>
                  <SelectItem value="qa">QA Engineer</SelectItem>
                  <SelectItem value="tech-lead">Tech Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">Add Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}