 //delgetstei ajillah controller
 var uiController = (function () {

     var DOMstrings = {
         inputType: ".add__type",
         inputDescription: ".add__description",
         inputValue: ".add__value",
         addBtn: ".add__btn",
     };
     return {
         getInput: function () {
             return {
                 type: document.querySelector(DOMstrings.inputType).value,
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: document.querySelector(DOMstrings.inputValue).value
             };
         },

         getDOMstrings: function () {
             return DOMstrings;
         }
     };
 })();

 //sanhuutei ajillah controller
 var financeController = (function () {
     var Income = function (id, description, value) {
         this.id = id;
         this.description = description;
         this.value = value;
     }
     var Expense = function (id, description, value) {
         this.id = id;
         this.description = description;
         this.value = value;
     }

     var i1 = new Income(1, "Tsalin", 2500000);
     var i2 = new Income(2, "Uramshuulal", 25000000);

     var data = {
         allItems: {
             inc: [],
             exp: []
         },

         totals: {
             inc: 0,
             exp: 0
         }
     }
 })();

 //programiig holbogch controller
 var appController = (function (uiController, financeController) {


     var ctrlAddItem = function () {
         console.log(uiController.getInput());
     };

     var setupEventListeners = function () {

         var DOM = uiController.getDOMstrings();

         document.querySelector(DOM.addBtn).addEventListener('click', function () {
             ctrlAddItem();
         });
         document.addEventListener('keypress', function (event) {
             if (event.keyCode === 13 || event.which === 13) {
                 ctrlAddItem();
             }
         });
     }

     return {
         init: function () {
             console.log("APP started..");
             setupEventListeners();
         }
     }

 })(uiController, financeController);

 appController.init();