import { getDomain } from 'tldts';
import touchtreeLogo from './logos/touchtree.svg';
import digimagsLogo from './logos/digimags.png';
import intermediaLogo from './logos/intermedia.png';
import mansonGroup from './logos/manson-group.png';
import tandemMedia from './logos/tandem-media.png';
import waitHub from './logos/wait-hub.png';
import sps from './logos/sps.webp';
import touchtreeFavicon from './favicons/touchtree.png';
import digimagsFavicon from './favicons/digimags.png';
import intermediaFavicon from './favicons/intermedia.png';
import mansonGroupFavicon from './favicons/manson-group.png';
import tandemGroupFavicon from './favicons/tandem-media.png';
import waitHubFavicon from './favicons/wait-hub.png';
import spsFavicon from './favicons/sps.webp';

export interface Theme {
    subset: boolean;
    theme: string;
    themeDark: string;
    database?: string;
    name: {
        content: string | null;
        fontFamily: string | null;
    };
    logo: {
        height: number;
        src: string;
    };
    favicon: string | null;
}

const themes = {
    'digi-mags.net': {
        subset: true,
        theme: 'rgb(230, 194, 105)',
        themeDark: 'rgb(38, 70, 83)',
        name: {
            content: null,
            fontFamily: null,
        },
        logo: {
            height: 70,
            src: digimagsLogo,
        },
        favicon: digimagsLogo,
    },
    'digi-hub.cloud': {
        subset: true,
        theme: 'rgb(230, 194, 105)',
        themeDark: 'rgb(38, 70, 83)',
        name: {
            content: null,
            fontFamily: null,
        },
        logo: {
            height: 70,
            src: digimagsLogo,
        },
        favicon: digimagsFavicon,
    },
    'inter-mediadigital.net': {
        subset: false,
        theme: 'rgb(230, 0, 126)',
        themeDark: 'rgb(0, 35, 92)',
        name: {
            content: null,
            fontFamily: null,
        },
        logo: {
            height: 60,
            src: intermediaLogo,
        },
        favicon: intermediaFavicon,
    },
    'mansongroup-digital.net': {
        subset: false,
        theme: 'rgb(197, 68, 59)',
        themeDark: 'rgb(14, 34, 51)',
        name: {
            content: null,
            fontFamily: null,
        },
        logo: {
            height: 60,
            src: mansonGroup,
        },
        favicon: mansonGroupFavicon,
    },
    'tandem-digital.com': {
        subset: false,
        theme: 'rgb(62, 186, 200)',
        themeDark: 'rgb(16, 16, 16)',
        name: {
            content: null,
            fontFamily: null,
        },
        logo: {
            height: 70,
            src: tandemMedia,
        },
        favicon: tandemGroupFavicon,
    },
    'wait-hub.net': {
        subset: true,
        theme: 'rgb(96, 153, 247)',
        themeDark: 'rgb(18, 31, 78)',
        database: 'dltuk',
        name: {
            content: null,
            fontFamily: null,
        },
        logo: {
            height: 40,
            src: waitHub,
        },
        favicon: waitHubFavicon,
    },
    'selectps-digital.co.uk': {
        subset: false,
        theme: 'rgb(59, 111, 118)',
        themeDark: 'rgb(88, 162, 171)',
        name: {
            content: null,
            fontFamily: null,
        },
        logo: {
            height: 70,
            src: sps,
        },
        favicon: spsFavicon,
    },
};

export function getCurrentTheme(): Theme {
    const domain = getDomain(window.location.href);

    if (domain && themes.hasOwnProperty(domain)) {
        return (themes as never)[domain] as Theme;
    }

    return import.meta.env.VITE_DIGI_MAGS === 'true' ? themes['digi-mags.net'] : {
        subset: false,
        theme: 'rgb(37, 188, 180)',
        themeDark: 'rgb(16,16,16)',
        name: {
            content: 'TouchTree',
            fontFamily: 'Corben',
        },
        logo: {
            height: 40,
            src: touchtreeLogo,
        },
        favicon: touchtreeFavicon,
    };
}
