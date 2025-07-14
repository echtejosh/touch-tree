import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Box, Column } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import EditorTooltip from 'presentation/components/editor/EditorTooltip';
import { themePalette } from 'presentation/theme';
import GetEditorAdditionalPodsUseCase from 'application/usecases/newsstand/editor/GetEditorAdditionalPodsUseCase';
import { useNavigate } from 'react-router-dom';

interface ResponsiveAdditionalPodsProps {
    breakpoint: string;
}

export default function ResponsiveAdditionalPods({ breakpoint }: ResponsiveAdditionalPodsProps) {
    const getEditorAdditionalPodsUseCase = Container.resolve(GetEditorAdditionalPodsUseCase);

    const navigate = useNavigate();
    const { data: pods } = useQuery(getEditorAdditionalPodsUseCase.handle, [GetEditorAdditionalPodsUseCase.name]);

    const podsData = pods?.map((_, index) => {
        return {
            id: index,
            title: `Rectangle ${index + 1}`,
        };
    }) || [];

    return (
        <Column
            columns={2}
            gap={4}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',

                ...breakpoint !== 'Phone' && {
                    display: 'flex',
                    flexDirection: 'row',
                },
            }}
        >
            {podsData.map((pod) => (
                <EditorTooltip key={pod.id} label={pod.title}>
                    <Box
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate('/newsstand/editor/pods?s=rects');
                        }}
                        sx={{
                            width: breakpoint !== 'Phone' ? 445 : '100%',
                            height: breakpoint !== 'Phone' ? 200 : 100,

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
