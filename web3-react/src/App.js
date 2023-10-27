import Web3 from 'web3';
import './App.css';
import erc721Abi from './erc721Abi';
import { useEffect, useState } from 'react';
import TokenList from './components/TokenList';

function App() {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState('');
  const [newErc721Addr, setNewErc721Addr] = useState();
  const [erc721list, setERC721list] = useState([]);

  
  const connectWallet = async ()=>{
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(accounts[0])
  };
  const addNewErc721Token = async()=>{
    const tokenContract = await new web3.eth.Contract(
      erc721Abi, newErc721Addr
    );
    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const totalSupply = await tokenContract.methods.totalSupply().call();
    let arr = [];
    for (let i = 1; i<=totalSupply; i++){
      arr.push(i);
    }
    for (let tokenId of arr){
      let tokenOwner = await tokenContract.methods.ownerOf(tokenId).call();
      if (String(tokenOwner).toLowerCase() === account){
        let tokenURI = await tokenContract.methods.tokenURI(tokenId).call();
        setERC721list((prevState)=>{
          return [...prevState, {name, symbol, tokenId, tokenURI}];
        });
      }
    }
  }


  useEffect( () =>{
    if (typeof window.ethereum !== "undefined"){
      try {
        const web = new Web3(window.ethereum);
        setWeb3(web);
      }catch (err){
        console.log(err);
      }
    }
  },[])

  return (
    <div className="App">
      <button className="metaConnect" onClick={()=>{connectWallet();}}>
        connect to MetaMask
      </button>
      <div className="userInfo">주소: {account}</div>
      <div className="newERC721">
        <input type="text" onChange={(e)=>{setNewErc721Addr(e.target.value);}}></input>
        <button onClick={addNewErc721Token}>add new erc721</button>
      </div>
      <TokenList web3={web3} account={account} erc721list={erc721list} />
    </div>
  );
}

export default App;
