import chokidar from 'chokidar';
import type { TranslationHash } from './TranslationHash';
import { file } from 'bun'

export class TranslationWatcher {
	constructor(
		private translationHash: TranslationHash,
		private watchDir: string
	) {
		const watcher = chokidar.watch(`${this.watchDir}/**/*.json`, {
			ignored: /node_modules|dist/,
		});

		watcher.on('add', (filePath) => this.translationHash.processTranslations([filePath]));
		watcher.on('change', (filePath) => this.translationHash.processTranslations([filePath]));
		watcher.on('unlink', (filePath) => this.handleFileDelete(filePath));
	}

	private handleFileDelete(filePath: string): void {
		this.translationHash.deleteHash(filePath)
		console.log(`Файл ${filePath} был удален из кэша.`);
	}
}
