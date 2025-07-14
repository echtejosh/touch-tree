import React, { Children, cloneElement, ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'presentation/components';
import { themePalette } from 'presentation/theme';
import NavbarButton from 'presentation/components/navbar/NavbarButton';
import { alpha, Collapse, SxProps, Theme } from '@mui/material';
import { ExpandLessIcon, ExpandMoreIcon } from 'presentation/components/icons';
import { preloadRoute } from 'presentation/utils/routerPreloader';
import { Box } from '../layout';

export interface NavbarLinkProps {
    to: string;
    icon?: ReactElement<{ sx?: SxProps<Theme> }>;
    aliases?: string[];
    label?: string;
    category?: boolean;
    children?: ReactElement<{ sx?: SxProps<Theme> }>[];
    sx?: SxProps<Theme>;
    collapsed?: boolean;
    tooltipTitle?: string;
}

export default function NavbarLink({
    icon,
    to,
    category,
    label,
    aliases = [],
    children = [],
    sx,
    collapsed = false,
    tooltipTitle = '',
}: NavbarLinkProps): ReactElement {
    const { pathname } = useLocation();
    const current = [to, ...aliases].some((path): boolean => (path ? pathname === path : false));
    const _nested = [category ? to : undefined, ...aliases].some((path): boolean => (path ? pathname.startsWith(path) : false));
    const [expanded, setExpanded] = useState(_nested);

    const handleExpandToggle = () => {
        if (children.length > 0) {
            setExpanded((prev) => !prev);
        }
    };

    const handleMouseEnter = () => {
        preloadRoute(to);
    };

    useEffect(() => {
        setExpanded(_nested);
    }, [_nested]);

    return (
        <Box>
            <Link onMouseEnter={handleMouseEnter} to={to}>
                <NavbarButton
                    collapsed={collapsed}
                    onClick={handleExpandToggle}
                    sx={{
                        ...sx,
                        ...(current && {
                            background: themePalette.hover.lighter,
                            fontWeight: 500,
                        }),
                        ...((_nested || current) && {
                            color: 'white',
                        }),
                    }}
                    tooltipTitle={tooltipTitle}
                >
                    {icon && cloneElement(icon, {
                        sx: {
                            ...icon.props?.sx,
                            color: alpha(themePalette.text.lighter, 0.7),
                            ...((current || _nested) && {
                                fill: 'white',
                            }),
                        },
                    })}

                    {!collapsed && label}

                    {children.length > 0 && !collapsed && (
                        expanded
                            ? <ExpandLessIcon sx={{ ml: 'auto' }} />
                            : <ExpandMoreIcon sx={{ ml: 'auto' }} />
                    )}
                </NavbarButton>
            </Link>

            {children.length > 0 && !collapsed && (
                <Collapse in={expanded}>
                    {Children.map(children, (child) => {
                        return cloneElement(child, {
                            sx: {
                                ...child.props?.sx,
                                pl: 6.4,
                            },
                        });
                    })}
                </Collapse>
            )}
        </Box>
    );
}
