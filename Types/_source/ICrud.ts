import Query from './Query';
import DataSet from './DataSet';
import {Record} from '../entity';
import {RecordSet} from '../collection';
import {ExtendPromise} from '../_declarations';

/**
 * Интерфейс источника данных, поддерживающиего контракт
 * {@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete CRUD}, применяемый к объекту предметной области.
 * @remark
 * Создадим новую статью:
 * <pre>
 *    var dataSource = new CrudSource();
 *    dataSource.create().addCallbacks(function(article) {
 *       console.log(article.getId());
 *    }, function(error) {
 *       console.error(error);
 *    });
 * </pre>
 * Прочитаем статью:
 * <pre>
 *    var dataSource = new CrudSource();
 *    dataSource.read('article-1').addCallbacks(function(article) {
 *       console.log(article.get('title'));
 *    }, function(error) {
 *       console.error(error);
 *    });
 * </pre>
 * Сохраним статью:
 * <pre>
 *    var dataSource = new CrudSource(),
 *       article = new Record({
 *          rawData: {
 *             id: 'article-1',
 *             title: 'Article 1'
 *          }
 *       });
 *
 *    dataSource.update(article).addCallbacks(function() {
 *       console.log('Article updated!');
 *    }, function(error) {
 *       console.error(error);
 *    });
 * </pre>
 * Удалим статью:
 * <pre>
 *    var dataSource = new CrudSource();
 *    dataSource.destroy('article-1').addCallbacks(function(article) {
 *       console.log('Article deleted!');
 *    }, function(error) {
 *       console.error(error);
 *    });
 * </pre>
 * @interface Types/_source/ICrud
 * @public
 * @author Мальцев А.А.
 */
export default interface ICrud {
   readonly '[Types/_source/ICrud]': boolean;

   /**
    * Создает пустую запись через источник данных (при этом она не сохраняется в хранилище)
    * @param [meta] Дополнительные мета данные, которые могут понадобиться для создания записи
    * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_entity/Record} - созданную запись,
    * в случае ошибки - Error.
    * @see Types/_entity/Record
    * @example
    * Создадим новую статью:
    * <pre>
    *    var dataSource = new CrudSource({
    *       endpoint: '/articles/',
    *       keyProperty: 'id'
    *    });
    *    dataSource.create().addCallbacks(function(article) {
    *       console.log(article.get('id')),//01c5151e-21fe-5316-d118-cb13216c9412
    *       console.log(article.get('title'));//Untitled
    *    }, function(error) {
    *       console.error('Can\'t create an article', error);
    *    });
    * </pre>
    * Создадим нового сотрудника:
    * <pre>
    *     var dataSource = new SbisService({
    *        endpoint: 'Employee',
    *        keyProperty: '@Employee'
    *     });
    *     dataSource.create().addCallbacks(function(employee) {
    *        console.log(employee.get('Name'));
    *     }, function(error) {
    *        console.error('Can\'t create an employee', error);
    *    });
    * </pre>
    */
   create(meta?: object): ExtendPromise<Record>;

   /**
    * Читает запись из источника данных
    * @param key Первичный ключ записи
    * @param [meta] Дополнительные мета данные
    * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_entity/Record} - прочитанную
    * запись, в случае ошибки - Error.
    * @example
    * Прочитаем статью с ключом 'how-to-read-an-item':
    * <pre>
    *    var dataSource = new CrudSource({
    *       endpoint: '/articles/',
    *       keyProperty: 'code'
    *    });
    *    dataSource.read('how-to-read-an-item').addCallbacks(function(article) {
    *       console.log(article.get('code')),//how-to-read-an-item
    *       console.log(article.get('title'));//How to read an item
    *    }, function(error) {
    *       console.error('Can\'t read the article', error);
    *    });
    * </pre>
    * Прочитаем данные сотрудника с идентификатором 123321:
    * <pre>
    *     var dataSource = new SbisService({
    *        endpoint: 'Employee',
    *        keyProperty: '@Employee'
    *     });
    *     dataSource.read(123321).addCallbacks(function(employee) {
    *         console.log(employee.get('Name'));
    *     }, function(error) {
    *       console.error('Can\'t read the employee', error);
    *    });
    * </pre>
    */
   read(key: number | string, meta?: object): ExtendPromise<Record>;

