import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from "../home"
import Report from '../Report';
import share from '../share'
import History from '../History';
import Calendar from '../Calendar'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CoachSettings from './CoachSettings';

import { auth, db} from "../Firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth} from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 

const Stack = createMaterialBottomTabNavigator();
var thisUser = {name: '', email: '', acwr: null, team:'', teamID: ''}
var athletes = []

function CoachHomeNav() {
  const[email, setEmail] = useState('');
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setEmail(user.email)
      getUser()
      getData()
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const getUser = async () =>{
    getDocs(query(collection(db, "users"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if (doc.data().email == email){
            thisUser.email = email
            thisUser.name = doc.data().name
            thisUser.team = doc.data().teamID
            thisUser.teamID = doc.data().teamID
            //console.log('bird'+thisUser.teamID)
          }
          const user = {
              email: doc.data().email,
              name: doc.data().name,
              acwr: doc.data().acwr,
              team: doc.data().team
          }
          getTeam(thisUser.team)
      });
  });
  }
  
  const getTeam = async (team) => {
    const docRef = doc(db, "teams", team);
    const docSnap = await getDoc(docRef);
    athletes = docSnap.data().athletes
  }

  const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key')
        jsonValue != null ? JSON.parse(jsonValue) : null;
        global.data.acute = JSON.parse(jsonValue).acute
        global.data.chronic = JSON.parse(jsonValue).chronic
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

  return (
    <Stack.Navigator     
      activeColor="black"
      barStyle={{ backgroundColor: 'white' }}
    >
      <Stack.Screen 
        name="Calendar" 
        component={Calendar} 
        options={{
          // unmountOnBlur: true,
          tabBarLabel: 'Calendar',
          tabBarColor:'white',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='calendar-today' size={24} color={color}></MaterialIcons>
          ),
        }}
        listeners={({navigation}) => ({blur: () => navigation.setParams({screen: undefined})})}
      />
      <Stack.Screen 
        name="Share" 
        component={share} 
        options={{
          // unmountOnBlur: true,
          tabBarLabel: 'Share',
          tabBarColor:'white',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='people' size={24} color={color}></MaterialIcons>
          ),
        }}
        listeners={({navigation}) => ({blur: () => navigation.setParams({screen: undefined})})}
      />
    </Stack.Navigator>

);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
});

export {athletes, thisUser}
export default CoachHomeNav