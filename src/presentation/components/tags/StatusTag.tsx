import React, { ReactElement } from 'react';
import { CircleIcon } from 'presentation/components/icons';
import { Theme } from '@mui/material';
import { SystemCssProperties } from '@mui/system/styleFunctionSx/styleFunctionSx';
import str from 'utils/str';
import Tag, { TagProps } from './Tag';
import { Override } from '../../../shared/types';

interface StatusTagProps {
    status: string;
    label?: string;
    sx?: SystemCssProperties<Theme>;
}

export default function StatusTag({
    status,
    label,
    sx,
}: Override<TagProps, StatusTagProps>): ReactElement {
    return (
        <Tag
            icon={(
                <CircleIcon
                    sx={{
                        fontSize: 8,
                        color: {
                            locked: 'rgb(62,125,255)',
                            draft: '#dcdcdc',
                            expired: 'rgb(253,46,80)',
                            live: 'rgb(47,162,56)',
                        }[status],
                    }}
                />
            )}
            label={label ?? str.capitalize(status)}
            sx={{
                ...sx,
            }}
        />
    );
}
