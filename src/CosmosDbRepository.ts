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
    return new Promise(async (resolve, reject) => {
      try {
        await this.container.items.create({
          key,
          value: JSON.stringify(data)
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description Method for reading item(s).
   */
  async getData(key: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) reject('Missing key!');
        const query = `SELECT * FROM c WHERE c.key = "${key}"`;
        const { resources: items } = await this.container.items.query(query).fetchAll();
        resolve(cleanCosmosDbItems(items));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description Method for updating item.
   */
  async updateData(key: string, data: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data) reject('Missing data!');

        const existingItem = await this.getData(key);

        if (existingItem) {
          // Do a kind of partial update.
          // Copy the existing item and its values, then update / replace with anything new.
          let itemToUpdate = { ...existingItem };
          itemToUpdate.value = JSON.stringify(data);

          await this.container.item(existingItem.id).replace(itemToUpdate);
          resolve();
        } else {
          // Create item, since it does not exist.
          await this.createData(key, data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description Method for deleting item.
   */
  async deleteData(key: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) reject('Missing key!');
        const data = await this.getData(key);
        if (!data) resolve();

        const { id } = data;
        await this.container.item(id, id).delete();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
