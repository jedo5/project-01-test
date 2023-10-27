import { useState } from "react";
import erc721Abi from "../erc721Abi";



const Erc721 = ({web3, account, erc721list, newErc721Addr})=>{
    const [to, setTo] = useState("");

    const sendToken = async (to, tokenId) =>{
        const tokenContract = await new web3.eth.Contract(
            erc721Abi, newErc721Addr, {from: account}
        );
        const estimateGasAmount = await tokenContract.methods.safeTransferFrom(account, to, tokenId)
        .estimateGas({from: account, gas:5000000}).catch(function(error){
            console.log(error);
        });
        const txData = await tokenContract.methods.safeTransferFrom(account, to, tokenId)
        .encodeABI();

        web3.eth.sendTransaction({
            from: account,
            to: newErc721Addr,
            gas: estimateGasAmount,
            gasPrice: await web3.eth.getGasPrice(),
            data: txData
        })
        .on('receipt', (receipt)=>{
            if (receipt.status){
                alert("tx success");
                setTo("");
            }else{
                console.error("failed");
            }
        })  
        .on("error", (error)=>{
            console.error(error);
        });
    };

    return (
        <div className="erc721list">
            {erc721list.map((token)=>{
                return (
                    <div key={token.tokenId} className="erc721token">
                        <br/>
                        <span className="name">Name: {token.name} </span>
                        <span className="symbol">({token.symbol})</span><br/>
                        <span className="nft">TokenId: {token.tokenId}</span><br/>
                        <img src={token.tokenURI} width={300} />

                        <div className="tokenTransfer">
                            To:{" "}
                            <input type="text" value={to} onChange={ (e) =>{
                                setTo(e.target.value);
                            }}></input>
                            <button className="sendErc721Btn" onClick={
                                ()=>sendToken(to, token.tokenId)
                                }>send Token</button>
                        </div>
                    </div>
                )}
            )}
        </div>
    )
}
export default Erc721;