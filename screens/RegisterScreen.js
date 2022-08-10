import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Input, Button} from 'react-native-elements';

import { auth, db} from "./Firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, updateDoc, arrayUnion} from "firebase/firestore"; 
import { athletes } from './login';

//import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
//const auth = getAuth();
//import auth from "@react-native-firebase/auth"
//import { auth } from './Firebase';


const RegisterScreen = ({navigation}) =>{
  const[email, setEmail] = useState('');
  const[name, setName] = useState('');
  const[team, setTeam] = useState('');
  const[imageURL, setImageURL] = useState('');
  const[password, setPassword] = useState('');
  const register = () =>
    createUserWithEmailAndPassword(auth, email,password)
    .then((userCredential) => {
        //var user = userCredential.user;
        //user.updateProfile({
        //displayName: name, photoURL: imageURL? imageURL:"https://example.com/jane-q-user/profile.jpg"
        //}).catch(function(error) {
          //setValidationMessage(error.message);
        //});
        setDoc(doc(db, "users", email), {
          name: name,
          email: email.toLowerCase(),
          team: '4ywTWkPfTDT20ojJcx1c'
          //password: password
        });

        //console.log('register' + email)
        updateDoc(doc(db, "teams", '4ywTWkPfTDT20ojJcx1c'), {
          athletes: arrayUnion({acwr: null, email: email, name: name})
          //password: password
        });
      

        updateProfile(auth.currentUser, {
          displayName: name, photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });
        navigation.navigate('LiNK')
        //navigation.replace('LiNK')
        //navigation.popToTop();
    }).catch((error) => {
        //var errorCode = error.code;
        //var errorMessage = error.message;
        //alert(errorMessage)
    });
    return (
      <View style={styles.container}>
          <Input
          placeholder = 'Enter Name'
          label = 'Name'
          leftIcon = {{type: 'material', name:'badge'}}
          value = {name}
          onChangeText = {text => setName(text)}
          />
          <Input
          placeholder = 'Enter Team Code'
          label = 'Team'
          leftIcon = {{type: 'material', name:'people'}}
          value = {team}
          onChangeText = {text => setTeam(text)}
          />
          <Input
          placeholder = 'Enter Email'
          label = 'Email'
          leftIcon = {{type: 'material', name:'email'}}
          value = {email}
          onChangeText = {text => setEmail(text)}
          />
          <Input
          placeholder = 'Enter Password'
          label = 'Password'
          leftIcon = {{type: 'material', name:'lock'}}
          value = {password}
          onChangeText = {text => setPassword(text)}
          secureTextEntry
          />
        
        
        {/*<Input
        placeholder = 'Enter Image'
        label = 'Image'
        leftIcon = {{type: 'material', name:'face'}}
        value = {imageURL}
        onChangeText = {text => setImageURL(text)}
    />*/}
        
          <TouchableOpacity style = {styles.button} onPress = {register}>
            <Text style = {styles.buttonText}>
              Register  
            </Text>
          </TouchableOpacity>
      </View>
    )
  }
  
  const offset = 24;
  
  const styles = StyleSheet.create({
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
    container:{
      flex:1,
      alignItems: 'center',
      padding:10,
      backgroundColor: 'white'
    },
    buttonText: {
      // marginLeft: offset,
      // fontSize: offset,
      color: 'black',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '500',
    },
    button:{
      //justifyContent:,
      width:320,
      height:45,
      marginTop: 10,
      borderRadius: 8,
      borderColor: 'black',
      borderWidth: 2,
      justifyContent: 'center'
    },
  });
  
  export default RegisterScreen;