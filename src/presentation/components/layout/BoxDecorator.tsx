import React, { ComponentPropsWithRef, ElementType, ReactElement, ForwardedRef, forwardRef, Ref } from 'react';
import { Box, BoxProps } from '@mui/material';
import { Override } from 'shared/types';

export type BoxDecoratorProps<C extends ElementType> = Override<ComponentPropsWithRef<C>, { component?: C }> & BoxProps;

const BoxDecorator = <C extends ElementType>(
    {
        component = undefined,
        children,
        ...props
    }: BoxDecoratorProps<C>,
    ref: ForwardedRef<HTMLElement>,
): ReactElement => {
    return (
        <Box ref={ref} {...(component && { component })} {...props}>
            {children}
        </Box>
    );
};

export default forwardRef(BoxDecorator) as <C extends ElementType>(
    props: BoxDecoratorProps<C> & { ref?: Ref<HTMLElement | unknown> }
) => ReactElement;
