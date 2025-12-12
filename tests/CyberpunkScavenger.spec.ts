import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CyberpunkScavenger } from '../build/CyberpunkScavenger/CyberpunkScavenger_CyberpunkScavenger';
import '@ton/test-utils';

describe('CyberpunkScavenger', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let cyberpunkScavenger: SandboxContract<CyberpunkScavenger>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        cyberpunkScavenger = blockchain.openContract(await CyberpunkScavenger.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await cyberpunkScavenger.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: cyberpunkScavenger.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and cyberpunkScavenger are ready to use
    });
});
