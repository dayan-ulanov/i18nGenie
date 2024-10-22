import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function listTranslations(options: { locale: string }) {
	const localeFile = path.join(
		__dirname,
		"../../translations/",
		`${options.locale}.json`
	);

	if (fs.existsSync(localeFile)) {
		const translations = JSON.parse(fs.readFileSync(localeFile, "utf-8"));
		console.log(chalk.blue(`Translations for locale "${options.locale}":`))
		console.log(translations);
	} else {
		console.log(chalk.red(`Locale file "${options.locale}.json" not found.`));
	}
}
