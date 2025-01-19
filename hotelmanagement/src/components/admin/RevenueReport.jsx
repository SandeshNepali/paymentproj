import React from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const RevenueReport = ({ data }) => {
    return (
        <Card sx={{ marginBottom: 2, backgroundColor: "#394851" }}>
            <CardContent>
                <Typography variant="h5">Revenue Report</Typography>
                {data && data.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Start Date</strong></TableCell>
                                <TableCell><strong>End Date</strong></TableCell>
                                <TableCell><strong>Number of Bookings</strong></TableCell>
                                <TableCell><strong>Total Revenue</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((revenue, index) => (
                                <TableRow key={index}>
                                    <TableCell>{revenue["Start Date"]}</TableCell>
                                    <TableCell>{revenue["End Date"]}</TableCell>
                                    <TableCell>{revenue["Number of Bookings"]}</TableCell>
                                    <TableCell>${revenue["Total Revenue"].toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No data available for revenue report.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default RevenueReport;
