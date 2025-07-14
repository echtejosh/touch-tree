import React, { Children, isValidElement, cloneElement, ReactElement, ReactNode } from 'react';
import { Grid } from '@mui/material';
import { Breakpoint } from '@mui/system';
import { GridDirection, GridProps } from '@mui/material/Grid';

interface RowProps extends GridProps {
    direction?: Partial<Record<Breakpoint, GridDirection>>;
    end?: boolean;
    fill?: boolean;
}

export default function Row({
    gap = 3,
    children,
    fill,
    direction,
    end,
    sx,
    ...props
}: RowProps): ReactElement {
    let _children = children;

    if (fill) {
        _children = Children.map(children, (child): ReactNode => {
            if (isValidElement(child)) {
                return cloneElement(child, {
                    sx: {
                        flex: child.props.sx?.flex || 1,
                        ...child.props.sx,
                    },
                } as never);
            }

            return child;
        });
    }

    return (
        <Grid
            sx={{
                display: 'flex',
                gap,

                ...end && {
                    justifyContent: 'flex-end',
                },

                ...direction && {
                    flexDirection: direction,
                },

                ...sx,
            }}
            {...props}
        >
            {_children}
        </Grid>
    );
}
