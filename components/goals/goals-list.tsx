'use client';

import { useEffect, useState } from 'react';
import { Goal, Milestone } from '@/lib/types/goals';
import { getGoals, updateGoal, deleteGoal } from '@/lib/services/goals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoalDialog } from './goal-dialog';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Target, Calendar, CheckSquare, Flag, Award, ChevronRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface GoalsListProps {
  className?: string;
}

export function GoalsList({ className }: GoalsListProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [viewingGoal, setViewingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
      setGoals(getGoals());
    }
  };

  const handleMilestoneToggle = (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId 
        ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' }
        : m
    );

    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updatedGoal = {
      ...goal,
      milestones: updatedMilestones,
      progress
    };

    updateGoal(updatedGoal);
    setGoals(getGoals());
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      professional: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      financial: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      education: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      relationships: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const GoalDetails = ({ goal }: { goal: Goal }) => (
    <Dialog open={!!viewingGoal} onOpenChange={() => setViewingGoal(null)}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{goal.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <Badge className={cn("text-sm", getCategoryColor(goal.category))}>
              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {format(new Date(goal.targetDate), "PPP")}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground">{goal.description}</p>
          </div>

          {/* SMART Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specific</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{goal.specific}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Measurable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{goal.measurable}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{goal.achievable}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Relevant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{goal.relevant}</p>
              </CardContent>
            </Card>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Milestones</h3>
            <div className="space-y-4">
              {goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <Checkbox
                    checked={milestone.status === 'completed'}
                    onCheckedChange={() => handleMilestoneToggle(goal.id, milestone.id)}
                  />
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      milestone.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                      {milestone.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(milestone.targetDate), "PPP")}
                    </p>
                  </div>
                  <Badge variant={milestone.status === 'completed' ? "default" : "outline"}>
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Action Plan</h3>
            <p className="text-muted-foreground whitespace-pre-line">{goal.actionPlan}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className={cn("col-span-7", className)}>
      <CardHeader>
        <CardTitle>Active Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <div className="relative">
                <div className={cn("absolute top-0 right-0 p-2 flex gap-2")}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewingGoal(goal)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingGoal(goal)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{goal.title}</h3>
                  </div>
                  
                  <Badge className={cn("mb-4", getCategoryColor(goal.category))}>
                    {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                  </Badge>

                  <p className="text-muted-foreground mb-4">{goal.description}</p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Due: {format(new Date(goal.targetDate), "PPP")}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          Active Milestones
                        </h4>
                        <div className="space-y-2">
                          {goal.milestones
                            .filter(m => m.status === 'pending')
                            .slice(0, 2)
                            .map((milestone) => (
                              <div
                                key={milestone.id}
                                className="flex items-center gap-2 text-sm p-2 rounded-md bg-secondary/50"
                              >
                                <Checkbox
                                  checked={milestone.status === 'completed'}
                                  onCheckedChange={() => handleMilestoneToggle(goal.id, milestone.id)}
                                />
                                <span>{milestone.title}</span>
                              </div>
                            ))}
                          {goal.milestones.filter(m => m.status === 'pending').length > 2 && (
                            <Button
                              variant="ghost"
                              className="w-full text-sm"
                              onClick={() => setViewingGoal(goal)}
                            >
                              View All Milestones
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {goal.progress === 100 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Award className="h-5 w-5" />
                        <span className="font-medium">Goal Achieved!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      {editingGoal && (
        <GoalDialog
          open={!!editingGoal}
          onOpenChange={(open) => {
            if (!open) {
              setEditingGoal(null);
              setGoals(getGoals());
            }
          }}
          goal={editingGoal}
        />
      )}
      {viewingGoal && <GoalDetails goal={viewingGoal} />}
    </Card>
  );
}