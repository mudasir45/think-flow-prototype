'use client';

import { ProjectMember } from '@/lib/types/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeamDialog } from './team-dialog';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamListProps {
  className?: string;
  members: ProjectMember[];
  onMembersChange: (members: ProjectMember[]) => void;
}

export function TeamList({ className, members, onMembersChange }: TeamListProps) {
  const [showAddMember, setShowAddMember] = useState(false);

  const handleRemoveMember = (id: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      onMembersChange(members.filter(member => member.id !== id));
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'developer': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'designer': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'product-manager': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'qa': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'tech-lead': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        <Button onClick={() => setShowAddMember(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <Badge className={cn("mt-1", getRoleColor(member.role))}>
                    {member.role.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveMember(member.id)}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>

      <TeamDialog
        open={showAddMember}
        onOpenChange={setShowAddMember}
        onMemberAdded={(member) => onMembersChange([...members, member])}
      />
    </Card>
  );
}