import { useContext } from 'react';
import { IntlContext, IntlContextType } from 'presentation/providers/decorators/IntlProviderDecorator';

/**
 * A hook to create an internationalization (intl) object for the application.
 * It uses the current locale and corresponding translations to configure the intl object.
 * This object can be used for formatting messages, dates, numbers, etc., based on the active locale.
 *
 * @returns The intl object containing locale and translation messages.
 */
export default function useIntl(): IntlContextType {
    return <IntlContextType>useContext(IntlContext);
}
