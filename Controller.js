app.controller("myCntrl", function ($scope, myService) {
    $scope.divEmployee = false;
    GetAllUser();
    //To Get All Records 
    function GetAllUser() {
        debugger;
        var getData = myService.getUsers();
        debugger;
        getData.then(function (emp) {
            $scope.Users = emp.data;
        }, function () {
            alert('Error in getting records');
        });
    }

    $scope.editUser = function (User) {
        debugger;
        
        var getData = myService.getUsers(User.Id);
        getData.then(function (emp) {
            $scope.User = emp.data;
            $scope.FirstName = User.FirstName;
            $scope.LastName = User.LastName;
            $scope.UserName = User.UserName;
            $scope.Email = User.Email;
            $scope.MobileNo = User.MobileNo;
            $scope.Password = User.Password;
            $scope.Sex = User.Sex;
            $scope.DateOfBirth = User.DateOfBirth;
            $scope.Action = "Update";
            $scope.divEmployee = true;
        },
        function () {
            alert('Error in getting records');
        });
    }

    $scope.AddUpdateUser = function () {
        debugger;
        var User = {
            FirstName: $scope.FirstName,
            LastName: $scope.LastName,
            UserName: $scope.UserName,
            
            Email: $scope.Email,
            MobileNo: $scope.MobileNo,
            Password: $scope.Password,
            Sex: $scope.Sex,
            DateOfBirth: $scope.DateOfBirth
        };
        var getAction = $scope.Action;

        if (getAction == "UpdateUser") {
            SignUp.Id = $scope.Id;
            var getData = myService.UpdateUser(SignUp);
            getData.then(function (msg) {
                GetAllUser();
                alert(msg.data);
               // $scope.divEmployee = false;
            }, function () {
                alert('Error in updating record');
            });
        } else {
            var getData = myService.AddUser(SignUp);
            getData.then(function (msg) {
                GetAllUser();
                alert(msg.data);
                $scope.divEmployee = false;
            }, function () {
                alert('Error in adding record');
            });
        }
    }

    $scope.Save = function () {
        ClearFields();
        $scope.Action = "AddUser";
       // $scope.divEmployee = true;
    }

    $scope.delete = function (user) {
        var getData = myService.DeleteUser(user.Id);
        getData.then(function (msg) {
            GetAllUser();
            alert('User Deleted');
        }, function () {
            alert('Error in Deleting Record');
        });
    }

    function ClearFields() {
        $scope.FirstName = "";
        $scope.LastName = "";
        $scope.UserName = "";
        $scope.Email = "";
        $scope.MobileNo = "";
        $scope.Password = "";
        $scope.Sex = "";
        $scope.DateOfBirth = "";
    }
});