import React from 'react';
import { View, Image, Text } from 'react-native';
import { commonStyles } from '../../theme';
import { windowHeight } from '../../common';
import PressableScale from './PressableScale';

const defaultImage = require('../../assets/defaultPlaylist.png');

const PlaylistCard = ({ image, name, trackCount, onPress, onLongPress }) => (
  <PressableScale onPress={onPress} onLongPress={onLongPress}>
    <View style={commonStyles.playlistCard}>
      <View style={{ flex: 1, flexDirection: 'row', height: windowHeight * 0.07 }}>
        <Image
          style={commonStyles.playlistCardImage}
          source={image ? Image.resolveAssetSource({ uri: image }) : defaultImage}
        />
        <View style={{ flex: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={commonStyles.playlistCardName}>{name}</Text>
          {trackCount != null && (
            <Text style={commonStyles.playlistCardCount}>{trackCount}</Text>
          )}
        </View>
      </View>
    </View>
  </PressableScale>
);

export default React.memo(PlaylistCard);
