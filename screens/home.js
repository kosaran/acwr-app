import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Button, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity, FlatList, RefreshControl, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Carousel from 'react-native-snap-carousel';
import CustomButton from '../components/CustomButton';
import InNav from '../components/InNav';
import { thisUser } from './homeNav';

//import { data, thisUser } from './login';
//import {thisUser} from './login';

const contacts = []
var acwrCol = 'white'

function Home({navigation, route}) {
    console.log(global.data)
    const { width, height } = Dimensions.get('window');

    const goals = 
        [
            {key: 'Improve tendon strength/elasticity'},
            {key: 'Relaxed upper body and arm swing'},
            {key: 'Increase stride length'},
        ]   
    
    
    const tableHead = ['Day/Workout', 'Monday', 'Wednesday', 'Friday']
    const tableData = [
              ['Warm Up', 'Cleans', 'Snatch', 'Clean + Jerk'],
              ['Superset 1', 'Squat\nRDL', 'Bench\nPullup', 'Deadlift\nNordic Curls'],
              ['Superset 2', 'Calf Bounds', 'Rows\nLateral Raises', 'Back Extension\nReverse Nordic'],
              ['Cool Down', 'Tibialis Raises', 'Rotator Cuff', 'Calf Raises']
            ]

            const carouselItems= [
                {
                    title:"Item 1",
                    text: "Text 1",
                },
                {
                    title:"Item 2",
                    text: "Text 2",
                },
                {
                    title:"Item 3",
                    text: "Text 3",
                },
                {
                    title:"Item 4",
                    text: "Text 4",
                },
                {
                    title:"Item 5",
                    text: "Text 5",
                },
              ]

    const chartLabels = () => {
        if ( global.data.date.length < 7){
            const days = global.data.date
            const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for (let i = 0; i < global.data.date.length; i++) {
                days[i] = weekday[new Date(days[i]).getDay()]
            }
            return days
        }else{
            const days = global.data.date.slice(-7)
            const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for (let i = 0; i < 7; i++) {
                days[i] = weekday[new Date(days[i]).getDay()]
            }
            return days
        }
    }

    const renderItem = ({ item, index}) => (

          <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 5,
              height: 250,
              //padding: 50,
              marginLeft: 25,
              marginRight: 25, 
              }}>
            <TouchableOpacity
                            style={[styles.roundButton1,{borderColor:'limegreen'}]}
                        >
                            <Text>
                                {
                                    //Math.round(data.acwr[data.acwr.length - 1] * 100) / 100
                                    Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100
                                }
                            </Text>
            </TouchableOpacity>
          </View>

    )

    const pickCol = (s) =>{
        if (0.9 <= s && s <= 1.3) {
            return 'limegreen'
          } else if (1.3 < s && s <= 1.5) {
              return 'yellow'
          } else {
            return 'red'
          }
    }

    return (
        <SafeAreaView style={[styles.container, {flexDirection: "column"}]}>
            <View>
                    <Text style={styles.welcometext}>Welcome, {thisUser.name} </Text>
            </View>

            <View style={{  justifyContent:'center'}}>

                <View style={{ marginVertical:12}}>
                <View>
                    <Text style={styles.centersubheading}>Current ACWR</Text>
                </View>
                            <Text style={[styles.roundbuttontext1, {color: pickCol(Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100)}]}>
                                {
                                    //Math.round(data.acwr[data.acwr.length - 1] * 100) / 100
                                    Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100
                                }
                            </Text>
                    </View>
                           
                <View style={{ justifyContent: 'center', alignSelf:'center'}}>
                <View>
                    <Text style={styles.centersubheading}>Load Progress</Text>
                </View>
                    <LineChart
                        data={{
                        //labels: ["January", "February", "March", "April", "May", "June"],
                        labels: global.data.date.slice(-7),
                        datasets: [
                            {
                            /*data: [
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100
                            ]*/
                            data: global.data.acwr.slice(-7)
                            //data: pastMonths()
                            }
                        ]
                        }}
                        width={Dimensions.get("window").width - 10} // from react-native
                        height={225}
                        //yAxisLabel="$"
                        //yAxisSuffix="k"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 69, 196, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 39, 89, ${opacity})`,
                        style: {
                            borderRadius: 1
                        },
                        propsForDots: {
                            r: "3",
                            strokeWidth: "6",
                            stroke: "#001f59"
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 10
                        }}
                />   
            </View>
                {/* <View>
                        <Text style={styles.subheading}>Goals</Text>
                        <FlatList
                            data={goals}
                            renderItem={({item}) => <Text style={styles.goalstext}>{item.key}</Text>}
                        />
                    </View> */}
            </View>
            {/* <View style={{ 
                padding: 10,
                justifyContent:'center'
                //backgroundColor: "darkorange"
                }}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                        <Rows data={tableData} textStyle={styles.text}/>
                    </Table>
            </View> */}
            <InNav style={{  alignSelf:'center'}} image={require('../assets/goals.jpg')} text='View Goals' />
            <InNav image={require('../assets/workout.jpg')} text='View Workout Plan' />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    welcometext: {
        padding: 10,
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 10,

    },
    roundButton1: {
        //justifyContent: 'center',
        //alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'orange',
    },
    roundbuttontext1: {
        fontSize: 32,
        fontWeight: '700',
        marginVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    profileIcon: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        //backgroundColor: 'white',
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
        //backgroundColor: 'white',
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
    text: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    subheading: {
        fontSize: 22,
        fontWeight: '700',
        paddingLeft: 10,
        paddingRight: 10,
        paddingVertical: 5,
    },
    centersubheading: {
        fontSize: 22,
        fontWeight: '700',
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
    },
    goalstext: {
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: '600',
        paddingVertical: 2,
    },
    roundButton1: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        borderWidth: 5,
        margin:10
    },
    head: {
        height: 30,
        backgroundColor: '#f1f8ff'
     },
    text: { 
        margin: 5 
    }
});

export {contacts};
export default Home;