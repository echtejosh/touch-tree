import { useState, useMemo } from 'react';

export interface Step {
    id?: number;
    completed?: boolean;
}

export interface UseStepsShape {
    steps: Step[];
    currentStep: number;
    atStart: boolean;
    atEnd: boolean;
    allStepsCompleted: boolean;

    stepForward(): void;

    stepBack(): void;

    toStep(i: number): void;

    completeStep(id: number, value?: boolean): void;
}

export default function useSteps(totalSteps: number): UseStepsShape & { stepper: UseStepsShape } {
    // Automatically assign id starting from 0 for each step
    const stepsWithIds = Array.from({ length: totalSteps }, (_, index) => ({
        id: index, // Assigning id based on index
        completed: false,
    }));

    const [steps, setSteps] = useState<Step[]>(stepsWithIds);
    const [currentStep, setCurrentStep] = useState(0);

    const allStepsCompleted = useMemo(() => steps.every((step) => step.completed), [steps]);

    const atStart = currentStep === 0;
    const atEnd = currentStep === steps.length - 1;

    // Move to the next step
    const stepForward = () => {
        if (!atEnd) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    // Move to the previous step
    const stepBack = () => {
        if (!atStart) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Move to a specific step
    const toStep = (i: number) => {
        if (i >= 0 && i < steps.length) {
            setCurrentStep(i);
        }
    };

    // Mark a specific step as completed
    const completeStep = (id: number, value: boolean = true) => {
        setSteps((prevSteps) => prevSteps.map((step) => (step.id === id ? {
            ...step,
            completed: value,
        } : step)));
    };

    const stepper: UseStepsShape = {
        steps,
        currentStep,
        atStart,
        atEnd,
        allStepsCompleted,
        stepForward,
        stepBack,
        toStep,
        completeStep,
    };

    return {
        ...stepper,
        stepper,
    };
}
