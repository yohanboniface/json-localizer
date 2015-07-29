var assert = require('assert'),
    Localizer = require('../index.js').Localizer;

var Suite = {

    test_simple_replace: function () {
        var obj = {key: 'value'},
            l = new Localizer(obj);
        l.where('key').then('othervalue');
        assert.equal(obj.key, 'othervalue');
    },

    test_replace_undefined_key_does_not_fail: function () {
        var obj = {key: 'value'},
            l = new Localizer(obj);
        l.where('undefined').then('othervalue');
        assert.equal(obj.key, 'value');
    },

    test_replace_by_array: function () {
        var obj = {key: 'value'},
            l = new Localizer(obj);
        l.where('key').then([1, 2, 3]);
        assert.deepEqual(obj.key, [1, 2, 3]);
    },

    test_replace_array_by_array: function () {
        var obj = {key: [3, 2, 1]},
            l = new Localizer(obj);
        l.where('key').then([1, 2, 3]);
        assert.deepEqual(obj.key, [1, 2, 3]);
    },

    test_replace_nested: function () {
        var obj = {nested: {key: 'value'}},
            l = new Localizer(obj);
        l.where('nested.key').then('value');
        assert.deepEqual(obj.nested.key, 'value');
    },

    test_replace_nested_with_object: function () {
        var obj = {nested: {key: 'value'}},
            l = new Localizer(obj);
        l.where('nested.key').then({key: 'value'});
        assert.deepEqual(obj.nested.key, 'value');
    },

    test_replace_nested_with_multiple_keys: function () {
        var obj = {nested: {key: 'value', otherkey: 'othervalue'}},
            l = new Localizer(obj);
        l.where('nested.key').then({key: 'value', newkey: 'newvalue'});
        assert.deepEqual(obj.nested.key, 'value');
        assert.deepEqual(obj.nested.newkey, 'newvalue');
        assert.deepEqual(obj.nested.otherkey, 'othervalue');
    },

    test_replace_with_nested_path: function () {
        var obj = {nested: {key: 'value'}},
            l = new Localizer(obj);
        l.where('nested').then({'nested.key': 'value'});
        assert.equal(obj.nested.key, 'value');
    },

    test_simple_if: function () {
        var obj = {key: 'value'},
            l = new Localizer(obj);
        l.where('key').if('value').then('othervalue');
        assert.equal(obj.key, 'othervalue');
    },

    test_wrong_if: function () {
        var obj = {key: 'value'},
            l = new Localizer(obj);
        l.where('key').if('wrongvalue').then('othervalue');
        assert.equal(obj.key, 'value');
    },

    test_wrong_if_with_object: function () {
        var obj = {key: 'value'},
            l = new Localizer(obj);
        l.where('key').if({key: 'value', otherkey: 'wrongvalue'}).then('othervalue');
        assert.equal(obj.key, 'value');
    },

    test_if_nested: function () {
        var obj = {root: {nested: {key: 'value'}}},
            l = new Localizer(obj);
        l.where('root.nested').if({key: 'value'}).then({key: 'othervalue'});
        assert.equal(obj.root.nested.key, 'othervalue');
    },

    test_if_with_array: function () {
        var obj = {root: {nested: [{key: 'value'}, {key: 'donotmatch'}]}},
            l = new Localizer(obj);
        l.where('root.nested').if({key: 'value'}).then({key: 'othervalue'});
        assert.equal(obj.root.nested[0].key, 'othervalue');
        assert.equal(obj.root.nested[1].key, 'donotmatch');
    },

    xtest_if_with_array_of_values: function () {
        var obj = {root: {nested: [{key: ['value', 'value2']}, {key: 'donotmatch'}]}},
            l = new Localizer(obj);
        l.where('root.nested').if({key: 'value'}).then({key: 'othervalue'});
        assert.equal(obj.root.nested[0].key, 'othervalue');
        assert.equal(obj.root.nested[1].key, 'donotmatch');
    },

    test_real_life: function () {
        var actual = {
            'bounds': [1.2219, 43.0923, 1.3057, 43.1517],
            'center': [1.256, 43.1249, 16],
            'minzoom': 6,
            'maxzoom': 20,
            'Stylesheet': [
                'style.mss'
            ],
            'Layer': [
                {
                    'id': 'countries',
                    'Datasource': {
                        'file': 'afile.zip',
                        'type': 'shape'
                    }
                },
                {
                    'geometry': 'polygon',
                    'id': 'polys',
                    'Datasource': {
                        'dbname': 'othertable',
                        'geometry_field': 'way',
                        'host': 'localhost',
                        'password': 'otherpassword',
                        'port': '5432',
                        'srs': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over',
                        'table': 'ansqlrequest',
                        'type': 'postgis',
                        'extent': '-20037508,-19929239,20037508,19929239',
                        'user': 'otheruser'
                    }
                }
            ]
        };
        var expected = {
            'bounds': [1, 2, 3, 4],
            'center': [1, 2, 3],
            'minzoom': 6,
            'maxzoom': 20,
            'Stylesheet': [
                'style.mss'
            ],
            'Layer': [
                {
                    'id': 'countries',
                    'Datasource': {
                        'file': 'localized.shp',
                        'type': 'shape'
                    }
                },
                {
                    'geometry': 'polygon',
                    'id': 'polys',
                    'Datasource': {
                        'dbname': 'localizedtable',
                        'geometry_field': 'way',
                        'host': '',
                        'password': '',
                        'port': '5432',
                        'srs': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over',
                        'table': 'ansqlrequest',
                        'type': 'postgis',
                        'extent': '-20037508,-19929239,20037508,19929239',
                        'user': 'localizeduser'
                    }
                }
            ]
        };
        var l = new Localizer(actual);
        l.where('bounds').then([1, 2, 3, 4]);
        l.where('center').then([1, 2, 3]);
        l.where('Layer').if({id: 'countries'}).then({'Datasource.file': 'localized.shp'});
        l.where('Layer').if({'Datasource.type': 'postgis'}).then({
            'Datasource.dbname': 'localizedtable',
            'Datasource.host': '',
            'Datasource.password': '',
            'Datasource.user': 'localizeduser'
        });
        assert.deepEqual(actual, expected);
    },

    test_from_string: function () {
        var obj = {root: {nested: {key: 'value'}}},
            rules = '[{"where": "root.nested", "if": {"key": "value"}, "then": {"key": "othervalue"}}]';
        new Localizer(obj).fromString(rules);
        assert.equal(obj.root.nested.key, 'othervalue');
    }
};

Object.keys(Suite).forEach(function (key) {
    if (process.argv.length === 3 && key !== process.argv[2]) return console.log('.', key, 'SKIP');
    if (key.indexOf('test_') !== 0) return console.log('.', key, 'SKIP');
    try {
        Suite[key]();
        console.log('✓', key, 'PASSED');
    }
    catch (err) {
        console.log('✗', key, 'FAIL');
        console.log(err);
    }
});
