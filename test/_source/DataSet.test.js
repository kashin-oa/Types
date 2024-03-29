/* global beforeEach, afterEach, describe, it, assert */
define([
   'Types/_source/DataSet',
   'Types/_entity/Model',
   'Types/_entity/adapter/Json',
   'Types/_collection/RecordSet',
   'Core/core-extend'
], function(
   DataSet,
   Model,
   JsonAdapter,
   RecordSet,
   coreExtend
) {
   'use strict';

   DataSet = DataSet.default;
   Model = Model.default;
   JsonAdapter = JsonAdapter.default;
   RecordSet = RecordSet.default;

   describe('Types/_source/DataSet', function() {
      var list;

      beforeEach(function() {
         list = [{
            'Ид': 1,
            'Фамилия': 'Иванов'
         }, {
            'Ид': 2,
            'Фамилия': 'Петров'
         }, {
            'Ид': 3,
            'Фамилия': 'Сидоров'
         }];
      });

      afterEach(function() {
         list = undefined;
      });

      describe('.writable', function() {
         it('should return true by defalt', function() {
            var ds = new DataSet();
            assert.isTrue(ds.writable);
         });

         it('should return value from option', function() {
            var ds = new DataSet({
               writable: false
            });
            assert.isFalse(ds.writable);
         });

         it('should overwrite value', function() {
            var ds = new DataSet();
            ds.writable = false;
            assert.isFalse(ds.writable);
         });
      });

      describe('.getAdapter()', function() {
         it('should return the adapter', function() {
            var adapter = new JsonAdapter(),
               ds = new DataSet({
                  adapter: adapter
               });
            assert.strictEqual(ds.getAdapter(), adapter);
         });

         it('should return default adapter', function() {
            var ds = new DataSet();
            assert.instanceOf(ds.getAdapter(), JsonAdapter);
         });
      });

      describe('.getModel()', function() {
         it('should return a given model', function() {
            var ds = new DataSet({
               model: Model
            });
            assert.strictEqual(ds.getModel(), Model);
         });

         it('should return "Types/entity:Model"', function() {
            var ds = new DataSet();
            assert.strictEqual(ds.getModel(), 'Types/entity:Model');
         });
      });

      describe('.setModel()', function() {
         it('should set the model', function() {
            var MyModel = coreExtend.extend(Model, {}),
               ds = new DataSet();
            ds.setModel(MyModel);
            assert.strictEqual(ds.getModel(), MyModel);
         });
      });

      describe('.getListModule()', function() {
         it('should return a default list', function() {
            var ds = new DataSet();
            assert.strictEqual(ds.getListModule(), 'Types/collection:RecordSet');
         });

         it('should return the given list', function() {
            var MyList = coreExtend.extend(RecordSet, {}),
               ds = new DataSet({
                  listModule: MyList
               });
            assert.strictEqual(ds.getListModule(), MyList);
         });
      });

      describe('.setListModule()', function() {
         it('should set the model', function() {
            var MyList = coreExtend.extend(RecordSet, {}),
               ds = new DataSet();
            ds.setListModule(MyList);
            assert.strictEqual(ds.getListModule(), MyList);
         });
      });

      describe('.getKeyProperty()', function() {
         it('should return the key property', function() {
            var ds = new DataSet({
               keyProperty: '123'
            });
            assert.strictEqual(ds.getKeyProperty(), '123');
         });

         it('should return an empty string', function() {
            var ds = new DataSet();
            assert.strictEqual(ds.getKeyProperty(), '');
         });
      });

      describe('.setKeyProperty()', function() {
         it('should set the key property', function() {
            var ds = new DataSet();
            ds.setKeyProperty('987');
            assert.strictEqual(ds.getKeyProperty(), '987');
         });
      });

      describe('.getAll()', function() {
         it('should return a recordset', function() {
            var ds = new DataSet();
            assert.instanceOf(ds.getAll(), RecordSet);
         });

         it('should return pass idProperty to the model', function() {
            var ds = new DataSet({
               rawData: [{}],
               keyProperty: 'myprop'
            });
            assert.strictEqual(ds.getAll().at(0).getIdProperty(), 'myprop');
         });

         it('should return a recordset of 2 by default', function() {
            var ds = new DataSet({
               rawData: [1, 2]
            });
            assert.equal(ds.getAll().getCount(), 2);
         });

         it('should return a recordset of 2 from given property', function() {
            var ds = new DataSet({
               rawData: {some: {prop: [1, 2]}}
            });
            assert.equal(ds.getAll('some.prop').getCount(), 2);
         });

         it('should return an empty recordset from undefined property', function() {
            var ds = new DataSet({
               rawData: {}
            });
            assert.equal(ds.getAll('some.prop').getCount(), 0);
         });

         it('should return recordset with metadata from given property', function() {
            var ds = new DataSet({
                  rawData: {
                     meta: {bar: 'foo'}
                  },
                  metaProperty: 'meta'
               }),
               meta = ds.getAll().getMetaData();

            assert.strictEqual(meta.bar, 'foo');
         });

         it('should throw an error', function() {
            var ds = new DataSet({
               rawData: {d: [1], s: [{n: 'Id', t: 'Число целое'}], _type: 'record'},
               adapter: 'Types/entity:adapter.Sbis'
            });
            assert.throws(function() {
               ds.getAll();
            });
         });
      });

      describe('.getRow()', function() {
         it('should return a model', function() {
            var ds = new DataSet();
            assert.instanceOf(ds.getRow(), Model);
         });

         it('should return a model by default', function() {
            var ds = new DataSet({
               rawData: {a: 1, b: 2}
            });
            assert.strictEqual(ds.getRow().get('a'), 1);
            assert.strictEqual(ds.getRow().get('b'), 2);
         });

         it('should return writable model', function() {
            var ds = new DataSet();
            assert.isTrue(ds.getRow().writable);
         });

         it('should return read only model', function() {
            var ds = new DataSet({
               writable: false
            });
            assert.isFalse(ds.getRow().writable);
         });

         it('should return a model with sbis adapter', function() {
            var data = {
                  _type: 'record',
                  d: ['Test'],
                  s: [
                     {n: 'Name', t: 'Строка'}
                  ]
               },
               ds = new DataSet({
                  adapter: 'Types/entity:adapter.Sbis',
                  rawData: data
               });
            assert.equal(ds.getRow().get('Name'), 'Test');
         });

         it('should return a model from given property', function() {
            var ds = new DataSet({
               rawData: {some: {prop: {a: 1, b: 2}}}
            });
            assert.equal(ds.getRow('some.prop').get('a'), 1);
            assert.equal(ds.getRow('some.prop').get('b'), 2);
         });

         it('should return an empty recordset from undefined property', function() {
            var ds = new DataSet({
               rawData: {}
            });
            assert.instanceOf(ds.getRow('some.prop'), Model);
         });

         it('should return a first item of recordset', function() {
            var data = [{a: 1}, {a: 2}],
               ds = new DataSet({
                  rawData: data
               });
            data._type = 'recordset';
            assert.equal(ds.getRow().get('a'), 1);
         });

         it('should return undefined from empty recordset', function() {
            var data = [],
               ds = new DataSet({
                  rawData: data
               });
            data._type = 'recordset';
            assert.isUndefined(ds.getRow());
         });
         it('should set id property to model', function() {
            var ds = new DataSet({
               rawData: list,
               keyProperty: 'Фамилия'
            });
            assert.equal(ds.getRow()._$idProperty, 'Фамилия');
         });
      });

      describe('.getScalar()', function() {
         it('should return a default value', function() {
            var ds = new DataSet({
               rawData: 'qwe'
            });
            assert.equal(ds.getScalar(), 'qwe');
         });

         it('should return a value from given property', function() {
            var ds = new DataSet({
               rawData: {some: {propA: 'a', propB: 'b'}}
            });
            assert.equal(ds.getScalar('some.propA'), 'a');
            assert.equal(ds.getScalar('some.propB'), 'b');
         });

         it('should return undefined from undefined property', function() {
            var ds = new DataSet({
               rawData: {}
            });
            assert.isUndefined(ds.getScalar('some.prop'));
         });
      });

      describe('.hasProperty()', function() {
         it('should return true for defined property', function() {
            var ds = new DataSet({
               rawData: {a: {b: {c: {}}}}
            });
            assert.isTrue(ds.hasProperty('a'));
            assert.isTrue(ds.hasProperty('a.b'));
            assert.isTrue(ds.hasProperty('a.b.c'));
            assert.isFalse(ds.hasProperty(''));
            assert.isFalse(ds.hasProperty());
         });

         it('should return false for undefined property', function() {
            var ds = new DataSet({
               rawData: {a: {b: {c: {}}}}
            });
            assert.isFalse(ds.hasProperty('e'));
            assert.isFalse(ds.hasProperty('a.e'));
            assert.isFalse(ds.hasProperty('a.b.e'));
         });
      });

      describe('.getProperty()', function() {
         it('should return defined property', function() {
            var data = {a: {b: {c: {}}}},
               ds = new DataSet({
                  rawData: data
               });
            assert.strictEqual(ds.getProperty('a'), data.a);
            assert.strictEqual(ds.getProperty('a.b'), data.a.b);
            assert.strictEqual(ds.getProperty('a.b.c'), data.a.b.c);
            assert.strictEqual(ds.getProperty(''), data);
            assert.strictEqual(ds.getProperty(), data);
         });

         it('should return undefined for undefined property', function() {
            var ds = new DataSet({
               rawData: {a: {b: {c: {}}}}
            });
            assert.isUndefined(ds.getProperty('e'));
            assert.isUndefined(ds.getProperty('a.e'));
            assert.isUndefined(ds.getProperty('a.b.e'));
         });
      });

      describe('.getRawData()', function() {
         it('should return raw data', function() {
            var data = {a: {b: {c: {}}}},
               ds = new DataSet({
                  rawData: data
               });
            assert.strictEqual(ds.getRawData(), data);
         });
      });

      describe('.setRawData()', function() {
         it('should set raw data', function() {
            var data = {a: {b: {c: {}}}},
               ds = new DataSet();
            ds.setRawData(data);
            assert.strictEqual(ds.getRawData(), data);
         });
      });

      describe('.toJSON()', function() {
         it('should return valid signature', function() {
            var options = {
                  rawData: {foo: 'bar'}
               },
               ds = new DataSet(options),
               json = ds.toJSON();

            assert.deepEqual(json.$serialized$, 'inst');
            assert.deepEqual(json.module, 'Types/source:DataSet');
            assert.deepEqual(json.state.$options, options);
         });
      });
   });
});
