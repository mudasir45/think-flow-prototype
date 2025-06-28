'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Team Lead',
    department: 'Web Development',
    status: 'Active',
    avatar: '/avatars/01.png',
  },
  {
    name: 'Sarah Smith',
    role: 'Senior Developer',
    department: 'Mobile',
    status: 'In Meeting',
    avatar: '/avatars/02.png',
  },
  {
    name: 'Mike Johnson',
    role: 'Developer',
    department: 'Web Development',
    status: 'Away',
    avatar: '/avatars/03.png',
  },
];

export function TeamMembers() {
  return (
    <div className="space-y-4">
      {teamMembers.map((member, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{member.department}</Badge>
            <Badge>{member.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}