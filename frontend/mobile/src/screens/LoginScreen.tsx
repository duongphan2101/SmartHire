import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const LoginFunc = () => {
    Alert.alert(`Login with ${email} and ${password}`);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../src/assets/images/bgLogin.jpg')}
        style={styles.backgroundImage}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Đăng Nhập</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#888"
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />


        <TouchableOpacity style={styles.loginButton}
          onPress={LoginFunc}
        >
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>hoặc</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Icon name='facebook-square' size={20} color="#3b5998" />
          <Text style={styles.socialButtonText}>Đăng nhập với Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Icon name='google-plus' size={20} />
          <Text style={styles.socialButtonText}>Đăng nhập với Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.signupButtonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#000000ff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
  },
  socialButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    marginTop: 10,
  },
  signupButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});