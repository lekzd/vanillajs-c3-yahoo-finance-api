(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _YQLQueryService = require('./services/YQLQueryService.js');

var _YQLQueryService2 = _interopRequireDefault(_YQLQueryService);

var _FormView = require('./views/FormView.js');

var _FormView2 = _interopRequireDefault(_FormView);

var _TabsView = require('./views/TabsView.js');

var _TabsView2 = _interopRequireDefault(_TabsView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var query = new _YQLQueryService2.default();

var form = new _FormView2.default(document.querySelector('#form'));
var tabs = new _TabsView2.default(document.querySelector('#tabs'));
var spinner = document.querySelector('#spinner');

form.onSubmit = function (_ref) {
    var code = _ref.code,
        from = _ref.from,
        to = _ref.to;

    var startTime = new Date(from).getTime();
    var endTime = new Date(to).getTime();
    spinner.classList.remove('hidden');

    query.get(code, startTime, endTime).then(function (data) {
        var title = code + ' (' + from + ' - ' + to + ')';
        tabs.add(title, data);
        spinner.classList.add('hidden');
    });
};

},{"./services/YQLQueryService.js":3,"./views/FormView.js":5,"./views/TabsView.js":6}],2:[function(require,module,exports){
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
            return this._request(url);
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

var ChartView = function () {
    function ChartView(view, data) {
        _classCallCheck(this, ChartView);

        this.view = view;
        this.uid = 'chart-' + Math.random().toString(16).substring(2);

        this._render(data);
    }

    _createClass(ChartView, [{
        key: '_element',
        value: function _element(attributes) {
            var element = document.createElement('div');
            Object.assign(element, attributes);
            return element;
        }
    }, {
        key: '_displayNoDataLabel',
        value: function _displayNoDataLabel() {
            var label = this._element({ innerText: 'No data to display, try to chose different period' });
            this.view.appendChild(label);
        }
    }, {
        key: '_generateChart',
        value: function _generateChart(data) {
            var date = [],
                close = [],
                high = [],
                low = [],
                open = [];
            if (data.query.count === 0) {
                this._displayNoDataLabel();
                return false;
            }
            var results = data.query.results.quote;

            results.forEach(function (item) {
                date.push(item.Date);
                close.push(parseFloat(item.Close));
                high.push(parseFloat(item.High));
                low.push(parseFloat(item.Low));
                open.push(parseFloat(item.Open));
            });

            c3.generate({
                bindto: '#' + this.uid,
                size: {
                    height: 600
                },
                data: {
                    x: 'x',
                    columns: [['x'].concat(date), ['close'].concat(close), ['high'].concat(high), ['low'].concat(low), ['open'].concat(open)]
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d'
                        }
                    }
                },
                zoom: {
                    enabled: true
                },
                subchart: {
                    show: true,
                    size: {
                        height: 20
                    }
                }
            });
        }
    }, {
        key: '_render',
        value: function _render(data) {
            this.view.appendChild(this._element({ id: this.uid }));

            setTimeout(this._generateChart.bind(this, data));
        }
    }]);

    return ChartView;
}();

exports.default = ChartView;

},{}],5:[function(require,module,exports){
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
        key: 'onSubmit',
        value: function onSubmit() {}
    }, {
        key: '_onSubmit',
        value: function _onSubmit(event) {
            event.preventDefault();
            var data = Object.create(null);
            new FormData(this.view).forEach(function (value, key) {
                data[key] = value;
            });
            this.onSubmit(data);
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            this.view.addEventListener('submit', this._onSubmit.bind(this));
        }
    }]);

    return FormView;
}();

exports.default = FormView;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChartView = require('./ChartView.js');

var _ChartView2 = _interopRequireDefault(_ChartView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TabsView = function () {
    function TabsView(view) {
        _classCallCheck(this, TabsView);

        this.view = view;
        this._all = [];
        this._rendered = new WeakSet();
        this._activeIndex = 0;

        this._tabsHeader = this._element({ className: 'tabs-header' });
        this.view.appendChild(this._tabsHeader);

        this._tabsContent = this._element({ className: 'tabs-content' });
        this.view.appendChild(this._tabsContent);
    }

    _createClass(TabsView, [{
        key: '_element',
        value: function _element(attributes) {
            var element = document.createElement('div');
            Object.assign(element, attributes);
            return element;
        }
    }, {
        key: '_render',
        value: function _render() {
            var _this = this;

            this._all.forEach(function (item) {
                if (_this._rendered.has(item)) {
                    return true;
                }
                var tabTitle = _this._element({
                    className: 'tabs-header-item',
                    innerText: item.title
                });
                var tabTitleClose = _this._element({
                    className: 'tabs-header-item-close',
                    innerText: 'x'
                });
                tabTitle.appendChild(tabTitleClose);
                tabTitleClose.addEventListener('click', _this._removeItem.bind(_this, item));
                tabTitle.addEventListener('click', _this._setActive.bind(_this, item));
                _this._tabsHeader.appendChild(tabTitle);

                var tabContent = _this._element({
                    className: 'tabs-content-item'
                });
                tabContent.appendChild(item.chart);
                _this._tabsContent.appendChild(tabContent);

                _this._rendered.add(item);
            });
        }
    }, {
        key: '_updateSelectedIndex',
        value: function _updateSelectedIndex(selector, activeIndex) {
            var elements = Array.from(this.view.querySelectorAll(selector));
            elements.forEach(function (item, index) {
                if (index === activeIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }, {
        key: '_removeElementByIndex',
        value: function _removeElementByIndex(selector, index) {
            var elements = Array.from(this.view.querySelectorAll(selector));
            var elementToRemove = elements[index];
            if (elementToRemove) {
                elementToRemove.parentElement.removeChild(elementToRemove);
            }
        }
    }, {
        key: '_removeItem',
        value: function _removeItem(item, event) {
            event.stopPropagation();
            var index = this._all.indexOf(item);
            if (index === -1) {
                return false;
            }
            this._all.splice(index, 1);
            this._removeElementByIndex('.tabs-header-item', index);
            this._removeElementByIndex('.tabs-content-item', index);

            if (this._activeIndex === index && this._all.length) {
                this._setActive(this._all[0]);
            }
        }
    }, {
        key: '_setActive',
        value: function _setActive(item) {
            var activeIndex = this._all.indexOf(item);
            if (activeIndex === -1) {
                return false;
            }
            this._activeIndex = activeIndex;
            this._updateSelectedIndex('.tabs-header-item', activeIndex);
            this._updateSelectedIndex('.tabs-content-item', activeIndex);
        }
    }, {
        key: 'add',
        value: function add(title, data) {

            var chart = document.createElement('div');
            new _ChartView2.default(chart, data);

            var item = { title: title, chart: chart };
            this._all.push(item);
            this._render();
            this._setActive(item);
        }
    }]);

    return TabsView;
}();

exports.default = TabsView;

},{"./ChartView.js":4}]},{},[1]);
