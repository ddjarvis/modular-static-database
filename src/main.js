import StorageAdapter from './core/storage/StorageAdapter.js';
import StorageDrivers from './core/storage/StorageDrivers.js';

const storage = new StorageAdapter(StorageDrivers.localStorage);

