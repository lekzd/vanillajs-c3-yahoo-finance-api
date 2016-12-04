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
                className: 'tabs-content-item',
                innerHTML: item.content
            });
            this._tabsHeader.appendChild(tabContent);

            this._rendered.add(item);
        })
    }

    add (title, content) {
        this._all.push({title, content});
        this._render();
    }
}
