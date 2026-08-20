export default function (ns = 'my_db') {
    return {
        name: 'localStorage',
        get: key => JSON.parse(localStorage.getItem(ns+'::'+key)),
        set: (key, val) => localStorage.setItem(ns+'::'+key, JSON.stringify(val)),
        remove: key => localStorage.removeItem(ns+'::'+key),
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
}