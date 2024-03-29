/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Types/_entity/adapter/JsonRecord',
   'Types/_entity/format/fieldsFactory'
], function(
   JsonRecord,
   fieldsFactory
) {
   'use strict';

   JsonRecord = JsonRecord.default;
   fieldsFactory = fieldsFactory.default;

   describe('Types/_entity/adapter/JsonRecord', function() {
      var data,
         adapter;

      beforeEach(function() {
         data = {
            'Ид': 1,
            'Фамилия': 'Иванов',
            'Имя': 'Иван',
            'Отчество': 'Иванович'
         };

         adapter = new JsonRecord(data);
      });

      afterEach(function() {
         data = undefined;
         adapter = undefined;
      });

      describe('.get()', function() {
         it('should return the property value', function() {
            assert.strictEqual(
               1,
               adapter.get('Ид')
            );
            assert.strictEqual(
               'Иванов',
               adapter.get('Фамилия')
            );
            assert.isUndefined(
               adapter.get('Должность')
            );
            assert.isUndefined(
               new JsonRecord({}).get('Должность')
            );
            assert.isUndefined(
               new JsonRecord().get()
            );
            assert.isUndefined(
               new JsonRecord('').get()
            );
            assert.isUndefined(
               new JsonRecord(0).get()
            );
            assert.isUndefined(
               new JsonRecord().get()
            );
         });
      });

      describe('.set()', function() {
         it('should set the property value', function() {
            adapter.set('Ид', 20);
            assert.strictEqual(
               20,
               data['Ид']
            );

            adapter.set('а', 5);
            assert.strictEqual(
               5,
               data['а']
            );

            adapter.set('б');
            assert.isUndefined(
               data['б']
            );
         });
         it('should throw an error on invalid data', function() {
            assert.throws(function() {
               adapter.set();
            });
            assert.throws(function() {
               adapter.set('');
            });
            assert.throws(function() {
               adapter.set(0);
            });
         });
      });

      describe('.clear()', function() {
         it('should return an empty record', function() {
            assert.notEqual(Object.keys(data).length, 0);
            adapter.clear();
            assert.equal(Object.keys(adapter.getData()).length, 0);
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

      describe('.getFields()', function() {
         it('should return fields list', function() {
            assert.deepEqual(
               adapter.getFields(),
               ['Ид', 'Фамилия', 'Имя', 'Отчество']
            );
         });
      });

      describe('.getFormat()', function() {
         it('should return exists field format', function() {
            var format = adapter.getFormat('Ид');
            assert.strictEqual(format.getName(), 'Ид');
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
            assert.strictEqual(adapter.get(fieldName), def);
         });
         it('should throw an error for already exists field', function() {
            assert.throws(function() {
               adapter.addField(fieldsFactory({
                  type: 'string',
                  name: 'Ид'
               }));
            });
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
            var name = 'Ид',
               oldFields = adapter.getFields();
            adapter.removeField(name);
            assert.isUndefined(adapter.get(name));
            assert.strictEqual(adapter.getFields().indexOf(name), -1);
            assert.strictEqual(adapter.getFields().length, oldFields.length - 1);
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
