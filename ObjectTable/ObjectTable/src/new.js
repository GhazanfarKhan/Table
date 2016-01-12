var app = angular.module('myApp', ['smart-table', 'lrDragNDrop', 'ngAnimate', 'angularUtils.directives.dirPagination', 'ui.sortable']);
 
app.controller('TableController', ['$scope', '$filter', '$timeout', '$rootScope', 'CommonOperation','$localstorage', function ($scope, $filter, $timeout, $rootScope, CommonOperation, $localstorage) {
    $scope.id = 1;
    $scope.selectedFilter = '';

    $scope.advanceSearch = [
        {
            selectedField: '',
            selectedFilter: '',
            searchValue: '',
            operator: ''
        }
    ];

    $scope.savedSearch = [];

    $scope.criteria = {
        page: 1,
        pagesize: 5,
    };

    $scope.paging = {
        total: 0,
        totalpages: 0,
        showing: 0,
        pagingOptions: [5, 10, 20, 30, 40, 50]
    };

    $scope.options = {
        selectedField: '',
        selectedFilter: '',
        searchValue: ''
    }

    $scope.topic = {
        "Id": "",
        "Title": "",
        "Content": "",
        "Status": "",
        "IsActive": true,
        "IsCommentAllowed": true,
        "IsRatingAllowed": true,
        "isSelected": false
    }

    $scope.filters = {
        "Id": "",
        "Title": "",
        "Content": "",
        "Status": "",
        "IsActive": "",
        "IsCommentAllowed": "",
        "IsRatingAllowed": ""
    };

    
    //Sample datas
    var topic = [
         {
             "Id": 1,
             "Title": "AA Integration1",
             "Content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel magna dolor. Nam dign",
             "Status": "Recent",
             "IsActive": true,
             "IsCommentAllowed": false,
             "IsRatingAllowed": true,
             "isSelected": false

         },
         {
             "Id": 2,
             "Title": "BB Integration2",
             "Content": "Curabitur tellus eros, luctus nec ante accumsan,e",

             "Status": "Recent",
             "IsActive": true,
             "IsCommentAllowed": false,
             "IsRatingAllowed": false,
             "isSelected": false

         },
         {
             "Id": 3,
             "Title": "CC Integration3",
             "Content": "Phasellus convallis ex ac diam volutpat finibus. Cras iaculis est rhoncus quam efficitur, s",

             "Status": "Most Viewed",
             "IsActive": true,
             "IsCommentAllowed": false,
             "IsRatingAllowed": true,
             "isSelected": false

         },
         {
             "Id": 4,
             "Title": "DD Integration4",
             "Content": "Aenean leo dui, posuere non sodales et, feugiat eget ipsum. In scelerisque nunc quis tortor condimentum,",

             "Status": "Featured",
             "IsActive": true,
             "IsCommentAllowed": true,
             "IsRatingAllowed": true,
             "isSelected": false

         },
         {
             "Id": 5,
             "Title": "EE Integration5",
             "Content": "Pellentesque magna nisl, bibendum non gravida ut, tristique sed sem. ",

             "Status": "Removed",
             "IsActive": false,
             "IsCommentAllowed": false,
             "IsRatingAllowed": false,
             "isSelected": false

         },
         {
             "Id": 6,
             "Title": "FF Integration5",
             "Content": "Fdshsdtesque magna nisl, bibendum non gravida ut, tristique sed sem. ",
             "Status": "Pending",
             "IsActive": true,
             "IsCommentAllowed": false,
             "IsRatingAllowed": false,
             "isSelected": false

         }
    ];


    function generateRandomItem(id) {

        var Id = topic[Math.floor(Math.random() * 3)].Id;
        var Title = topic[Math.floor(Math.random() * 3)].Title;
        var Content = topic[Math.floor(Math.random() * 3)].Content;
        var Status = topic[Math.floor(Math.random() * 3)].Status;
        var IsActive = topic[Math.floor(Math.random() * 3)].IsActive;
        var IsCommentAllowed = topic[Math.floor(Math.random() * 3)].IsCommentAllowed;
        var IsRatingAllowed = topic[Math.floor(Math.random() * 3)].IsRatingAllowed;

        return {
            "Id": Id,
            "Title": Title,
            "Content": Content,
            "Status": Status,
            "IsActive": IsActive,
            "IsCommentAllowed": IsCommentAllowed,
            "IsRatingAllowed": IsRatingAllowed,
            "isSelected": false
        }
    }

   
    if ($localstorage.getObject('columns') != null) {
        $scope.columns = angular.copy($localstorage.getObject('columns'));
    }
    else {
        $scope.columns = [
       { header: 'Id', field: 'Id', show: true },
       { header: 'Title', field: 'Title', show: true},
       { header: 'Content', field: 'Content', show: true },
       { header: 'Status', field: 'Status', show: true },
       { header: 'Active', field: 'IsActive', show: true},
       { header: 'Comments Allowed', field: 'IsCommentAllowed', show: true},
       { header: 'Rating Allowed', field: 'IsRatingAllowed', show: true }

        ];
    }
   
    //watch for column change and store in local Storage
    $scope.$watch('columns', function (newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
            $localstorage.setObject('columns', $scope.columns);
         }
    }, true);


 

    $scope.rowCollection = [];

    for (id = 0; id < topic.length ; id++) {
        $scope.rowCollection.push(topic[id]);
    }

    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.displayedCollection = [].concat($scope.rowCollection);

    //add to the real data holder
    $scope.addRandomItem = function addRandomItem() {
        $scope.rowCollection.push(generateRandomItem(id));
        id++;
        $scope.$emit('ItemAdded', $scope.rowCollection[$scope.rowCollection.length - 1]);

    };

    //remove to the real data holder
    $scope.removeItem = function removeItem(index) {
        if (index !== -1) {
            //for paging alphabets
            $scope.$emit('ItemDeleted', $scope.rowCollection[index]);
            $scope.rowCollection.splice(index, 1);
           
          
        }
    }
    //batch delete
    $scope.deleteItem = function deleteItem() {
        var items = findSelectedItem();
        if (items.length > 1) {

            if (items.length == $scope.rowCollection.length) {
                //changes for all select checkbox 
                $scope.$emit("AllRowsDeleted", true);

            }
            for (var i = 0; i < items.length; i++) {
                var index = $scope.rowCollection.indexOf(items[i]);

                //for paging alphabets
                $scope.$emit('ItemDeleted', $scope.rowCollection[index]);
               
                $scope.rowCollection.splice(index, 1);
     
            }
           

        }
        else {
            alert('Please select more than one item')
        }

    }
    //update item
    $scope.updateItem = function (index) {
        if (index != -1) {
            $scope.topic = angular.copy($scope.rowCollection[index]);
            $('#updateModal').modal('show');

        }
    }

    //update single 
    $scope.update = function () {
        var items = Enumerable.From($scope.rowCollection).Where(function (x) { return x.Id == $scope.topic.Id }).FirstOrDefault();
        if (items != undefined) {
            var index = $scope.rowCollection.indexOf(items);
            //updating paging
            $scope.$emit('ItemUpdated', { previous: $scope.rowCollection[index], current: $scope.topic });
            $scope.rowCollection[index].Title = $scope.topic.Title;
            $scope.rowCollection[index].Content = $scope.topic.Content;
            $scope.rowCollection[index].Status = $scope.topic.Status;
            $scope.rowCollection[index].IsActive = ($scope.topic.IsActive == "true") ? true : false;
            $scope.rowCollection[index].IsCommentAllowed = ($scope.topic.IsCommentAllowed == "true") ? true : false;
            $scope.rowCollection[index].IsRatingAllowed = ($scope.topic.IsRatingAllowed == "true") ? true : false;
            $('#updateModal').modal('hide');
            //empty scope model
            empty();
        }


    }

    //update modal
    $scope.updateModal = function updateItem() {
        var items = findSelectedItem();
        //if (items.length == 1) {
        //    $scope.topic = items[0];
        //}
        if (items.length > 1) {
            $('#myModal').modal('show');

        }
        else {
            alert('Please select  more than one item')
        }


    }
    //bacthUpdate
    $scope.batchUpdate = function () {

        var items = findSelectedItem();
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                var index = $scope.rowCollection.indexOf(items[i]);
                //$scope.$emit('ItemUpdated', { previous: $scope.rowCollection[index], current: $scope.topic });
                //$scope.rowCollection[index].Title = $scope.topic.Title;
                //$scope.rowCollection[index].Content = $scope.topic.Content;
                $scope.rowCollection[index].Status = $scope.topic.Status;
                $scope.rowCollection[index].IsActive = ($scope.topic.IsActive == "true") ? true : false;
                $scope.rowCollection[index].IsCommentAllowed = ($scope.topic.IsCommentAllowed == "true") ? true : false;
                $scope.rowCollection[index].IsRatingAllowed = ($scope.topic.IsRatingAllowed == "true") ? true : false;
            }
            $('#myModal').modal('hide');

            //empty scope model
            empty();
        }
        else {
            alert('Please select more than one item')
        }



    };
    //find Selected item
    function findSelectedItem() {
        var items = Enumerable.From($scope.rowCollection).Where(function (x) { return x.isSelected == true }).ToArray();
        return items;
    }

    //hide update modal
    $scope.hide = function () {
        $('#myModal').modal('hide');
        $('#updateModal').modal('hide');

    }
    

    //export table
    $scope.export = function (type) {
        $('#myTable').tableExport({ type: type, escape: 'false' });
    };


    //watching alphabetic page click
    $scope.$on('alphabeticPageClick', function (event, data) {
        if (data.Count != 0) {
            $scope.options.searchValue = data.letter;
            $scope.options.selectedField = data.field;
            $scope.options.selectedFilter = data.filter;

        }

        console.log(data);
    });

    //empty topic model
    function empty() {
        $scope.topic = {
            "Id": "",
            "Title": "",
            "Content": "",
            "Status": "",
            "IsActive": true,
            "IsCommentAllowed": true,
            "IsRatingAllowed": true,
            "isSelected": false
        }
    }

    //open advance search model
    $scope.advanceSearchModal = function () {
        $('#advanceSearchModal').modal('show');
    }

    // add row in advance search modal
    $scope.advanceSearch_Add = function () {
        $scope.advanceSearch.push({
            selectedField: '',
            selectedFilter: '',
            searchValue: '',
            type: ''
        });

        $('#advanceSearchModal').modal('show');
    }

    // remove row in advance search modal
    $scope.advanceSearch_Remove = function () {
        $scope.advanceSearch.pop();
    }

    //advance search 
    $scope.advanceSearch_Search = function () {
        var query = [];
        var result = [];
        var searchQuery = '';
        for (var i = 0; i < $scope.rowCollection.length; i++) {
            for (var j = 0; j < $scope.advanceSearch.length; j++) {
                var field = $scope.advanceSearch[j]["selectedField"];
                var filter = $scope.advanceSearch[j]["selectedFilter"];
                var searchValue = $scope.advanceSearch[j]["searchValue"];
                var operator = '';
                if (j > 0) {
                    operator = $scope.advanceSearch[j - 1]["operator"];
                }

                var result = getFilteredData(filter, $scope.rowCollection[i][field], searchValue);
                if (j == 0) {
                    searchQuery = searchQuery.concat(' ' + result + ' ');

                }
                else if (j == $scope.advanceSearch.length - 1) {
                    searchQuery = searchQuery.concat(' ' + operator + ' ' + result + ' ');

                }

                else {
                    searchQuery = searchQuery.concat(' ' + operator + ' ' + result);
                }



            }
            var finalResult = eval(searchQuery);
            if (finalResult) {
                query.push($scope.rowCollection[i]);
            }
            searchQuery = '';


        }
       
        alert(query.length + ' records found')
        $scope.rowCollection = angular.copy(query);



    }


    //advance search and save
    $scope.advanceSearch_SaveSearch = function () {
        var query = [];
        var result = [];
        var searchQuery = '';
        for (var i = 0; i < $scope.rowCollection.length; i++) {
            for (var j = 0; j < $scope.advanceSearch.length; j++) {
                var field = $scope.advanceSearch[j]["selectedField"];
                var filter = $scope.advanceSearch[j]["selectedFilter"];
                var searchValue = $scope.advanceSearch[j]["searchValue"];
                var operator = '';
                if (j > 0) {
                    operator = $scope.advanceSearch[j - 1]["operator"];
                }

                var result = getFilteredData(filter, $scope.rowCollection[i][field], searchValue);
                if (j == 0) {
                    searchQuery = searchQuery.concat(' ' + result + ' ');

                }
                else if (j == $scope.advanceSearch.length - 1) {
                    searchQuery = searchQuery.concat(' ' + operator + ' ' + result + ' ');

                }

                else {
                    searchQuery = searchQuery.concat(' ' + operator + ' ' + result);
                }



            }
            var finalResult = eval(searchQuery);
            if (finalResult) {
                query.push($scope.rowCollection[i]);
            }
            searchQuery = '';


        }
        alert(query.length + ' records found')
        $scope.displayedCollection = angular.copy(query);

        var person = prompt("Enter Filter Name :", "");
        if (person != null) {
            $scope.savedSearch.push({ Id: person, name: person, search: angular.copy($scope.advanceSearch) });

        }
    }

    //reset advance search and table data to row collection
    $scope.reset = function () {
        $scope.displayedCollection = angular.copy($scope.rowCollection);
        $scope.advanceSearch = [
              {
                  selectedField: '',
                  selectedFilter: '',
                  searchValue: '',
                  operator: ''
              }
        ];
        $scope.mySearch = '';
        $scope.options.searchValue = '';
      
    }

    //apply advance search
    $scope.applyChange = function () {
        if ($scope.mySearch != 'undefined' || $scope.mySearch != "") {
            var search = Enumerable.From($scope.savedSearch).Where(function (x) {
                return x.Id == $scope.mySearch
            }).Select(function (i) {
                return i.search
            }).ToArray();
            $scope.advanceSearch = [];

            for (var i = 0; i < search[0].length; i++) {
                $scope.advanceSearch.push({
                    selectedField: search[0][i]["selectedField"],
                    selectedFilter: search[0][i]["selectedFilter"],
                    searchValue: search[0][i]["searchValue"],
                    operator: search[0][i]["operator"]
                });
            }
        }


    }

    //operator selection in advance search
    function operator(op) {
        switch (op) {
            case '&&':
                {
                    return '&&';
                    break;
                }
            case '||':
                {
                    return '||';
                    break;

                }

        }
    }

    // filter operations in advance search
    function getFilteredData(filter, field, value) {
        switch (filter) {
            case 'Contains': {
                return CommonOperation.ContainsLetter(value, field);
                break;
            }
            case 'StartWith': {
                return CommonOperation.StartWithLetter(value, field);
                break;
            }
            case 'EndWith': {
                return CommonOperation.EndWithLetter(value, field);

                break;
            }
            case 'EqualsLetter': {
                return CommonOperation.EqualsLetter(value, field);

                break;
            }
        }
    }


    $scope.pdf = function () {
        var doc = new jsPDF();

        var specialElementHandlers = {
            '#myTable': function (element, renderer) {
                return true;
            }
        };

        var html = $("#myTable").html();
        doc.fromHTML(html, 200, 200, {
            'width': 500,
            'elementHandlers': specialElementHandlers
        });
        doc.save("Test.pdf");

    }
   
}]);



















