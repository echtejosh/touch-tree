import React, { ReactElement, useEffect, useState } from 'react';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import GetEditorColorsUseCase from 'application/usecases/newsstand/editor/GetEditorColorsUseCase';
import Column from 'presentation/components/layout/Column';
import ColorSelect from 'presentation/components/form/ColorSelect';
import { editorColorsPalette, themePalette } from 'presentation/theme';
import { EditorColorsModel } from 'domain/models/newsstand/NewsstandModel';
import { Box, Row } from 'presentation/components/layout';
import { Button, IconButton, Typography } from '@mui/material';
import BackButton from 'presentation/components/navigation/BackButton';
import UpdateEditorColorsUseCase from 'application/usecases/newsstand/editor/UpdateEditorColorsUseCase';
import EditorSidebarDropdown from 'presentation/components/editor/EditorSidebarDropdown';
import { UnfoldLessIcon, UnfoldMoreIcon } from 'presentation/components/icons';
import { useSearchParams } from 'react-router-dom';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import { FormattedMessage } from 'react-intl';
import { SubmitButton } from 'presentation/components';
import RestoreDefaultColorsModal from 'presentation/modals/newsstand/editor/colors/RestoreDefaultColorsModal';
import useDialog from 'presentation/hooks/useDialog';

export default function EditorColorsTab(): ReactElement {
    const getEditorColorsUseCase = Container.resolve(GetEditorColorsUseCase);
    const updateEditorColorsUseCase = Container.resolve(UpdateEditorColorsUseCase);

    const [searchParams] = useSearchParams();

    const [dropdownToggle, setDropdownToggle] = useState(true);

    const { data: editorColors } = useQuery(getEditorColorsUseCase.handle, [GetEditorColorsUseCase.name]);

    const selectedSection = searchParams.get('s');

    const { openDialog } = useDialog();

    const {
        reset,
        setValues,
        handleSubmit,
        control,
    } = useForm<EditorColorsModel>({ defaultValues: { ...editorColors } });

    function toggleDropdown(): void {
        setDropdownToggle((prev) => !prev);
    }

    async function onSubmit(values: EditorColorsModel): Promise<boolean> {
        const result = await updateEditorColorsUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetEditorColorsUseCase.name]);
            useInvalidateQuery([GetMetricsUseCase.name]);
        }

        return result;
    }

    function restoreDefaultColors(): void {
        openDialog((props): ReactElement => (
            <RestoreDefaultColorsModal
                onRestore={(defaultColors) => {
                    reset(defaultColors);
                    onSubmit(defaultColors);
                }}
                {...props}
            />
        ));
    }

    useEffect(() => {
        if (selectedSection) {
            const targetElement = document.getElementById(`${selectedSection}-dropdown`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [selectedSection]);

    useEffect(() => {
        if (editorColors) {
            reset(editorColors);
        }
    }, [editorColors]);

    return (
        <Column gap={0}>
            {/*
              <Column gap={0}> is required here to handle cases where the children's
              width exceeds the viewport width. It also ensures proper scroll behavior for overflow content.
              Do not remove or modify unless absolutely necessary.
            */}
            <Box p={4} width={560}>
                <Typography
                    mb={2}
                    variant='h2'
                >
                    Colours
                </Typography>

                <Row
                    gap={0}
                    sx={{
                        position: 'relative',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <BackButton label='Categories' to='/newsstand/editor' />

                    <Row
                        gap={2}
                    >
                        <IconButton
                            onClick={toggleDropdown}
                            sx={{
                                color: themePalette.text.main,
                            }}
                        >
                            {dropdownToggle ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                        </IconButton>

                        <SubmitButton
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            size='large'
                        >
                            <FormattedMessage
                                defaultMessage='Save changes'
                                id='button.save'
                            />
                        </SubmitButton>
                    </Row>
                </Row>
            </Box>

            <Column
                gap={0}
                sx={{ overflowY: 'auto' }}
            >
                <EditorSidebarDropdown
                    id='page-dropdown'
                    label='Global'
                    open={dropdownToggle}
                    sx={{
                        ...selectedSection === 'global' && {
                            borderLeft: `2px solid ${themePalette.tertiary.main}`,
                        },
                    }}
                >
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.page.background}
                        label='Background'
                        name='pageBackgroundColor'
                        onBlur={({ target }): void => setValues({ pageBackgroundColor: target.value })}
                    />

                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.page.font}
                        label='Font'
                        name='pageFontColor'
                        onBlur={({ target }): void => setValues({ pageFontColor: target.value })}
                    />

                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.page.highlight}
                        helperText='Represents links, text highlighting, and page redirections'
                        label='Highlight'
                        name='pageHighlightColor'
                        onBlur={({ target }): void => setValues({ pageHighlightColor: target.value })}
                    />
                </EditorSidebarDropdown>

                <EditorSidebarDropdown
                    id='topbar-dropdown'
                    label='Top bar'
                    open={dropdownToggle}
                    sx={{
                        ...selectedSection === 'topbar' && {
                            borderLeft: `2px solid ${themePalette.tertiary.main}`,
                        },
                    }}
                >
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.header.background}
                        label='Background'
                        name='headerBackgroundColor'
                        onBlur={({ target }) => setValues({ headerBackgroundColor: target.value })}
                    />
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.header.font}
                        label='Font'
                        name='headerFontColor'
                        onBlur={({ target }) => setValues({ headerFontColor: target.value })}
                    />
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.separator}
                        label='Border'
                        name='separatorColor'
                        onBlur={({ target }) => setValues({ separatorColor: target.value })}
                    />
                </EditorSidebarDropdown>

                <EditorSidebarDropdown
                    id='navbar-dropdown'
                    label='Bottom bar'
                    open={dropdownToggle}
                    sx={{
                        border: '2px transparent',
                        ...selectedSection === 'bottom-bar' && {
                            borderLeft: `2px solid ${themePalette.tertiary.main}`,
                        },
                    }}
                >
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.footer.background}
                        label='Background'
                        name='footerBackgroundColor'
                        onBlur={({ target }) => setValues({ footerBackgroundColor: target.value })}
                    />
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.footer.font}
                        label='Font'
                        name='footerFontColor'
                        onBlur={({ target }) => setValues({ footerFontColor: target.value })}
                    />
                </EditorSidebarDropdown>

                <EditorSidebarDropdown label='Container' open={dropdownToggle}>
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.card.background}
                        label='Background'
                        name='cardBackgroundColor'
                        onBlur={({ target }) => setValues({ cardBackgroundColor: target.value })}
                    />
                    <ColorSelect
                        control={control}
                        defaultColor={editorColorsPalette.card.font}
                        label='Font'
                        name='cardFontColor'
                        onBlur={({ target }) => setValues({ cardFontColor: target.value })}
                    />
                </EditorSidebarDropdown>

                <Row justifyContent='center' p={4} width='100%'>
                    <Button
                        onClick={restoreDefaultColors}
                        variant='outlined'
                    >
                        <FormattedMessage
                            defaultMessage='Restore default colours'
                            id='button.restore-default-colors'
                        />
                    </Button>
                </Row>
            </Column>
        </Column>
    );
}
