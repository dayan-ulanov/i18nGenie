import fs from 'fs-extra';

export class IgnoreConfig {
	ignoredDirs: Set<string> = new Set();
	async read(configPath: string): Promise<void> {
		try {
			const data = await fs.readFile(configPath, 'utf8');
			const config = JSON.parse(data);
			this.ignoredDirs = new Set(config.ignoredDirs || []);
		} catch (error) {
			console.error(`Ошибка при чтении конфигурации из файла ${configPath}:`, error);
		}
	}

	async get(configPath: string): Promise<string[]> {
		await this.read(configPath);
		return Array.from(this.ignoredDirs);
	}
}