import React, { useState, useLayoutEffect} from 'react';
import { StyleSheet, Button, Image, Pressable, Text, View, SafeAreaView, SectionList, TouchableOpacity, Navigator, ScrollView, Modal, RefreshControl} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import { auth, db } from './Firebase';

import { thisUser } from './login';
import { athletes } from './homeNav';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function Share({navigation}) {
    console.log(thisUser)

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }, []);

    const [people, setPeople] = useState([
        { name: 'shaun', id: '1', acwr: 5, newM:true  },
        { name: 'yoshi', id: '2', acwr: 0.2, newM:true },
        { name: 'mario', id: '3', acwr: 8, newM:true  },
        { name: 'luigi', id: '4', acwr: 7, newM:false},
        { name: 'peach', id: '5', acwr: 6, newM:false },
        { name: 'toad', id: '6', acwr: 2, newM:false},
        { name: 'bowser', id: '7', acwr: 3, newM:false },
        { name: 'bowser', id: '8', acwr: 1, newM:false},
    ]);
    //const [people, setPeople] = useState(contacts);

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    const [modalVisible, setModalVisible] = useState(false);
    const [mAlert, showmAlert] = useState(false);
    const [clickedPerson, setClickedPerson] = React.useState('');

    const icon = 'star-border'
    const col = 'red'

    const data = {acute:[], chronic :[]};
    //var data;

    const alert = (s) => {
        if (0.9 <= s && s <= 1.3) {
          //return <Image style={styles.av} source={{ uri:'https://placeimg.com/140/140/any'}}></Image>
          //return <Image style={styles.av} source={{uri: people[1].avatar}}></Image>
          return <TouchableOpacity
                    style={[styles.roundButton1,{borderColor:'limegreen'}]}
                    //onPress={() => {
                    //    setModalVisible(true)     
                    //}}
                    onPress={() => {
                        addData()     
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text>{s}</Text>
                </TouchableOpacity>
        } else if (1.3 < s && s <= 1.5) {
            return <TouchableOpacity
                    style={[styles.roundButton1,{borderColor:'yellow'}]}
                    onPress={() => {
                        addData()     
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text>{s}</Text>
                </TouchableOpacity>
        } else {
          //return <Image style={[styles.av,{borderWidth:0}]} source={{uri: photo}}></Image>
          return <TouchableOpacity
                    style={[styles.roundButton1,{borderColor:'red'}]}
                    onPress={() => {
                        getData() 
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text>{s}</Text>
                </TouchableOpacity>
        }
    }

    //var athletes = []
    const getTeam = async () => {
        const docRef = doc(db, "teams", thisUser.team);
        const docSnap = await getDoc(docRef);
        //athletes = docSnap.data().athletes
        //console.log("Document data:", docSnap.data().athletes)
        /*for (let i = 0; i < docSnap.data().athletes.length; i++) {
            const athlete = {
                id: i,
                name: docSnap.data().athletes[i].name,
                acwr: docSnap.data().athletes[i].acwr,
            }
            athletes.push(athlete)
        }
        console.log(athletes)*/
        //JSON.parse(athletes)
        //console.log(athletes)
        //var [peo, setPeo] = useState(athletes)
        //console.log(people)
    }
    

    useLayoutEffect(() => {
        //getTeam()
        if (onChangeSearch){

        }
    })
    console.log('main',athletes)

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')
            jsonValue != null ? JSON.parse(jsonValue) : null;
            console.log(JSON.parse(jsonValue).acute)
            data.acute = JSON.parse(jsonValue).acute
            data.chronic = JSON.parse(jsonValue).chronic
            return jsonValue
        } catch(e) {
          // error reading value
        }
    }

    const updateData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@storage_Key', jsonValue)
            console.log('done')
          } catch (e) {
            // saving error
          }
    }

    const addData = () => {
        try {
            data.chronic.push(100)
            console.log(data.acute)
            console.log(data.chronic)
          } catch (e) {
            // saving error
          }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style = {{flexDirection: 'row'}}>
                <View style = {{flex:7}}>
                    <Searchbar
                        placeholder= {'search '+ thisUser.team}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        elevation={0}
                    />
                </View>
                <View style = {{flex:2, justifyContent:'center'}}>
                    <Button
                        title='Filter'
                    >
                    </Button>
                </View>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }
            >
                {athletes.map(item => (
                    <View key={item.key} style={[{ justifyContent: "space-evenly" }, { flexDirection: "row" }]}>
                        <TouchableOpacity style={styles.item} onPress={()=>
                             //HomeScreen(),
                             //navigation.navigate('name',{name:item.name, chatID: item.chatID})
                             {setModalVisible(true), setClickedPerson(item.name)}  
                             //HomeScreen()
                             //navigation.navigate('C')
                             }>
                            <View key={item.key} style={[ { flexDirection: "row" }]}>
                                {/*{alert(item.newM, item.avatar)}*/}
                                {/*<Image style={[styles.av,{borderWidth:0}]} source={{uri: 'https://placeimg.com/140/140/any'}}></Image>*/}
                               
                                <Text style={[styles.text,{ flex:3}]}>
                                    {item.name}
                                </Text>
                                {alert(item.acwr)}
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <Modal
                //style={[{width:100}]}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{clickedPerson}</Text>
                        <Text style={styles.modalText}>Projected</Text>
                        <Text style={styles.modalText}>Target</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    /*container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
      //alignItems: 'center',
      //justifyContent: 'center',
    },*/
    av: {
        width: 50,
        height: 50,
        //alignSelf:"center",
        borderRadius: 50,
        //borderWidth:4,
        //borderColor:'dodgerblue'
    },
    roundButton1: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        //backgroundColor: 'orange',
        borderWidth: 5,
        //borderColor:'limegreen'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    text:{
        paddingTop:10,
        paddingLeft:25,
        fontSize: 25,
        fontFamily:'Helvetica',
        justifyContent:'center'
        //color:'white'
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "deeppink",
        padding:5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    item: {
        flex: 1,
        marginHorizontal: 10,
        //marginTop: 5,
        padding: 15,
        //backgroundColor: 'slateblue',
        //fontSize: 50,
        borderBottomColor:"grey",
        borderBottomWidth:0.5,
    },
    profileIcon: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'white',
        //borderRadius:10,
        //borderWidth: 1,
        //borderColor: '#fff'
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    docIcon: {
        //marginRight:5,
        //marginLeft: 5,
        marginTop: 24,
        //marginBottom:5,
        paddingTop: 15,
        //paddingBottom:5,
        backgroundColor: 'white',
        //borderRadius:10,
        //borderWidth: 1,
        //borderColor: '#fff'
    },
    fileIcon: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'white',
        //borderRadius:10,
        //borderWidth: 1,
        //borderColor: '#fff'
    },
    loginScreenButton: {
        marginRight: 40,
        marginLeft: 40,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#1E6738',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    }
});

export default Share;