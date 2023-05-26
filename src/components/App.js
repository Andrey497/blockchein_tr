import Instagram from '../abis/Instagram.json'
import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const querystring = require('querystring');
const ipfs = ipfsClient( {
  host: "localhost",
  port: 5001,
  protocol: "http",
})


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Instagram.networks[networkId]
    if(networkData) {
      const instagram = new web3.eth.Contract(Instagram.abi, networkData.address)
      this.setState({ instagram })
      const imagesCount = await instagram.methods.imageCount().call()
      this.setState({ imagesCount })
      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await instagram.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({imagesView: this.state.images})
      this.setState({ loading: false})
    } else {
      window.alert('Instagram contract not deployed to detected network.')
    }
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
  }

  uploadImage = (description, ganre) => {   
    ipfs.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
   
      this.setState({ loading: true })
      this.state.instagram.methods.uploadImage(result[0].hash, description, ganre).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.instagram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  filterImages(ganre) {
    if (ganre =="Все"){
      this.setState({imagesView: this.state.images})
    }else{
      this.setState({
        imagesView: this.state.images.filter((a) => a.ganre==ganre)
      })
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      instagram: null,
      images: [],
      imagesView:[],
      loading: true
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.filterImages = this.filterImages.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}  filterImages={this.filterImages}/>
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Загрузка...</p></div>
          : <Main
              images={this.state.imagesView}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
              tipImageOwner={this.tipImageOwner}
             
            />
        }
      </div>
    );
  }
}

export default App;