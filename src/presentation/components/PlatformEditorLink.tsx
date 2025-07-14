import { Link } from 'react-router-dom';
import React from 'react';
import PlatformEditorButton, { PlatformEditorButtonProps } from 'presentation/components/PlatformEditorButton';

export interface PlatformEditorLinkProps extends PlatformEditorButtonProps {
    to: string;
    children?: React.ReactNode;
}

export default function PlatformEditorLink({
    to,
    label,
    icon,
    children,
    ...props
}: PlatformEditorLinkProps) {
    return (
        <Link style={{ position: 'relative' }} to={to}>
            <PlatformEditorButton icon={icon} label={label} {...props} />
            {children}
        </Link>
    );
}
