import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, EdgeInsetsPropType} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Paragraph } from 'react-native-paper';
import { color } from 'react-native-elements/dist/helpers';
import { athletes } from './homeNav';
import { thisUser } from './login';
import CustomButton from '../components/CustomButton';
import { compareDocumentPosition } from 'domutils';
import { Feather } from '@expo/vector-icons';

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
    textStyle: {color: 'white'}, // sets the font color
    containerStyle: [], // extra styling for day container
    allowDisabled: true, // allow custom style to apply to disabled dates
    info: 'cool'
  }
];


export default class Calendar extends Component {
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
    const EditButton = ({showButton}) => (
      <View style={styles.editButton}>
        {showButton && 
          <TouchableOpacity onPress={() => 
            navigation.navigate('Report', {date: startDate})
          }>
              <MaterialIcons name='edit' size={35} color="white">
              </MaterialIcons>
          </TouchableOpacity>
        }
      </View>
    )
    const displayButton = false

    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          todayBackgroundColor = 'dimgray'
          todayTextStyle={{color: 'white'}}
          selectedDayColor="lightgray"
          selectedDayTextColor="black"
          
          //customDatesStyles={customDatesStyles}
        />
         <View style={styles.dateInfoBox}>

      
        <Text style={styles.datetext}>{ startDate }</Text>

        <View style={styles.infobox}>
        <Text style={styles.boxsubheading}>Time:</Text>
        <Text style={styles.boxText}>{ global.data.time[global.data.date.indexOf(startDate)] }</Text>
        </View>

        <View style={styles.infobox}>
        <Text style={styles.boxsubheading}>Perceived Load:</Text>
        <Text style={styles.boxText}>{ global.data.percieved[global.data.date.indexOf(startDate)]}</Text>
        </View>

        <View style={styles.infobox}>
        <Text style={styles.boxsubheading}>ACWR:</Text>
        <Text style={styles.boxText}>{ global.data.acwr[global.data.date.indexOf(startDate)] }</Text>
        </View>

        <TouchableOpacity style = {styles.button} onPress = {() => console.log('hello')}>
            <Text style = {styles.buttontext}>
              Edit  <Feather name="edit-2" size={16} color="black" />
            </Text>
          </TouchableOpacity>

  </View>
       
 
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection:'column',
  },
  datetext: {
    color: "black",
    textAlign: "center",
    fontWeight: '800',
    fontSize: 22,
    marginVertical:20,  
  },
  boxsubheading : {
    fontWeight: '700',
    fontSize: 18,
  },
  dateInfoBox: {
    borderTopWidth: 1,
    margin:20,
    padding: 10,
    flex:1,
  },
  editButton:{
    flex:1,
    //backgroundColor: 'white',
    //flexDirection:'column',
    justifyContent: 'flex-end',
    alignSelf:'flex-end'
  },
  infobox:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 26,
    paddingVertical:17,
    borderTopWidth: 0.5,
  },
  boxText:{
    color: 'black',
    fontWeight: '800',
    textAlign: "left",
    fontSize: 20,
  },
  button: {
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    padding: 13,
    marginHorizontal: 25,
},
buttontext: {
    color: "black",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
}
});

//export default Calendar