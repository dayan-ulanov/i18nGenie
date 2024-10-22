import { Command } from "commander";
import { removeTranslation } from "./commands/remove";
import { addTranslation } from './commands/add'

const program = new Command();

program
	.name("i18n-genie")
	.description("CLI tool to manage i18n translations")
	.version("0.0.1");

program
	.command("add")
	.description("Add a new translation")
	.argument("<key>", "Translation key")
	.argument("<value>", "Translation value")
	.option("-l, --locale <locale>", "Locale to add translation from", "en")
	.action(addTranslation);

program
	.command("remove")
	.description("Remove a translation by key")
	.argument("<key>", "Translation key")

	.option("-l, --locale <locale>", 'Locale to remove translation from', 'en')
	.action(removeTranslation);


program.parse(process.argv);