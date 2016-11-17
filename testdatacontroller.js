'use strict';

/**
Forgot controller.
**/
var TestDataController = (function () {
    function TestDataController(applicationContext, notificationService, urlConstants, testDataService, $scope, $window, parameterService, fileService) {
        this.notificationService = notificationService;
        this.urlConstants = urlConstants;
        this.testDataService = testDataService;
        this.$scope = $scope;
        this.$window = $window;
        this.parameterService = parameterService;
        this.applicationContext = applicationContext;
        this.fileService = fileService;
        this.submitted = false;
        this.sheets = [];
        this.environments = [];
        this.UserId = applicationContext.user.id;
        this.ProjectId = applicationContext.user.project.Id;
        this.resetSheet();
        this.getEnvironments();
    };

    TestDataController.prototype.getEnvironments = function () {
        var _this = this;
        this.parameterService.getEnvironmentsWithProject(this.ProjectId, this.UserId).then(function (response) {
            _this.environments = response.data;
        });
    };

    TestDataController.prototype.addNewRow = function () {
        var newRow = {};
        newRow.isDeleted = false;
        for (var col in this.testdata.Columns) {
            newRow[this.testdata.Columns[col].Name] = "";
        }
        this.testdata.Rows.push(newRow);
    };

    TestDataController.prototype.exportSheet = function () {
        var _this = this;
        var hashValues = '';
        for (var key in this.downloadSheets) {
            if (this.downloadSheets[key] == true)
                hashValues = hashValues + key + '|';
        }
        if (hashValues === '') return;
        this.$window.open(this.urlConstants.testDataURL + "/download/" + hashValues + "/" + _this.ProjectId + "/" + _this.UserId + "/" + this.applicationContext.user.tokenid);
    };

    TestDataController.prototype.deleteRow = function (index) {
        this.testdata.Rows[index].isDeleted = true;
    };

    TestDataController.prototype.addNewColumn = function () {
        var newColumnName = prompt("Please provide new column name?");
        this.testdata.Columns.push({ Name: newColumnName, isDeleted: false });
        for (var row in this.testdata.Rows) {
            this.testdata.Rows[row][newColumnName] = "";
        }
    };

    TestDataController.prototype.deleteColumn = function (index) {
        this.testdata.Columns[index].isDeleted = true;
    };

    TestDataController.prototype.save = function (userForm) {
        var _this = this;
        if (this.environment === undefined) {
            this.notificationService.warning("Please select environment.");
            return true;
        }
        if (this.testdata.Columns.some(function (x) { return x.Name === ""; })) {
            this.notificationService.warning("Please provide column names.");
            return true;
        };
        this.testdata.Rows = this.testdata.Rows.filter(function (row) {
            var isRowNotEmpty = _this.testdata.Columns.some(function (col) {
                 return (!col.IsDeleted && row[col.Name] != "" && row[col.Name] != null);
             });
             return isRowNotEmpty;
        });
        if (this.testdata.Rows.length === 0) {
            this.notificationService.warning("All rows are empty, please provide some data or cancel the operation.");
            return true;
        };
        this.testDataService.manage(this.testdata, _this.UserId).then(function (response) {
            _this.notificationService.error("Sheet has been save successfully.");
            _this.selectedsheet = {};
            _this.resetSheet();
            _this.getTestSheets(_this.environment.Key);
        });
        return true;
    };

    TestDataController.prototype.addNewSheet = function () {
        var isSheetNameValid = true;
        var sheetName = null;
        while (isSheetNameValid) {
            sheetName = prompt("Please provide new sheet name ?");
            if (sheetName === null || sheetName === "") return;
            isSheetNameValid = this.sheets.some(function (item) {
                return item.Key === sheetName;
            });
        };
        this.selectedsheet = {};
        this.testdata = {};
        this.testdata.ProjectId = this.ProjectId;
        this.testdata.SheetId = null;
        this.testdata.SheetName = sheetName;
        this.testdata.Environment = this.environment.Key;
        this.testdata.Columns = [
            { Name: "Item", isDeleted: false },
            { Name: "Value", isDeleted: false },
            { Name: "Description", isDeleted: false },
            { Name: "Comment", isDeleted: false }
        ];
        this.testdata.Rows = [
            { "Item": "", "Value": "", "Description": "", "Comment": "", isDeleted: false }
        ];
    };

    TestDataController.prototype.resetSheet = function () {
        this.testdata = {};
        this.testdata.ProjectId = this.ProjectId;
        this.testdata.SheetId = null;
        this.testdata.SheetName = null;
        this.testdata.Environment = null;
        this.testdata.Columns = [];
        this.testdata.Rows = [];
    };

    TestDataController.prototype.cancel = function () {
        if (this.selectedsheet.Value && this.selectedsheet.Value != null) {
            this.getTestData();
            return;
        };
        this.resetSheet();
    };

    TestDataController.prototype.getTestData = function () {
        var _this = this;
        this.testdata.SheetId = this.selectedsheet.Value;
        this.testDataService.getData(this.selectedsheet.Value, _this.ProjectId, _this.UserId).then(function (response) {
            _this.testdata = response.data;
            _this.testdata.ProjectId = _this.ProjectId;
        }, function errorCallback() {
            _this.notificationService.error("Please try again or contact administrator.");
        });
    };

    TestDataController.prototype.getTestSheets = function (environment) {
        var _this = this;
        this.testDataService.getSheets(_this.ProjectId, environment, _this.UserId).then(function (response) {
            _this.sheets = response.data;
            _this.downloadSheets = {};
            if (response.data.length === 0) _this.notificationService.warning("For selected environment sheets not avaliable.");
        });
    };

    TestDataController.prototype.dropSheet = function (index) {
        var _this = this;
        if (!confirm("Are you sure to drop selected sheet ? It would be permenantly deleted."))
            return;
        var sheetId = this.sheets[index].Value;
        this.testDataService.dropSheet(sheetId, _this.ProjectId, _this.UserId).then(function (response) {
            _this.sheets.splice(index, 1);
            _this.notificationService.alert("Sheet has been deleted successfully.");
        });
    };

    TestDataController.prototype.localStoreMultipleFiles = function (files) {
        var _this = this;
        if (this.environment === undefined) {
            this.notificationService.warning("Please select environment.");
            return true;
        };
        if (files.length > 0) {
            this.fileService.upload(files[0],
                this.urlConstants.testDataURL + "/uploadsheet/" + this.ProjectId + "/" + this.environment.Key +"/" + _this.UserId,
                this.applicationContext.user.tokenid,
                function() {
                _this.notificationService.error("Sheets has been imported successfully.");
                _this.getTestSheets(_this.environment.Key);
        });
    };
    };

    TestDataController.$inject = ['applicationContext', 'notificationService', 'urlConstants', 'TestDataService', '$scope', '$window', 'ParameterService', 'fileService'];
    return TestDataController;
})();

appmodule.controller('TestDataController', TestDataController);