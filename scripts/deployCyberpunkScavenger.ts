import { toNano } from '@ton/core';
import { CyberpunkScavenger } from '../build/CyberpunkScavenger/CyberpunkScavenger_CyberpunkScavenger';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const cyberpunkScavenger = provider.open(await CyberpunkScavenger.fromInit());

    await cyberpunkScavenger.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(cyberpunkScavenger.address);

    // run methods on `cyberpunkScavenger`
}
