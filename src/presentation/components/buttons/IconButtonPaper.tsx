import React, { ReactElement, ReactNode, useState, MouseEvent, Children, isValidElement, cloneElement } from 'react';
import { Box, ClickAwayListener, IconButton, MenuList, Paper, Popper, SxProps, Theme } from '@mui/material';
import { themePalette } from 'presentation/theme';
import { MoreHorizontalIcon } from 'presentation/components/icons';

interface IconButtonPaperProps {
    children: ReactNode;
    icon?: ReactElement;
    sx?: SxProps<Theme>;
    hover?: boolean;
    zIndex?: number;
}

export default function IconButtonPaper({
    children,
    icon,
    sx,
    hover = false,
    zIndex = 10000,
}: IconButtonPaperProps): ReactElement {
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
            <IconButton
                onClick={handleClick}
                onMouseEnter={hover ? handleMouseEnter : undefined}
                sx={{ color: themePalette.text.main }}
            >
                {icon || <MoreHorizontalIcon />}
            </IconButton>

            <Popper
                anchorEl={ref}
                modifiers={[
                    {
                        name: 'preventOverflow',
                        options: {
                            padding: {
                                left: 16,
                                right: 16,
                            },
                        },
                    },
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 5],
                        },
                    },
                ]}
                onMouseLeave={hover ? handleMouseLeave : undefined}
                open={isOpen}
                placement='bottom'
                sx={{ zIndex }}
            >
                <ClickAwayListener onClickAway={closePopover}>
                    <Paper>
                        <MenuList>
                            {Children.map(children, (child) => {
                                if (isValidElement(child)) {
                                    return cloneElement(child, {
                                        onClick: (event: MouseEvent<HTMLElement>) => {
                                            child.props.onClick?.(event);
                                            closePopover();
                                        },
                                    } as never);
                                }

                                return child;
                            })}
                        </MenuList>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    );
}
