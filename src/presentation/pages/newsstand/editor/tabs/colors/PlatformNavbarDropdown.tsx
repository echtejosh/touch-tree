import React, { useEffect } from 'react';
import { useInvalidateQuery, useQuery } from 'presentation/hooks';
import { useForm } from 'react-hook-form';
import ColorSelect from 'presentation/components/form/ColorSelect';
import EditorSidebarDropdown from 'presentation/components/editor/EditorSidebarDropdown';
import { editorColorsPalette } from 'presentation/theme';
import Container from 'infrastructure/services/Container';
import GetEditorColorsUseCase from 'application/usecases/newsstand/editor/GetEditorColorsUseCase';
import UpdateEditorColorsUseCase from 'application/usecases/newsstand/editor/UpdateEditorColorsUseCase';
import useInteraction from 'presentation/hooks/useInteraction';
import { EditorColorsModel } from 'domain/models/newsstand/NewsstandModel';

export default function PlatformNavbarDropdown({ open }: { open: boolean }) {
    const getEditorColorsUseCase = Container.resolve(GetEditorColorsUseCase);
    const updateEditorColors = Container.resolve(UpdateEditorColorsUseCase);

    const { data: editorColors } = useQuery(getEditorColorsUseCase.handle, [GetEditorColorsUseCase.name]);

    const { reset, control } = useForm<EditorColorsModel>({ defaultValues: { ...editorColors } });

    const { setInteraction } = useInteraction(updateEditorColors.handle, () => {
        useInvalidateQuery([GetEditorColorsUseCase.name]);
    });

    useEffect(() => {
        if (editorColors) {
            reset(editorColors);
        }
    }, [editorColors]);

    return (
        <EditorSidebarDropdown label='Navbar' open={open}>
            <ColorSelect
                control={control}
                defaultColor={editorColorsPalette.footer.background}
                label='Background'
                name='footerBackgroundColor'
                onBlur={(e) => setInteraction({ name: 'footerBackgroundColor', value: e.target.value })}
            />
            <ColorSelect
                control={control}
                defaultColor={editorColorsPalette.footer.font}
                label='Font'
                name='footerFontColor'
                onBlur={(e) => setInteraction({ name: 'footerFontColor', value: e.target.value })}
            />
        </EditorSidebarDropdown>
    );
}