// select one row in table
app.directive('csSelect', function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox" ng-model="isChecked"/>',
        scope: {
            row: '=csSelect'
        },
        link: function (scope, element, attr, ctrl) {
            scope.isChecked = false;

            element.bind('change', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });



            scope.$watch('row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    scope.isChecked = true;

                    element.parent().addClass('st-selected');
                } else {
                    scope.isChecked = false;

                    element.parent().removeClass('st-selected');
                }
            });

        }
    };
});

// select all row in table
app.directive('csSelectAll', function ($rootScope) {
    return {
        require: '^stTable',
        template: '<input type="checkbox" ng-model="isChecked"/>',
        scope: {
            rows: '=csSelectAll'
        },
        link: function (scope, element, attr, ctrl) {
            scope.isChecked = false;

            $rootScope.$on('AllRowsDeleted', function (event, data) {
                scope.isChecked = false;
            });

            scope.$watch('isChecked', function (newValue, oldValue) {
                if (newValue === true) {
                    angular.forEach(scope.rows, function (value, key) {
                        value.isSelected = true;
                    });

                } else {

                    angular.forEach(scope.rows, function (value, key) {
                        value.isSelected = false;
                    });




                }
            });

        }
    };
});

app.service('CommonOperation', function () {

    this.StartWithLetter = function (char, value) {
        if (typeof char != 'undefined' && typeof value != 'undefined') {
            var letterMatch = new RegExp(char, 'i');
            if (letterMatch.test(value.substring(0, 1))) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    this.EndWithLetter = function (char, value) {
        if (typeof char != 'undefined' && typeof value != 'undefined') {
            var letterMatch = new RegExp(char, 'i');
            if (letterMatch.test(value.substring(value.length - 1, value.length))) {
                return true;
            }
            else {
                return false;
            }
        }
    }


    this.ContainsLetter = function (char, value) {
        if (typeof char != 'undefined' && typeof value != 'undefined') {
            var letterMatch = new RegExp(char, 'i');
            if (value.indexOf(char) !== -1) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    this.EqualsLetter = function (char, value) {
        if (typeof char != 'undefined' && typeof value != 'undefined') {
            var letterMatch = new RegExp(char, 'i');
            if (char == value) {
                return true;
            }
            else {
                return false;
            }
        }
    }




});

//Main filters operations
app.service('FilterService', function () {

    this.StartWith = function (items, char, key) {
        var filtered = [];
        if (char != "" && key != "") {
            var letterMatch = new RegExp(char, 'i');
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var val = "" + item[key];
                if (letterMatch.test(val.substring(0, 1))) {
                    filtered.push(item);
                }
            }
            return filtered;
        }
        else {
            return items;
        }

    }

    this.EndWith = function (items, char, key) {
        var filtered = [];
        if (char != "" && key != "") {
            var letterMatch = new RegExp(char, 'i');
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var val = "" + item[key];
                if (letterMatch.test(val.substring(item[key].length - 1, item[key].length))) {
                    filtered.push(item);
                }
            }
            return filtered;
        }
        else {
            return items;
        }
    }

    this.Contains = function (items, char, key) {
        var filtered = [];
        if (char != "" && key != "") {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var val = "" + item[key];
                if (val.indexOf(char) !== -1) {
                    filtered.push(item);
                }

            }
            return filtered;
        }
        else {
            return items;
        }
    }


    this.Equals = function (items, char, key) {
        var filtered = [];
        if (char != "" && key != "") {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item[key] == char) {
                    filtered.push(item);
                }

            }
            return filtered;
        }
        else {
            return items;
        }
    }


});



