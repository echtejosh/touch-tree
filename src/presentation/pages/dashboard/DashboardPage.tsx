import React, { ReactElement } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import { Typography } from '@mui/material';
import VisitorsGraph from 'presentation/widgets/VisitorsGraph';
import PagesGraph from 'presentation/widgets/PagesGraph';
import CampaignsGraph from 'presentation/widgets/CampaignsGraph';
import AdvertsGraph from 'presentation/widgets/AdvertsGraph';
import DateProvider from 'presentation/providers/DateProvider';
import { DatePicker } from 'presentation/components/decorators';
import TimePeriodSelector from 'presentation/components/buttons/TimePeriodSelector';
import { ButtonPaper } from 'presentation/components/buttons';
import { FilterIcon } from 'presentation/components/icons';
import { useDateRange } from 'presentation/hooks/useDateRange';
import Container from 'infrastructure/services/Container';
import LocaleService from 'infrastructure/services/locale/LocaleService';

export default function DashboardPage(): ReactElement {
    const localeService = Container.resolve(LocaleService);

    const {
        startDate,
        endDate,
        timePeriod,
        formattedDateRange,
        handleStartDateChange,
        handleEndDateChange,
        handleTimePeriodChange,
    } = useDateRange(localeService);

    return (
        <Row fill gap={0}>
            <Box>
                <Row
                    alignItems={{ xs: 'start', xl: 'center' }}
                    justifyContent='space-between'
                    p={4}
                    pb={0}
                >
                    <Typography variant='h1'>
                        Dashboard
                    </Typography>

                    <Row
                        alignItems={{ xs: 'end', xl: 'center' }}
                        flexDirection={{
                            xs: 'column',
                            xl: 'row',
                        }}
                        gap={2}
                    >
                        <TimePeriodSelector
                            onChange={handleTimePeriodChange}
                            value={timePeriod}
                        />

                        <ButtonPaper
                            icon={<FilterIcon />}
                            label={formattedDateRange}
                            sx={{ fontWeight: 600, fontSize: 14 }}
                        >
                            <Typography fontWeight={600}>
                                Date range
                            </Typography>

                            <Row alignItems='center'>
                                <DatePicker
                                    label='From'
                                    onChange={handleStartDateChange}
                                    value={startDate}
                                />

                                <DatePicker
                                    label='To'
                                    onChange={handleEndDateChange}
                                    value={endDate}
                                />
                            </Row>
                        </ButtonPaper>
                    </Row>
                </Row>

                <DateProvider
                    endDate={endDate}
                    startDate={startDate}
                >
                    <Row m={4} mt={3}>
                        <Column
                            columns={2}
                            flex={1}
                            sx={{ height: 'fit-content' }}
                        >
                            <VisitorsGraph />
                            <PagesGraph />
                            <CampaignsGraph />
                            <AdvertsGraph />
                        </Column>
                    </Row>
                </DateProvider>
            </Box>
        </Row>
    );
}

// export default function DashboardPage(): ReactElement {
//     return (
//         <Row fill gap={0}>
//             <Box>
//                 <Row
//                     alignItems='center'
//                     justifyContent='space-between'
//                     p={4}
//                     pb={0}
//                 >
//                     <Typography variant='h1'>
//                         Dashboard
//                     </Typography>
//                 </Row>
//
//                 <Row m={4} mt={3}>
//                     <Column
//                         columns={2}
//                         flex={1}
//                         sx={{ height: 'fit-content' }}
//                     >
//                         <NewsstandWidget />
//                         <CampaignsWidget />
//                         <AdvertsWidget />
//                         <HighlightsWidget />
//                     </Column>
//                 </Row>
//             </Box>
//         </Row>
//     );
// }
