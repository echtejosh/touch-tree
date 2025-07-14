import React, { ReactElement } from 'react';
import { ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import { AddImageIcon } from 'presentation/components/icons';
import { Editor } from '@tiptap/core';
import { MenuButtonImageUpload } from 'mui-tiptap';
import useDialog from 'presentation/hooks/useDialog';
import CreatePublicationPageImageModal from 'presentation/modals/publications/CreatePublicationPageImageModal';

export default function MenuButtonAddImage({ editor }: { editor: Editor | null }): ReactElement {
    const { createDialog } = useDialog();

    function openAddImageDialog(): void {
        createDialog((props) => <CreatePublicationPageImageModal editor={editor} publicationPageImage='' {...props} />)
            .open({
                maxWidth: 'lg',
            });
    }

    return (
        <IconButtonPaper icon={<AddImageIcon />}>
            <ButtonPaperItem
                label='Upload an image'
                onClick={() => {}}
            />
            <MenuButtonImageUpload
                onUploadFiles={(files) => files.map((file) => ({
                    src: URL.createObjectURL(file),
                    alt: file.name,
                }))}
            />
            <ButtonPaperItem
                label='Select from the page preview'
                onClick={openAddImageDialog}
            />
        </IconButtonPaper>
    );
}
