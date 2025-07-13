import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('権限が必要です', '写真ライブラリへのアクセス権限が必要です');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      Alert.alert('エラー', '画像の選択中にエラーが発生しました');
      return null;
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('権限が必要です', 'カメラへのアクセス権限が必要です');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      Alert.alert('エラー', '写真撮影中にエラーが発生しました');
      return null;
    }
  };

  const showImagePicker = (onImageSelected) => {
    Alert.alert(
      'プロフィール画像を変更',
      '画像を選択する方法を選んでください',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '写真ライブラリ', 
          onPress: async () => {
            const imageUri = await selectImage();
            if (imageUri && onImageSelected) {
              onImageSelected(imageUri);
            }
          }
        },
        { 
          text: 'カメラで撮影', 
          onPress: async () => {
            const imageUri = await takePhoto();
            if (imageUri && onImageSelected) {
              onImageSelected(imageUri);
            }
          }
        },
      ]
    );
  };

  return {
    selectImage,
    takePhoto,
    showImagePicker,
  };
};