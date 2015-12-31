'use strict';

describe('Validator: validateApplicationName', function () {

  var validator1, validator2;

  beforeEach(
    window.module(
      require('./exampleApplicationName.validator.js'),
      require('./validateApplicationName.directive.js')
    )
  );

  beforeEach(window.inject(function ($rootScope, $compile, exampleApplicationNameValidator, exampleApplicationNameValidator2) {
    this.$rootScope = $rootScope;
    this.compile = $compile;
    validator1 = exampleApplicationNameValidator;
    validator2 = exampleApplicationNameValidator2;
  }));

  beforeEach(function() {
    var compile = this.compile;

    this.initialize = function(val, cloudProviders) {
      this.scope = this.$rootScope.$new();
      this.scope.app = { name: val };
      this.scope.cp = cloudProviders;

      var input = '<input type="text" name="appName" ng-model="app.name" validate-application-name cloud-providers="cp"/>';

      var dom = '<form name="form">' + input + '</form>';

      compile(dom)(this.scope);
      this.scope.$digest();
    };

    this.isValid = function() {
      return this.scope.form.appName.$valid;
    };
  });

  describe('valid cases', function () {

    it('should be valid when no provider selected and name does not match warning or error condition', function () {
      this.initialize('zz' + validator1.WARNING_CONDITION, []);
      expect(this.isValid()).toBe(true);

      this.initialize('zz' + validator1.ERROR_CONDITION, []);
      expect(this.isValid()).toBe(true);

      this.initialize('zz' + validator2.WARNING_CONDITION, []);
      expect(this.isValid()).toBe(true);

      this.initialize('zz' + validator2.ERROR_CONDITION, []);
      expect(this.isValid()).toBe(true);
    });

    it('should be valid when a cloudProvider is selected and name does not match warning or error of other provider', function () {
      this.initialize(validator1.WARNING_CONDITION, [validator2.provider]);
      expect(this.isValid()).toBe(true);

      this.initialize(validator1.ERROR_CONDITION, [validator2.provider]);
      expect(this.isValid()).toBe(true);

      this.initialize(validator2.WARNING_CONDITION, [validator1.provider]);
      expect(this.isValid()).toBe(true);

      this.initialize(validator2.ERROR_CONDITION, [validator1.provider]);
      expect(this.isValid()).toBe(true);
    });

    it('should be valid when a name matches warnings', function () {
      this.initialize(validator1.WARNING_CONDITION, []);
      expect(this.isValid()).toBe(true);

      this.initialize(validator2.WARNING_CONDITION, []);
      expect(this.isValid()).toBe(true);

    });
  });

  describe ('invalid cases', function () {

    it('should be invalid if name is invalid for any provider and none specified', function () {
      this.initialize(validator1.ERROR_CONDITION, []);
      expect(this.isValid()).toBe(false);

      this.initialize(validator2.ERROR_CONDITION, []);
      expect(this.isValid()).toBe(false);
    });

    it('should be invalid if name is invalid for specified provider', function () {
      this.initialize(validator1.ERROR_CONDITION, [validator2.provider]);
      expect(this.isValid()).toBe(true);

      this.initialize(validator1.ERROR_CONDITION, [validator1.provider]);
      expect(this.isValid()).toBe(false);
    });

  });

  describe ('value/option changes', function () {
    it ('should flip when providers change', function () {
      this.initialize(validator2.ERROR_CONDITION, [validator1.provider]);
      expect(this.isValid()).toBe(true);

      this.scope.cp = [validator2.provider];
      this.scope.$digest();
      expect(this.isValid()).toBe(false);

      this.scope.cp = [validator1.provider];
      this.scope.$digest();
      expect(this.isValid()).toBe(true);
    });

    it ('should flip when name changes', function () {
      this.initialize(validator1.ERROR_CONDITION + 'zz', [validator1.provider]);
      expect(this.isValid()).toBe(true);

      this.scope.app.name = validator1.ERROR_CONDITION;
      this.scope.$digest();
      expect(this.isValid()).toBe(false);
    });

  });
});
