import YQLQueryService from './services/YQLQueryService.js';
import FormView from './views/FormView.js';

const query = new YQLQueryService();

let startTime = (new Date('2016-11-03')).getTime();
let endTime = (new Date('2016-12-03')).getTime();

query.get('YHOO', startTime, endTime);


const form = new FormView(document.querySelector('#form'));

