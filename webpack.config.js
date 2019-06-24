const { resolve } = require( "path" );

module.exports = [ {

    mode: "production"

}, {

    output: { filename: "main.node.js" },
    mode: "production",
    target: "node"

} ];