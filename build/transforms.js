'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runCveMutations = undefined;

var _templateObject = _taggedTemplateLiteral(['\n                mutation CreateCves(\n                    $id: String\n                    $cwes: [Int]\n                    $cpes: [String]\n                    $severity: String\n                    $impactScore: Float\n                    $exploitabilityScore: Float\n                    $baseScore: Float\n                ) {\n                    vuln: CreateCve(\n                        id: $id,\n                        cwes: $cwes,\n                        cpes: $cpes,\n                        severity: $severity,\n                        impactScore: $impactScore,\n                        exploitabilityScore: $exploitabilityScore,\n                        baseScore: $baseScore\n                    ) {\n                        id\n                    }\n                }\n            '], ['\n                mutation CreateCves(\n                    $id: String\n                    $cwes: [Int]\n                    $cpes: [String]\n                    $severity: String\n                    $impactScore: Float\n                    $exploitabilityScore: Float\n                    $baseScore: Float\n                ) {\n                    vuln: CreateCve(\n                        id: $id,\n                        cwes: $cwes,\n                        cpes: $cpes,\n                        severity: $severity,\n                        impactScore: $impactScore,\n                        exploitabilityScore: $exploitabilityScore,\n                        baseScore: $baseScore\n                    ) {\n                        id\n                    }\n                }\n            ']);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _apolloClient = require('apollo-client');

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _apolloLinkHttp = require('apollo-link-http');

var _apolloCacheInmemory = require('apollo-cache-inmemory');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _graphqlTag = require('graphql-tag');

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config();
var cweRex = /[0-9]{1,4}$/;
// const cveRex = /^CVE-[0-9]{1,4}-[0-9]{1,6}$/;

var uri = 'http://localhost:4000';

var client = new _apolloClient2.default({
    link: new _apolloLinkHttp.HttpLink({ uri: uri, fetch: _nodeFetch2.default }),
    cache: new _apolloCacheInmemory.InMemoryCache()
});

// Read the JSON CVE Feeds into an array
var readData = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(year) {
        var file, readFeedsPromise;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        file = 'src/feeds/nvdcve-1.1-' + year + '.json';
                        readFeedsPromise = new Promise(function (resolve, reject) {
                            try {
                                resolve(JSON.parse(_fs2.default.readFileSync(file))["CVE_Items"]);
                            } catch (err) {
                                reject(err);
                            }
                        });
                        return _context.abrupt('return', readFeedsPromise);

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function readData(_x) {
        return _ref.apply(this, arguments);
    };
}();

// Extract CWE IDs
var extractCwe = function extractCwe(entry) {
    var cwes = [];
    entry.cve.problemtype.problemtype_data.forEach(function (problem) {
        problem.description.forEach(function (cwe) {
            var rexMatch = cweRex.exec(cwe.value);
            if (rexMatch) {
                cwes.push(parseInt(rexMatch[0]));
            }
        });
    });
    return [].concat(_toConsumableArray(new Set(cwes)));
};

// Extract CPEs
var extractCpes = function extractCpes(entry) {
    var cpes = [];
    entry.configurations.nodes.forEach(function (node) {
        var cpeEntries = node.cpe_match;
        if (cpeEntries && cpeEntries.length > 0) {
            cpeEntries.forEach(function (cpeEntry) {
                return cpes.push(cpeEntry.cpe23Uri);
            });
        };
    });
    return [].concat(_toConsumableArray(new Set(cpes)));
};

//Transform CVEs to Records
var transformFeeds = function transformFeeds(year) {
    var transformsPromise = new Promise(function (resolve, reject) {
        var cveRecords = [];
        // const cpeRecords = [];
        readData(year).then(function (data) {
            data.forEach(function (entry) {
                var cveRecord = {};

                // CVE-2011-1234

                cveRecord.id = entry.cve["CVE_data_meta"].ID;
                cveRecord.cwes = extractCwe(entry);
                // CPE Configurations
                cveRecord.cpes = extractCpes(entry);

                // CVE Impact
                // console.log(entry.impact);
                // CVE Impact cvss V2
                cveRecord.severity = '';
                cveRecord.impactScore = 0;
                cveRecord.exploitabilityScore = 0;

                cveRecord.baseScore = 0.0;

                if (entry.impact && Object.keys(entry.impact).length > 0 && entry.impact.baseMetricV2 && Object.keys(entry.impact.baseMetricV2).length > 0) {
                    cveRecord.baseScore = entry.impact.baseMetricV2.cvssV2.baseScore;
                    cveRecord.severity = entry.impact.baseMetricV2.severity;
                    cveRecord.impactScore = entry.impact.baseMetricV2.impactScore;
                    cveRecord.exploitabilityScore = entry.impact.baseMetricV2.exploitabilityScore;
                }

                // Create CVE Record
                cveRecords.push(cveRecord);
            });

            resolve(cveRecords);
        }).catch(function (err) {
            reject(err);
        });
    });
    return transformsPromise;
};

var generateCveMutations = function generateCveMutations(records) {
    console.log("records total", records.length);
    return records.map(function (rec) {
        return {
            mutation: (0, _graphqlTag2.default)(_templateObject),
            variables: rec
        };
    });
};

var getCveSeedMutations = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(year) {
        var seedMutationsPromise;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return new Promise(function (resolve, reject) {
                            transformFeeds(year).then(function (data) {
                                console.log("Mutations in total", data.length);
                                resolve(generateCveMutations(data));
                            }).catch(function (err) {
                                return reject(err);
                            });
                        });

                    case 2:
                        seedMutationsPromise = _context2.sent;
                        return _context2.abrupt('return', seedMutationsPromise);

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getCveSeedMutations(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var runCveMutations = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(year) {
        var cveMutations;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return getCveSeedMutations(year);

                    case 2:
                        cveMutations = _context3.sent;

                        if (!cveMutations) {
                            _context3.next = 6;
                            break;
                        }

                        console.log("Mutating now for the year:", year);
                        return _context3.abrupt('return', Promise.all(cveMutations.map(function (_ref4) {
                            var mutation = _ref4.mutation,
                                variables = _ref4.variables;

                            return client.mutate({
                                mutation: mutation,
                                variables: variables
                            }).catch(function (err) {
                                // console.log("Mutation failed");
                                // console.log(Object.keys(err));
                                // console.log(err.networkError);
                                console.log(err.message, variables.id);
                            });
                        })));

                    case 6:
                        ;

                    case 7:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function runCveMutations(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

// const runCveMutations = (year) => {
//     getCveSeedMutations(year)
//     .then(cveMutations => {
//         console.log("Mutatins being set for:", year);
//         cveMutations.forEach(({mutation, variables}) => {
//             client.mutate({
//                 mutation,
//                 variables,
//             })
//             .catch(err => {
//                 // console.log("Mutation failed");
//                 // console.log(Object.keys(err));
//                 // console.log(err.networkError);
//                 console.log(err.message, variables.id);
//             })
//         });
//     })
// };

exports.runCveMutations = runCveMutations;