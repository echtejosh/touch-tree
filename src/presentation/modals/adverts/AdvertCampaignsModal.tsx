import useFilter from 'presentation/hooks/useFilter';
import Container from 'infrastructure/services/Container';
import GetAdvertUseCase from 'application/usecases/adverts/GetAdvertUseCase';
import { useQuery } from 'presentation/hooks';
import { Box, Row } from 'presentation/components/layout';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';

import React, { ReactElement } from 'react';
import SearchField from 'presentation/components/form/fields/SearchField';
import { themePalette } from 'presentation/theme';
import UpdateCampaignModal from 'presentation/modals/campaigns/UpdateCampaignModal';
import useDialog from 'presentation/hooks/useDialog';

export interface AdvertLinkedCampaignsModalProps {
    id: number;
}

export default function AdvertCampaignsModal({ id }: AdvertLinkedCampaignsModalProps) {
    const getAdvertUseCase = Container.resolve(GetAdvertUseCase);

    const { openDialog } = useDialog();
    const { data: advert } = useQuery(() => getAdvertUseCase.handle(id), [GetAdvertUseCase.name, id]);

    const {
        setSearch,
        filtered,
    } = useFilter(advert?.linkedCampaigns || []);

    const refs = filtered.map((item) => item.campaignLabel.toString());

    function openUpdateCampaignDialog(_id: number): void {
        openDialog((props): ReactElement => <UpdateCampaignModal id={_id} {...props} />);
    }

    return (
        <Box p={4}>
            <Typography variant='h2'>
                {advert?.name}
            </Typography>

            <Typography mt={3}>
                Here is a list of campaigns related to this advert:
            </Typography>

            <Row my={4}>
                <SearchField
                    autoCompleteRefs={refs}
                    fullWidth
                    onChange={(value): void => setSearch(value, [
                        'campaignId',
                        'campaignLabel',
                    ])}
                    size='small'
                    sx={{ zIndex: 9999 }}
                />
            </Row>

            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {filtered.map((item): ReactElement => (
                            <TableRow
                                key={item.id}
                                onClick={() => openUpdateCampaignDialog(item.campaignId)}
                                sx={{
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                <TableCell>
                                    <Typography sx={{ fontWeight: 500 }}>
                                        {item.campaignLabel}
                                    </Typography>

                                    <Row
                                        alignItems='center'
                                        gap={0.5}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                color: themePalette.text.light,
                                            }}
                                            variant='body2'
                                        >
                                            Id.
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                color: themePalette.text.light,
                                            }}
                                            variant='body2'
                                        >
                                            {item.campaignId}
                                        </Typography>
                                    </Row>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
