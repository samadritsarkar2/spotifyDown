import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../theme';

const EmptyState = ({ title, subtitle, actionLabel, onAction }) => (
  <View style={commonStyles.emptyStateContainer}>
    <Text style={commonStyles.emptyStateTitle}>{title}</Text>
    {subtitle && <Text style={commonStyles.emptyStateSubtitle}>{subtitle}</Text>}
    {actionLabel && onAction && (
      <TouchableOpacity style={commonStyles.primaryButton} onPress={onAction}>
        <Text style={commonStyles.primaryButtonText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default EmptyState;
