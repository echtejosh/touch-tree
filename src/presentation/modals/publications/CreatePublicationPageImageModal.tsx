import React, { ReactElement, useMemo } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import { useForm } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { Editor } from '@tiptap/core';
import { useWatch } from 'react-hook-form-mui';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import PublicationPageImageEditor from 'presentation/components/editor/PublicationPageEditor/PublicationPageImageEditor';

const IMAGE_EDITOR_CONFIG = {
    maxZoom: parseFloat(import.meta.env.VITE_MAX_ZOOM || '3'),
    minZoom: parseFloat(import.meta.env.VITE_MIN_ZOOM || '0.1'),
    maxImageWidth: 500,
    maxImageHeight: 600,
};

export interface CreatePublicationPageImageModalProps extends DialogOptions {
    publicationPageImage: string;
    editor: Editor | null
}

/**
 *
 * @constructor
 */
export default function CreatePublicationPageImageModal({ publicationPageImage, editor, onClose }: CreatePublicationPageImageModalProps): ReactElement {
    const {
        control,
        setValues,
    } = useForm<{ croppedImage: string | null, uploadedImage: FileShape | null }>();

    const { croppedImage, uploadedImage } = useWatch({ control });

    const getImageSource = useMemo(() => {
        return croppedImage || uploadedImage?.content || publicationPageImage;
    }, [croppedImage, publicationPageImage, uploadedImage]);

    /**
     *
     */
    function onAdd(): void {
        editor?.chain().focus().setImage({ src: getImageSource || String() }).run();
        onClose();
    }

    return (
        <Box>
            <Column columns={2} gap={0} height={600}>
                <PublicationPageImageEditor
                    config={IMAGE_EDITOR_CONFIG}
                    image={getImageSource || null}
                    imageScale={0.75}
                    isEditable
                    onSave={(img) => setValues({ croppedImage: img })}
                />

                <Column gap={5} p={4}>
                    <Column gap={0}>
                        <Typography
                            gutterBottom
                            sx={{
                                width: 'calc(100% - 80px)',
                            }}
                            variant='h2'
                        >
                            Crop image
                        </Typography>

                        <Typography>
                            Click and drag on the image to select a section of the image
                        </Typography>
                    </Column>

                    <Column flex={1}>
                        <FileSelect
                            accepts={['.jpg', '.png', '.jpeg']}
                            control={control}
                            description='.jpg .jpeg or .png'
                            label='Image'
                            name='uploadedImage'
                            onChange={(imgFile) => setValues({ uploadedImage: imgFile, croppedImage: null })}
                            placeholder='Choose a file (max. 5 MB)'
                            required={false}
                            requireJpegConversion
                        />

                        <Row end gap={2}>
                            <Button
                                onClick={onClose}
                                size='large'
                                variant='outlined'
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={onAdd}
                                size='large'
                                type='submit'
                                variant='contained'
                            >
                                Add
                            </Button>
                        </Row>
                    </Column>
                </Column>
            </Column>
        </Box>
    );
}
