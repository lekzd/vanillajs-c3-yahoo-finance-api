import YQLQueryService from './services/YQLQueryService.js';
import FormView from './views/FormView.js';
import TabsView from './views/TabsView.js';

const query = new YQLQueryService();

const form = new FormView(document.querySelector('#form'));
const tabs = new TabsView(document.querySelector('#tabs'));

form.onSubmit = ({code, from, to}) => {
    let startTime = (new Date(from)).getTime();
    let endTime = (new Date(to)).getTime();

    query.get(code, startTime, endTime).then((data) => {
        tabs.add(code, data);
    });
};
