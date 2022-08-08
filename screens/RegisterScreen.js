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
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore"; 

//import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
//const auth = getAuth();
//import auth from "@react-native-firebase/auth"
//import { auth } from './Firebase';



const RegisterScreen = ({navigation}) =>{
  const[email, setEmail] = useState('');
  const[name, setName] = useState('');
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
          email: email,
          //password: password
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
      <Input
      placeholder = 'Enter Image'
      label = 'Image'
      leftIcon = {{type: 'material', name:'face'}}
      value = {imageURL}
      onChangeText = {text => setImageURL(text)}
      />
      <Button title = 'Register' style = {styles.button} onPress = {register}/>
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
  buttonText: {
    marginLeft: offset,
    fontSize: offset,
  },
  button:{
    width:200,
    marginTop: 10,
  },
  container:{
    flex:1,
    alignItems: 'center',
    padding:10,
  }
});

export default RegisterScreen;