// Main Filter
app.filter('myFilter', ['FilterService', function (FilterService) {

    return function (items, options) {

        switch (options.selectedFilter) {
            case 'Contains':
                {
                    return FilterService.Contains(items, options.searchValue, options.selectedField);
                 }
            case 'Equals':
                {
                    return FilterService.Equals(items, options.searchValue, options.selectedField);
                }
            case 'StartWith':
                {
                    return FilterService.StartWith(items, options.searchValue, options.selectedField);
                }
            case 'EndWith':
                {
                    return FilterService.EndWith(items, options.searchValue, options.selectedField);
                }
            default: {
                return items;
            }

        }
        //alert(options.searchValue + '-' + options.selectedField + '-' + options.selectedFilter);
        //return items;
    }
}]);

// return no of selected rows
app.filter('selected', function () {
    return function (items) {
        return Enumerable.From(items).Where(function (x) {
            return x.show == true
        }).Count();
    }
});

// alphabetic paging directive
app.directive('alphabeticPaging', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            collection: '=items',
            field: '=property',
            filter: '@'
        },
        templateUrl: 'AlphabeticPaging.html',
        link: function (scope, element, attrs) {
            scope.data = [];
            var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            angular.forEach(alphabet, function (letter) {
                var obj = StartWith(letter, scope.collection, scope.field);
                scope.data.push({ letter: letter, field: scope.field, Count: obj, filter: scope.filter });
            });

            function StartWith(letter, items, field) {
                var letterMatch = new RegExp(letter, 'i');
                var obj = Enumerable.From(items).Where(function (x) {
                    return letterMatch.test(x[field].substring(0, 1))
                }).Count();
                return obj;
            }
            scope.pageClick = function (data) {
                $rootScope.$broadcast('alphabeticPageClick', data);
            };


            //Run when item is deleted from list
            $rootScope.$on('ItemDeleted', function (event, data) {
                //first finding the letter and then decrement count
                var obj = Enumerable.From(scope.data).Where(function (x) { return x.letter == data[scope.field].substring(0, 1) }).FirstOrDefault();
                obj.Count--;
            });


            //Run when item is deleted from list
            $rootScope.$on('ItemAdded', function (event, data) {
                //first finding the letter and then decrement count
                var obj = Enumerable.From(scope.data).Where(function (x) { return x.letter == data[scope.field].substring(0, 1) }).FirstOrDefault();
                obj.Count++;
            });

            //Run when item is update from list
            $rootScope.$on('ItemUpdated', function (event, data) {
                // if first letter is same as previous
                if (data.previous[scope.field].substring(0, 1) == data.current[scope.field].substring(0, 1)) {

                }
                    // if different then decr previous and incr current
                else {
                    var prev = Enumerable.From(scope.data).Where(function (x) { return x.letter == data.previous[scope.field].substring(0, 1) }).FirstOrDefault();
                    prev.Count--;

                    var curr = Enumerable.From(scope.data).Where(function (x) { return x.letter == data.current[scope.field].substring(0, 1) }).FirstOrDefault();
                    curr.Count++;

                }
            });


        }
    };
});


