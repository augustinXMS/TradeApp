import { LightningElement, wire, api, track } from 'lwc';
import getTrades from '@salesforce/apex/TradesController.getTrades';
import makeGetCallout from '@salesforce/apex/TradesController.makeGetCallout';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Sell_Currency__c from '@salesforce/schema/Trade__c.Sell_Currency__c';
import Buy_Currency__c from '@salesforce/schema/Trade__c.Buy_Currency__c';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import TRADE_OBJECT from '@salesforce/schema/Trade__c';


const COLS = [
    { label: 'Sell CCY', fieldName: 'Sell_Currency__c' },
    { label: 'Sell Amount', fieldName: 'Sell_Amount__c' },
    { label: 'Buy CCY', fieldName: 'Buy_Currency__c' },
    { label: 'Buy Amount', fieldName: 'Buy_Amount__c' },
    { label: 'Rate', fieldName: 'Rate__c' },
    { label: 'Date Booked', fieldName: 'Date_Booked__c' },
];
export default class TradesLWC extends LightningElement {
    @api recordId;
    columns = COLS;
    draftValues = [];
    @track isModalOpen = false;
    valueSellCurrency = '';
    valueBuyCurrency = '';
    rate;
    amountSellAmount;
    amountBuyAmount;
    errorMessageAmountFlag;
    @track trades;
    disabledSellAmount = true;


    @wire(getObjectInfo, { objectApiName: TRADE_OBJECT })
    tradeInfo;

    @wire(getPicklistValues,
        {
            recordTypeId: '$tradeInfo.data.defaultRecordTypeId',
            fieldApiName: Sell_Currency__c
        }
    )
    Sell_Currency__cValues;
    @wire(getPicklistValues,
        {
            recordTypeId: '$tradeInfo.data.defaultRecordTypeId',
            fieldApiName: Buy_Currency__c
        }
    )
    Buy_Currency__cValues;

    connectedCallback() {
        console.log(this.trades);
        getTrades()
            .then(result => {
                this.trades = result;
            })
            .catch(error => {
                this.error = error;
            });

    }
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        console.log('OK')
        var dateBooked = new Date().toISOString();
        var fields = { 'Buy_Amount__c': this.amountBuyAmount, 'Buy_Currency__c': this.valueBuyCurrency, 'Date_Booked__c': dateBooked, 'Rate__c': this.rate, 'Sell_Amount__c': this.amountSellAmount, 'Sell_Currency__c': this.valueSellCurrency };
        // Record details to pass to create method with api name of Object.
        var objRecordInput = { 'apiName': 'Trade__c', fields };

        // LDS method to create record.
        createRecord(objRecordInput).then(response => {
            alert('New Trade Booked ');
            getTrades()
                .then(result => {
                    this.trades = result;
                    this.trades = [...this.trades];
                })
                .catch(error => {
                    this.error = error;
                });
        }).catch(error => {
            alert('Error: ' + JSON.stringify(error));
        });

        this.isModalOpen = false;
    }

    handleChangeSellCurrency(event) {
        this.valueSellCurrency = event.target.value;
        if (this.valueBuyCurrency != '') {
            makeGetCallout({
                valueSellCurrency: this.valueSellCurrency,
                valueBuyCurrency: this.valueBuyCurrency
            })
                .then(result => {
                    this.rate = result;
                    this.disabledSellAmount = false;
                })
                .catch(error => {
                    const evt = new ShowToastEvent({
                        title: 'Fail',
                        message: error.body.message,
                        variant: 'error',
                    });
                    this.dispatchEvent(evt);
                    console.log('error ' + error);
                });
        }
    }
    handleChangeBuyCurrency(event) {
        this.valueBuyCurrency = event.target.value;
        if (this.valueSellCurrency != '') {
            makeGetCallout({
                valueSellCurrency: this.valueSellCurrency,
                valueBuyCurrency: this.valueBuyCurrency
            })
                .then(result => {
                    this.rate = result;
                    this.disabledSellAmount = false;
                })
                .catch(error => {
                    const evt = new ShowToastEvent({
                        title: 'Fail',
                        message: error.body.message,
                        variant: 'error',
                    });
                    this.dispatchEvent(evt);
                    console.log('error ' + error);
                });
        }
    }
    handleSellAmountChange(event) {
        this.amountSellAmount = event.target.value;
        this.amountBuyAmount = this.amountSellAmount * this.rate;

    }

}