import { Metadata } from 'next';
import { getTeamMembers } from '@/lib/services/team';
import { TeamMemberProfile } from '@/components/team/team-member-profile';
import { notFound } from 'next/navigation';

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  const members = getTeamMembers();
  return members.map((member) => ({
    id: member.id,
  }));
}

// Generate metadata for each team member page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const members = getTeamMembers();
  const member = members.find(m => m.id === params.id);
  
  if (!member) {
    return {
      title: 'Team Member Not Found',
    };
  }

  return {
    title: `${member.name} - Team Member Profile`,
    description: member.bio,
  };
}

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const members = getTeamMembers();
  const member = members.find(m => m.id === params.id);

  if (!member) {
    notFound();
  }

  return <TeamMemberProfile member={member} />;
}