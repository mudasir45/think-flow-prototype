'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SmartGoalFormProps {
  onChange: (values: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timebound: string;
  }) => void;
  values: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timebound: string;
  };
}

export function SmartGoalForm({ onChange, values }: SmartGoalFormProps) {
  const prompts = {
    specific: "What exactly do you want to accomplish? Be precise and detailed.",
    measurable: "How will you measure progress and success? Define concrete criteria.",
    achievable: "Is this goal realistic? What resources do you need?",
    relevant: "Why is this goal important to you? How does it align with your values?",
    timebound: "What's your timeline? Set specific deadlines for completion."
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="specific">
        <AccordionTrigger>Specific</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{prompts.specific}</p>
            <Textarea
              value={values.specific}
              onChange={(e) => onChange({ ...values, specific: e.target.value })}
              placeholder="Example: I want to learn Spanish to conversational level B1..."
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="measurable">
        <AccordionTrigger>Measurable</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{prompts.measurable}</p>
            <Textarea
              value={values.measurable}
              onChange={(e) => onChange({ ...values, measurable: e.target.value })}
              placeholder="Example: Complete 30 language lessons, pass B1 certification..."
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="achievable">
        <AccordionTrigger>Achievable</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{prompts.achievable}</p>
            <Textarea
              value={values.achievable}
              onChange={(e) => onChange({ ...values, achievable: e.target.value })}
              placeholder="Example: I have 1 hour daily to study, access to learning resources..."
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="relevant">
        <AccordionTrigger>Relevant</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{prompts.relevant}</p>
            <Textarea
              value={values.relevant}
              onChange={(e) => onChange({ ...values, relevant: e.target.value })}
              placeholder="Example: This will help me in my career and personal growth..."
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="timebound">
        <AccordionTrigger>Time-bound</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{prompts.timebound}</p>
            <Textarea
              value={values.timebound}
              onChange={(e) => onChange({ ...values, timebound: e.target.value })}
              placeholder="Example: Complete B1 level within 6 months..."
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}