var app = angular.module('myApp', ['ngAnimate','angularUtils.directives.dirPagination']);


app.controller('UsersController', function($scope, $http) {
    $scope.users = [
        {
            name: 'Ghazanfar',
            email:'kghazanfar4@gmail.com'
        },
        {
            name: 'Hasan',
            email: 'hasan@gmail.com'
        },
        {
            name: 'Awais',
            email: 'Awais@gmail.com'
        },
        {
            name: 'Ashan',
            email: 'Ashan@gmail.com'
        },
         {
             name: 'Karim',
             email: 'Karim@gmail.com'
         },
        {
            name: 'Bilal',
            email: 'Bilal@gmail.com'
        },
        {
            name: 'Naseer',
            email: 'Naseer@gmail.com'
        },
        {
            name: 'Adnan',
            email: 'Adnan@gmail.com'
        },
         {
             name: 'Kashif',
             email: 'Kashif@gmail.com'
         },
    ];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 5; // this should match however many results your API puts on one page
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service


      var result=  Enumerable.Range(1, 10).Take(5);
      $scope.users = result.data.Items;
      $scope.totalUsers = result.data.Count

        //$http.get('path/to/api/users?page=' + pageNumber)
        //    .then(function(result) {
        //        $scope.users = result.data.Items;
        //        $scope.totalUsers = result.data.Count
        //    });
    }
});


app.filter('picker', function ($filter) {
    return function (value, filterName) {
        return $filter(filterName)(value);
    };
});

app.service('FilterService', function () {

    this.StartWith = function (items, letter) {
        var filtered = [];
        var letterMatch = new RegExp(letter, 'i');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (letterMatch.test(item.name.substring(0, 1))) {
                filtered.push(item);
            }
        }
        return filtered;
    }
    

});

app.filter('myFilter',['FilterService', function (FilterService) {

    return function (items, options) {
            
        switch (options.selectedFilter)
        {
            case 'Contains':
                {

                break;
                }
            case 'Equal':
                {
                break;
                 }
            case 'StartWith':
                {
                    return FilterService.StartWith(items, options.searchValue);
                break;
                }
            case 'EndWith':
                {
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




app.filter('startsWithLetter', function () {
    return function (items, letter) {
        var filtered = [];
        var letterMatch = new RegExp(letter, 'i');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (letterMatch.test(item.name.substring(0,1))) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});

//app.filter('endsWithLetter', function () {
//    return function (items, letter) {
//        var filtered = [];
//        var letterMatch = new RegExp(letter, 'i');
//        for (var i = 0; i < items.length; i++) {
//            var item = items[i];
//            if (letterMatch.test(item.name.substring(item.length.name - 1, item.name.length))) {
//                filtered.push(item);
//            }
//        }
//        return filtered;
//    };
//});