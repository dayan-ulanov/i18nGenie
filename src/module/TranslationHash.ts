import { SHA256 } from 'crypto-js';
import fs from 'fs-extra';
import type { TranslationStore } from './TranslationStore';

export class TranslationHash {
	constructor(private store: TranslationStore) {
		process.on('exit', () => this.store.saveCache().catch(console.error));
	}

	async readTranslationFile(filePath: string): Promise<Record<string, any>> {
		try {
			return await fs.readJson(filePath);
		} catch (error) {
			console.error(`Ошибка при чтении файла ${filePath}:`, error);
			return {};
		}
	}

	generateHash(data: Record<string, any>): string {
		return SHA256(JSON.stringify(data)).toString();
	}

	async processTranslations(files: string[]): Promise<void> {
		for (const filePath of files) {
			const translations = await this.readTranslationFile(filePath);
			const hash = this.generateHash(translations);

			if (!this.store.hasTranslation(filePath) || this.store.getTranslation(filePath)?.hash !== hash) {
				this.store.updateTranslation(filePath, translations, hash);
				await this.store.saveTranslationToFile(filePath, translations);
			} else {
				console.log(`Нет изменений для файла ${filePath}.`);
			}
		}

		this.store.removeUnusedFiles(files);
	}
}
