export class Logger {

    log(message: string) {
        console.log(message)
    }

    err(message: string, error: Error | null = null) {
        if (!error) {
            console.error(message)
            return
        }
        console.error(`${message}: ${error.name}: ${error.message}`)
    }
}