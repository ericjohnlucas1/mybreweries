
/*global google*/

import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from "axios"
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';

class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {
        default_center:{
          lat: 30.2672,
          lng: -97.7431,
        },
        selected_from_explore_view: null,
        saved: []
      }
    }

    getMapOptions() {
      return {
        gestureHandling:'greedy',
        scaleControl: true,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
              {color: '#f5fcff'}
            ]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry.fill',
            stylers: [
              {lightness: -5}
            ]
          }
        ]
      }
    }

    displayDialogue = () => {
      if (this.state.selected_from_explore_view){
        let str = []
        for (let p in this.state.selected_from_explore_view){
          str.push(<React.Fragment key={p}>{str.length>1 ? " | ": ''}<b>{p}:</b>{ this.state.selected_from_explore_view[p]} </React.Fragment>)
        }
        
        return (
        <React.Fragment>
          <h3>You selected:</h3>
          <p>{str}</p>
          <Button as="a" variant="primary" onClick={()=>{
            const config = {
              headers: { 'content-type': 'application/json',
              'Accept': 'application/json',
              'Content-Type': 'application/json'}
            }
            axios.post("http://localhost:5000/breweries/",this.state.selected_from_explore_view, config)
            .then(response => {
              let saved = this.state.saved
              let new_brewery = this.state.selected_from_explore_view
              new_brewery["_id"] = response.data._id.$oid
              saved.push(new_brewery)
              this.setState({selected_from_explore_view:null, saved:saved})
            })
          }}>
            Save
          </Button>&nbsp;
          <Button as="a" variant="secondary" onClick={()=>{this.setState({selected_from_explore_view:null})}}>
            Close
          </Button>
          <br />
        </React.Fragment>
        )
      }
      return <p></p>
    }
    enumerateSaved = () => {
      let data = []
      for (let i in this.state.saved){
        let str = []
        for (let p in this.state.saved[i]){
          str.push(<React.Fragment key={p}>{str.length>1 ? " | ": ''}<b>{p}:</b>{ this.state.saved[i][p]} </React.Fragment>)
        }
        data.push(            
        <Accordion.Item key={i} eventKey={i}>
        <Accordion.Header>{this.state.saved[i].name}</Accordion.Header>
        <Accordion.Body>
          <p>{str}</p>
          <Button as="a" variant="secondary" onClick={()=>{
            axios.delete('http://localhost:5000/breweries/'+this.state.saved[i]._id).then(response =>{
              let saved = this.state.saved
              saved.splice(i,1)
              this.setState({saved: saved})
          })

          }}>
            Delete
          </Button>
        </Accordion.Body>
      </Accordion.Item>)
      }
      return data
    }

    componentDidMount(){
      axios.get("http://localhost:5000/breweries/")
      .then(response => {
        for (let b of response.data){
          b["_id"] = b._id.$oid
        }
        this.setState({saved: response.data})
      })
    }


    configureMap = ({ map, maps }) => {
      //let infowindow = new maps.InfoWindow();
      //map.setMapTypeId('terrain');

      axios.get("https://api.openbrewerydb.org/breweries?by_city=austin&per_page=50")
      .then(response => {
        for (let b of response.data){
          const marker = new google.maps.Marker({
            position: {
              lat: parseFloat(b.latitude),
              lng: parseFloat(b.longitude)
            },
            map,
          });
          marker.addListener('click', () => {
            map.setZoom(10);
            map.setCenter(marker.getPosition());
            this.setState({selected_from_explore_view:b})
          });
        }
      })
      //https://api.openbrewerydb.org/breweries?by_city=austin&per_page=1000
    }


  render(){
    return (
      <React.Fragment>
        <center>
        <div style={{ width: '80%' }}>
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="View saved breweries">
            <Accordion defaultActiveKey="0">
              {this.enumerateSaved()}
            </Accordion>
          </Tab>
          <Tab eventKey="profile" title="Explore new breweries">
            <div style={{ height: '60vh', width: '100%' }}>
              {this.displayDialogue()}
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyBXBbsaQJe7b1z1M_6vEVXK-DfE4X3DwLg",
                  language: 'en',
                }}
                defaultCenter={this.state.default_center}
                defaultZoom={8}

                options={this.getMapOptions()}
                onGoogleApiLoaded={this.configureMap}
                yesIWantToUseGoogleMapApiInternals
              />
            </div>
          </Tab>
        </Tabs>
      </div>
      </center>
      </React.Fragment>
    );
  };

}




export default Main



