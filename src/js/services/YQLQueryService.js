import HttpService from './HttpService.js';

export default class YQLQueryService {

    constructor() {
        this.baseUrl = 'http://query.yahooapis.com/v1/public/yql';
    }

    _request(url) {
        return HttpService.get(url)
    }

    _formatDate(timestamp) {
        return (new Date(timestamp)).toISOString().split('T').shift()
    }

    _getYQLString(code, timeFrom, timeTo) {
        let dateFrom = this._formatDate(timeFrom);
        let dateTo = this._formatDate(timeTo);
        return `
            select * 
            from 
                yahoo.finance.historicaldata 
            where 
                symbol in ('${code}') and 
                startDate = '${dateFrom}' and 
                endDate = '${dateTo}'
            `
    }

    get(code, timeFrom, timeTo) {
        let params = HttpService.toQueryString({
            q: this._getYQLString(code, timeFrom, timeTo),
            env: 'store://datatables.org/alltableswithkeys',
            format: 'json'
        });
        let url = `${this.baseUrl}?${params}`;
        return this._request(url);
    }

}
