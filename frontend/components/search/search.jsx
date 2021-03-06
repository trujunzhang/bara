import React from 'react';

import {
  searchBusinesses
} from '../../util/business_api_util';
import {
  SampleSearch,
  PriceButton,
  AddBusiness,
  buildFilters,
} from './search_util';
import BusinessIndex from './business_index';
import IndexMapContainer from './index_map_container';

export default class Search extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      loading: true,
      businesses: [],
    };

    this.filters = buildFilters( props.location.search );
    this.handleChange = this.handleChange.bind( this );
  }

  componentDidMount() {
    searchBusinesses( this.filters )
      .then(
        businesses => {
          this.setState( {
            loading: false,
            businesses,
          } );
        } );
    window.scrollTo( 0, 0 );
  }

  componentWillUpdate( newProps ) {
    if ( this.props.location.search !== newProps.location.search ) {
      this.setState( {
        loading: true,
      } );
      this.filters = buildFilters( newProps.location.search );
      searchBusinesses( this.filters )
        .then(
          businesses => {
            this.setState( {
              loading: false,
              businesses,
            } );
          } );
    }
  }

  componentWillUnmount() {
    this.props.highlightBusiness( -1 );
  }

  handleChange( e ) {
    e.preventDefault();
    this.setState( {
      loading: true,
    } );
    const value = e.target.checked;
    let {
      name,
      location,
      tag
    } = this.filters;
    let nameEncoded = encodeURIComponent( name );
    let locationEncoded = encodeURIComponent( location );
    let tagEncoded = encodeURIComponent( tag );
    let pricesSet = new Set( this.filters.prices );
    if ( value ) {
      pricesSet.add( e.target.name );
    } else {
      pricesSet.delete( e.target.name );
    }
    let pricesEncoded = Array.from( pricesSet )
      .map( price => `&prices[]=${price}` );
    let pricesQuery = pricesEncoded.join( '' );
    this.props.history
      .push( `/businesses/?name=${nameEncoded}&location=${locationEncoded}&tag=${tagEncoded}${pricesQuery}` );
  }

  searchTitle() {
    let {
      name,
      location,
    } = this.filters;
    name = name ? name : "places";
    location = location ? `near ${location}` : "";
    return (
      <h1 className='search-title'><strong>Best {name}</strong> {location}</h1>
    );
  }

  priceButtons() {
    let prices = this.filters.prices ? this.filters.prices : [];
    return (
      <div className='price-buttons'>
        <PriceButton label='$' name='1' tooltip='Inexpensive'
          checked={prices.includes("1")} onChange={this.handleChange} />
        <PriceButton label='$$' name='2' tooltip='Moderate'
          checked={prices.includes("2")} onChange={this.handleChange} />
        <PriceButton label='$$$' name='3' tooltip='Pricey'
          checked={prices.includes("3")} onChange={this.handleChange} />
        <PriceButton label='$$$$' name='4' tooltip='Ultra High-End'
          checked={prices.includes("4")} onChange={this.handleChange} />
      </div>
    );
  }

  searchResult( businesses ) {
    return this.state.loading ?
      <img className='spinner' src={window.staticImages.spinner} /> :
      <BusinessIndex businesses={businesses} />;
  }

  render() {
    let {
      businesses
    } = this.state;
    return (
      <div>
        <div className='title'>
          <div className='center'>
            <SampleSearch />
            {this.searchTitle()}
            {this.priceButtons()}
          </div>
        </div>
        <div className='business-index-main'>
          <div className='center index-grid-row1'>
            <div className='index-grid-col1'>
              {this.searchResult(businesses)}
            </div>
            <div className='index-grid-col2'>
              <IndexMapContainer businesses={businesses} />
            </div>
          </div>
          <AddBusiness />
        </div>
      </div>
    );
  }
}
