import { Repository } from 'triplecheck-core';
import { CosmosClient } from '@azure/cosmos';

import { cleanCosmosDbItems } from './frameworks/cleanCosmosDbItems';

/**
 * @description Create a database that can be used by others. Abstracts away setup from implementation.
 * @param database - Database type to start
 */
export function createCosmosDb(config: any) {
  const { endpoint, key, databaseId, containerId } = config;

  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const db = new CosmosSqlRepository(container);
  return db;
}

/**
 * @description Item database, concrete implementation for CosmosDB
 */
class CosmosSqlRepository implements Repository {
  protected container: any;

  constructor(container: any) {
    this.container = container;
  }

  /**
   * @description Method for creating item.
   */
  private async createData(key: string, data: any): Promise<void> {
    try {
      await this.container.items.create({
        key,
        value: JSON.stringify(data)
      });
      return;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  /**
   * @description Method for reading item(s).
   */
  async getData(key: string): Promise<any> {
    try {
      const query = `SELECT * FROM c WHERE c.key = "${key}"`;
      const { resources: items } = await this.container.items.query(query).fetchAll();
      return cleanCosmosDbItems(items);
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  /**
   * @description Method for updating item.
   */
  async updateData(key: string, data: any): Promise<void> {
    try {
      const { value, id } = await this.getData(key);

      if (value) {
        // Do a kind of partial update.
        // Copy the existing item and its values, then update / replace with anything new.
        const itemToUpdate = { value: JSON.stringify(data), id, key };

        await this.container.item(id).replace(itemToUpdate);
        return;
      } else {
        // Create item, since it does not exist.
        await this.createData(key, data);
      }
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  /**
   * @description Method for deleting item.
   */
  async deleteData(key: string): Promise<void> {
    try {
      const { id } = await this.getData(key);
      if (!id) return;

      await this.container.item(id, id).delete();
      return;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }
}
