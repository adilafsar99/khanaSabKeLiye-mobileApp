import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SignUp, SignIn, ResetPassword, Home, NewApplication, VerificationOptions} from '../../screens';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {backgroundColor: "#6a96ff"},
      tabBarLabelStyle: {fontWeight: "bold", fontSize: 16, textTransform: "capitalize"},
      tabBarActiveTintColor: "#98ff6a",
      tabBarInactiveTintColor: "#fff"
    }}
    initialRouteName="NewApplication"
    >
      <Tab.Screen
      name="Home"
      component={Home} 
      />
      <Tab.Screen
      name="NewApplication"
      options={{tabBarLabel: "New Application"}}
      component={NewApplication}
      />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  return(
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Tabs">
    <Stack.Screen
    name="SignUp"
    component={SignUp}
    />
    <Stack.Screen 
    name="SignIn"
    component={SignIn}
    />
    <Stack.Screen 
    name="ResetPassword"
    component={ResetPassword}
    />
    <Stack.Screen 
    name="Tabs"
    component={TabNavigator}
    />
    <Stack.Screen 
    name="VerificationOptions"
    component={VerificationOptions}
    />
  </Stack.Navigator>
    )
}

export default StackNavigator;