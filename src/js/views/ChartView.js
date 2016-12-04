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
        c3.generate({
            bindto: `#${this.uid}`,
            data: {
                x: 'x',
                columns: [
                    ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 130, 340, 200, 500, 250, 350]
                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
            }
        });
    }

    _render (data) {
        this.view.appendChild(this._element({id: this.uid}));

        setTimeout(this._generateChart.bind(this, data));
    }
}
