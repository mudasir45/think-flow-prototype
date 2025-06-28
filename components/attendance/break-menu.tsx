'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BreakType } from '@/lib/types/attendance';

interface BreakMenuProps {
  onStartBreak: (type: BreakType) => void;
}

export function BreakMenu({ onStartBreak }: BreakMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Start Break</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStartBreak('lunch')}>
          Lunch Break
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStartBreak('coffee')}>
          Coffee Break
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStartBreak('other')}>
          Other Break
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}