export default class FormView {
    constructor (view) {
        this.view = view;

        this._bindEvents();
    }

    onSubmit () {}

    _onSubmit (event) {
        event.preventDefault();
        let data = Object.create(null);
        (new FormData(this.view)).forEach((value, key) => {
            data[key] = value;
        });
        this.onSubmit(data);
    }

    _bindEvents() {
        this.view.addEventListener('submit', this._onSubmit.bind(this))
    }
}
