import {useMutation, useQuery} from '@apollo/client';
import {useCallback} from 'react'
import {useUserContext} from '@magento/peregrine/lib/context/user';
import {
    GET_CUSTOMER_REWARD_POINTS,
    GET_CUSTOMER_TRANSACTION,
    SET_REWARD_SUBSCRIBE_STATUS
} from "./rewardPoints.gql";
import {useHistory} from "react-router-dom";

export const useGetRewardPointData = () => {
    let history = useHistory();
    const [{isSignedIn}] = useUserContext();
    const {
        data: rewardPointData,
        loading: rewardPointLoading,
        error: rewardPointError
    } = useQuery(GET_CUSTOMER_REWARD_POINTS, {
        fetchPolicy: "cache-and-network",
        skip: !isSignedIn
    });
    const {
        data: rewardTransactionData
    } = useQuery(GET_CUSTOMER_TRANSACTION, {variables: {pageSize: 100}, fetchPolicy: "cache-and-network", skip: !isSignedIn})
    const [mpRewardPoints, {loading: setSubcribeLoading, data: setSubcribeData, error: setSubcribeError }] = useMutation(SET_REWARD_SUBSCRIBE_STATUS)
    const handleViewAll = useCallback(
        () => {
            history.push('/reward-transaction');
        }
    )
    return {
        handleViewAll,
        mpRewardPoints,
        rewardPointData,
        rewardPointLoading,
        rewardPointError,
        rewardTransactionData
    }
}
