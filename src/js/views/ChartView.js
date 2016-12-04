export default class ChartView {
    constructor (view, data) {
        this.view = view;
        this.uid = 'chart-' + Math.random().toString(16).substring(2);

        this._render(data);
    }

    _element (attributes) {
        let element = document.createElement('div');
        Object.assign(element, attributes);
        return element
    }

    _generateChart (data) {
        let date = [],
            close = [],
            high = [],
            low = [],
            open = [];
        let results = data.query.results.quote;

        results.forEach((item) => {
            date.push(item.Date);
            close.push(parseFloat(item.Close));
            high.push(parseFloat(item.High));
            low.push(parseFloat(item.Low));
            open.push(parseFloat(item.Open));
        });

        c3.generate({
            bindto: `#${this.uid}`,
            data: {
                x: 'x',
                columns: [
                    ['x'].concat(date),
                    ['close'].concat(close),
                    ['high'].concat(high),
                    ['low'].concat(low),
                    ['open'].concat(open)
                ]
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

    _render (data) {
        this.view.appendChild(this._element({id: this.uid}));

        setTimeout(this._generateChart.bind(this, data));
    }
}