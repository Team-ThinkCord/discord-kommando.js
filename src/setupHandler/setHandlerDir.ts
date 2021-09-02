import fs from "fs"

class setHandlerDir {

    public static setHandlerDir(dir: string|string[]) {
        for(const d of dir) {
            if(fs.existsSync(d)) {
                var commandFiles = fs.readdirSync(d).filter(file => file.endsWith('.js')).sort();
                for(const cmdFile in commandFiles) {
                    const cmdHandler = fs.readFileSync(cmdFile)
                    // cmdHandler에서 함수 체크 해야됨
                }
            } else {
                throw new TypeError(`Directory Not Found Error \n Directory ${d} not Found`);
            }
        }
    }

}