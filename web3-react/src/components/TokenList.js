import Erc721 from "./Erc721";

const TokenList = ({web3, account, erc721list, newErc721Addr})=>{
    return (
        <div className="tokenlist">
            <Erc721 
                web3={web3} 
                account={account} 
                erc721list={erc721list}
                newErc721Addr={newErc721Addr} />
        </div>
    )
}

export default TokenList;