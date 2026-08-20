import StorageAdapter from './core/storage/StorageAdapter.js';
import StorageDrivers from './core/storage/StorageDrivers.js';

const drivers = StorageDrivers('msdb');
const storage = new StorageAdapter(drivers.localStorage);

export { storage };

window.debug ??= {};
window.debug['storage'] = storage;