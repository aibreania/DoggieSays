import React from 'react';
import { Text, View, StyleSheet, ListView, TouchableHighlight, Image, Dimensions, ActivityIndicator, RefreshControl, AlertIOS } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request';
import config from '../common/config';

var width = Dimensions.get('window').width

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}

var Item = React.createClass({
  getInitialState() {
    var row = this.props.row

    return {
      up: row.voted,
      row: row
    }
  },

  _up() {
    let that = this
    let up = !this.state.up
    let row = this.state.row
    let url = config.api.base + config.api.up

    let body = {
      id: row._id,
      up: up ? 'yes' : 'no',
      accessToken: '3aa2'
    }

    request.post(url, body)
      .then(function(data) {
        if(data && data.success) {
          that.setState({
            up: up
          })
        }
        else {
          AlertIOS.alert('Like failed, try later')
        }
      })
      .catch(function(err){
        console.log(err)
        AlertIOS.alert('Like failed, try later')
      })
  },

  render() {
    let row = this.state.row
      return (
         <TouchableHighlight>
          <View>
            <Text style={styles.item}>{row.title}</Text>
            <Image
              source={{uri: row.thumb}}
              style={styles.thumb}
            >
              <Icon
                name='ios-play'
                size={28}
                style={styles.play} />
            </Image>
            <View style={styles.itemFooter}>
              <View style={styles.handleBox}>
                <Icon
                  name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                  size={28}
                  onPress={this._up}
                  style={[styles.up, this.state.up ? null : styles.down]}/>
                <Text style={styles.handleText} onPress={this._up}>Like</Text>
              </View>
              <View style={styles.handleBox}>
                <Icon
                  name='ios-chatboxes-outline'
                  size={28}
                  style={styles.commentIcon} />
                <Text style={styles.handleText}>Comment</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  })

var List = React.createClass ({
    getInitialState() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        dataSource: ds.cloneWithRows([]),
        isLoadingTail: false,
        refreshing: false
      }
    },

    _renderRow(row) {
      return <Item row={row} />
    },

    componentDidMount() {
      this._fetchData(1);
    },

    _fetchData(page) {//"_" means private method
      let that = this

      if (page !== 0) {
        this.setState({
          isLoadingTail: true
        })
      }
      else {
        this.setState({
          refreshing: true
        })
      }

      request.get(config.api.base + config.api.creations, {
        accessToken: '111',
        page: page
      })
      .then((data) => {
        if(data.success) {
          let items = cachedResults.items.slice()
          if (page !== 0) {
            items = items.concat(data.data)
            cachedResults.nextPage += 1
          }
          else {
            items = data.data.concat(items)
          }

          cachedResults.items = items
          cachedResults.total = data.total

          setTimeout(function() {
            if (page !== 0){
                that.setState({
                  isLoadingTail: false,
                  dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
               })
            } else {
                that.setState({
                  refreshing: false,
                  dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                })
            }

          }, 20)
        }
      })
      .catch((error) => {
        if (page !== 0){
          this.setState({
            isLoadingTail: false
          })
        } else {
            this.setState({
            refreshing: false
          })
        }
        console.error(error);
      });
    },

    _hasMore() {
      return cachedResults.items.length !== cachedResults.total
    },

    _fetchMoreData() {
      if(!this._hasMore() || this.state.isLoadingTail) {
          return;
      }
      let page = cachedResults.nextPage
      this._fetchData(page)
    },

    _onRefresh() {
      if(!this._hasMore() || this.state.refreshing)
        return
      this._fetchData(0)
    },

    _renderFooter() {
      if(!this._hasMore() && cachedResults.total !== 0) {
        return (
          <View style={styles.loadingMore}>
            <Text style={styles.loadingText}>没有更多了</Text>
          </View>
        )
      }
      if(!this.state.isLoadingTail) {
        return <View style={styles.loadingMore} />
      }

      return <ActivityIndicator style={styles.loadingMore}/>
    },

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>列表页面</Text>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                tintColor="#ff6600"
                title="Loading..."
              />
            }
            renderFooter={this._renderFooter}
            enableEmptySections={true}
            onEndReached={this._fetchMoreData}
            onEndReachedThreshold={20}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      );
    }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  thumb: {
    width: width,
    height: width * 0.56,
    resizeMode: 'cover'
  },
  title: {
    padding: 8,
    fontSize: 20,
    color: '#333'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width /2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66'
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  down: {
    fontSize: 22,
    color: '#333'
  },
  up: {
    fontSize: 22,
    color: '#ed7b66'
  },
  commentIcon: {
    fontSize: 22,
    color: '#333'
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
})

module.exports = List

