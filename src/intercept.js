/**
 * Custom intercept file for the extension
 * By default you can only use target of @magento/pwa-buildpack.
 *
 * If do want extend @magento/peregrine or @magento/venia-ui
 * you should add them to peerDependencies to your package.json
 *
 * If you want to add overwrites for @magento/venia-ui components you can use
 * moduleOverrideWebpackPlugin and componentOverrideMapping
 */

const moduleOverrideWebpackPlugin = require('./moduleOverrideWebpackPlugin');
const componentOverrideMapping = require('./componentOverrideMapping');

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        /**
         *  Wee need to activated esModules and cssModules to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = { esModules: true, cssModules: true, graphqlQueries: true };
    });
    targets.of('@magento/venia-ui').routes.tap(
        routesArray => {
            routesArray.push({
                name: 'My Points and Rewards',
                pattern: '/reward-points',
                path: '@simicart/rewardpoint/src/components/RewardPoint/index'
            });
            return routesArray;
        }
    );
    targets.of('@magento/venia-ui').routes.tap(
        routesArray => {
            routesArray.push({
                name: 'My Rewards Transaction',
                pattern: '/reward-transaction',
                path: '@simicart/rewardpoint/src/components/Transaction/index'
            });
            return routesArray;
        }
    );
    targets.of('@magento/venia-ui').routes.tap(
        routesArray => {
            routesArray.push({
                name: 'My Referral',
                pattern: '/reward-referral',
                path: '@simicart/rewardpoint/src/components/Referral/index'
            });
            return routesArray;
        }
    );
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverrideWebpackPlugin(componentOverrideMapping).apply(compiler);
    })
};
