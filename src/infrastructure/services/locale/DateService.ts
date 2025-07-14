import { LocaleService } from 'infrastructure/services';
import Container from '../Container';

export default function DateService() {
    const localeService = Container.resolve(LocaleService);

    function format(date: Date, options?: Intl.DateTimeFormatOptions): string {
        const locale = localeService.getLocale();

        const _options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        return date.toLocaleDateString(locale, { ..._options, ...options });
    }

    return {
        format,
    };
}
