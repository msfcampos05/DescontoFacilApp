import { StyleSheet, Dimensions } from 'react-native';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius:5,
    marginBottom:15,
    width: (width - 45) / 2,
    
  },

  imageContainer:{
    padding: 10
  },

  image:{
    width:'100%',
    height:100,
    resizeMode:'contain',
    
  },

  separatorContainer:{
    borderTopWidth: 1,
    borderColor:'#C0C0C0',
    marginTop:6,
    padding: 10
  },
  title:{
    textAlign:'center',
    fontWeight:'bold',
    color:'#333'
  },
  price:{
    textAlign:'center',
    color:'#C0C0C0',
    textDecorationLine: 'line-through',
    fontSize:12
  },
  priceOff:{
    textAlign:'center',
    color:'#333',
    fontWeight:'bold',
    fontSize:16,
    color:'#ff5b77'
  }
  
});

export default styles;