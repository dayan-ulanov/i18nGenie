import fastGlob from 'fast-glob';
import path from 'path';
import { IgnoreConfig } from '../config/IgnoreConfig'

class FileFinder {
	constructor(private filePattern: string, private ignoredDirs: Set<string>) {}

	async findTranslationFiles(dir: string): Promise<string[]> {
		const globPattern = `${dir}/${this.filePattern}`;

		const files = await fastGlob(globPattern, {
			ignore: [...this.ignoredDirs].map((dir) => `${dir}/**`),
		});
		return files;
	}

	filterIsoCodes(files: string[]): string[] {
		return files.filter((file) => {
			const fileName = path.basename(file, path.extname(file));
			return /^[a-zA-Z]{2}$/.test(fileName);
		});
	}

	get pattern(): string {
		return this.filePattern;
	}
}

export class TranslationFileSearcher {
	private fileFinder: FileFinder;
	private ignoreConfig: IgnoreConfig = new IgnoreConfig();

	constructor(filePattern: string) {
		this.fileFinder = new FileFinder(filePattern, new Set());
	}

	async init(configPath: string): Promise<void> {
		await this.ignoreConfig.read(configPath);
		this.fileFinder = new FileFinder(
			this.fileFinder.pattern,
			this.ignoreConfig.ignoredDirs
		);
	}

	async search(startDir: string): Promise<void> {
		try {
			const results = await this.fileFinder.findTranslationFiles(startDir);
			const iso3166Codes = this.fileFinder.filterIsoCodes(results);
			console.log('Найденные файлы с кодами ISO 3166-1:', iso3166Codes);
		} catch (error) {
			console.error('Ошибка при поиске файлов:', error);
		}
	}
}