# Portfolio Versioning

### Features of this project : 

- ### Used principles of clean architecture
- ### Created interface and types file to enforce typing 

- ### Three entities (Modified existing entity) :

- #### PageEntity - Which contains the pages of the portfolio which is linked to the versions
```
`id`: number;
 name: string; 
 url: string; 
 version: PortfolioVersionEntity; 
 versionId: number
```
- #### PortfolioVersionEntity - Which contains all the versions linked to the main portfolio. The VersionType is an enum which accepts 3 states : published, draft and snapshot

```
  id: number; 
  versionType: string; 
  isActive: boolean; 
  portfolio: PortfolioEntity;
  portfolioId: number; 
  pages?: PageEntity[];
  createdAt: Date;
  updatedAt: Date;
```

- #### PortfolioEntity - This is the main entity which links to the versions which inturn links to the pages

```
  id: number;
  name: string;
  url: string;
  versions?: PortfolioVersionEntity[]
```


## API Routes

### Create a Portfolio 

```GraphQL
  mutation CreatePortfolio($name: String!, $url: String!) {
  createPortfolio(name: $name, url: $url) {,
    url
    name
  }
}
```
#### Output : 

```json
{
  "data": {
    "createPortfolio": {
      "url": "digication.com",
      "name": "johny"
    }
  }
}
```

### Add Versions to a Portfolio with pages

```GraphQL
mutation AddVersionWithPages($versionType: VersionType!, $portfolioId: Float!, $isActive: Boolean!, $pages: [PagesGqlInput!]!) {
  addVersionWithPages(versionType: $versionType, portfolioId: $portfolioId, isActive: $isActive, pages: $pages) {
    id, versionType, isActive, createdAt, updatedAt
  }
}
```

#### Output : 

```json
{
  "data": {
    "addVersionWithPages": {
      "id": 1,
      "versionType": "draft",
      "isActive": true,
      "createdAt": "2022-04-01T13:03:00.000Z",
      "updatedAt": "2022-04-01T13:03:00.000Z"
    }
  }
}
```

### Get all versions of a portfolio *

![List all portfolios](/images/ListPortfolio.png)

```GraphQL
query ListVersions($listVersionsId: Float!) {
  listVersions(id: $listVersionsId) {
    id
    versionType
    isActive
    pages {
      name,
      url
    }
  }
}
```
#### Output : 

```json
{
  "data": {
    "listVersions": [
      {
        "id": 1,
        "versionType": "draft",
        "isActive": true,
        "pages": [
          {
            "name": "Page 1,",
            "url": "www.page1.com"
          },
          {
            "name": "Page 2",
            "url": "www.page2com"
          }
        ]
      }
    ]
  }
}
```

### Create a Snapshot From Draft *

![Create a Snapshot From Draft ](/images/snapshot.png)

```GraphQL
mutation CreateSnapshotFromDraft($createSnapshotFromDraftId: Float!) {
  createSnapshotFromDraft(id: $createSnapshotFromDraftId) {
    id
    versionType
    isActive
    createdAt
  }
}
```
#### Output : 

```json
{
  "data": {
    "createSnapshotFromDraft": {
      "id": 2,
      "versionType": "snapshot",
      "isActive": true,
      "createdAt": "2022-04-01T13:05:30.000Z"
    }
  }
}
```

### List all Portfolios with versions *

![List all Portfolios with versions ](/images/versions_of_portfolio.png)

```GraphQL
query ListPortfolios {
  listPortfolios {
    id
    name
    url
    versions {
      id
      versionType
      isActive
      createdAt
      updatedAt
    }
  }
}
```
#### Output : 

```json
{
  "data": {
    "listPortfolios": [
      {
        "id": 1,
        "name": "johny",
        "url": "",
        "versions": [
          {
            "id": 1,
            "versionType": "draft",
            "isActive": true,
            "createdAt": "2022-04-01T13:03:00.000Z",
            "updatedAt": "2022-04-01T13:03:00.000Z"
          },
          {
            "id": 2,
            "versionType": "snapshot",
            "isActive": true,
            "createdAt": "2022-04-01T13:05:30.000Z",
            "updatedAt": "2022-04-01T13:05:30.000Z"
          }
        ]
      },
      {
        "id": 2,
        "name": "johny",
        "url": "digication.com",
        "versions": []
      }
    ]
  }
}
```