import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Button, Text, Modal, View, Pressable, TextInput, Keyboard,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
//import DropDownPicker from 'react-native-dropdown-picker';
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

import Home from "./screens/home"
import homeNav from './screens/homeNav';
import login from './screens/login';
import Settings from './screens/settings.js';
import Report from './screens/Report';
import ReportTwo from './screens/BodyPage'
import RegisterNav from './screens/RegisterNav'
import CoachHomeNav from './screens/CoachScreens/CoachHomeNav'
import CoachSettings from './screens/CoachScreens/CoachSettings';

const Stack = createNativeStackNavigator();

const BACKGROUND_FETCH_TASK = 'background-fetch';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = new Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

//export default function App() {
const App = ({navigation}) => {

  const [isRegistered, setIsRegistered] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };
  toggleFetchTask()

  const auth = getAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);
  
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
        global.data.time = JSON.parse(jsonValue).time
        global.data.percieved = JSON.parse(jsonValue).percieved
        global.data.acwr = JSON.parse(jsonValue).acwr
    } catch(e) {
      // error reading value
    }
  }
  getData()


  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen 
          name="Login" 
          component={login} 
      />
      <Stack.Screen 
          name="LiNK" 
          component={homeNav} 
          //options={{ 
          options={({ navigation }) => ({
            gestureEnabled: false,
            headerTitle: 'ACWR',
            headerStyle: {
              //backgroundColor: '#f4511e',
            },
            headerRight: () => (
              <TouchableOpacity onPress={() => 
                //alert('This is a button!')
                //navigation.navigate('Register')
                navigation.navigate('Settings')
                //signOut()
              }>
                  <MaterialIcons name='settings' size={30} color="black">
                  </MaterialIcons>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => 
                //alert('This is a button!')
                //navigation.navigate('Register')
                navigation.navigate('Report')
                //signOut()
              }>
                  <MaterialIcons name='add' size={30} color="black">
                  </MaterialIcons>
              </TouchableOpacity>
            ),
            })}
          //options={{ headerShown: false }}
        />
        {/*<Stack.Screen 
          name="Home" 
          component={Home} 
          />*/}
        <Stack.Screen 
          name="CoachHomeNav" 
          component={CoachHomeNav} 
          options={({ navigation }) => ({
            headerTitle: 'ACWR',
            headerRight: () => (
              <TouchableOpacity onPress={() => 
                //alert('This is a button!')
                //navigation.navigate('Register')
                navigation.navigate('CoachSettings')
                //signOut()
              }>
                  <MaterialIcons name='settings' size={30} color="black">
                  </MaterialIcons>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => 
                //alert('This is a button!')
                //navigation.navigate('Register')
                navigation.navigate('Report')
                //signOut()
              }>
                  <MaterialIcons name='add' size={30} color="black">
                  </MaterialIcons>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterNav} 
        />
        <Stack.Screen 
          name="Settings" 
          component={Settings} 
        />
        <Stack.Screen 
          name="ReportTwo" 
          component={ReportTwo} 
        />
        <Stack.Screen 
        name="CoachSettings" 
        component={CoachSettings} 
        />
        <Stack.Screen 
            name="Report" 
            component={Report} 
            options={{
              unmountOnBlur: true,
              tabBarColor:'limegreen',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name='accessibility' size={24} color={color}></MaterialIcons>
              ),
            }}
            listeners={({navigation}) => ({blur: () => navigation.setParams({screen: undefined})})}
        />
    {/*<View style={styles.container}>
      <Home></Home>
      <StatusBar style="auto" />
  </View>*/}
  </Stack.Navigator>
   </NavigationContainer>
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

export default App;