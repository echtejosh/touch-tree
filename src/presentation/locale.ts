import { IntlService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';

import en_gb from 'infrastructure/locales/en-gb.json';
import en_us from 'infrastructure/locales/en-us.json';

const intlService = Container.resolve(IntlService);

intlService
    .setMessages(['en', 'en-gb'], en_gb)
    .setMessages(['en-us'], en_us);
