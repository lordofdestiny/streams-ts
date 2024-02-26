import * as path from "path";
import {existsSync, lstatSync, readdirSync, unlinkSync, rmdirSync} from 'fs';

class DeleteFolderError extends Error {
    private static getMessage(path: string, message?: string) {
        if (message) {
            return `Error deleting folder ${path}: ${message}`;
        } else {
            return `Error deleting folder ${path}`;
        }
    }

    constructor(path: string, message?: string) {
        super(DeleteFolderError.getMessage(path, message));
    }
}

function deleteFolderRecursive(dir: string) {
    if (!existsSync(dir)) {
        throw new DeleteFolderError(dir, "File does not exist")
    }
    if (!lstatSync(dir).isDirectory()) {
        throw new DeleteFolderError(dir, "File is not a directory")
    }
    const paths = [{file: dir, visited: false}];

    while (paths.length > 0) {
        const {file: current, visited} = paths.pop()!;

        if (!lstatSync(current).isDirectory()) {
            console.log("deleting", current)
            unlinkSync(current);
            continue;
        }

        if (visited) {
            console.log("deleting", current)
            rmdirSync(current);
            continue;
        }

        paths.push({file: current, visited: true})
        paths.push(...readdirSync(current)
            .map(file => ({
                file: path.join(current, file),
                visited: false
            })));
    }
}


if (process.argv.length <= 2) {
    console.error("Usage: clean <folder> [folder] ...");
    process.exit(1);
}

const folders = process.argv.slice(2);
console.log(`clean: ${folders.join(", ")}`);

for (const folder of folders) {
    try {
        deleteFolderRecursive(folder);
    } catch (e) {
        if (e instanceof DeleteFolderError) {
            console.error(e.message);
            continue;
        }
        break
    }
}
