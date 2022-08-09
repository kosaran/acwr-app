import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {Input, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { getAuth, onAuthStateChanged, signInWithEmailAndPassword  } from "firebase/auth";
//import { auth } from './Firebase';
import { auth, db} from "./Firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import {Video} from 'expo-av'


//var data = {daily: [], acute:[], chronic :[]};
//var data = {
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
}

//global [global.data, global.onChangeACWR] = React.useState();
var allUsers = []
var thisUser = {name: '', email: '', acwr: null, team:''}
var athletes = []

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const login = ({navigation}) =>{
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  
  
  const signIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
      }); 
    
    getDocs(query(collection(db, "users"))).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //const allUsers = []
            //console.log(doc.data().email);
            if (doc.data().email == email){
              thisUser.email = email
              thisUser.name = doc.data().name
              thisUser.acwr = doc.data().acwr
              thisUser.team = doc.data().team
            }
            const user = {
                email: doc.data().email,
                name: doc.data().name,
                acwr: doc.data().acwr,
                team: doc.data().team
            }
            console.log(thisUser.team);
            allUsers.push(user)
            getTeam(thisUser.team)
            //console.log(doc.id, " => ", doc.data().name);
            //console.log(thisUser.email);
            //console.log(thisUser.name);
            //setEv(events)
        });
    });
  }

  const getTeam = async (team) => {
    const docRef = doc(db, "teams", team);
    const docSnap = await getDoc(docRef);
    athletes = docSnap.data().athletes
    console.log('login',athletes)
  }

  const getData = async () => {
    
    try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key')
        jsonValue != null ? JSON.parse(jsonValue) : null;
        //console.log(JSON.parse(jsonValue).acute)
        
        //data.acute = JSON.parse(jsonValue).acute
        //data.chronic = JSON.parse(jsonValue).chronic
        //data.daily = JSON.parse(jsonValue).daily
        global.data.acute = JSON.parse(jsonValue).acute
        global.data.chronic = JSON.parse(jsonValue).chronic
        //data.daily = JSON.parse(jsonValue).daily

        global.data.date = JSON.parse(jsonValue).date
        global.data.fullDate = JSON.parse(jsonValue).fullDate
        global.data.time = JSON.parse(jsonValue).time
        global.data.percieved = JSON.parse(jsonValue).percieved
        global.data.acwr = JSON.parse(jsonValue).acwr
        
        global.data.desc = JSON.parse(jsonValue).desc
        global.data.com = JSON.parse(jsonValue).com
        global.data.goals = JSON.parse(jsonValue).goals

    } catch(e) {
      // error reading value
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      getData()
      getTeam()
      navigation.navigate('LiNK',{acwr: Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100, name: thisUser.name});
      //navigation.replace('LiNK');
    } else {
        navigation.canGoBack() && navigation.popToTop()
    }
    });
    return unsubscribe
  })

  return (
    <View style={styles.container}>
      <Video
          source={require("./../assets/video1.mp4")}
          style={styles.backgroundVideo}
          shouldPlay={true}
          isLooping
          resizeMode='cover'
          isMuted
          ignoreSilentSwitch={"obey"}
          />
      <SafeAreaView>
      
        <Text style={styles.welcomeText}>PR Login</Text>
        <View>
      <Input
      inputStyle = {{color:'white'}}
      placeholder = 'Enter Email'
      placeholderTextColor="#bbbbbb"
      leftIcon = {{type: 'material', name:'email', color: 'white'}}
      value = {email}
      onChangeText = {text => setEmail(text)}
      />
      <Input
      inputStyle = {{color:'white'}}
      placeholder = 'Enter Password'
      placeholderTextColor="#bbbbbb"
      leftIcon = {{type: 'material', name:'lock', color:'white'}}
      value = {password}
      onChangeText = {text => setPassword(text)}
      secureTextEntry
      />
      </View>
      <View style={styles.buttonBox}>
      <TouchableOpacity style={styles.button} onPress={signIn}>
      <View><Text style={styles.buttonText}>Sign In</Text></View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttontwo} onPress={()=>navigation.navigate('Register')}>
      <View><Text style={styles.buttontwoText}>Register</Text></View>
      </TouchableOpacity>
      </View>
      
      
      {/*<Button title = 'Sign In' style = {styles.button} onPress={()=>navigation.navigate('LiNK')}/>*/}
      {/* <Button title = 'Register' style = {styles.button} onPress={()=>navigation.navigate('Register')}/> */}
      </SafeAreaView>
    </View>
  )
}

const offset = 24;

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 43,
    fontWeight: '700',
    marginTop: 80,
    marginBottom: 80,
    color: 'white',

  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
  },
  buttonText: {
    // marginLeft: offset,
    // fontSize: offset,
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  buttontwoText: {
    // marginLeft: offset,
    // fontSize: offset,
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  button:{
    width:320,
    height:45,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  buttontwo:{
    width:320,
    height:45,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center'
  },
  buttonBox:{
    justifyContent: 'flex-end',
    marginVertical: 40,
  },
  container:{
    flex:1,
    alignItems: 'center',
    padding:10,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

//export {thisUser, athletes, data}
export {thisUser, athletes}
export default login;