'use client';

import { useEffect, useState } from 'react';
import { TeamMember, TeamView } from '@/lib/types/team';
import { getTeamMembers } from '@/lib/services/team';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TeamGridProps {
  className?: string;
  view: TeamView;
}

export function TeamGrid({ className, view }: TeamGridProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMembers(getTeamMembers());
  }, []);

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'tech_lead': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'developer': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'designer': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'product_manager': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'qa_engineer': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'project_manager': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'marketing': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'sales': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'hr': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      'admin': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    };
    return colors[role] || colors.admin;
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={className}>
      <div className={cn(
        "grid gap-6",
        view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {members.map((member) => (
          <Card 
            key={member.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/team/${member.id}`)}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getRoleColor(member.role)}>
                  {formatRole(member.role)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{formatRole(member.department)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{member.location}</span>
                </div>
              </div>

              <Button variant="ghost" className="w-full mt-4">
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}