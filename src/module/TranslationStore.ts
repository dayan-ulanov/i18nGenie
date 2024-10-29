import crypto from 'crypto';
import fs from 'fs-extra';

interface TranslationData {
	data: Record<string, any>;
	hash: string;
}
 
export class TranslationStore {
	private store = new Map<string, TranslationData>();

	constructor(private cacheFilePath: string) {}

	async initialize(): Promise<void> {
		await this.loadCache();
	}

	private async loadCache(): Promise<void> {
		if (await fs.pathExists(this.cacheFilePath)) {
			try {
				const jsonData = await fs.readJson(this.cacheFilePath);
				for (const [filePath, translationData] of Object.entries(jsonData)) {
					this.store.set(filePath, translationData as TranslationData);
				}
			} catch (error) {
				console.devError(`Ошибка при загрузке кэша: ${error}`);
				await this.resetCache();
			}
		} else {
			console.dev('Файл кэша не найден. Создаётся новый.');
			await this.resetCache();
		}
	}

	async processTranslations(files: string[]): Promise<void> {
		for (const filePath of files) {
			const translations = await this.readTranslationFile(filePath);
			const hash = this.generateHash(translations);

			console.dev(`Обрабатываем файл: ${filePath}`);
			console.dev(`Сгенерированный хеш: ${hash}`);

			if (
				!this.hasTranslation(filePath) ||
				this.getTranslation(filePath)?.hash !== hash
			) {
				this.updateTranslation(filePath, translations, hash);
				await this.saveTranslationToFile(filePath, translations);
			} else {
				console.dev(`Нет изменений для файла ${filePath}.`);
			}
		}

		this.removeUnusedFiles(files);
		await this.saveCache();
	}

	private async resetCache(): Promise<void> {
		this.store.clear();
		await fs.writeJson(this.cacheFilePath, {}, { spaces: 2 });
		console.dev('Кэш данных переводов сброшен.');
	}

	async saveCache(): Promise<void> {
		await fs.writeJson(
			this.cacheFilePath,
			Object.fromEntries(this.store.entries()),
			{ spaces: 2 }
		);
		console.dev('Кэш данных переводов сохранен.');
	}

	async saveTranslationToFile(
		filePath: string,
		translations: Record<string, any>
	): Promise<void> {
		await fs.writeJson(filePath, translations, { spaces: 2 });
		console.dev(`Переводы сохранены в файл ${filePath}.`);
	}

	removeUnusedFiles(files: string[]): void {
		this.store.forEach((_, key) => {
			if (!files.includes(key)) this.store.delete(key);
		});
	}

	hasTranslation(filePath: string): boolean {
		return this.store.has(filePath);
	}

	updateTranslation(
		filePath: string,
		data: Record<string, any>,
		hash: string
	): void {
		this.store.set(filePath, { data, hash });
		console.dev(`Обновлены данные для файла ${filePath}`);
	}

	getTranslation(filePath: string): TranslationData | null {
		return this.store.get(filePath) || null;
	}

	getAllTranslations(): Map<string, TranslationData> {
		return this.store;
	}

	private async readTranslationFile(
		filePath: string
	): Promise<Record<string, any>> {
		return await fs.readJson(filePath);
	}

	private generateHash(translations: Record<string, any>): string {
		return crypto
			.createHash('sha256')
			.update(JSON.stringify(translations))
			.digest('hex');
	}
}
