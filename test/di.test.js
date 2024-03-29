/* global define, describe, it, assert */
define([
   'Types/di'
], function(
   Di
) {
   'use strict';


   describe('Types/di', function() {
      describe('.register()', function() {
         it('should work with object', function() {
            Di.register('test.module', {});
         });

         it('should work without options', function() {
            var Module = function() {};
            Di.register('test.module', Module);
         });

         it('should accept twice', function() {
            var Module = function() {};
            Di.register('test.module', Module);
            Di.register('test.module', Module);
         });

         it('should throw an error if alias is not a string', function() {
            assert.throws(function() {
               Di.register(null);
            });
            assert.throws(function() {
               Di.register(false);
            });
            assert.throws(function() {
               Di.register(true);
            });
            assert.throws(function() {
               Di.register(0);
            });
            assert.throws(function() {
               Di.register(1);
            });
            assert.throws(function() {
               Di.register({});
            });
         });

         it('should throw an error if alias is empty', function() {
            assert.throws(function() {
               Di.register('');
            });
            assert.throws(function() {
               Di.register();
            });
         });
      });

      describe('.unregister()', function() {
         it('should become dependency unregistered', function() {
            var Module = function() {};
            Di.register('test.module', Module);
            Di.unregister('test.module');
            assert.isFalse(Di.isRegistered('test.module'));

            Di.unregister('test.moduleA');
            assert.isFalse(Di.isRegistered('test.moduleA'));
         });

         it('should throw an error if alias is empty', function() {
            assert.throws(function() {
               Di.unregister('');
            });
            assert.throws(function() {
               Di.unregister();
            });
         });

         it('should become resolve to throw', function() {
            var Module = function() {};
            Di.register('test.module', Module);
            Di.unregister('test.module');
            assert.throws(function() {
               Di.resolve('test.module');
            });
         });
      });

      describe('.isRegistered()', function() {
         it('should return false', function() {
            assert.isFalse(Di.isRegistered('test.module.isRegistered.false'));
         });

         it('should return true', function() {
            Di.register('test.module.isRegistered.true', {});
            assert.isTrue(Di.isRegistered('test.module.isRegistered.true'));
         });

         it('should throw an error if alias is empty', function() {
            assert.throws(function() {
               Di.isRegistered('');
            });
            assert.throws(function() {
               Di.isRegistered();
            });
         });
      });

      describe('.create()', function() {
         it('should return an instance of registered module by alias', function() {
            var Module = function() {};
            Di.register('test.module', Module, {instantiate: false});
            assert.instanceOf(Di.create('test.module'), Module);
         });

         it('should return an instance of registered module by constructor', function() {
            var Module = function() {};
            assert.instanceOf(Di.create(Module), Module);
         });
      });

      describe('.resolve()', function() {
         it('should return an instance of registered module', function() {
            var Module = function() {};
            Di.register('test.module', Module);
            assert.instanceOf(Di.resolve('test.module'), Module);
         });

         it('should return an instance of reassigned module', function() {
            var ModuleA = function() {};
            Di.register('test.module', ModuleA);
            assert.instanceOf(Di.resolve('test.module'), ModuleA);

            var ModuleB = function() {};
            Di.register('test.module', ModuleB);
            assert.instanceOf(Di.resolve('test.module'), ModuleB);
         });

         it('should pass arguments to the constructor', function() {
            var passedArgs,
               args = {a: 1, b: 2},
               Module = function(args) {
                  passedArgs = args;
               };
            Di.register('test.module', Module);
            Di.resolve('test.module', args);
            assert.strictEqual(args, passedArgs);
            Di.resolve('test.module');
            assert.isUndefined(passedArgs);
         });

         it('should return a new instance on every call if no option given', function() {
            var Module = function() {};
            Di.register('test.module', Module);
            var instA = Di.resolve('test.module'),
               instB = Di.resolve('test.module'),
               instC = Di.resolve('test.module');
            assert.notEqual(instA, instB);
            assert.notEqual(instA, instC);
            assert.notEqual(instB, instC);
         });

         it('should return a new instance on every call if "single" option is false', function() {
            var Module = function() {};
            Di.register('test.module', Module, {single: false});
            var instA = Di.resolve('test.module'),
               instB = Di.resolve('test.module'),
               instC = Di.resolve('test.module');
            assert.notEqual(instA, instB);
            assert.notEqual(instA, instC);
            assert.notEqual(instB, instC);
         });

         it('should return same instance on every call if "single" option is true', function() {
            var Module = function() {};
            Di.register('test.module', Module, {single: true});
            var instA = Di.resolve('test.module'),
               instB = Di.resolve('test.module'),
               instC = Di.resolve('test.module');
            assert.strictEqual(instA, instB);
            assert.strictEqual(instA, instC);
         });

         it('should return given instance on every call if "instantiate" option is false', function() {
            var Module = function() {},
               inst = new Module();
            Di.register('test.module', inst, {instantiate: false});
            var instA = Di.resolve('test.module'),
               instB = Di.resolve('test.module'),
               instC = Di.resolve('test.module');
            assert.strictEqual(instA, inst);
            assert.strictEqual(instB, inst);
            assert.strictEqual(instC, inst);
         });

         it('should return a new instance of registered module  if "instantiate" option is true', function() {
            var Module = function() {};
            Di.register('test.module', Module, {instantiate: true});
            assert.instanceOf(Di.resolve('test.module'), Module);
            assert.instanceOf(Di.resolve('test.module'), Module);
         });

         it('should throw an error if alias is empty', function() {
            assert.throws(function() {
               Di.resolve('');
            });
            assert.throws(function() {
               Di.resolve();
            });
         });

         it('should accept a function as alias', function() {
            var passedArgs,
               args = {a: 1, b: 2},
               Module = function(args) {
                  passedArgs = args;
               };

            var instA = Di.resolve(Module, args);
            assert.strictEqual(args, passedArgs);
            var instB = Di.resolve(Module);
            assert.isUndefined(passedArgs);
            assert.instanceOf(instA, Module);
            assert.instanceOf(instB, Module);
            assert.notEqual(instA, instB);
         });

         it('should accept an instance as alias', function() {
            var inst = {},
               instA = Di.resolve(inst),
               instB = Di.resolve(inst);
            assert.strictEqual(instA, inst);
            assert.strictEqual(instB, inst);
         });
      });
   });
});
