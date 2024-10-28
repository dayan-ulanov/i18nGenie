import path from 'path';
import { TranslationFileSearcher } from './module/TranslationFileSearcher';
import { TranslationHash } from './module/TranslationHash'
import { TranslationStore } from './module/TranslationStore'

class Main {
	private searcher: TranslationFileSearcher;
	private hashTranslation: TranslationHash;
	private store: TranslationStore;

	constructor() {
		this.searcher = new TranslationFileSearcher('**/*.json');
		const cacheFilePath = path.join(process.cwd(), 'translationCache.json');
		this.store = new TranslationStore(cacheFilePath);
		this.hashTranslation = new TranslationHash(this.store);
	}

	async run(): Promise<void> {
		const startDir = process.cwd();
		await this.searcher.init(path.join(startDir, 'ignore.json'));
		const foundFiles = await this.searcher.search(startDir);

		if (foundFiles.length > 0) {
			await this.hashTranslation.processTranslations(foundFiles);
			await this.searcher.search(startDir);
			console.log(this.store.getAllTranslations());
		} else {
			console.log('Файлы перевода не найдены.');
		}
	}
}

const mainInstance = new Main();
mainInstance
	.run()
	.catch((error) =>
		console.error('Ошибка при выполнении основного процесса:', error)
	);
