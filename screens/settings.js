import React, { useLayoutEffect, useState, useRef, Component, useEffect} from 'react';
import { StyleSheet, Pressable, Text, View, SafeAreaView, TextInput, TouchableOpacity, Modal, Button, Switch} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
//import { getAuth, signOut } from "firebase/auth";
//import { auth } from './Firebase';
//import { thisUser } from './login';
import {thisUser} from './homeNav'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync(
        {
          content: {
            title: 'Remember to report your activity!',
            //data:{data: }
          },
          trigger: {
            //seconds: 60*1,
            hour: 20, 
            minute: 0, 
            repeats: true,
          },
        },
      );
}

if (global.data.notifications){
    schedulePushNotification()
} else{
    Notifications.cancelAllScheduledNotificationsAsync()
}

console.log('are notis on' + global.data.notifications)
//Notifications.BackgroundNotificationsTask()
//Notifications.cancelAllScheduledNotificationsAsync()

const settings = ({navigation}) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [selectedLanguage, setSelectedLanguage] = useState();

    const [isEnabled, setIsEnabled] = useState(global.data.notifications);
    const toggleSwitch = async() => {
        setIsEnabled(previousState => !previousState)
        if (global.data.notifications){
            global.data.notifications = false
        } else{
            global.data.notifications = true
        }
        
        try {
            const jsonValue = JSON.stringify(global.data)
            await AsyncStorage.setItem('@storage_Key', jsonValue)
            //console.log(new Date())
            //console.log(jsonValue)
        } catch (e) {
              // saving error
        }
    };

    const [properties, setProperty] = useState([
        { name: 'Name', id: '1'},
        { name: 'Email', id: '2'},
        { name: 'Notifications', id: '3'},
    ]);

    //const [username, onChangeUsername] = React.useState(auth.currentUser.displayName);
    //const [email, onChangeEmail] = React.useState(auth.currentUser.email);
    const [username, onChangeUsername] = React.useState(thisUser.name);
    const [email, onChangeEmail] = React.useState(thisUser.email);
    const [text, onChangeText] = React.useState("123-456-789");
    
    
    const [modalVisible, setModalVisible] = useState(false);
    const [mAlert, showmAlert] = useState(false);
    const icon = 'star-border'
    const col = 'red'

    /*useLayoutEffect(() => {
       navigation.setOptions({
           headerRight:()=> (
               <AntDesign name = "logout" size = {24}
                color = 'black'/>
           )
       })
    })*/
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

      React.useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          //const url = response.notification.request.content.data.url;
          //Linking.openURL(url);
          navigation.navigate('Calendar')
          //console.log('gooob' + url)
        });
        //return () => subscription.remove();
      }, []);

    const signOut = () => {
        //navigation.navigate('Login')
        getAuth().signOut().then(function() {
            navigation.navigate('Login')
          // Sign-out successful.
        }, function(error) {
          // An error happened.
        });
    }

    const clearData = () => {
        global.data = {
            date: [],
            fullDate: [],
            time: [],
            percieved: [],
            acute: [],
            chronic: [],
            acwr: [],
            desc: [],
            com: [],
            goals: [],
            notifications: true,
        }
        storeData(global.data)
        
    }

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('@storage_Key', jsonValue)
          console.log('delete')
          //console.log(jsonValue)
          alert('sucess', 'sucess')
        } catch (e) {
          // saving error
          console.log(e)
          alert('Failed')
        }
        //console.log(global.data)
    }

    const teams = (team) => (
        <Picker.Item label={team} value={team}/>
    )

    const alert = (s) => {
        if (s) {
          return <MaterialIcons name='circle' size={50} color="slateblue"></MaterialIcons>;
        } else {
          return <MaterialIcons name='circle' size={50} color="black"></MaterialIcons>;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[{ flexDirection: "column" }, {flex:6}]}>
                <View style={[{padding:15}]}>
                    <Text>
                        Username
                    </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeUsername}
                        value={username}
                        clearButtonMode={true}
                        //placeholderTextColor='red'
                    />       
                </View>
                <View style={[{padding:15}]}>
                    <Text>
                        Email
                    </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeEmail}
                        value={email}
                        clearButtonMode={true}
                    />       
                </View>
                <View style={[{padding:15, flex:1}]}>
                    <Text>
                        Team
                    </Text>
                    <Picker
                        style={[{backgroundColor:'white'}]}
                        selectedValue={selectedLanguage}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedLanguage(itemValue)
                        }>
                        {teams(thisUser.team)}
                        {/*<Picker.Item label="Toronto Racers" value="java" />
                        <Picker.Item label="Varisty Blues" value="js" />*/}
                    </Picker>
                </View>
                <View style={[{alignItems:'center', flexDirection:'row', justifyContent:'center'}]}>
                    <Text>Notifications</Text>
                    <Switch
                            trackColor={{ false: "#767577", true: "limegreen" }}
                            thumbColor={isEnabled ? "white" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                </View>
                <View style={[{padding:30, alignItems:'center', flex:1}]}>
                    <Button color = 'red' title = 'Delete Data' style = {styles.button} onPress = {
                        //clearData
                        () => setModalVisible(!modalVisible)
                        }/>
                    <Button title = 'Sign Out' style = {styles.button} color = 'black' onPress = {signOut}/>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{paddingBottom:10, fontSize: 20, fontWeight:'600'}}>ARE YOU SURE?</Text>
                        <Pressable
                            style={[styles.buttonDelete]}
                            onPress={clearData}
                        >
                            <Text style={styles.textStyle}>Delete</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.buttonClose]}
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


async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

const styles = StyleSheet.create({
    /*container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
      //alignItems: 'center',
      //justifyContent: 'center',
    },*/
    picker:{
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, 
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    text:{
        paddingTop:5,
        paddingLeft:5,
        fontSize: 20,
        fontFamily:'Helvetica',
        //color:'white'
    },
    input:{
        padding:5,
        marginBottom: 2,
        fontSize: 15,
        borderWidth:1,
        fontFamily:'Helvetica',
        height:50,
        borderRadius: 8,
        //color:'white'
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonDelete: {
        backgroundColor: "red",
        margin: 5,
        padding: 15,
        alignSelf: 'stretch'
    },
    buttonClose: {
        backgroundColor: "grey",
        margin: 5,
        padding: 15,
        //alignSelf: 'stretch'
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
        alignItems: "center",
        justifyContent: "center"
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
        padding: 50,
        //alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        //flexDirection: 'row'
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
    },
    titleText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "bold"
      },
    box: {
        height: 150,
        width: 150,
        backgroundColor: "blue",
        borderRadius: 5
    }
});

export default settings;