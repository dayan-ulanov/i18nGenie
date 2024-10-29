declare global {
	interface Console {
		dev: (...args: unknown[]) => void;
		devError: (...args: unknown[]) => void;
	}
}

export class InitialLogger {
	private originalLog = console.log;
	private originalError = console.error;

	public init() {
		const isDevelopment = process.env.NODE_ENV === 'development';
		const isClient =
			process.env.NODE_ENV === 'client' || process.env.NODE_ENV === 'production';

		console.dev = (...args: unknown[]) => {
			if (isDevelopment) {
				this.originalLog(...args);
			}
		};

		console.devError = (...args: unknown[]) => {
			if (isDevelopment) {
				this.originalError(...args);
			}
		};

		console.log = (...args: unknown[]) => {
			if (isClient) {
				this.originalLog(...args);
			}
		};

		console.error = (...args: unknown[]) => {
			if (isClient) {
				this.originalError(...args);
			}
		};
	}

	public restore() {
		console.log = this.originalLog;
		console.error = this.originalError;
	}
}
