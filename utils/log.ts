const LOG_PATH = "log.txt";

// Append request's logs to the log's file
export async function log(requestLog: string) {
    try {
        const logs = await Bun.file(LOG_PATH).text();
        // Write (file's content + request's log)
        await Bun.write(LOG_PATH, logs.concat(requestLog));
    } catch (e) {
        // If log's file doesn't exist, write new content
        await Bun.write(LOG_PATH, ''.concat(requestLog));
    }
}