import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableNativeFeedback,
  Platform,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function LoginScreen({ navigation }: Props) {
  // State cho đăng nhập
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginShowPassword, setLoginShowPassword] = useState<boolean>(false);

  // State cho đăng ký
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');
  const [registerShowPassword, setRegisterShowPassword] = useState<boolean>(false);
  const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState<boolean>(false);

  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  // Animation setup
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Ref cho các TextInput để kiểm soát focus
  const loginEmailRef = useRef<TextInput>(null);
  const loginPasswordRef = useRef<TextInput>(null);
  const registerEmailRef = useRef<TextInput>(null);
  const registerUsernameRef = useRef<TextInput>(null);
  const registerPasswordRef = useRef<TextInput>(null);
  const registerConfirmPasswordRef = useRef<TextInput>(null);

  const LoginFunc = useCallback(() => {
    Alert.alert(`Đăng nhập với ${loginEmail} và ${loginPassword}`);
    navigation.navigate('Home');
  }, [loginEmail, loginPassword]);

  const ButtonWrapper: React.FC<{
    onPress: () => void;
    children: React.ReactNode;
  }> = ({ onPress, children }) => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('#ffffff', false)}
        >
          <View style={styles.loginButton}>{children}</View>
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} style={styles.loginButton}>
        {children}
      </TouchableOpacity>
    );
  };

  const switchToRegister = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen('register');
      slideAnim.setValue(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        registerEmailRef.current?.focus(); // Giữ focus cho input đầu tiên
      });
    });
  }, [slideAnim]);

  const switchToLogin = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen('login');
      slideAnim.setValue(-1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        loginEmailRef.current?.focus(); // Giữ focus cho input đầu tiên
      });
    });
  }, [slideAnim]);

  const RegisterFunc = () => {
    Alert.alert(`Register with ${registerEmail}, ${registerUsername}`);
    switchToLogin();
  }

  // Đăng ký
  const RegisterContent = () => (
    <View>
      <Text style={styles.registerTitle}>Đăng Ký</Text>

      <TextInput
        ref={registerEmailRef}
        style={styles.registerInput}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        value={registerEmail}
        onChangeText={setRegisterEmail}
        returnKeyType="next"
        onSubmitEditing={() => registerUsernameRef.current?.focus()}
        blurOnSubmit={false}
      />

      <TextInput
        ref={registerUsernameRef}
        style={styles.registerInput}
        placeholder="Tên đăng nhập"
        placeholderTextColor="#888"
        textContentType="username"
        value={registerUsername}
        onChangeText={setRegisterUsername}
        returnKeyType="next"
        onSubmitEditing={() => registerPasswordRef.current?.focus()}
        blurOnSubmit={false}
      />

      <View style={styles.inputContainerRegister}>
        <TextInput
          ref={registerPasswordRef}
          style={styles.inputWithIcon}
          placeholder="Mật khẩu"
          placeholderTextColor="#888"
          secureTextEntry={!registerShowPassword}
          textContentType="password"
          value={registerPassword}
          onChangeText={setRegisterPassword}
          returnKeyType="next"
          onSubmitEditing={() => registerConfirmPasswordRef.current?.focus()}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setRegisterShowPassword(!registerShowPassword)}
        >
          <Icon
            name={registerShowPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainerRegister}>
        <TextInput
          ref={registerConfirmPasswordRef}
          style={styles.inputWithIcon}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor="#888"
          secureTextEntry={!registerShowConfirmPassword}
          textContentType="password"
          value={registerConfirmPassword}
          onChangeText={setRegisterConfirmPassword}
          returnKeyType="done"
          blurOnSubmit={true}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setRegisterShowConfirmPassword(!registerShowConfirmPassword)}
        >
          <Icon
            name={registerShowConfirmPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={RegisterFunc}
      >
        <Text style={styles.registerButtonText}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={styles.registerOrContainer}>
        <View style={styles.registerLine} />
        <Text style={styles.registerOrText}>hoặc</Text>
        <View style={styles.registerLine} />
      </View>

      <TouchableOpacity style={styles.registerSocialButton}>
        <Icon name="facebook-square" size={20} color="#3b5998" />
        <Text style={styles.registerSocialButtonText}>Đăng ký với Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerSocialButton}>
        <Icon name="google-plus" size={20} color={'#db4437'} />
        <Text style={styles.registerSocialButtonText}>Đăng ký với Google</Text>
      </TouchableOpacity>

      <View style={styles.registerSignupContainer}>
        <Text style={styles.registerSignupText}>Đã có tài khoản?</Text>
        <TouchableOpacity
          style={styles.registerSignupButton}
          onPress={switchToLogin}
        >
          <Text style={styles.registerSignupButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../src/assets/images/bgLogin.jpg')}
        style={styles.backgroundImage}
      />

      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-300, 0, 300],
                }),
              },
            ],
          },
        ]}
      >
        {currentScreen === 'login' ? (
          <>
            <Text style={styles.title}>Đăng Nhập</Text>

            <TextInput
              ref={loginEmailRef}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              value={loginEmail}
              onChangeText={setLoginEmail}
              returnKeyType="next"
              onSubmitEditing={() => loginPasswordRef.current?.focus()}
              blurOnSubmit={false}
            />

            <View style={styles.inputContainerLogin}>
              <TextInput
                ref={loginPasswordRef}
                style={styles.inputWithIcon}
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry={!loginShowPassword}
                textContentType="password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setLoginShowPassword(!loginShowPassword)}
              >
                <Icon
                  name={loginShowPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <ButtonWrapper onPress={LoginFunc}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </ButtonWrapper>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>hoặc</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook-square" size={20} color="#3b5998" />
              <Text style={styles.socialButtonText}>Đăng nhập với Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Icon name="google-plus" size={20} color={'#db4437'} />
              <Text style={styles.socialButtonText}>Đăng nhập với Google</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Chưa có tài khoản?</Text>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={switchToRegister}
              >
                <Text style={styles.signupButtonText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <RegisterContent />
        )}
      </Animated.View>
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 8,
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
    fontFamily: 'sans-serif-medium',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  inputContainerLogin: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  inputContainerRegister: {
    position: 'relative',
    marginBottom: 15,
  },
  inputWithIcon: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingRight: 45,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  loginButton: {
    backgroundColor: '#313335ff',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    overflow: 'hidden',
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
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  signupButton: {
    paddingHorizontal: 5,
  },
  signupText: {
    fontSize: 16,
    color: '#000000ff',
  },
  signupButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  registerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  registerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#ffffffff',
  },
  registerButton: {
    backgroundColor: '#313335ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerOrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  registerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  registerOrText: {
    marginHorizontal: 10,
    color: '#888',
  },
  registerSocialButton: {
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
  },
  registerSocialButtonText: {
    fontSize: 16,
    color: '#333',
  },
  registerSignupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  registerSignupButton: {
    paddingHorizontal: 5,
  },
  registerSignupText: {
    fontSize: 16,
    color: '#000000ff',
  },
  registerSignupButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});