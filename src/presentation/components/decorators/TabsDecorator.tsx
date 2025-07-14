import React, { ReactElement, ReactNode, useState } from 'react';
import { Box, Tabs, Tab, Grid } from '@mui/material';
import { themePalette } from 'presentation/theme';

interface TabsDecoratorProps {
    pages: Array<{
        name: string;
        component: ReactNode;
    }>;
}

export default function TabsDecorator({ pages }: TabsDecoratorProps): ReactElement {
    const [current, setCurrent] = useState(0);

    return (
        <Grid>
            <Box>
                <Tabs
                    onChange={(_, index) => setCurrent((index))}
                    sx={{
                        '.MuiTabs-flexContainer': {
                            gap: 2,
                            borderBottom: 1,
                            borderColor: themePalette.border.main,
                            height: 55,
                        },
                    }}
                    value={current}
                >
                    {pages.map((page, index) => (
                        <Tab
                            key={page.name}
                            label={page.name}
                            sx={{
                                minWidth: 'fit-content',
                                px: 1,
                                borderRadius: 1,
                                fontSize: 16,
                                color: themePalette.text.main,
                            }}
                            value={index}
                        />
                    ))}
                </Tabs>
            </Box>

            {pages.map((page, index) => (
                <Box
                    key={page.name}
                    hidden={current !== index}
                    mt={4}
                >
                    {current === index && (
                        <Box>{page.component}</Box>
                    )}
                </Box>
            ))}
        </Grid>
    );
}
