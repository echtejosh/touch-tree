import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Column, Row } from 'presentation/components/layout';
import { useForm, useInvalidateQuery, usePrefetchQuery, useQuery } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import GetPublicationPagesUseCase from 'application/usecases/publications/GetPublicationPagesUseCase';
import EditorImagePreview from 'presentation/components/editor/EditorImagePreview';
import { themePalette } from 'presentation/theme';
import GetPublicationPageUseCase from 'application/usecases/publications/GetPublicationPageUseCase';
import PublicationPageEditor from 'presentation/components/editor/PublicationPageEditor/PublicationPageEditor';
import { SubmitButton } from 'presentation/components';
import { FormattedMessage } from 'react-intl';
import {
    NewsstandPublicationPageModel,
    NewsstandPublicationPagesModel,
} from 'domain/models/newsstand/NewsstandPublicationModel';
import UpdatePublicationPageUseCase from 'application/usecases/publications/UpdatePublicationPageUseCase';
import Preload from 'presentation/components/preload/Preload';
import { DeleteIcon } from 'presentation/components/icons';
import ButtonSecondary from 'presentation/components/buttons/ButtonSecondary';
import DeletePublicationPageHtmlModal from 'presentation/modals/publications/DeletePublicationPageHtmlModal';
import useDialog from 'presentation/hooks/useDialog';
import useRefresh from 'presentation/hooks/useRefresh';
import LoadingOverlay from 'presentation/components/LoadingOverlay';

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
                    cursor: pub.hasHtmlVersion || pub.htmlLinkedPage ? 'pointer' : 'not-allowed',
                    filter:
                        !pub.hasHtmlVersion && !pub.htmlLinkedPage
                            ? 'brightness(0.7) grayscale(100)'
                            : undefined,
                    opacity: !pub.hasHtmlVersion && !pub.htmlLinkedPage ? 0.2 : undefined,
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

interface UpdatePublicationPagesModalProps {
    id: number;
    label: string;
}

/**
 *
 * @constructor
 */
export default function UpdatePublicationPagesModal({
    id,
    label,
}: UpdatePublicationPagesModalProps) {
    const getPublicationPagesUseCase = Container.resolve(GetPublicationPagesUseCase);
    const getPublicationPageUseCase = Container.resolve(GetPublicationPageUseCase);
    const updatePublicationPageUseCase = Container.resolve(UpdatePublicationPageUseCase);

    const [currentPage, setCurrentPage] = useState<number | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const htmlContentRef = useRef<string>();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const { data: publicationPages } = useQuery(() => getPublicationPagesUseCase.handle(id), [GetPublicationPagesUseCase.name, id]);

    const { data: publicationPage, isLoading: isPublicationPageLoading } = useQuery(
        () => getPublicationPageUseCase.handle({
            linkedPage: currentPage,
            linkedArticleId: id,
        }),
        [GetPublicationPageUseCase.name, currentPage, id],
    );

    const {
        createDialog,
    } = useDialog();

    const {
        reset,
        getValues,
        handleSubmit,
    } = useForm<NewsstandPublicationPageModel>({ defaultValues: { ...publicationPage } });

    const { refreshContent, triggerRefresh } = useRefresh(String(id));

    /**
     *
     * @param htmlLinkedPage
     * @param hasHtmlVersion
     * @param page
     */
    function handlePageSelect({
        htmlLinkedPage,
        hasHtmlVersion,
        page,
    }: NewsstandPublicationPagesModel): void {
        if (hasHtmlVersion || htmlLinkedPage) {
            setCurrentPage(htmlLinkedPage || page);
        }
    }

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

    /**
     *
     */
    function openDeleteDialog(): void {
        if (!publicationPage) return;

        createDialog((props) => (
            <DeletePublicationPageHtmlModal
                onChange={() => {
                    setIsUpdating(true);
                    triggerRefresh();
                }}
                publicationPageHtml={publicationPage}
                {...props}
            />
        ))
            .open({
                maxWidth: 'sm',
            });
    }

    /**
     *
     * @param values
     */
    async function onSubmit(values: NewsstandPublicationPageModel): Promise<boolean> {
        setIsUpdating(true);
        const result = await updatePublicationPageUseCase.handle({
            ...values,
            html: htmlContentRef.current || null,
        });
        setIsUpdating(false);

        if (result) {
            useInvalidateQuery([GetPublicationPageUseCase.name, id, currentPage]);
        }

        return result;
    }

    useEffect(() => {
        useInvalidateQuery([GetPublicationPagesUseCase.name, id]);
        useInvalidateQuery([GetPublicationPageUseCase.name, id, currentPage]);
        setIsUpdating(false);
    }, [refreshContent]);

    useEffect(() => {
        if (publicationPages) {
            const initialPage = publicationPages?.find((pub) => pub.hasHtmlVersion);

            if (initialPage?.id) {
                setCurrentPage(initialPage?.page);
            }
        }
    }, [publicationPages]);

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
                                    onClick={() => handlePageSelect(pub)}
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
                    <EditorImagePreview
                        flex={1}
                        image={publicationPage?.imageData || null}
                        imageScale={0.9}
                    />

                    <Box flex={1} position='relative'>
                        <PublicationPageEditor
                            footer={(
                                <Row flex={1} justifyContent='space-between'>
                                    <ButtonSecondary
                                        onClick={openDeleteDialog}
                                        startIcon={<DeleteIcon />}
                                        variant='outlined'
                                    >
                                        Delete content
                                    </ButtonSecondary>

                                    <SubmitButton
                                        disabled={isUpdating || isPublicationPageLoading}
                                        handleSubmit={handleSubmit}
                                        onSubmit={onSubmit}
                                        size='large'
                                    >
                                        <FormattedMessage
                                            defaultMessage='Save changes'
                                            id='button.save'
                                        />
                                    </SubmitButton>
                                </Row>
                            )}
                            image={publicationPage?.imageData || String()}
                            onChange={(html) => {
                                htmlContentRef.current = html;
                            }}
                            value={getValues().html}
                        />

                        <LoadingOverlay isLoading={isPublicationPageLoading || isUpdating} />
                    </Box>
                </Row>
            </Row>
        </Column>
    );
}
