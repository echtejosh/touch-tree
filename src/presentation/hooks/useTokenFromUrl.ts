import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Container from 'infrastructure/services/Container';
import CookieService from 'infrastructure/services/storage/CookieService';

const TOKEN_PARAM = 'overruleToken';

export function useTokenFromUrl(): void {
    const cookieService = Container.resolve(CookieService);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get(TOKEN_PARAM);

        if (token && token.length > 20) {
            const expiresInHours = 2;
            const expiresInDays = expiresInHours / 24;
            cookieService.setItem('token', token, { expires: expiresInDays });

            searchParams.delete(TOKEN_PARAM);
            setSearchParams(searchParams);

            navigate(0);
        }
    }, [searchParams]);
}
