'use client';

import { useEffect, useState } from 'react';
import { TeamMember } from '@/lib/types/team';
import { getTeamMembers } from '@/lib/services/team';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Building2,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Star,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Phone,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TeamMemberClientProps {
  memberId: string;
}

export function TeamMemberClient({ memberId }: TeamMemberClientProps) {
  const [member, setMember] = useState<TeamMember | null>(null);
  const router = useRouter();

  useEffect(() => {
    const members = getTeamMembers();
    const foundMember = members.find(m => m.id === memberId);
    setMember(foundMember || null);
  }, [memberId]);

  if (!member) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Team Member Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The team member you're looking for doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => router.push('/team')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </div>
      </div>
    );
  }

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Button variant="ghost" onClick={() => router.push('/team')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Team
      </Button>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{member.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">
                    {formatRole(member.role)}
                  </Badge>
                  <Badge variant="outline">
                    {formatRole(member.department)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{member.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{member.timezone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {format(new Date(member.joinDate), "MMMM d, yyyy")}</span>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Current Projects
                </h4>
                <div className="flex flex-wrap gap-1">
                  {member.projects.map(project => (
                    <Badge key={project} variant="outline">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          {member.performance && (
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-2xl font-bold">{member.performance.rating}</span>
                      <span className="text-muted-foreground">/5.0</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Projects</p>
                    <p className="text-2xl font-bold mt-1">{member.performance.completedProjects}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ongoing Projects</p>
                    <p className="text-2xl font-bold mt-1">{member.performance.ongoingProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact & Social */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Social</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {member.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${member.contact.phone}`} className="hover:underline">
                      {member.contact.phone}
                    </a>
                  </div>
                )}
                {member.contact.slack && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{member.contact.slack}</span>
                  </div>
                )}
                <div className="flex gap-4 mt-4">
                  {member.socialLinks.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.socialLinks.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.socialLinks.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}