// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type RegisterScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'Register'
// >;

// type Props = {
//   navigation: RegisterScreenNavigationProp;
// };

// export default function RegisterScreen({ navigation }: Props) {
//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../../src/assets/images/bgLogin.jpg')}
//         style={styles.backgroundImage}
//       />

//       <View style={styles.card}>
//         <Text style={styles.title}>Đăng Ký</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#888"
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Mật khẩu"
//           placeholderTextColor="#888"
//           secureTextEntry={true}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Xác nhận mật khẩu"
//           placeholderTextColor="#888"
//           secureTextEntry={true}
//         />

//         <TouchableOpacity style={styles.registerButton}>
//           <Text style={styles.registerButtonText}>Đăng ký</Text>
//         </TouchableOpacity>

//         <View style={styles.orContainer}>
//           <View style={styles.line} />
//           <Text style={styles.orText}>hoặc</Text>
//           <View style={styles.line} />
//         </View>

//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="facebook-square" size={20} color="#3b5998" />
//           <Text style={styles.socialButtonText}>Đăng ký với Facebook</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="google-plus" size={20} color={'#db4437'} />
//           <Text style={styles.socialButtonText}>Đăng ký với Google</Text>
//         </TouchableOpacity>
//         <View style={styles.registerContainer}>
//           <Text style={styles.registerText}>Chưa có tài khoản?</Text>
//           <TouchableOpacity
//             style={styles.loginButton}
//             onPress={() => navigation.navigate('Login')}
//           >
//             <Text style={styles.loginButtonText}>Đăng nhập</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   backgroundImage: {
//     ...StyleSheet.absoluteFillObject,
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   card: {
//     backgroundColor: 'rgba(255, 255, 255)',
//     borderRadius: 15,
//     padding: 20,
//     width: '80%',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     fontFamily: 'sans-serif-medium',
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   registerButton: {
//     backgroundColor: '#313335ff',
//     width: '100%',
//     height: 50,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//   },
//   registerButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   orContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 15,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ccc',
//   },
//   orText: {
//     marginHorizontal: 10,
//     color: '#888',
//   },
//   socialButton: {
//     width: '100%',
//     height: 50,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     flexDirection: 'row',
//     gap: 10,
//   },
//   socialButtonText: {
//     fontSize: 16,
//     color: '#333',
//   },

//   loginButton: {
//     // marginTop: 10,
//   },
//   registerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 15,
//     gap: 5,
//   },
//   registerText: {
//     fontSize: 16,
//     color: '#000000ff',
//   },
//   loginButtonText: {
//     fontSize: 16,
//     color: '#007AFF',
//   },
// });
