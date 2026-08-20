const driver_localStorage = {
    name: 'localStorage',
    get: key => JSON.parse(localStorage.getItem(key)),
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    remove: key => localStorage.removeItem(key),
    import: data => {
        const obj = JSON.parse(data);
        for (const k in obj) localStorage.setItem(k, obj[k]);
    },
    export: () => {
        const obj = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            obj[k] = localStorage.getItem(k);
        }
        return JSON.stringify(obj);
    }
};

export default driver_localStorage;