/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Types/_entity/adapter/JsonTable',
   'Types/_entity/format/fieldsFactory'
], function(
   JsonTable,
   fieldsFactory
) {
   'use strict';

   JsonTable = JsonTable.default;
   fieldsFactory = fieldsFactory.default;

   describe('Types/_entity/adapter/JsonTable', function() {
      var data,
         adapter;

      beforeEach(function() {
         data = [{
            'Ид': 1,
            'Фамилия': 'Иванов'
         }, {
            'Ид': 2,
            'Фамилия': 'Петров'
         }, {
            'Ид': 3,
            'Фамилия': 'Сидоров'
         }, {
            'Ид': 4,
            'Фамилия': 'Пухов'
         }, {
            'Ид': 5,
            'Фамилия': 'Молодцов'
         }, {
            'Ид': 6,
            'Фамилия': 'Годолцов'
         }, {
            'Ид': 7,
            'Фамилия': 'Арбузнов'
         }];

         adapter = new JsonTable(data);
      });

      afterEach(function() {
         data = undefined;
         adapter = undefined;
      });

      describe('.getFields()', function() {
         it('should return fields list', function() {
            assert.deepEqual(
               adapter.getFields(),
               ['Ид', 'Фамилия']
            );
         });

         it('should return fields use each row', function() {
            var data = [{
                  foo: 1
               }, {
                  foo: 2,
                  bar: 3
               }, {
                  baz: 4
               }],
               adapter = new JsonTable(data);

            assert.deepEqual(
               adapter.getFields(),
               ['foo', 'bar', 'baz']
            );
         });

         it('should return an empty array for no data', function() {
            var adapter = new JsonTable(),
               fields = adapter.getFields();
            assert.instanceOf(fields, Array);
            assert.strictEqual(fields.length, 0);
         });
      });

      describe('.getCount()', function() {
         it('should return records count', function() {
            assert.strictEqual(
               7,
               adapter.getCount()
            );
            assert.strictEqual(
               0,
               new JsonTable().getCount([])
            );
            assert.strictEqual(
               0,
               new JsonTable().getCount({})
            );
            assert.strictEqual(
               0,
               new JsonTable().getCount('')
            );
            assert.strictEqual(
               0,
               new JsonTable().getCount(0)
            );
            assert.strictEqual(
               0,
               new JsonTable().getCount()
            );
         });
      });

      describe('.add()', function() {
         it('should append a record', function() {
            adapter.add({
               'Ид': 30
            });
            assert.strictEqual(
               8,
               data.length
            );
            assert.strictEqual(
               30,
               data[data.length - 1]['Ид']
            );
         });

         it('should prepend a record', function() {
            adapter.add({
               'Ид': 31
            }, 0);
            assert.strictEqual(
               8,
               data.length
            );
            assert.strictEqual(
               31,
               data[0]['Ид']
            );
         });

         it('should insert a record', function() {
            adapter.add({
               'Ид': 32
            }, 2);
            assert.strictEqual(
               8,
               data.length
            );
            assert.strictEqual(
               32,
               data[2]['Ид']
            );
         });

         it('should throw an error on invalid position', function() {
            assert.throws(function() {
               adapter.add({
                  'Ид': 33
               }, 100);
            });
            assert.throws(function() {
               adapter.add({
                  'Ид': 34
               }, -1);
            });
         });
      });

      describe('.at()', function() {
         it('should return valid record', function() {
            assert.strictEqual(
               1,
               adapter.at(0)['Ид']
            );
            assert.strictEqual(
               3,
               adapter.at(2)['Ид']
            );
         });

         it('should return undefined on invalid position', function() {
            assert.isUndefined(
               adapter.at(-1)
            );
            assert.isUndefined(
               adapter.at(99)
            );
         });

         it('should return undefined on invalid data', function() {
            assert.isUndefined(
               new JsonTable({}).at()
            );
            assert.isUndefined(
               new JsonTable('').at()
            );
            assert.isUndefined(
               new JsonTable(0).at()
            );
            assert.isUndefined(
               new JsonTable().at()
            );
         });
      });

      describe('.remove()', function() {
         it('should remove the record', function() {
            adapter.remove(0);
            assert.strictEqual(
               2,
               data[0]['Ид']
            );

            adapter.remove(2);
            assert.strictEqual(
               5,
               data[2]['Ид']
            );

            adapter.remove(5);
            assert.isUndefined(
               data[5]
            );
         });

         it('should throw an error on invalid position', function() {
            assert.throws(function() {
               adapter.remove(-1);
            });
            assert.throws(function() {
               adapter.remove(99);
            });
         });
      });

      describe('.replace()', function() {
         it('should replace the record', function() {
            adapter.replace({
               'Ид': 11
            }, 0);
            assert.strictEqual(
               11,
               data[0]['Ид']
            );

            adapter.replace({
               'Ид': 12
            }, 4);
            assert.strictEqual(
               12,
               data[4]['Ид']
            );

         });

         it('should throw an error on invalid position', function() {
            assert.throws(function() {
               adapter.replace({}, -1);
            });
            assert.throws(function() {
               adapter.replace({}, 99);
            });
         });
      });

      describe('.move()', function() {
         it('should move Иванов instead Сидоров', function() {
            adapter.move(0, 2);
            assert.strictEqual(
               'Петров',
               data[0]['Фамилия']
            );
            assert.strictEqual(
               'Сидоров',
               data[1]['Фамилия']
            );
            assert.strictEqual(
               'Иванов',
               data[2]['Фамилия']
            );
         });
         it('should move Сидоров instead Иванов', function() {
            adapter.move(2, 0);
            assert.strictEqual(
               'Сидоров',
               data[0]['Фамилия']
            );
            assert.strictEqual(
               'Иванов',
               data[1]['Фамилия']
            );
            assert.strictEqual(
               'Петров',
               data[2]['Фамилия']
            );
         });
         it('should move Петров to the end', function() {
            adapter.move(1, 6);
            assert.strictEqual(
               'Петров',
               data[6]['Фамилия']
            );
            assert.strictEqual(
               'Арбузнов',
               data[5]['Фамилия']
            );
         });
         it('should not move Петров', function() {
            adapter.move(1, 1);
            assert.strictEqual(
               'Петров',
               data[1]['Фамилия']
            );
            assert.strictEqual(
               'Годолцов',
               data[5]['Фамилия']
            );
         });
      });

      describe('.merge()', function() {
         it('should merge two records', function() {
            adapter.merge(0, 1, 'Ид');
            assert.strictEqual(
               'Петров',
               data[0]['Фамилия']
            );
         });
      });

      describe('.copy()', function() {
         it('should copy the record', function() {
            var copy = adapter.copy(1);
            assert.deepEqual(
               copy,
               data[1]
            );
         });

         it('should insert a copy after the original', function() {
            var copy = adapter.copy(1);
            assert.strictEqual(
               copy,
               data[2]
            );
         });
      });

      describe('.clear()', function() {
         it('should return an empty table', function() {
            assert.isTrue(data.length > 0);
            adapter.clear();
            assert.strictEqual(adapter.getData().length, 0);
         });
         it('should return a same instance', function() {
            adapter.clear();
            assert.strictEqual(data, adapter.getData());
         });
      });

      describe('.getData()', function() {
         it('should return raw data', function() {
            assert.strictEqual(adapter.getData(), data);
         });
      });

      describe('.getFormat()', function() {
         it('should return exists field format', function() {
            var format = adapter.getFormat('Ид');
            assert.strictEqual(format.getName(), 'Ид');
         });

         it('should return field format for any record', function() {
            var data = [{
                  foo: 1
               }, {
                  bar: 2
               }, {
                  baz: 3
               }],
               adapter = new JsonTable(data);

            assert.strictEqual(adapter.getFormat('foo').getName(), 'foo');
            assert.strictEqual(adapter.getFormat('bar').getName(), 'bar');
            assert.strictEqual(adapter.getFormat('baz').getName(), 'baz');
         });

         it('should throw an error for not exists field', function() {
            assert.throws(function() {
               adapter.getFormat('Some');
            });
         });
      });

      describe('.addField()', function() {
         it('should add a new field', function() {
            var fieldName = 'New',
               field = fieldsFactory({
                  type: 'string',
                  name: fieldName
               });
            adapter.addField(field, 0);
            assert.strictEqual(adapter.getFormat(fieldName).getName(), fieldName);
         });
         it('should use a field default value', function() {
            var fieldName = 'New',
               def = 'abc';
            adapter.addField(fieldsFactory({
               type: 'string',
               name: fieldName,
               defaultValue: def
            }));
            for (var i = 0; i < adapter.getCount(); i++) {
               assert.strictEqual(adapter.at(i)[fieldName], def);
            }
         });
         it('should don\'t throw an error for already exists field', function() {
            adapter.addField(fieldsFactory({
               type: 'string',
               name: 'Ид'
            }));
         });
         it('should throw an error for not a field', function() {
            assert.throws(function() {
               adapter.addField();
            });
            assert.throws(function() {
               adapter.addField(null);
            });
            assert.throws(function() {
               adapter.addField({
                  type: 'string',
                  name: 'New'
               });
            });
         });
      });

      describe('.removeField()', function() {
         it('should remove exists field', function() {
            var name = 'Ид';
            adapter.removeField(name);
            for (var i = 0; i < adapter.getCount(); i++) {
               assert.isUndefined(adapter.at(i)[name]);
            }
            assert.throws(function() {
               adapter.getFormat(name);
            });
         });
         it('should throw an error for not exists field', function() {
            assert.throws(function() {
               adapter.removeField('Some');
            });
         });
      });

      describe('.removeFieldAt()', function() {
         it('should throw an error', function() {
            assert.throws(function() {
               adapter.removeFieldAt(0);
            });
         });
      });
   });
});
