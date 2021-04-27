/**
 * @description Get cleaned CosmosDB items from array of items
 */
export function cleanCosmosDbItems(item: Record<string, unknown>) {
  if (!item || item.length === 0) {
    console.warn('No item passed to cleanCosmosDbItems!');
    return null;
  }

  const _item: any = item[0];
  const { key, value, id } = _item;

  return {
    id,
    key,
    value
  };
}
