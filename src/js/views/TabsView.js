import ChartView from './ChartView.js';

export default class TabsView {
    constructor (view) {
        this.view = view;
        this._all = [];
        this._rendered = new WeakSet();

        this._tabsHeader = this._element({className: 'tabs-header'});
        this.view.appendChild(this._tabsHeader);

        this._tabsContent = this._element({className: 'tabs-content'});
        this.view.appendChild(this._tabsContent);
    }

    _element (attributes) {
        let element = document.createElement('div');
        Object.assign(element, attributes);
        return element
    }

    _render () {
        this._all.forEach((item) => {
            if (this._rendered.has(item)) {
                return true;
            }
            let tabTitle = this._element({
                className: 'tabs-header-item',
                innerText: item.title
            });
            this._tabsHeader.appendChild(tabTitle);

            let tabContent = this._element({
                className: 'tabs-content-item'
            });
            tabContent.appendChild(item.chart);
            this._tabsHeader.appendChild(tabContent);

            this._rendered.add(item);
        })
    }

    add (title, data) {

        let chart = document.createElement('div');
        new ChartView(chart, data);

        this._all.push({title, chart});
        this._render();
    }
}
