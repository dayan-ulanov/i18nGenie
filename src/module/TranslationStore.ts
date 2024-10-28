import fs from 'fs-extra';

interface TranslationData {
	data: Record<string, any>;
	hash: string;
}

export class TranslationStore {
	private store = new Map<string, TranslationData>();
	constructor(private cacheFilePath: string) {
		this.loadCache();
	}

	private async loadCache(): Promise<void> {
		if (await fs.pathExists(this.cacheFilePath)) {
			try {
				const jsonData = JSON.parse(await fs.readFile(this.cacheFilePath, 'utf-8'));
				for (const [filePath, translationData] of Object.entries(jsonData)) {
					this.store.set(filePath, translationData as TranslationData);
				}
			} catch (error) {
				console.error(`Ошибка при загрузке кэша: ${error}`);
				await this.resetCache();
			}
		}
	}

	private async resetCache(): Promise<void> {
		this.store.clear();
		await fs.writeJson(this.cacheFilePath, {}, { spaces: 2 });
		console.log('Кэш данных переводов сброшен.');
	}

	async saveCache(): Promise<void> {
		await fs.writeJson(this.cacheFilePath, Object.fromEntries(this.store.entries()), { spaces: 2 });
		console.log('Кэш данных переводов сохранен.');
	}

	saveTranslationToFile(filePath: string, translations: Record<string, any>): Promise<void> {
		return fs.writeJson(filePath, translations, { spaces: 2 });
	}

	removeUnusedFiles(files: string[]): void {
		this.store.forEach((_, key) => {
			if (!files.includes(key)) this.store.delete(key);
		});
	}

	hasTranslation(filePath: string): boolean {
		return this.store.has(filePath);
	}

	updateTranslation(filePath: string, data: Record<string, any>, hash: string): void {
		this.store.set(filePath, { data, hash });
		console.log(`Обновлены данные для файла ${filePath}`);
	}

	getTranslation(filePath: string): TranslationData | null {
		return this.store.get(filePath) || null;
	}

	getAllTranslations(): Map<string, TranslationData> {
		return this.store;
	}
}
