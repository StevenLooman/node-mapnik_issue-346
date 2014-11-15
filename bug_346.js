var mapnik = require('mapnik');
var mercator = new(require('sphericalmercator'));


mapnik.register_default_fonts();
mapnik.register_default_input_plugins();
var map = new mapnik.Map(256, 256);
map.loadSync('bug_346.xml');
mapnik.Logger.setSeverity(mapnik.Logger.DEBUG);


var zoom = 19;
var x = 269484;
var y = 172448;
var vTile = new mapnik.VectorTile(zoom, x, y);
var rTile = new mapnik.Image(256, 256);


map.zoomToBox(mercator.bbox(x, y, zoom, false, '900913'));


function renderVTileRTile(err, callback) {
    if (err) throw err;

    console.log('rendering VTile');
    map.render(vTile, function(err, vTile) {
        if (err) throw err;

        console.log('rendering RTileVTile');
        vTile.render(map, rTile, function(err, rTile) {
            if (err) throw err;

            rTile.save('actual.pbf.png', 'png');

            callback(null);
        });
    });
}

function renderRTile(err, callback) {
    console.log('rendering RTile');

    if (err) throw err;

    map.render(rTile, function(err, rTile) {
        if (err) throw err;

        rTile.save('actual.png', 'png');
    });
}

renderVTileRTile(null, renderRTile);
