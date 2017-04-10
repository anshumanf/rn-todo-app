import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Keyboard,
  AsyncStorage,
  ActivityIndicator,
  Platform,
} from 'react-native';

import Header from './Header';
import Row from './Row';
import Footer from './Footer';

const filterItems = (items, filter) => items.filter(item => {
  let retVal;
  switch(filter) {
    case 'ALL': retVal = true; break;
    case 'ACTIVE': retVal = !item.complete; break;
    case 'COMPLETED': retVal = item.complete; break;
    default: retVal = true; break;
  }
  return retVal;
});

class App extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      loading: true,
      allComplete: false,
      filter: 'ALL',
      value: '',
      items: [],
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('items').then(json => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, {loading: false});
      } catch(e) {
        this.setState({
          loading: false,
        });
      }
    });
  }

  setSource = (items, itemsDataSource, otherState={}) => {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      ...otherState,
    });
    AsyncStorage.setItem('items', JSON.stringify(items))
  };

  handleUpdateText = (key, text) => {
    const items = this.state.items.map(item => (item.key === key ?
      {...item, text} :
      item
    ));
    this.setSource(items, filterItems(items, this.state.filter));
  };

  handleToggleEditing = (key, editing) => {
    const items = this.state.items.map(item => (item.key === key ?
      {...item, editing} :
      item
    ));
    this.setSource(items, filterItems(items, this.state.filter));
  };

  handleToggleComplete = (key, complete) => {
    const items = this.state.items.map(item => item.key === key ?
      {...item, complete} :
      item
    );
    this.setSource(items, filterItems(items, this.state.filter));
  };

  handleRemove = key => {
    const items = this.state.items.filter(item => item.key !== key);
    this.setSource(items, filterItems(items, this.state.filter));
  };

  handleToggleAllComplete = () => {
    const
      allComplete = !this.state.allComplete,
      items = this.state.items.map(item => ({
        ...item,
        complete: allComplete,
      }));
    console.table(items);
    this.setSource(items, filterItems(items, this.state.filter), {allComplete});
  };

  handleAddItem = () => {
    if(this.state.value) {
      const items = [
        ...this.state.items,
        {
          key: Date.now(),
          text: this.state.value,
          complete: false,
        },
      ];
      console.table(items);
      this.setSource(items, filterItems(items, this.state.filter), {value: ''});
    }
  };

  handleChange = value => {
    this.setState({value});
  };

  handleListScroll = () => {
    Keyboard.dismiss();
  };

  handleFilter = filter => {
    this.setSource(this.state.items, filterItems(this.state.items, filter), {filter});
  };

  handleClearComplete = () => {
    const items = filterItems(this.state.items, 'ACTIVE');
    this.setSource(items, filterItems(items, this.state.filter));
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          value               = {this.state.value}
          onAddItem           = {this.handleAddItem}
          onChange            = {this.handleChange}
          onToggleAllComplete = {this.handleToggleAllComplete}
        />
        <View style={styles.content}>
          <ListView
            style               = {styles.list}
            enableEmptySections = {true}
            dataSource          = {this.state.dataSource}
            onScroll            = {this.handleListScroll}
            renderRow           = {({key, ...value}) => (
              <Row
                {...value}
                key          = {key}
                onUpdate     = {text => this.handleUpdateText(key, text)}
                onToggleEdit = {editing => this.handleToggleEditing(key, editing)}
                onComplete   = {complete => this.handleToggleComplete(key, complete)}
                onRemove     = {complete => this.handleRemove(key)}
              />
            )}
            renderSeparator     = {(sectionId, rowId) => (
              <View key={rowId} style={styles.separator} />
            )}
          />
        </View>
        <Footer
          count           = {filterItems(this.state.items, 'ACTIVE').length}
          filter          = {this.state.filter}
          onFilter        = {this.handleFilter}
          onClearComplete = {this.handleClearComplete}
        />
        {this.state.loading && (
          <View style={styles.loading}>
            <ActivityIndicator
              animating = {true}
              size      = "large"
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : '#f5f5f5',
    ...Platform.select({
      ios: {paddingTop: 30},
    }),
  },
  content : {
    flex : 1,
  },
  list : {
    backgroundColor: '#fff',
  },
  separator: {
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  loading: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    left:     0,
    right:    0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
