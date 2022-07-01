@isTest
public class TradesController_Test {

    @testSetup
    static void demoTestSetUp(){
        Trade__c newTrade = new Trade__c(Buy_Amount__c=100, 
                                Buy_Currency__c='EUR',
                                Date_Booked__c=Datetime.now(), 
                                Rate__c=1.33,Sell_Amount__c=200, 
                                Sell_Currency__c='USD');
        insert newTrade;
    }
    @isTest
    static void validategetTrades() {
        List<Trade__c> trades = [SELECT  Id,Sell_Currency__c, Sell_Amount__c, Buy_Currency__c, Buy_Amount__c, Rate__c, Date_Booked__c FROM Trade__c];
        system.debug(trades);
        Test.startTest();
        List<Trade__c> checkTrades = TradesController.getTrades();
        Test.stopTest();

        System.assertEquals('USD', checkTrades[0].Sell_Currency__c );
    }
    testMethod static void testCallout() {
        Test.startTest();
         // Set mock callout class 
        Test.setMock(HttpCalloutMock.class, new HTTPMockCallout());
        Decimal response = TradesController.makeGetCallout('EUR','USD');
        Test.stopTest();
        System.assertEquals(1.17188, response);
    }
    testMethod static void testCalloutFail() {
       
        try{
        Test.startTest();
         // Set mock callout class 
        Test.setMock(HttpCalloutMock.class, new HTTPMockCalloutFail());
        Decimal response = TradesController.makeGetCallout('EUR','USD');
        Test.stopTest();
        }
        catch(Exception e){
        }
    }
}
