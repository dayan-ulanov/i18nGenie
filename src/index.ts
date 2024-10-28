import path from 'path';
import { TranslationFileSearcher } from './module/TranslationFileSearcher';
import { TranslationHash } from './module/TranslationHash';
import { TranslationStore } from './module/TranslationStore';

class Main {
	private searcher = new TranslationFileSearcher('**/*.json');
	private store = new TranslationStore(path.join(process.cwd(), 'translationCache.json'));
	private hashTranslation = new TranslationHash(this.store);

	async run(): Promise<void> {
		const startDir = process.cwd();
		await this.searcher.init(path.join(startDir, 'ignore.json'));
		const foundFiles = await this.searcher.search(startDir);

		if (foundFiles.length) {
			await this.hashTranslation.processTranslations(foundFiles);
			console.log(this.store.getAllTranslations());
		} else {
			console.log('Файлы перевода не найдены.');
		}
	}
}

const mainInstance = new Main();
mainInstance.run().catch(console.error);
