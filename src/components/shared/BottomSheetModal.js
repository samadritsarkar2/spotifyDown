import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { commonStyles, colors } from '../../theme';
import { windowWidth } from '../../common';

export const ModalOption = ({ icon, label, onPress }) => (
  <TouchableOpacity style={commonStyles.bottomSheetOption} onPress={onPress}>
    <Image source={icon} style={commonStyles.bottomSheetOptionIcon} />
    <Text style={commonStyles.bottomSheetOptionText}>{label}</Text>
  </TouchableOpacity>
);

const BottomSheetModal = ({ visible, onClose, children }) => (
  <Modal
    isVisible={visible}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    onBackButtonPress={onClose}
    onBackdropPress={onClose}
    onSwipeComplete={onClose}
    swipeDirection={['down']}
    useNativeDriver={true}
    deviceWidth={windowWidth}
    style={commonStyles.bottomSheetOverlay}>
    <View style={commonStyles.bottomSheetContainer}>
      {children}
    </View>
  </Modal>
);

export default BottomSheetModal;
