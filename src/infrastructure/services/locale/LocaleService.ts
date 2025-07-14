import localeMapping from 'infrastructure/locales/mapping.json';
import LocalStorageService from 'infrastructure/services/storage/LocalStorageService';
import { LocaleServiceContract } from 'domain/contracts/services/LocaleServiceContract';
import Container from 'infrastructure/services/Container';

/**
 * Locale Service to manage user localization preferences.
 *
 * This service handles the retrieval and storage of the user's localization
 * preference in local storage, providing fallback options when necessary.
 *
 * @constructor
 */
function LocaleService(): LocaleServiceContract {
    const localStorageService = Container.resolve(LocalStorageService);

    /**
     * Updates the user's localization preference in local storage.
     * If the provided localization is valid, it will be stored under the key 'localization'.
     *
     * @param locale The localization code to set as the active language.
     */
    function setLocale(locale: string): void {
        localStorageService.setItem('locale', locale);
    }

    /**
     * Returns the fallback localization based on the given localization.
     *
     * If the localization consists of only the language code (without a region),
     * it checks the fallback intl configuration to resolve to a common
     * regional variant, otherwise, returns the original localization.
     *
     * @param locale The localization to check.
     * @private
     */
    function getFallbackLocale(locale: string): string {
        if (locale.length === 2) {
            return localeMapping[locale as keyof typeof localeMapping];
        }

        return locale;
    }

    /**
     * Retrieves the current localization from local storage or defaults to the browser's language.
     *
     * If the localization is not found in local storage, it checks the browser's language setting.
     * If the browser's language does not provide a region, it resolves to the most common
     * regional variant using fallback intl. The resolved localization is then stored.
     *
     * @returns The localization code.
     */
    function getLocale(): string {
        const fallback = getFallbackLocale(navigator.language.toLowerCase());
        const locale = localStorageService.getItem('locale');

        if (!locale) {
            localStorageService.setItem('locale', fallback);
        }

        return locale || fallback;
    }

    return {
        setLocale,
        getLocale,
    };
}

/**
 * @see LocaleService
 */
export default LocaleService;
