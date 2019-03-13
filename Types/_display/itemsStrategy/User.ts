/// <amd-module name="Types/_display/itemsStrategy/User" />
/**
 * Стратегия-декоратор для пользовательского порядка элементов
 * @class Types/_display/ItemsStrategy/User
 * @mixes Types/_entity/DestroyableMixin
 * @implements Types/_display/IItemsStrategy
 * @mixes Types/_entity/SerializableMixin
 * @author Мальцев А.А.
 */

import IItemsStrategy from '../IItemsStrategy';
import {SortFunction} from '../Collection';
import AbstractStrategy, {IOptions as IAbstractOptions} from './AbstractStrategy';
import CollectionItem from '../CollectionItem';
import GroupItem from '../GroupItem';
import {DestroyableMixin, SerializableMixin, ISerializableState as IDefaultSerializableState} from '../../entity';
import {CompareFunction} from '../../_declarations';
import {mixin} from '../../util';

interface IOptions {
   handlers: SortFunction[];
   source: AbstractStrategy;
}

interface ISerializableState extends IDefaultSerializableState {
   _itemsOrder: number[];
}

export default class User extends mixin(
   DestroyableMixin, SerializableMixin
) implements IItemsStrategy /** @lends Types/_display/ItemsStrategy/User.prototype */ {
   /**
    * @typedef {Object} Options
    * @property {Types/_display/ItemsStrategy/Abstract} source Декорирумая стратегия
    * @property {Array.<Function>} handlers Пользовательские методы сортировки
    */

   /**
    * Опции конструктора
    */
   protected _options: IOptions;

   /**
    * Индекс в в стратегии -> оригинальный индекс
    */
   protected _itemsOrder: number[];

   /**
    * Конструктор
    * @param {Options} options Опции
    */
   constructor(options: IOptions) {
      super();
      if (!options || !(options.handlers instanceof Array)) {
         throw new TypeError('Option "handlers" should be an instance of Array');
      }
      this._options = {...options};
   }

   // region Public members

   /**
    * Декорирумая стратегия
    */
   get source(): AbstractStrategy {
      return this._options.source;
   }

   /**
    * Пользовательские методы сортировки
    */
   set handlers(value: SortFunction[]) {
      if (!(value instanceof Array)) {
         throw new TypeError('Option "handlers" should be an instance of Array');
      }
      this._options.handlers = value;
   }

   // endregion

   // region IItemsStrategy

   readonly '[Types/_display/IItemsStrategy]': boolean = true;

   get options(): IAbstractOptions {
      return this.source.options;
   }

   get count(): number {
      return this.source.count;
   }

   get items(): CollectionItem[] {
      const items = this.source.items;
      const itemsOrder = this._getItemsOrder();

      return itemsOrder.map((index) => items[index]);
   }

   at(index: number): CollectionItem {
      const itemsOrder = this._getItemsOrder();
      const sourceIndex = itemsOrder[index];

      return this.source.at(sourceIndex);
   }

   splice(start: number, deleteCount: number, added?: CollectionItem[]): CollectionItem[] {
      this._itemsOrder = null;
      return this.source.splice(start, deleteCount, added);
   }

   reset(): void {
      this._itemsOrder = null;
      return this.source.reset();
   }

   invalidate(): void {
      this._itemsOrder = null;
      return this.source.invalidate();
   }

   getDisplayIndex(index: number): number {
      const sourceIndex = this.source.getDisplayIndex(index);
      const itemsOrder = this._getItemsOrder();
      const itemIndex = itemsOrder.indexOf(sourceIndex);

      return itemIndex === -1 ? itemsOrder.length : itemIndex;
   }

   getCollectionIndex(index: number): number {
      const sourceIndex = this.source.getCollectionIndex(index);
      const itemsOrder = this._getItemsOrder();

      return sourceIndex === -1 ? sourceIndex : itemsOrder[sourceIndex];
   }

   // endregion

   // region SerializableMixin

   protected _getSerializableState(state: IDefaultSerializableState): ISerializableState {
      const resultState: ISerializableState = SerializableMixin.prototype._getSerializableState.call(this, state);

      resultState.$options = this._options;
      resultState._itemsOrder = this._itemsOrder;

      //If some handlers are defined force calc order because handlers can be lost during serialization
      if (!resultState._itemsOrder && this._options.handlers.length) {
         resultState._itemsOrder = this._getItemsOrder();
      }

      return resultState;
   }

   protected _setSerializableState(state: ISerializableState): Function {
      const fromSerializableMixin = SerializableMixin.prototype._setSerializableState(state);
      return function(): void {
         this._itemsOrder = state._itemsOrder;
         fromSerializableMixin.call(this);
      };
   }

   // endregion

   // region Protected

   /**
    * Возвращает соответствие индексов в стратегии оригинальным индексам
    * @protected
    * @return {Array.<Number>}
    */
   protected _getItemsOrder(): number[] {
      if (!this._itemsOrder) {
         this._itemsOrder = this._createItemsOrder();
      }

      return this._itemsOrder;
   }

   /**
    * Создает соответствие индексов в стратегии оригинальным индексам
    * @protected
    * @return {Array.<Number>}
    */
   protected _createItemsOrder(): number[] {
      const items = this.source.items;
      const current = items.map((item, index) => index);

      return User.sortItems(
         items,
         current,
         this._options && this._options.handlers || []
      );
   }

   // endregion

   // region Statics

   /**
    * Создает индекс сортировки в порядке, определенном набором пользовательских обработчиков
    * @param {Array.<Types/_display/CollectionItem>} items Элементы проекции.
    * @param {Array.<Number>} current Текущий индекс сортировки
    * @param {Array.<Function>} handlers Пользовательские обработчики для Array.prototype.sort
    * @return {Array.<Number>}
    */
   static sortItems(items: CollectionItem[], current: number[], handlers: SortFunction[]): number[] {
      if (!handlers || handlers.length === 0) {
         return current;
      }

      const map = [];
      const sorted = [];
      let index;
      let item;

      // Make utilitary array
      for (let i = 0, count = current.length; i < count; i++) {
         index = current[i];
         item = items[index];
         if (item instanceof GroupItem) {
            // Don't sort groups
            map.push(index);
         } else {
            sorted.push({
               item,
               collectionItem: item.getContents(),
               index,
               collectionIndex: index
            });
         }
      }

      // Sort utilitary array
      for (let i = handlers.length - 1; i >= 0; i--) {
         sorted.sort(<CompareFunction> handlers[i]);
      }

      // Create map from utilitary array
      for (let index = 0, count = sorted.length; index < count; index++) {
         map.push(sorted[index].collectionIndex);
      }

      return map;
   }

   // endregion
}

Object.assign(User.prototype, {
   '[Types/_display/itemsStrategy/User]': true,
   _moduleName: 'Types/display:itemsStrategy.User',
   _itemsOrder: null
});
