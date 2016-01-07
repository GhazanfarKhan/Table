var app = angular.module('myApp', ['smart-table','lrDragNDrop','ngAnimate','angularUtils.directives.dirPagination']);

app.controller('TableController', ['$scope', '$filter', '$timeout', '$rootScope', function ($scope, $filter, $timeout, $rootScope) {
    $scope.id = 1;
    $scope.selectedFilter = {};

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


   $scope.topic = {
        "Id": "",
        "Title": "",
        "Content": "",
        "Status": "",
        "IsActive": "",
        "IsCommentAllowed": "",
        "IsRatingAllowed": "",
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
            "Content":Content,
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
        { header: 'Content', field: 'Content', show: true,  filterValue: '' },
        { header: 'Status', field: 'Status', show: true, filterValue: '' },
        { header: 'Active', field: 'IsActive', show: true,  filterValue: '' },
        { header: 'Comments Allowed', field: 'IsCommentAllowed', show: true,  filterValue: '' },
        { header: 'Rating Allowed', field: 'IsRatingAllowed', show: true,  filterValue: '' }

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
    };

    //remove to the real data holder
    $scope.removeItem = function removeItem(row) {
        var index = $scope.rowCollection.indexOf(row);
        if (index !== -1) {
            $scope.rowCollection.splice(index, 1);
        }
    }
    //batch delete
    $scope.deleteItem = function deleteItem()
    {
        var items = findSelectedItem();
        if (items.length > 0) {

            if (items.length == $scope.columns.length-1) {
                //$scope.$emit('AllRowsDeleted', 'true');
                $scope.$broadcast("AllRowsDeleted", true);
                
            }
            for (var i = 0; i < items.length; i++) {
                var index = $scope.rowCollection.indexOf(items[i]);
                $scope.rowCollection.splice(index, 1);

            }
        }
        else {
            alert('Please select an item')
        }
      
    }
    //update modal
    $scope.updateModal = function updateItem(row) {
        var items = Enumerable.From($scope.rowCollection).Where(function (x) { return x.isSelected == true }).ToArray();
        if (items.length == 1) {
            $scope.topic = items[0];
        }
        if (items.length > 0) {
            $('#myModal').modal('show');
          
        }
        else {
            alert('Please select an item')
        }


    }
    //bacthUpdate
    $scope.batchUpdate = function () {
       
        var items = findSelectedItem();
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                var index = $scope.rowCollection.indexOf(items[i]);
                $scope.rowCollection[index].Title = $scope.topic.Title;
                $scope.rowCollection[index].Content = $scope.topic.Content;
                $scope.rowCollection[index].Status = $scope.topic.Status;
                $scope.rowCollection[index].IsActive = $scope.topic.IsActive;
                $scope.rowCollection[index].IsCommentAllowed = $scope.topic.IsCommentAllowed;
                $scope.rowCollection[index].IsRatingAllowed = $scope.topic.IsRatingAllowed;
            }
            $('#myModal').modal('hide');
            delete $scope.topic;

        }
        else {
            alert('Please select an item')
        }

       

    };
    //find Selected item
    function findSelectedItem() {
        var items = Enumerable.From($scope.rowCollection).Where(function (x) { return x.isSelected == true }).ToArray();
        return items;
    }

    //hide update modal
    $scope.hide=function(){
        $('#myModal').modal('hide');
        delete $scope.topic;
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

      
        for (var i = 0; i <$scope.columns.length; i++) {
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

                    $scope.newCol.push({ header: headers[i], field: field[i], show: (visibility[i] == "true") ? true : false,  filterValue: filterValue[i] });
                    $scope.filters[field[i]] = filterValue[i];
                }
                $scope.columns = angular.copy($scope.newCol);


            }
        }

        
    };


    $scope.export = function (type) {
        $('#myTable').tableExport({ type: type, escape: 'false' });
    };
    $scope.animate = function () {
        $scope.showTable = !$scope.showTable;

    };
   

    $scope.search = function () {
        $scope.paging.total = $scope.rowCollection.length;
        var a = ($scope.criteria.page - 1) * $scope.criteria.pagesize;
        var b = $scope.criteria.page * $scope.criteria.pagesize;
        var count = $scope.rowCollection.slice(a, b);
        $scope.paging.showing = count.length;
        var totalpages = Math.ceil($scope.paging.total / $scope.criteria.pagesize);
        $scope.paging.totalpages = totalpages;
    }

    $scope.search();

    $scope.$watch('criteria', function (newValue, oldValue) {

        if (!angular.equals(newValue, oldValue)) {
            $scope.search();
        }
    }, true);

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

app.directive('csSelectAll', function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox" ng-model="isChecked"/>',
        scope: {
            rows: '=csSelectAll'
        },
        link: function (scope, element, attr, ctrl) {
            scope.isChecked = false;

            scope.$on('AllRowsDeleted', function (event, data) {
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


app.directive('inputSearchFilter', function ($compile) {
    return {
        restrict: 'AE',
        require: '^stTable',
        scope: {
            myDirectiveVar: '=',
            searchPredicate: '=',
            searchPlaceholder:'@'
        },
        template: '<input ng-model="myDirectiveVar" class="form-control" placeholder="{{searchPlaceholder}}" st-delay="false">',
        replace: true,
        link: function ($scope, elem, attr, ctrl) {


         

            $scope.$watch('myDirectiveVar', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    //ctrl.tableState().search = {};
                    //// ctrl.search($scope.myDirectiveVar, $scope.searchPredicate || '');
                 
                   return ctrl.search($scope.myDirectiveVar, $scope.searchPredicate);
                   ctrl.pipe();

                }
           
            });

        }
    };
});

