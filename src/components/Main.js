import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Покажи миру свои фото!!!</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                const ganre = this.imageGanre.value
                this.props.uploadImage(description,ganre)
              }} >
                <div className="custom-file">
                  <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} className="custom-file-input" id="exampleInputFile" />
                  <label className="custom-file-label" for="exampleInputFile" data-browse="Ваше фото"></label>
                </div>
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                  <div className="form-group mr-sm-5">
                  <select id="imageGanre" className="form-select" aria-label="Default select example" ref={(input) => { this.imageGanre = input }}  required>
                      <option selected>Выберите жанр</option>
                      <option value="Еда">Еда</option>
                      <option value="Семья">Семья</option>
                      <option value="Природа">Природа</option>
                  </select>
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Добавить фото</button>
              </form>
              <p>&nbsp;</p>
              { this.props.images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img src={`http://localhost:8080/ipfs/${image.hash}`} style={{ maxWidth: '420px'}}/></p>
                        <p className="text-center">{image.ganre}</p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          {image.countLiks} 
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            this.props.tipImageOwner(image.id, tipAmount)
                          }}
                        >
                         <img src="https://avatars.steamstatic.com/50660ec0a748dc956af60108799a768ef9a37f58_medium.jpg"/>
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;