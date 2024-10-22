import chalk from "chalk";
import fs from "fs";
import path from "path";

export function addTranslation(
	key: string,
	value: string,
	options: { locale: string }
) {
	const localeFile = path.join(
		__dirname,
		"../../translations/",
		`${options.locale}.json`
	);

	console.log(localeFile);

	const translations = JSON.parse(fs.readFileSync(localeFile, "utf-8"));

	translations[key] = value;

	fs.writeFileSync(localeFile, JSON.stringify(translations, null, 2));
	console.log(chalk.green(`Translation added: ${key} -> ${value} in locale: ${options.locale}`));
}
