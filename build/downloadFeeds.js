'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getJsonCveFeeds = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Author: Uday Korlimarla
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Copyright (c) Inspektre Pty Ltd
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */


// Generate uris for NVD JSON Feed
var generateUris = function generateUris() {
    var entries = [];
    var maxYear = new Date().getFullYear();
    for (var i = 2002; i <= maxYear; i++) {
        entries.push(i);
    }
    entries.concat(['modified', 'recent']);
    return entries.map(function (entry) {
        return { name: '' + entry, uri: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-' + entry + '.json.gz' };
    });
};

// Read gz compressed files and extract the json files
var writeNvDFeedJson = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name, file) {
        var contents, writeStream, unzip;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        contents = _fs2.default.createReadStream(file);
                        writeStream = _fs2.default.createWriteStream('./feeds/nvdcve-1.1-' + name + '.json');
                        unzip = _zlib2.default.createGunzip();

                        contents.pipe(unzip).pipe(writeStream);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function writeNvDFeedJson(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

// Download a single feed from entry param
var feedDownload = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(entry) {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _nodeFetch2.default)(entry.uri).catch(function (err) {
                            console.log('Failed to get entry for feed: ' + entry.name + ', URI at: ' + entry.uri);
                        });

                    case 2:
                        res = _context2.sent;
                        _context2.next = 5;
                        return new Promise(function (resolve, reject) {
                            var cfile = 'feeds/nvdcve-1.1-' + entry.name + '.gz';
                            var fileStream = _fs2.default.createWriteStream(cfile);
                            res.body.pipe(fileStream);
                            res.body.on("error", function (err) {
                                fileStream.close();
                                reject(err);
                            });
                            fileStream.on("finish", function () {
                                fileStream.close();
                                console.log("extracting", cfile);
                                writeNvDFeedJson(entry.name, cfile);
                                resolve();
                            });
                        });

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function feedDownload(_x3) {
        return _ref2.apply(this, arguments);
    };
}();

// Download All NVD Feeds and save JSON
var getJsonCveFeeds = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!_fs2.default.existsSync('feeds')) {
                            _fs2.default.mkdirSync('feeds');
                        }
                        _context3.next = 3;
                        return generateUris().forEach(function (entry) {
                            return feedDownload(entry);
                        });

                    case 3:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getJsonCveFeeds() {
        return _ref3.apply(this, arguments);
    };
}();

exports.getJsonCveFeeds = getJsonCveFeeds;