import React, { ReactElement } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import EditorPreviewCanvas from 'presentation/components/editor/EditorPreviewCanvas';
import { Outlet } from 'react-router-dom';
import Container from 'infrastructure/services/Container';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import { useQuery } from 'presentation/hooks';

export default function NewsstandEditorPage(): ReactElement {
    const getMetricsUseCase = Container.resolve(GetMetricsUseCase);

    const { data: metrics } = useQuery(getMetricsUseCase.handle, [GetMetricsUseCase.name]);

    return (
        <Column gap={0} height='100dvh'>
            <Row flex={1} gap={0}>
                <EditorPreviewCanvas src={`${metrics?.url}&isEditModeExternal=1`} />

                <Box display='flex' maxHeight='100dvh'>
                    <Outlet />
                </Box>
            </Row>
        </Column>
    );
}
