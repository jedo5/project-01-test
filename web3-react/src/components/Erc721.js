import { useState } from "react";
import erc721Abi from "../erc721Abi";



function Erc721({web3, account, erc721list}){
    const [to, setTo] = useState("");

    const sendToken = async (tokenAddr, tokenId) =>{
        const tokenContract = await new web3.eth.Contract(
            erc721Abi, tokenAddr, {from: account}
        );
        tokenContract.methods.transferFrom(account, to, tokenId).send(
            {from: account}).on("receipt", (receipt)=>{setTo("");});
    };

    return (
        <div className="erc721list">
            {erc721list.map((token)=>{
                return (
                    <div className="erc721token">
                        <span className="name">Name: {token.name}</span>
                        <span className="symbol">Symbol: {token.symbol}</span>
                        <span className="nft">TokenId: {token.tokenId}</span>
                        <img src={token.tokenURI} width={300} />

                        <div className="tokenTransfer">
                            To:{" "}
                            <input type="text" value={to} onChange={ (e) =>{
                                setTo(e.target.value);
                            }}></input>
                            <button className="sendErc721Btn" onClick={sendToken.bind(
                                this, token.address, token.tokenId
                            )}>send Token</button>
                        </div>
                    </div>
                )}
            )}
        </div>
    )
}
export default Erc721;