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
    
    async get(key) { return this.driver.get(key); }
    async set(key, value) { return this.driver.set(key, value); }
    async remove(key) { return this.driver.remove(key); }

    async import(data) {
        if (typeof this.driver.import !== "function") {
            throw new Error(`driver[${this.driver.name}] does not implement import()`);
        }
        return this.driver.import(data);
    }
    async export() {
        if (typeof this.driver.export !== "function") {
            throw new Error(`driver[${this.driver.name}] does not implement export()`);
        }
        return this.driver.export();
    }
}