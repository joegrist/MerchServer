export class Logger {

    log(message: String) {
        console.log(message)
    }

    err(error: Error) {
        console.error(`${error.name}: ${error.message}`)
    }
}