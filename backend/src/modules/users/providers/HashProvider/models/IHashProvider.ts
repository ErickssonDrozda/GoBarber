export default interface IHashProvider {
    generateHash(payLoad: string): Promise<string>;
    compareHash(payLoad: string, hashed: string): Promise<boolean>;
}
