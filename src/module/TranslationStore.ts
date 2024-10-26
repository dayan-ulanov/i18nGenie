import fs from 'fs-extra';

interface TranslationData {
	data: Record<string, any>;
	hash: string;
}

export class TranslationStore {
	private store: Map<string, TranslationData> = new Map();
	private cacheFilePath: string;

	constructor(cacheFilePath: string) {
		this.cacheFilePath = cacheFilePath;
		this.loadCache();
	}

	private async loadCache(): Promise<void> {
		if (await fs.pathExists(this.cacheFilePath)) {
			const data = await fs.readFile(this.cacheFilePath, 'utf-8');
			if (!data) {
				console.warn('Кэш данных переводов пуст. Создание нового кэша.');
				return;
			}
			try {
				const jsonData = JSON.parse(data);
				for (const [filePath, translationData] of Object.entries(jsonData)) {
					this.store.set(filePath, translationData as TranslationData);
				}
				console.log('Кэш данных переводов загружен.');
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
		const data = Object.fromEntries(this.store.entries());

		if (typeof data !== 'object' || Array.isArray(data)) {
			console.error('Неверная структура данных для кэша.');
			return;
		}

		await fs.writeJson(this.cacheFilePath, data, { spaces: 2 });
		console.log('Кэш данных переводов сохранен.');
	}

	deleteHash(filePath: string): void {
		if (this.store.has(filePath)) {
			this.store.delete(filePath);
			console.log(`Перевод для файла ${filePath} удален из хранилища.`);
		} else {
			console.log(`Файл ${filePath} не найден в хранилище.`);
		}
	}

	addTranslation(filePath: string, data: Record<string, any>, hash: string) {
		this.store.set(filePath, { data, hash });
	}

	getTranslation(filePath: string): Record<string, any> | null {
		return this.store.get(filePath)?.data || null;
	}

	hasTranslation(filePath: string): boolean {
		return this.store.has(filePath);
	}

	updateTranslation(
		filePath: string,
		data: Record<string, any>,
		hash: string
	): void {
		const existing = this.store.get(filePath);

		if (!existing || existing.hash !== hash) {
			this.store.set(filePath, { data, hash });
			console.log(`Данные для файла ${filePath} обновлены.`);
		} else {
			console.log(`Нет изменений для файла ${filePath}.`);
		}
	}

	getAllTranslations(): Map<string, TranslationData> {
		return this.store;
	}
}
