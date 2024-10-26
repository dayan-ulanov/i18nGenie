import path from 'path';
import { TranslationFileSearcher } from './module/TranslationFileSearcher';

class Main {
	private searcher: TranslationFileSearcher;

	constructor() {
		this.searcher = new TranslationFileSearcher('**/*.json');
	}

	async run(): Promise<void> {
		const startDir = process.cwd();
		await this.searcher.init(path.join(startDir, 'ignore.json'));
		await this.searcher.search(startDir);
	}
}

const mainInstance = new Main();
mainInstance
	.run()
	.catch((error) =>
		console.error('Ошибка при выполнении основного процесса:', error)
	);
