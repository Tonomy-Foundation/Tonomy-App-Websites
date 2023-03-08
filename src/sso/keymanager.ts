import { PublicKey, PrivateKey, Checksum256, Signature } from '@greymass/eosio';
import {
    ES256KSigner,
    GetKeyOptions,
    KeyManager,
    KeyManagerLevel,
    sha256,
    SignDataOptions,
    StoreKeyOptions,
} from '@tonomy/tonomy-id-sdk';

export default class JsKeyManager implements KeyManager {
    async signData(options: SignDataOptions): Promise<string | Signature> {
        const pv = localStorage.getItem('app.' + options.level);

        if (!pv) throw new Error('No key for this level');

        const privateKey = PrivateKey.from(pv);

        if (options.outputType === 'jwt') {
            if (typeof options.data !== 'string') throw new Error('data must be a string');
            const signer = ES256KSigner(privateKey.data.array, true);

            return (await signer(options.data)) as string;
        } else {
            let digest: Checksum256;

            if (typeof options.data === 'string') {
                digest = Checksum256.hash(Buffer.from(options.data));
            } else {
                digest = options.data as Checksum256;
            }

            const signature = privateKey.signDigest(digest);

            return signature;
        }
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
