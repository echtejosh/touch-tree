import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Box, Column } from 'presentation/components/layout';
import { BoxProps, Button, Collapse, SxProps, Theme } from '@mui/material';
import { ExpandLessIcon, ExpandMoreIcon } from 'presentation/components/icons';
import { themePalette } from 'presentation/theme';

export interface EditorSidebarDropdownProps extends BoxProps {
    label: string | ReactNode;
    open?: boolean;
    children: ReactElement | ReactElement[];
    childrenSx?: SxProps<Theme>;
}

export default function EditorSidebarDropdown({
    label,
    open = false,
    children,
    childrenSx,
    ...props
}: EditorSidebarDropdownProps): ReactElement {
    const [expanded, setExpanded] = useState(open);

    useEffect((): void => {
        setExpanded(open);
    }, [open]);

    const handleExpandToggle = (): void => {
        setExpanded((prev): boolean => !prev);
    };

    return (
        <Box {...props}>
            <Box px={2}>
                <Button
                    fullWidth
                    onClick={handleExpandToggle}
                    size='large'
                    sx={{
                        display: 'flex',
                        px: 2,
                        fontWeight: 600,
                        color: themePalette.text.main,
                        justifyContent: 'space-between',

                        '&:hover': {
                            background: themePalette.hover.light,
                        },
                    }}
                >
                    {label}

                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
            </Box>

            <Collapse in={expanded}>
                <Column
                    sx={{
                        py: 2,
                        pb: 1.5,
                        mx: 4,
                        width: 480,

                        ...childrenSx,
                    }}
                >
                    {children}
                </Column>
            </Collapse>
        </Box>
    );
}
