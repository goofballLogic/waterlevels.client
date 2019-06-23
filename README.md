# Usage

There are two ways to use this library.

## node.js

As a node module, you can simply require the package:


(require)
```javascript
var client = require( "waterlevels.client" )( process );

await client.listProviders(); // => [ "waterlevel.ie" ];
```

(ES6)
```javascript
import clientFactory from "waterlevels.client";
const client = clientFactory( process );

await client.listProviders(); // => [ "waterlevel.ie" ];
```

## browser

(ES6 e.g. webpack)
```javascript
import clientFactory from "waterlevels.client";
const config = { env: { AWS_REGION: "eu-west-1", AWS_BUCKET: "tc2-waterlevels.sync" } };
const client = clientFactory( config );

await client.listProviders(); // => [ "waterlevel.ie" ]
```

# listProviders

Return a list of data providers for which data has been gathered in the waterlevels.sync store.

Returns `Array<string>`

### Example
```javascript
await client.listProviders(); // => [ "waterlevel.ie" ]
```

# listDays

Return a list of days for which data is stored for a particular provider. Optionally including a range of dates to query.

Parameters
 - `provider : string`
 - `startDay : string` (optional)
 - `endDay : string` (optional)

Returns `Array<string>`

### Example
```javascript
await client.listDays( "waterlevel.ie", "2019-01-01", "2019-06-30" );
/*
[
  '2019-02-14',
  '2019-02-19',
  '2019-03-07',
  '2019-06-17',
  '2019-06-18',
  '2019-06-19',
  '2019-06-20',
  '2019-06-22',
  '2019-06-23'
]
*/
```

# getData

Returns all the data from a particular provider on a particular day

Parameters:
 - `provider : string`
 - `day : string`

Returns: `Array<object>`

### Example
```javascript
await client.getData( "waterlevel.ie", "2019-02-19" )
/*
[
  {
    id: '/0000036091/0001/2340',
    name: 'Ballinacur',
    date: '2019-02-19T18:45:00.000Z',
    coordinates: [ -7.693641, 54.056571 ],
    value: 1.374,
    extractionId: 'waterlevel.ie-1561299150483'
  },
  {
    id: '/0000036091/OD/2341',
    name: 'Ballinacur',
    date: '2019-02-19T18:45:00.000Z',
    coordinates: [ -7.693641, 54.056571 ],
    value: 53.041,
    extractionId: 'waterlevel.ie-1561299150483'
  },
  {
    id: '/0000036091/0003/2343',
    name: 'Ballinacur',
    date: '2019-02-19T18:30:00.000Z',
    coordinates: [ -7.693641, 54.056571 ],
    value: 11.03,
    extractionId: 'waterlevel.ie-1561299150483'
  },
  {
    id: '/0000036091/0002/2342',
    name: 'Ballinacur',
    date: '2019-02-19T18:30:00.000Z',
    coordinates: [ -7.693641, 54.056571 ],
    value: 8.497,
    extractionId: 'waterlevel.ie-1561299150483'
  }
]
*/
```

# getExtraction

Gets the raw extraction data used to create a given data item

Parameters:
 - `extractionId: string`

Returns: `string`

### Example
```javascript
const data = await client.getData( "waterlevel.ie", "2019-02-19" );

// get extractionId from first data item
const data[ 0 ].extractionId;

// get raw extract
const extract = await client.getExtract( extractionId );
/*
"{"crs":4326,"type":"FeatureCollection","features":[{"geometry":{"type":"Point","coordinates":[-8.238554,53.361687]},"type":"Feature","id":990,"properties":{"url":"/0000026007/0002/","csv_file":"/data/month/26007_0002.csv","station.name":"Bellagill","value":16.16,"datetime":"2019-06-23 14:00:00+00:00","sensor.ref":"0002","station.ref":"0000026007","station.region_id":2,"err_code":99}},{"geometry":{"type":"Point","coordinates":[-8.238554,53.361687]},"type":"Feature","id":841,"properties":{"url":"/ . . .
*/
```
