const driver_localStorage = {
    name: 'localStorage',
    get: key => JSON.parse(localStorage.getItem(key)),
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    remove: key => localStorage.removeItem(key),
    import: data => {
        const obj = JSON.parse(data);
        for (const k in obj) localStorage.setItem(k, obj[k]);
    },
    export: (...keys) => {
        const obj = {};
        if(keys.length === 0) {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                obj[k] = localStorage.getItem(k);
            }
        }
        else {
            for(const k in keys) {
                if(localStorage.getItem(k) == null) {
                    throw new Error(`Invalid storage key ${k}`);
                }
                obj[k] = localStorage.getItem(k);
            }
        }
        return JSON.stringify(obj);
    }
};

export default driver_localStorage;