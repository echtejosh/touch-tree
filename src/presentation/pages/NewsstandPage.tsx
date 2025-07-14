import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

export default function NewsstandPage(): ReactElement {
    return (
        <Outlet />
    );
}
