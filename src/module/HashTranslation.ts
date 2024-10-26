import { SHA256 } from 'crypto-js';
import fs from 'fs-extra';
import path from 'path';

export class HashTranslation {
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

	async storeHashes(filePaths: string[]): Promise<void> {
		const hashMap: Record<string, string> = {};
		for (const filePath of filePaths) {
			const hash = this.generateHash(await this.readTranslationFile(filePath));
			hashMap[path.basename(filePath)] = hash;
		}
		try {
			await fs.writeJson('hashes.json', hashMap, { spaces: 2 });
		} catch (error) {
			console.error('Ошибка при записи хешей в файл hashes.json:', error);
		}
	}

	async checkForUpdates(filePaths: string[]): Promise<void> {
		const storedHashes = await fs.readJson('hashes.json').catch(() => ({}));
		for (const filePath of filePaths) {
			const currentHash = this.generateHash(await this.readTranslationFile(filePath));
			const fileName = path.basename(filePath);

			if (storedHashes[fileName] !== currentHash) {
				console.log(`${fileName} был обновлён.`);
				storedHashes[fileName] = currentHash;
			}
		}

		await fs.writeJson('hashes.json', storedHashes, { spaces: 2 });
	}

	async processTranslations(files: string[]): Promise<void> {
		await this.storeHashes(files);
		await this.checkForUpdates(files);
	}
}
