import { SHA256 } from 'crypto-js';
import fs from 'fs-extra';
import path from 'path';
import type { TranslationStore } from './TranslationStore'

export class TranslationHash {
	private store: TranslationStore;

	constructor(store: TranslationStore) {
		this.store = store;

		process.on('exit', () => {
			this.store.saveCache().catch(console.error);
		});
	}

	async readTranslationFile(filePath: string): Promise<Record<string, any>> {
		try {
			const data = await fs.readFile(filePath, 'utf-8');
			return JSON.parse(data);
		} catch (error) {
			console.error(`Ошибка при чтении файла ${filePath}:`, error);
			return {};
		}
	}

	generateHash(data: Record<string, any>): string {
		return SHA256(JSON.stringify(data)).toString();
	}

	public deleteHash(filePath: string): void {
		this.store.deleteHash(filePath);
	}

	async processTranslations(files: string[]): Promise<void> {
		for (const filePath of files) {
			const translations = await this.readTranslationFile(filePath);
			const hash = this.generateHash(translations);
	
			if (!this.store.hasTranslation(filePath)) {
				this.store.addTranslation(filePath, translations, hash);
				console.log(`Перевод добавлен для файла ${filePath}`);
			} else if (this.store.getTranslation(filePath)?.hash !== hash) {
				this.store.updateTranslation(filePath, translations, hash);
				console.log(`Перевод обновлен для файла ${filePath}`);
			} else {
				console.log(`Нет изменений для файла ${filePath}.`);
			}
		}
	
		for (const storedFilePath of Array.from(this.store.getAllTranslations().keys())) {
			if (!files.includes(storedFilePath)) {
				this.store.deleteHash(storedFilePath);
			}
		}
	}
	
}
