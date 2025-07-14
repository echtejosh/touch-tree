import React, {
    createContext,
    useState,
    useMemo,
    ReactElement,
    PropsWithChildren,
} from 'react';
import { Dialog, DialogProps, IconButton, ModalOwnProps } from '@mui/material';
import { themePalette } from 'presentation/theme';
import { CloseIcon } from 'presentation/components/icons';

/**
 * Enum for dialog display types.
 */
export const DialogType = {
    Centered: 0,
    Right: 1,
} as const;

/**
 * Type for dialog display positions.
 */
export type DialogTypes = typeof DialogType[keyof typeof DialogType];

/**
 * Structure of a dialog entry.
 */
export interface DialogEntry<T> {
    /**
     * Component to be rendered in the dialog.
     */
    component: (props: T & DialogOptions) => ReactElement;

    /**
     * Properties for the dialog component.
     */
    props: ModalOwnProps;

    /**
     * Position type of the dialog.
     */
    type: DialogTypes;

    /**
     * Unique identifier for the dialog.
     */
    id: number;
}

/**
 * Shape of a dialog object, allowing open and close functionality.
 */
export interface DialogShape {
    /**
     * Opens the dialog with optional properties.
     *
     * @param props Optional properties for the dialog.
     */
    open(props?: Partial<DialogProps>): void;

    /**
     * Closes the dialog.
     */
    close(): void;
}

/**
 * Dialog options.
 */
export interface DialogOptions {
    onClose(): Promise<void> | void;
}

/**
 * Context type for dialog management, including creation and opening.
 */
export interface DialogContextType {
    /**
     * Creates a dialog and returns its control functions.
     *
     * @param component Component to render in the dialog.
     * @param type Optional type for dialog position.
     */
    createDialog<T>(component: (props: T & DialogOptions) => ReactElement, type?: DialogTypes): DialogShape;

    /**
     * Opens a dialog directly with a specified component and type.
     *
     * @param component Component to render in the dialog.
     * @param type Optional type for dialog position.
     */
    openDialog<T>(component: (props: T & DialogOptions) => ReactElement, type?: DialogTypes): void;
}

/**
 * Context instance for dialog management.
 */
export const DialogContext = createContext<DialogContextType | null>(null);

/**
 * DialogProvider component to manage and display dialogs within its context.
 *
 * @param children React children to render within the provider.
 */
export function DialogProvider({ children }: PropsWithChildren): ReactElement {
    const [dialogs, setDialogs] = useState<DialogEntry<unknown>[]>([]);

    /**
     * Handles dialog close by removing it from state.
     *
     * @param id Identifier of the dialog to close.
     */
    function _onClose(id: number): void {
        setDialogs((prev): DialogEntry<unknown>[] => prev.filter((d): boolean => d.id !== id));
    }

    function createDialog<T>(
        component: (props: T & DialogOptions) => ReactElement,
        type: DialogTypes = DialogType.Centered,
    ): DialogShape {
        const id = new Date().getTime();

        /**
         * Opens the dialog with optional updated properties.
         *
         * @param props Properties to set for the dialog.
         */
        function open(props: Partial<DialogProps> = {}): void {
            setDialogs((prev): DialogEntry<unknown>[] => {
                const found = prev.find((d): boolean => d.id === id);

                const _props = {
                    ...found?.props,
                    ...props,
                    open: true,
                };

                if (found) {
                    return prev.map((item): DialogEntry<unknown> => {
                        const updated = item.id === id ? {
                            ...item,
                            props: _props,
                        } : item;

                        return updated as DialogEntry<unknown>;
                    });
                }

                return [
                    ...prev,
                    {
                        component,
                        type,
                        props: _props,
                        id,
                    },
                ] as DialogEntry<unknown>[];
            });
        }

        /**
         * Closes the dialog.
         */
        function close(): void {
            _onClose(id);
        }

        return {
            open,
            close,
        };
    }

    /**
     * Instantly opens a new dialog with a specified component and type.
     *
     * @param component Component to render in the dialog.
     * @param type Type of dialog positioning.
     */
    function openDialog<T>(
        component: (props: T & DialogOptions) => ReactElement,
        type: DialogTypes = DialogType.Centered,
    ): void {
        createDialog(component, type).open();
    }

    const values = useMemo(
        (): DialogContextType => ({
            createDialog,
            openDialog,
        }),
        [dialogs],
    );

    return (
        <DialogContext.Provider value={values}>
            {children}

            {dialogs.map(({
                component,
                props,
                type,
                id,
            }): ReactElement => (
                <Dialog
                    {...props}
                    key={id}
                    disableEnforceFocus
                    fullWidth
                    onClose={(): void => _onClose(id)}
                    PaperProps={{
                        sx: {
                            borderRadius: 1,
                            boxShadow: 'none',

                            ...type === DialogType.Right && {
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                margin: 0,
                            },
                        },
                    }}
                    sx={{
                        ...props.sx,
                    }}
                >
                    <IconButton
                        onClick={() => _onClose(id)}
                        sx={{
                            position: 'absolute',
                            right: 18,
                            top: 18,
                            color: themePalette.text.light,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {component({
                        onClose: (): void => _onClose(id),
                    } as DialogOptions)}
                </Dialog>
            ))}
        </DialogContext.Provider>
    );
}
