import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../theme';
import { windowHeight } from '../../common';

const defaultImage = require('../../assets/defaultPlaylist.png');

const PlaylistCard = ({ image, name, trackCount, onPress, onLongPress }) => (
  <TouchableOpacity style={commonStyles.playlistCard} onPress={onPress} onLongPress={onLongPress}>
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
  </TouchableOpacity>
);

export default React.memo(PlaylistCard);
