import IEnumerator from './IEnumerator';

export type EnumeratorCallback<T> = (item: T, index: number) => void;

/**
 * Interface of collection which provides their members through simple iteration one by one.
 * @interface Types/_collection/IEnumerable
 * @public
 * @author Мальцев А.А.
 */
export default interface IEnumerable<T> {
   readonly '[Types/_collection/IEnumerable]': boolean;

   /**
    * Возвращает энумератор для перебора элементов коллекции
    * @return {Types/_collection/IEnumerator}
    * @example
    * Получим элементы коллекции через энумератор:
    * <pre>
    *    var list = new List({
    *          items: [1, 2, 3]
    *       }),
    *       enumerator = list.getEnumerator();
    *
    *    while (enumerator.moveNext()) {
    *       console.log(enumerator.getCurrent());
    *    }
    *    //1, 2, 3
    * </pre>
    */
   getEnumerator(): IEnumerator<T>;

   /**
    * Перебирает все элементы коллекции, начиная с первого.
    * Цикл проходит полное количество итераций, его невозможно прервать досрочно.
    * @param {function(*, Number)} callback Ф-я обратного вызова для каждого элемента коллекции
    * (аргументами придут элемент коллекции и его порядковый номер)
    * @param {Object} [context] Контекст вызова callback
    * @example
    * Получим элементы коллекции:
    * <pre>
    *    var list = new List({
    *          items: [1, 2, 3]
    *       }),
    *
    *    list.each(function(item) {
    *       console.log(item);
    *    });
    *    //1, 2, 3
    * </pre>
    */
   each(callback: EnumeratorCallback<T>, context?: object): void;
}
