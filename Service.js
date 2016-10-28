app.service("myService", function ($http) {

    //get All Eployee
    this.getUsers = function () {
        debugger;
        return $http.get("Home/GetAll");
    };

    // get Employee By Id
    this.getUser = function (ID) {
        var response = $http({
            method: "post",
            url: "Home/getUserId",
            params: {
                id: JSON.stringify(ID)
            }
        });
        return response;
    }

    // Update Employee
    this.UpdateUser = function (User) {
        var response = $http({
            method: "post",
            url: "Home/UpdateUser",
            data: JSON.stringify(User),
            dataType: "json"
        });
        return response;
    }

    // Add Employee
    this.AddUser = function (User) {
        var response = $http({
            method: "post",
            url: "Home/AddUser",
            data: JSON.stringify(User),
            dataType: "json"
        });
        return response;
    }

    //Delete Employee
    this.DeleteUser = function (Id) {
        var response = $http({
            method: "post",
            url: "Home/DeleteUser",
            params: {
                Id: JSON.stringify(Id)
            }
        });
        return response;
    }
    })