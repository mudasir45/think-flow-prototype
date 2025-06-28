'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNotes } from '@/lib/services/notes';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

export function NotesAnalytics() {
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pinned: 0,
    favorites: 0,
    archived: 0
  });

  useEffect(() => {
    const notes = getNotes();
    
    // Calculate category distribution
    const categories = notes.reduce((acc, note) => {
      const category = note.category.charAt(0).toUpperCase() + note.category.slice(1);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCategoryData(
      Object.entries(categories).map(([name, value]) => ({
        name,
        value,
      }))
    );

    // Calculate stats
    setStats({
      total: notes.length,
      pinned: notes.filter(n => n.isPinned).length,
      favorites: notes.filter(n => n.isFavorite).length,
      archived: notes.filter(n => n.isArchived).length
    });
  }, []);

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">
            Notes: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Notes Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pinned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pinned}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favorites}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Archived</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.archived}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Categories Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}