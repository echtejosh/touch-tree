import { useContext } from 'react';
import { NavbarExpansionContext, NavbarExpansionContextType } from 'presentation/providers/NavbarExpansionProvider';

export function useNavbarExpansionContext(): NavbarExpansionContextType {
    const context = useContext(NavbarExpansionContext);
    if (!context) {
        throw new Error('useNavbarExpansionContext must be used within a NavbarExpansionProvider');
    }
    return context;
}
