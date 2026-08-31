import { LanguageServiceDefaults, LanguageServiceDefaultsImpl, modeConfigurationDefault } from 'monaco-sql-languages/esm/monaco.contribution.js';
import { LanguageIdEnum } from 'monaco-sql-languages/esm/common/constants.js';
import { WorkerManager } from 'monaco-sql-languages/esm/workerManager.js';
import { BaseSQLWorker } from 'monaco-sql-languages/esm/baseSQLWorker.js';
import { Position, Uri, editor } from 'monaco-sql-languages/esm/fillers/monaco-editor-core.js';
import { preprocessCode, preprocessCodeHive } from './';

export class LanguageService<T extends BaseSQLWorker = BaseSQLWorker> {
  private workerClients: Map<string, WorkerManager<T>> = new Map();

  public valid(language: string, model: editor.IReadOnlyModel | string) {
    const text = typeof model === 'string' ? model : model.getValue();
    const uri = typeof model === 'string' ? void 0 : model.uri;

    const clientWorker = this.getClientWorker(language, uri as Uri);
    return clientWorker.then(worker => {
      return worker.doValidation(text);
    });
  }

  public parserTreeToString(language: string, model: editor.IReadOnlyModel | string) {
    const text = typeof model === 'string' ? model : model.getValue();
    const uri = typeof model === 'string' ? void 0 : model.uri;

    const clientWorker = this.getClientWorker(language, uri as Uri);
    return clientWorker.then(worker => {
      return worker.parserTreeToString(text);
    });
  }

  public getAllEntities(language: string, model: editor.IReadOnlyModel | string, position?: Position) {
    const text = typeof model === 'string' ? model : model.getValue();
    const uri = typeof model === 'string' ? void 0 : model.uri;

    const clientWorker = this.getClientWorker(language, uri as Uri);
    return clientWorker.then(worker => {
      return worker.getAllEntities(text, position);
    });
  }

  public doCompletionWithEntities(language: string, model: editor.IReadOnlyModel | string, position: Position) {
    let text = typeof model === 'string' ? model : model.getValue();
    const uri = typeof model === 'string' ? void 0 : model.uri;
    text = language === LanguageIdEnum.HIVE ? preprocessCodeHive(text, '`') : preprocessCode(text);
    const clientWorker = this.getClientWorker(language, uri as Uri);
    return clientWorker.then(worker => {
      return worker.doCompletionWithEntities(text, position);
    });
  }

  /**
   * Dispose a language service.
   * If the language is null, dispose all language services.
   */
  public dispose(language?: string): void {
    if (language) {
      if (this.workerClients.has(language)) {
        this.workerClients.get(language)?.dispose();
        this.workerClients.delete(language);
      }
    } else {
      this.workerClients.forEach(client => {
        client.dispose();
      });
      this.workerClients.clear();
    }
  }

  private getClientWorker(language: string, ...uri: Uri[]): Promise<T> {
    let existClient = this.workerClients.get(language);
    if (!existClient) {
      const client = new WorkerManager<T>(this.getLanguageServiceDefault(language));
      this.workerClients.set(language, client);
      return client.getLanguageServiceWorker(...uri);
    }
    return existClient.getLanguageServiceWorker(...uri);
  }

  private getLanguageServiceDefault(languageId: string): LanguageServiceDefaults {
    return new LanguageServiceDefaultsImpl(languageId, modeConfigurationDefault);
  }
}
