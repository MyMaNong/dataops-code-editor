// @ts-nocheck
import { LanguageIdEnum } from 'monaco-sql-languages/esm/main.js';

export const setupWorker = () => {
  (globalThis as any).MonacoEnvironment = {
    getWorker(_: any, label: string) {
      console.log(_, label);
      if (label === LanguageIdEnum.FLINK) {
        return new Worker(new URL('monaco-sql-languages/esm/languages/flink/flink.worker', import.meta.url));
      }
      if (label === LanguageIdEnum.HIVE) {
        return new Worker(new URL('monaco-sql-languages/esm/languages/hive/hive.worker', import.meta.url));
      }
      if (label === LanguageIdEnum.SPARK) {
        return new Worker(new URL('monaco-sql-languages/esm/languages/spark/spark.worker', import.meta.url));
      }
      if (label === LanguageIdEnum.PG) {
        return new Worker(new URL('monaco-sql-languages/esm/languages/pgsql/pgsql.worker', import.meta.url));
      }
      if (label === LanguageIdEnum.MYSQL) {
        return new Worker(new URL('monaco-sql-languages/esm/languages/mysql/mysql.worker', import.meta.url));
      }
      if (label === LanguageIdEnum.TRINO) {
        return new Worker(new URL('monaco-sql-languages/esm/languages/trino/trino.worker', import.meta.url));
      }
      if (label === LanguageIdEnum.IMPALA) {
        return new Worker(new URL('monaco-sql-languages/esm/languages/impala/impala.worker', import.meta.url));
      }
      if (label === 'json') {
        return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
      }
      return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
    },
  };
};
