import { Repository } from 'triplecheck-core';
export declare function createCosmosDb(config: any): CosmosSqlRepository;
declare class CosmosSqlRepository implements Repository {
    protected container: any;
    constructor(container: any);
    private createData;
    getData(key: string): Promise<any>;
    updateData(key: string, data: any): Promise<void>;
    deleteData(key: string): Promise<void>;
}
export {};
