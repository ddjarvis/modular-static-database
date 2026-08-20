export default function (ns = 'my_db') {
    const nss = `${ns}:`;
    return {
        name: 'localStorage',
        get: key => JSON.parse(localStorage.getItem(nss+key) || null),
        set: (key, val) => localStorage.setItem(nss+key, JSON.stringify(val)),
        remove: key => localStorage.removeItem(nss+key),
        import: data => {
            const obj = JSON.parse(data);
            for (const k in obj) localStorage.setItem(nss+k, obj[k]);
        },
        export: () => {
            const obj = {};
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (!k.startsWith(nss)) continue;
                obj[k.slice(nss.length)] = localStorage.getItem(k);
            }
            return JSON.stringify(obj);
        }

    };
}
