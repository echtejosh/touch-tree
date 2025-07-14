import { Box } from 'presentation/components/layout';
import React from 'react';
import { Step, UseStepsShape } from 'presentation/hooks/useSteps';
import { themePalette } from 'presentation/theme';

export interface StepperProps {
    stepper: UseStepsShape;
    onChange?: (currentStep: number, step: Step) => void;
}

export default function Stepper({
    stepper,
    onChange,
}: StepperProps) {
    const {
        steps,
        currentStep,
        toStep,
    } = stepper;

    const getStepStyles = (step: Step, index: number) => {
        if (currentStep === index) {
            return {
                borderColor: themePalette.primary.main,
            };
        }
        if (step.completed) {
            return {
                backgroundColor: themePalette.primary.main,
            };
        }
        return {
            borderColor: 'rgba(188,188,195,0.45)',
        };
    };

    const getLineStyles = (step: Step, nextStep: Step) => {
        return step.completed && nextStep.completed
            ? { backgroundColor: themePalette.primary.main }
            : { backgroundColor: 'rgba(188,188,195,0.45)' };
    };

    const handleStepChange = (newStep: number) => {
        if (onChange) {
            onChange(newStep, steps[newStep]); // Notify parent of the step change
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
            }}
        >
            {/* Stepper Visualization */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    mb: 1,
                }}
            >
                {steps.map((step, index) => (
                    <Box
                        key={step.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',

                            ...index === steps.length - 1 && {
                                flex: 0,
                            },
                        }}
                    >
                        {/* Step */}
                        <Box
                            onClick={() => {
                                if (step.completed) {
                                    toStep(index);
                                }
                                handleStepChange(index); // Notify parent on step click
                            }}
                            sx={{
                                width: 15,
                                height: 15,
                                borderRadius: '50%',
                                border: '2px solid transparent',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                ...getStepStyles(step, index),
                            }}
                        />

                        {/* Line Between Steps */}
                        {index < steps.length - 1 && (
                            <Box
                                sx={{
                                    flex: 1,
                                    height: 2,
                                    ...getLineStyles(step, steps[index]),
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
