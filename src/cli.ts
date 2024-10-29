import { Command } from 'commander';
import { ListCommand } from './command/ListCommand'

export class CliGenie {
	private program: Command;

	constructor() {
		this.program = new Command();
		this.init();
	}

	private init(): void {
		const listCommand = new ListCommand();
		this.program.addCommand(listCommand.getCommand());
	}

	public run(args: string[]): void {
		this.program.parse(args);
	}
}
