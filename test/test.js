import clientFactory from "../src/index.js";
import assert from "assert";
const client = clientFactory( process );

(async function() {

    console.log( "Query for providers" );
    const providers = await client.listProviders();
    assert( providers.find( x => x === "waterlevel.ie" ), "waterlevel.ie not found" );

    console.log( "Query for date range for provider" );
    const days = await client.listDays( "waterlevel.ie", "2019-01-01", "2019-06-30" );
    assert( days.find( x => x === "2019-06-17" ), "2019-06-17 not found in the list of days for waterlevel.ie" );

    console.log( "Query all days for provider" );
    const allDays = await client.listDays( "waterlevel.ie" );
    assert( days.find( x => x === "2019-06-17" ), "2019-06-17 not found in the list of all days for waterlevel.ie" );

    console.log( "Query for day's data" );
    const data = await client.getData( "waterlevel.ie", "2019-06-17" );
    assert( data.filter( x => x.name === "Ladyswell" ).length > 1, "Results for Ladyswell not found in the list of measurements for waterlevel.ie on 2019-06-17" );

    console.log( "Query for extract from data" );
    const { extractionId } = data[ 0 ];
    const extract = await client.getExtract( extractionId );
    assert( extract, "Data extract is missing" );

}());