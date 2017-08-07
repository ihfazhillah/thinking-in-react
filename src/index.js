import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';

const TOGGLE_STOCKED_ONLY = 'TOGGLE_STOCKED_ONLY'
const CHANGE_SEARCH_VALUE = 'CHANGE_SEARCH_VALUE'

const toggleStockedOnly = (bool) => ({
  type: TOGGLE_STOCKED_ONLY,
  bool
});

const changeSearchValue = (searchValue) => ({
  type: CHANGE_SEARCH_VALUE,
  searchValue
})

/*
 * Reducers
 */

const searchValueReducer = (state='', action) => {
  switch(action.type){
    case CHANGE_SEARCH_VALUE:
      return {searchValue: action.searchValue}
    default:
      return state
  }
}

const toggleStockedOnlyReducer = (state=false, action) => {
  switch(action.type){
    case TOGGLE_STOCKED_ONLY:
      return {isStocked: action.bool}
    default:
      return state
  }
}

const reducers = combineReducers({
  searchValue: searchValueReducer, toggleStockedOnly: toggleStockedOnlyReducer }); 
const store = createStore(reducers);


let data = [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

class ProductRow extends React.Component{
  /* 
   * contains row of product
   */
  render(){
    let row = this.props.row;
    let style = {color: row.stocked? 'black': 'red'}
    return (
      <tr>
        <td style={style}>{row.name}</td>
        <td>{row.price}</td>
      </tr>
    )
  }
}

class ProductCategoryRow extends React.Component{
  /*
   * Contains header of each category row
   */
  render(){
    return (
      <tr><td><h4>{this.props.category}</h4></td></tr>
    )
  }
}

class ProductTable extends React.Component {
  /*
   * Show products
   */
  render(){
    let products = this.props.data;
    let lastCategory = null;
    let rows = [];

    if (this.props.isStock){
      products = _.filter(products, {stocked: true})
    }

    products = _.filter(products, (row) => (row.name.indexOf(this.props.value) !== -1))


    _.forEach(products, (row, index) => {
      if (row.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={row.category} key={row.category}/>)
      }
        rows.push(<ProductRow key={index} row={row}/>);
        lastCategory = row.category
    });


    if(products.length > 0){
      return (<table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      )
    } else {
      return null
    }
  }
}

class SearchBar extends React.Component {
  /*
   * Show search bar and also checkbox
   */

  constructor(props){
    super(props);

    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleCheckBox(e){
    this.props.onChangeCheckbox(e.target.checked);
  }

  handleSearch(e){
    this.props.onChangeTextInput(e.target.value)
  }

  render(){
    return (
      <div>
        <input placeholder="search..." type="input" onChange={this.handleSearch}/>
        <br/>
        <input type="checkbox" id="isStocked" onChange={this.handleCheckBox} checked={this.props.isChecked}/>
        <label htmlFor="isStocked">Only show product in stock</label>
      </div>
    )
  }

}

class FilterableProductTable extends React.Component {
  /*
   * Container of our app
   */
  render(){
    let products = this.props.data;
    return (
      <div>
        <SearchBar
          value={this.props.value}
          onChangeTextInput={this.props.handleSearchValue}
          isStock={this.props.isStocked}
          onChangeCheckbox={this.props.handleIsStocked}
        />
        <ProductTable 
          data={products}
          isStock={this.props.isStocked}
          value={this.props.value}
        />
      </div>
    )
  }
}

FilterableProductTable.defaultProps = {
    value: '',
    isStocked: false
  }

const mapStateToProps = (store) => {
  return {
  value : store.searchValue.searchValue,
  isStocked: store.toggleStockedOnly.isStocked
}};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSearchValue: (value) => (
    dispatch(changeSearchValue(value))
  ),

  handleIsStocked: (bool) => (
    dispatch(toggleStockedOnly(bool))
  ),

});

FilterableProductTable = connect(mapStateToProps, mapDispatchToProps)(FilterableProductTable)

ReactDOM.render(<Provider store={store}>
  <FilterableProductTable data={data}/>
</Provider>,
  document.getElementById("root"));
