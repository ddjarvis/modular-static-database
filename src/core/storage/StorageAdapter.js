export default class StorageAdapter {
    constructor(driver) {
        const requiredMethods = ['get', 'set', 'remove'];
        for (const method of requiredMethods) {
            if (typeof driver[method] !== 'function') {
                throw new Error(`driver must implement ${method}()`);
            }
        }
        this.driver = driver;
    }
    
    get(key) { return this.driver.get(key); }
    set(key, value) { return this.driver.set(key, value); }
    remove(key) { return this.driver.remove(key); }

    import(data) {
        if (typeof this.driver.import !== "function") {
            throw new Error(`driver[${this.driver.name}] does not implement import()`);
        }
        return this.driver.import(data);
    }
    export() {
        if (typeof this.driver.export !== "function") {
            throw new Error(`driver[${this.driver.name}] does not implement import()`);
        }
        return this.driver.export();
    }
}