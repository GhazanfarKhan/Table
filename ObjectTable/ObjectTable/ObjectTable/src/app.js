var app = angular.module('myApp', ['smart-table']);

app.controller('TableController', ['$scope', '$filter', function ($scope, $filter) {
    //Sample data
    var topics = [
        {
            Id: 1,
            Title: 'AA Integration1',
            Content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel magna dolor. Nam dignissim libero vel est consectetur luctus. Suspendisse potenti. Vestibulum eleifend dictum elementum. Etiam molestie enim ut justo elementum, consectetur venenatis massa viverra.',
            PublishDate: new Date('1987-05-21'),
            Status: 'Recent',
            IsActive: true,
            IsCommentAllowed: false,
            IsRatingAllowed: true

        },
        {
            Id: 2,
            Title: 'BB Integration2',
            Content: 'Curabitur tellus eros, luctus nec ante accumsan, fringilla tincidunt erat. Integer in odio sed metus gravida luctus non et dui. Etiam vel varius libero, eu tempus magna. Quisque luctus enim vel sapien imperdiet, ac sodales felis blandit. Duis at elit id lectus pellentesque mollis. Suspendisse',
            PublishDate: new Date('1986-05-21'),
            Status: 'Recent',
            IsActive: true,
            IsCommentAllowed: false,
            IsRatingAllowed: false
        },
        {
            Id: 3,
            Title: 'CC Integration3',
            Content: 'Phasellus convallis ex ac diam volutpat finibus. Cras iaculis est rhoncus quam efficitur, sed gravida eros varius. Maecenas laoreet sed velit quis pellentesque. Nam vehicula hendrerit hendrerit. Mauris in imperdiet dui. Quisque et augue felis. Suspendisse non lorem quis ligula feugiat sodales',
            PublishDate: new Date('1999-05-21'),
            Status: 'Most Viewed',
            IsActive: true,
            IsCommentAllowed: false,
            IsRatingAllowed: true
        },
        {
            Id: 4,
            Title: 'DD Integration4',
            Content: 'Aenean leo dui, posuere non sodales et, feugiat eget ipsum. In scelerisque nunc quis tortor condimentum, sit amet mollis odio tristique. Fusce aliquam id mi sed condimentum. Vestibulum porttitor quam sed vulputate sodales. Curabitur semper rhoncus ante, non viverra massa vehicula',
            PublishDate: new Date('1977-05-21'),
            Status: 'Featured',
            IsActive: true,
            IsCommentAllowed: true,
            IsRatingAllowed: true
        },
        {
            Id: 5,
            Title: 'EE Integration5',
            Content: 'Pellentesque magna nisl, bibendum non gravida ut, tristique sed sem. Nam placerat vehicula felis. Quisque orci urna, fermentum eget ullamcorper quis, f',
            PublishDate: new Date('1987-5-11'),
            Status: 'Removed',
            IsActive: false,
            IsCommentAllowed: false,
            IsRatingAllowed: false
        },
        {
            Id: 6,
            Title: 'FF Integration6',
            Content: 'm quis ligula feugiat sodales. Cras a orci at metus consequat interdum vitae at neque. Cras sed molestie sapien. Maecenas scelerisque sollicitudin justo, eget pharetra augue vulputate quis.',
            PublishDate: new Date('1997-8-29'),
            Status: 'Most Viewed',
            IsActive: true,
            IsCommentAllowed: true,
            IsRatingAllowed: true
        },
        {
            Id: 7,
            Title: 'GG Integration7',
            Content: 'Nullam congue, purus faucibus lobortis condimentum, magna diam faucibus lacus, in commodo mi erat non turpis. Donec bibendum blandit egestas. Curabitur faucibus nec orci ut fringilla.',
            PublishDate: new Date('1907-05-11'),
            Status: 'Featured',
            IsActive: true,
            IsCommentAllowed: false,
            IsRatingAllowed: true
        },
         {
             Id: 8,
             Title: 'HH Integration8',
             Content: 'Condimentum, magna diam faucibus lacus, in commodo mi erat non turpis. Donec bibendum blandit egestas. Curabitur faucibus nec orci ut fringilla.',
             PublishDate: new Date('2015-05-21'),
             Status: 'Pending',
             IsActive: false,
             IsCommentAllowed: true,
             IsRatingAllowed:true
         }
    ];

  
    function generateRandomItem(id) {

        var Id = topics[Math.floor(Math.random() * 3)].Id;
        var Title = topics[Math.floor(Math.random() * 3)].Title;
        var Content = topics[Math.floor(Math.random() * 3)].Content;
        var PublishDate = topics[Math.floor(Math.random() * 3)].PublishDate;
        var Status = topics[Math.floor(Math.random() * 3)].Status;
        var IsActive = topics[Math.floor(Math.random() * 3)].IsActive;
        var IsCommentAllowed = topics[Math.floor(Math.random() * 3)].IsCommentAllowed;
        var IsRatingAllowed = topics[Math.floor(Math.random() * 3)].IsRatingAllowed;
     
        return {
            Id: Id,
            Title: Title,
            Content:Content,
            PublishDate: new Date(PublishDate),
            Status: Status,
            IsActive: IsActive,
            IsCommentAllowed: IsCommentAllowed,
            IsRatingAllowed: IsRatingAllowed
        }
    }

    $scope.rowCollection = [];

    for (id = 0; id < topics.length ; id++) {
        $scope.rowCollection.push(topics[id]);
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

    $scope.selectAll = function () {
        alert();
    }

}]);

app.directive('csSelect', function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox"/>',
        scope: {
            row: '=csSelect'
        },
        link: function (scope, element, attr, ctrl) {
        
            element.bind('change', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });
            scope.$watch('row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    console.log(scope.row);
                 

                    element.parent().addClass('st-selected');
                } else {
                    element.parent().removeClass('st-selected');
                }
            });

        }
    };
});

app.directive('csSelectAll', function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox"/>',
        scope: {
            row: '=csSelectAll'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind('change', function (evt) {
                scope.$apply(function () {
                    alert();
                    console.log(scope.row);
                    //ctrl.select(scope.row, 'multiple');
                });
               
            });
            //scope.$watch('row.isSelected', function (newValue, oldValue) {
            //    if (newValue === true) {
            //        console.log(scope.row);


            //        element.parent().addClass('st-selected');
            //    } else {
            //        element.parent().removeClass('st-selected');
            //    }
            //});

        }
    };
});