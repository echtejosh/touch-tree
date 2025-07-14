import React from 'react';
import {
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonIndent,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonRedo,
    MenuButtonRemoveFormatting,
    MenuButtonUndo,
    MenuButtonUnindent,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    isTouchDevice,
} from 'mui-tiptap';
import { useIntl } from 'react-intl';

export default function TextEditorMenuControls() {
    const { formatMessage } = useIntl();

    return (
        <MenuControlsContainer>
            <MenuSelectHeading
                aria-label='check'
                labels={{
                    paragraph: formatMessage({
                        defaultMessage: 'Paragraph',
                        id: 'editor.menu.select-heading.paragraph.label',
                    }),
                    heading1: formatMessage({
                        defaultMessage: 'Heading 1',
                        id: 'editor.menu.select-heading.heading1.label',
                    }),
                    heading2: formatMessage({
                        defaultMessage: 'Heading 2',
                        id: 'editor.menu.select-heading.heading2.label',
                    }),
                    heading3: formatMessage({
                        defaultMessage: 'Heading 3',
                        id: 'editor.menu.select-heading.heading3.label',
                    }),
                    heading4: formatMessage({
                        defaultMessage: 'Heading 4',
                        id: 'editor.menu.select-heading.heading4.label',
                    }),
                    heading5: formatMessage({
                        defaultMessage: 'Heading 5',
                        id: 'editor.menu.select-heading.heading5.label',
                    }),
                    heading6: formatMessage({
                        defaultMessage: 'Heading 6',
                        id: 'editor.menu.select-heading.heading6.label',
                    }),
                }}
                tooltipTitle={formatMessage({
                    defaultMessage: 'Change heading type',
                    id: 'editor.menu.tooltip.heading.change-type',
                })}
            />

            <MenuDivider />

            <MenuButtonBold
                tooltipLabel={formatMessage({
                    defaultMessage: 'Bold',
                    id: 'editor.menu.tooltip.bold.label',
                })}
            />
            <MenuButtonItalic
                tooltipLabel={formatMessage({
                    defaultMessage: 'Italic',
                    id: 'editor.menu.tooltip.italic.label',
                })}
            />

            <MenuDivider />

            <MenuButtonBulletedList
                tooltipLabel={formatMessage({
                    defaultMessage: 'Bulleted List',
                    id: 'editor.menu.tooltip.bulleted-list.label',
                })}
            />
            <MenuButtonOrderedList
                tooltipLabel={formatMessage({
                    defaultMessage: 'Ordered List',
                    id: 'editor.menu.tooltip.ordered-list.label',
                })}
            />

            {isTouchDevice() && (
                <>
                    <MenuButtonIndent
                        tooltipLabel={formatMessage({
                            defaultMessage: 'Indent',
                            id: 'editor.menu.tooltip.indent.label',
                        })}
                    />
                    <MenuButtonUnindent
                        tooltipLabel={formatMessage({
                            defaultMessage: 'Unindent',
                            id: 'editor.menu.tooltip.unindent.label',
                        })}
                    />
                </>
            )}

            <MenuDivider />

            <MenuButtonRemoveFormatting
                tooltipLabel={formatMessage({
                    defaultMessage: 'Remove inline formatting',
                    id: 'editor.menu.tooltip.remove-formatting.label',
                })}
            />

            <MenuDivider />

            <MenuButtonUndo
                tooltipLabel={formatMessage({
                    defaultMessage: 'Undo',
                    id: 'editor.menu.tooltip.undo.label',
                })}
            />
            <MenuButtonRedo
                tooltipLabel={formatMessage({
                    defaultMessage: 'Redo',
                    id: 'editor.menu.tooltip.redo.label',
                })}
            />
        </MenuControlsContainer>
    );
}
