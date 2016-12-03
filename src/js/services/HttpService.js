export default class HttpService {

    static toQueryString(obj) {
        return Object.keys(obj).map(function(key) {
            return `${key}=${encodeURIComponent(obj[key])}`;
        }).join('&');
    }

    static get(url) {
        let request = new XMLHttpRequest();
        return new Promise((resolve) => {
            request.onreadystatechange = () => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        resolve(JSON.parse(request.responseText));
                    }
                }
            };
            request.open('GET', url, true);
            request.send(null);
        });
    }

}
