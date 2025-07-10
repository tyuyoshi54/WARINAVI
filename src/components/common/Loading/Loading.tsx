import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from './Loading.styles';

export interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color,
  text,
  overlay = false,
}) => {
  const Container = overlay ? View : React.Fragment;
  const containerProps = overlay ? { style: styles.overlay } : {};

  return (
    <Container {...containerProps}>
      <View style={[styles.container, overlay && styles.overlayContent]}>
        <ActivityIndicator 
          size={size} 
          color={color || styles.indicator.color} 
        />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </Container>
  );
};