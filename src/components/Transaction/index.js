import React, {useState} from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import {shape, string} from "prop-types";
import defaultClasses from "./index.css";
import {useQuery} from "@apollo/client";
import {Title} from "@magento/venia-ui/lib/components/Head";
import {useIntl} from "react-intl";
import {useGetRewardPointData} from "../../talons/useGetRewardPointData";
import moment from "moment";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';


const Transaction = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        rewardTransactionData
    } = useGetRewardPointData();
    const { formatMessage } = useIntl();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    let expireDate, status;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    if (!rewardTransactionData){
        return ''
    }
    const transactions = rewardTransactionData.customer.mp_reward.transactions.items
    const PAGE_TITLE = formatMessage({
        id: 'rewardPointTransaction',
        defaultMessage: 'Reward Transaction'
    });
    const title = `${PAGE_TITLE} - ${STORE_NAME}`;
    return (
            <section>
                <Title>{title}</Title>
                <div style={{marginTop: '4rem', marginBottom: '5rem', fontSize: '30px'}}><span>Transaction</span></div>
                <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transaction #</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Comment</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Expire Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction) => {
                                    const expireDateFormat = moment(transaction.expiration_date).format('YYYY/MM/DD');
                                    if(expireDateFormat == 'Invalid date'){
                                        expireDate = 'N/A'
                                    }
                                    if(transaction.status == 2){
                                        status = 'Completed'
                                    }
                                    if(transaction.status == 4){
                                        status = 'Expired'
                                    }
                                    if(transaction.status == 0){
                                        status = 'Processing'
                                    }
                                    return (
                                        <TableRow>
                                            <TableCell>{transaction.transaction_id}</TableCell>
                                            <TableCell>{moment(transaction.create_at).format('YYYY/MM/DD')}</TableCell>
                                            <TableCell>{transaction.comment}</TableCell>
                                            <TableCell>{transaction.point_amount}</TableCell>
                                            <TableCell>{status}</TableCell>
                                            <TableCell>{expireDate}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[3,10, 25, 100]}
                        component="div"
                        count={transactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </section>
        )

}
Transaction.propTypes = {
    classes: shape({root: string})
};

Transaction.defaultProps = {};

export default Transaction;