   /**
    * Обновляет запись в источнике данных
    * @param data Обновляемая запись или рекордсет
    * @param [meta] Дополнительные мета данные
    * @return Асинхронный результат выполнения: в случае успеха ничего не вернет, в случае ошибки - Error.
    * @example
    * Обновим статью с ключом 'how-to-update-an-item':
    * <pre>
    *    var dataSource = new CrudSource({
    *          endpoint: '/articles/',
    *          keyProperty: 'code'
    *       }),
    *       article = new Record({
    *          rawData: {
    *             code: 'how-to-update-an-item',
    *             title: 'How to update an item'
    *          }
    *       });
    *    dataSource.update(article).addCallbacks(function() {
    *       console.log('The article has been updated successfully');
    *    }, function(error) {
    *       console.error('Can\'t update the article', error);
    *    });
    * </pre>
    * Обновим данные сотрудника с идентификатором 123321:
    * <pre>
    *    require(['Types/source', Types/entity], function(source, entity) {
    *       var dataSource = new source.SbisService({
    *             endpoint: 'Employee'
    *             keyProperty: '@Employee'
    *          }),
    *          employee = new entity.Record({
    *             format: [
    *                {name: '@Employee', type: 'identity'},
    *                {name: 'Position', type: 'string'}
    *             ],
    *             adapter: dataSource.getAdapter()
    *          });
    *
    *       employee.set({
    *          '@Employee':  [123321],
    *          Position: 'Senior manager'
    *       });
    *
    *       dataSource.update(employee).addCallbacks(function() {
    *          console.log('The employee has been updated successfully');
    *       }, function(error) {
    *          console.error('Can\'t update the article', error);
    *       });
    *    });
    * </pre>
    */
   update(data: Record | RecordSet, meta?: object): ExtendPromise<null>;

   /**
    * Удаляет запись из источника данных
    * @param keys Первичный ключ, или массив первичных ключей записи
    * @param [meta] Дополнительные мета данные
    * @return Асинхронный результат выполнения: в случае успеха ничего не вернет, в случае ошибки - Error.
    * @example
    * Удалим статью с ключом 'article-id-to-destroy':
    * <pre>
    *    var dataSource = new CrudSource({
    *       endpoint: '/articles/',
    *       keyProperty: 'code'
    *    });
    *    dataSource.destroy('article-id-to-destroy').addCallbacks(function() {
    *       console.log('The article has been deleted successfully');
    *    }, function(error) {
    *       console.error('Can\'t delete the article', error);
    *    });
    * </pre>
    * Удалим сотрудника с идентификатором 123321:
    * <pre>
    *     var dataSource = new SbisService({
    *        endpoint: 'Employee',
    *        keyProperty: '@Employee'
    *     });
    *     dataSource.destroy(123321).addCallbacks(function() {
    *       console.log('The employee has been deleted successfully');
    *     }, function(error) {
    *       console.error('Can\'t delete the article', error);
    *     });
    * </pre>
    */
   destroy(keys: number | string | number[] | string[], meta?: object): ExtendPromise<null>;

   /**
    * Выполняет запрос на выборку
    * @param [query] Запрос
    * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_source/DataSet} - прочитаннные
    * данные, в случае ошибки - Error.
    * @see Types/_source/Query
    * @see Types/_source/DataSet
    * @example
    * Выберем новые книги опредленного жанра:
    * <pre>
    *    var dataSource = new CrudSource({
    *          endpoint: '/books/'
    *       }),
    *       query = new Query();
    *
    *    query
    *       .select(['id', 'name', 'author', 'genre'])
    *       .where({
    *          genre: ['Thriller', 'Detective']
    *       })
    *       .orderBy('date', false);
    *
    *    dataSource.query(query).addCallbacks(function(dataSet) {
    *       var books = dataSet.getAll();
    *       //Deal with the books
    *    }, function(error) {
    *       console.error('Can\'t read the books', error);
    *    });
    * </pre>
    * Найдем молодые таланты среди сотрудников:
    * <pre>
    *    var dataSource = new MemorySource({
    *          data: [
    *             //Some data here
    *          ]
    *       }),
    *       query = new Query();
    *
    *    query
    *       .select(['id', 'name', 'position' ])
    *       .where(function(employee) {
    *          return employee.get('position') === 'TeamLead' && employee.get('age') <= 18;
    *       })
    *       .orderBy('age');
    *
    *    dataSource.query(query).addCallbacks(function(dataSet) {
    *       if (dataSet.getAll().getCount() > 0) {
    *          //A new Mark Zuckerberg detected
    *       }
    *    }, function(error) {
    *       console.error('Can\'t read the employees', error);
    *    });
    * </pre>
    */
   query(query: Query): ExtendPromise<DataSet>;
}
