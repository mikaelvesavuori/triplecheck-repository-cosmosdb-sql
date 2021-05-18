# triplecheck-repository-cosmosdb-sql

![TripleCheck database repository](readme/triplecheck-repository.png)

## TripleCheck: Azure CosmosDB (SQL) database repository

Database utility for using CosmosDB (SQL) with TripleCheck broker.

## Instructions

You'll need to have a CosmosDB account up, a container (SQL) and set the Partition Key to `/id`. Also, I'd recommend maybe setting the consistency to "Strong". Consider using the serverless option for CosmosDB, since that will be a lot cheaper for smaller workloads.

## Basic implementation

In your `triplecheck-broker` implementation, do a regular import for `triplecheck-repository-cosmosdbsql` and pass the repository to the broker. In an Azure Functions context, an implementation could look like:

```TypeScript
import { TripleCheckBroker } from 'triplecheck-broker';
import { CosmosSqlRepository } from 'triplecheck-repository-cosmosdb-sql';

export const config = {
  endpoint: '<your_endpoint_uri>',
  key: '<primary_key>',
  databaseId: 'triplecheck', // <--- example
  containerId: 'broker_sql'  // <--- example
};

/**
 * @description The handler.
 */
export async function handler(context: any, req: any) {
  const [request, payload] = await getRequestData(req);

  const repository = CosmosSqlRepository(config);
  const { responseData, status, headers } = await TripleCheckBroker(request, payload, repository);

  return {
    status,
    body: responseData
  };
}

/**
 * @description Utility function to get the data we need to run the TripleCheck broker. Expects the full Azure Functions request object.
 */
async function getRequestData(req: any) {
  const { body, method, url } = req;

  let [pathname, search] = url.split('?');
  if (!pathname) pathname = url;

  const payload = typeof body === 'string' ? JSON.parse(body) : body;

  return [
    {
      method,
      pathname,
      search
    },
    payload
  ];
}

```
