import React,{Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity} from 'react-native';
  import db from '../config';
  import firebase from 'firebase';
  import MyHeader from '../components/MyHeader'
  import {Card,Header,Icon} from 'react-native-elements'

  export default class DetailsScreen extends React.Component{
    constructor(props){
      super(props)
      this.state={
        userId:firebase.auth().currentUser.email,
        recieverId:this.props.navigation.getParam('details')['user_id'],
        requestId:this.props.navigation.getParam('details')['request_id'],
        itemName:this.props.navigation.getParam('details')['item_name'],
        description:this.props.navigation.getParam('details')['description'],
        recieverName:'',
        recieverContact:'',
        recieverAddress:'',
        recieverRequestDocId :''
      
      }
    }

    getRecieverDetails(){
      db.collection('users').where('emaiLId',"==",this.state.recieverId).get().then(snapshot=>{
        snapshot.forEach(doc=>{
          this.setState({
            recieverName:doc.data().first_name,
            recieverContact:doc.data().contact,
            recieverAddress:doc.data().address,

          })
        })
      })
      db.collection('requested_items').where('request_id',"==",this.state.requestId).get().then(snapshot=>{
        snapshot.forEach(doc=>{
          this.setState({
            recieverRequestDocId:doc.id
          })
        })
      })
    }

    updateItemStatus=()=>{
      db.collection('all_barters').add({
        item_name:this.state.bookName,
        request_id:this.state.requestId,
        requested_by:this.state.recieverName,
        donor_id:this.state.userId,
        request_status:'personInterested'
      })
    }

    componentDidMount(){
      this.getRecieverDetails()
    }
    render(){
      return(
        <View style={styles.container}>
          <View style={{flex:0.1}}>
            <Header
              leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
              centerComponent={{ text:"Exchange !!!", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
              backgroundColor = "#eaf8fe"
            />
          </View>
          <View style={{flex:0.3}}>
            <Card
                title={"Item Information"}
                titleStyle= {{fontSize : 20}}
              >
              <Card >
                <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Description : {this.state.description}</Text>
              </Card>
            </Card>
          </View>
          <View style={{flex:0.3}}>
            <Card
              title={"Requester Information"}
              titleStyle= {{fontSize : 20}}
              >
              <Card>
                <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
              </Card>
            </Card>
          </View>
          <View style={styles.buttonContainer}>
            {
              this.state.recieverId !== this.state.userId
              ?(
                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{
                      this.updateItemStatus()
                    }}>
                  <Text>I want to Barter</Text>
                </TouchableOpacity>
              )
              : null
            }
          </View>
        </View>
      )
    }
  
  }
  
  
  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#87ceeb'
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:50,
      justifyContent:'center',
      alignItems : 'center',
      borderRadius: 10,
      backgroundColor: 'cyan',
    }
  })