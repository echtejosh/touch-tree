import React, { ReactNode, useEffect } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import {
    RichTextEditorProvider,
    RichTextField,
    LinkBubbleMenu,
    LinkBubbleMenuHandler,
} from 'mui-tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { themePalette } from 'presentation/theme';
import PublicationPageEditorMenuControls from 'presentation/components/editor/PublicationPageEditor/PublicationPageEditorMenuControls';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Heading } from '@tiptap/extension-heading';
import { Paragraph } from '@tiptap/extension-paragraph';
import tiptap from 'utils/tiptap';
import { DivNode } from 'presentation/components/editor/PublicationPageEditor/DivNode';

const extendedExtensions = [
    Heading,
    Link,
    Paragraph,
    DivNode,
    Image.configure({
        HTMLAttributes: {
            style: 'max-width: 100%;',
        },
        allowBase64: true,
    }),
].map(tiptap.addAttributes);

interface TextEditorProps {
    value?: string | null;
    sx?: SxProps<Theme>;
    footer?: ReactNode;
    onChange: (value: string) => void;
    image: string;
}

export default function PublicationPageEditor({ value = '', onChange, sx, footer, image }: TextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            LinkBubbleMenuHandler,
            Underline,
            ...extendedExtensions,
        ],
        content: value,
        onUpdate: ({ editor: _editor }) => {
            onChange(_editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor) {
            queueMicrotask(() => {
                editor.commands.setContent(value);
            });
        }
    }, [editor, value]);

    return (
        <Box
            sx={{
                '& .ProseMirror': {
                    height: 545,
                    overflowY: 'auto',
                },
                '& .ProseMirror p ': {
                    marginBottom: '15px !important',
                },
                '& .ProseMirror h1, h2, h3': {
                    marginBottom: '20px !important',
                },
                '& .ProseMirror img': {
                    marginBottom: '5px !important',
                },
                '& .MuiTiptap-FieldContainer-notchedOutline': {
                    border: 'none',
                },
                '& .MuiTiptap-RichTextField-menuBar': {
                    borderBottomColor: themePalette.border.main,
                },
                ...sx,
            }}
        >
            <RichTextEditorProvider editor={editor}>
                <RichTextField
                    controls={<PublicationPageEditorMenuControls editor={editor} image={image} />}
                    footer={(
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                py: 1,
                                px: 1.5,
                                borderTop: `1px solid ${themePalette.border.main}`,
                            }}
                        >
                            {footer}
                        </Box>
                    )}
                />
                <LinkBubbleMenu labels={{ editLinkAddTitle: 'Insert link' }} />
            </RichTextEditorProvider>
        </Box>
    );
}
