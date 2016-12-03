export default class FormView {
    constructor (view) {
        this.view = view;

        this._bindEvents();
    }

    _onSubmit (event) {
        event.preventDefault();

        console.log('form sent');
    }

    _bindEvents() {
        this.view.addEventListener('submit', this._onSubmit)
    }
}
