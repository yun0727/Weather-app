import React, { useEffect, useState } from "react";
import * as Location from "expo-location"
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from "react-native";
import {StatusBar} from "expo-status-bar";
import {Fontisto} from "@expo/vector-icons"

const {width:SCREEN_WIDTH} = Dimensions.get("window");

const API_KEY="bc3664f966d0168cc30b2c65d56aad10"

const icons = {
  Clouds: "cloudy",
  Clear:"day-sunny",
  Atmosphere:"cloudy-dusts",
  Snow:"snow",
  Rain:"rains",
  Drizzle:"rain",
  Thunderstorm:"lightening"
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async()=>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false)
    }
    const {
      coords :{latitude, longitude},
    } = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps: false}
    );
    setCity(location[0].city)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`

    );
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
      if (weather.dt_txt.includes("00:00:00")) {
      return weather;
      }
      })
      );
  };
  useEffect(()=>{
    getWeather();
  },[])
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName} >{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator
              color="white"
              style={{marginTop: 10}}
              size="large"
            />
          </View>
        ):(
          days.map((day,index)=>(
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection:"row",
                  alignItems:"center",
                  width:"100%",
                  justifyContent:"space-between"
                }}>
                  <Text style={styles.temp}>
                    {parseFloat(day.main.temp).toFixed(1)}
                  </Text>
                  <Fontisto
                    name={icons[day.weather[0].main]}
                    size={68}
                    color={"white"}/>
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color:"white",
  },
  weather:{},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal:20
  },
  temp: {
    marginTop: 50,
    fontWeight:"600",
    fontSize: 100,
    color:"white"
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight:"500"
  },
  tinyText:{
    fontSize: 25,
    marginTop: -5,
    color:"white",
    fontWeight:"500"
  }
});