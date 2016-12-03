export default class YQLQueryService {

    constructor() {
        this.baseUrl = 'http://query.yahooapis.com/v1/public/yql';
    }

    __request(url) {

    }

    __getQueryString(query) {
        let params = [];
        for (let key of query) {
            let value = query[key];
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
        return params.join('&');
    }

    __formatDate(timestamp) {
        (new Date(timestamp)).toISOString().split('T').shift()
    }

    __getYQLString(code, timeFrom, timeTo) {
        let dateFrom = this.__formatDate(timeFrom);
        let dateTo = this.__formatDate(timeTo);
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
        let params = {
            query: this.__getYQLString(code, timeFrom, timeTo),
            env: 'store://datatables.org/alltableswithkeys',
            format: 'json'
        };
        let url = `${this.baseUrl}?${this.__getQueryString(params)}`;

    }

}
