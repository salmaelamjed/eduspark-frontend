'use client'
import { cn } from '@/lib/utils';
import { Settings, Layers, Rocket, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useStepContextHook } from '@/context/use-step-context';

const steps: { id: number; label: string; icon: React.ElementType }[] = [
  { id: 1, label: 'Setup', icon: Settings },
  { id: 2, label: 'Contents', icon: Layers },
  { id: 3, label: 'Publish', icon: Rocket },
];

export function WorkflowStepper() {
    const {currentStep}=useStepContextHook()
    const currentIndex = steps.findIndex(s => s.id === currentStep);
 
  return (
    <div className="flex items-center justify-center gap-2 py-2 sticky top-0">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.id === currentStep;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center ">
            <Button
              className={cn(
                "flex items-center gap-2 px-10 py-6 rounded-full transition-all duration-300",
                isCurrent && "bg-orange-500 text-primary-foreground shadow-soft hover:cursor-pointer hover:bg-orange-500",
                isCompleted && "bg-green-100 text-green-600 hover:bg-green-100 hover:cursor-pointer",
                !isCurrent && !isCompleted && "text-muted-foreground bg-gray-100 hover:bg-gray-100 "
              )}
            >
              <span className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all",
                isCurrent && "bg-primary-foreground/20",
                isCompleted && "bg-green-300"
              )}>
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </span>
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
            </Button>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "w-38 h-1 mx-1 transition-colors duration-300",
                index < currentIndex ? "bg-green-300" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );


}
