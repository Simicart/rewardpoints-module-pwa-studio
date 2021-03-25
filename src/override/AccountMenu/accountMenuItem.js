import React from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Link } from '@magento/venia-drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useAccountMenuItems } from '@magento/peregrine/lib/talons/AccountMenu/useAccountMenuItems';

import defaultClasses from './accountMenuItems.css';

const AccountMenuItems = props => {
    const { onSignOut } = props;

    const talonProps = useAccountMenuItems({ onSignOut });
    const { handleSignOut, menuItems } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    let cloneMenuItems = [...menuItems, {
        name: 'My Points and Rewards',
        id: 'My Points and Rewards',
        url: '/reward-points'
    }];
    cloneMenuItems = [...cloneMenuItems, {
        name: 'My Rewards Transaction',
        id: 'My Rewards Transaction',
        url: '/reward-transaction'
    }];
    cloneMenuItems = [...cloneMenuItems, {
        name: 'My Referral',
        id: 'My Referral',
        url: '/reward-referral'
    }];

    const menu = cloneMenuItems.map(item => {
        return (
            <Link className={classes.link} key={item.name} to={item.url}>
                <FormattedMessage id={item.id} />
            </Link>
        );
    });

    return (
        <div className={classes.root}>
            {menu}
            <button
                className={classes.signOut}
                onClick={handleSignOut}
                type="button"
            >
                <FormattedMessage id={`Sign Out`} />
            </button>
        </div>
    );
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string,
        signOut: string
    }),
    onSignOut: func
};
