/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { AppRegistry, Text, View, StyleSheet, TabBarIOS } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import List from './app/list/index.js'
import Edit from './app/edit/index.js'
import Account from './app/account/index.js'


class testpdn extends React.Component {

  getInitialState() {
    console.log('getInitialState')
    return {
      times: this.props.times
    }
  }

  state = {
    selectedTab: 'blueTab'
  }


  render() {
    return (
      <TabBarIOS
        tintColor="#ee735c">
        <Icon.TabBarItemIOS
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'List'}
          onPress={() => {
            this.setState({
              selectedTab: 'List'
            })
          }}>
          <List />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'Edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'Edit'
            })
          }}>
          <Edit />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'Account'}
          onPress={() => {
            this.setState({
              selectedTab: 'Account'
            })
          }}>
          <Account />
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

AppRegistry.registerComponent('testpdn', () => testpdn)
