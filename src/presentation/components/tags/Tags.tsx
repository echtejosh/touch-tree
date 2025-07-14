import React, { Children, PropsWithChildren, ReactElement, useState, isValidElement, cloneElement } from 'react';
import { Box, Typography } from '@mui/material';
import { TagProps } from 'presentation/components/tags/Tag';
import str from 'utils/str';

/**
 *
 */
interface TagsProps extends PropsWithChildren {
    /**
     *
     */
    onExpand?: () => void;

    /**
     *
     */
    truncate?: number;
}

/**
 *
 * @constructor
 */
export default function Tags({
    children,
    onExpand,
    truncate = 10,
}: TagsProps): ReactElement {
    const [expanded, setExpanded] = useState<boolean>(false);

    const _children = Children.toArray(children);

    if (_children.length <= 2 || expanded) {
        return (
            <Box
                display='flex'
                gap={0.75}
                sx={{
                    height: '100%',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                {_children}
            </Box>
        );
    }

    const tags = _children.slice(0, 2).map((child) => {
        if (!isValidElement<TagProps>(child)) {
            return child;
        }

        return cloneElement(child, { label: str.truncate(child.props.label || String(), truncate) });
    });

    return (
        <Box
            display='flex'
            gap={0.75}
            sx={{
                height: '100%',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            {tags}

            <Box
                onClick={() => (onExpand ? onExpand() : setExpanded(true))}
                sx={{ cursor: 'pointer' }}
            >
                <Typography
                    fontWeight={500}
                    variant='body1'
                >
                    {`+${_children.length - 2}`}
                </Typography>
            </Box>
        </Box>
    );
}