// local storage work
app.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            if (typeof defaultValue == 'undefined') {
                defaultValue = null;
            }
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || null);
        }
    }
}]);





function htmltopdf() {
    //var pdf = new jsPDF('p', 'pt', 'letter');
    //source = $('#myTable')[0]; //table Id
    //specialElementHandlers = { 
    //    '#bypassme': function (element, renderer) {
    //        return true
    //    }
    //};
    //margins = { //table margins and width
    //    top: 80,
    //    bottom: 60,
    //    left: 40,
    //    width: 522
    //};
    //pdf.fromHTML(
    //source, 
    //margins.left,
    //margins.top, { 
    //    'width': margins.width, 
    //    'elementHandlers': specialElementHandlers
    //},

    //function (dispose) {
    //    pdf.save('Download.pdf'); //Filename
    //}, margins);

    var pdf = new jsPDF('l', 'pt', 'letter');
    pdf.cellInitialize();
    pdf.setFontSize(10);
    $.each($('#myTable tr'), function (i, row) {
        $.each($(row).find("td, th"), function (j, cell) {
            var txt = $(cell).text().trim() || " ";
            var width = (j == 4) ? 40 : 70; //make with column smaller
            pdf.cell(10, 50, width, 30, txt, i);
        });
    });

    pdf.save('sample-file.pdf');


}