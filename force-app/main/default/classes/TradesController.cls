public without sharing class TradesController {

    //Method used get the Booked Trades
    @AuraEnabled
    public static List<Trade__c> getTrades() {
        return [
            SELECT  Id,Sell_Currency__c, Sell_Amount__c, Buy_Currency__c, Buy_Amount__c, Rate__c, Date_Booked__c 
            FROM Trade__c
        ];
    }
    @AuraEnabled
    public static Decimal makeGetCallout(String valueSellCurrency, String valueBuyCurrency) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String Url='http://data.fixer.io/api/';
        String endpoint = 'latest';
        String access_key = 'a4d185605657542cc0ab809df043b9d9';  
        request.setEndpoint(Url+endpoint+'?access_key='+access_key+'&base='+valueSellCurrency+'&symbols='+valueBuyCurrency);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        //If the request is successful, parse the JSON response.   
        if(response.getStatusCode() == 200) {
            system.debug(response.getBody());
            Map<String, Object> payload = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
            try{
                Map<String, Object> rates = (Map<String, Object>)payload.get('rates'); 
                return (Decimal)rates.get(valueBuyCurrency);
            }catch(Exception e){
                Map<String, Object> error = (Map<String, Object>)payload.get('error'); 
                Decimal errorCode=(Decimal)error.get('code');
                String errorType=(String)error.get('type');
                throw new AuraHandledException('Error '+errorCode+' '+ errorType);
            }
        }
        return null;
        
    }
}