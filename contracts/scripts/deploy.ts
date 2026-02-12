import hre from "hardhat";

async function main() {
    const conn: any = await hre.network.connect();

    console.log("connect keys:", Object.keys(conn));
    console.log("has viem:", "viem" in conn, conn.viem);

    const { viem } = conn;
    const contract = await viem.deployContract("TimeLockContent", []);
    console.log("Deployed:", contract.address);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
