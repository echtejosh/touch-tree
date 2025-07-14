import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Column, Row } from 'presentation/components/layout';
import { useForm, useInvalidateQuery, usePrefetchQuery, useQuery } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import GetPublicationPagesUseCase from 'application/usecases/publications/GetPublicationPagesUseCase';
import { themePalette } from 'presentation/theme';
import GetPublicationPageUseCase from 'application/usecases/publications/GetPublicationPageUseCase';
import {
    NewsstandPublicationPageModel,
    NewsstandPublicationPagesModel,
} from 'domain/models/newsstand/NewsstandPublicationModel';
import Preload from 'presentation/components/preload/Preload';
import useRefresh from 'presentation/hooks/useRefresh';
import InteractionsImagePreview from 'presentation/components/InteractionsImagePreview';

interface LazyLoadBoxProps {
    pub: NewsstandPublicationPagesModel;
    currentPage: number | null;
    onClick: () => void;
    index: number;
}

function LazyLoadBoxComponent(
    { pub, currentPage, onClick, index }: LazyLoadBoxProps,
    ref: Ref<HTMLDivElement | null>,
) {
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const boxRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => boxRef.current, [boxRef.current]);

    useEffect(() => {
        if (hasBeenVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasBeenVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px', threshold: 0.1 },
        );

        if (boxRef.current) {
            observer.observe(boxRef.current);
        }
    }, [hasBeenVisible]);

    return (
        <Column
            alignItems='center'
            display='flex'
            gap={0}
            onClick={onClick}
            px={2}
        >
            <Box
                ref={boxRef}
                sx={{
                    backgroundImage: hasBeenVisible ? `url(${pub.imageLowRes})` : 'none',
                    backgroundColor: 'lightgray',
                    height: 100,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    border: 1,
                    borderColor: 'lightgray',
                    cursor: 'pointer',
                    ...(currentPage === pub.page && {
                        border: 2,
                        borderColor: themePalette.primary.main,
                    }),
                }}
                width={80}
            />

            <Typography fontWeight={500} variant='body2'>
                {index + 1}
            </Typography>
        </Column>
    );
}

const LazyLoadBox = forwardRef<HTMLDivElement | null, LazyLoadBoxProps>(LazyLoadBoxComponent);

interface ManagePublicationInteractionsModalProps {
    id: number;
    label: string;
}

/**
 *
 * @constructor
 */
export default function ManagePublicationInteractionsModal({
    id,
    label,
}: ManagePublicationInteractionsModalProps) {
    const getPublicationPagesUseCase = Container.resolve(GetPublicationPagesUseCase);
    const getPublicationPageUseCase = Container.resolve(GetPublicationPageUseCase);

    const [currentPage, setCurrentPage] = useState<number | null>(1);
    const [, setIsUpdating] = useState(false);

    const htmlContentRef = useRef<string>();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const { data: publicationPages } = useQuery(() => getPublicationPagesUseCase.handle(id), [GetPublicationPagesUseCase.name, id]);

    const { data: publicationPage } = useQuery(
        () => getPublicationPageUseCase.handle({
            linkedPage: currentPage,
            linkedArticleId: id,
        }),
        [GetPublicationPageUseCase.name, currentPage, id],
    );

    const {
        reset,
    } = useForm<NewsstandPublicationPageModel>({ defaultValues: { ...publicationPage } });

    const { refreshContent } = useRefresh(String(id));

    /**
     *
     */
    function scrollToSelectedPage() {
        if (currentPage !== null && publicationPages) {
            const selectedPageIndex = publicationPages.findIndex((pub) => pub.page === currentPage);

            if (selectedPageIndex !== -1 && pageRefs.current[selectedPageIndex]) {
                pageRefs.current[selectedPageIndex]?.scrollIntoView({
                    block: 'start',
                });
            }
        }
    }

    useEffect(() => {
        useInvalidateQuery([GetPublicationPagesUseCase.name, id]);
        useInvalidateQuery([GetPublicationPageUseCase.name, id, currentPage]);
        setIsUpdating(false);
    }, [refreshContent]);

    useEffect(() => {
        if (publicationPage) {
            reset({ ...publicationPage });
        }

        if (publicationPage?.html) {
            htmlContentRef.current = publicationPage.html;
        }
    }, [publicationPage]);

    return (
        <Column gap={0}>
            <Box
                p={4}
                sx={{
                    borderBottom: 1,
                    borderColor: themePalette.border.main,
                }}
            >
                <Typography variant='h2'>
                    {label}
                    {currentPage !== null && (
                        <>
                            {' - '}
                            <Link onClick={scrollToSelectedPage} sx={{ fontSize: 24, cursor: 'pointer' }}>
                                {`Page ${currentPage}`}
                            </Link>
                        </>
                    )}
                </Typography>
            </Box>

            <Row gap={0} height={680}>
                <Column
                    gap={1}
                    sx={{
                        overflowY: 'scroll',
                        py: 2,
                    }}
                >
                    {publicationPages?.map((pub, i) => {
                        return (
                            <Preload
                                key={pub.id}
                                on={() => {
                                    usePrefetchQuery(
                                        () => getPublicationPageUseCase.handle({
                                            linkedPage: pub.page,
                                            linkedArticleId: id,
                                        }),
                                        [GetPublicationPageUseCase.name, pub.page, id],
                                    );
                                }}
                            >
                                <LazyLoadBox
                                    ref={(el) => {
                                        pageRefs.current[i] = el;
                                    }}
                                    currentPage={currentPage}
                                    index={i}
                                    onClick={() => setCurrentPage(pub.page)}
                                    pub={pub}
                                />
                            </Preload>
                        );
                    })}
                </Column>

                <Row
                    flex={1}
                    gap={0}
                    height='100%'
                >
                    <InteractionsImagePreview
                        flex={1}
                        imageScale={0.9}
                        page={currentPage}
                        pageId={publicationPage?.id || null}
                        publicationId={id}
                    />
                </Row>
            </Row>
        </Column>
    );
}
