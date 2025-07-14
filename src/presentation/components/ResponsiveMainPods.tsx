import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Box, Column } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import GetEditorPodsUseCase from 'application/usecases/newsstand/editor/GetEditorPodsUseCase';
import { useQuery } from 'presentation/hooks';
import EditorTooltip from 'presentation/components/editor/EditorTooltip';
import { themePalette } from 'presentation/theme';
import { useNavigate } from 'react-router-dom';

interface ResponsiveMainPodsProps {
    breakpoint: string;
}

export default function ResponsiveMainPods({ breakpoint }: ResponsiveMainPodsProps) {
    const getEditorPodsUseCase = Container.resolve(GetEditorPodsUseCase);

    const navigate = useNavigate();
    const { data: pods } = useQuery(getEditorPodsUseCase.handle, [GetEditorPodsUseCase.name]);

    const podsData = pods?.map((_, index) => {
        return {
            id: index,
            title: `Pod ${index + 1}`,
        };
    }) || [];

    return (
        <Column
            columns={2}
            gap={4}
            sx={{
                ...breakpoint !== 'Phone' && {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                },
            }}
        >
            {podsData.map((pod) => (
                <EditorTooltip key={pod.id} label={pod.title}>
                    <Box
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate('/newsstand/editor/pods?s=pods');
                        }}
                        sx={{
                            width: breakpoint !== 'Phone' ? 207 : 'auto',
                            height: 200,

                            '&:hover': {
                                outline: 2,
                                zIndex: 4000,
                                outlineColor: themePalette.tertiary.main,
                                borderRadius: 1,
                                cursor: 'pointer',
                            },
                        }}
                    >
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant='h5'
                                >
                                    {pod.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </EditorTooltip>
            ))}
        </Column>
    );
}
