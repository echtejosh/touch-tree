import { useEffect } from 'react';
import touchtreeFavicon from 'presentation/themes/favicons/touchtree.png';

export function useFavicon(faviconBase64: string | null) {
    useEffect(() => {
        const link: HTMLLinkElement = document.querySelector('link[rel*=\'icon\']')
            || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = faviconBase64 || touchtreeFavicon;
        document.head.appendChild(link);
    }, [faviconBase64]);
}
