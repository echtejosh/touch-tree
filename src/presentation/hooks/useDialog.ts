import { useContext } from 'react';
import { DialogContext, DialogContextType } from 'presentation/providers/DialogProvider';

/**
 * Custom hook to access the DialogContext and provide dialog management functions.
 *
 * @returns The context containing functions to create, open, and close dialogs.
 */
export default function useDialog(): DialogContextType {
    return <DialogContextType>useContext(DialogContext);
}
