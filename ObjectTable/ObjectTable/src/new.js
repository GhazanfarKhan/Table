var app = angular.module('myApp', ['smart-table', 'lrDragNDrop', 'ngAnimate', 'angularUtils.directives.dirPagination', 'ui.sortable']);

app.controller('TableController', ['$scope', '$filter', '$timeout', '$rootScope', 'CommonOperation', function ($scope, $filter, $timeout, $rootScope, CommonOperation) {
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

    $scope.myfilter = [];

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

    $scope.originalColumns = [];
    $scope.newCol = [];

    $scope.columns = [
        { header: 'Id', field: 'Id', show: true, filterValue: '' },
        { header: 'Title', field: 'Title', show: true, filterValue: '' },
        { header: 'Content', field: 'Content', show: true, filterValue: '' },
        { header: 'Status', field: 'Status', show: true, filterValue: '' },
        { header: 'Active', field: 'IsActive', show: true, filterValue: '' },
        { header: 'Comments Allowed', field: 'IsCommentAllowed', show: true, filterValue: '' },
        { header: 'Rating Allowed', field: 'IsRatingAllowed', show: true, filterValue: '' }

    ];

    $scope.originalColumns = angular.copy($scope.columns);


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
        $scope.search();
        //paging
        $scope.$emit('ItemAdded', $scope.rowCollection[$scope.rowCollection.length - 1]);
        if ($scope.criteria.page == 0) {
            $scope.criteria.page = 1;
        }
    };

    //remove to the real data holder
    $scope.removeItem = function removeItem(index) {
        if (index !== -1) {
            //for paging alphabets
            $scope.$emit('ItemDeleted', $scope.rowCollection[index]);

            $scope.rowCollection.splice(index, 1);
            $scope.search();

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
                $scope.search();


            }
            if ($scope.rowCollection.length == 0) {
                $scope.criteria.page = 0;
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
                $scope.$emit('ItemUpdated', { previous: $scope.rowCollection[index], current: $scope.topic });
                $scope.rowCollection[index].Title = $scope.topic.Title;
                $scope.rowCollection[index].Content = $scope.topic.Content;
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
    //config modal
    $scope.showConfigModal = function () {
        $('#configModal').modal('show');
    };

    $scope.saveConfig = function () {
        var header = '';
        var field = '';
        var visibility = '';
        var filterColumn = '';
        var filterValue = '';


        for (var i = 0; i < $scope.columns.length; i++) {
            header += $scope.columns[i].header;
            if (!(i == $scope.columns.length - 1)) {
                header += ",";
            }

        }
        for (var i = 0; i < $scope.columns.length; i++) {
            field += $scope.columns[i].field;
            if (!(i == $scope.columns.length - 1)) {
                field += ",";
            }
        }
        for (var i = 0; i < $scope.columns.length; i++) {
            visibility += $scope.columns[i].show;
            if (!(i == $scope.columns.length - 1)) {
                visibility += ",";
            }
        }

        for (var i = 0; i < $scope.columns.length; i++) {
            filterValue += $scope.filters[$scope.columns[i].field];
            if (!(i == $scope.columns.length - 1)) {
                filterValue += ",";
            }
        }

        var person = prompt("Please enter your name", "");
        if (person != null) {
            $scope.myfilter.push({ Id: $scope.id++, name: person, header: header, field: field, visibility: visibility, filterValue: filterValue });
            $('#configModal').modal('hide');

        }



    };

    $scope.selectFilter = function () {
        var data = Enumerable.From($scope.myfilter).Where(function (x) {
            return x.Id == $scope.selectedFilter
        }).FirstOrDefault();

        if ($scope.selectedFilter == 0) {
            $scope.columns = angular.copy($scope.originalColumns);
            $scope.filters = {
                "Id": "",
                "Title": "",
                "Content": "",
                "Status": "",
                "IsActive": "",
                "IsCommentAllowed": "",
                "IsRatingAllowed": ""
            };
        }
        else {


            if (typeof data != 'undefined') {

                delete $scope.newCol;
                $scope.newCol = [];
                var headers = data.header.split(',');
                var field = data.field.split(',');
                var visibility = data.visibility.split(',');
                var filterValue = data.filterValue.split(',');
                for (var i = 0; i < $scope.columns.length; i++) {

                    $scope.newCol.push({ header: headers[i], field: field[i], show: (visibility[i] == "true") ? true : false, filterValue: filterValue[i] });
                    $scope.filters[field[i]] = filterValue[i];
                }
                $scope.columns = angular.copy($scope.newCol);


            }
        }


    };


    $scope.export = function (type) {
        $('#myTable').tableExport({ type: type, escape: 'false' });
    };

    $scope.search = function () {
        $scope.paging.total = $scope.rowCollection.length;
        var a = ($scope.criteria.page - 1) * $scope.criteria.pagesize;
        var b = $scope.criteria.page * $scope.criteria.pagesize;
        var count = $scope.rowCollection.slice(a, b);
        $scope.paging.showing = count.length;
        var totalpages = Math.ceil($scope.paging.total / $scope.criteria.pagesize);
        $scope.paging.totalpages = totalpages;

        if ($scope.rowCollection.length == 0) {
            $scope.criteria.page = 0;
        }

    }

    $scope.search();

    $scope.$watch('criteria', function (newValue, oldValue) {

        if (!angular.equals(newValue, oldValue)) {
            $scope.search();
        }
    }, true);

    //watching alphabetic page click
    $scope.$on('alphabeticPageClick', function (event, data) {
        if (data.Count != 0) {
            $scope.options.searchValue = data.letter;
            $scope.options.selectedField = data.field;
            $scope.options.selectedFilter = data.filter;

        }

        console.log(data);
    });

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

    $scope.advanceSearchModal = function () {
        $('#advanceSearchModal').modal('show');
    }

    $scope.advanceSearch_Add = function () {
        $scope.advanceSearch.push({
            selectedField: '',
            selectedFilter: '',
            searchValue: '',
            type: ''
        });

        $('#advanceSearchModal').modal('show');
    }
    $scope.advanceSearch_Remove = function () {
        $scope.advanceSearch.pop();
    }
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
        $scope.displayedCollection = angular.copy(query);



    }



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
      
    }

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



}]);




















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

//Collection
app.service('FilterService', function () {

    this.StartWith = function (items, char, key) {
        var filtered = [];
        if (char != "" && key != "") {
            var letterMatch = new RegExp(char, 'i');
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (letterMatch.test(item[key].substring(0, 1))) {
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
                if (letterMatch.test(item[key].substring(item[key].length - 1, item[key].length))) {
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
                if (item[key].indexOf(char) !== -1) {
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




app.filter('myFilter', ['FilterService', function (FilterService) {

    return function (items, options) {

        switch (options.selectedFilter) {
            case 'Contains':
                {
                    return FilterService.Contains(items, options.searchValue, options.selectedField);
                    break;
                }
            case 'Equals':
                {
                    return FilterService.Equals(items, options.searchValue, options.selectedField);

                    break;
                }
            case 'StartWith':
                {
                    return FilterService.StartWith(items, options.searchValue, options.selectedField);
                    break;
                }
            case 'EndWith':
                {
                    return FilterService.EndWith(items, options.searchValue, options.selectedField);
                    break;
                }
            default: {
                return items;
            }

        }
        //alert(options.searchValue + '-' + options.selectedField + '-' + options.selectedFilter);
        //return items;
    }
}]);

app.filter('selected', function () {
    return function (items) {
        return Enumerable.From(items).Where(function (x) {
            return x.show == true
        }).Count();
    }
});

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





