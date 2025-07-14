// interface UpdateRectanglesPayload {
//     objCustomisation: {
//         rectangles: UpdatePodPayload[]
//     };
// }

// interface ImageLinkage {
//     imgSrc: string; /* Base64-encoded image source */
//     linkage: {
//         url: string | null;
//         articleId: number | null;
//         documentId: number | null;
//         page: number | null;
//     };
// }
//
// interface GetDigiCustomizationsResponse {
//     customData: {
//         colorMainBackground: string;
//         colorMainFont: string;
//         colorHeaderBackground: string;
//         colorFooterBackground: string;
//         colorHeaderFont: string;
//         colorFooterFont: string;
//         colorContainerFont: string;
//         colorContainerBackground: string;
//         colorHighlightBackground: string;
//         colorLineBackground: string;
//         logo: (ImageLinkage & { scale: number | null }) | null;
//         faviconSrc: string;
//         privatePdfBackgroundSrc: string;
//         webTitle: string | null;
//         hasRoundedEdges: boolean;
//         radiusPod: number;
//         radiusRectangle: number;
//         radiusMagazine: number;
//         radiusBanner: number;
//         radiusFooter: number;
//         radiusContainer: number;
//         banners: null;
//         pods: ImageLinkage[] | null;
//         rectangles: ImageLinkage[] | null;
//         video: null;
//     };
//     relationDetails: {
//         documentTitle: string | null;
//     }
// }

// alternative implementation
// const retrieveLinkageType = (linkage?: LinkageModel | null): LinkageType => {
//     if (!linkage) return null;
//
//     const linkageMap: Record<keyof LinkageModel, LinkageType> = {
//         url: 'url',
//         articleId: 'article',
//         documentId: 'document',
//     };
//
//     const foundKey = Object.keys(linkageMap).find((key) => linkage[key as keyof LinkageModel]);
//     return foundKey ? linkageMap[foundKey as keyof LinkageModel] : null;
// };
export default function EditorService() {
    return {
    };
}
