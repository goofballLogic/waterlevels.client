import S3 from 'aws-sdk/clients/s3.js'

function required( config, name, what ) {

    if ( config && config.env && config.env[ name ] ) return config.env[ name ];
    throw new Error( `Required config ${name} missing: ${what}` );

}
export default function( config ) {

    const region = required( config, "AWS_REGION", "AWS region to use for querying data" );
    const bucket = required( config, "AWS_BUCKET", "AWS bucket to use for querying data" );
    const client = new S3( { region } );

    return {

        async listProviders() {

            const providersResult = await client.listObjectsV2( {

                Bucket: bucket,
                Prefix: "providers/",
                Delimiter: "/"

            } ).promise();

            return providersResult.CommonPrefixes.map( ( { Prefix } ) => Prefix.substring( 10, Prefix.length - 1 ) );

        },

        async listDays( provider, startDay, endDay ) {

            const prefix = `providers/${provider}/`;

            const startAfter = ( function () {

                if( !startDay ) return null;
                const startAfterDate = startDay ? new Date( startDay ) : null;
                if ( startAfterDate ) startAfterDate.setDate( -1 );
                return `${prefix}${startAfterDate.toISOString().substring( 0, 10 )}`;

            }() );

            const endOn = `${prefix}${endDay}`;

            const daysResult = await client.listObjectsV2( {

                Bucket: bucket,
                Prefix: prefix,
                Delimiter: "/",
                StartAfter: startAfter

            } ).promise();
            return daysResult.Contents
                .filter( x => !endDay || x.Key <= endOn )
                .map( x => x.Key.substring( prefix.length ) )
                .sort();

        },

        async getData( provider, day ) {

            const result = await client.getObject( {

                Bucket: bucket,
                Key: `providers/${provider}/${day}`

            } ).promise();
            const body = result.Body.toString();
            const json = JSON.parse( body );
            return Object.values( json );

        },

        async getExtract( extractionId ) {

            const result = await client.getObject( {

                Bucket: bucket,
                Key: `extracts/${extractionId}`

            } ).promise();
            return result.Body.toString();

        }

    };

};
