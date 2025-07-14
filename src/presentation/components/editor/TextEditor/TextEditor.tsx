import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import {
    RichTextEditor,
    LinkBubbleMenu,
    LinkBubbleMenuHandler,
    RichTextEditorRef,
} from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { themePalette } from 'presentation/theme';
import TextEditorMenuControls from './TextEditorMenuControls';

interface TextEditorProps {
    value?: string | null;
    onChange: (value: string) => void;
    sx?: SxProps<Theme>;
    footer?: ReactNode;
}

export default function TextEditor({ value = String(), onChange, sx, footer }: TextEditorProps) {
    const rteRef = useRef<RichTextEditorRef>(null);
    const editor = useMemo(() => rteRef.current?.editor, [rteRef.current]);

    const onEditorBlur = () => {
        if (editor && editor.getText()) {
            onChange(editor.getHTML());
        }
    };

    useEffect(() => {
        if (editor) {
            queueMicrotask(() => {
                editor.chain().setContent(value).run();
            });
        }
    }, [editor, value]);

    return (
        <Box
            onBlur={onEditorBlur}
            sx={{
                '& .ProseMirror': {
                    height: 200,
                    overflowY: 'auto',
                },
                '& .MuiTiptap-FieldContainer-notchedOutline': {
                    borderColor: themePalette.border.main,
                },
                '& .MuiTiptap-RichTextField-menuBar': {
                    borderBottomColor: themePalette.border.main,
                },
                ...sx,
            }}
        >
            <RichTextEditor
                ref={rteRef}
                content={value}
                extensions={[StarterKit, LinkBubbleMenuHandler, Link]}
                renderControls={() => <TextEditorMenuControls />}
                RichTextFieldProps={{
                    footer: footer && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                py: 1,
                                px: 1.5,
                                borderTop: `1px solid ${themePalette.border.main}`,
                            }}
                        >
                            {footer}
                        </Box>
                    ),
                }}
            >
                {() => (
                    <LinkBubbleMenu labels={{ editLinkAddTitle: 'Insert link' }} />
                )}
            </RichTextEditor>
        </Box>
    );
}
