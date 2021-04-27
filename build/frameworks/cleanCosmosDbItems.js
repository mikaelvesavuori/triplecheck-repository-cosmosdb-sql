"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanCosmosDbItems = void 0;
function cleanCosmosDbItems(item) {
    if (!item || item.length === 0) {
        console.warn('No item passed to cleanCosmosDbItems!');
        return null;
    }
    const _item = item[0];
    const { key, value, id } = _item;
    return {
        id,
        key,
        value
    };
}
exports.cleanCosmosDbItems = cleanCosmosDbItems;
//# sourceMappingURL=cleanCosmosDbItems.js.map