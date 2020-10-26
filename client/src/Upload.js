/*import React, { Component } from 'react';  
import './App.css';
import axios from 'axios';

class Upload extends Component{
    state={
        selectedFile:null
    }
    fileSelectedHandler=event=>{

        console.log(event.target.files[0]);
    }
    fileUploadHandler=()=>{
        axios.post('')
    }
render(){
    return(
        <div className='Photo'>
            <input type="file" onChange={this.    fileSelectedHandler}/>
            <button onClick={this.filesSelectedHandler}>Upload</button>
          

        </div>
    );
}
}

export default Upload;*/



import React from "react";
import ImageUploader from "react-images-upload";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    }); 
  }

  render() {
    return (
      <ImageUploader
        withIcon={true}
        buttonText="Choose images"
        onChange={this.onDrop}
        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
        maxFileSize={5242880}
      />
    );
  }
}
export default Upload;