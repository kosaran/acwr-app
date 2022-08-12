import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, EdgeInsetsPropType} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Paragraph } from 'react-native-paper';
import { color } from 'react-native-elements/dist/helpers';

//console.log({year: new Date().getFullYear(), day: new Date().getDate()}.year)
const nowDate = new Date(); 
const date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
//console.log(date)



//var today = moment();
//var day = today.clone().startOf('month');
const customDatesStyles = [
  {
    date:  new Date(),
    // Random colors
    //style: {backgroundColor: '#'+('#00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)},
    style: {backgroundColor: 'lightgrey'},
    textStyle: {color: 'black'}, // sets the font color
    containerStyle: [], // extra styling for day container
    allowDisabled: true, // allow custom style to apply to disabled dates
    info: 'cool'
  }
];


export default class CoachCalendar extends Component {
//function Calendar ({navigation}) {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      info: null
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    const nowDate = new Date(date)
    this.setState({
      selectedStartDate: nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(),
      null: date.info
      //selectedStartDate: new Date(date).setHours(0,0,0,0),
      //selectedStartDate: {year: new Date(date).getFullYear(), day: new Date(date).getDate()}
    });
  }
  
  isInThePast(date) {
    const today = new Date();
  
    // 👇️ OPTIONAL!
    // This line sets the hour of the current date to midnight
    // so the comparison only returns `true` if the passed in date
    // is at least yesterday
    //today.setHours(0, 0, 0, 0);
    
    //console.log(date)
    //console.log(today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate())
    //console.log(new Date(date) < new Date(test))
    const test = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()
    return new Date(date) <= new Date(test);
  }
  

  render() {
    const { navigation } = this.props;
    const { selectedStartDate, info } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          todayBackgroundColor = 'lightgrey'
          todayTextStyle={{color: 'black'}}
          selectedDayColor="dimgray"
          selectedDayTextColor="white"
          
          //customDatesStyles={customDatesStyles}
        />
        <View style={styles.dateInfo}>
          <View>
            <Text style={styles.boxText}>Date: { startDate }</Text>
          </View>
          <View style={styles.editButton}>
            <TouchableOpacity onPress={() => 
                navigation.navigate('Report', {date: startDate})
            }>
                <MaterialIcons name='edit' size={35} color="white">
                </MaterialIcons>
            </TouchableOpacity>
      </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection:'column'
    //marginTop: 10,
  },
  dateInfo: {
    backgroundColor: 'black',
    margin:20,
    padding: 10,
    flex:1,
    //marginTop: 10,
  },
  editButton:{
    flex:1,
    //backgroundColor: 'white',
    //flexDirection:'column',
    justifyContent: 'flex-end',
    alignSelf:'flex-end'
  },
  boxText:{
    color: 'white',
    margin: 3,
    fontSize: 15
  }
});
