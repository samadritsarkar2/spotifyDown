import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { downloadFile } from 'react-native-fs';
import { DOWNLOAD_PATH, spotifyGreenButton } from '../common';
import { getAudioStreamUrl } from '../common/YouTubeExtractor';

const Trial = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>Hello Trial</Text>
      <TouchableOpacity
        style={{
          ...spotifyGreenButton,
        }}
        onPress={async () => {
          try {
            const videoId = 'kNlY7VKDdno';
            const streamInfo = await getAudioStreamUrl(videoId);
            const path = `${DOWNLOAD_PATH}/trail2.mp3`;

            console.log('Stream URL:', streamInfo.url);

            downloadFile({
              fromUrl: streamInfo.url,
              toFile: path,
              progressDivider: 2,

              begin: (res) => {
                console.log("BEGIN : ", res);
              },
              progress: (res) => {
                console.log("Progress : ", res);
                let percent = (res.bytesWritten / res.contentLength) * 100;
                console.log(`Downloaded: ${percent}%`);
              },
            })
              .promise.then(async (res) => {
                if (res && res.statusCode === 200 && res.bytesWritten > 0) {
                  try {
                    console.log('Download Completed');
                  } catch (err) {
                    console.log(err);
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } catch (err) {
            console.log('Error getting stream URL:', err);
          }
        }}>
        <Text>Down</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Trial;
