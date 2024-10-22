import chalk from "chalk";
import fs from "fs";
import path from "path";

export function removeTranslation(key: string, options: { locale: string }) {
	const localeFile = path.join(
		__dirname,
		"../../translations/",
		`${options.locale}.json`
	);
	
	const translations = JSON.parse(fs.readFileSync(localeFile, "utf-8"));

	if (translations[key]) {
		delete translations[key];
		fs.writeFileSync(localeFile, JSON.stringify(translations, null, 2));
		console.log(chalk.green(`Translation removed: ${key} in locale: ${options.locale}`));
	} else {
		console.log(chalk.red(`Translation key "${key}" not found.`));
	}
}
