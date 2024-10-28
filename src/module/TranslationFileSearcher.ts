import fastGlob from 'fast-glob';
import path from 'path';
import { IgnoreConfig } from '../config/IgnoreConfig';

class FileFinder {
	constructor(private filePattern: string, private ignoredDirs: Set<string>) {}

	async findTranslationFiles(dir: string): Promise<string[]> {
		const globPattern = `${dir}/${this.filePattern}`;
		return await fastGlob(globPattern, { ignore: [...this.ignoredDirs].map((dir) => `${dir}/**`) });
	}

	filterIsoCodes(files: string[]): string[] {
		return files.filter((file) => /^[a-zA-Z]{2}$/.test(path.basename(file, path.extname(file))));
	}

	get pattern(): string {
		return this.filePattern;
	}
}

export class TranslationFileSearcher {
	private fileFinder: FileFinder;
	private ignoreConfig = new IgnoreConfig();

	constructor(filePattern: string) {
		this.fileFinder = new FileFinder(filePattern, new Set());
	}

	async init(configPath: string): Promise<void> {
		await this.ignoreConfig.read(configPath);
		this.fileFinder = new FileFinder(this.fileFinder.pattern, this.ignoreConfig.ignoredDirs);
	}

	async search(startDir: string): Promise<string[]> {
		try {
			const results = await this.fileFinder.findTranslationFiles(startDir);
			return this.fileFinder.filterIsoCodes(results);
		} catch (error) {
			console.error('Ошибка при поиске файлов:', error);
			return [];
		}
	}
}
