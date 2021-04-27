"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCosmosDb = void 0;
const tslib_1 = require("tslib");
const cosmos_1 = require("@azure/cosmos");
const cleanCosmosDbItems_1 = require("./frameworks/cleanCosmosDbItems");
function createCosmosDb(config) {
    const { endpoint, key, databaseId, containerId } = config;
    const client = new cosmos_1.CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);
    const db = new CosmosSqlRepository(container);
    return db;
}
exports.createCosmosDb = createCosmosDb;
class CosmosSqlRepository {
    constructor(container) {
        this.container = container;
    }
    createData(key, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.container.items.create({
                        key,
                        value: JSON.stringify(data)
                    });
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    getData(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    if (!key)
                        reject('Missing key!');
                    const query = `SELECT * FROM c WHERE c.key = "${key}"`;
                    const { resources: items } = yield this.container.items.query(query).fetchAll();
                    resolve(cleanCosmosDbItems_1.cleanCosmosDbItems(items));
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    updateData(key, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    if (!data)
                        reject('Missing data!');
                    const existingItem = yield this.getData(key);
                    if (existingItem) {
                        let itemToUpdate = Object.assign({}, existingItem);
                        itemToUpdate.value = JSON.stringify(data);
                        yield this.container.item(existingItem.id).replace(itemToUpdate);
                        resolve();
                    }
                    else {
                        yield this.createData(key, data);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    deleteData(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    if (!key)
                        reject('Missing key!');
                    const data = yield this.getData(key);
                    if (!data)
                        resolve();
                    const { id } = data;
                    yield this.container.item(id, id).delete();
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
}
//# sourceMappingURL=CosmosDbRepository.js.map