@isTest
global class HTTPMockCallout implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        string jsonResBody = '{"success":true,"timestamp":1632697444,"base":"EUR","date":"2021-09-26","rates":{"USD":1.17188}}';
        res.setBody(jsonResBody);
        res.setStatusCode(200);
        return res;
    }
}