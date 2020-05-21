import React, { Component } from 'react'

import {
    Container,
    Col,
    Row,
    ButtonGroup,
    ButtonToggle
} from 'reactstrap'

import JSONPretty from 'react-json-pretty'

const jsonPrettyTheme = {
    main: 'line-height:1.3;color:black;background:#fff;overflow:auto;',
    key: 'color:#0e9088;',
    string: 'color:#48dad0;',
    value: 'color:#70a0ff;',
    boolean: 'color:#ac81fe;',
  }

export class Panel extends Component {

    downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(this.props.geojson)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "isoline.geojson";
        element.click()
    }

    render () {
        
        return (
            <>
            <div className='control-panel box-shadow'>
                <div className="bg-gradient-here-da" />
                
                <h2 className="pres">
                    HERE Route Isoline API
                </h2>
                <p className="pres">
                    Calculate isolines and isochrones and convert to geojson
                </p>
                
                <Container style={{overflowY: "scroll", height:"578px"}}>
                    <Row>
                        
                        <b className="pres">
                            Add your RESY API KEY:
                        </b>
                        <Col>
                            <input className="form-control" type="text" placeholder="API_KEY" onChange={e => { this.props.onChangeApiKey(e.currentTarget.value)}} value={this.props.apikey}/>
                            <div style={{ display:"flex", flexDirection:"row", justifyContent:"center"}}>
                                <button 
                                    className="btn-here-da"
                                    style={{outline: "none"}}
                                    onClick={ this.props.clearApiKey }>Clear credentials</button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        
                        <b className="pres">
                            Add XYZ layer:
                        </b>
                        <Col>
                            <input className="form-control" type="text" placeholder="SPACE_ID"  onChange={e => { this.props.onChangeSpaceId(e.currentTarget.value)}} value={this.props.spaceId}/>
                            <input className="form-control" type="text" placeholder="ACCESS_TOKEN" onChange={e => { this.props.onChangeAccessToken(e.currentTarget.value)}} value={this.props.accessToken}/>
                            <div style={{ display:"flex", flexDirection:"row", justifyContent:"center"}}>
                                <button 
                                    className="btn-here-da"
                                    style={{outline: "none"}}
                                    onClick={ this.props.addXYZlayer }>Add layer</button>
                                <button 
                                    className="btn-here-da"
                                    style={{outline: "none"}}
                                    onClick={ this.props.removeXYZlayer }>Remove</button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <b className="pres">
                            Isoline parameters:
                        </b>
                        <Col>
                            <ButtonGroup style={{width:"100%", marginTop:"10px"}}>
                                <ButtonToggle color="info" onClick={() => this.props.setType("pedestrian")} active={this.props.type === "pedestrian"}>Pedestrian</ButtonToggle>
                                <ButtonToggle color="info" onClick={() => this.props.setType("car")} active={this.props.type === "car"}>Car</ButtonToggle>
                            </ButtonGroup> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ButtonGroup style={{width:"100%", marginTop:"10px"}}>
                                <ButtonToggle color="info" onClick={() => this.props.setRange("time")} active={this.props.range === "time"}>Time</ButtonToggle>
                                <ButtonToggle color="info" onClick={() => this.props.setRange("distance")} active={this.props.range === "distance"}>Distance</ButtonToggle>
                            </ButtonGroup> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input className="form-control" style={{marginTop:"5px"}} placeholder={this.props.rangeValue} onChange={e => { this.props.onChangeRange(e.currentTarget.value)}} />
                        </Col>
                    </Row>
                    
                    <div  className="scroll">
                        <JSONPretty style={{height: "100%"}} id="json-pretty" theme={jsonPrettyTheme} data={this.props.geojson}></JSONPretty>
                        {/* { 
                            JSON.stringify(this.props.geojson, null, 2)
                        } */}
                    </div>
                    <div style={{ display:"flex", flexDirection:"row", justifyContent:"center"}}>
                        <button 
                            className="btn-here-da"
                            style={{outline: "none"}}
                            onClick={ this.props.clearIsoline }>Clear</button>
                        
                        <button 
                            className="btn-here-da"
                            style={{outline: "none"}}
                            onClick={this.downloadTxtFile}>Save</button>

                    </div>
                    <div style={{textAlign: "center"}}>
                    
                    </div>
                </Container>  
                            
            </div>
            <div id="search">
                <input className="form-control" style={{marginTop:"5px"}} placeholder="Search" value={this.props.searchText} onChange={e => { this.props.onChangeSearch(e.currentTarget.value)}} />
                <div id="suggestions-list">
                    {
                        (this.props.suggestions !== undefined ? 
                            this.props.suggestions.map((result, i) => {
                                return <div className="suggest-item" key={i}  onClick={() => this.props.geocode(result.locationId)} >{result.label}</div>
                            }) 
                            
                            : 
                            
                            console.log("none")
                        )
                        
                    }
                </div>
            </div>
            </> 
        )
    }
}