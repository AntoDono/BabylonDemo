enum color{
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",

    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m",
}

export class Logger{

    private _section: string;

    constructor(section: string){
        this._section = section;
    }

    private _gettime(): string{
        let time: Date = new Date();
        return `${time.toLocaleDateString()} ${time.toLocaleTimeString('en-GB')}` 
    }

    public log(message: any): void{
        console.log(`${color.BgCyan}[${this._gettime()}]${color.Reset} ${color.FgMagenta}[${this._section}]: ${color.Reset}${message}${color.Reset}`)
    }

    public warn(message: any): void{
        console.log(`${color.BgYellow}[${this._gettime()}]${color.Reset} ${color.FgMagenta}[${this._section}]: ${color.FgYellow}${message}${color.Reset}`)
    }

    public error(message: any): void{
        console.log(`${color.BgRed}[${this._gettime()}]${color.Reset} ${color.FgMagenta}[${this._section}]: ${color.FgRed}${message}${color.Reset}`)
    }

    public pass(message: any): void{
        console.log(`${color.BgGreen}[${this._gettime()}]${color.Reset} ${color.FgMagenta}[${this._section}]: ${color.FgGreen}${message}${color.Reset}`)
    }

    public progress(message: any): void{
        console.log(`${color.BgMagenta}[${this._gettime()}]${color.Reset} ${color.FgMagenta}[${this._section}]: ${color.FgCyan}${message}${color.Reset}`)
    }

    public interval_logger(ms: number, callback: Function): void{

        let recursion: Function = ()=>{
            callback();
            setTimeout(recursion, ms);
        }

        setTimeout(recursion, ms);
    }

}