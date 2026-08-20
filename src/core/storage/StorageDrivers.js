import driver_localStorage from './drivers/driver_localStorage.js';


export default function (ns = 'myApp') {
    // app_ns = namespace to not delete other data from saim domain
    const app_ns = `app_${ns}`;
    return {
        localStorage: driver_localStorage('app_'+app_ns)
    };
};
