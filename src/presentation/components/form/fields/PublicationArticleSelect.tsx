import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '@mui/material';
import AutocompleteElement from 'presentation/components/form/fields/AutocompleteElement';
import { Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import GetPublicationsUseCase from 'application/usecases/publications/GetPublicationsUseCase';
import { useQuery } from 'presentation/hooks';
import { useWatch } from 'react-hook-form-mui';

interface PublicationOption {
    id: number;
    label: string;
}

interface PageOption {
    id: number;
    label: string;
}

interface PageOptions {
    [articleId: number]: PageOption[];
}

interface Linkage {
    articleId: number | null;
    page: number | null;
}

interface PublicationArticleSelectProps {
    initialArticleId?: number | null;
    initialPage?: number | null;
    onChange?: (linkage: Linkage) => void;
    sx?: object;
}

export interface PublicationArticleSelectRefMethods {
    submit: () => Promise<boolean>;
}

function PublicationArticleSelect(
    {
        initialArticleId = null,
        initialPage = null,
        onChange,
        sx,
    }: PublicationArticleSelectProps,
    ref: ForwardedRef<PublicationArticleSelectRefMethods>,
) {
    const getPublicationsUseCase = Container.resolve(GetPublicationsUseCase);

    const { data: publications } = useQuery(getPublicationsUseCase.handle, [GetPublicationsUseCase.name]);

    const [publicationOptions, setPublicationOptions] = useState<PublicationOption[]>([]);
    const [pageOptions, setPageOptions] = useState<PageOptions>({});
    const [showAlert, setShowAlert] = useState(false);

    const { control, trigger } = useForm<Linkage>({
        defaultValues: {
            articleId: initialArticleId,
            page: initialPage,
        },
        mode: 'onChange',
    });

    const linkage = useWatch({ control });

    const handlePageClick = () => {
        if (!linkage.articleId) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            return trigger();
        },
    }));

    useEffect(() => {
        if (!publications) return;

        const opts1: PublicationOption[] = [];
        const opts2: PageOptions = {};

        publications.forEach(({ articles }) => {
            articles.forEach((article) => {
                opts1.push({
                    id: article.id,
                    label: article.fullName,
                });

                opts2[article.id] = Array.from({ length: article.quantityPages }).map((_, i) => ({
                    id: i + 1,
                    label: String(i + 1),
                }));
            });
        });

        setPublicationOptions(opts1);
        setPageOptions(opts2);
    }, [publications]);

    useEffect(() => {
        onChange?.(linkage as Linkage);
    }, [linkage]);

    return (
        <>
            {showAlert && (
                <Alert color='info' sx={{ border: 'none' }}>
                    Please select a publication first to choose a page.
                </Alert>
            )}
            <Row sx={{ ...sx }}>
                <AutocompleteElement
                    control={control}
                    label='Select a publication'
                    name='articleId'
                    options={publicationOptions}
                    required
                    sx={{ flex: 3 }}
                />
                <AutocompleteElement
                    control={control}
                    label='Select a page'
                    name='page'
                    onOptionClick={handlePageClick}
                    options={pageOptions[linkage.articleId as number] || []}
                    required
                    sx={{ flex: 1.5 }}
                />
            </Row>
        </>
    );
}

export default forwardRef(PublicationArticleSelect);
