import React, { ReactElement, ReactNode, useState, MouseEvent } from 'react';
import {
    Box,
    Button,
    ClickAwayListener,
    Paper,
    Popper,
    SxProps,
    Theme,
    Typography,
} from '@mui/material';
import { themePalette } from 'presentation/theme';
import { MoreHorizontalIcon } from 'presentation/components/icons';
import { Column } from 'presentation/components/layout';

interface ButtonPaperProps {
    children: ReactNode;
    icon?: ReactElement;
    sx?: SxProps<Theme>;
    label?: string;
    hover?: boolean;
}

export default function ButtonPaper({
    children,
    icon,
    sx,
    label,
    hover = false,
}: ButtonPaperProps): ReactElement {
    const [ref, setRef] = useState<null | HTMLElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const closePopover = () => {
        setIsOpen(false);
        setRef(null);
    };

    const handleMouseEnter = (event: MouseEvent<HTMLElement>): void => {
        if (hover) {
            setRef(event.currentTarget);
            setIsOpen(true);
        }
    };

    const handleMouseLeave = (): void => {
        if (hover) {
            closePopover();
        }
    };

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        if (hover) {
            if (isOpen) {
                closePopover();
            } else {
                setRef(event.currentTarget);
                setIsOpen(true);
            }
        } else {
            setRef(ref ? null : event.currentTarget);
            setIsOpen((prev) => !prev);
        }
    };

    return (
        <Box sx={sx}>
            <Button
                onClick={handleClick}
                onMouseEnter={hover ? handleMouseEnter : undefined}
                size='large'
                sx={{
                    color: themePalette.text.main,
                    px: 1.5,
                    gap: 1,
                    border: 1,
                    borderColor: themePalette.border.main,

                    '&:hover': {
                        borderColor: themePalette.text.main,
                        background: 'none',
                    },
                }}
                variant='outlined'
            >
                {icon || <MoreHorizontalIcon />}

                <Typography sx={sx}>
                    {label}
                </Typography>
            </Button>

            <Popper
                anchorEl={ref}
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [-20, 5], // [horizontal offset, vertical offset]
                        },
                    },
                ]}
                onMouseLeave={hover ? handleMouseLeave : undefined}
                open={isOpen}
                sx={{
                    zIndex: 100,
                }}
            >
                <ClickAwayListener onClickAway={closePopover}>
                    <Paper>
                        <Column sx={{ p: 3 }}>
                            {children}
                        </Column>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    );
}
