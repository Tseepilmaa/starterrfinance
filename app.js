 //delgetstei ajillah controller
 var uiController = (function () {

     var DOMstrings = {
         inputType: ".add__type",
         inputDescription: ".add__description",
         inputValue: ".add__value",
         addBtn: ".add__btn",
         incomeList: ".income__list",
         expenseList: ".expenses__list",
         tusuvLabel: ".budget__value",
         incomeLabel: ".budget__income--value",
         expenseLabel: ".budget__expenses--value",
         percentageLabel: ".budget__expenses--percentage",
         containerDiv: ".container",
         expensePercentageLabel: ".item__percentage",
         dateLabel: ".budget__title--month",
     };

     //NodeList
     var nodeListForEach = function (list, callback) {
         for (var i = 0; i < list.length; i++) {
             callback(list[i], i);
         }
     };
     var formatMoney = function (too, type) {
         //toog temdegt mor bolgoj huwirgah
         too = '' + too;
         var x = too.split("").reverse().join("");

         var y = "";
         var count = 1;

         for (var i = 0; i < x.length; i++) {
             y = y + x[i];

             if (count % 3 === 0) y = y + ",";
             count++;
         }

         var z = y.split("").reverse().join("");

         if (z[0] === ",")
             z = z.substr(1, z.length - 1);

         if (type === 'inc') z = "+ " + z;
         else z = "- " + z;

         return z;
     };
     return {
         getInput: function () {
             return {
                 type: document.querySelector(DOMstrings.inputType).value,
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: parseInt(document.querySelector(DOMstrings.inputValue).value)
             };
         },

         displayPercentages: function (allPercentages) {
             //Зарлагын NodeList-ийг олох
             var elements = document.querySelectorAll(DOMstrings.expensePercentageLabel);
             //Элемент болгоны хувьд зарлагын хувийг массиваас авч шивж оруулах
             nodeListForEach(elements, function (el, index) {
                 el.textContent = allPercentages[index];
             });

         },

         getDOMstrings: function () {
             return DOMstrings;
         },

         //utga oruulah talbar tsewerleh 
         clearFields: function () {
             var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

             //convert list to array
             var fieldsArr = Array.prototype.slice.call(fields);
             fieldsArr.forEach(function (el) {
                 el.value = "";
             });

             fieldsArr[0].focus();
         },

         //Төсвийг вэб дээр харуулах 
         tusuvHaruulah: function (tusuv) {
             var type;
             if (tusuv.tusuv > 0) type = 'inc';
             else type = 'exp';
             document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(tusuv.tusuv, type);
             document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(tusuv.totalInc, 'inc');
             document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(tusuv.totalExp, 'exp');
             if (tusuv.huvi !== 0) {
                 document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + '%';
             } else {
                 document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
             }
         },

         displayDate: function () {
             var today = new Date();
             document.querySelector(DOMstrings.dateLabel).textContent = today.getFullYear() + " оны " + today.getMonth() + " сарын ";
         },

         deleteListItem: function (id) {
             var el = document.getElementById(id);
             el.parentNode.removeChild(el);
         },

         addListItem: function (item, type) {
             var html, list;
             //ter html dotroo orlogo zarlagiin utguudiig replace ashiglaj oorchilj ogno
             if (type === 'inc') {
                 list = DOMstrings.incomeList;
                 html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$Description$$</div><div class="right clearfix"><div class="item__value">$$value$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
             } else {
                 list = DOMstrings.expenseList;
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$Description$$</div><div class="right clearfix"><div class="item__value">$$value$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>'
             }
             html = html.replace('%id%', item.id);
             html = html.replace('$$Description$$', item.description);
             html = html.replace('$$value$$', formatMoney(item.value, type));
             //beltgsn html.ee dom ruu hj ogno

             document.querySelector(list).insertAdjacentHTML('beforeend', html);
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

     //  Тухайн зарлага нийт орлогын хэдэн хувийг эзэлж байгааг бодох
     Expense.prototype.calcPercentage = function (totalInc) {
         if (totalInc > 0)
             this.percentage = Math.round((this.value / totalInc) * 100)
         else
             this.percentage = 0;
     }

     //  Бодсон утгаа буцах
     Expense.prototype.getPercentage = function () {
         return this.percentage;
     }

     var calculateTotal = function (type) {
         var sum = 0;
         data.items[type].forEach(function (el) {
             sum += el.value;
         });

         data.totals[type] = sum;
     }

     var data = {
         items: {
             inc: [],
             exp: []
         },

         totals: {
             inc: 0,
             exp: 0
         },

         tusuv: 0,
         huvi: 0
     };

     return {
         tusuvTootsooloh: function () {

             //Нийт орлогын нийлбэрийг тооцоолно
             calculateTotal('inc');

             //Нийт зарлагын нийлбэрийг тооцоолно
             calculateTotal('exp');

             //Төсвийг шинээр тооцоолно
             data.tusuv = data.totals.inc - data.totals.exp;

             //Орлого зарлагын хувийг тооцоолно
             if (data.totals.inc > 0)
                 data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
             else
                 data.huvi = 0;
         },

         //Өөрийгөө нийт орлогоос хэдэн хувийг эзэлж байгааг олох
         calculatePercentages: function () {
             data.items.exp.forEach(function (el) {
                 el.calcPercentage(data.totals.inc);
             });
         },

         //buh elementiin huwiig aguulsan massiv uusgej butsaah
         getPercentages: function () {
             var allPercentages = data.items.exp.map(function (el) {
                 return el.getPercentage();
             });
             return allPercentages;
         },

         tusuvAvah: function () {
             return {
                 tusuv: data.tusuv,
                 huvi: data.huvi,
                 totalInc: data.totals.inc,
                 totalExp: data.totals.exp
             }
         },

         deleteItem: function (type, id) {
             //ids massivt data.items[type].iin id.uudiig hiine. map ashiglaj type ni inc exp 2.n ali 1 bna
             var ids = data.items[type].map(function (el) {
                 return el.id;
             });
             //damjigdaj irsen id ids massivt heddugeeer index deer bgaag olj hadgalna
             var index = ids.indexOf(id);

             //index ni -1.ees ylgaatai uyd
             if (index !== -1) {
                 //data.items[type]-aas splice ashiglaj elementiig ustgah
                 data.items[type].splice(index, 1);
             }
         },


         addItem: function (type, desc, val) {
             //console.log("item added");
             var item, id;
             if (data.items[type].length === 0) {
                 id = 1;
             } else {
                 id = data.items[type][data.items[type].length - 1].id + 1;
             }

             if (type === "inc") {
                 item = new Income(id, desc, val);
             } else {
                 item = new Expense(id, desc, val);
             }
             data.items[type].push(item);

             return item;
         },

         seeData: function () {
             return data;
         }

     };

 })();

 //programiig holbogch controller
 var appController = (function (uiController, financeController) {


     var ctrlAddItem = function () {

         var input = uiController.getInput();

         //Оруулж байгаа талбар 2лаа хоосон биш үед доторх үйлдлүүдийг хийнэ.
         if (input.description !== '' && input.value !== '') {
             //Олж авсан өгөгдлүүдээ санхүүгийн контроллэрт дамжуулж тэндээ хадгална
             var item = financeController.addItem(input.type, input.description, input.value);

             //Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт гаргана
             uiController.addListItem(item, input.type);
             uiController.clearFields();

             //Төсвийг шинээр тооцоолоод дэлгэцэнд гаргах функц
             updateTusuv();
         }

     };

     var updateTusuv = function () {
         //Төсвийг тооцоолно
         financeController.tusuvTootsooloh();

         //Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана
         var tusuv = financeController.tusuvAvah();

         //Төсвийн тооцоог дэлгэцэнд гаргах
         uiController.tusuvHaruulah(tusuv);

         //Элементүүдийн хувийг тооцоолно
         financeController.calculatePercentages();
         //Элементүүдийн хувийг хүлээж авна
         var allPercentages = financeController.getPercentages();
         //Дэлгэцэнд гаргана
         uiController.displayPercentages(allPercentages);
     }

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

         document.querySelector(DOM.containerDiv).addEventListener('click', function (event) {
             var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
             if (id) {
                 var arr = id.split('-');
                 var type = arr[0];
                 var itemId = parseInt(arr[1]);
                 //1 Cанхүүгийн модулиас type , id ашиглаад устгана
                 financeController.deleteItem(type, itemId);
                 //2 Дэлгэц дээрээс энэ элементийг устгана
                 uiController.deleteListItem(id);
                 //3 Үлдэгдэл тооцоог шинэчилж харуулна
                 updateTusuv();
             }
         });



     }

     return {
         init: function () {
             console.log("APP started..");
             uiController.displayDate();
             uiController.tusuvHaruulah({
                 tusuv: 0,
                 huvi: 0,
                 totalInc: 0,
                 totalExp: 0
             })
             setupEventListeners();
         }
     }

 })(uiController, financeController);

 appController.init();