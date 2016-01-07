var app = angular.module('myApp', ['ngAnimate']);
app.controller('AnimationController', function ($scope) {
    $scope.selectedFilter = '';
    $scope.list = [
  {
      "value": "test value with null formatter",
      "formatter": "uppercase",
  },
  {
      "value": "uppercase text",
      "formatter": "uppercase",
  },
  {
      "value": "2014-01-01",
      "formatter": "date",
  }
    ];

    $scope.options = {
        selectedField: '',
        selectedFilter: '',
        searchValue:''
    }



    $scope.friends = [
        {
            id: 1,
            name: 'Andrew',
            lastname:'John'
        },
        {

            id: 2,
            name: 'Will',
            lastname:'Andrew'
        },
        {

            id: 3,
            name: 'Mark',
            lastname: 'Kim'
        },
        {

            id: 4,
            name: 'Alice',
            lastname: 'Bob'
        },
        {

            id: 5,
            name: 'Todd',
            lastname: 'Teddy'
        }];



    $scope.list = [
        { name: 'John', phone: '555-1276' },
                         { name: 'Mary', phone: '800-BIG-MARY' },
                         { name: 'Mike', phone: '555-4321' },
                         { name: 'Adam', phone: '555-5678' },
                         { name: 'Julie', phone: '555-8765' },
                         { name: 'Juliette', phone: '555-5678' }];



    $scope.myCustomFilter = function (player) {

        return player.name.substring(0, 1).match(/A/gi);
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