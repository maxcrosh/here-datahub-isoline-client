import React, { Component } from 'react'
import { apikey } from '../assets/js/apikey'

export class Map extends Component {
    
    state = {
        map: null,
        platform: null,
    }

    componentDidMount () {
        const platform = new window.H.service.Platform({
            apikey: apikey
        })

        const defaultLayers = platform.createDefaultLayers()

        const map = new window.H.Map(
        document.getElementById("map"),
        defaultLayers.vector.normal.map,
            {
                center: { lat: 55.75281545266021, lng: 37.621822357177734 },
                zoom: 12,
                pixelRatio: window.devicePixelRatio || 1
            }
        )

        window.map = map

        const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map))
        const ui = window.H.ui.UI.createDefault(map, defaultLayers)

        window.addEventListener('resize', function() {
            map.getViewPort().resize()
        })

        map.addEventListener('contextmenu', e => {

            if (e.target !== map) {
                return
            }
           
            let coord  = map.screenToGeo(e.viewportX, e.viewportY)

            e.items.push(

                new window.H.util.ContextItem({
                  label: [
                    Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S'),
                    Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
                  ].join(' ')
                }),
                
                new window.H.util.ContextItem({
                  label: 'Center map',
                  callback: function() {
                    map.setCenter(coord, true);
                  }
                }),
                
                window.H.util.ContextItem.SEPARATOR,
                
                new window.H.util.ContextItem({
                  label: 'Calculate Isoline',
                  callback: () => {
                    this.props.calculateIsoline(coord)
                    this.props.updateMarker({lat: coord.lat, lng: coord.lng})
                  }
                })
              )
        })

        this.setState({platform: platform, map: map})
        
    }

    componentWillUnmount() {
        this.state.map.dispose()
    }
    
    render() {

        let { map } = this.state
        
        
        if( map != null ){

            map.removeObjects(map.getObjects())

            if( this.props.showXYZlayer === true ) {
          
              try {
                const service = this.state.platform.getXYZService({
                  token: this.props.accessToken
                })
  
                let spaceProvider = new window.H.service.xyz.Provider(service, this.props.spaceId)
  
                let spaceLayer = new window.H.map.layer.TileLayer(spaceProvider)

                let style = spaceProvider.getStyle()
                style.setProperty('layers.xyz.points.draw.points.color', '#17a2b8')
                style.setProperty('layers.xyz.polygons.draw.polygons.color', '#17a2b8');

                map.addLayer(spaceLayer)

              } catch (error) {
                console.log(error)
              }
             
            } else {
              map.getLayers().asArray().forEach(layer => {
                map.removeLayer(layer)
              })
            }
 
            if( this.props.isoline.length != 0) {
              

              this.props.isoline.forEach(feature => {
                // debugger
                let linestring = new window.H.geo.LineString()
                feature.forEach(geofence => {
                  let coords = geofence.split(",")
                    linestring.pushPoint({lat: Number(coords[0]), lng: Number(coords[1])})
                })
                let polygon = new window.H.map.Polygon(linestring, { style: { lineWidth: 10 }})
                
                map.addObject(polygon)
              })
  
              
              // debugger
              

              try {
                this.props.marker.forEach(feature => {
                  let marker = new window.H.map.Marker(feature)
                  // map.addObject(new window.H.map.Marker(feature.lat, feature.lng))
                  map.addObject(marker)
                })
                
                
              } catch (err){
                console.log("Null coords")
              }
            }
        
            
        }

        return <div id="map" style={{ height: "100%", width: "100%" }} />
    }
}