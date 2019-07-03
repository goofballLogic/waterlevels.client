import S3 from 'aws-sdk/clients/s3.js'

function required( config, name, what ) {

    if ( config && config.env && config.env[ name ] ) return config.env[ name ];
    throw new Error( `Required config ${name} missing: ${what}` );

}

export default function( config ) {

    const region = required( config, "AWS_REGION", "AWS region to use for querying data" );
    const bucket = required( config, "AWS_BUCKET", "AWS bucket to use for querying data" );
    const client = new S3( { region } );

    const request = ( method, options ) => client.makeUnauthenticatedRequest( method, options ).promise();
    const listObjects = options => request( "listObjectsV2", { Bucket: bucket, Delimiter: "/", ...options } );
    const getObject = options => request( "getObject", { Bucket: bucket, ...options } );

    const api = {

        async listProviders() {

            const providersResult = await listObjects( { Prefix: "provider/" } );
            return providersResult.CommonPrefixes.map( ( { Prefix } ) =>

                Prefix.substring( 9, Prefix.length - 1 )

            );

        },

        async listDays( provider, startDay, endDay ) {

            const prefix = `provider/${provider}/day/`;

            const startAfter = ( function () {

                if( !startDay ) return null;
                const startAfterDate = startDay ? new Date( startDay ) : null;
                if ( startAfterDate ) startAfterDate.setDate( -1 );
                return `${prefix}${startAfterDate.toISOString().substring( 0, 10 )}`;

            }() );

            const daysResult = await listObjects( { Prefix: prefix, StartAfter: startAfter } );

            return daysResult.Contents
                .map( x => x.Key.substring( prefix.length ) )
                .filter( x => !endDay || x <= endDay )
                .sort();

        },

        async listStations( provider ) {

            const prefix = `provider/${provider}/station/`;

            const stationsResult = await listObjects( { Prefix: prefix } );

            return stationsResult.Contents
                .map( x => x.Key.substring( prefix.length ) )
                .sort();

        },

        async getDayData( provider, day ) {

            const result = await getObject( { Key: `provider/${provider}/day/${day}` } );
            const body = result.Body.toString();
            const json = JSON.parse( body );
            return Object.values( json );

        },

        async getStationData( provider, station ) {

            const result = await getObject( { Key: `provider/${provider}/station/${station}` } );
            const body = result.Body.toString();
            return JSON.parse( body );

        },

        async getStationGroupData( provider, stations ) {

            const results = await Promise.all( stations.map( station => api.getStationData( provider, station ) ) );
            return stations.reduce( ( index, station, i ) => ( {
                ...index,
                [ station ]: results[ i ]

            } ), {} );

        },

        async getExtract( extractionId ) {

            const result = await client.makeUnauthenticatedRequest( "getObject", {

                Bucket: bucket,
                Key: `extracts/${extractionId}`

            } ).promise();
            return result.Body.toString();

        }

    };
    return api;

};
