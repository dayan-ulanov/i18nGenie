import path from 'path';
import { CliGenie } from './cli';
import { TranslationFileSearcher } from './module/TranslationFileSearcher';
import { TranslationHash } from './module/TranslationHash';
import { TranslationStore } from './module/TranslationStore';
import { InitialLogger } from './utils/Logger'

class Main {
	private logger = new InitialLogger();
	private searcher: TranslationFileSearcher;
	private store: TranslationStore;
	private hashTranslation: TranslationHash;
	private cli: CliGenie;

	constructor() {
		this.logger.init();
		this.searcher = new TranslationFileSearcher('**/*.json');
		this.store = new TranslationStore(
			path.join(process.cwd(), 'translationCache.json')
		);
		this.hashTranslation = new TranslationHash(this.store);
		this.cli = new CliGenie();
	}

	async run(): Promise<void> {
		const startDir = process.cwd();
		await this.searcher.init(path.join(startDir, 'ignore.json'));
		const foundFiles = await this.searcher.search(startDir);

		if (foundFiles.length > 0) {
			await this.hashTranslation.processTranslations(foundFiles);
			console.dev(this.store.getAllTranslations());

			this.cli.run(process.argv);
		} else {
			console.dev('Файлы перевода не найдены.');
		}
	}
}

const mainInstance = new Main();
mainInstance.run();
