import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import TextTicker from 'react-native-text-ticker';
import { commonStyles } from '../../theme';

const TrackRow = ({ artwork, title, subtitle, rightElement, onPress, onLongPress, scrollTitle }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress} onLongPress={onLongPress}>
      <View style={commonStyles.trackRow}>
        {artwork ? (
          <Image style={commonStyles.trackArtwork} source={{ uri: artwork }} />
        ) : null}
        <View style={commonStyles.trackDetails}>
          {scrollTitle ? (
            <TextTicker duration={8000} style={commonStyles.trackTitle}>{title}</TextTicker>
          ) : (
            <Text style={commonStyles.trackTitle} numberOfLines={1}>{title}</Text>
          )}
          {subtitle && (
            <Text style={commonStyles.trackSubtitle} numberOfLines={1}>{subtitle}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
    {rightElement}
  </View>
);

export default React.memo(TrackRow);
