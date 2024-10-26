import path from 'path';
import { TranslationFileSearcher } from './module/TranslationFileSearcher';
import { HashTranslation } from './module/HashTranslation'

class Main {
	private searcher: TranslationFileSearcher;
	private hashTranslation: HashTranslation;

	constructor() {
		this.searcher = new TranslationFileSearcher('**/*.json');
		this.hashTranslation = new HashTranslation();
	}

	async run(): Promise<void> {
		const startDir = process.cwd();
		await this.searcher.init(path.join(startDir, 'ignore.json'));
		await this.searcher.search(startDir);
		const foundFiles = await this.searcher.search(startDir);
		await this.hashTranslation.processTranslations(foundFiles);
	}
}

const mainInstance = new Main();
mainInstance
	.run()
	.catch((error) =>
		console.error('Ошибка при выполнении основного процесса:', error)
	);
