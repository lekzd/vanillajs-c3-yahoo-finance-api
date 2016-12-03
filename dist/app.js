(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _YQLQueryService = require('./services/YQLQueryService.js');

var _YQLQueryService2 = _interopRequireDefault(_YQLQueryService);

var _FormView = require('./views/FormView.js');

var _FormView2 = _interopRequireDefault(_FormView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var query = new _YQLQueryService2.default();

var startTime = new Date('2016-11-03').getTime();
var endTime = new Date('2016-12-03').getTime();

query.get('YHOO', startTime, endTime);

var form = new _FormView2.default(document.querySelector('#form'));

},{"./services/YQLQueryService.js":3,"./views/FormView.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpService = function () {
    function HttpService() {
        _classCallCheck(this, HttpService);
    }

    _createClass(HttpService, null, [{
        key: 'toQueryString',
        value: function toQueryString(obj) {
            return Object.keys(obj).map(function (key) {
                return key + '=' + encodeURIComponent(obj[key]);
            }).join('&');
        }
    }, {
        key: 'get',
        value: function get(url) {
            var request = new XMLHttpRequest();
            return new Promise(function (resolve) {
                request.onreadystatechange = function () {
                    if (request.readyState == 4) {
                        if (request.status == 200) {
                            resolve(JSON.parse(request.responseText));
                        }
                    }
                };
                request.open('GET', url, true);
                request.send(null);
            });
        }
    }]);

    return HttpService;
}();

exports.default = HttpService;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HttpService = require('./HttpService.js');

var _HttpService2 = _interopRequireDefault(_HttpService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YQLQueryService = function () {
    function YQLQueryService() {
        _classCallCheck(this, YQLQueryService);

        this.baseUrl = 'http://query.yahooapis.com/v1/public/yql';
    }

    _createClass(YQLQueryService, [{
        key: '_request',
        value: function _request(url) {
            return _HttpService2.default.get(url);
        }
    }, {
        key: '_formatDate',
        value: function _formatDate(timestamp) {
            return new Date(timestamp).toISOString().split('T').shift();
        }
    }, {
        key: '_getYQLString',
        value: function _getYQLString(code, timeFrom, timeTo) {
            var dateFrom = this._formatDate(timeFrom);
            var dateTo = this._formatDate(timeTo);
            return '\n            select * \n            from \n                yahoo.finance.historicaldata \n            where \n                symbol in (\'' + code + '\') and \n                startDate = \'' + dateFrom + '\' and \n                endDate = \'' + dateTo + '\'\n            ';
        }
    }, {
        key: 'get',
        value: function get(code, timeFrom, timeTo) {
            var params = _HttpService2.default.toQueryString({
                q: this._getYQLString(code, timeFrom, timeTo),
                env: 'store://datatables.org/alltableswithkeys',
                format: 'json'
            });
            var url = this.baseUrl + '?' + params;

            this._request(url).then(function (data) {
                console.log(data);
            });
        }
    }]);

    return YQLQueryService;
}();

exports.default = YQLQueryService;

},{"./HttpService.js":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormView = function () {
    function FormView(view) {
        _classCallCheck(this, FormView);

        this.view = view;

        this._bindEvents();
    }

    _createClass(FormView, [{
        key: '_onSubmit',
        value: function _onSubmit(event) {
            event.preventDefault();

            console.log('form sent');
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            this.view.addEventListener('submit', this._onSubmit);
        }
    }]);

    return FormView;
}();

exports.default = FormView;

},{}]},{},[1]);
