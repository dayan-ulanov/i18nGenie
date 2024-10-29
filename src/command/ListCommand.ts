import { Command } from 'commander';
import path from 'path';
import { TranslationStore } from '../module/TranslationStore';

export class ListCommand {
	private program: Command;
	private cachePath: string;

	constructor() {
		this.program = new Command();
		this.cachePath = path.join(process.cwd(), 'translationCache.json');
		this.init();
	}

	init(): void {
		this.program
			.name('list')
			.description('Отображает все переводы, сохраненные в кэше')
			.action(() => this.execute());
	}

	public async execute(): Promise<void> {
		try {
			console.log('Путь к кэшу:', this.cachePath);
			const store = new TranslationStore(this.cachePath);
			await store.initialize();

			const allTranslation = store.getAllTranslations();

			if (allTranslation.size > 0) {
				console.log('Список всех переводов:');
				allTranslation.forEach((translation, key) => {
					console.log(`- ${key}:`, translation.data);
				});
			} else {
				console.log('Нет сохраненных переводов.');
			}
		} catch (error) {
			console.error('Ошибка при выполнении команды:', error);
		}
	}

	public getCommand(): Command {
		return this.program;
	}
}
