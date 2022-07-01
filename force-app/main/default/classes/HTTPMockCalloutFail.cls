@isTest
global class HTTPMockCalloutFail implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        string jsonResBody = '{"success":false,"error":{"code":105,"type":"base_currency_access_restricted"}}';
        res.setBody(jsonResBody);
        res.setStatusCode(200);
        return res;
    }
}
