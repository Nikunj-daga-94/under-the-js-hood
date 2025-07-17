declare namespace MyPromise {
  type ResolveType<T> = (value: T | PromiseLike<T>) => void;
  type RejectType = (reason?: any) => void;
  type Executor<T> = (resolve: ResolveType<T>, reject: RejectType) => void;
  type PromiseState = 'pending' | 'fulfilled' | 'rejected';

  interface PromiseLike<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): PromiseLike<TResult1 | TResult2>;
  }

  interface Thenable<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Thenable<TResult1 | TResult2>;
  }

  interface PromiseFulfilledResult<T> {
    status: 'fulfilled';
    value: T;
  }

  interface PromiseRejectedResult {
    status: 'rejected';
    reason: any;
  }

  type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;
}

declare class MyPromise<T> implements PromiseLike<T> {
  constructor(executor: MyPromise.Executor<T>);

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): MyPromise<TResult1 | TResult2>;

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): MyPromise<T | TResult>;

  finally(onfinally?: (() => void) | undefined | null): MyPromise<T>;

  static all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>, T10 | PromiseLike<T10>]
  ): MyPromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;

  static all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>]
  ): MyPromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

  static all<T1, T2, T3, T4, T5, T6, T7, T8>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>]
  ): MyPromise<[T1, T2, T3, T4, T5, T6, T7, T8]>;

  static all<T1, T2, T3, T4, T5, T6, T7>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>]
  ): MyPromise<[T1, T2, T3, T4, T5, T6, T7]>;

  static all<T1, T2, T3, T4, T5, T6>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>]
  ): MyPromise<[T1, T2, T3, T4, T5, T6]>;

  static all<T1, T2, T3, T4, T5>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>]
  ): MyPromise<[T1, T2, T3, T4, T5]>;

  static all<T1, T2, T3, T4>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>]
  ): MyPromise<[T1, T2, T3, T4]>;

  static all<T1, T2, T3>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>]
  ): MyPromise<[T1, T2, T3]>;

  static all<T1, T2>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]
  ): MyPromise<[T1, T2]>;

  static all<T>(values: Iterable<T | PromiseLike<T>>): MyPromise<T[]>;

  static race<T>(values: Iterable<T | PromiseLike<T>>): MyPromise<T>;

  static allSettled<T extends readonly unknown[] | []>(
    values: T
  ): MyPromise<{ [P in keyof T]: PromiseSettledResult<T[P] extends PromiseLike<infer U> ? U : T[P]> }>;

  static allSettled<T>(
    values: Iterable<T>
  ): MyPromise<PromiseSettledResult<T extends PromiseLike<infer U> ? U : T>[]>;

  static any<T>(values: Iterable<T | PromiseLike<T>>): MyPromise<T>;

  static resolve(): MyPromise<void>;
  static resolve<T>(value: T | PromiseLike<T>): MyPromise<Awaited<T>>;
  
  static reject<T = never>(reason?: any): MyPromise<T>;
}

export = MyPromise;
