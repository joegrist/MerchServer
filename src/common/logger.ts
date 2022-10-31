export class Logger {

    log(message: string) {
        console.log(message)
    }

    err(message: string, error: Error) {
        console.error(`${message}: ${error.name}: ${error.message}`)
    }
}