import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {downloadFile} from 'react-native-fs';
import {DOWNLOAD_PATH, spotifyGreenButton} from '../common';
import {NEWER_API} from "@env"

const Trial = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text style={{color: 'white'}}>Hello Trial</Text>
      <TouchableOpacity
        style={{
          ...spotifyGreenButton,
        }}
        onPress={() => {
          const path = `${DOWNLOAD_PATH}/trail2.mp3`;
          const ur = `${NEWER_API}/directStream?videoId=kNlY7VKDdno`


  //         fetch(ur, {method : 'GET', headers : {
  //           'Accept': 'audio/webm; codecs="opus"'
  //         }})
  //         .then(response => {
  //           console.log(response)
  //           const reader = response.body.getReader();
  //           const stream = new ReadableStream({
  //             start(controller) {
  //               function push() {
  //                 reader.read().then(({done, value}) => {
  //                   if (done) {
  //                     controller.close();
  //                     return;
  //                   }
  //                   controller.enqueue(value);
  //                   push();
  //                 });
  //               }
  //               push();
  //             }
  //           });
  //           return new Response(stream, { headers: { 'Content-Type': 'audio/webm; codecs="opus"' } });
  //         })
  //         .then(response => response.blob())
  //         .then(blob => {
  //           const url = URL.createObjectURL(blob);
  //           // Use the URL with an audio element to play the audio
  //           console.log("url ::", url)
  //         })
  // .catch(error => console.error(error));



          // let ur = ""
          downloadFile({
            fromUrl: ur,
            toFile: path,
            progressDivider: 2,
            
            begin: (res) => {
              // console.log('Response begin ===\n\n');
              console.log("BEGIN : ", res);
            },
            progress: (res) => {
              //here you can calculate your progress for file download
              console.log("Progress : " ,res);
              let percent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
              console.log(`Downloaded: ${percent}%`);
              // setDownloadPercent(percent);

              //   let size = formatBytes(res.contentLength);
              //   totalBytes = res.contentLength;
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
        }}>
        <Text>Down</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Trial;
