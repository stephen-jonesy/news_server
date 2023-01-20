# News server

## Hosting

### Link to hosted production version: https://news-server-zfky.onrender.com/api

## Summary

`News-server` contains a back-end REST API that provides endpoints for Articles, Comments, Users, Topics. This is designed to provide response data to the front-end and will be used within a UI environment to make requests from. For a full dictionary of endpoints, check `endpoints.json` or run the endpoint `/api`.  

## Environment variables

Since potions of the code make use of environment variables, please create a `.ent.test` file in the root directory that contains:

```
PGDATABASE=nc_news_test
```

And a `.env.development` file:

```
PGDATABASE=nc_news
```

## Minimum versions

Minimum versions of `Node.js` and `Postgres` needed to run the project:

For `Node.js` &uarr; v18.12.1

For `Postgres` &uarr; v13.4

