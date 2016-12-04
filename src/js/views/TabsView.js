import ChartView from './ChartView.js';

export default class TabsView {
    constructor (view) {
        this.view = view;
        this._all = [];
        this._rendered = new WeakSet();
        this._activeIndex = 0;

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
            let tabTitleClose = this._element({
                className: 'tabs-header-item-close',
                innerText: 'x'
            });
            tabTitle.appendChild(tabTitleClose);
            tabTitleClose.addEventListener('click', this._removeItem.bind(this, item));
            tabTitle.addEventListener('click', this._setActive.bind(this, item));
            this._tabsHeader.appendChild(tabTitle);

            let tabContent = this._element({
                className: 'tabs-content-item'
            });
            tabContent.appendChild(item.chart);
            this._tabsContent.appendChild(tabContent);

            this._rendered.add(item);
        })
    }

    _updateSelectedIndex (selector, activeIndex) {
        let elements = Array.from(this.view.querySelectorAll(selector));
        elements.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    _removeElementByIndex (selector, index) {
        let elements = Array.from(this.view.querySelectorAll(selector));
        let elementToRemove = elements[index];
        if (elementToRemove) {
            elementToRemove.parentElement.removeChild(elementToRemove);
        }
    }

    _removeItem (item, event) {
        event.stopPropagation();
        let index = this._all.indexOf(item);
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

    _setActive (item) {
        let activeIndex = this._all.indexOf(item);
        if (activeIndex === -1) {
            return false;
        }
        this._activeIndex = activeIndex;
        this._updateSelectedIndex('.tabs-header-item', activeIndex);
        this._updateSelectedIndex('.tabs-content-item', activeIndex);
    }

    add (title, data) {

        let chart = document.createElement('div');
        new ChartView(chart, data);

        let item = {title, chart};
        this._all.push(item);
        this._render();
        this._setActive(item);
    }
}
