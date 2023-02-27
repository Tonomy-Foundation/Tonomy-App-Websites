import { PublicKey, PrivateKey, Checksum256, Signature } from '@greymass/eosio';
import { GetKeyOptions, KeyManager, KeyManagerLevel, SignDataOptions, StoreKeyOptions } from 'tonomy-id-sdk';

export default class JsKeyManager implements KeyManager {
    signData(options: SignDataOptions): Promise<string | Signature> {
        throw new Error('Method not implemented.');
    }
    generateRandomPrivateKey(): PrivateKey {
        throw new Error('Method not implemented.');
    }
    generatePrivateKeyFromPassword(
        password: string,
        salt?: Checksum256 | undefined
    ): Promise<{ privateKey: PrivateKey; salt: Checksum256 }> {
        throw new Error('Method not implemented.');
    }
    async storeKey(options: StoreKeyOptions): Promise<PublicKey> {
        if (options.level === KeyManagerLevel.BROWSERLOCALSTORAGE) {
            localStorage.setItem('app.' + options.level, options.privateKey.toString());
            return options.privateKey.toPublic();
        }

        sessionStorage.setItem('app.' + options.level, options.privateKey.toString());
        return options.privateKey.toPublic();
    }

    async getKey(options: GetKeyOptions): Promise<PublicKey | null> {
        if (options.level === KeyManagerLevel.BROWSERLOCALSTORAGE) {
            const pv = localStorage.getItem('app.' + options.level);
            if (!pv) throw new Error('no key found');
            return PrivateKey.from(pv).toPublic();
        }

        const pv = sessionStorage.getItem('app.' + options.level);
        if (!pv) throw new Error('no key found');
        return PrivateKey.from(pv).toPublic();
    }

    async removeKey(options: GetKeyOptions): Promise<void> {
        if (options.level === KeyManagerLevel.BROWSERLOCALSTORAGE) {
            localStorage.removeItem('app.' + options.level);
            return;
        }
        sessionStorage.removeItem('app.' + options.level);
        return;
    }
}
