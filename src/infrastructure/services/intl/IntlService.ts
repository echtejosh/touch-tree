import fallbackLocales from 'infrastructure/locales/mapping.json';

/**
 * Interface defining the methods available in IntlService.
 */
interface IntlServiceContract {
    /**
     * Sets the translation data for the specified locale keys.
     *
     * @param keys An array of locale keys to associate with the translation data.
     * @param data The translation data to set.
     */
    setMessages(keys: string[], data: Record<string, string>): this;

    getMessages(): Map<string, Record<string, string>>;

    getMessages(locale: string): Record<string, string>;

    /**
     * Retrieves translation messages for a given locale, falling back to the default locale if not found.
     *
     * @param locale The locale code for the requested messages.
     * @returns The messages for the specified or fallback locale.
     */
    getMessages(locale?: string): Record<string, string> | Map<string, Record<string, string>>;
}

/**
 * A service that provides methods to manage and retrieve translations for different intl.
 * If a requested locale is unavailable, it defaults to a predefined fallback locale.
 *
 * @constructor
 */
function IntlService(): IntlServiceContract {
    let _this: IntlServiceContract;

    /**
     * A map that holds translation messages for each locale.
     */
    const messages = new Map<string, Record<string, string>>();

    /**
     * Retrieves all translation messages.
     *
     * @returns The messages for current locale.
     */
    function getMessages(): Map<string, Record<string, string>>;

    /**
     * Retrieves translation messages for a given locale, falling back to the default locale if not found.
     *
     * @param locale The locale code for the requested messages.
     * @returns The messages for the specified or fallback locale.
     */
    function getMessages(locale: string): Record<string, string>;

    function getMessages(locale?: string): Record<string, string> | Map<string, Record<string, string>> {
        if (!locale) {
            return messages;
        }

        return messages.has(locale) ? messages.get(locale)! : messages.get(fallbackLocales.en)!;
    }

    /**
     * Sets the translation data for the specified locale keys.
     *
     * @param keys An array of locale keys to associate with the translation data.
     * @param data The translation data to set.
     */
    function setMessages(keys: string[], data: Record<string, string>): IntlServiceContract {
        keys.forEach((key: string): void => {
            messages.set(key, data);
        });

        return _this;
    }

    _this = {
        setMessages,
        getMessages,
    };

    return _this;
}

/**
 * @see IntlService
 */
export default IntlService;
