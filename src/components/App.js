import React, { Component } from 'react'
import axios from 'axios'

import { Map } from './Map'
import { Panel } from './Panel'

import 'bootstrap/dist/css/bootstrap.min.css'


class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      marker: [],
      isoline: [],
      range: "time",
      type: "pedestrian",
      geocoderResults: [],
      suggestions:[],
      apikey:"",
      rangeValue: 300,
      searchText:"",
      spaceId:"",
      accessToken:"",
      showXYZlayer: false,
      geojson: {
        "type": "FeatureCollection",
        "features": []
      }
    }

   
    this.setRange = this.setRange.bind(this)
    this.setType = this.setType.bind(this)
    this.onChangeApiKey = this.onChangeApiKey.bind(this)
    this.onChangeRange = this.onChangeRange.bind(this)
    this.calculateIsoline = this.calculateIsoline.bind(this)
    this.clearApiKey = this.clearApiKey.bind(this)
    this.updateMarker = this.updateMarker.bind(this)
    this.clearIsoline = this.clearIsoline.bind(this)
    this.arrayToGeoJson = this.arrayToGeoJson.bind(this)
    this.onChangeSearch = this.onChangeSearch.bind(this)
    this.geocode = this.geocode.bind(this)

    this.onChangeSpaceId = this.onChangeSpaceId.bind(this)
    this.onChangeAccessToken = this.onChangeAccessToken.bind(this)
    this.addXYZlayer = this.addXYZlayer.bind(this)
    this.removeXYZlayer = this.removeXYZlayer.bind(this)
  }

  arrayToGeoJson(isolines){
    let { geojson } = this.state
  
    // debugger
    isolines.forEach(feature => {
      // debugger
      let linestring = new window.H.geo.LineString()
      feature.forEach(geofence => {
        let coords = geofence.split(",")
          linestring.pushPoint({lat: Number(coords[0]), lng: Number(coords[1])})
      })
      let polygon = new window.H.map.Polygon(linestring, { style: { lineWidth: 10 }})
      
      geojson.features.push(polygon.toGeoJSON())
      this.setState({"geojson":geojson})
      
    })
  }

  componentDidMount () {
    if (localStorage.getItem("apikey") !== null) {
      this.setState({"apikey": localStorage.getItem("apikey")})
    }   
  }

  onChangeSpaceId (spaceId) {
    this.setState({spaceId: spaceId})
  }

  onChangeAccessToken (accessToken) {
    this.setState({accessToken: accessToken})
  }

  addXYZlayer () {
    this.setState({showXYZlayer: true})
  }

  removeXYZlayer () {
    this.setState({showXYZlayer: false})
  }


  geocode (locationId) {
    let baseUrl = "https://geocoder.ls.hereapi.com/6.2/geocode.json"
    let geocoderUrl = baseUrl + `?locationid=${locationId}&apikey=${this.state.apikey}`
    axios.get(geocoderUrl).then(res => {
      // debugger
      let lat = res.data.Response.View[0].Result[0].Location.DisplayPosition.Latitude
      let lng = res.data.Response.View[0].Result[0].Location.DisplayPosition.Longitude
      // debugger
      window.map.setCenter({lat:lat,lng:lng})
      window.map.setZoom(18)

      this.setState({searchText: "", geocoderResults: [], suggestions:[]})
      // console.log(res.data)
    })
  }

  onChangeSearch(searchText){
    this.setState({searchText: searchText})

    let baseUrl = "https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json"
    let geoUrl = baseUrl + `?query=${searchText}` + `&apikey=${this.state.apikey}` + "&maxresults=10"
    
    axios.get(geoUrl).then(res => {
     
      this.setState({suggestions: res.data.suggestions})
    })
    
  }

  clearApiKey(){
    this.setState({"apikey": ""})
    localStorage.removeItem("apikey")
  }

  onChangeApiKey(apikey){
    this.setState({"apikey": apikey})
    localStorage.setItem("apikey", apikey)
  }

  onChangeRange(rangeValue){
    this.setState({rangeValue: rangeValue})
  }

  setRange(range) {
    this.setState({"range": range})
  }

  setType (type) {
    this.setState({"type": type})
  }


  calculateIsoline (coord) {
    let isolineBaseUrl = "https://isoline.route.ls.hereapi.com/routing/7.2/calculateisoline.json?"

    // debugger
    let isolineRequest = isolineBaseUrl + `apikey=${this.state.apikey}&mode=fastest;${this.state.type}&rangetype=${this.state.range}&range=${this.state.rangeValue}&start=geo!${coord.lat},${coord.lng}`

    axios.get(isolineRequest)
      .then(res => {
        if(res.data.response !== null){
          this.setState({"isoline": [...this.state.isoline, res.data.response.isoline[0].component[0].shape] })
          this.arrayToGeoJson(this.state.isoline)
        }
        
      }, error => {
        console.log(error)
      })

  }

  updateMarker (coords) {
    this.setState({ marker: [...this.state.marker, coords] })
  }

  clearIsoline () {
    this.setState({ 
        isoline: [], 
        marker: [], 
        geojson:{
        "type": "FeatureCollection",
        "features": []
      } 
    })
  }

  render () { 

    return (
      <>
        <Map
          updateMarker={this.updateMarker} 
          calculateIsoline={this.calculateIsoline} 
          isoline={this.state.isoline} 
          marker={this.state.marker}
          arrayToGeoJson={this.arrayToGeoJson}
          zoomTo={this.state.zoomTo}
          showXYZlayer={this.state.showXYZlayer}
          spaceId={this.state.spaceId}
          accessToken={this.state.accessToken}/>

        <Panel 
          addXYZlayer={this.addXYZlayer}
          removeXYZlayer={this.removeXYZlayer}
          clearIsoline={ this.clearIsoline }
          apikey={this.state.apikey} 
          waypoints={ this.state.waypoints } 
          calculateRoute={this.calculateRoute} 
          range={this.state.range} 
          type={this.state.type} 
          rangeValue={this.state.rangeValue}
          setRange={this.setRange} 
          setType={this.setType}
          onChangeApiKey={this.onChangeApiKey}
          spaceId={this.spaceId}
          accessToken={this.accessToken}
          onChangeSpaceId={this.onChangeSpaceId}
          onChangeAccessToken={this.onChangeAccessToken}
          onChangeRange={this.onChangeRange}
          onChangeSearch={this.onChangeSearch}
          clearApiKey={this.clearApiKey}
          geojson={this.state.geojson}
          geocode={this.geocode}
          suggestions={this.state.suggestions}
          searchText={this.state.searchText}/>
      </>
    )
  }
}

export default App
