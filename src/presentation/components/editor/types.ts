export const Breakpoints = {
    Phone: 0.55,
    Tablet: 1.3,
} as const;

export type Breakpoint = typeof Breakpoints[keyof typeof Breakpoints];
