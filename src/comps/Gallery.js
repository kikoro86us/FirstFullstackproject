import React, { Component } from 'react';
import bg from '../img/gallery/bq.jpg'
import getReady from '../img/gallery/getReady.jpg'
import ringon from '../img/gallery/ringon.jpg'
import standing from '../img/gallery/standing.jpg'
import tiara from '../img/gallery/tiara.jpg' 
import traditional from '../img/gallery/traditional.jpg'
import standing2 from '../img/gallery/standing2.jpg'
import traditional2 from '../img/gallery/traditional2.jpg'
import withdad from '../img/gallery/withdad.jpg'
import gvid from '../vids/galbg.webm'

class Gallery extends Component {
    render() {
        return (
            <div className='gallery' id='gallerypic'>
                <video id='galvid' autoPlay muted loop className="css-background-video" data-state="play">
                     <source src={gvid} type="video/webm"/>
                 </video>

                
                <div className='weddingPics'>
                    <p id='galTitle'>Gallery</p>
                    <div className='imgRow'>
                        <figure className='columns'><img id='galimg' src={bg} /></figure>
                        <figure className='columns'><img id='galimg' src={getReady}/></figure>
                        <figure className='columns'><img id='galimg' src={ringon}/></figure>
                    </div>

                    <div className='imgRow'>
                        <figure className='columns'><img id='galimg' src={standing}/></figure>
                        <figure className='columns'><img id='galimg' src={tiara}/></figure>
                        <figure className='columns'><img id='galimg' src={traditional}/></figure>
                    </div>

                    <div className='imgRow'>
                        <figure className='columns'><img id='galimg' src={standing2}/></figure>
                        <figure className='columns'><img id='galimg' src={traditional2}/></figure>
                        <figure className='columns'><img id='galimg' src={withdad}/></figure>
                    </div>
                    
                 </div>
            </div>
        );
    }
}

export default Gallery;