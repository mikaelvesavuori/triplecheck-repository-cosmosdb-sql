# triplecheck-repository-cosmosdb-sql

## TripleCheck: Azure CosmosDB (SQL) database repository

Database utility for using CosmosDB (SQL) with TripleCheck broker.

## Instructions

You'll need to have a CosmosDB account up, a container (SQL) and set the Partition Key to `/id`. Also, I'd recommend maybe setting the consistency to "Strong". Consider using the serverless option for CosmosDB, since that will be a lot cheaper for smaller workloads.
