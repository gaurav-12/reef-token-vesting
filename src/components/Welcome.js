import Uik from "@reef-defi/ui-kit";

export const Welcome = ({ checkExtension, connectingWallet }) => {
    return (
        <>
            <Uik.Button
                type="submit"
                size="large"
                fill
                loader="fish"
                loading={connectingWallet}
                text="Connect Wallet"
                onClick={checkExtension}
            />
            <Uik.Text
                text={
                    <>
                        to get started 🚀
                    </>
                }
                type="light"
            />
            <br />
        </>
    )
}