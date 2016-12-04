import YQLQueryService from './services/YQLQueryService.js';
import FormView from './views/FormView.js';
import TabsView from './views/TabsView.js';

const query = new YQLQueryService();

const form = new FormView(document.querySelector('#form'));
const tabs = new TabsView(document.querySelector('#tabs'));
const spinner = document.querySelector('#spinner');

form.onSubmit = ({code, from, to}) => {
    let startTime = (new Date(from)).getTime();
    let endTime = (new Date(to)).getTime();
    spinner.classList.remove('hidden');

    query.get(code, startTime, endTime).then((data) => {
        let title = `${code} (${from} - ${to})`;
        tabs.add(title, data);
        spinner.classList.add('hidden');
    });
};
