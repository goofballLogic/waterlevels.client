import clientFactory from "../src/index.js";
import assert from "assert";
const client = clientFactory( process );

(async function() {

    console.log( "Query for providers" );
    const providers = await client.listProviders();
    assert( providers.find( x => x === "waterlevel.ie" ), "waterlevel.ie not found" );

    console.log( "Query for date range for provider" );
    const days = await client.listDays( "waterlevel.ie", "2019-01-01", "2019-06-30" );
    assert( days.find( x => x === "2019-03-07" ), "2019-03-07 not found in the list of days for waterlevel.ie" );

    console.log( "Query all days for provider" );
    const allDays = await client.listDays( "waterlevel.ie" );
    assert( allDays.find( x => x === "2019-03-07" ), "2019-03-07 not found in the list of all days for waterlevel.ie" );

    console.log( "Query for day's data" );
    const dayData = await client.getDayData( "waterlevel.ie", "2019-03-07" );
    assert( dayData.filter( x => x.station.name === "Tinacarra" ).length > 1, "Results for Tinacarra not found in the list of measurements for waterlevel.ie on 2019-06-17: " + JSON.stringify( dayData ) );

    console.log( "Query for extract from data" );
    const { extractionId } = dayData[ 0 ];
    const extract = await client.getExtract( extractionId );
    assert( extract, "Data extract is missing" );

    console.log( "Query all stations for provider" );
    const allStations = await client.listStations( "waterlevel.ie" );
    assert( allStations.find( x => x === "Blackcastle_0000007037" ), "Blackcastle_0000007037 not found in the list of all stations for waterlevel.ie" );

    console.log( "Query for station's data" );
    const stationData = await client.getStationData( "waterlevel.ie", "Blackcastle_0000007037" );
    assert( stationData.station.name === "Blackcastle", "Blackcastle station not returned: " + JSON.stringify( stationData ) );

    console.log( "Query for a group of stations" );
    const group = [
        "Ballycarroon_0000034007",
        "Ballycorey_0000027002",
        "Ballycotton_0000019068"
    ];
    const stationGroupData = await client.getStationGroupData( "waterlevel.ie", group );
    assert( Object.keys( stationGroupData ).join( "/" ) === group.join( "/" ), `Missing one of ${JSON.stringify( group )}: ${JSON.stringify( stationGroupData )}` );

}());