/**
 * @description Get cleaned CosmosDB items from array of items
 */
export function cleanCosmosDbItems(item: Record<string, unknown>, getOnlyId = false) {
  if (!item || item.length === 0) {
    console.warn('No item passed to cleanCosmosDbItems!');
    return null;
  }

  const _item: any = item[0];
  const { value, id } = _item;

  if (getOnlyId) return id;

  return {
    ...JSON.parse(value)
  };
}
