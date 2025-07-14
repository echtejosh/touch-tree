/**
 * Contract for the Locale Service to manage user localization preferences.
 *
 * This interface provides methods for setting and retrieving
 * the user's localization, typically from a persistent storage.
 */
export interface LocaleServiceContract {
    /**
     * Sets the user's localization preference.
     *
     * @param locale The localization code to set as the active language.
     */
    setLocale(locale: string): void;

    /**
     * Retrieves the current localization preference.
     *
     * This method fetches the localization either from persistent storage
     * or defaults to a predefined value if no preference is stored.
     *
     * @returns The localization code.
     */
    getLocale(): string;
}
