import React, { ReactElement, useEffect } from 'react';
import Container from 'infrastructure/services/Container';
import { useForm, useQuery } from 'presentation/hooks';
import Column from 'presentation/components/layout/Column';
import { EditorSidebarModel } from 'domain/models/newsstand/NewsstandModel';
import { Box } from 'presentation/components/layout';
import { Typography } from '@mui/material';
import BackButton from 'presentation/components/navigation/BackButton';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import useInteraction from 'presentation/hooks/useInteraction';
import GetEditorSidebarUseCase from 'application/usecases/newsstand/editor/GetEditorSidebarUseCase';
import UpdateEditorSidebarUseCase from 'application/usecases/newsstand/editor/UpdateEditorSidebarUseCase';
import { QueryClient } from '@tanstack/react-query';

export default function EditorSidebarTab(): ReactElement {
    const queryClient = Container.resolve(QueryClient);
    const getEditorSidebarUseCase = Container.resolve(GetEditorSidebarUseCase);
    const updateEditorSidebarUseCase = Container.resolve(UpdateEditorSidebarUseCase);

    const { data } = useQuery(getEditorSidebarUseCase.handle, [GetEditorSidebarUseCase.name]);
    const {
        reset,
        control,
    } = useForm<EditorSidebarModel>({ defaultValues: { ...data } });

    const {
        interaction,
        setInteraction,
    } = useInteraction();

    useEffect(() => {
        if (interaction) {
            const handleInteraction = async () => {
                const result = await updateEditorSidebarUseCase.handle({ [interaction.name]: interaction.value });
                if (result) {
                    await queryClient.invalidateQueries({ queryKey: [GetEditorSidebarUseCase.name] });
                }
            };
            handleInteraction();
            console.log(interaction);
        }
    }, [interaction]);

    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data]);

    return (
        <Box m={4}>
            <Box mb={4} width={290}>
                <Typography
                    mb={2}
                    variant='h2'
                >
                    Sidebar
                </Typography>

                <BackButton label='Categories' />
            </Box>

            <Column gap={4}>
                <FormTextField
                    control={control}
                    label='Title'
                    name='title'
                    onBlur={({ target }) => setInteraction({ name: 'title', value: target.value })}
                />
                <FileSelect
                    accepts={['.jpg', '.png', '.jpeg']}
                    control={control}
                    description='.jpg .jpeg or .png'
                    label='Banner'
                    name='sidebarBackgroundImg'
                    onChange={(file): void => setInteraction({
                        name: 'sidebarBackgroundImg',
                        value: file ? file.content : null,
                    })}
                    placeholder='Choose an image (max. 5 MB)'
                />

            </Column>
        </Box>
    );
}
