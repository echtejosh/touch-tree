import { Endpoints } from 'infrastructure/services/types';

const env = import.meta.env.VITE_ENV;

export default {
    login: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=login`,
        token: false,
    },
    resetPassword: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=resetPassword`,
        token: false,
    },
    getAccount: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=relation`,
    },
    updateAccount: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=relation`,
    },
    updateContact: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=contact`,
    },
    getMetrics: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=dashboard`,
    },
    getVisitorsStatistics: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiStatisticsVisitors`,
    },
    getPublicationsStatistics: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiStatisticsPageViews`,
    },
    getAdvertsStatistics: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiStatisticsClicks`,
    },
    getHighlights: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanners&isHighlight=true`,
    },
    getHighlight: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner&isHighlight=true`,
    },
    updateHighlight: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner`,
    },
    createHighlight: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner`,
    },
    deleteHighlight: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner`,
    },
    getAdverts: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanners&isHighlight=false`,
    },
    getAdvert: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner&isHighlight=false`,
    },
    updateAdvert: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner`,
    },
    createAdvert: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner`,
    },
    deleteAdvert: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=digiBanner`,
    },
    getNewsstandSettings: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiDepartment`,
    },
    updateNewsstandSettings: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiDepartment`,
    },
    getNewsstandCustom: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiPlatformCustomisation`,
    },
    createNewsstandCustomInit: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiPlatformCustomisationInitProperty`,
    },
    updateNewsstandCustomPut: {
        method: 'PUT',
        to: `https://yescrm.com/${env}/api/index.php?action=digiPlatformCustomisation`,
    },
    updateNewsstandCustom: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiPlatformCustomisation`,
    },
    updateNewsstandCustomId: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiPlatformCustomisationId`,
    },
    getMedia: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationBlocklist`,
    },
    getMediaItem: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiLockedArticle`,
    },
    updateMedia: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationBlockstatus`,
    },
    getCampaign: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiCampaign`,
    },
    getCampaigns: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiCampaigns`,
    },
    updateCampaign: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=campaign`,
    },
    createCampaign: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=campaign`,
    },
    duplicateCampaign: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=duplicateCampaign`,
    },
    getIpAddresses: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignIpAddresses`,
    },
    getIpAddress: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignIpAddress`,
    },
    updateIpAddress: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignIpAddress`,
    },
    createIpAddress: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignIpAddress`,
    },
    deleteIpAddress: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignIpAddress`,
    },
    getRelationIpAddresses: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=relationIpAddresses`,
    },
    getRelationIpAddress: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=relationIpAddress`,
    },
    updateRelationIpAddress: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationIpAddress`,
    },
    createRelationIpAddress: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationIpAddress`,
    },
    deleteRelationIpAddress: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationIpAddress`,
    },
    getArticlePublications: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=articlePublications`,
    },
    getPublicationArticles: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationArticles`,
    },
    getPublicationInteractions: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationInteractions`,
    },
    getPublicationInteraction: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationInteraction`,
    },
    createPublicationInteraction: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationInteraction`,
    },
    updatePublicationInteraction: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationInteraction`,
    },
    deletePublicationInteraction: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationInteraction`,
    },
    getPublications: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=publications`,
    },
    getPublicationArticle: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationArticle`,
    },
    getPublicationPages: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationPages`,
    },
    getCampaignsStatistics: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiStatisticsCampaigns`,
    },
    getArticle: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiArticle`,
    },
    updateArticle: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiArticle`,
    },
    updatePublicationPage: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationHtml`,
    },
    updatePublicationArticle: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=article`,
    },
    getSupplements: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=privatePublications`,
    },
    downloadEmailsAccessData: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=downloadDepartmentEmails`,
    },
    downloadDepartmentRegistrants: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=downloadDepartmentRegistrants`,
    },
    uploadEmailsAccessData: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=uploadDepartmentEmails`,
    },
    getTokenTypes: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiTokenTypes`,
    },
    getCoordinates: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignCoordinates`,
    },
    getCoordinate: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignCoordinate`,
    },
    createCoordinate: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignCoordinate`,
    },
    updateCoordinate: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignCoordinate`,
    },
    deleteCoordinate: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=campaignCoordinate`,
    },
    getRelationCoordinates: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=relationCoordinates`,
    },
    getRelationCoordinate: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=relationCoordinate`,
    },
    createRelationCoordinate: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=relationCoordinate`,
    },
    updateRelationCoordinate: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=relationCoordinate`,
    },
    deleteRelationCoordinate: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=relationCoordinate`,
    },
    createSupplement: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationPrivateDocument`,
    },
    updateSupplement: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationPrivateDocument`,
    },
    createSupplementCategory: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationPrivateDocumentCategory`,
    },
    deleteSupplementCategory: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationPrivateDocumentCategory`,
    },
    updateSupplementCategory: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiRelationPrivateDocumentCategory`,
    },
    getStatistics: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiStatistics`,
    },
    getGame: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiGame`,
    },
    getGames: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiGames`,
    },
    updateGame: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=gameBlockstatus`,
    },
    getPodcasts: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=podcasts`,
    },
    getPodcast: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=podcasts`,
    },
    updatePodcast: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=publicationBlockstatus`,
    },
    createDigiTokenUrl: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=createDigiToken`,
    },
    getRelationAdverts: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiAdverts`,
    },
    getRelationAdvert: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiAdvert`,
    },
    getRelationAdvertTypes: {
        method: 'GET',
        to: `https://yescrm.com/${env}/api/index.php?action=digiAdvertTypes`,
    },
    updateRelationAdvert: {
        method: 'PATCH',
        to: `https://yescrm.com/${env}/api/index.php?action=digiAdvert`,
    },
    createRelationAdvert: {
        method: 'POST',
        to: `https://yescrm.com/${env}/api/index.php?action=digiAdvert`,
    },
    deleteRelationAdvert: {
        method: 'DELETE',
        to: `https://yescrm.com/${env}/api/index.php?action=digiAdvert`,
    },
} as const satisfies Endpoints;
