import React, { createContext, useMemo, useState, ReactElement, PropsWithChildren } from 'react';
import { createIntl, IntlShape, IntlProvider } from 'react-intl';
import { IntlService, LocaleService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';

/**
 * Internationalization context for the useIntl hook.
 */
export interface IntlContextType extends IntlShape {
    /**
     * Retrieves the current localization.
     *
     * @returns The localization code.
     */
    getLocale(): string;

    /**
     * Updates the user's localization preference.
     *
     * @param locale The localization code to set as the active language.
     */
    setLocale(locale: string): void,

    /**
     * Fetches the appropriate translations based on the current localization.
     * Falls back to English if the localization is not supported.
     *
     * @returns A set of key-value pairs representing the translations for the active localization.
     */
    getMessages(): Record<string, string>;
}

/**
 * Creates an Internationalization context.
 */
export const IntlContext = createContext<IntlContextType | null>(null);

/**
 * Internationalization Provider.
 *
 * @param children
 * @constructor
 */
export default function IntlProviderDecorator({ children }: PropsWithChildren): ReactElement {
    const localeService = Container.resolve(LocaleService);
    const intlService = Container.resolve(IntlService);

    const [_locale, _setLocale] = useState<string>(localeService.getLocale());

    /**
     * Retrieves the current localization.
     *
     * @returns The localization code.
     */
    function getLocale(): string {
        return localeService.getLocale();
    }

    /**
     * Updates the user's localization preference.
     *
     * @param locale The localization code to set as the active language.
     */
    function setLocale(locale: string): void {
        _setLocale(locale);

        localeService.setLocale(locale);
    }

    /**
     * Fetches the appropriate translations based on the current localization.
     * Falls back to English if the localization is not supported.
     *
     * @returns A set of key-value pairs representing the translations for the active localization.
     */
    function getMessages(): Record<string, string> {
        return intlService.getMessages(_locale);
    }

    /**
     * The properties to provide to the provider, including Intl props.
     */
    const intl = createIntl({
        locale: _locale,
        messages: getMessages(),
    });

    /**
     * The properties to provide to the provider.
     */
    const value = useMemo((): IntlContextType => ({
        getMessages,
        getLocale,
        setLocale,
        ...intl,
    }), [_locale]);

    return (
        <IntlProvider
            locale={_locale}
            messages={getMessages()}
        >
            <IntlContext.Provider value={value}>
                {children}
            </IntlContext.Provider>
        </IntlProvider>
    );
}
