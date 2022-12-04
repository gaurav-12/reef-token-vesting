import React, { useState } from "react";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { Provider, Signer } from "@reef-defi/evm-provider";
import { WsProvider } from "@polkadot/rpc-provider";
import Uik from "@reef-defi/ui-kit";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import { getAllVestings, createVesting } from "./utils/contractInteraction"
import { CustomInput } from './components/Inputs';
import { CustomToggle } from './components/Toggle';
import { Welcome } from "./components/Welcome";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URL = "wss://rpc-testnet.reefscan.com/ws";

function App() {
    const [signer, setSigner] = useState();
    const [isWalletConnected, setWalletConnected] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState('');
    const [loadingVestings, setLoadingVestings] = useState(true);

    const [tokenName, setTokenName] = useState('GOROSAMA')
    const [tokenSymbol, setTokenSymbol] = useState('GORO')
    const [tokenSupply, setTokenSupply] = useState(0)
    const [beneficiary, setBeneficiary] = useState('')
    const [tokenAddress, setTokenAddress] = useState('')
    const [startTime, setStartTime] = useState('0')
    const [cliffDuration, setCliffDuration] = useState('0')
    const [duration, setDuration] = useState('0')
    const [revokable, setRevokable] = useState(true)
    const [createToken, setCreateToken] = useState(false)
    const [vestingsList, setVestingsList] = useState([]);
    const [connectingWallet, setConnectingWallet] = useState(false);
    const [deployingVesting, setDeployingVesting] = useState(false);

    const checkExtension = async () => {
        setConnectingWallet(true);

        let allInjected = await web3Enable("Reef");

        if (allInjected.length === 0) {
            return false;
        }

        let injected;
        if (allInjected[0] && allInjected[0].signer) {
            injected = allInjected[0].signer;
        }

        const evmProvider = new Provider({
            provider: new WsProvider(URL),
        });

        evmProvider.api.on("ready", async () => {
            const allAccounts = await web3Accounts();

            if (allAccounts[0] && allAccounts[0].address) {
                setWalletConnected(true);
                setConnectingWallet(false);
            }

            const wallet = new Signer(
                evmProvider,
                allAccounts[0].address,
                injected
            );

            // Claim default account
            if (!(await wallet.isClaimed())) {
                console.log(
                    "No claimed EVM account found -> claimed default EVM account: ",
                    await wallet.getAddress()
                );
                await wallet.claimDefaultAccount();
            } else {
                // EVM address
                const address = await wallet.getAddress()

                setConnectedAddress(address);
                setLoadingVestings(true);
                getAllVestings(wallet, address).then(data => {
                    setVestingsList([...data]);
                    setLoadingVestings(false);
                });
            }

            setSigner(wallet);
        });
    };

    const checkSigner = async () => {
        if (!signer) {
            await checkExtension();
        }
        return true;
    };

    const callCreateVesting = async () => {
        if (checkSigner()) {
            setDeployingVesting(true);

            createVesting(
                signer,
                connectedAddress,
                beneficiary,
                tokenAddress,
                startTime,
                cliffDuration,
                duration,
                tokenSupply,
                revokable,
                createToken,
                tokenName,
                tokenSymbol
            ).then(d => {
                setDeployingVesting(false);
                console.log(d);
                alert('Success!');
            }).catch(e => {
                console.log(e);
                alert('Failure!');
            })
        }
    }

    return (
        <Uik.Container className="main">
            <Uik.Container vertical>
                <Uik.Container vertical>
                    <Uik.Text text="Vest Tokens" type="headline" />
                    <Uik.Container >
                        <Uik.Text text="Vest any Token on" type="lead" />
                        <Uik.ReefLogo />
                        <Uik.Text text="in seconds" type="lead" />

                    </Uik.Container>
                </Uik.Container>
                {isWalletConnected ? (
                    <Uik.Container vertical className="container">
                        <Uik.Card title="Vesting Parameters" titlePosition="center">
                            <Uik.Container vertical flow="start">
                                <CustomInput
                                    onChange={setBeneficiary}
                                    text={"Beneficiary Address"}
                                    toolTipText={"Wallet address of the Beneficiary"}
                                    value={beneficiary} />

                                {createToken ? <></> :
                                    <CustomInput
                                        onChange={setTokenAddress}
                                        text={"Token Address"}
                                        toolTipText={"Address of the Token"}
                                        value={tokenAddress} />}

                                <CustomInput
                                    onChange={setStartTime}
                                    text={"Start Time(in seconds)"}
                                    toolTipText={"Set starting time of the Vesting(in UNIX epoch seconds)"}
                                    value={startTime} />
                                <Uik.Container flow="start">
                                    <Uik.Button text="Now" type="button" onClick={() => setStartTime(parseInt(Date.now() / 1000))} />
                                    <Uik.Tooltip text="Use current time as vesting start time">
                                        <Uik.Icon icon={faCircleInfo} />
                                    </Uik.Tooltip>
                                </Uik.Container>

                                <CustomInput
                                    onChange={setCliffDuration}
                                    text={"Cliff Duration(in seconds)"}
                                    toolTipText={"Lock up duration before starting Vesting duration"}
                                    value={cliffDuration} />

                                <CustomInput
                                    onChange={setDuration}
                                    text={"Vesting Duration"}
                                    toolTipText={"Duration of the Vesting"}
                                    value={duration} />

                                <CustomToggle
                                    onChange={setRevokable}
                                    text="Is Revokable?"
                                    toolTipText="Is the Token Vesting revokable by the Owner"
                                    value={revokable} />

                                <CustomToggle
                                    onChange={setCreateToken}
                                    text="Create a Token?"
                                    toolTipText="Create a simple new token for Vesting"
                                    value={createToken} />

                                <>
                                    <br /> <br />
                                </>

                                {createToken ?
                                    <>
                                        <Uik.Divider text="My Token Parameters" />
                                        <Uik.Card>
                                            <Uik.Container vertical>
                                                <CustomInput
                                                    onChange={setTokenName}
                                                    text={"Token Name"}
                                                    toolTipText={"Name of the Token"}
                                                    value={tokenName} />
                                                <CustomInput
                                                    onChange={setTokenSymbol}
                                                    text={"Token Symbol"}
                                                    toolTipText={"Symbol of the Token"}
                                                    value={tokenSymbol} />
                                                <CustomInput
                                                    onChange={setTokenSupply}
                                                    text={"Token Supply"}
                                                    toolTipText={"Total Supply of the Token"}
                                                    value={tokenSupply} />
                                            </Uik.Container>
                                        </Uik.Card>
                                    </> : <></>}

                                <>
                                    <br />
                                </>
                                <Uik.Container>
                                    <Uik.Button
                                        onKeyPress={e => {
                                            e.key === "Enter" && callCreateVesting()
                                        }}
                                        onClick={callCreateVesting}
                                        text="Deploy Vesting"
                                        size="large"
                                        loading={deployingVesting}
                                        fill
                                        type="submit"
                                        className="container-button"
                                    />
                                </Uik.Container>
                            </Uik.Container>
                        </Uik.Card>

                        <Uik.Divider text="My Vestings" />

                        <Uik.Card condensed>
                            <Uik.Container vertical>
                                {loadingVestings ?
                                    <Uik.Loading color="black" text="Fetching your Vestings" />
                                    : vestingsList.length ? <><p>There are some...</p></>
                                        : <>
                                            <Uik.Text type="light" />No Vestings Found<Uik.Text />
                                        </>
                                }
                            </Uik.Container>
                        </Uik.Card>
                    </Uik.Container>
                ) : (
                    <Welcome checkExtension={checkExtension} connectingWallet={connectingWallet} />
                )}
            </Uik.Container>
            <ToastContainer />
        </Uik.Container>
    );
}

export default App;
