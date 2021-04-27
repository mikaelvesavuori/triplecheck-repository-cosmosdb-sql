"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanCosmosDbItems = void 0;
function cleanCosmosDbItems(item, getOnlyId = false) {
    if (!item || item.length === 0) {
        console.warn('No item passed to cleanCosmosDbItems!');
        return null;
    }
    const _item = item[0];
    const { value, id, key } = _item;
    if (getOnlyId)
        return id;
    return { value: JSON.parse(value), id, key };
}
exports.cleanCosmosDbItems = cleanCosmosDbItems;
//# sourceMappingURL=cleanCosmosDbItems.js.map